export const chatTypeDeffs = `#graphql
    enum MessageType {
        TEXT 
        IMAGE 
        VIDEO 
        DOCUMENT 
    }

    type ChatUser {
        id: ID
        userId: String
        firstName: String
        lastName: String
        profile_img: String
    }

    type Message {
        id: ID!
        sender: ChatUser
        messageType: MessageType!
        message: String
        mediaUrl: String
        isRead: Boolean!
        isDeleted: Boolean!
        timestamp: String!
    }

    type Chat {
        id: ID!
        users: [ChatUser!]!
        messages: [Message!]!
        recentMessage: Message
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        getChatById(chatId: ID!): Chat
        allChats(userId: ID): [Chat]!
    }

`;
