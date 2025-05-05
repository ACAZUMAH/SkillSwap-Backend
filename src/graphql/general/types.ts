export const generalTypeDefs = `#graphql

    type Skills {
        skill: String!,
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
