export class DeleteUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id) {
        return this.userRepository.deleteUser(id);
    }
}

export default DeleteUserUseCase;
