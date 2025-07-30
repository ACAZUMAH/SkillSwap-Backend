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
        senderId: ID!
        receiverId: ID!
        sender: User
        receiver: User
    }

    type Message {
        id: ID!
        senderId: ID!
        messageType: MessageType!
        message: String
        mediaUrl: String
        status: MessagesStatus!
        createdAt: DateTime
        updatedAt: DateTime
        sender: User
    }

    type Chat {
        id: ID!
        users: ChatUsers!
        messages: [Message]!
        recentMessage: Message
        createdAt: String!
        updatedAt: String!
    }

    type UnreadCount {
        chatId: ID!
        unreadCount: Int!
    }

    input getMessageInput {
        chatId: ID!
    }

    extend type Query {
        getChatById(chatId: ID!): Chat
        allChats(userId: ID): [Chat]!
        getMessages(data: getMessageInput!): Chat!
        getChatByUserId(userId: ID): [Chat]!
        getUnreadMessagesCount: [UnreadCount]
    }

    input ChatUsersInput {
        senderId: ID!
        receiverId: ID!
    }

    input MessageInput {
        senderId: ID!
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
        newChatCreated(userId: ID!): Chat
        unreadMessagesCount(userId: ID!): [UnreadCount]
    }
`;
