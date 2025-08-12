import {
    GraphqlContext,
  MutationCreateReviewArgs,
  MutationDeleteReviewArgs,
  QueryGetReviewsArgs,
  QueryGetUserReviewsArgs,
  ReviewDocument,
} from "src/common/interfaces";
import * as services from "src/services/reviews";

const createReview = (_: any, args: MutationCreateReviewArgs) => {
  return services.createReview({ ...args?.data });
};

const getUserReviews = (_: any, args: QueryGetUserReviewsArgs) => {
  return services.getUserReviews(args.userId);
};

const getReviews = (_: any, args: QueryGetReviewsArgs) => {
  return services.getReviews({ ...args?.filters });
};

const deleteReview = (_: any, args: MutationDeleteReviewArgs) => {
    return services.deleteReview(args.revieweeId);
};

const id = (parent: ReviewDocument) => parent._id.toString();

const reviewer = (parent: ReviewDocument, _: any, { userLoader }: GraphqlContext) => {
  return parent.reviewerId ? userLoader.load(parent.reviewerId.toString()) : null
}

const reviewee = (parent: ReviewDocument, _: any, { userLoader }: GraphqlContext) => {
  return parent.revieweeId ? userLoader.load(parent.revieweeId.toString()) : null
};

export const reviewResolvers = {
  Query: {
    getUserReviews,
    getReviews,
  },
  Review: {
    id,
    reviewer,
    reviewee,
  },
  Mutation: {
    createReview,
    deleteReview,
  },
};
