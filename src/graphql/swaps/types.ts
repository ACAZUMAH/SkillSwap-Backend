export const swapsTypeDef = `#graphql 
    enum Status {
        PENDING
        ACCEPTED
        DECLINED
        COMPLETED
    }

    enum ScheduleStatus {
        SCHEDULED
        COMPLETED
        CANCELLED
    }

    type TimeTable {
        skill: String!
        taughtBy: ID!
        dayOfweek: String!
        time: String!
        durationInWeeks: Int!
        startDate: DateTime!
    }

    type Session {
        taughtBy: ID!
        receivedBy: ID!
        skill: String!
        date: DateTime!
        time: String!
        status: ScheduleStatus!
    }

    type SwappedSkill {
        By: ID!
        name: String!
        level: Int!
    }

    type Swap {
        id: ID!
        status: Status!
        senderId: ID!
        receiverId: ID!
        skills: [SwappedSkill]
        timeTable: [TimeTable]
        sessions: [Session]
        createdAt: DateTime!
        updatedAt: DateTime!

        sender: User
        receiver: User
    }

    type SwapConnection {
        edges: [Swap!]
        pageInfo: PageInfo
    }

    input SwapFilter {
        status: Status
        limit: Int
        page: Int
    }

    input SwapByUsers {
        senderId: ID!
        receiverId: ID!
    }

    extend type Query {
        getSwapRequests(filter: SwapFilter): SwapConnection
        getRequestedSwaps(filter: SwapFilter): SwapConnection
        getSwapRequest(swapId: ID!): Swap
        getSwapByUsers(data: SwapByUsers): Swap
    }
   
    input SwapRequestInput {
        receiverId: ID!
    }

    input AcceptOrDeclineSwapInput {
        swapId: ID!
        status: Status!
    }

    input CancelSwapRequestInput {
        swapId: ID!
        userId: ID
    }

    input SwappedSkillInput {
        By: ID!
        name: String!
        level: Int!
    }

    input TimeTableInput {
        skill: String!
        taughtBy: ID!
        dayOfweek: String!
        time: String!
        durationInWeeks: Int!
        startDate: DateTime!
    }

    input SessionInput {
        taughtBy: ID!
        receivedBy: ID!
        skill: String!
        date: DateTime!
        time: String!
        status: ScheduleStatus
    }

    input updateSwapInput {
        id: ID!
        status: Status
        skills: [SwappedSkillInput]
        timeTable: [TimeTableInput]
        sessions: [SessionInput]
    }

    extend type Mutation {
        createSwapRequest(input: SwapRequestInput!): Swap!
        acceptOrDeclineSwapRequest(input: AcceptOrDeclineSwapInput!): Swap!
        cancelSwapRequest(input: CancelSwapRequestInput!): Swap!
        updateSwap(data: updateSwapInput!): Swap
    }

    extend type Subscription {
        newSwapRequest(userId: ID!): Swap
        swapUpdated(userId: ID!): Swap
    }
`;
