import { ChatDocument, GraphqlContext, QueryAllChatsArgs } from "src/common/interfaces";
import { getAllChatsByUserId } from "src/services/chats";

const id = (parent: ChatDocument) => parent._id.toString();

const allChats = async (_: any, args: QueryAllChatsArgs, { user }: GraphqlContext) => {
    //console.log(await getAllChatsByUserId(user._id));
    return getAllChatsByUserId(user._id)
}

export const chatResolver = {
    Query: {
        allChats,
    },
    Chat: {
        id,
    },
}
