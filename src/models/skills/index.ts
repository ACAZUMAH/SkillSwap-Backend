import mongoose from "mongoose";
import { SkillDocument } from "src/common/interfaces";

export const skills = new mongoose.Schema<SkillDocument>({
    name: { type: String, required: true },
    level: { type: Number, required: true }
})

const skillSchema = new mongoose.Schema({
    category: { type: String, required: true  },
    skills: [{ type: String, required: true }]
})

export  const skillsModel = mongoose.model('skills', skillSchema)