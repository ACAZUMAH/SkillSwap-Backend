import { Types } from "mongoose";
import { skillDocument, SkillInput } from "../skills";

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
    firstName?: String | null
    lastNama?: string | null
    email?: string | null
    phoneNumber: string
    password: string
}

export interface loginUserInput {
    phoneNumber?: string | null
    email?: string | null
    password: string
}

export interface updateUserInput {
  id: Types.ObjectId | string
  profile_img?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  bio?: string | null;
  availability?: String | null;

  skillsOffered?: Array<SkillInput | null> | null;

  skillsWanted?: Array<SkillInput | null> | null;
}