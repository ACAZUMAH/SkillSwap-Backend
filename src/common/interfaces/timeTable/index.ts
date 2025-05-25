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
    recievedBy: Types.ObjectId
    status: ScheduleStatus
}