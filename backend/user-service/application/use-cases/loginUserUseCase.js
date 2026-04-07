import bcrypt from "bcryptjs";

export class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ email, password }) {
        const user = await this.userRepository.getUserByEmail(email);
        if (!user || !user.passwordHash) {
            const err = new Error("Invalid email or password");
            err.status = 401;
            throw err;
        }
        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
            const err = new Error("Invalid email or password");
            err.status = 401;
            throw err;
        }
        return user;
    }
}

export default LoginUserUseCase;
