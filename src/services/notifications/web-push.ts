import { Types } from "mongoose";
import { subPayload } from "src/common/interfaces";
import logger from "src/loggers/logger";
import * as webPush from "web-push";
import { getUserSubscription } from "../pushSub";

webPush.setVapidDetails(
  "mailto:calebazumah9@gmail.com",
  `${process.env.VAPID_PUBLIC_KEY}`,
  `${process.env.VAPID_PRIVATE_KEY}`
);

export const sendPushNotification = async (to: string, payload: subPayload) => {
  try {
    const subs = await getUserSubscription(to);
    for (const sub of subs) {
      await webPush.sendNotification(sub.subscription, JSON.stringify(payload));
    }
  } catch (error) {
    logger.error("Error sending push notification:", error);
  }
};
