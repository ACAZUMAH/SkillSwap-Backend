import { Schema, model } from "mongoose";
import { PushSubscriptionDocument } from "src/common/interfaces";

const pushNotificationSubscriptionSchema = new Schema<PushSubscriptionDocument>(
  {
    userId: { type: String, required: true, ref: "User" },
    subscription: {
      endpoint: { type: String },
      keys: {
        p256dh: { type: String },
        auth: { type: String },
      },
    },
  },
  { timestamps: true }
);

export const PushNotificationSubscriptionModel =
  model<PushSubscriptionDocument>(
    "PushNotificationSubscription",
    pushNotificationSubscriptionSchema
  );
