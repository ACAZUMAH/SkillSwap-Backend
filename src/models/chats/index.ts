import { model, Schema } from "mongoose";
import { MessageType } from "src/common/enums";
import { chatDocument, chatUsersDocument, messageDocument } from "src/common/interfaces";

const users = new Schema<chatUsersDocument>({
    sender: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    receiver: { type: Schema.Types.ObjectId, ref: "users" },
})

const messageSchema = new Schema<messageDocument>({
    messageType: { type: String, enum: Object.values(MessageType), default: MessageType.TEXT, required: true },
    message: { type: String, required: function(this: any) { return this.messageType === MessageType.TEXT; } },
    mediaUrl: { type: String, required: function(this: any) { return this.messageType !== MessageType.TEXT; } },
    isRead: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
    }, {
    timestamps: true,
})

const chatSchema = new Schema<chatDocument>({
    users: { type: [users], required: true },
    messages: { type: [messageSchema], default: [] },
}, {
    timestamps: true,
})

export const chatModel = model<chatDocument>("chats", chatSchema);


