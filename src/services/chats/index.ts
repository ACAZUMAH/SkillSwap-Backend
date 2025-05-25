import { chatModel } from "src/models/chats";
import createError from "http-errors";
import { Types } from "mongoose";

export const createChat = async (data: any) => {
  if (
    !Types.ObjectId.isValid(data.sender) ||
    !Types.ObjectId.isValid(data.receiver)
  ) {
    throw createError(400, "Invalid sender or receiver ID");
  }
  return await chatModel.create({
    users: [{ sender: data.sender, receiver: data.receiver }],
  });
};

export const upsertMessage = async (data: any) => {
  const { chatId, message } = data;
  if (!Types.ObjectId.isValid(chatId))
    throw createError(400, "Invalid chat ID");

  const msg = await chatModel.findOneAndUpdate(
    { _id: chatId },
    { $push: { messages: message } },
    { new: true }
  );

  if (!msg) throw createError(404, "Chat not found");

  return msg;
};

export const getChatById = async (chatId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(chatId)) {
    throw createError(400, "Invalid chat ID");
  }
  const chat = await chatModel
    .findById(chatId)
    .populate("users.sender", "id firstName lastName email profile_img")
    .populate("users.receiver", "id firstName lastName email profile_img")
    .lean();

  if (!chat) {
    throw createError(404, "Chat not found");
  }
  
  return chat;
};
