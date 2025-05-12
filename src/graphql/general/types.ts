export const generalTypeDefs = `#graphql
    enum EducationLevel {
        HIGH_SCHOOL
        MIDDLE_SCHOOL
        COLLEGE
    }
    
    type Education {
        level: EducationLevel
        institution: String
        degree: String
        endDate: DateTime
    }

    input EducationInput {
        level: EducationLevel!
        institution: String!
        degree: String!
        endDate: Date!
    }

    type Skill {
        skill: String!  
        level: Int!
    }

    input SkillInput {
        skill: String!
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
