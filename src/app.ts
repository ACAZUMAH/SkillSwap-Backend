require("express-async-errors");
import http from "http";
import { createExpressApp } from "./servers/createExpressApp";
import logger from "./loggers/logger";
import { createGraphQlServer } from "./servers/createGraphqlServer";
import { schema } from "./graphql";
import createError from "http-errors";
import connectDB from "./common/helpers/connectDB";
import { errorHandler } from "./middlewares/error-handler";
import { applyMiddlewares } from "./middlewares";
import { createSocketIoServer } from "./servers/createSocketIoServer";

const PORT = process.env.PORT || 8800;

const startServer = async () => {
  const app = createExpressApp();

  const httpServer = http.createServer(app);

  applyMiddlewares(app);

  await connectDB();

  await createGraphQlServer({ app, httpServer, schema });

  createSocketIoServer(httpServer);

  app.use(errorHandler as any);

  app.all("*", (_req, _res, next) => {
    return next(createError(400, "Unable to retrive the request resource!"));
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );

  logger.info(`🚀 Server ready at http://localhost:${PORT}`);
  logger.info(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`);
};

export default startServer;
