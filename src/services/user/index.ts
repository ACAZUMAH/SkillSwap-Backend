import {
  CreateUser,
  UserFilters,
  UpdateUser,
  UserDocument,
} from "src/common/interfaces";
import { userModel } from "src/models";
import { validateCreateUserData } from "./user-validation";
import createError from "http-errors";
import { FilterQuery, QueryOptions, Types } from "mongoose";
import { getPageConnection, getSanitizeLimit, getSanitizeOffset, getSanitizePage } from "src/common/helpers";

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
export const getUserById = async (id: Types.ObjectId | string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw createError.BadRequest("Invalid user id");
  }

  const user = await userModel.findById(id);

  if (!user) {
    throw createError.NotFound("User with this id not found");
  }
  return user;
};

/**
 * Retrieves a user from the database by their phone number or email.
 *
 * @param phone - The phone number to search for.
 * @param email - The email to search for.
 * @returns The user document if found.
 * @throws Will throw an error if the user does not exist.
 */
export const getUserByPhoneOrEmail = async (phone: string, email: string) => {
  const user = await userModel.findOne({ phoneNumber: phone, email });
  if (!user) {
    throw createError.NotFound("User does not exist");
  }
  return user;
};

/**
 * Updates the `isAuthenticated` status of a user in the database.
 *
 * @param id - The ID of the user to update.
 * @param bool - The new authentication status.
 * @returns The updated user document.
 */
export const updateIsAuthenticated = async (
  id: Types.ObjectId,
  bool: boolean
) => {
  return await userModel.findByIdAndUpdate(
    { _id: id },
    { isAuthenticated: bool }
  );
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
    ...(data.availability && { availability: data.availability }),
    ...(data.skillsProficientAt?.length && {
      skillsProficientAt: data.skillsProficientAt,
    }),
    ...(data.skillsToLearn?.length && { skillsToLearn: data.skillsToLearn }),
  };

  return await userModel.findByIdAndUpdate(
    { _id: user._id },
    { $set: update },
    { new: true }
  );
};

export const searchUsersOrSkills = async (data: UserFilters) => {
  const query: FilterQuery<UserDocument> = {
    ...(data.firstName && { firstName: data.firstName }),
    ...(data.lastName && { lastName: data.lastName }),
    ...(data.availability && { availability: data.availability }),
    ...(data.search && {
      $or: [
        { firstName: { $regex: data.search, $options: "i" } },
        { lastName: { $regex: data.search, $options: "i" } },
        { bio: { $regex: data.search, $options: "i" } },
        { availability: { $regex: data.search, $options: "i" } },
        { "education.institution": { $regex: data.search, $options: "i" } },
        { "skillsProficientAt.name": { $regex: data.search, $options: "i" } },
      ],
    }),
  };

  const limit = getSanitizeLimit(data.limit)
  const page = getSanitizePage(data.page)
  const skip = getSanitizeOffset(limit, page)

  const oprions: QueryOptions = {
    limit: limit + 1,
    page,
    skip,
    sort: { createdAt: 1 }
  }

  const result = await userModel.find(query, null, oprions)

  //console.log(result)

  return getPageConnection(result, page, limit)
};
