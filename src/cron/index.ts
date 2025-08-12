import { CronJob } from "cron";
import { CronJobConfig } from "src/common/interfaces";
import logger from "src/loggers/logger";
import { scheduleUpdateUserAverageRating } from "src/services/user/cron";

const cronJobs: CronJobConfig[] = [
  {
    name: "Daily User Average Rating Update",
    schedule: "0 0 * * *", // Runs every day at midnight
    job: async () => {
      scheduleUpdateUserAverageRating();
    },
    start: true,
  },
];


export const applyCronJobs = () => {
    cronJobs.map((jobConfig) => {
        logger.info(`[Cron] Starting ${jobConfig.name}`);
        const job = new CronJob(
            jobConfig.schedule,
            async () => {
                try {
                    await jobConfig.job();
                    logger.info(`[Cron] Completed ${jobConfig.name}`);
                } catch (error) {
                    logger.error(`[Cron] Failed ${jobConfig.name}:`, error);
                }
            },
            null,
            true, // Start the job immediately
            "UTC", // Timezone
            undefined,
            jobConfig.start,
        );
        job.start();
    })
}