import { Router } from "express";
import { Review } from "../../../domain/entities/review.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

function parseRating(value) {
    const n = Number(value);
    if (!Number.isInteger(n) || n < 1 || n > 5) return null;
    return n;
}

export function createReviewsRouter(deps) {
    const router = Router();

    router.get(
        "/book/:bookId",
        asyncHandler(async (req, res) => {
            const list = await deps.getReviewsByBookUseCase.execute(
                req.params.bookId
            );
            res.json(list);
        })
    );

    router.get(
        "/:bookId/:reviewId",
        asyncHandler(async (req, res) => {
            const review = await deps.getReviewUseCase.execute(
                req.params.bookId,
                req.params.reviewId
            );
            if (!review) {
                res.status(404).json({ message: "Review not found" });
                return;
            }
            res.json(review);
        })
    );

    router.post(
        "/",
        asyncHandler(async (req, res) => {
            const { bookId, userId, rating, comment } = req.body;
            if (bookId == null || userId == null) {
                res.status(400).json({
                    message: "bookId and userId are required",
                });
                return;
            }
            const r = parseRating(rating);
            if (r == null) {
                res.status(400).json({
                    message: "rating must be an integer between 1 and 5",
                });
                return;
            }
            const created = await deps.createReviewUseCase.execute({
                bookId,
                userId,
                rating: r,
                comment,
            });
            res.status(201).json(created);
        })
    );

    router.put(
        "/:bookId/:reviewId",
        asyncHandler(async (req, res) => {
            const existing = await deps.getReviewUseCase.execute(
                req.params.bookId,
                req.params.reviewId
            );
            if (!existing) {
                res.status(404).json({ message: "Review not found" });
                return;
            }
            let nextRating = existing.rating;
            if (req.body.rating !== undefined) {
                const r = parseRating(req.body.rating);
                if (r == null) {
                    res.status(400).json({
                        message: "rating must be an integer between 1 and 5",
                    });
                    return;
                }
                nextRating = r;
            }
            const review = new Review({
                bookId: req.params.bookId,
                id: req.params.reviewId,
                userId: req.body.userId ?? existing.userId,
                rating: nextRating,
                comment:
                    req.body.comment !== undefined
                        ? req.body.comment
                        : existing.comment,
                createdAt: existing.createdAt,
            });
            const updated = await deps.updateReviewUseCase.execute(review);
            res.json(updated);
        })
    );

    router.delete(
        "/:bookId/:reviewId",
        asyncHandler(async (req, res) => {
            const existing = await deps.getReviewUseCase.execute(
                req.params.bookId,
                req.params.reviewId
            );
            if (!existing) {
                res.status(404).json({ message: "Review not found" });
                return;
            }
            await deps.deleteReviewUseCase.execute(
                req.params.bookId,
                req.params.reviewId
            );
            res.status(204).send();
        })
    );

    return router;
}
