import docClient from "../../infraestructure/config/dynamo.js";
import { DynamoBookRepository } from "../../infraestructure/persistence/DynamoBookRepository.js";
import CreateBookUseCase from "../../application/use-cases/createBookUseCase.js";
import DeleteBookUseCase from "../../application/use-cases/deleteBookUseCase.js";
import GetBookByIdUseCase from "../../application/use-cases/getBookByIdUseCase.js";
import GetBooksUseCase from "../../application/use-cases/getBooksUseCase.js";
import UpdateBookUseCase from "../../application/use-cases/updateBookUseCase.js";
import { createApp } from "./app.js";

const bookRepository = new DynamoBookRepository(docClient);

const deps = {
    createBookUseCase: new CreateBookUseCase(bookRepository),
    deleteBookUseCase: new DeleteBookUseCase(bookRepository),
    getBookByIdUseCase: new GetBookByIdUseCase(bookRepository),
    getBooksUseCase: new GetBooksUseCase(bookRepository),
    updateBookUseCase: new UpdateBookUseCase(bookRepository),
};

const app = createApp(deps);
const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
    console.log(`book-service listening on port ${port}`);
});
