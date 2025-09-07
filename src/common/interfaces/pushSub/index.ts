import { Types } from "mongoose";

export interface PushSubscriptionDocument {
    _id: Types.ObjectId
    userId: string | Types.ObjectId;
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        }
    }
}

export interface PushSubscriptionInput {
    userId: string | Types.ObjectId;
    subscription: {
        endpoint: string;
        keys: {
            p256dh: string;
            auth: string;
        }
    }
}

export interface subPayload {
    title: string;
    body: string;
    icon?: string;
    url: string;
}