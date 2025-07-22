import {
  ChatDocument,
  GraphqlContext,
  QueryAllChatsArgs,
} from "src/common/interfaces";
import { getAllChatsByUserId } from "src/services/chats";

const id = (parent: ChatDocument) => parent._id.toString();

const allChats = async (_: any, __args: QueryAllChatsArgs,{ user }: GraphqlContext) => {
  return getAllChatsByUserId(user._id);
};

export const chatResolver = {
  Query: {
    allChats,
  },
  Chat: {
    id,
  },
};
