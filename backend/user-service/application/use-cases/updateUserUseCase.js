export class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(user) {
        return this.userRepository.updateUser(user);
    }
}

export default UpdateUserUseCase;
