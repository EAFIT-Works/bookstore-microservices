export class CreateBookDto {
    constructor(name, author, description, price, image, countInStock) {
        this.name = name;
        this.author = author;
        this.description = description;
        this.price = price;
        this.image = image;
        this.countInStock = countInStock;
    }
}