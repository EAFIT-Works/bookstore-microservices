export class GetBooksUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute() {
        return this.bookRepository.getBooks();
    }
}

export default GetBooksUseCase;