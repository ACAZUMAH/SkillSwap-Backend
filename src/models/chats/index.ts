import { model, Schema } from "mongoose";
import { MessageType } from "src/common/enums";
import { ChatDocument, ChatUsersDocument, MessageDocument } from "src/common/interfaces";

const users = new Schema<ChatUsersDocument>({
    sender: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    receiver: { type: Schema.Types.ObjectId, ref: "users" },
})

const messageSchema = new Schema<MessageDocument>({
    sender: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    messageType: { type: String, enum: Object.values(MessageType), default: MessageType.TEXT, required: true },
    message: { type: String, required: function(this: any) { return this.messageType === MessageType.TEXT; } },
    mediaUrl: { type: String, required: function(this: any) { return this.messageType !== MessageType.TEXT; } },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    }, {
    timestamps: true,
})

const chatSchema = new Schema<ChatDocument>({
    users: { type: users, required: true },
    messages: { type: [messageSchema], default: [] },
    recentMessage: { type: messageSchema, default: null },
}, {
    timestamps: true,
})

export const chatModel = model<ChatDocument>("chats", chatSchema);


