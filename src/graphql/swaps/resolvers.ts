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

const createSwapRequest = (_: any, args: MutationCreateSwapRequestArgs, { user }: GraphqlContext) => {
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
};
