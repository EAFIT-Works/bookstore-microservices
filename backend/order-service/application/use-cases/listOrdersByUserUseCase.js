export class ListOrdersByUserUseCase {
    constructor(orderRepository) {
        this.orderRepository = orderRepository;
    }

    async execute(userId) {
        return this.orderRepository.findByUserId(userId);
    }
}

export default ListOrdersByUserUseCase;
