import { Types } from "mongoose";
import { skillDocument } from "../skills";
import { Status } from "src/common/enums";
import { Session, TimeTable } from "../timeTable";

export interface swapDocument {
    userOffering: Types.ObjectId
    userRequesting: Types.ObjectId
    skillsOffered: [skillDocument]
    skillsWanted: [skillDocument]
    status: Status

    timeTable?: [TimeTable]
    sessions?: [Session]
}