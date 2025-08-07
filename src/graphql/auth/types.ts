export const authTypeDefs = `#graphql
    type Authenticated {
        user: User!
        token: String,
        zegoToken: String
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

    input UpdatePasswordInput {
        oldPassword: String!
        newPassword: String!
    }

    input ForgetPasswordInput {
        phoneNumber: String!
        newPassword: String!
    }

    extend type Mutation {
        createAccount(data: createUserInput!): Response!
        completeAuthAndSignToken(otp: String!): Authenticated!
        login(data: loginUserInput!): Response
        changePassword(data: UpdatePasswordInput!): Response!
        verifyOtpAndSaveNewPassword(otp: String!): Response!
        forgetPassword(data: ForgetPasswordInput!): Response!
    }
`;