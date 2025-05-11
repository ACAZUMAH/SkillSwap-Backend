import { Types } from "mongoose";
import { EducationLevel } from "src/common/enums";

export interface Education {
    _id: Types.ObjectId
    level: EducationLevel
    institution: string
    degree: string
    endDate: Date
}