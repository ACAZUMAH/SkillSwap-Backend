import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { GraphqlContext } from "src/common/interfaces";
import { createDataloaders } from "src/dataloaders";

export const createContext = (skillRecommender: any) => {
    return async ({ req }: ExpressContextFunctionArgument): Promise<GraphqlContext> => {
        const user = req.user
        const token = req.token
        const dataloaders = createDataloaders();
        
        return {
            user,
            token,
            skillRecommender,
            ...dataloaders
        }
    };
}