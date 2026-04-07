export class GetUserByIdUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id) {
        return this.userRepository.getUserById(id);
    }
}

export default GetUserByIdUseCase;
