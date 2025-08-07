import { generateOtp, jwtSign } from "src/common/helpers";
import { authModel } from "src/models/auth";
import createError from 'http-errors'
import { getUserById, updateIsAuthenticated, updateUserPassword } from "../user";
import { Types } from "mongoose";
import { passwordModel } from "src/models/password/passwordModel";
import { generateToken04 } from "src/common/helpers/zegoServerAssistance";

/**
 * Creates or updates an authentication record for a user with a unique OTP.
 * 
 * @param userId - The ID of the user for whom the OTP is being generated.
 * @param len - The length of the OTP to generate.
 * @returns The generated OTP as a string.
 * @throws Will throw an error if the database operation fails.
 */
export const createAuth = async (userId: string | Types.ObjectId, len: number) => {
  let otp = generateOtp(len);
  while (await authModel.exists({ otp })) {
    otp = generateOtp(len);
  }
  const expiresIn = new Date(Date.now() + 1 * 60 * 60 * 1000);
  await authModel.findOneAndUpdate(
    { userId },
    { userId, otp, expiresIn },
    { upsert: true }
  );

  return otp
};

const generateZegoToken = async (userId: string | Types.ObjectId) => {
  const appId = parseInt(`${process.env.ZEGO_APP_ID}`);
  const serverSecret = `${process.env.ZEGO_SERVER_SECRET}`;
  const effectiveTimeInSeconds = 50 * 24 * 60 * 60; // 50 days in seconds
  const payload = '';
  if (!appId || !serverSecret) {
    throw createError.InternalServerError("Zego App ID or Server Secret is not configured");
  }

  const token = generateToken04(
    appId,
    userId.toString(),
    serverSecret,
    effectiveTimeInSeconds,
    payload
  )

  return token;
}


/**
 * Verifies an OTP, deletes the corresponding authentication record, and generates a JWT token.
 * 
 * @param otp - The OTP to verify.
 * @returns An object containing the authenticated user and a signed JWT token.
 * @throws Will throw an error if the OTP is invalid or expired.
 */
export const verifyOtpAndSignJwt = async (otp: string) => {
    const auth = await authModel.findOneAndDelete({ otp })

    if(!auth) throw createError.BadRequest("Invalid otp")
    
    if(new Date(auth.expiresIn) < new Date()) throw createError.BadRequest("Otp expired")

    const user = await getUserById(auth.userId)
    await updateIsAuthenticated(user._id, true)

    const token = jwtSign({ id: user._id })

    const zegoToken = await generateZegoToken(user._id);

    return { user, token, zegoToken }
}

/**
 * 
 * @param otp 
 * @returns 
 */
export const verifyAndSaveNewPassword = async (otp: string) => {
  const auth = await authModel.findOneAndDelete({ otp });

  if (!auth) throw createError.BadRequest("Invalid otp");

  if (new Date(auth.expiresIn) < new Date()) throw createError.BadRequest("Otp expired");

  const password = await passwordModel.findOne({ userId: auth.userId });

  if (!password) throw createError.NotFound("Unable to update password, Please try again later.");

  const user = await updateUserPassword({ userId: password?.userId, password: password?.password });

  if(user?._id) return { message: "Password updated successfully" };
}