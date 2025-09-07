import { Router, Express} from "express";
import pushSubscriptionRouter from "./push.router"

const routes: { path: string, router: Router }[] = [
    {
        path: '/api',
        router: pushSubscriptionRouter
    }
]


export const applyAppRouters = (app: Express) => {
    routes.map((route) => app.use(route.path, route.router))
}