import { makeExecutableSchema, mergeSchemas } from "@graphql-tools/schema";
import { generalResolver, generalTypeDefs } from "./general";
import { authResolvers, authTypeDefs } from "./auth";
import { userTypeDefs } from "./user";
import { userResolver } from "./user/resolvers";
import { swapsTypeDef } from "./swaps";
import { swapResolver } from "./swaps";
import { skillResolvers } from "./skills";
import { typeDefs as scalarTypeDefs, resolvers as scalarResolvers } from "graphql-scalars"
import { chatResolver, chatTypeDeffs } from "./Chats";
import { messageResolvers } from "./message";

const typeDefs = [
    generalTypeDefs,
    authTypeDefs,
    userTypeDefs,
    scalarTypeDefs,
    swapsTypeDef,
    chatTypeDeffs
]

const resolvers = [
    generalResolver,
    authResolvers,
    userResolver,
    skillResolvers,
    scalarResolvers,
    swapResolver,
    chatResolver,
    messageResolvers
]

export const schema = makeExecutableSchema({ typeDefs, resolvers }) 