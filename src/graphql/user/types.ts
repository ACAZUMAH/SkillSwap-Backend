export const userTypeDefs = `#graphql 
    type Education {
        level: String
        institution: String
        degree: String
        endDate: DateTime
    }

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
        updatedAt: DateTime!
    }

    type Recomendation { 
        user: User
        matchScore: Float
        matchedSkill: String
        levelDifference: Int
    }

    type UserConnection {
        edges: [User]
        pageInfo: PageInfo
    }

    input Filters {
        limit: Int
        page: Int
        userId: String
        firstName: String
        lastName: String
        availability: String
        search: String
    }

    extend type Query {
        me: User
        search(filters: Filters): UserConnection
        recommendation: [Recomendation]
    }
    
    input EducationInput {
        level: String!
        institution: String!
        degree: String!
        endDate: Date!
    }

    input UpdateUserInput {
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
        updateUser(data: UpdateUserInput): User!
    }
`;
