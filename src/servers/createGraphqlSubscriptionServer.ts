import { GraphqlSubscriptionServer } from "src/common/interfaces";
// @ts-expect-errors
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import logger from "src/loggers/logger";

export const createGraphQlSubscriptionServer = ({
  httpServer,
  schema,
}: GraphqlSubscriptionServer) => {
  const wsServer = new WebSocketServer({
    path: "/graphql",
    server: httpServer,
  });

  logger.info("🚀 WebSocket server created on path: /graphql");

  const serverCleanUp = useServer(
    {
      schema,
      onConnect: (_ctx: any) => {
        logger.info("🔌 WebSocket client connected");
        return true;
      },
      onDisconnect: () => {
        logger.error("🔌 WebSocket client disconnected");
      },
      onSubscribe: (_ctx: any, msg: any) => {
        logger.info("📡 New subscription started:")
        console.log("subcription query", msg?.payload?.query);
        if (!msg?.payload?.query) {
          logger.error("❌ Invalid subscription: No query provided");
          return false;
        }
        return true;
      },
      onNext: (_ctx: any, _msg: any, _args: any, result: any) => {
        logger.info("📡 Subscription data sent");
        return result;
      },
      onError: (_ctx: any, _msg: any, errors: any) => {
        logger.error("❌ Subscription error:", errors);
      },
    },
    wsServer
  );

  return serverCleanUp;
};
