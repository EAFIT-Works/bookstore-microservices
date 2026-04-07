import {
    DeleteCommand,
    GetCommand,
    PutCommand,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { User } from "../../domain/entities/user.js";

function toItem(user) {
    const item = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance ?? 0,
    };
    if (user.passwordHash) {
        item.passwordHash = user.passwordHash;
    }
    return item;
}

export class DynamoUserRepository {
    constructor(docClient) {
        this.docClient = docClient;
        this.tableName = process.env.USERS_TABLE_NAME || "tb_users";
    }

    async createUser(user) {
        await this.docClient.send(
            new PutCommand({ TableName: this.tableName, Item: toItem(user) })
        );
        return user;
    }

    async getUserById(id) {
        const result = await this.docClient.send(
            new GetCommand({ TableName: this.tableName, Key: { id } })
        );
        return result.Item ? new User(result.Item) : null;
    }

    async getUserByEmail(email) {
        const result = await this.docClient.send(
            new ScanCommand({ TableName: this.tableName })
        );
        const item = (result.Items || []).find((i) => i.email === email);
        return item ? new User(item) : null;
    }

    async getUsers() {
        const result = await this.docClient.send(
            new ScanCommand({ TableName: this.tableName })
        );
        return (result.Items || []).map((item) => new User(item));
    }

    async updateUser(user) {
        await this.docClient.send(
            new PutCommand({ TableName: this.tableName, Item: toItem(user) })
        );
        return user;
    }

    async deleteUser(id) {
        await this.docClient.send(
            new DeleteCommand({ TableName: this.tableName, Key: { id } })
        );
        return true;
    }
}
