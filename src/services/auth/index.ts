import {
  ChangePasswordInput,
  CreateUser,
  LoginUser,
  NewPasswordInput,
  UserDocument,
} from "src/common/interfaces";
import {
  checkUserExist,
  createUser,
  getUserById,
  getUserByPhoneOrEmail,
} from "../user";
import { comparePassword, hashPassword } from "src/common/helpers";
import { createAuth } from "./auth";
import { isDevelopment } from "src/common/constants";
import createError from "http-errors";
import { sendNaloSms } from "../notifications/nalo";
import { passwordModel } from "src/models/password/passwordModel";

/**
 * Registers a new user by creating their account, hashing their password, and generating an OTP.
 *
 * @param data - The input data for creating a user, including phone number, email, and password.
 * @returns An object containing the created user and the generated OTP if in development mode.
 * @throws Will throw an error if the phone number or email already exists.
 */
export const register = async (data: CreateUser) => {
  const { phoneNumber, email, password } = data;

  await checkUserExist(phoneNumber, email!);

  const hash = await hashPassword(password);
  const user = await createUser({ ...data, password: hash });
  const otp = await createAuth(user._id, 5);

  const message = `Your SkillSwap OTP is ${otp}`;

  if (!(await sendNaloSms({ to: phoneNumber!, message }))) {
    throw createError.InternalServerError(
      "Failed to send OTP code at the moment, please try again later."
    );
  }

  if (isDevelopment) return { message: `Your login otp is ${otp}` };

  return {
    message: "User created successfully, please check your phone for the OTP.",
  };
};

/**
 * Logs in a user by verifying their credentials and generating an OTP.
 *
 * @param data - The input data for logging in a user, including phone number, email, and password.
 * @returns An object containing the generated OTP if in development mode.
 * @throws Will throw an error if the credentials are invalid.
 */
export const loginUser = async (data: LoginUser) => {
  const { phoneNumber, password } = data;

  const user = await getUserByPhoneOrEmail(phoneNumber);
  
  if (!user) throw createError.BadRequest("Invalid credentials");

  const isMatch = await comparePassword(password, user?.password!);

  if (!isMatch) throw createError.BadRequest("Invalid credentials");

  const otp = await createAuth(user?._id!, 5);

  const message = `Your SkillSwap OTP is ${otp}`;

  if (!(await sendNaloSms({ to: phoneNumber!, message }))) {
    throw createError.InternalServerError(
      "Failed to send OTP code at the moment, please try again later."
    );
  }

  if (isDevelopment) return { message: `Your login otp is ${otp}` };

  return {
    message: "User created successfully, please check your phone for the OTP.",
  };
};

/**
 * Updates a user's password by verifying the old password.
 * @param data - The input data for changing a user's password.
 * @throws error if the old password is incorrect or if the OTP cannot be sent.
 * @returns An object containing a message.
 */
export const updatePassword = async (data: ChangePasswordInput) => {
  const { userId, oldPassword, newPassword } = data;

  const user = await getUserById(userId);

  const isMatch = comparePassword(oldPassword, user?.password);

  if (!isMatch) throw createError.BadRequest("Old password is incorrect");

  const hash = await hashPassword(newPassword);

  await passwordModel.findOneAndUpdate(
    { userId },
    { userId, password: hash },
    { upsert: true }
  );

  const otp = await createAuth(user._id, 5);

  const message = `Your change password OTP is ${otp}`;

  if (!(await sendNaloSms({ to: user?.phoneNumber!, message }))) {
    throw createError.InternalServerError(
      "Failed to send OTP code at the moment, please try again later."
    );
  }

  return {
    message: "Please check your phone for the OTP to change your password.",
  };
};

/**
 * Handles the forget password functionality.
 * @param data - The input data for forgetting a user's password.
 * @throws error if the user does not exist or if the OTP cannot be sent.
 * @returns An object containing a message.
 */
export const changeNewPassword = async (data: NewPasswordInput) => {
  const { phoneNumber, newPassword } = data;

  console.log(phoneNumber)

  const user = await getUserByPhoneOrEmail(phoneNumber);

  console.log(user);

  const hash = await hashPassword(newPassword);

  await passwordModel.findOneAndUpdate(
    { userId: user?._id },
    { userId: user?._id, password: hash },
    { upsert: true }
  );

  const otp = await createAuth(user?._id!, 5);

  const message = `Your change password OTP is ${otp}`;

  if (!(await sendNaloSms({ to: user?.phoneNumber!, message }))) {
    throw createError.InternalServerError(
      "Failed to send OTP code at the moment, please try again later."
    );
  }
  return {
    message: "Please check your phone for the OTP to change your password.",
  };
};
