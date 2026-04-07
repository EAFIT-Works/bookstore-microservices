import { verifyRefreshToken } from "../../infraestructure/auth/tokens.js";

export class RefreshTokenUseCase {
    constructor(getUserByIdUseCase) {
        this.getUserByIdUseCase = getUserByIdUseCase;
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            const err = new Error("refreshToken is required");
            err.status = 400;
            throw err;
        }
        const userId = verifyRefreshToken(refreshToken);
        const user = await this.getUserByIdUseCase.execute(userId);
        if (!user) {
            const err = new Error("Invalid session");
            err.status = 401;
            throw err;
        }
        return { userId: user.id };
    }
}

export default RefreshTokenUseCase;
