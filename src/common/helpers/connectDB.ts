import mongoose from "mongoose";
import logger from "../../loggers/logger";

const connectDB = async () => {
    const url = String(process.env.MONGODB_URL)

    mongoose.connection.on('connected', () => {
        logger.info("Connected to the mongoDB")
    })

    mongoose.connection.on('disconnected', () => {
        logger.error("Database disconnected")
    })

    mongoose.connection.on('error', (err) => {
        logger.error("Database error", err)
    })

    return await mongoose.connect(url)
}

export default connectDB