import { NextFunction, Request, Response } from "express";
import logger from "src/loggers/logger";
import createError from "http-errors";
import { constructHTTPResponse } from "src/common/helpers";

export const errorHandler = async (error: any, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error);

  if (createError.isHttpError(error)) {
    res.status(error.status).json(constructHTTPResponse(null, error));
  }

  if (process.env.NODE_ENV !== "production") {
    res
      .status(500)
      .json(
        constructHTTPResponse(
          null,
          createError(500, error.message, { details: error.stack })
        )
      );
  }

  res
    .status(500)
    .json(constructHTTPResponse(null, createError(500, "Server error")));
};
