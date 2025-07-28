import { chatModel } from "src/models/chats";
import createError from "http-errors";
import { Types } from "mongoose";
import { ChatInput } from "src/common/interfaces";
import { MessagesStatus } from "src/common/enums";
import { pubsub, SUBSCRIPTION_EVENTS } from "src/common/pubsub";

/**
 * create a new chat between two users
 *
 * @param {Object} data - Contains sender and receiver IDs
 * @returns - The created chat document
 */
export const createChat = async (data: any) => {
  if (
    !Types.ObjectId.isValid(data.sender) ||
    !Types.ObjectId.isValid(data.receiver)
  ) {
    throw createError(400, "Invalid sender or receiver ID");
  }
  return await chatModel.create({
    users: { senderId: data.sender, receiverId: data.receiver },
  });
};

/**
 * get messages by chat ID
 *
 * @param {getMessages} data - Contains chatId, from, and to fields
 * @returns- The chat document with messages
 */
export const upsertMessage = async (data: ChatInput) => {
  if (!Types.ObjectId.isValid(data.chatId!))
    throw createError(400, "Invalid chat ID");

  const msg = await chatModel.findOneAndUpdate(
    { _id: data.chatId },
    { $push: { messages: data.message }, recentMessage: data.message },
    { new: true, upsert: true }
  );

  pubsub.publish(SUBSCRIPTION_EVENTS.NEW_MESSAGE, {
    UreadMessagesCount: await getUnreadMessagesCount(msg.users.receiverId),
  })

  if (!msg) throw createError(404, "Chat not found");

  return msg;
};

/**
 * get a chat by its ID
 *
 * @param {string | Types.ObjectId} chatId - The ID of the chat to retrieve
 * @returns - The chat document
 */
export const getChatById = async (chatId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(chatId)) {
    throw createError(400, "Invalid chat ID");
  }
  const chat = await chatModel.findById(chatId);

  if (!chat) {
    throw createError(404, "Chat not found");
  }

  return chat;
};

/**
 * get all chats by user ID
 *
 * @param {string | Types.ObjectId} userId - The ID of the user to retrieve chats for
 * @returns - An array of chat documents
 */
export const getAllChatsByUserId = async (userId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw createError(400, "Invalid user ID");
  }

  const chats = await chatModel
    .find({
      $or: [{ "users.senderId": userId }, { "users.receiverId": userId }],
    })
    .sort({ updatedAt: -1 });

  if (!chats || chats.length === 0) {
    return [];
  }

  return chats;
};

/**
 *  update unread messages status
 *
 * @param {string | Types.ObjectId} chatId - The ID of the chat to update
 * @param {Array<string | Types.ObjectId>} messageIds - The IDs of the messages to mark as read
 * @returns - The updated chat document
 */
export const updateUreadMessages = async (chatId: string | Types.ObjectId,messageIds: Types.ObjectId[]): Promise<object> => {
  if (!Types.ObjectId.isValid(chatId)) {
    throw createError(400, "Invalid chat ID");
  }

  const updatedChat = await chatModel.findByIdAndUpdate(
    { _id: chatId, messages: { $in: messageIds } },
    { $set: { "messages.$[].status": MessagesStatus.READ } },
    { new: true }
  );

  pubsub.publish(SUBSCRIPTION_EVENTS.NEW_MESSAGE, {
    UreadMessagesCount: await getUnreadMessagesCount(updatedChat?.users?.receiverId!),
  });

  if (!updatedChat) {
    throw createError(404, "Chat not found");
  }
  return updatedChat;
};

/**
 * Search messages in a chat by a search term
 * @param chatId - The ID of the chat to search in
 * @param searchTerm - The term to search for in messages
 * @returns - The chat document with messages that match the search term
 */
export const searchMesages = async (chatId: string | Types.ObjectId,searchTerm: string) => {
  if (!Types.ObjectId.isValid(chatId)) {
    throw createError(400, "Invalid chat ID");
  }

  const chat = await chatModel.findById(chatId);

  if (!chat) {
    throw createError(404, "Chat not found");
  }

  const messages = chat.messages.filter(
    (message) => message.message && message.message.includes(searchTerm)
  );

  return { ...chat.toObject(), messages };
};

/**
 * Get the count of unread messages for a user
 * @param userId - The ID of the user to get unread messages count for
 * @returns - The count of unread messages
 */
export const getUnreadMessagesCount = async (userId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(userId)) {
    throw createError(400, "Invalid user ID");
  }

  const chats = await chatModel.aggregate([
    {
      $match: {
        $or: [{ "users.senderId": userId }, { "users.receiverId": userId }],
      },
    },
    { $unwind: "$messages" },
    {
      $match: {
        "messages.status": MessagesStatus.SENT,
        "messages.senderId": { $ne: new Types.ObjectId(userId) },
      },
    },
    {
      $group: {
        _id: "$_id",
        chatId: { $first: "$_id" },
        unreadCount: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        chatId: 1,
        unreadCount: 1,
      },
    },
  ]);

  return chats
};
