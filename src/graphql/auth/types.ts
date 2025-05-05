export const authTypeDefs = `#graphql

    type Authenticated {
        user: User!,
        token: 
    }

    input createUserInput {
        firstName: String,
        lastNama: String,
        email: String,
        phoneNumber: String!,
        password: String
    }

    extend type Mutation {
        createUserAccount(data: createUserInput!): String!
        completeAuthAndSignToken(otp: String!): Authenticated!
    }
`;