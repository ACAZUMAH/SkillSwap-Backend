import { MutationCompleteAuthAndSignTokenArgs, MutationCreateUserAccountArgs } from "src/common/interfaces"
import { registerUser, loginUser } from "src/services/auth"
import { verifyOtpAndSignJwt } from "src/services/auth/auth"

const createUserAccount = (_: any, args:MutationCreateUserAccountArgs) => {
    return registerUser({ ...args.data })
}

const completeAuthAndSignToken = (_:any, { otp }: MutationCompleteAuthAndSignTokenArgs) => {
    return verifyOtpAndSignJwt(otp)
}

export const authResolvers = {
    Mutation: {
        createUserAccount,
        completeAuthAndSignToken
    }
}