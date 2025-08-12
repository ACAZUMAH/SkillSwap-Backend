import logger from "src/loggers/logger";
import { getAllUsers, updateAverageRating } from "src/services/user";

export const scheduleUpdateUserAverageRating = async () => {
  logger.info("Starting daily user average rating update cron job...");
  const users = await getAllUsers();
  for (const user of users) {
    await updateAverageRating(user._id);
  }

  logger.info("Completed daily user average rating update cron job.");
};
