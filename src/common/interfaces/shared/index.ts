import { BaseContext } from "@apollo/server"
import { Express } from "express"
import { GraphQLSchema } from "graphql"
import { Server } from "http"

declare global {
    namespace Express {
        interface Request {
            user?: any,
            token?: string
        }
    }
}

export interface GraphqlServer {
    app: Express,
    httpServer: Server,
    schema: GraphQLSchema
}

export interface GraphqlContext extends BaseContext {
    user?: any,
    token?: string
}

export interface GraphqlSubscriptionServer {
    httpServer: Server,
    schema: GraphQLSchema 
}