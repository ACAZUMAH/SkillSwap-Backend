import { Types } from "mongoose"
import { ScheduleStatus } from "src/common/enums"

export interface SwapTimeTable {
    _id: Types.ObjectId
    taughtBy: Types.ObjectId
    skill: String
    dayOfweek: String
    time: String
    durationInWeeks: Number
    startDate: Date
}
export interface SwapSession {
    _id: Types.ObjectId
    date: Date
    time: string
    skill: string
    taughtBy: Types.ObjectId
    receivedBy: Types.ObjectId
    status: ScheduleStatus
}

export interface SwapTimeTableInput {
    skill: String
    taughtBy: Types.ObjectId | string
    dayOfweek: String
    time: String
    durationInWeeks: Number
    startDate: Date
}

export interface SwapSessionInput {
    date: Date
    time: string
    skill: string
    taughtBy: Types.ObjectId | string
    receivedBy: Types.ObjectId | string
    status?: ScheduleStatus | null
}