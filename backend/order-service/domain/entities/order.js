export class Order {
    constructor({ userId, id, items, totalAmount, status, createdAt }) {
        this.userId = userId;
        this.id = id;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
    }
}
