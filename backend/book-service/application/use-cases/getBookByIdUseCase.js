export class GetBookByIdUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute(id) {
        return this.bookRepository.getBookById(id);
    }
}

export default GetBookByIdUseCase;