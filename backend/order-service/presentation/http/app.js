import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { createOrdersRouter } from "./routes/orders.routes.js";

export function createApp(deps) {
    const app = express();

    app.use(express.json());

    app.get("/health", (req, res) => {
        res.json({ status: "ok" });
    });

    app.use("/api/orders", createOrdersRouter(deps));

    app.use(errorHandler);

    return app;
}
