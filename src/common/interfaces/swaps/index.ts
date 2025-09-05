import { Types } from "mongoose";
import { Swapped } from "../skills";
import { Status } from "src/common/enums";
import { SwapSessionDocument, SwapSessionInput, SwapTimeTableDocument, SwapTimeTableInput } from "../timeTable";

export interface SwapDocument {
    _id: Types.ObjectId
    senderId: Types.ObjectId
    receiverId: Types.ObjectId
    skills?: Swapped[]
    status: Status

    timeTable?: [SwapTimeTableDocument]
    sessions?: [SwapSessionDocument]
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
    userId?: string | Types.ObjectId | null
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
    id: string | Types.ObjectId
    skills?: Array<Swapped | null> | null
    status?: Status | null
    timeTable?: Array<SwapTimeTableInput | null> | null
    sessions?: Array<SwapSessionInput | null> | null
}