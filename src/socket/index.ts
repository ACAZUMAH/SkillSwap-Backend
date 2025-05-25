import { Socket } from "socket.io";
import * as services from "../services/chats";

const disconnection = (socket: Socket, userSocketMap: Map<string, string>) => {
  console.log(`User ${socket.id} disconnected`);
  const userId = Array.from(userSocketMap.entries()).find(
    ([_, id]) => id === socket.id
  )?.[0];
  if (userId) {
    userSocketMap.delete(userId);
    console.log(`User ${userId} disconnected`);
  }
};

const sendMessage = async (socket: Socket, userSocketMap: Map<string, string>, message: any) => {
  const senderId = userSocketMap.get(message.sender);
  const receiverId = userSocketMap.get(message.receiver);

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
  if (userId) {
    userSocketMap.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
  }

  socket.on("sendMessage", (message) => sendMessage(socket, userSocketMap, message));

  socket.on("disconnect", () => disconnection(socket, userSocketMap));
};
