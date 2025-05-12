import { Types } from "mongoose";
import { skillDocument, SkillInput } from "../skills";
import { Education, EducationInput } from "../education";

export interface userDocument {
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
  availability?: String;
  averageRating?: number
  education: Education

  password: string;
  isAuthenticated: boolean;

  skillsProficientAt: [skillDocument];

  skillsToLearn: [skillDocument];
}

export interface createUserInput {
  firstName?: String | null;
  lastNama?: string | null;
  email?: string | null;
  phoneNumber: string;
  password: string;
}

export interface loginUserInput {
  phoneNumber?: string | null;
  email?: string | null;
  password: string;
}

export interface updateUserInput {
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

  availability?: String | null;

  skillsProficientAt?: Array<SkillInput | null> | null;

  skillsToLearn?: Array<SkillInput | null> | null;
}

export interface filters {
  firstName?: string | null;
  lastName?: string | null;
  availability?: string | null;
  bio?: string | null
}
