import mongoose from "mongoose";
import { UserDocument } from "src/common/interfaces";
import { skillSchema } from "../skills";
import { Education } from "src/common/interfaces/education";

const educationSchema = new mongoose.Schema<Education>({
    level: { type: String, required: true },
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    fieldOfStudy: { type: String },
    startDate: { type: Date },
    endDate: { type: Date }
})

const userSchema = new mongoose.Schema<UserDocument>({
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
    availability: [{ type: String }],
    education: educationSchema,
    isProfileComplete: { type: Boolean, default: true },
    password: { type: String, required: true },
    isAuthenticated: { type: Boolean, default: false },

    skillsProficientAt: [skillSchema],

    skillsToLearn: [skillSchema],

}, {
    timestamps: true 
})

userSchema.index({ "skillsProficientAt.name": 1 });
userSchema.index({ "skillsToLearn.name": 1 });
userSchema.index({ "education.institution": 1 });

export const userModel = mongoose.model<UserDocument>('users', userSchema)