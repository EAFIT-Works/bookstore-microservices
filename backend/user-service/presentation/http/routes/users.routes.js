import { Router } from "express";
import { User } from "../../../domain/entities/user.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { toPublicUser } from "../userPublic.js";
import {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
} from "../../../infraestructure/auth/tokens.js";

export function createUsersRouter(deps) {
    const router = Router();

    router.post(
        "/auth/register",
        asyncHandler(async (req, res) => {
            const { email, password, firstName, lastName } = req.body;
            if (
                email == null ||
                password == null ||
                firstName == null ||
                lastName == null
            ) {
                res.status(400).json({
                    message:
                        "Fields email, password, firstName, and lastName are required",
                });
                return;
            }
            const user = await deps.registerUserUseCase.execute({
                email,
                password,
                firstName,
                lastName,
            });
            res.status(201).json({
                accessToken: signAccessToken(user.id),
                refreshToken: signRefreshToken(user.id),
                user: toPublicUser(user),
            });
        })
    );

    router.post(
        "/auth/login",
        asyncHandler(async (req, res) => {
            const { email, password } = req.body;
            if (email == null || password == null) {
                res.status(400).json({
                    message: "Fields email and password are required",
                });
                return;
            }
            const user = await deps.loginUserUseCase.execute({
                email,
                password,
            });
            res.json({
                accessToken: signAccessToken(user.id),
                refreshToken: signRefreshToken(user.id),
                user: toPublicUser(user),
            });
        })
    );

    router.post(
        "/auth/refresh",
        asyncHandler(async (req, res) => {
            const { refreshToken } = req.body;
            const { userId } = await deps.refreshTokenUseCase.execute(
                refreshToken
            );
            res.json({
                accessToken: signAccessToken(userId),
            });
        })
    );

    router.post(
        "/auth/debit-balance",
        asyncHandler(async (req, res) => {
            const auth = req.headers.authorization;
            if (!auth?.startsWith("Bearer ")) {
                res.status(401).json({ message: "Authorization Bearer header required" });
                return;
            }
            const token = auth.slice(7);
            const userId = verifyAccessToken(token);
            const user = await deps.debitBalanceUseCase.execute(
                userId,
                req.body.amount
            );
            res.json({
                balance: user.balance,
                user: toPublicUser(user),
            });
        })
    );

    router.get(
        "/",
        asyncHandler(async (req, res) => {
            const users = await deps.getUsersUseCase.execute();
            res.json(users.map(toPublicUser));
        })
    );

    router.get(
        "/:id",
        asyncHandler(async (req, res) => {
            const user = await deps.getUserByIdUseCase.execute(req.params.id);
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.json(toPublicUser(user));
        })
    );

    router.post(
        "/",
        asyncHandler(async (req, res) => {
            const { email, firstName, lastName, balance } = req.body;
            if (email == null || firstName == null || lastName == null) {
                res.status(400).json({
                    message: "Fields email, firstName and lastName are required",
                });
                return;
            }
            const created = await deps.createUserUseCase.execute({
                email,
                firstName,
                lastName,
                balance: balance != null ? Number(balance) : 0,
            });
            res.status(201).json(toPublicUser(created));
        })
    );

    router.put(
        "/:id",
        asyncHandler(async (req, res) => {
            const existing = await deps.getUserByIdUseCase.execute(
                req.params.id
            );
            if (!existing) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            const b = req.body;
            const user = new User({
                id: req.params.id,
                email: b.email ?? existing.email,
                firstName: b.firstName ?? existing.firstName,
                lastName: b.lastName ?? existing.lastName,
                balance:
                    b.balance !== undefined && b.balance !== null
                        ? Number(b.balance)
                        : existing.balance,
                passwordHash: existing.passwordHash,
            });
            const updated = await deps.updateUserUseCase.execute(user);
            res.json(toPublicUser(updated));
        })
    );

    router.delete(
        "/:id",
        asyncHandler(async (req, res) => {
            const existing = await deps.getUserByIdUseCase.execute(
                req.params.id
            );
            if (!existing) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            await deps.deleteUserUseCase.execute(req.params.id);
            res.status(204).send();
        })
    );

    return router;
}
