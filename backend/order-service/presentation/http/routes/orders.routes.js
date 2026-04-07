import { Router } from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { requireAuth } from "../middleware/requireAuth.js";

export function createOrdersRouter(deps) {
    const router = Router();

    router.get(
        "/my",
        requireAuth,
        asyncHandler(async (req, res) => {
            const orders = await deps.listOrdersByUserUseCase.execute(
                req.userId
            );
            res.json(orders);
        })
    );

    router.post(
        "/checkout",
        requireAuth,
        asyncHandler(async (req, res) => {
            const result = await deps.checkoutUseCase.execute({
                userId: req.userId,
                authHeader: req.authHeader,
                items: req.body.items,
            });
            res.status(201).json(result);
        })
    );

    return router;
}
