import { Types } from "mongoose";
import { SkillDocument } from "../skills";
import { Status } from "src/common/enums";
import { SwapSession, SwapTimeTable } from "../timeTable";

export interface swapDocument {
    _id: Types.ObjectId
    senderId: Types.ObjectId
    receiverId: Types.ObjectId
    skillsToOffer: [SkillDocument]
    skillsToLearn: [SkillDocument]
    status: Status

    timeTable?: [SwapTimeTable]
    sessions?: [SwapSession]
}

export interface SwapRequest {
    senderId: string | Types.ObjectId
    receiverId: string | Types.ObjectId
    skillsToOffer?: [SkillDocument] | null
    skillsToLearn?: [SkillDocument] | null
}

export interface AcceptOrDeclineSwap {
    swapId: string | Types.ObjectId
    userId: string | Types.ObjectId
    status: Status
}

export interface Request {
    swapId?: string | Types.ObjectId | null
    senderId?: string | Types.ObjectId | null
    receiverId?: string | Types.ObjectId | null
        status?: Status | null
    limit?: number | null
    page?: number | null
}