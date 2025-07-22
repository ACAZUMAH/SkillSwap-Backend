import { Socket } from "socket.io";
import * as services from "../services/chats";
import logger from "src/loggers/logger";
import { ChatInput } from "src/common/interfaces";

const disconnection = (socket: Socket, userSocketMap: Map<string, string>) => {
  logger.info(`User ${socket.id} disconnected`);
  const userId = Array.from(userSocketMap.entries()).find(
    ([_, id]) => id === socket.id
  )?.[0];
  if (userId) {
    userSocketMap.delete(userId);
    logger.info(`User ${userId} disconnected`);
  }
};

const sendMessage = async (socket: Socket, userSocketMap: Map<string, string>, message: ChatInput) => {
  const senderId = userSocketMap.get(message.users?.sender!.toString());
  const receiverId = userSocketMap.get(message.users?.receiver!.toString());

  const msg = await services.upsertMessage(message);

  const returnChat = await services.getChatById(msg._id);

  if (receiverId) {
    socket.to(receiverId).emit("receiveMessage", returnChat);
  }

  if (senderId) {
    socket.to(senderId).emit("messageSent", returnChat);
  }
};

export const connection = (socket: Socket, userSocketMap: Map<string, string>) => {
  const userId = socket.handshake.query.userId as string;
  console.log(`User connected with ID: ${userId}`);
  if (userId) {
    userSocketMap.set(userId, socket.id);
    logger.info(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  socket.on("sendMessage", (message) => sendMessage(socket, userSocketMap, message));

  socket.on("disconnect", () => disconnection(socket, userSocketMap));
};
