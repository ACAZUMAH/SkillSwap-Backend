import {
  GraphqlContext,
  MutationChangePasswordArgs,
  MutationCompleteAuthAndSignTokenArgs,
  MutationCreateAccountArgs,
  MutationLoginArgs,
  MutationVerifyOtpAndSaveNewPasswordArgs,
} from "src/common/interfaces";
import { register, loginUser, updatePassword } from "src/services/auth";
import { verifyAndSaveNewPassword, verifyOtpAndSignJwt } from "src/services/auth/auth";

const createAccount = (_: any, args: MutationCreateAccountArgs) => {
  return register({ ...args.data });
};

const completeAuthAndSignToken = (_: any, { otp }: MutationCompleteAuthAndSignTokenArgs) => {
  return verifyOtpAndSignJwt(otp);
};

const login = (_: any, args: MutationLoginArgs) => {
  return loginUser({ ...args.data });
};

const changePassword = async ( _: any, args: MutationChangePasswordArgs, { user }: GraphqlContext) => {
  return updatePassword({ ...args.data, userId: user?._id });
};

const verifyOtpAndSaveNewPassword = async (_: any, { otp }: MutationVerifyOtpAndSaveNewPasswordArgs) => {
  return await verifyAndSaveNewPassword(otp);
}

export const authResolvers = {
  Mutation: {
    createAccount,
    completeAuthAndSignToken,
    login,
    changePassword,
    verifyOtpAndSaveNewPassword,
  },
};
