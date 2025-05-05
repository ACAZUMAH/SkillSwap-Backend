import { createUserInput } from "src/common/interfaces";
import { checkUserExist, createUser } from "../user";
import { hashPassword } from "src/common/helpers";
import { createAuth } from "./auth";
import { isDevelopment } from "src/common/constants";

/**
 * Registers a new user by creating their account, hashing their password, and generating an OTP.
 * 
 * @param data - The input data for creating a user, including phone number, email, and password.
 * @returns An object containing the created user and the generated OTP if in development mode.
 * @throws Will throw an error if the phone number or email already exists.
 */
export const registerUser = async (data: createUserInput) => {
    const { phoneNumber, email, password } = data

    await checkUserExist(phoneNumber, email)

    const hash = await hashPassword(password)
    const  user = await createUser({ ...data, password: hash })
    const otp = await createAuth(user._id, 5)

    if(isDevelopment) return `Your login otp is ${otp}`
}

export const loginUser = async () => {
    
}