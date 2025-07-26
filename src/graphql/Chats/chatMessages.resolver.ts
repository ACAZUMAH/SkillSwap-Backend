import { GraphqlContext, MessageDocument } from "src/common/interfaces";

const id = (parent: MessageDocument) => parent._id.toString();

const senderId = (parent: MessageDocument) => parent.senderId.toString() || null;

const sender = (parent: MessageDocument, _: any, { userLoader }: GraphqlContext) => {
  return parent.senderId ? userLoader.load(parent.senderId.toString()) : null;
}


export const ChatMessageResolvers = {
    Message: {
        id,
        senderId,       
        sender
    },
}