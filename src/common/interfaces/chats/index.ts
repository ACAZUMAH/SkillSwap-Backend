import { Types } from "mongoose";
import { MessagesStatus, MessageType } from "src/common/enums";

export interface ChatUsersDocument{
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
}

export interface MessageDocument {
    _id: Types.ObjectId;
    senderId: Types.ObjectId;
    messageType: MessageType;
    message?: string; 
    mediaUrl?: string;
    status: MessagesStatus
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

export interface ChatUser {
    senderId?: string | Types.ObjectId;
    receiverId?: string | Types.ObjectId;
}

export interface Messages {
    senderId: Types.ObjectId | string;
    messageType: MessageType;
    message?: string | null; 
    mediaUrl?: string | null;
    status?: MessagesStatus
}
export interface ChatInput {
    chatId: Types.ObjectId | string;
    to: string
    message: Messages;
}
export interface GetMessages {
    chatId: Types.ObjectId | string;
    userId: Types.ObjectId | string;
}

export interface UnreadMessages {
    _id: Types.ObjectId;
    chatId: Types.ObjectId;
    unreadCount: number;
}