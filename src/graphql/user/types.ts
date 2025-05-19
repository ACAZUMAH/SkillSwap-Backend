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
        updateAt: DateTime!
    }

    type Recomendation {
        user: User
        matchScore: Float
        matchedSkill: String
        levelDifference: Int
    }

    input Filters {
        limit: Int
        page: Int
        firstName: String
        lastName: String
        availability: String
        search: String
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

    extend type Query {
        search(filters: Filters): PageConnection
        recommendation: [Recomendation]
    }

    extend type Mutation {
        updateUser(data: UpdateUserInput): User!
    }
`;
