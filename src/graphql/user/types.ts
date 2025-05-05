export const userTypeDefs = `#graphql 
    type User {
        id: ID!,
        profile_img: String
        firstName: String,
        lastNama: String,
        email: String, 
        phoneNumber: String!,
        bio: String,
        availability: String,
        password: String
        isAuthenticated: Boolean

        skillsOffered: [Skills]
        skillsWanted: [Skills]

        createdAt: DateTime!
        updateAt: DateTime!
    }


`;
