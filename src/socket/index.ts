import { Socket } from "socket.io";
import * as services from "../services/chats"
import logger from "src/loggers/logger";
import { NewMessageInput, videoData } from "src/common/interfaces";

const disconnection = (socket: Socket) => {
  logger.info(`User ${socket.id} disconnected`);
  const userId = Array.from(global.userSocketMap.entries()).find(
    ([_, id]) => id === socket.id
  )?.[0];
  if (userId) {
    userSocketMap.delete(userId);
    logger.info(`User ${userId} disconnected`);
  }
};

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
        message:  newMessage.recentMessage,
      });
    }
  }
};

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
    logger.info(`Video call from ${data.from.id} to ${data.to} in room ${data.roomId}`);
  }
}

const AcceptVideoCall = (socket: Socket, id: string) => {
  const senderSocket = global.onlineUsers.get(id);
  if(senderSocket){
    socket.to(senderSocket).emit("call-accepted")
  }
}

const rejectVideoCall = (socket: Socket, id: string) => { 
  const senderSocket = global.onlineUsers.get(id);
  if (senderSocket) {
    socket.to(senderSocket).emit("call-rejected");
    logger.info(`Video call rejected`);
  }
}

export const connection = (socket: Socket) => {
  const userId = socket.handshake.auth.userId as string;
  logger.info(`User ${userId} connected with socket ID: ${socket.id}`);
  global.socket = socket;
  global.userSocketMap.set(userId, socket.id);

  socket.on("add-online-user", (userId: string) => {
    global.onlineUsers.set(userId, socket.id);
    logger.info(`User ${userId} is online with socket ID: ${socket.id}`);
  });

  socket.on("sendMessage", (message) => sendMessage(socket, message));

  socket.on("outgoing-call", (data) => sendVideoCall(socket, data));

  socket.on("accept-incoming-call", ({ id }) => AcceptVideoCall(socket, id));

  socket.on("reject-incoming-call", ({ id }) => rejectVideoCall(socket, id));

  socket.on("disconnect", () => disconnection(socket));
};
