export const generalTypeDefs = `#graphql
    type PageInfo {
        hasNextPage: Boolean!
        page: Int!
        limit: Int!
        total: Int!
    }
    
    type Skill {
        id: ID!
        name: String!  
        level: Int!
    }

    input SkillInput {
        id: ID
        name: String!
        level: Int!
    }

    type Query {
        _empty: String,
        hello: String
    }

    type Subscription {
        _empty: String
    }

    type Mutation {
        _empty: String
    }
`;
