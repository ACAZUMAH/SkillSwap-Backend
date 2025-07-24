import { FilterQuery, QueryOptions, Types } from "mongoose";
import {
  AcceptOrDeclineSwap,
  Request,
  swapByUsers,
  SwapDocument,
  SwapRequest,
  updateSwapData,
} from "src/common/interfaces";
import createError from "http-errors";
import { swapModel } from "src/models";
import {
  getPageConnection,
  getSanitizeLimit,
  getSanitizeOffset,
  getSanitizePage,
} from "src/common/helpers";
import { createChat } from "../chats";
import { pubsub, SUBSCRIPTION_EVENTS } from "src/common/pubsub";

/**
 * Creates a swap request between two users.
 * @param data - The input data for creating a swap request.
 * @param data.senderId - The ID of the user sending the swap request.
 * @param data.receiverId - The ID of the user receiving the swap request.
 * @returns The created swap request.
 */
export const upsertSwapRequest = async (data: SwapRequest) => {
  if (
    !(
      Types.ObjectId.isValid(data.senderId) &&
      Types.ObjectId.isValid(data.receiverId)
    )
  ) {
    throw createError.BadRequest("Invalid user ids");
  }

  const info: Record<string, any> = {
    senderId: data.senderId,
    receiverId: data.receiverId,
  };

  const newSwap = await swapModel.findOneAndUpdate(
    { senderId: data.senderId, receiverId: data.receiverId },
    { ...info },
    {
      upsert: true,
      new: true,
    }
  );
  
  await pubsub.publish(SUBSCRIPTION_EVENTS.NEW_SWAP_REQUEST, {
    newSwapRequest: newSwap,
    userId: newSwap?.receiverId.toString(),
    senderId: newSwap?.senderId.toString(),
    receiverId: newSwap?.receiverId.toString(),
  });

  return newSwap;
};

/**
 * Cancels a swap request for a user.
 * @param userId - The ID of the user whose swap request is to be canceled.
 * @returns The canceled swap request.
 */
export const cancelSwapRequest = async (filter: Request) => {
  if (
    !Types.ObjectId.isValid(filter.senderId!) &&
    !Types.ObjectId.isValid(filter.swapId!)
  )
    throw createError.BadRequest("Invalid user or swap id");

  return await swapModel.findOneAndDelete({
    _id: filter.swapId,
    senderId: filter.senderId,
  });
};

/**
 * Accepts or declines a swap request.
 * @param data - The input data for accepting or declining a swap request.
 * @param data.senderId - The ID of the user who sent the swap request.
 * @param data.userId - The ID of the user receiving the swap request.
 * @param data.status - The status to set (e.g., accepted, declined).
 * @returns The updated swap request.
 */
export const acceptOrDeclineSwapRequest = async (data: AcceptOrDeclineSwap) => {
  if (
    !Types.ObjectId.isValid(data.swapId) &&
    !Types.ObjectId.isValid(data.userId)
  )
    throw createError.BadRequest("Invalid user or swap id");

  const swap = await swapModel.findOneAndUpdate(
    { _id: data.swapId, receiverId: data.userId },
    { $set: { status: data.status } },
    { new: true }
  );

  if (swap) {
    if (swap && swap.status === "ACCEPTED") {
      const newChat = await createChat({
        sender: swap.senderId,
        receiver: swap.receiverId.toString(),
      });

      // Publish the new chat creation event for sender
      pubsub.publish(SUBSCRIPTION_EVENTS.CHAT_CREATED, {
        newChatCreated: newChat,
        userId: swap.senderId.toString(),
        senderid: swap.senderId.toString(),
        receiverId: swap.receiverId.toString(),
      });
      console.log("published", pubsub.publish);

      // Publish the new chat creation event for receiver
      pubsub.publish(SUBSCRIPTION_EVENTS.CHAT_CREATED, {
        newChatCreated: newChat,
        userId: swap.receiverId.toString(),
        senderId: swap.senderId.toString(),
        receiverId: swap.receiverId.toString(),
      });
      console.log("published", pubsub.publish);
    }

    pubsub.publish(SUBSCRIPTION_EVENTS.SWAP_UPDATED, {
      swapUpdated: swap,
      userId: swap?.senderId.toString(),
      senderId: swap?.senderId.toString(),
      receiverId: swap?.receiverId.toString(),
    });
    console.log("published", pubsub.publish);

    pubsub.publish(SUBSCRIPTION_EVENTS.SWAP_UPDATED, {
      swapUpdated: swap,
      userId: swap?.receiverId.toString(),
      senderId: swap?.senderId.toString(),
      receiverId: swap?.receiverId.toString(),
    });
    console.log("published", pubsub.publish);
  }

  return swap;
};

/**
 * Retrieves a swap request for a user.
 * @param data - The input data for retrieving a swap request.
 * @param data.senderId - The ID of the user who sent the swap request.
 * @param data.receiverId - The ID of the user receiving the swap request.
 * @param data.swapId - The ID of the swap request.
 * @returns The swap request if found.
 */
export const getSwapRequest = async (data: Request) => {
  if (!Types.ObjectId.isValid(data?.swapId!)) {
    throw createError.BadRequest("Invalid user or swap id");
  }

  const swap = await swapModel.findOne({ swapId: data.swapId });

  if (!swap) throw createError.NotFound("Swap request not found");

  return swap;
};

/**
 * Retrieves all swap requests for a user.
 * @param filter - The input data for filtering swap requests.
 * @param filter.senderId - The ID of the user who sent the swap request.
 * @param filter.receiverId - The ID of the user receiving the swap request.
 * @param filter.limit - The maximum number of swap requests to retrieve.
 * @param filter.page - The page number for pagination.
 * @returns An array of swap requests.
 */
export const getSwapRequests = async (filter: Request) => {
  const query: FilterQuery<SwapDocument> = {
    $or: [{ senderId: filter.senderId }, { receiverId: filter.receiverId }],
  };

  const limit = getSanitizeLimit(filter.limit);
  const page = getSanitizePage(filter.page);
  const skip = getSanitizeOffset(limit, page);

  const oprions: QueryOptions = { skip, limit, sort: { createdAt: -1 } };

  const swaps = await swapModel.find(query, null, oprions);

  return getPageConnection(swaps, page, limit);
};

/**
 * Retrieves a swap request by its ID.
 * @param swapId - The ID of the swap request to retrieve.
 * @returns The swap request if found.
 * @throws Will throw an error if the swap ID is invalid or not found.
 */
export const getSwapById = async (swapId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(swapId))
    throw createError.BadRequest("Invalid swap id");

  const swap = await swapModel.findById(swapId);

  if (!swap) throw createError.NotFound("Swap request not found");

  return swap;
};

/**
 * Retrieves a swap request by the sender and receiver user IDs.
 * @param data - The input data containing sender and receiver user IDs.
 * @param data.senderId - The ID of the user who sent the swap request.
 * @param data.receiverId - The ID of the user receiving the swap request.
 * @returns The swap request if found.
 */
export const getSwapByUserIds = async (data: swapByUsers) => {
  return await swapModel.findOne({
    $or: [
      { senderId: data.senderId, receiverId: data.receiverId },
      { senderId: data.receiverId, receiverId: data.senderId },
    ],
  });
};

/**
 * Updates a swap request with new data.
 * @param data - The input data for updating a swap request.
 * @param data.swapId - The ID of the swap request to update.
 * @param data.skillsToOffer - The skills the user is offering.
 * @param data.skillsToLearn - The skills the user wants to learn.
 * @param data.timeTable - The time table for the swap.
 * @param data.session - The session details to add to the swap.
 * @param data.status - The status of the swap request.
 * @returns The updated swap request.
 */
export const updateSwap = async (data: updateSwapData) => {
  const swap = await getSwapById(data.swapId);

  const update = {
    ...(data.skills?.length! > 0 && { skills: data.skills }),
    ...(data.timeTable && { timeTable: data.timeTable }),
    ...(data.session && { sessions: [...swap?.sessions!, data.session] }),
    ...(data.status && { status: data.status }),
  };

  return await swapModel.findByIdAndUpdate(swap._id, update, { new: true });
};
