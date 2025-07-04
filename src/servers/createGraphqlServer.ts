import cors from 'cors'
import { json } from "express";
import { GraphqlContext, GraphqlServer } from "src/common/interfaces";
import { createGraphQlSubscriptionServer } from "./createGraphqlSubscriptionServer";
import { ApolloServer, ContextFunction } from "@apollo/server";
import { formatError } from "./formatGraphqlErrors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { ExpressContextFunctionArgument, expressMiddleware } from "@apollo/server/express4"
import { isProduction } from "src/common/constants";
import { createDataloaders } from 'src/dataloaders';

const context: ContextFunction<[ExpressContextFunctionArgument], GraphqlContext> = async ({ req }) => {
    const user = req.user
    const token = req.token
    const dataloaders = createDataloaders();
        
    return {
        user,
        token,
        ...dataloaders
    }
}

export const createGraphQlServer = async ({ app, httpServer, schema }: GraphqlServer) => {

    const subscriptionServerCleanUp = createGraphQlSubscriptionServer({ httpServer, schema })

    const server = new ApolloServer({
        schema,
        formatError,
        introspection: !isProduction,
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

    // @ts-expect-errors
    app.use("/graphql", cors(), json(), apolloExpressMiddlewares)

    return server
}