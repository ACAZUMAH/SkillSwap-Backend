import { config } from "dotenv";
import logger from "./loggers/logger";

const main = async () => {
    config()

    const server = await import("./app")

    server.default()
}

main().catch((err: Error) => {
    logger.error(`An unhadle error occured ${err}`)
    process.exit(1)
})

process.on("SIGINT", () => {
    logger.info('Server shutting down')
    setTimeout(() => {
        process.exit(0)
    }, 1000)
})

process.on("SIGTERM", () => {
    logger.info(`Server shutting down`)
    setTimeout(() => {
        process.exit(0)
    }, 1000)
})