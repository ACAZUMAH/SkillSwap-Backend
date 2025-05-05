import mongoose from "mongoose";
import { userDocument } from "src/common/interfaces";
import { skills } from "../skills";

const userSchema = new mongoose.Schema<userDocument>({
    profile_img: { type: String },
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String },
    phoneNumber: { type: String, required: true },
    bio: { type: String  },
    availability: { type: String },
    password: { type: String, required: true },
    isAuthenticated: { type: Boolean },

    skillsOffered: [skills],

    skillsWanted: [skills],
    
}, {
    timestamps: true 
})

export const userModel = mongoose.model<userDocument>('users', userSchema)