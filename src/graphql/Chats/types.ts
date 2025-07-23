export const chatTypeDeffs = `#graphql
    enum MessageType {
        TEXT 
        IMAGE 
        VIDEO 
        DOCUMENT 
    }

    enum MessagesStatus {
        SENT
        DELIVERED
        READ
        DELETED
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
        status: MessagesStatus!
        createdAt: DateTime
        updatedAt: DateTime
    }

    type Chat {
        id: ID!
        users: ChatUsers!
        messages: [Message]!
        recentMessage: Message
        createdAt: String!
        updatedAt: String!
    }

    input getMessageInput {
        chatId: ID!
        from: ID!
        to: ID!
    }

    extend type Query {
        getChatById(chatId: ID!): Chat
        allChats(userId: ID): [Chat]!
        getMessages(data: getMessageInput!): Chat!
        getChatByUserId(userId: ID): [Chat]!
    }


    input ChatUsersInput {
        sender: ID!
        receiver: ID!
    }

    input MessageInput {
        sender: ID!
        messageType: MessageType!
        message: String
        mediaUrl: String
    }

    input newMessageInput {
        from: String!
        to: String!
        chatId: ID!
        message: MessageInput!
        users: ChatUsersInput!
    }

    extend type Mutation {
        upsertMessage(data: newMessageInput!): Chat
    }

    extend type Subscription {
        getChatByUserId(userId: ID): [Chat]!
        newChatCreated(userId: ID!): Chat!
    }
`;
