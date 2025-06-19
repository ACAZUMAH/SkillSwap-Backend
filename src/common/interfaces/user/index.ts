import { Types } from "mongoose";
import { SkillDocument, UserSkill } from "../skills";
import { Education, EducationInput } from "../education";

export interface UserDocument {
  _id: Types.ObjectId;
  profile_img?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber: string;
  bio?: string;
  gitHub?: string
  linkedIn?: string
  portfolio?: string
  availability?: String[];
  averageRating?: number
  education: Education
  isProfileComplete: boolean;
  password: string;
  isAuthenticated: boolean;

  skillsProficientAt: SkillDocument[];

  skillsToLearn: SkillDocument[];
}

export interface CreateUser {
  firstName?: String | null;
  lastNama?: string | null;
  email?: string | null;
  phoneNumber: string;
  password: string;
}

export interface LoginUser {
  phoneNumber?: string | null; 
  email?: string | null;
  password: string;
}

export interface UpdateUser {
  id: Types.ObjectId | string;
  profile_img?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  bio?: string | null;
  gitHub?: string | null
  linkedIn?: string | null
  portfolio?: string | null
  education?: EducationInput | null
  availability?: Array<String | null> | null;
  isProfileComplete?: boolean | null;
  
  skillsProficientAt?: Array<UserSkill | null> | null;

  skillsToLearn?: Array<UserSkill | null> | null;
}

export interface UserFilters {
  limit?: number | null
  page?: number | null
  userId?: string | Types.ObjectId | null
  search?: string | null
}
