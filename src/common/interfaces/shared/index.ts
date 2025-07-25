import { BaseContext, ContextFunction } from "@apollo/server";
import { ExpressContextFunctionArgument } from "@apollo/server/dist/esm/express4";
import { Express } from "express";
import { GraphQLSchema } from "graphql";
import { Server } from "http";
import { Socket } from "socket.io";
import { createDataloaders } from "src/dataloaders";
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
  var socket: Socket;
  var onlineUsers: Map<string, string>;
  var userSocketMap: Map<string, string>;
}

type DataLoaderMap = ReturnType<typeof createDataloaders>;
export interface GraphqlContext extends BaseContext, DataLoaderMap {
  user?: any;
  token?: string;
}

export interface GraphqlServer {
  app: Express;
  httpServer: Server;
  schema: GraphQLSchema;
  context?: ContextFunction<[ExpressContextFunctionArgument], GraphqlContext>;
}

export interface GraphqlSubscriptionServer {
  httpServer: Server;
  schema: GraphQLSchema;
}
