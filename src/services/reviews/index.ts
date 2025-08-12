import { FilterQuery, Types } from "mongoose";
import createError from "http-errors";
import {
  ReviewData,
  ReviewDocument,
  ReviewFilters,
} from "src/common/interfaces";
import { reviewsModel } from "src/models";
import {
  getPageConnection,
  getSanitizeLimit,
  getSanitizeOffset,
  getSanitizePage,
} from "src/common/helpers";

/**
 * Creates a new review.
 *
 * @param data - The review data containing reviewerId, revieweeId, ratings, and optional comments.
 * @returns The created review document.
 * @throws Will throw an error if the reviewerId or revieweeId is invalid.
 */
export const createReview = async (data: ReviewData) => {
  if (
    !Types.ObjectId.isValid(data.reviewerId) ||
    !Types.ObjectId.isValid(data.revieweeId)
  ) {
    throw createError.BadRequest("Invalid reviewer or reviewee id");
  }

  const review = await reviewsModel.create({
    reviewerId: data.reviewerId,
    revieweeId: data.revieweeId,
    ratings: data.ratings,
    comments: data.comments,
  });

  return review;
};

/**
 *  Fetches all reviews for a specific user.
 * @param userId - The ID of the user whose reviews are to be fetched.
 * @throws Will throw an error if the userId is invalid.
 * @returns An array of review documents for the specified user.
 */
export const getUserReviews = async (userId: string) => {
  if (!Types.ObjectId.isValid(userId))
    throw createError.BadRequest("Invalid user id");

  const reviews = await reviewsModel.find({ revieweeId: userId });

  return reviews;
};

/**
 * Deletes a review by its ID.
 *
 * @param reviewId - The ID of the review to be deleted.
 * @returns The deleted review document.
 * @throws Will throw an error if the reviewId is invalid or if the review is not found.
 */
export const deleteReview = async (reviewId: string) => {
  if (!Types.ObjectId.isValid(reviewId))
    throw createError.BadRequest("Invalid review id");

  const review = await reviewsModel.findByIdAndDelete(reviewId);

  if (!review) throw createError.NotFound("Review not found");

  return review;
};

/**
 * Retrieves reviews based on the provided filters.
 *
 * @param filters - The filters to apply when fetching reviews.
 * @returns A paginated connection of reviews matching the filters.
 */
export const getReviews = async (filters: ReviewFilters) => {

  const query: FilterQuery<ReviewDocument> = {
    ...(filters.reviewerId && {
      reviewerId: filters.reviewerId,
    }),
    ...(filters.revieweeId && {
      revieweeId: filters.revieweeId,
    }),
    ...(filters.ratings && { ratings: filters.ratings }),
  };

  const page = getSanitizePage(filters.page);
  const limit = getSanitizeLimit(filters.limit);
  const offset = getSanitizeOffset(limit, page);

  const sortBy = filters.sortBy || "createdAt";
  const sortOrder = filters.sortOrder === "desc" ? -1 : 1;

  const options = {
    skip: offset,
    limit,
    sort: { [sortBy]: sortOrder },
  };

  const reviews = await reviewsModel.find(query, null, options);

  return getPageConnection(reviews, page, limit);
};
