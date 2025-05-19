import { Types } from "mongoose";

export interface Education {
    _id: Types.ObjectId
    level: string
    institution: string
    degree: string
    endDate: Date
}

export interface EducationInput {
  level: string
  institution: string;
  degree: string;
  endDate: Date;
}