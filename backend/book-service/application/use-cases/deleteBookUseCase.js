export class DeleteBookUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute(id) {
        return this.bookRepository.deleteBook(id);
    }
}

export default DeleteBookUseCase;