import { ChatDocument, ChatUsersDocument, GraphqlContext } from "src/common/interfaces";

const senderId = (parent: ChatUsersDocument) => parent.senderId.toString();

const receiverId = (parent: ChatUsersDocument) => parent.receiverId.toString();


const sender = (parent: ChatUsersDocument, _: any, { userLoader }: GraphqlContext) => {
  return parent.senderId ? userLoader.load(parent.senderId.toString()) : null;
}

const receiver = (parent: ChatUsersDocument, _: any, { userLoader }: GraphqlContext) => {
  return parent.receiverId ? userLoader.load(parent.receiverId.toString()) : null;
};

export const chatUsersResolver = {
  ChatUsers: {
    senderId,
    receiverId,
    sender,
    receiver
  }
};