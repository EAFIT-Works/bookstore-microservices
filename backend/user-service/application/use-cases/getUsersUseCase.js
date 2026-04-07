export class GetUsersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute() {
        return this.userRepository.getUsers();
    }
}

export default GetUsersUseCase;
