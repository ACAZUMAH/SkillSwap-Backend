import {
  GraphqlContext,
  MutationChangePasswordArgs,
  MutationCompleteAuthAndSignTokenArgs,
  MutationCreateAccountArgs,
  MutationForgetPasswordArgs,
  MutationLoginArgs,
  MutationVerifyOtpAndSaveNewPasswordArgs,
} from "src/common/interfaces";
import { register, loginUser, updatePassword, changeNewPassword } from "src/services/auth";
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

const changePassword = ( _: any, args: MutationChangePasswordArgs, { user }: GraphqlContext) => {
  return updatePassword({ ...args.data, userId: user?._id });
};

const verifyOtpAndSaveNewPassword = (_: any, { otp }: MutationVerifyOtpAndSaveNewPasswordArgs) => {
  return verifyAndSaveNewPassword(otp);
}

const forgetPassword = (_: any, args:MutationForgetPasswordArgs) => {
  return changeNewPassword({ ...args.data });
}

export const authResolvers = {
  Mutation: {
    createAccount,
    completeAuthAndSignToken,
    login,
    changePassword,
    verifyOtpAndSaveNewPassword,
    forgetPassword,
  },
};
