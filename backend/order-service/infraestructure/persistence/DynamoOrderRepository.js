import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { Order } from "../../domain/entities/order.js";

function toItem(order) {
    return {
        userId: order.userId,
        id: order.id,
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        createdAt: order.createdAt,
    };
}

function fromItem(item) {
    if (!item) return null;
    return new Order({
        userId: item.userId,
        id: item.id,
        items: item.items ?? [],
        totalAmount: item.totalAmount,
        status: item.status,
        createdAt: item.createdAt,
    });
}

export class DynamoOrderRepository {
    constructor(docClient) {
        this.docClient = docClient;
        this.tableName = process.env.ORDERS_TABLE_NAME || "tb_orders";
    }

    async save(order) {
        await this.docClient.send(
            new PutCommand({
                TableName: this.tableName,
                Item: toItem(order),
            })
        );
        return order;
    }

    async findByUserId(userId) {
        const { Items = [] } = await this.docClient.send(
            new QueryCommand({
                TableName: this.tableName,
                KeyConditionExpression: "userId = :u",
                ExpressionAttributeValues: { ":u": userId },
                ScanIndexForward: false,
            })
        );
        return Items.map((i) => fromItem(i)).filter(Boolean);
    }
}
