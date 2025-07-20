import { Types } from "mongoose";

export interface Education {
    _id: Types.ObjectId
    level: string
    institution: string
    fieldOfStudy?: string
    degree: string
    startDate?: Date
    endDate?: Date
}

export interface EducationInput {
  level?: string | null;
  institution?: string | null;
  degree?: string | null;
  fieldOfStudy?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}