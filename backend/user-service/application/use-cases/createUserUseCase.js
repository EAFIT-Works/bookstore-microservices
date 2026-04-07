import { v4 as uuidv4 } from "uuid";
import { User } from "../../domain/entities/user.js";

export class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(dto) {
        const user = new User(
            uuidv4(),
            dto.email,
            dto.firstName,
            dto.lastName,
            dto.balance ?? 0,
            dto.passwordHash
        );
        return this.userRepository.createUser(user);
    }
}

export default CreateUserUseCase;
