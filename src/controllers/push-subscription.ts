import { Request, Response } from "express";
import { constructHTTPResponse } from "src/common/helpers";
import { PushNotificationSubscriptionModel } from "src/models";
import { saveSubscription } from "src/services/pushSub";

/**
 * Handles the push subscription request and saves the subscription details.
 * @param req - Request object containing subscription details in the body
 * @param res - Response object to send the result
 */
export const pushSubscriptionController = async (req: Request, res: Response) => {

    const result = await saveSubscription(req.body);

    res.status(201).json(constructHTTPResponse(result));
}