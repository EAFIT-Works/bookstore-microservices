import docClient from "../../infraestructure/config/dynamo.js";
import { DynamoOrderRepository } from "../../infraestructure/persistence/DynamoOrderRepository.js";
import CreateOrderUseCase from "../../application/use-cases/createOrderUseCase.js";
import ListOrdersByUserUseCase from "../../application/use-cases/listOrdersByUserUseCase.js";
import CheckoutUseCase from "../../application/use-cases/checkoutUseCase.js";
import { createApp } from "./app.js";

const orderRepository = new DynamoOrderRepository(docClient);
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
