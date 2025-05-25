import {
  GraphqlContext,
  MutationAcceptOrDeclineSwapRequestArgs,
  MutationCreateSwapRequestArgs,
  QueryGetRequestedSwapsArgs,
  QueryGetSwapRequestsArgs,
  swapDocument,
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

const getSwapRequests = async (_: any, args: QueryGetSwapRequestsArgs, { user }: GraphqlContext) => {
  return await services.getSwapRequests({ receiverId: user._id, ...args?.filter });
};

const getRequestedSwaps = async (_: any, args: QueryGetRequestedSwapsArgs, { user }: GraphqlContext) => {
  return await services.getSwapRequests({ senderId: user._id, ...args?.filter });
};

const id = (parent: swapDocument) => parent._id.toString();

const sender = (parent: swapDocument, _: any,  { userLoader }: GraphqlContext ) => {
  return parent.senderId ? userLoader.load(parent.senderId.toString()) : null;
}

const receiver = (parent: swapDocument, _: any, { userLoader }: GraphqlContext) => {
  return parent.receiverId ? userLoader.load(parent.receiverId.toString()) : null;
}

export const swapResolver = {
  Query: {
    getSwapRequests,
    getRequestedSwaps,
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
