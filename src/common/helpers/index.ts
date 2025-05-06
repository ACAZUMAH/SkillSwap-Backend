import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "http-errors";

/**
 * Signs a JSON object into a JWT token.
 *
 * @param obj - The object to be signed into a JWT.
 * @returns A signed JWT token as a string.
 */
export const jwtSign = (obj: object) => {
  return jwt.sign(obj, `${process.env.JWT_SECRET}`, { expiresIn: "50d" });
};

/**
 * Verifies a JWT token and decodes its payload.
 *
 * @param token - The JWT token to verify.
 * @returns The decoded payload of the token if valid.
 * @throws Will throw an error if the token is invalid or expired.
 */
export const jwtVerify = (token: string) => {
  return jwt.verify(token, `${process.env.JWT_SECRET}`);
};

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param password - The plain text password to hash.
 * @returns A hashed version of the password.
 * @throws Will throw an error if hashing fails.
 */
export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error("Unable to hash password");
  }
};

/**
 * Compares a plain text password with a hashed password.
 *
 * @param password - The plain text password to compare.
 * @param hash - The hashed password to compare against.
 * @returns A boolean indicating whether the passwords match.
 * @throws Will throw an error if comparison fails.
 */
export const comparePassword = async (password: string, hash: string) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    throw new Error("Unable to compare password");
  }
};

/**
 * Constructs a standardized HTTP response object.
 *
 * @param data - The data to include in the response (default is null).
 * @param error - An optional error object of type createError.HttpError to include in the response.
 * @returns An object containing the response data and error details (if any).
 */
export const constructHTTPResponse = (data: any = null, error: null | createError.HttpError = null) => {
    const jsonResponse = {
        data: data ? data : null,
        errors: error ? { message: error.message, details: null } : null
    }
    if(jsonResponse.errors && error?.details) {
        jsonResponse.errors.details = error?.details
    }

    return jsonResponse
};

/**
 * Generates a random numeric OTP (One-Time Password) of the specified length.
 *
 * @param len - The length of the OTP to generate.
 * @returns A string representing the generated OTP.
 */
export const generateOtp = (len: number) => {
  const chars = "0123456789";
  const charLength = chars.length;
  let otp = "";
  for (let i = 0; i < len; i++) {
    otp += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return otp;
};
