const bookBase = () =>
    (process.env.BOOK_SERVICE_URL || "http://localhost:3000").replace(
        /\/$/,
        ""
    );
const userBase = () =>
    (process.env.USER_SERVICE_URL || "http://localhost:3001").replace(
        /\/$/,
        ""
    );

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    const text = await res.text();
    let body = {};
    if (text) {
        try {
            body = JSON.parse(text);
        } catch {
            body = { message: text };
        }
    }
    if (!res.ok) {
        const err = new Error(body.message || `HTTP ${res.status}`);
        err.status = res.status;
        throw err;
    }
    return body;
}

function mergeQuantitiesByBook(items) {
    const map = new Map();
    for (const row of items) {
        const bookId = row.bookId;
        const quantity = Number(row.quantity);
        if (!bookId || !Number.isFinite(quantity) || quantity < 1) {
            const err = new Error(
                "Each line requires bookId and quantity >= 1"
            );
            err.status = 400;
            throw err;
        }
        map.set(bookId, (map.get(bookId) || 0) + quantity);
    }
    return map;
}

function bookUrl(id) {
    return `${bookBase()}/api/books/${encodeURIComponent(id)}`;
}

export class CheckoutUseCase {
    constructor(createOrderUseCase) {
        this.createOrderUseCase = createOrderUseCase;
    }

    async execute({ userId, authHeader, items }) {
        if (!Array.isArray(items) || items.length === 0) {
            const err = new Error("Cart cannot be empty");
            err.status = 400;
            throw err;
        }

        const byBook = mergeQuantitiesByBook(items);

        const lines = [];
        let total = 0;

        for (const [bookId, quantity] of byBook) {
            const book = await fetchJson(bookUrl(bookId), { method: "GET" });
            const stock = Number(book.countInStock);
            const available = Number.isFinite(stock) ? stock : 0;
            if (available < quantity) {
                const err = new Error(
                    `Insufficient stock for "${book.name ?? bookId}" (available ${available}, requested ${quantity})`
                );
                err.status = 409;
                throw err;
            }

            const price = Number(book.price);
            if (!Number.isFinite(price) || price < 0) {
                const err = new Error(`Invalid price for book ${bookId}`);
                err.status = 400;
                throw err;
            }

            const lineTotal = price * quantity;
            total += lineTotal;
            lines.push({
                bookId,
                quantity,
                unitPrice: price,
                name: book.name ?? "",
            });
        }

        const debitUrl = `${userBase()}/api/users/auth/debit-balance`;
        const debit = await fetchJson(debitUrl, {
            method: "POST",
            headers: {
                Authorization: authHeader,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: total }),
        });

        const order = await this.createOrderUseCase.execute({
            userId,
            items: lines,
            totalAmount: total,
            status: "paid",
        });

        for (const [bookId, quantity] of byBook) {
            const book = await fetchJson(bookUrl(bookId), { method: "GET" });
            const current = Number(book.countInStock);
            const base = Number.isFinite(current) ? current : 0;
            if (base < quantity) {
                const err = new Error(
                    `Order ${order.id} was recorded but stock for "${book.name ?? bookId}" changed before decrement; check inventory or contact support.`
                );
                err.status = 500;
                throw err;
            }
            await fetchJson(bookUrl(bookId), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ countInStock: base - quantity }),
            });
        }

        return {
            order,
            balance: debit.balance,
            user: debit.user,
        };
    }
}

export default CheckoutUseCase;
