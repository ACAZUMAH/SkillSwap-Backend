import { Socket } from "socket.io";
import * as services from "../services/chats";
import logger from "src/loggers/logger";
import { NewMessageInput, TypingData, videoData } from "src/common/interfaces";
import { sendPushNotification } from "src/services/notifications/web-push";
import { getUserSubscription } from "src/services/pushSub";
import { getUserById } from "src/services/user";
import { isDevelopment } from "src/common/constants";

/**
 * Handles a new socket connection.
 * @param socket Socket instance
 */
export const connection = (socket: Socket) => {
  const userId = socket.handshake.auth.userId as string;
  logger.info(`User ${userId} connected with socket ID: ${socket.id}`);
  global.socket = socket;
  global.userSocketMap.set(userId, socket.id);

  socket.emit("online-users", Array.from(global.onlineUsers.keys()));

  socket.on("add-online-user", (userId) => addOnlineUser(socket, userId));

  socket.on("typing", ({ to, chatId }) => sendTyping(socket, { to, chatId }));

  socket.on("stopped-typing", ({ to, chatId }) =>
    sendStoppedTyping(socket, { to, chatId })
  );

  socket.on("sendMessage", (message) => sendMessage(socket, message));

  socket.on("outgoing-call", (data) => sendVideoCall(socket, data));

  socket.on("accept-incoming-call", ({ id }) => AcceptVideoCall(socket, id));

  socket.on("reject-incoming-call", ({ id }) => rejectVideoCall(socket, id));

  socket.on("disconnect", () => disconnection(socket));
};

/**
 * Handles a socket disconnection.
 * @param socket - Socket instance
 */
const disconnection = (socket: Socket) => {
  const userId = Array.from(global.userSocketMap.entries()).find(
    ([_, id]) => id === socket.id
  )?.[0];
  if (userId) {
    userSocketMap.delete(userId);
    global.onlineUsers.delete(userId);
    socket.broadcast.emit("user-offline", { userId });
  }
};

/**
 * Handles adding a user to the online users list.
 * @param socket - Socket instance
 * @param userId - ID of the user who came online
 */
const addOnlineUser = (socket: Socket, userId: string) => {
  global.onlineUsers.set(userId, socket.id);
  logger.info(`User ${userId} is online with socket ID: ${socket.id}`);
  socket.broadcast.emit("user-online", { userId });
};

/**
 * Handles sending typing notifications to the receiver.
 * @param socket - Socket instance
 * @param data - Typing data including sender and chat ID
 */
const sendTyping = (socket: Socket, data: TypingData) => {
  const from = socket.handshake.auth.userId as string;
  const toSocketId = global.onlineUsers.get(data.to);
  if (toSocketId) {
    socket.to(toSocketId).emit("typing", { from, chatId: data.chatId });
  }
};

/**
 * Handles sending stopped typing notifications to the receiver.
 * @param socket - Socket instance
 * @param data - Typing data including sender and chat ID
 */
const sendStoppedTyping = (socket: Socket, data: TypingData) => {
  const from = socket.handshake.auth.userId as string;
  const toSocketId = global.onlineUsers.get(data.to);
  if (toSocketId) {
    socket.to(toSocketId).emit("stopped-typing", { from, chatId: data.chatId });
  }
};

/**
 * Handles sending a message from one user to another.
 * @param socket - Socket instance
 * @param message - New message input data
 */
const sendMessage = async (socket: Socket, message: NewMessageInput) => {
  const sender = global.onlineUsers.get(message.from);
  const receiver = global.onlineUsers.get(message.to);
  const receiverOnline = global.onlineUsers.get(message.to);

  const newMessage = await services.upsertMessage({ ...message });

  if (newMessage) {
    if (receiverOnline) {
      socket.to(receiverOnline).emit("receivedMessage", {
        chatId: newMessage._id.toString(),
        message: newMessage.recentMessage,
      });
    } else {
      if (receiver) {
        socket.to(receiver).emit("receivedMessage", {
          chatId: newMessage._id.toString(),
          message: newMessage.recentMessage,
        });
      }
    }
    if (sender) {
      socket.emit("sentMessage", {
        chatId: newMessage._id.toString(),
        message: newMessage.recentMessage,
      });
    }

    const user = await getUserById(message.from);
    await sendPushNotification(message.to, {
      title: user.firstName!,
      body: "Sent you a new message",
      url: isDevelopment
        ? '"http://localhost:5173"'
        : "https://mini-skill-swap.netlify.app",
    });
  }
};

/**
 * Handles sending a video call to a receiver.
 * @param socket - Socket instance
 * @param data - Video call data including sender, receiver, type, roomId, users, and chatId
 */
const sendVideoCall = (socket: Socket, data: videoData) => {
  const receiverSocket = global.onlineUsers.get(data.to);
  if (receiverSocket) {
    socket.to(receiverSocket).emit("incoming-call", {
      from: data.from,
      type: data.type,
      roomId: data.roomId,
      users: data.users,
      chatId: data.chatId,
    });
    logger.info(
      `Video call from ${data.from.id} to ${data.to} in room ${data.roomId}`
    );
  }
};

/**
 * Handles acceptance of an incoming video call.
 * @param socket - Socket instance
 * @param id - ID of the user who initiated the call
 */
const AcceptVideoCall = (socket: Socket, id: string) => {
  const senderSocket = global.onlineUsers.get(id);
  if (senderSocket) {
    socket.to(senderSocket).emit("call-accepted");
  }
};

/**
 * Handles rejection of an incoming video call.
 * @param socket - Socket instance
 * @param id - ID of the user who initiated the call
 */
const rejectVideoCall = (socket: Socket, id: string) => {
  const senderSocket = global.onlineUsers.get(id);
  if (senderSocket) {
    socket.to(senderSocket).emit("call-rejected");
    logger.info(`Video call rejected`);
  }
};
