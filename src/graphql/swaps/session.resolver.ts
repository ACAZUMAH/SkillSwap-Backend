import { SwapSessionDocument } from "src/common/interfaces";

const id = (parent: SwapSessionDocument) => parent._id.toString();

export const swapSessionResolver = {
    Session: {
        id
    }
};  