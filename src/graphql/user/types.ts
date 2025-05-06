export const userTypeDefs = `#graphql 
    type User {
        id: ID!
        profile_img: String
        firstName: String
        lastNama: String
        email: String
        phoneNumber: String!
        bio: String
        availability: String
        password: String
        isAuthenticated: Boolean

        skillsOffered: [Skill]
        skillsWanted: [Skill]

        createdAt: DateTime!
        updateAt: DateTime!
    }

    input updateUserInput {
        profile_img: String
        firstName: String
        lastNama: String
        email: String,
        bio: String
        availability: String
        skillsOffered: [SkillInput!]
        skillsWanted: [SkillInput!]
    }

    extend type Mutation {
        updateUser(data: updateUserInput): User!
    }
`;
