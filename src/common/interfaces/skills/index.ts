import { Types } from "mongoose"

export interface skillDocument {
    _id: Types.ObjectId,
    skill: string,
    level: number,
}

export interface SkillInput {
    skill: string,
    level: number
}
