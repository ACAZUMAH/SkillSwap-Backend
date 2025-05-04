import mongoose from "mongoose";
import logger from "src/loggers/logger";

const connectDB = async () => {
    const url = String(process.env.MONGODB_URL)

    mongoose.connection.on('connect', () => {
        logger.info("Connected to the mongoDB")
    })

    mongoose.connection.on('disconnect', () => {
        logger.error("Database disconnected")
    })

    mongoose.connection.on('error', (err) => {
        logger.error("Database error", err)
    })

    return mongoose.connect(url)
}

export default connectDB