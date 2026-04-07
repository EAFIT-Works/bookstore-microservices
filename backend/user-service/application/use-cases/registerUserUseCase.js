import bcrypt from "bcryptjs";

export class RegisterUserUseCase {
    constructor(userRepository, createUserUseCase) {
        this.userRepository = userRepository;
        this.createUserUseCase = createUserUseCase;
    }

    async execute({ email, password, firstName, lastName }) {
        const existing = await this.userRepository.getUserByEmail(email);
        if (existing) {
            const err = new Error("This email is already registered");
            err.status = 409;
            throw err;
        }
        const passwordHash = await bcrypt.hash(password, 10);
        return this.createUserUseCase.execute({
            email,
            firstName,
            lastName,
            balance: 0,
            passwordHash,
        });
    }
}

export default RegisterUserUseCase;
