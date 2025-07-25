import { GetMessages, NewMessageInput } from "src/common/interfaces";
import { getChatById, updateUreadMessages, upsertMessage } from "../chats";
import { MessagesStatus } from "src/common/enums";
import createError from "http-errors";
import { Types } from "mongoose";

export const addNewMessage = async (data: NewMessageInput) => {
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


export const getMessagesByChatId = async (data: GetMessages) => {
  const { chatId, from, to } = data

  const chat = await getChatById(chatId)

  const unreadMessages: Types.ObjectId[] = []

  chat.messages.forEach((message, index) => {
    if(message.status !== MessagesStatus.READ && message.sender._id === to){
      chat.messages[index].status = MessagesStatus.READ
      unreadMessages.push(message._id)
    }
  })

  await updateUreadMessages(chatId, unreadMessages)

  return chat
}