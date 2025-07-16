import { MessageDocument } from "src/common/interfaces";

const id = (parent: MessageDocument) => parent._id.toString();

export const messageResolvers = {
    Message: {
        id,
    }
}