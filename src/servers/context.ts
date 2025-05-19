import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { GraphqlContext } from "src/common/interfaces";

export const createContext = (skillRecommender: any) => {
    return async ({ req }: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
        const user = req.user
        const token = req.token

        return {
            user,
            token,
            skillRecommender
        }
    };
}