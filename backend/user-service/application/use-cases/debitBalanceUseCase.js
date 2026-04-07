import { User } from "../../domain/entities/user.js";

export class DebitBalanceUseCase {
    constructor(getUserByIdUseCase, updateUserUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase;
        this.updateUserUseCase = updateUserUseCase;
    }

    async execute(userId, amount) {
        const n = Number(amount);
        if (!Number.isFinite(n) || n <= 0) {
            const err = new Error("Amount must be a positive number");
            err.status = 400;
            throw err;
        }
        const user = await this.getUserByIdUseCase.execute(userId);
        if (!user) {
            const err = new Error("User not found");
            err.status = 404;
            throw err;
        }
        const bal = Number(user.balance) || 0;
        if (bal < n) {
            const err = new Error("Insufficient balance");
            err.status = 402;
            throw err;
        }
        const updated = new User({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            balance: bal - n,
            passwordHash: user.passwordHash,
        });
        return this.updateUserUseCase.execute(updated);
    }
}

export default DebitBalanceUseCase;
