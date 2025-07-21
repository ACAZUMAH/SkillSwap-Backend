export const userTypeDefs = `#graphql 
    type Education {
        level: String
        institution: String
        fieldOfStudy: String
        degree: String
        startDate: DateTime
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
        availability: [String]
        education: Education
        isProfileComplete: Boolean
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
        matchedSkill: [Skill]
        levelDifference: Int
        mutualExchange: Boolean
    }

    type UserConnection {
        edges: [User]
        pageInfo: PageInfo
    }

    type RecomendationConnection {
        edges: [Recomendation]
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

    input recommendationFilters {
        userId: String
        limit: Int
        page: Int
    }

    extend type Query {
        me: User
        user(id: ID!): User
        search(filters: Filters): UserConnection
        recommendation(filters: recommendationFilters): RecomendationConnection
    }
    
    input EducationInput {
        level: String
        institution: String
        degree: String
        fieldOfStudy: String
        startDate: DateTime
        endDate: DateTime
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
        availability: [String]
        education: EducationInput
        isProfileComplete: Boolean
        skillsProficientAt: [SkillInput]
        skillsToLearn: [SkillInput]
    }

    extend type Mutation {
        updateUser(data: UpdateUserInput): User!
    }
`;
