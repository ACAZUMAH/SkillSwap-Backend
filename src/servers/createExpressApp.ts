import express, { Request, Response } from "express";
import cors from "cors";
import { isDevelopment, isProduction, whitelist } from "src/common/constants";
import helmet, { HelmetOptions } from "helmet";

const helmetOptions: HelmetOptions = {
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
};

const corsOptions = {
  maxAge: 600,
  credentials: true,
  //preflightContinue: true,
  origin: (
    origin: any,
    callback: (err: Error | null, allowed?: boolean) => void
  ) => {
    if (!origin) return callback(null, true);
    if (isDevelopment) return callback(null, true);
    if (isProduction && whitelist.includes(origin)) return callback(null, true);
    console.warn("[CORS] Blocked origin:", origin, {
      isProduction,
      whitelist,
    });
    return callback(new Error(`Not allowed by CORS: ${origin}`), false);
  },
};

export const createExpressApp = () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));

  app.use(express.json({ limit: "50mb" }));

  app.use(helmet(helmetOptions));
  app.use(helmet.hidePoweredBy());
  app.disable("x-powered-by");

  app.use(cors(corsOptions));

  app.options("*", cors(corsOptions));

  app.get("/", (_req: Request, res: Response) => {
    res.send("hello world");
  });

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  return app;
};
