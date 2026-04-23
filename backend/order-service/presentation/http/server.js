import { prisma } from "../../infraestructure/persistence/database.js";
import { PrismaOrderRepository } from "../../infraestructure/persistence/PrismaOrderRepository.js";
import CreateOrderUseCase from "../../application/use-cases/createOrderUseCase.js";
import ListOrdersByUserUseCase from "../../application/use-cases/listOrdersByUserUseCase.js";
import CheckoutUseCase from "../../application/use-cases/checkoutUseCase.js";
import { createApp } from "./app.js";

const orderRepository = new PrismaOrderRepository(prisma);
const createOrderUseCase = new CreateOrderUseCase(orderRepository);

const deps = {
    listOrdersByUserUseCase: new ListOrdersByUserUseCase(orderRepository),
    checkoutUseCase: new CheckoutUseCase(createOrderUseCase),
};

const app = createApp(deps);
const port = Number(process.env.PORT) || 3003;

app.listen(port, () => {
    console.log(`order-service listening on port ${port}`);
});
