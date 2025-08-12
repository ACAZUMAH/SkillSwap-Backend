import {
  CreateUser,
  UserFilters,
  UpdateUser,
  UserDocument,
  RecommendationFilter,
  UpdatePassword,
} from "src/common/interfaces";
import { reviewsModel, userModel } from "src/models";
import { validateCreateUserData } from "./user-validation";
import createError from "http-errors";
import { FilterQuery, QueryOptions, Types } from "mongoose";
import {
  getPageConnection,
  getSanitizeLimit,
  getSanitizeOffset,
  getSanitizePage,
} from "src/common/helpers";

/**
 * Creates a new user in the database.
 *
 * @param data - The input data for creating a user.
 * @returns The created user document.
 * @throws Will throw an error if the input data is invalid.
 */
export const createUser = async (data: CreateUser) => {
  validateCreateUserData(data);

  const user = userModel.create({ ...data });

  return user;
};

/**
 * Retrieves all users from the database.
 *
 * @returns An array of user documents.
 */
export const getAllUsers = async () => {
  return await userModel.find().lean();
};

/**
 * Checks if a user already exists in the database based on phone number or email.
 *
 * @param phone - The phone number to check.
 * @param email - The email to check.
 * @throws Will throw an error if the phone number or email is already taken.
 */
export const checkUserExist = async (phone: string, email: string) => {
  if (await userModel.exists({ $or: [{ phoneNumber: phone, email }] })) {
    throw createError.BadRequest("Email or phone number taken");
  }
};

/**
 * Retrieves a user from the database by their ID.
 *
 * @param id - The ID of the user to retrieve.
 * @returns The user document if found.
 * @throws Will throw an error if the ID is invalid or the user is not found.
 */
export const getUserById = async (id: Types.ObjectId | string, indexes?: any) => {
  if (!Types.ObjectId.isValid(id)) throw createError.BadRequest("Invalid user id");

  const user = await userModel.findById(id, indexes).lean();

  if (!user) throw createError.NotFound("User with this id not found");

  return user;
};

/**
 * Retrieves a user from the database by their phone number or email.
 *
 * @param phoneNumber - The phone number to search for.
 * @param email - The email to search for.
 * @returns The user document if found.
 * @throws Will throw an error if the user does not exist.
 */
export const getUserByPhoneOrEmail = async (phoneNumber?: string | null, email?: string | null) => {
  if (!phoneNumber) throw createError.BadRequest("Phone number is required");

  const user = await userModel.findOne({ phoneNumber });

  if(!user)  throw createError(404, "User not found")

  return user;
};

/**
 * Updates the `isAuthenticated` status of a user in the database.
 *
 * @param id - The ID of the user to update.
 * @param bool - The new authentication status.
 * @returns The updated user document.
 */
export const updateIsAuthenticated = async (id: Types.ObjectId, bool: boolean) => {
  return await userModel.findByIdAndUpdate({ _id: id }, { isAuthenticated: bool });
};

/**
 * Updates a user's profile in the database with the provided data.
 *
 * @param data - The input data for updating the user's profile,
 * including optional fields like firstName, lastName, profile_img,
 * email, bio, availability, skillsOffered, and skillsWanted.
 * @returns The updated user document.
 * @throws Will throw an error if the user ID is invalid or the user is not found.
 */
export const updateUserProfile = async (data: UpdateUser) => {
  const user = await getUserById(data.id);

  const update = {
    ...(data.firstName && { firstName: data.firstName }),
    ...(data.lastName && { lastName: data.lastName }),
    ...(data.profile_img && { profile_img: data.profile_img }),
    ...(data.email && { email: data.email }),
    ...(data.bio && { bio: data.bio }),
    ...(data.gitHub && { gitHub: data.gitHub }),
    ...(data.linkedIn && { linkedIn: data.linkedIn }),
    ...(data.portfolio && { portfolio: data.portfolio }),
    ...(data.education && { education: data.education }),
    ...(data.isProfileComplete !== undefined && {
      isProfileComplete: data.isProfileComplete,
    }),
    ...(data.availability?.length! > 0 && { availability: data.availability }),
    ...(data.skillsProficientAt?.length! > 0 && {
      skillsProficientAt: data.skillsProficientAt,
    }),
    ...(data.skillsToLearn?.length! > 0 && {
      skillsToLearn: data.skillsToLearn,
    }),
  };

  const updated = await userModel.findByIdAndUpdate({ _id: user._id },{ $set: update },{ new: true });

  return updated;
};

/**
 * Updates a user's password in the database.
 *
 * @param data - The input data for updating the user's password, including userId and new password.
 * @returns The updated user document.
 * @throws Will throw an error if the user ID is invalid or the user is not found.
 */
export const updateUserPassword = async (data: UpdatePassword) => {
  return await userModel.findByIdAndUpdate(
    { _id: data.userId },
    { $set: { password: data.password } },
    { new: true }
  );
};

/**
 * Searches for users or skills based on the provided filters.
 *
 * @param data - The filters to apply, including userId, search term, limit, and page.
 * @returns A paginated connection of user documents matching the search criteria.
 */
export const searchUsersOrSkills = async (data: UserFilters) => {
  const query: FilterQuery<UserDocument> = {
    ...(data.userId && { _id: { $ne: data.userId } }), // Exclude current user
    ...(data.search && {
      $or: [
        { firstName: { $regex: data.search, $options: "i" } },
        { lastName: { $regex: data.search, $options: "i" } },
        { bio: { $regex: data.search, $options: "i" } },
        { availability: { $regex: data.search, $options: "i" } },
        { "education.institution": { $regex: data.search, $options: "i" } },
        { "skillsProficientAt.name": { $regex: data.search, $options: "i" } },
        { "skillsToLearn.name": { $regex: data.search, $options: "i" } },
      ],
    }),
  };

  const limit = getSanitizeLimit(data.limit);
  const page = getSanitizePage(data.page);
  const skip = getSanitizeOffset(limit, page);

  const options: QueryOptions = {
    limit: limit + 1,
    lean: true,
    page,
    skip,
    sort: { createdAt: 1 },
  };

  const result = await userModel.find(query, null, options);

  return getPageConnection(result, page, limit);
};

/**
 * Retrieves recommendations for a user based on their skills to learn.
 * @param filters - The filters for recommendations, including userId, limit, and page.
 * @returns A paginated connection of recommended users based on the user's skills to learn.
 * @throws Will throw an error if the userId is invalid or the user has no skills to learn.
 */
export const getRecommendations = async (filters: RecommendationFilter) => {
  const learner = await getUserById(filters.userId, {
    skillsToLearn: 1,
    skillsProficientAt: 1,
    education: 1,
  });

  if (!learner.skillsToLearn?.length) return [];

  const limit = getSanitizeLimit(filters.limit);
  const page = getSanitizePage(filters.page);
  const skip = getSanitizeOffset(limit, page);

  const skillLookUp = learner.skillsToLearn.reduce(
    (acc: { [key: string]: typeof skill.level }, skill) => {
      acc[skill.name] = skill.level;
      return acc;
    },
    {}
  );

  const desiredSkills = Object.keys(skillLookUp);

  const recommendations = await userModel.aggregate([
    {
      $match: {
        _id: { $ne: learner._id },
        "skillsProficientAt.name": { $in: desiredSkills },
      },
    },

    {
      $addFields: {
        originalSkills: "$skillsProficientAt",
      },
    },

    { $unwind: "$skillsProficientAt" },

    {
      $match: {
        "skillsProficientAt.name": { $in: desiredSkills },
        $expr: {
          $gte: [
            "$skillsProficientAt.level",
            skillLookUp["$skillsProficientAt.name"],
          ],
        },
      },
    },

    {
      $addFields: {
        mutualExchange: {
          $gt: [
            {
              $size: {
                $setIntersection: [
                  "$skillsToLearn.name",
                  learner.skillsProficientAt?.map((s) => s.name) || [],
                ],
              },
            },
            0,
          ],
        },
        levelDifference: {
          $subtract: [
            "$skillsProficientAt.level",
            skillLookUp["$skillsProficientAt.name"],
          ],
        },
        matchedSkill: "$skillsProficientAt",
      },
    },

    {
      $group: {
        _id: "$_id",
        originalUser: { $first: "$$ROOT" },
        allSkills: { $first: "$originalSkills" }, // Preserved from before unwind
        matchedSkills: { $push: "$matchedSkill" }, // Only matched skills
        mutualExchange: { $max: "$mutualExchange" },
        maxMatchScore: {
          $max: {
            $add: [
              0.4,
              {
                $multiply: [
                  0.2,
                  { $divide: [{ $ifNull: ["$levelDifference", 0] }, 3] },
                ],
              },
            ],
          },
        },
      },
    },

    {
      $addFields: {
        sortedSkills: {
          $concatArrays: [
            "$matchedSkills",
            {
              $filter: {
                input: "$allSkills",
                as: "skill",
                cond: {
                  $not: {
                    $in: ["$$skill.name", "$matchedSkills.name"],
                  },
                },
              },
            },
          ],
        },

        matchScore: {
          $add: [
            { $ifNull: ["$maxMatchScore", 0] },
            {
              $cond: [
                {
                  $eq: [
                    "$originalUser.education.institution",
                    learner.education?.institution,
                  ],
                },
                0.1,
                0,
              ],
            },
            {
              $multiply: [
                0.2,
                {
                  $divide: [{ $ifNull: ["$originalUser.averageRating", 0] }, 5],
                },
              ],
            },
            {
              $multiply: [0.1, { $cond: ["$mutualExchange", 1, 0] }],
            },
          ],
        },
      },
    },

    {
      $project: {
        _id: 0,
        user: {
          _id: "$originalUser._id",
          firstName: "$originalUser.firstName",
          lastName: "$originalUser.lastName",
          profile_img: "$originalUser.profile_img",
          bio: "$originalUser.bio",
          linkedIn: "$originalUser.linkedIn",
          gitHub: "$originalUser.gitHub",
          portfolio: "$originalUser.portfolio",
          averageRating: "$originalUser.averageRating",
          skillsProficientAt: "$sortedSkills",
          skillsToLearn: "$originalUser.skillsToLearn",
        },
        matchScore: 1,
        matchedSkills: "$matchedSkills",
        mutualExchange: 1,
      },
    },

    { $sort: { mutualExchange: -1, matchScore: -1 } },
    { $skip: skip },
    { $limit: limit + 1 },
  ]);
  return getPageConnection(recommendations, page, limit);
};

/** 
 * Updates the average rating of a user based on their reviews.
 *
 * @param userId - The ID of the user whose average rating needs to be updated.
 * @returns The updated average rating of the user.
 * @throws Will throw an error if the user ID is invalid.
 */
export const updateAverageRating = async (userId: string | Types.ObjectId) => {
  if (!Types.ObjectId.isValid(userId)) throw createError.BadRequest("Invalid user id");

  const reviews = await reviewsModel.find({ revieweeId: userId }).lean();

  if (!reviews.length) return;

  const totalRatings = reviews.reduce((acc, review) => acc + review.ratings, 0);
  const averageRating = totalRatings / reviews.length;

  await userModel.findByIdAndUpdate({ _id: userId },{ $set: { averageRating } },{ new: true });

  return averageRating;
}