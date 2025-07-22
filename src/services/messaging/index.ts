import { newMessageInput } from "src/common/interfaces";
import { upsertMessage } from "../chats";
import { MessagesStatus } from "src/common/enums";
import createError from "http-errors";

export const addNewMessage = async (data: newMessageInput) => {
  const { from, to, chatId, message, users } = data;

  const onlineReciever = onlineUsers.get(to);

  const msg = onlineReciever
    ? {
        ...message,
        status: MessagesStatus.DELIVERED,
      }
    : {
        ...message,
        status: MessagesStatus.SENT,
      };

  const newMessage = await upsertMessage({ chatId, message: msg, users });

  if (!newMessage) {
    throw createError(404, "Chat not found");
  }

  return newMessage;
};
