import { User } from "../../domain/entities/user.js";

function rowToUser(row) {
    return new User({
        id: row.id,
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        balance: row.balance != null ? Number(row.balance) : row.balance,
        passwordHash: row.passwordHash,
    });
}

export class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async createUser(user) {
        await this.prisma.user.create({
            data: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                balance: user.balance ?? 0,
                passwordHash: user.passwordHash ?? null,
            },
        });
        return user;
    }

    async getUserById(id) {
        const row = await this.prisma.user.findUnique({ where: { id } });
        return row ? rowToUser(row) : null;
    }

    async getUserByEmail(email) {
        const row = await this.prisma.user.findUnique({
            where: { email },
        });
        return row ? rowToUser(row) : null;
    }

    async getUsers() {
        const rows = await this.prisma.user.findMany({
            orderBy: { email: "asc" },
        });
        return rows.map(rowToUser);
    }

    async updateUser(user) {
        const data = {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            balance: user.balance ?? 0,
        };
        if (user.passwordHash !== undefined && user.passwordHash !== null) {
            data.passwordHash = user.passwordHash;
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data,
        });
        return user;
    }

    async deleteUser(id) {
        try {
            await this.prisma.user.delete({ where: { id } });
            return true;
        } catch {
            return false;
        }
    }
}
