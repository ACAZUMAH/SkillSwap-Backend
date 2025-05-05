import { Schema, model } from "mongoose";
import { authDocument } from "src/common/interfaces"; 

const authSchema = new Schema<authDocument>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    otp: { type: String, required: true },
    expiresIn: { type: Date, required: true }
})

export const authModel = model<authDocument>('auth', authSchema)