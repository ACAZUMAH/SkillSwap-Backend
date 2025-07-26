import { model, Schema } from "mongoose";
import { MessagesStatus, MessageType } from "src/common/enums";
import { ChatDocument, ChatUsersDocument, MessageDocument } from "src/common/interfaces";

const users = new Schema<ChatUsersDocument>({
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    receiverId: { type: Schema.Types.ObjectId, ref: "users" },
})

const messageSchema = new Schema<MessageDocument>({
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    messageType: { type: String, enum: Object.values(MessageType), default: MessageType.TEXT, required: true },
    message: { type: String, required: function(this: any) { return this.messageType === MessageType.TEXT; } },
    mediaUrl: { type: String, required: function(this: any) { return this.messageType !== MessageType.TEXT; } },
    status: { type: String, enum: Object.values(MessagesStatus), default: MessagesStatus.SENT },
    }, {
    timestamps: true,
})

const chatSchema = new Schema<ChatDocument>({
    users: { type: users, required: true },
    messages: { type: [messageSchema], default: [] },
    recentMessage: { type: messageSchema },
}, {
    timestamps: true,
})

export const chatModel = model<ChatDocument>("chats", chatSchema);


