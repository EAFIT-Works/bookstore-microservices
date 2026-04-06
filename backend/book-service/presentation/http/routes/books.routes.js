import { Router } from "express";
import { Book } from "../../../domain/entities/book.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export function createBooksRouter(deps) {
    const router = Router();

    router.get(
        "/",
        asyncHandler(async (req, res) => {
            const books = await deps.getBooksUseCase.execute();
            res.json(books);
        })
    );

    router.get(
        "/:id",
        asyncHandler(async (req, res) => {
            const book = await deps.getBookByIdUseCase.execute(req.params.id);
            if (!book) {
                res.status(404).json({ message: "Book not found" });
                return;
            }
            res.json(book);
        })
    );

    router.post(
        "/",
        asyncHandler(async (req, res) => {
            const { name, author, description, price, image, countInStock } =
                req.body;
            if (name == null || author == null) {
                res.status(400).json({
                    message: "Fields name and author are required",
                });
                return;
            }
            const created = await deps.createBookUseCase.execute({
                name,
                author,
                description,
                price,
                image,
                countInStock,
            });
            res.status(201).json(created);
        })
    );

    router.put(
        "/:id",
        asyncHandler(async (req, res) => {
            const existing = await deps.getBookByIdUseCase.execute(
                req.params.id
            );
            if (!existing) {
                res.status(404).json({ message: "Book not found" });
                return;
            }
            const b = req.body;
            const book = new Book({
                id: req.params.id,
                name: b.name ?? existing.name,
                author: b.author ?? existing.author,
                description: b.description ?? existing.description,
                price: b.price ?? existing.price,
                image: b.image ?? existing.image,
                countInStock: b.countInStock ?? existing.countInStock,
            });
            const updated = await deps.updateBookUseCase.execute(book);
            res.json(updated);
        })
    );

    router.delete(
        "/:id",
        asyncHandler(async (req, res) => {
            const existing = await deps.getBookByIdUseCase.execute(
                req.params.id
            );
            if (!existing) {
                res.status(404).json({ message: "Book not found" });
                return;
            }
            await deps.deleteBookUseCase.execute(req.params.id);
            res.status(204).send();
        })
    );

    return router;
}
