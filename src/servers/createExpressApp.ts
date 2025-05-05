import express, { Request, Response } from "express";
export const createExpressApp = () => {

    const app = express()

    app.use(express.urlencoded({ extended: true }))

    app.use(express.json({ limit: "50mb" }))

    app.get('/', (_req: Request, res: Response) => {
        res.send("hello wolrd")
    })

    return app 
};
