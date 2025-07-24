import {
  GraphqlContext,
  MutationAcceptOrDeclineSwapRequestArgs,
  MutationCreateSwapRequestArgs,
  QueryGetRequestedSwapsArgs,
  QueryGetSwapByUsersArgs,
  QueryGetSwapRequestArgs,
  QueryGetSwapRequestsArgs,
  SwapDocument,
} from "src/common/interfaces";
import * as services from "src/services/swaps";
import { pubsub, SUBSCRIPTION_EVENTS } from "src/common/pubsub";
import { withFilter } from "graphql-subscriptions";

const createSwapRequest = async (_: any, args: MutationCreateSwapRequestArgs, { user }: GraphqlContext) => {
  return services.upsertSwapRequest({ ...args?.input, senderId: user._id });
};

const cancelSwapRequest = ( _: any, args: MutationCreateSwapRequestArgs, { user }: GraphqlContext) => {
  return services.cancelSwapRequest({ ...args?.input, senderId: user._id });
};

const acceptOrDeclineSwapRequest = (_: any, args: MutationAcceptOrDeclineSwapRequestArgs, { user }: GraphqlContext) => {
  return services.acceptOrDeclineSwapRequest({ userId: user._id, ...args?.input });
};

const getSwapRequests = (_: any, args: QueryGetSwapRequestsArgs, { user }: GraphqlContext) => {
  return services.getSwapRequests({ receiverId: user._id, ...args?.filter });
};

const getRequestedSwaps = (_: any, args: QueryGetRequestedSwapsArgs, { user }: GraphqlContext) => {
  return services.getSwapRequests({ senderId: user._id, ...args?.filter });
};

const getSwapRequest = (_: any, args: QueryGetSwapRequestArgs) => {
  return services.getSwapById(args.swapId);
}

const getSwapByUsers = async (_: any, args: QueryGetSwapByUsersArgs) => {
  return services.getSwapByUserIds({ ...args.data! })
}


const sender = (parent: SwapDocument, _: any,  { userLoader }: GraphqlContext ) => {
  return parent.senderId ? userLoader.load(parent.senderId.toString()) : null;
}

const receiver = (parent: SwapDocument, _: any, { userLoader }: GraphqlContext) => {
  return parent.receiverId ? userLoader.load(parent.receiverId.toString()) : null;
}

const id = (parent: SwapDocument) => parent._id.toString();

const swapUpdated = {
  subscribe: withFilter(
    () => {
      console.log("swapUpdated: subscribed");
      return pubsub.asyncIterableIterator(SUBSCRIPTION_EVENTS.SWAP_UPDATED)
    },
    (payload, variables) => {
      console.log("payload userId", payload?.userId);
      console.log("variables userId", variables.userId);
      if (!payload || !payload.userId) return false;
      return payload.userId === variables.userId;
    }
  ),
  resolve: (payload: any) => {
    console.log("swapUpdated payload", payload?.swapUpdated);
    if (!payload || !payload.swapUpdated) return null;
    return payload?.swapUpdated;
  }
}

const newSwapRequest = {
  subscribe: withFilter(
    () => {
      console.log("newSwapRequest: subscribed");
      return pubsub.asyncIterableIterator(SUBSCRIPTION_EVENTS.NEW_SWAP_REQUEST)
    },
    (payload, variables) => {
      console.log("payload userId", payload?.userId);
      console.log("variables userId", variables.userId);
      if (!payload || !payload.userId) return false; 
      return payload.userId === variables.userId;
    }
  ),
  resolve: (payload: any) => {
    console.log("newSwapRequest payload", payload?.newSwapRequest);
    return payload?.newSwapRequest || null;
  }
}

export const swapResolver = {
  Query: {
    getSwapRequests,
    getRequestedSwaps,
    getSwapRequest,
    getSwapByUsers,
  },

  Swap : {
    id,
    sender,
    receiver,
  },

  Mutation: {
    createSwapRequest,
    cancelSwapRequest,
    acceptOrDeclineSwapRequest,
  },

  Subscription: {
    newSwapRequest,
    swapUpdated,
  },
};
