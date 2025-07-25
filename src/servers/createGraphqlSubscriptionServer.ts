import { GraphqlSubscriptionServer } from "src/common/interfaces";
// @ts-expect-errors
import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import { createDataloaders } from "src/dataloaders";

const context = async () => {
  const dataloaders = createDataloaders();

  return {
    ...dataloaders,
  };
}

export const createGraphQlSubscriptionServer = ({ httpServer, schema }: GraphqlSubscriptionServer) => {
  const wsServer = new WebSocketServer({
    path: "/graphql",
    server: httpServer,
  });
  const serverCleanUp = useServer({ schema, context }, wsServer );
  return serverCleanUp;
};
