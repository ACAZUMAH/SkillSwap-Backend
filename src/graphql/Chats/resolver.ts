import { withFilter } from "graphql-subscriptions";
import {
  ChatDocument,
  GraphqlContext,
  MutationUpsertMessageArgs,
  QueryAllChatsArgs,
  QueryGetMessagesArgs,
  SubscriptionGetChatByUserIdArgs,
} from "src/common/interfaces";
import { pubsub, SUBSCRIPTION_EVENTS } from "src/common/pubsub";
import { getAllChatsByUserId } from "src/services/chats";
import { addNewMessage, getMessagesByChatId } from "src/services/messaging";

const id = (parent: ChatDocument) => parent._id.toString();

const allChats =  (_: any, __args: QueryAllChatsArgs, { user }: GraphqlContext) => {
  return getAllChatsByUserId(user._id);
};

const upsertMessage = (_: any, args: MutationUpsertMessageArgs, { user }: GraphqlContext) => {
  return addNewMessage({
    ...args.data,
    from: user._id,
    to: args.data.users.receiver.toString(),
  });
};

const getMessages = (_:any, args: QueryGetMessagesArgs) => {
  return getMessagesByChatId({ ...args.data })
}

const getChatByUserId = async (_: any, args: SubscriptionGetChatByUserIdArgs, { user }: GraphqlContext) => {
  return getAllChatsByUserId(args.userId || user._id);
};

const newChatCreated = {
  subscribe: withFilter(
    () => { 
      console.log("newChatCreated: subscribed")
      return pubsub.asyncIterableIterator(SUBSCRIPTION_EVENTS.CHAT_CREATED)
    },
    (payload, variables) => {
      console.log("payload userId", payload?.userId);
      console.log("variables userId", variables.userId);
      if(!payload || !payload.userId) return false;
      return payload && payload.userId === variables.userId;
    }
  ),
  resolve: (payload: any) => { 
    console.log("newChatCreated payload", payload?.newChatCreated);
    if (!payload || !payload.swapUpdated) return null;
    return payload?.newChatCreated;
  },
};

export const chatResolver = {
  Query: {
    allChats,
    getChatByUserId,
    getMessages,
  },
  Chat: {
    id,
  },
  Mutation: {
    upsertMessage,
  },
  Subscription: {
    getChatByUserId,
    newChatCreated,
  }
};
