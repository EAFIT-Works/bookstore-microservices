import { Review } from "../../domain/entities/review.js";

function rowToReview(row) {
    return new Review({
        bookId: row.bookId,
        id: row.id,
        userId: row.userId,
        rating: row.rating,
        comment: row.comment ?? "",
        createdAt: row.createdAt.toISOString(),
    });
}

export class PrismaReviewRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createReview(review) {
        await this.prisma.review.create({
            data: {
                bookId: review.bookId,
                id: review.id,
                userId: review.userId,
                rating: review.rating,
                comment: review.comment,
                createdAt: new Date(review.createdAt),
            },
        });
        return review;
    }

    async getReview(bookId, id) {
        const row = await this.prisma.review.findUnique({
            where: {
                bookId_id: { bookId, id },
            },
        });
        return row ? rowToReview(row) : null;
    }

    async getReviewsByBookId(bookId) {
        const rows = await this.prisma.review.findMany({
            where: { bookId },
            orderBy: { createdAt: "desc" },
        });
        return rows.map(rowToReview);
    }

    async updateReview(review) {
        await this.prisma.review.update({
            where: {
                bookId_id: { bookId: review.bookId, id: review.id },
            },
            data: {
                userId: review.userId,
                rating: review.rating,
                comment: review.comment,
                createdAt: new Date(review.createdAt),
            },
        });
        return review;
    }

    async deleteReview(bookId, id) {
        const result = await this.prisma.review.deleteMany({
            where: { bookId, id },
        });
        return result.count > 0;
    }
}
