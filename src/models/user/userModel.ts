import mongoose from "mongoose";
import { userDocument } from "src/common/interfaces";
import { skills } from "../skills";
import { Education } from "src/common/interfaces/education";
import { EducationLevel } from "src/common/enums";

const educationSchema = new mongoose.Schema<Education>({
    level: { type: String, enum: Object.values(EducationLevel) },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    endDate: { type: Date }
})

const userSchema = new mongoose.Schema<userDocument>({
    profile_img: { type: String },
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    bio: { type: String  },
    gitHub: { type: String },
    linkedIn: { type: String },
    portfolio: { type: String },
    averageRating: { type: Number, default: 0 },
    availability: { type: String },

    education: educationSchema,

    password: { type: String, required: true },
    isAuthenticated: { type: Boolean, default: false },

    skillsProficientAt: [skills],

    skillsToLearn: [skills],
    
}, {
    timestamps: true 
})

export const userModel = mongoose.model<userDocument>('users', userSchema)