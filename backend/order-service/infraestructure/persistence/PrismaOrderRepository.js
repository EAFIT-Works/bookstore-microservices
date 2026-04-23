import { Order } from "../../domain/entities/order.js";

function rowToOrder(row) {
    return new Order({
        userId: row.userId,
        id: row.id,
        items: row.items ?? [],
        totalAmount:
            row.totalAmount != null ? Number(row.totalAmount) : row.totalAmount,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
    });
}

export class PrismaOrderRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async save(order) {
        await this.prisma.order.create({
            data: {
                userId: order.userId,
                id: order.id,
                items: order.items,
                totalAmount: order.totalAmount,
                status: order.status,
                createdAt: new Date(order.createdAt),
            },
        });
        return order;
    }

    async findByUserId(userId) {
        const rows = await this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
        });
        return rows.map(rowToOrder);
    }
}
