import cors from 'cors'
import { json } from "express";
import { GraphqlServer } from "src/common/interfaces";
import { createGraphQlSubscriptionServer } from "./createGraphqlSubscriptionServer";
import { ApolloServer } from "@apollo/server";
import { formatError } from "./formatGraphqlErrors";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4"
import { isProduction } from "src/common/constants";

// const context: ContextFunction<[ExpressContextFunctionArgument], GraphqlContext> = async ({ req }) => {
//     const user = req.user
//     const token = req.token
        
//     return {
//         user,
//         token
//     }
// }

export const createGraphQlServer = async ({ app, httpServer, schema, context }: GraphqlServer) => {

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