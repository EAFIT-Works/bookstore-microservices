import { v4 as uuidv4 } from "uuid";
import { Book } from "../../domain/entities/book.js";

export class CreateBookUseCase {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute(createBookDto) {
        const book = new Book(
            uuidv4(),
            createBookDto.name,
            createBookDto.author,
            createBookDto.description,
            createBookDto.price,
            createBookDto.image,
            createBookDto.countInStock
        );
        return this.bookRepository.createBook(book);
    }
}

export default CreateBookUseCase;