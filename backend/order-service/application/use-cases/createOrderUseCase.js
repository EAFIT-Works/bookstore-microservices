import { randomUUID } from "crypto";
import { Order } from "../../domain/entities/order.js";

export class CreateOrderUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute({ userId, items, totalAmount, status = "paid" }) {
        const id = randomUUID();
        const createdAt = new Date().toISOString();
        const order = new Order({
            userId,
            id,
            items,
            totalAmount,
            status,
            createdAt,
        });
        return this.orderRepository.save(order);
    }
}

export default CreateOrderUseCase;
