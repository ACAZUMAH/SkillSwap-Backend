import { NextFunction, Request, Response } from "express";
import logger from "src/loggers/logger";

export const logResponseTime = async (req: Request, res: Response, next: NextFunction) => {
    const startHrTime = process.hrtime()

    res.on('finish', () => {
        const elaspedHrTime = process.hrtime(startHrTime)
        const elaspedHrTimeInMs = elaspedHrTime[0] * 1000 + elaspedHrTime[1] / 1e6
        const message = `${req.method} ${res.statusCode} ${elaspedHrTimeInMs}ms\t${req.path}`
        logger.info(message)
    })

    next()
}