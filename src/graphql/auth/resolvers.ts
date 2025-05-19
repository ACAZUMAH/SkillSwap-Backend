import { MutationCompleteAuthAndSignTokenArgs, MutationCreateUserAccountArgs, MutationLoginArgs } from "src/common/interfaces"
import { register, loginUser } from "src/services/auth"
import { verifyOtpAndSignJwt } from "src/services/auth/auth"

const createUserAccount = (_: any, args:MutationCreateUserAccountArgs) => {
    return register({ ...args.data })
}

const completeAuthAndSignToken = (_:any, { otp }: MutationCompleteAuthAndSignTokenArgs) => {
    return verifyOtpAndSignJwt(otp)
}

const login = (_: any, args: MutationLoginArgs) => {
    return loginUser({ ...args.data })
}

export const authResolvers = {
    Mutation: {
        createUserAccount,
        completeAuthAndSignToken,
        login
    }
}