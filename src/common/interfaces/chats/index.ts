import { Types } from "mongoose";
import { MessagesStatus, MessageType } from "src/common/enums";

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

export interface ChatUsers {
    sender?: string | Types.ObjectId;
    receiver?: string | Types.ObjectId;
}

export interface Message {
    sender: Types.ObjectId | string;
    messageType: MessageType;
    message?: string | null; 
    mediaUrl?: string | null;
    status?: MessagesStatus
}
export interface ChatInput {
    chatId?: Types.ObjectId | string;
    users: ChatUsers;
    message: Message;
}

export interface newMessageInput {
    from: string;
    to: string;
    chatId: Types.ObjectId | string;
    message: Message;
    users: ChatUsers;
}