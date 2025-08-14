export interface CronJobConfig {
    name: string;
    schedule: string;
    job: () => Promise<void>;
    runOnInit?: boolean;
}