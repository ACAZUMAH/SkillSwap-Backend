import {
  ChatDocument,
  GraphqlContext,
  MutationUpsertMessageArgs,
  QueryAllChatsArgs,
} from "src/common/interfaces";
import { getAllChatsByUserId } from "src/services/chats";
import { addNewMessage } from "src/services/messaging";

const id = (parent: ChatDocument) => parent._id.toString();

const allChats = (_: any, __args: QueryAllChatsArgs, { user }: GraphqlContext) => {
  return getAllChatsByUserId(user._id);
};

const upsertMessage = async (_: any, args: MutationUpsertMessageArgs, { user }: GraphqlContext) => {
  return addNewMessage({
    ...args.data,
    from: user._id,
    to: args.data.users.receiver.toString(),
  });
};

export const chatResolver = {
  Query: {
    allChats,
  },
  Chat: {
    id,
  },
  Mutation: {
    upsertMessage,
  },
};
