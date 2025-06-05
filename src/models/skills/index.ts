import mongoose from "mongoose";
import { SkillDocument, Swapped } from "src/common/interfaces";

export const skillSchema = new mongoose.Schema<SkillDocument>({
    name: { type: String, required: true },
    level: { type: Number, required: true }
})

export const swappedskillSchema = new mongoose.Schema<Swapped>({
    By: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "users" },
    name: { type: String, required: true },
    level: { type: Number, required: true }
}, {
    _id: false
})