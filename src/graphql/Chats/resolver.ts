import { withFilter } from "graphql-subscriptions";
import {
  ChatDocument,
  GraphqlContext,
  MutationUpsertMessageArgs,
  QueryAllChatsArgs,
  QueryGetChatByUserIdArgs,
  QueryGetMessagesArgs,
  UnreadMessages,
} from "src/common/interfaces";
import { pubsub, SUBSCRIPTION_EVENTS } from "src/common/pubsub";
import logger from "src/loggers/logger";
import * as services from "src/services/chats";
import { chatUsersResolver } from "./chatUsers.resolver";
import { ChatMessageResolvers } from "./chatMessages.resolver";

const id = (parent: ChatDocument) => parent._id.toString();

const allChats = (_: any, __args: QueryAllChatsArgs, { user }: GraphqlContext) => {
  return services.getAllChatsByUserId(user._id);
};

const upsertMessage = (_: any, args: MutationUpsertMessageArgs, { user }: GraphqlContext) => {
  return services.upsertMessage({ ...args.data, to: args.data.users.receiverId });
};

const getMessages = (_: any, args: QueryGetMessagesArgs, { user }: GraphqlContext) => {
  return services.getUpdatedMessages({chatId: args.data.chatId, userId: user._id });
};

const getChatByUserId = async (_: any, args:QueryGetChatByUserIdArgs, { user }: GraphqlContext) => {
  return services.getAllChatsByUserId(args.userId || user._id);
};

const getUnreadMessagesCount = async (_: any, __: any, { user }: GraphqlContext) => {
  return services.getUnreadMessagesCount(user._id);
}

const newChatCreated = {
  subscribe: withFilter(
    () => {
      logger.info("new chat update subscription started");
      return pubsub.asyncIterableIterator(SUBSCRIPTION_EVENTS.CHAT_CREATED);
    },
    (payload, variables) => {
      return payload && payload.userId === variables.userId;
    }
  ),
  resolve: (payload: any) => {
    return payload.newChatCreated;
  },
};

const unreadMessagesCount = {
  subscribe: withFilter(
    () => {
      logger.info("UreadMessagesCount subscription started");
      return pubsub.asyncIterableIterator(SUBSCRIPTION_EVENTS.NEW_MESSAGE);
    },
    (payload, variables) => {
      return payload.userId === variables.userId;
    }
  ),
  resolve: (payload: any) => {
    return payload.UreadMessagesCount;
  },
};

const chatId = (parent: UnreadMessages) => parent.chatId.toString();

export const chatResolver = {
  ...chatUsersResolver,
  ...ChatMessageResolvers,
  Query: {
    allChats,
    getChatByUserId,
    getMessages,
    getUnreadMessagesCount
  },

  Chat: {
    id,
  },

  UnreadCount: {
    chatId,
  },

  Mutation: {
    upsertMessage,
  },

  Subscription: {
    newChatCreated,
    unreadMessagesCount,
  },
};
