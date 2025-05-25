import { createUserLoader } from "./user";

export const createDataloaders = () => ({
    userLoader: createUserLoader()
});