import { createUserInput } from "src/common/interfaces";
import { userModel } from "src/models";
import { validateCreateUserData } from "./user-validation";
import createError from "http-errors"
import { Types } from "mongoose";

/**
 * Creates a new user in the database.
 * 
 * @param data - The input data for creating a user
 * @returns The created user document.
 * @throws Will throw an error if the input data is invalid.
 */
export const createUser = async (data: createUserInput) => {
  validateCreateUserData(data);

  const user = userModel.create({ data });

  return user;
};

export const checkUserExist = async (phone: string, email: string) => {
    if(await userModel.exists({ $or: [{ phoneNumber: phone, email }]})){
        throw createError.BadRequest("Email or phone number taken")
    }
}

export const upsertUser = async () => {

}

export const getUserById = async (id: Types.ObjectId | string) => {
    if(!Types.ObjectId.isValid(id)){
        throw createError.BadRequest("Invalid user id")
    }

    const user = await userModel.findById(id)

    if(!user){
        throw createError.NotFound("User with this id not found")
    }

    return user
}

export const updateIsAuthenticated = async (id: Types.ObjectId, bool: boolean) => {
    return await userModel.findByIdAndUpdate({ _id: id }, { isAuthenticated: bool })
}