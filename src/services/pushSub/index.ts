import { Types } from "mongoose";
import { PushSubscriptionInput } from "src/common/interfaces";
import { PushNotificationSubscriptionModel } from "src/models";

/**
 * Saves or updates a push notification subscription in the database.
 * @param subscription - The push subscription details to be saved
 * @returns Promise resolving to the saved or updated subscription document
 */
export const saveSubscription = async ({ userId, subscription }: PushSubscriptionInput) => {
  const filter = userId
    ? { userId: userId, "subscription.endpoint": subscription.endpoint }
    : { "subscription.endpoint": subscription.endpoint };

  const update = {
    $set: { subscription, userId },
    $setOnInsert: { createdAt: new Date() },
  };

  const options = {
    upsert: true,
    new: true,
    runValidators: true,
    context: "query",
  };

  return await PushNotificationSubscriptionModel.findOneAndUpdate(
    filter,
    update,
    options
  ).exec();
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
