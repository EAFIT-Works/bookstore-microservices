export class Book {
    constructor(id, name, author, description, price, image, countInStock) {
        if (typeof id === "object" && id !== null && name === undefined) {
            const o = id;
            this.id = o.id;
            this.name = o.name;
            this.author = o.author;
            this.description = o.description;
            this.price = o.price;
            this.image = o.image;
            this.countInStock = o.countInStock;
            return;
        }
        this.id = id;
        this.name = name;
        this.author = author;
        this.description = description;
        this.price = price;
        this.image = image;
        this.countInStock = countInStock;
    }
}