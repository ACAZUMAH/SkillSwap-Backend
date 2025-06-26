import { Types } from "mongoose";
import { Swapped } from "../skills";
import { Status } from "src/common/enums";
import { SwapSession, SwapTimeTable } from "../timeTable";

export interface SwapDocument {
    _id: Types.ObjectId
    senderId: Types.ObjectId
    receiverId: Types.ObjectId
    skills?: Swapped[]
    status: Status

    timeTable?: [SwapTimeTable]
    sessions?: [SwapSession]
}

export interface SwapRequest {
    senderId: string | Types.ObjectId
    receiverId: string | Types.ObjectId
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

export interface swapByUsers {
    senderId: string | Types.ObjectId
    receiverId: string | Types.ObjectId
}

export interface updateSwapData {
    swapId: string | Types.ObjectId
    skills?: Swapped[] | null
    status?: Status
    timeTable?: SwapTimeTable[] | null
    session?: SwapSession[] | null
}