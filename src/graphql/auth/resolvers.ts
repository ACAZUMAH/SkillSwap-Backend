import { MutationCompleteAuthAndSignTokenArgs, MutationCreateAccountArgs, MutationLoginArgs } from "src/common/interfaces"
import { register, loginUser } from "src/services/auth"
import { verifyOtpAndSignJwt } from "src/services/auth/auth"

const createAccount = (_: any, args:MutationCreateAccountArgs) => {
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
        createAccount,
        completeAuthAndSignToken,
        login
    }
}