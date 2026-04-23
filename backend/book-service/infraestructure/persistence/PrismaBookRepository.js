import { Book } from "../../domain/entities/book.js";

function rowToBook(row) {
    return new Book({
        id: row.id,
        name: row.name,
        author: row.author,
        description: row.description,
        price: row.price != null ? Number(row.price) : row.price,
        image: row.image,
        countInStock:
            row.countInStock != null ? Number(row.countInStock) : row.countInStock,
    });
}

export class PrismaBookRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createBook(book) {
        await this.prisma.book.create({
            data: {
                id: book.id,
                name: book.name,
                author: book.author,
                description: book.description,
                price: book.price,
                image: book.image,
                countInStock: book.countInStock,
            },
        });
        return book;
    }

    async getBookById(id) {
        const row = await this.prisma.book.findUnique({ where: { id } });
        return row ? rowToBook(row) : null;
    }

    async getBooks() {
        const rows = await this.prisma.book.findMany({
            orderBy: { name: "asc" },
        });
        return rows.map(rowToBook);
    }

    async updateBook(book) {
        await this.prisma.book.update({
            where: { id: book.id },
            data: {
                name: book.name,
                author: book.author,
                description: book.description,
                price: book.price,
                image: book.image,
                countInStock: book.countInStock,
            },
        });
        return book;
    }

    async deleteBook(id) {
        const result = await this.prisma.book.deleteMany({ where: { id } });
        return result.count > 0;
    }
}
