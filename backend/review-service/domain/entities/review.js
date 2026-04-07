export class Review {
    constructor(bookId, id, userId, rating, comment, createdAt) {
        if (typeof bookId === "object" && bookId !== null && id === undefined) {
            const o = bookId;
            this.bookId = o.bookId;
            this.id = o.id;
            this.userId = o.userId;
            this.rating = o.rating;
            this.comment = o.comment;
            this.createdAt = o.createdAt;
            return;
        }
        this.bookId = bookId;
        this.id = id;
        this.userId = userId;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }
}
