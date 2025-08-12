export const reviewsTypeDefs = `#graphql
    type Review {
        id: ID!
        reviewerId: ID!
        revieweeId: ID!
        reviewer: User!
        reviewee: User!
        ratings: Int!
        comments: String
        createdAt: DateTime!
        updatedAt: DateTime!
    }

    type ReviewConnection {
        edges: [Review!]
        pageInfo: PageInfo
    }

    input Reviewfilters {
        reviewerId: ID
        revieweeId: ID
        ratings: Int
        page: Int
        limit: Int
        sortBy: String
        sortOrder: String
    }

    extend type Query {
        getUserReviews(userId: ID!): [Review!]!
        getReviews(filters: Reviewfilters!): ReviewConnection!
    }

    input CreateReviewInput {
        reviewerId: ID!
        revieweeId: ID!
        ratings: Int!
        comments: String
    }

    extend type Mutation {
        createReview(data: CreateReviewInput!): Review!
        deleteReview(revieweeId: ID!): Review!
    }
`