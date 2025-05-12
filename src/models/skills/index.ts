import mongoose from "mongoose";
import { skillDocument } from "src/common/interfaces";

export const skills = new mongoose.Schema<skillDocument>({
    skill: { type: String, required: true },
    level: { type: Number, required: true }
})

const skillSchema = new mongoose.Schema({
    category: { type: String, required: true  },
    skills: [{ type: String, required: true }]
})

export  const skillsModel = mongoose.model('skills', skillSchema)