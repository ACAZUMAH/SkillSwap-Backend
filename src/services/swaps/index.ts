import { Types } from "mongoose";
import { AcceptOrDeclineSwap, CreateSwapRequest } from "src/common/interfaces";
import createError from "http-errors";
import { swapModel } from "src/models";

export const createSwapRequest = (data: CreateSwapRequest) => {
  if (
    !(
      Types.ObjectId.isValid(data.userRequesting) &&
      Types.ObjectId.isValid(data.userOffering)
    )
  ) {
    throw createError.BadRequest("Invalid user ids");
  }

  const requesst = swapModel.create({ ...data });

  return requesst;
};

export const cancelSwapRequest = async (userId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(userId))
    throw createError.BadRequest("Invalid user id");

  return await swapModel.findOneAndDelete({ userRequesting: userId });
};

export const declineSwapRequest = (data: AcceptOrDeclineSwap) => {
  if (
    !(
      Types.ObjectId.isValid(data.userRequesting) &&
      Types.ObjectId.isValid(data.userOffering)
    )
  ) {
    throw createError.BadRequest("Invalid user ids");
  }

  const decline = swapModel.findOneAndUpdate(
    {
      $and: [
        {
          userOffering: data.userOffering,
          userRequesting: data.userRequesting,
        },
      ],
    },
    { $set: { status: data.status } },
    { new: true }
  );
};

export const acceptSwapRequest = (data: AcceptOrDeclineSwap) => {};

export const getSwapRequests = (userId: String | Types.ObjectId) => {};

export const getRequestedSwaps = (userId: string | Types.ObjectId) => {};
