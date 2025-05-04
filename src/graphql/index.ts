import { mergeSchemas } from "@graphql-tools/schema";
import { generalResolver, generalTypeDefs } from "./general";

const typeDefs = [
    generalTypeDefs
]

const resolvers = [
    generalResolver
]

export const schema = mergeSchemas({ typeDefs, resolvers })