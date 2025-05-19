import { Schema, model } from "mongoose";
import { AuthDocument } from "src/common/interfaces"; 

const authSchema = new Schema<AuthDocument>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    otp: { type: String, required: true },
    expiresIn: { type: Date, required: true }
})

export const authModel = model<AuthDocument>('auth', authSchema)