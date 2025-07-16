import { model, Schema } from "mongoose";
import { passwordDocument } from "src/common/interfaces";

const passwordSchema = new Schema<passwordDocument>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "1h" },
  },
  {
    timestamps: true,
  }
);

export const passwordModel = model<passwordDocument>("passwords", passwordSchema);