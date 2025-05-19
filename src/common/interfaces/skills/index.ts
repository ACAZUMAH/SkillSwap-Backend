import { Types } from "mongoose"

export interface SkillDocument {
    _id: Types.ObjectId,
    name: string,
    level: number,
}

export interface UserSkill {
    name: string,
    level: number
}
