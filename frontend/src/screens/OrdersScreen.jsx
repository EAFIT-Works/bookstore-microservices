import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Spinner, Table } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";
import { ordersApi } from "../lib/ordersApi";

const OrdersScreen = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await ordersApi.my();
                if (!cancelled) {
                    setOrders(Array.isArray(data) ? data : []);
                }
            } catch (e) {
                if (!cancelled) {
                    setError(
                        e.response?.data?.message ||
                            "Could not load orders."
                    );
                    setOrders([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [user]);

    if (!user) {
        return (
            <Alert variant="light" className="border">
                <Link to="/login">Sign in</Link> to see your orders.
            </Alert>
        );
    }

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    return (
        <>
            <h2 className="mb-4">Orders</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {orders.length === 0 ? (
                <p className="text-muted">
                    No orders yet.{" "}
                    <Link to="/cart">Go to cart</Link>
                </p>
            ) : (
                <Table responsive striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Id</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((o) => (
                            <tr key={o.id}>
                                <td>
                                    {o.createdAt
                                        ? new Date(o.createdAt).toLocaleString()
                                        : "—"}
                                </td>
                                <td className="text-muted small">
                                    {o.id?.slice(0, 8)}…
                                </td>
                                <td>
                                    {o.totalAmount != null
                                        ? `$${Number(o.totalAmount).toFixed(2)}`
                                        : "—"}
                                </td>
                                <td>{o.status ?? "—"}</td>
                                <td>
                                    <ul className="mb-0 ps-3 small">
                                        {(o.items ?? []).map((it, i) => (
                                            <li key={`${o.id}-${i}`}>
                                                <Link to={`/book/${it.bookId}`}>
                                                    {it.name || it.bookId}
                                                </Link>{" "}
                                                × {it.quantity}{" "}
                                                {it.unitPrice != null
                                                    ? `@ $${Number(it.unitPrice).toFixed(2)}`
                                                    : ""}
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
};

export default OrdersScreen;
