import { GraphqlContext, GraphqlServer } from "src/common/interfaces";
import { createGraphQlSubscriptionServer } from "./createGraphqlSubscriptionServer";
import { ApolloServer, ContextFunction } from "@apollo/server";
import { formatError } from "./formatGraphqlErrors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ExpressContextFunctionArgument, expressMiddleware } from "@apollo/server/express4"
import { json } from "express";
import cors from 'cors'

const context: ContextFunction<[ExpressContextFunctionArgument], GraphqlContext> = async ({ req }) => {
    const user = req.user
    const token = req.token

    return {
        user,
        token
    }
}

export const createGraphQlServer = async ({ app, httpServer, schema }: GraphqlServer) => {
    const subscriptionServerCleanUp = createGraphQlSubscriptionServer({ httpServer, schema })
    const server = new ApolloServer({
        schema,
        formatError,
        plugins: [{
            async serverWillStart(){
                return {
                    async drainServer(){ await subscriptionServerCleanUp.dispose() }
                }
            }},
            ApolloServerPluginDrainHttpServer({ httpServer })
        ]
    })

    await server.start()

    const apolloExpressMiddlewares = expressMiddleware(server, { context })

    app.use("/grapql", cors(), json(), apolloExpressMiddlewares)

    return server
}