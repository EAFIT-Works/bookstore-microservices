import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const CartContext = createContext();

const STORAGE_KEY = "bookstore_cart_v1";

function readCart() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(readCart);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const addItem = useCallback((line) => {
        const { bookId, quantity = 1, name, price } = line;
        if (!bookId) return;
        const q = Number(quantity);
        if (!Number.isFinite(q) || q < 1) return;
        setItems((prev) => {
            const idx = prev.findIndex((x) => x.bookId === bookId);
            if (idx === -1) {
                return [
                    ...prev,
                    {
                        bookId,
                        quantity: q,
                        name: name ?? "",
                        price: price != null ? Number(price) : undefined,
                    },
                ];
            }
            const next = [...prev];
            next[idx] = {
                ...next[idx],
                quantity: next[idx].quantity + q,
                name: name ?? next[idx].name,
                price:
                    price != null ? Number(price) : next[idx].price,
            };
            return next;
        });
    }, []);

    const setQuantity = useCallback((bookId, quantity) => {
        const q = Number(quantity);
        if (!Number.isFinite(q) || q < 1) return;
        setItems((prev) =>
            prev.map((x) =>
                x.bookId === bookId ? { ...x, quantity: q } : x
            )
        );
    }, []);

    const removeItem = useCallback((bookId) => {
        setItems((prev) => prev.filter((x) => x.bookId !== bookId));
    }, []);

    const clear = useCallback(() => setItems([]), []);

    const value = useMemo(
        () => ({
            items,
            addItem,
            setQuantity,
            removeItem,
            clear,
        }),
        [items, addItem, setQuantity, removeItem, clear]
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
};
