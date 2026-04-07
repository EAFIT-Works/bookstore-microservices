import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Alert,
    Button,
    Col,
    Form,
    ListGroup,
    Row,
    Spinner,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { ordersApi } from "../lib/ordersApi";

const CartScreen = () => {
    const { user, setSessionUser } = useContext(AuthContext);
    const { items, setQuantity, removeItem, clear } = useContext(CartContext);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const subtotal = items.reduce((acc, line) => {
        const p = Number(line.price);
        if (!Number.isFinite(p)) return acc;
        return acc + p * line.quantity;
    }, 0);

    const handleCheckout = async () => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (!items.length) return;
        setError(null);
        setSubmitting(true);
        try {
            const { data } = await ordersApi.checkout({
                items: items.map(({ bookId, quantity }) => ({
                    bookId,
                    quantity,
                })),
            });
            if (data.user) {
                setSessionUser(data.user);
            }
            clear();
            navigate("/orders");
        } catch (e) {
            setError(
                e.response?.data?.message ||
                    "Checkout failed."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (!user) {
        return (
            <Alert variant="light" className="border">
                <Link to="/login">Sign in</Link> to use your cart and pay with
                balance.
            </Alert>
        );
    }

    return (
        <>
            <h2 className="mb-4">Cart</h2>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {items.length === 0 ? (
                <p className="text-muted">
                    Your cart is empty.{" "}
                    <Link to="/">Browse catalog</Link>
                </p>
            ) : (
                <>
                    <ListGroup className="mb-3">
                        {items.map((line) => (
                            <ListGroup.Item
                                key={line.bookId}
                                className="d-flex flex-wrap align-items-center gap-2 justify-content-between"
                            >
                                <div>
                                    <Link to={`/book/${line.bookId}`}>
                                        {line.name || `Book ${line.bookId}`}
                                    </Link>
                                    <div className="small text-muted">
                                        {Number.isFinite(Number(line.price))
                                            ? `$${Number(line.price).toFixed(2)} each`
                                            : "Price confirmed at checkout"}
                                    </div>
                                </div>
                                <div className="d-flex align-items-center gap-2">
                                    <Form.Select
                                        size="sm"
                                        style={{ width: "4.5rem" }}
                                        value={line.quantity}
                                        onChange={(e) =>
                                            setQuantity(
                                                line.bookId,
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                            (n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            )
                                        )}
                                    </Form.Select>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() =>
                                            removeItem(line.bookId)
                                        }
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <Row className="mb-3">
                        <Col md={6}>
                            <p className="mb-1">
                                <strong>Balance:</strong>{" "}
                                {user.balance != null
                                    ? `$${Number(user.balance).toFixed(2)}`
                                    : "—"}
                            </p>
                            {Number.isFinite(subtotal) && subtotal > 0 ? (
                                <p className="text-muted small mb-0">
                                    Cart estimate (final price at checkout):{" "}
                                    <strong>${subtotal.toFixed(2)}</strong>
                                </p>
                            ) : null}
                        </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                        <Button
                            variant="primary"
                            onClick={handleCheckout}
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        className="me-2"
                                    />
                                    Processing…
                                </>
                            ) : (
                                "Pay with balance"
                            )}
                        </Button>
                        <Button variant="outline-secondary" onClick={clear}>
                            Clear cart
                        </Button>
                    </div>
                </>
            )}
        </>
    );
};

export default CartScreen;
