import { GraphqlSubscriptionServer } from "src/common/interfaces"
// @ts-expect-errors
import { useServer } from 'graphql-ws/use/ws';
import { WebSocketServer } from "ws"

export const createGraphQlSubscriptionServer = ({ httpServer, schema }: GraphqlSubscriptionServer) => {
    const wsServer = new WebSocketServer({
        path: "/grapql",
        server: httpServer
    })

    const serverCleanUp = useServer({ schema }, wsServer)

    return serverCleanUp
}