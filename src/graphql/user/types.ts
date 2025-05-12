export const userTypeDefs = `#graphql 

    type User {
        id: ID!
        profile_img: String
        firstName: String
        lastName: String
        email: String
        phoneNumber: String!
        bio: String
        gitHub: String
        linkedIn: String
        portfolio: String
        averageRating: Int
        availability: String
        education: Education
        password: String
        isAuthenticated: Boolean

        skillsProficientAt: [Skill]
        skillsToLearn: [Skill]

        createdAt: DateTime!
        updateAt: DateTime!
    }

    input updateUserInput {
        profile_img: String
        firstName: String
        lastName: String
        email: String
        bio: String
        gitHub: String
        linkedIn: String
        portfolio: String
        availability: String
        education: EducationInput
        skillsProficientAt: [SkillInput!]
        skillsToLearn: [SkillInput!]
    }

    extend type Mutation {
        updateUser(data: updateUserInput): User!
    }
`;
