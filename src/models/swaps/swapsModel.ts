import { Schema, model } from "mongoose";
import { SwapSessionDocument, SwapDocument, SwapTimeTableDocument } from "src/common/interfaces";
import { swappedSkillSchema } from "../skills";
import { ScheduleStatus, Status } from "src/common/enums";

const timeTableSchema = new Schema<SwapTimeTableDocument>({
    skill: { type: String },
    taughtBy: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    dayOfweek: { type: String, required: true },
    time: { type: String, required: true },
    durationInWeeks: { type:Number, required: true },
    startDate: { type: Date, required: true }
})

const sessionsSchema = new Schema<SwapSessionDocument>({
  taughtBy: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  receivedBy: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  skill: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, enum: Object.values(ScheduleStatus), default: ScheduleStatus.SCHEDULED },
});

const swapSchema = new Schema<SwapDocument>({
    senderId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
    receiverId: { type: Schema.Types.ObjectId, required: true, ref: "users"},
    status: { type: String, enum: Object.values(Status), default: Status.PENDING },

    skills: { type: [swappedSkillSchema] },

    timeTable: [timeTableSchema],
    sessions: [sessionsSchema]
}, {
    timestamps: true 
})

export const swapModel = model<SwapDocument>('swaps', swapSchema)