import {
    DeleteCommand,
    GetCommand,
    PutCommand,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Book } from "../../domain/entities/book.js";

function toItem(book) {
    return {
        id: book.id,
        name: book.name,
        author: book.author,
        description: book.description,
        price: book.price,
        image: book.image,
        countInStock: book.countInStock,
    };
}

export class DynamoBookRepository {
    constructor(docClient) {
        this.docClient = docClient;
        this.tableName = process.env.BOOKS_TABLE_NAME || "tb_books";
    }

    async createBook(book) {
        const item = toItem(book);
        await this.docClient.send(
            new PutCommand({ TableName: this.tableName, Item: item })
        );
        return book;
    }

    async getBookById(id) {
        const result = await this.docClient.send(
            new GetCommand({ TableName: this.tableName, Key: { id } })
        );
        return result.Item ? new Book(result.Item) : null;
    }

    async getBooks() {
        const result = await this.docClient.send(
            new ScanCommand({ TableName: this.tableName })
        );
        return (result.Items || []).map((item) => new Book(item));
    }

    async updateBook(book) {
        const item = toItem(book);
        await this.docClient.send(
            new PutCommand({ TableName: this.tableName, Item: item })
        );
        return book;
    }

    async deleteBook(id) {
        await this.docClient.send(
            new DeleteCommand({ TableName: this.tableName, Key: { id } })
        );
        return true;
    }
}
