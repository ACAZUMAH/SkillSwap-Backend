import { mergeSchemas } from "@graphql-tools/schema";
import { generalResolver, generalTypeDefs } from "./general";
import { authResolvers, authTypeDefs } from "./auth";
import { userTypeDefs } from "./user";
import { typeDefs as scalarTypeDefs, resolvers as scalarResolvers } from "graphql-scalars"
import { userResolver } from "./user/resolvers";

const typeDefs = [
    generalTypeDefs,
    authTypeDefs,
    userTypeDefs,
    scalarTypeDefs
]

const resolvers = [
    generalResolver,
    authResolvers,
    userResolver,
    scalarResolvers
]

export const schema = mergeSchemas({ typeDefs, resolvers })