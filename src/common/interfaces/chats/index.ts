import { Types } from "mongoose";
import { MessageType } from "src/common/enums";

export interface ChatUsersDocument{
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
}

export interface MessageDocument {
    _id: Types.ObjectId;
    sender: Types.ObjectId;
    messageType: MessageType;
    message?: string; 
    mediaUrl?: string;
    isRead: boolean;
    isDeleted: boolean;
    timestamp: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ChatDocument {
    _id: Types.ObjectId;
    users: ChatUsersDocument;
    messages: MessageDocument[];
    recentMessage?: MessageDocument;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface messageInput {
    sender: Types.ObjectId;
    messageType: MessageType;
    message?: string; 
    mediaUrl?: string;
}

export interface ChatInput {
    chatId?: Types.ObjectId;
    users: ChatUsersDocument;
    message: MessageDocument;
}