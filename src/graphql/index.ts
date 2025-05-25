import { mergeSchemas } from "@graphql-tools/schema";
import { generalResolver, generalTypeDefs } from "./general";
import { authResolvers, authTypeDefs } from "./auth";
import { userTypeDefs } from "./user";
import { userResolver } from "./user/resolvers";
import { swapsTypeDef } from "./swaps";
import { swapResolver } from "./swaps";
import { skillResolvers } from "./skills";
import { typeDefs as scalarTypeDefs, resolvers as scalarResolvers } from "graphql-scalars"

const typeDefs = [
    generalTypeDefs,
    authTypeDefs,
    userTypeDefs,
    scalarTypeDefs,
    swapsTypeDef
]

const resolvers = [
    generalResolver,
    authResolvers,
    userResolver,
    skillResolvers,
    scalarResolvers,
    swapResolver
]

export const schema = mergeSchemas({ typeDefs, resolvers })