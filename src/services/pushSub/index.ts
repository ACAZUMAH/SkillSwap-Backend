import { Types } from "mongoose";
import { PushSubscriptionInput } from "src/common/interfaces";
import { PushNotificationSubscriptionModel } from "src/models";

/**
 * Saves or updates a push notification subscription in the database.
 * @param subscription - The push subscription details to be saved
 * @returns Promise resolving to the saved or updated subscription document
 */
export const saveSubscription = async (subscription: PushSubscriptionInput) => {
  return await PushNotificationSubscriptionModel.findOneAndUpdate(
    { 'subscription.endpoint': subscription.subscription.endpoint },
    {
      $set: {
        userId: subscription.userId,
        subscription: {
          ...subscription.subscription,
        },
      },
    },
    { upsert: true, new: true }
  );
};

/**
 * Fetches the push notification subscription for a given user.
 * @param userId - ID of the user whose subscription is to be fetched
 * @returns Promise resolving to the user's push notification subscription
 */
export const getUserSubscription = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId)) throw new Error("Invalid user ID");

  return await PushNotificationSubscriptionModel.find({ userId });
};
