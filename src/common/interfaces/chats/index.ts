import { Types } from "mongoose";
import { MessageType } from "src/common/enums";

export interface chatUsersDocument{
    sender: Types.ObjectId;
    receiver?: Types.ObjectId;
}

export interface messageDocument {
    _id: Types.ObjectId;
    messageType: MessageType;
    message?: string; 
    mediaUrl?: string;
    isRead: boolean;
    isDeleted: boolean;
    timestamp: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface chatDocument {
    _id: Types.ObjectId;
    users: chatUsersDocument[];
    messages: messageDocument[];
    createdAt?: Date;
    updatedAt?: Date;
}