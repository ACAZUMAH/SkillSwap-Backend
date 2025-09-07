import { Router } from "express";
import { pushSubscriptionController } from "src/controllers";

const routes = Router();

routes.post('/subscribe', pushSubscriptionController)

export default routes;