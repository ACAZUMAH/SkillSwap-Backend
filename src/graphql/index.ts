import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";
import { generalResolver, generalTypeDefs } from "./general";
import { authResolvers, authTypeDefs } from "./auth";
import { userTypeDefs } from "./user";
import { userResolver } from "./user/resolvers";
import { swapsTypeDef } from "./swaps";
import { swapResolver } from "./swaps";
import { skillResolvers } from "./skills";
import { typeDefs as scalarTypeDefs, resolvers as scalarResolvers } from "graphql-scalars"
import { chatResolver, chatTypeDefs } from "./Chats";
import { reviewsTypeDefs, reviewResolvers } from "./reviews";

const typeDefs = [
    generalTypeDefs,
    authTypeDefs,
    userTypeDefs,
    scalarTypeDefs,
    swapsTypeDef,
    chatTypeDefs,
    reviewsTypeDefs
]

const resolvers = [
    generalResolver,
    authResolvers,
    userResolver,
    skillResolvers,
    scalarResolvers,
    swapResolver,
    chatResolver,
    reviewResolvers
]

export const schema = makeExecutableSchema({ typeDefs, resolvers }) 