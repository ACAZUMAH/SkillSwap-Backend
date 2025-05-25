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
        lastNama: String
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
        createUserAccount(data: createUserInput!): Response!
        completeAuthAndSignToken(otp: String!): Authenticated!
        login(data: loginUserInput!): Response
    }
`;