import mongoose from "mongoose";
import { skillDocument } from "src/common/interfaces";

export const skills = new mongoose.Schema<skillDocument>({
    skill: { type: String, required: true },
    level: { type: Number, required: true }
})
