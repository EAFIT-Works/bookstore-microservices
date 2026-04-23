import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
        process.env.ORDER_DATABASE_URL ??
        "postgresql://bookstore:bookstore@localhost:5435/bookstore_orders";
}

const globalForPrisma = globalThis;

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log:
            process.env.NODE_ENV === "development"
                ? ["error", "warn"]
                : ["error"],
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
