import { Types } from "mongoose"
import { ScheduleStatus } from "src/common/enums"

export interface TimeTable {
    skill: String
    taughtBy: Types.ObjectId
    dayOfweek: String
    time: String
    durationInWeeks: Number
    startDate: Date
}

export interface Session {
    date: Date
    time: string
    skill: string
    taughtBy: Types.ObjectId
    recievedBy: Types.ObjectId
    status: ScheduleStatus
}