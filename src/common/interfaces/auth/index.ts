import { Types } from "mongoose";

export interface AuthDocument {
    _id: Types.ObjectId
    userId: Types.ObjectId
    otp: string
    expiresIn: Date 
}