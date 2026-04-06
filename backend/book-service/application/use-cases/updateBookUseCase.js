export class UpdateBookUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute(book) {
        return this.bookRepository.updateBook(book);
    }
}

export default UpdateBookUseCase;