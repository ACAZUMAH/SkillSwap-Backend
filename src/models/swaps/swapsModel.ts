import { Schema, model } from "mongoose";
import { SwapSession, swapDocument, SwapTimeTable } from "src/common/interfaces";
import { skills } from "../skills";
import { ScheduleStatus, Status } from "src/common/enums";

const timeTableSchema = new Schema<SwapTimeTable>({
    skill: { type: String },
    taughtBy: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    dayOfweek: { type: String, required: true },
    time: { type: String, required: true },
    durationInWeeks: { type:Number, required: true },
    startDate: { type: Date, required: true }
})

const sessionsSchema = new Schema<SwapSession>({
  taughtBy: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  recievedBy: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  skill: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: Object.values(ScheduleStatus), default: ScheduleStatus.SCHEDULED },
});

const swapSchema = new Schema<swapDocument>({
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    receiverId: { type: Schema.Types.ObjectId, required: true, ref: "users"},
    status: { type: String, enum: Object.values(Status), default: Status.PENDING },

    skillsToOffer: [skills],
    skillsToLearn: [skills],

    timeTable: [timeTableSchema],
    sessions: [sessionsSchema]
}, {
    timestamps: true 
})

export const swapModel = model<swapDocument>('swaps', swapSchema)