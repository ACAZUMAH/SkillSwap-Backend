import { Schema, model } from "mongoose";
import { PushSubscriptionDocument } from "src/common/interfaces";

const pushNotificationSubscriptionSchema = new Schema<PushSubscriptionDocument>(
  {
    userId: { type: String, required: true, ref: "User" },
    subscription: {
      endpoint: { type: String, required: true },
      keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true },
      },
    },
  },
  { timestamps: true }
);

pushNotificationSubscriptionSchema.index({ 'subscription.endpoint': 1 }, { unique: true, sparse: true });

export const PushNotificationSubscriptionModel =
  model<PushSubscriptionDocument>(
    "PushNotificationSubscription",
    pushNotificationSubscriptionSchema
  );
