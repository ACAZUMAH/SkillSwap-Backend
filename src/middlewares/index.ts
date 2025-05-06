import { Express } from "express";
import { logResponseTime } from "./response-log";
import { verifyToken } from "./verify-token";

const middlewares = [verifyToken, logResponseTime]

export const applyMiddlewares = (app: Express) => {
    middlewares.map((middleware) => app.use(middleware))
}