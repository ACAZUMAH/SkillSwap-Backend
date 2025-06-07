export const authTypeDefs = `#graphql
    type Authenticated {
        user: User!
        token: String
    }

    type Response {
        message: String
    }

    input createUserInput {
        firstName: String
        lastName: String
        email: String
        phoneNumber: String!
        password: String!
    }

    input loginUserInput {
        email: String
        phoneNumber: String
        password: String!
    }

    extend type Mutation {
        createAccount(data: createUserInput!): Response!
        completeAuthAndSignToken(otp: String!): Authenticated!
        login(data: loginUserInput!): Response
    }
`;