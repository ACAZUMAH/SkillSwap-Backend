import { CreateUser, LoginUser, UserDocument } from "src/common/interfaces";
import { checkUserExist, createUser, getUserByPhoneOrEmail } from "../user";
import { comparePassword, hashPassword } from "src/common/helpers";
import { createAuth } from "./auth";
import { isDevelopment } from "src/common/constants";
import createError from "http-errors";
import { sendNaloSms } from "../notifications/nalo";

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
  const { phoneNumber, email, password } = data;
  console.log("data:", data)
  const user = await getUserByPhoneOrEmail(phoneNumber, email);
  console.log("user:", user)
  const isMatch = await comparePassword(password, user?.password!);
  console.log("isMatch:", isMatch)
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
