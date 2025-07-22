export const chatTypeDeffs = `#graphql
    enum MessageType {
        TEXT 
        IMAGE 
        VIDEO 
        DOCUMENT 
    }

    type ChatUsers {
        id: ID
        sender: User
        receiver: User
    }

    type Message {
        id: ID!
        sender: User
        messageType: MessageType!
        message: String
        mediaUrl: String
        isRead: Boolean!
        isDeleted: Boolean!
        timestamp: String!
    }

    type Chat {
        id: ID!
        users: ChatUsers!
        messages: [Message]!
        recentMessage: Message
        createdAt: String!
        updatedAt: String!
    }

    extend type Query {
        getChatById(chatId: ID!): Chat
        allChats(userId: ID): [Chat]!
    }

`;
