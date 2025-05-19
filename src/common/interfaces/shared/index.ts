import { BaseContext, ContextFunction } from "@apollo/server"
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4"
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


export interface GraphqlContext extends BaseContext {
  user?: any;
  token?: string;
  skillRecommender: any;
}

export interface GraphqlServer {
  app: Express;
  httpServer: Server;
  schema: GraphQLSchema;
  context: ContextFunction<[ExpressContextFunctionArgument], GraphqlContext>;
}

export interface GraphqlSubscriptionServer {
    httpServer: Server,
    schema: GraphQLSchema 
}