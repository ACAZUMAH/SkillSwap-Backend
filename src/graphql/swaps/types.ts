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
        startDate: Date!
    }

    type Session {
        taughtBy: ID!
        recievedBy: ID!
        skill: String!
        date: Date!
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

    extend type Query {
        getSwapRequests(filter: SwapFilter): SwapConnection
        getRequestedSwaps(filter: SwapFilter): SwapConnection
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
        userId: ID!
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
        startDate: Date!
    }

    input SessionInput {
        taughtBy: ID!
        recievedBy: ID!
        skill: String!
        date: Date!
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
        updateSwap(input: updateSwapInput!): Swap!
    }
`;