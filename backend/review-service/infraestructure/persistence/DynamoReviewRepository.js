import { DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import {
    DeleteCommand,
    GetCommand,
    PutCommand,
    QueryCommand,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Review } from "../../domain/entities/review.js";

function toItem(review) {
    return {
        bookId: review.bookId,
        id: review.id,
        userId: review.userId,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.createdAt,
    };
}

export class DynamoReviewRepository {
    constructor(docClient) {
        this.docClient = docClient;
        this.tableName = process.env.REVIEWS_TABLE_NAME || "tb_reviews";
        this._keyMode = null;
    }

    async warmupKeyMode() {
        await this._ensureKeyMode();
    }

    async _ensureKeyMode() {
        if (this._keyMode) {
            return;
        }

        const forced = process.env.REVIEWS_TABLE_KEY_MODE;
        if (forced === "id_only") {
            this._keyMode = { mode: "id_only" };
            console.log("[review-service] REVIEWS_TABLE_KEY_MODE=id_only");
            return;
        }
        if (forced === "bookid_and_id") {
            this._keyMode = { mode: "composite" };
            console.log("[review-service] REVIEWS_TABLE_KEY_MODE=bookid_and_id");
            return;
        }

        try {
            const { Table } = await this.docClient.send(
                new DescribeTableCommand({ TableName: this.tableName })
            );
            const hash = Table.KeySchema.find((k) => k.KeyType === "HASH")
                ?.AttributeName;
            const range = Table.KeySchema.find((k) => k.KeyType === "RANGE")
                ?.AttributeName;

            if (hash === "bookId" && range === "id") {
                this._keyMode = { mode: "composite" };
            } else {
                this._keyMode = { mode: "id_only" };
            }

            console.log(
                `[review-service] DynamoDB "${this.tableName}" HASH=${hash ?? "?"} RANGE=${range ?? "none"} mode=${this._keyMode.mode}`
            );
        } catch (e) {
            this._keyMode = { mode: "id_only" };
            console.warn(
                `[review-service] DescribeTable failed (${e.message}); using id_only. Set REVIEWS_TABLE_KEY_MODE=bookid_and_id if needed.`
            );
        }
    }

    async createReview(review) {
        await this._ensureKeyMode();
        await this.docClient.send(
            new PutCommand({ TableName: this.tableName, Item: toItem(review) })
        );
        return review;
    }

    async getReview(bookId, id) {
        await this._ensureKeyMode();
        if (this._keyMode.mode === "composite") {
            const result = await this.docClient.send(
                new GetCommand({
                    TableName: this.tableName,
                    Key: { bookId, id },
                })
            );
            return result.Item ? new Review(result.Item) : null;
        }

        const result = await this.docClient.send(
            new GetCommand({
                TableName: this.tableName,
                Key: { id },
            })
        );
        const item = result.Item ? new Review(result.Item) : null;
        if (!item || item.bookId !== bookId) {
            return null;
        }
        return item;
    }

    async getReviewsByBookId(bookId) {
        await this._ensureKeyMode();
        if (this._keyMode.mode === "composite") {
            const result = await this.docClient.send(
                new QueryCommand({
                    TableName: this.tableName,
                    KeyConditionExpression: "bookId = :b",
                    ExpressionAttributeValues: { ":b": bookId },
                })
            );
            return (result.Items || []).map((item) => new Review(item));
        }

        const result = await this.docClient.send(
            new ScanCommand({
                TableName: this.tableName,
                FilterExpression: "bookId = :b",
                ExpressionAttributeValues: { ":b": bookId },
            })
        );
        return (result.Items || []).map((item) => new Review(item));
    }

    async updateReview(review) {
        await this._ensureKeyMode();
        await this.docClient.send(
            new PutCommand({ TableName: this.tableName, Item: toItem(review) })
        );
        return review;
    }

    async deleteReview(bookId, id) {
        await this._ensureKeyMode();
        const existing = await this.getReview(bookId, id);
        if (!existing) {
            return false;
        }
        if (this._keyMode.mode === "composite") {
            await this.docClient.send(
                new DeleteCommand({
                    TableName: this.tableName,
                    Key: { bookId, id },
                })
            );
        } else {
            await this.docClient.send(
                new DeleteCommand({
                    TableName: this.tableName,
                    Key: { id },
                })
            );
        }
        return true;
    }
}
