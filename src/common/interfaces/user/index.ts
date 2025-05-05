import { Types } from "mongoose";
import { skillDocument } from "../skills";

export interface userDocument {
    _id: Types.ObjectId
    profile_img?: string
    firstName?: string
    lastName?: string
    email?: string
    phoneNumber: string
    bio?: string
    availability?: String
    password: string,
    isAuthenticated: boolean,

    skillsOffered: [skillDocument]

    skillsWanted: [skillDocument]

}

export interface createUserInput {
    firstName: String
    lastNama: string
    email: string
    phoneNumber: string
    password: string
}