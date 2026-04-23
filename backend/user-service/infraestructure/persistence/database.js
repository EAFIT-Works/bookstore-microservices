import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL =
        process.env.USER_DATABASE_URL ??
        "postgresql://bookstore:bookstore@localhost:5433/bookstore_users";
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
