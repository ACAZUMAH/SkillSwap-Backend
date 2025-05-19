import { Types } from "mongoose";
import { SkillDocument } from "../skills";
import { Status } from "src/common/enums";
import { Session, TimeTable } from "../timeTable";

export interface swapDocument {
    userOffering: Types.ObjectId
    userRequesting: Types.ObjectId
    skillsOffered: [SkillDocument]
    skillsWanted: [SkillDocument]
    status: Status

    timeTable?: [TimeTable]
    sessions?: [Session]
}

export interface CreateSwapRequest {
    userRequesting: string | Types.ObjectId
    userOffering: string | Types.ObjectId
}

export interface AcceptOrDeclineSwap {
    userRequesting: string | Types.ObjectId
    userOffering: string | Types.ObjectId
    status: Status
}