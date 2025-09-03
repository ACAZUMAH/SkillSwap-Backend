import { SwapTimeTableDocument } from "src/common/interfaces";

const id = (parent: SwapTimeTableDocument) => parent._id.toString()

export const SwapTimeTableResolver = {
    TimeTable: {
        id
    }
};
