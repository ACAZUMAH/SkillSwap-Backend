import { chatModel } from "src/models/chats";
import createError from "http-errors";
import { Types } from "mongoose";
import { ChatInput, GetMessages } from "src/common/interfaces";
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
  if (!Types.ObjectId.isValid(data.chatId)) throw createError(400, "Invalid chat ID");

  const onlineReciever = onlineUsers.get(data.to);

  const message = onlineReciever
    ? { ...data.message, status: MessagesStatus.DELIVERED }
    : { ...data.message, status: MessagesStatus.SENT };

  const msg = await chatModel.findOneAndUpdate(
    { _id: data.chatId },
    { $push: { messages: message }, recentMessage: message },
    { new: true, upsert: true }
  );

  pubsub.publish(SUBSCRIPTION_EVENTS.NEW_MESSAGE, {
    UreadMessagesCount: await getUnreadMessagesCount(
      new Types.ObjectId(data.to)
    ),
    userId: data.to.toString(),
  });

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
  if (!Types.ObjectId.isValid(chatId)) throw createError(400, "Invalid chat ID");

  const chat = await chatModel.findById(chatId);

  if (!chat) throw createError(404, "Chat not found");

  return chat;
};

/**
 * get all chats by user ID
 *
 * @param {string | Types.ObjectId} userId - The ID of the user to retrieve chats for
 * @returns - An array of chat documents
 */
export const getAllChatsByUserId = async (userId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(userId)) throw createError(400, "Invalid user ID");

  const chats = await chatModel
    .find({
      $or: [{ "users.senderId": userId }, { "users.receiverId": userId }],
    })
    .sort({ updatedAt: -1 });

  return chats;
};

/**
 * Update message status to READ for a user in a chat
 * @param data - Contains chatId and userId to update message status
 * @returns - The updated chat document
 */
export const getUpdatedMessages = async (data: GetMessages) => {
  const { chatId, userId } = data;
  if (!Types.ObjectId.isValid(chatId) || !Types.ObjectId.isValid(userId)) {
    throw createError(400, "Invalid chat ID or user ID");
  }
  const chat = await chatModel.findById(chatId);

  if (!chat) throw createError(404, "Chat not found");

  const unreadMessageIds: Types.ObjectId[] = [];

  chat.messages.forEach((message) => {
    if (
      message.status !== MessagesStatus.READ &&
      message.senderId?.toString() !== userId?.toString()
    ) {
      unreadMessageIds.push(message._id);
    }
  });

  if (unreadMessageIds.length > 0) {
    await chatModel.findOneAndUpdate(
      { _id: chatId },
      { $set: { "messages.$[elem].status": MessagesStatus.READ } },
      {
        arrayFilters: [
          {
            "elem._id": { $in: unreadMessageIds },
            "elem.senderId": { $ne: new Types.ObjectId(userId) },
          },
        ],
        new: true,
      }
    );
  }

  pubsub.publish(SUBSCRIPTION_EVENTS.NEW_MESSAGE, {
    UreadMessagesCount: await getUnreadMessagesCount(userId),
    userId: userId.toString(),
  });
  console.log("New message published for user:", userId.toString());

  const updatedChat = await chatModel.findById(chatId);
  return updatedChat;
};

/**
 * Get the count of unread messages for a user
 * @param userId - The ID of the user to get unread messages count for
 * @returns - The count of unread messages
 */
export const getUnreadMessagesCount = async (userId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(userId))
    throw createError(400, "Invalid user ID");

  const chats = await chatModel.aggregate([
    {
      $match: {
        $or: [{ "users.senderId": userId }, { "users.receiverId": userId }],
      },
    },
    {
      $addFields: {
        unreadMessages: {
          $filter: {
            input: "$messages",
            cond: {
              $and: [
                {
                  $in: [
                    "$$this.status",
                    [MessagesStatus.SENT, MessagesStatus.DELIVERED],
                  ],
                },
                { $ne: ["$$this.senderId", userId] },
              ],
            },
          },
        },
      },
    },
    { $project: { 
        _id: 0, 
        chatId: "$_id", 
        unreadCount: { $size: "$unreadMessages" } 
      } 
    },
  ]);

  console.log(chats);

  return chats;
};
