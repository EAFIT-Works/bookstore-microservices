import React, { useState, useEffect, useContext, useCallback } from "react";
import { booksApi } from "../lib/booksApi";
import { reviewsApi } from "../lib/reviewsApi";
import { usersApi } from "../lib/usersApi";
import { AuthContext } from "../context/AuthContext.jsx";
import { CartContext } from "../context/CartContext.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Row,
    Col,
    Image,
    ListGroup,
    Button,
    Spinner,
    Alert,
    Modal,
    Card,
    Form,
} from "react-bootstrap";

const BookScreen = () => {
    const { user } = useContext(AuthContext);
    const { addItem } = useContext(CartContext);
    const [cartQty, setCartQty] = useState(1);
    const [cartMsg, setCartMsg] = useState(null);
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);
    const [newRating, setNewRating] = useState(5);
    const [newComment, setNewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

    const [authorByUserId, setAuthorByUserId] = useState({});

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await booksApi.getById(id);
                if (!cancelled) setBook(data);
            } catch (e) {
                if (!cancelled) {
                    setError(
                        e.response?.data?.message ||
                            "Could not load book."
                    );
                    setBook(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [id]);

    const loadReviews = useCallback(async () => {
        setReviewsLoading(true);
        setReviewsError(null);
        try {
            const { data } = await reviewsApi.byBook(id);
            setReviews(Array.isArray(data) ? data : []);
        } catch (e) {
            setReviewsError(
                e.response?.data?.message ||
                    "Could not load reviews."
            );
            setReviews([]);
        } finally {
            setReviewsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadReviews();
    }, [loadReviews]);

    useEffect(() => {
        let cancelled = false;
        if (!reviews.length) {
            setAuthorByUserId({});
            return;
        }
        const ids = [
            ...new Set(reviews.map((r) => r.userId).filter(Boolean)),
        ];
        (async () => {
            const next = {};
            if (user?.id && ids.includes(user.id)) {
                next[user.id] = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                };
            }
            const missing = ids.filter((uid) => next[uid] === undefined);
            await Promise.all(
                missing.map(async (uid) => {
                    try {
                        const { data } = await usersApi.getById(uid);
                        if (!cancelled) {
                            next[uid] = {
                                firstName: data.firstName,
                                lastName: data.lastName,
                                email: data.email,
                            };
                        }
                    } catch {
                        if (!cancelled) next[uid] = null;
                    }
                })
            );
            if (!cancelled) setAuthorByUserId(next);
        })();
        return () => {
            cancelled = true;
        };
    }, [reviews, user]);

    const authorLabel = (userId) => {
        if (!userId) return "User";
        const au = authorByUserId[userId];
        if (au === undefined) return null;
        if (au === null) {
            return `User (${userId.slice(0, 8)}…)`;
        }
        const name = `${au.firstName ?? ""} ${au.lastName ?? ""}`.trim();
        return name || au.email || `User (${userId.slice(0, 8)}…)`;
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await booksApi.remove(id);
            navigate("/");
        } catch (e) {
            setError(
                e.response?.data?.message || "Could not delete book."
            );
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user?.id) return;
        setSubmittingReview(true);
        setReviewsError(null);
        try {
            await reviewsApi.create({
                bookId: id,
                userId: user.id,
                rating: newRating,
                comment: newComment.trim(),
            });
            setNewComment("");
            setNewRating(5);
            await loadReviews();
        } catch (e) {
            setReviewsError(
                e.response?.data?.message ||
                    "Could not post review."
            );
        } finally {
            setSubmittingReview(false);
        }
    };

    const handleDeleteReview = async (bookId, reviewId) => {
        try {
            await reviewsApi.remove(bookId, reviewId);
            await loadReviews();
        } catch (e) {
            setReviewsError(
                e.response?.data?.message ||
                    "Could not delete review."
            );
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    if (error && !book) {
        return (
            <>
                <div className="mb-4">
                    <Link to="/">
                        <Button variant="light">← Back to catalog</Button>
                    </Link>
                </div>
                <Alert variant="danger">{error}</Alert>
            </>
        );
    }

    return (
        <>
            <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <Button variant="light" aria-label="Back to home">
                        ← Back to catalog
                    </Button>
                </Link>
                <Link to={`/book/${id}/edit`} className="ms-auto">
                    <Button variant="outline-primary">Edit</Button>
                </Link>
                <Button variant="outline-danger" onClick={() => setShowDelete(true)}>
                    Delete
                </Button>
            </div>

            {error && (
                <Alert variant="warning" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Row>
                <Col md={4}>
                    <Image
                        src={book.image || "/placeholder.png"}
                        alt={book.name}
                        fluid
                        rounded
                    />
                </Col>

                <Col md={4}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h3>{book.name}</h3>
                        </ListGroup.Item>
                        <ListGroup.Item>Author: {book.author}</ListGroup.Item>
                        <ListGroup.Item variant="flush">
                            Description: {book.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            Status:{" "}
                            {book.countInStock > 0 ? "In stock" : "Out of stock"}{" "}
                            ({book.countInStock}) units
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Price:</strong> {book.price}
                        </ListGroup.Item>
                        {user && book.countInStock > 0 ? (
                            <ListGroup.Item>
                                <div className="d-flex flex-column gap-2">
                                    <Form.Label className="mb-0 small">
                                        Quantity
                                    </Form.Label>
                                    <Form.Select
                                        size="sm"
                                        value={cartQty}
                                        onChange={(e) =>
                                            setCartQty(Number(e.target.value))
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
                                        variant="primary"
                                        size="sm"
                                        onClick={() => {
                                            addItem({
                                                bookId: book.id,
                                                quantity: cartQty,
                                                name: book.name,
                                                price: book.price,
                                            });
                                            setCartMsg("Added to cart.");
                                            setTimeout(() => setCartMsg(null), 2500);
                                        }}
                                    >
                                        Add to cart
                                    </Button>
                                    {cartMsg ? (
                                        <small className="text-success">
                                            {cartMsg}
                                        </small>
                                    ) : null}
                                </div>
                            </ListGroup.Item>
                        ) : null}
                    </ListGroup>
                </Col>
            </Row>

            <hr className="my-5" />

            <h4 className="mb-3">Reviews</h4>

            {reviewsError && (
                <Alert variant="danger" dismissible onClose={() => setReviewsError(null)}>
                    {reviewsError}
                </Alert>
            )}

            {user ? (
                <Card className="mb-4 shadow-sm">
                    <Card.Body>
                        <Card.Title className="h6">Write a review</Card.Title>
                        <Form onSubmit={handleSubmitReview}>
                            <Form.Group className="mb-2">
                                <Form.Label>Rating</Form.Label>
                                <Form.Select
                                    value={newRating}
                                    onChange={(e) =>
                                        setNewRating(Number(e.target.value))
                                    }
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option key={n} value={n}>
                                            {n} — {n === 1 ? "star" : "stars"}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Comment</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="What did you think?"
                                />
                            </Form.Group>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submittingReview}
                            >
                                {submittingReview ? "Posting…" : "Post review"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            ) : (
                <Alert variant="light" className="border mb-4">
                    <Link to="/login">Sign in</Link> or{" "}
                    <Link to="/register">register</Link> to leave a review.
                </Alert>
            )}

            {reviewsLoading ? (
                <div className="text-center py-3">
                    <Spinner animation="border" size="sm" />
                </div>
            ) : reviews.length === 0 ? (
                <p className="text-muted">No reviews for this book yet.</p>
            ) : (
                <ListGroup variant="flush" className="border rounded">
                    {reviews.map((r) => {
                        const name = authorLabel(r.userId);
                        return (
                        <ListGroup.Item
                            key={`${r.bookId}-${r.id}`}
                            className="d-flex flex-column gap-1 py-3"
                        >
                            <div className="d-flex justify-content-between align-items-start">
                                <div>
                                    <strong>
                                        {"★".repeat(r.rating)}
                                        {"☆".repeat(5 - r.rating)}
                                    </strong>
                                    <span className="text-muted small ms-2">
                                        {name == null ? (
                                            <Spinner
                                                animation="border"
                                                size="sm"
                                                className="align-middle"
                                                style={{
                                                    width: "0.65rem",
                                                    height: "0.65rem",
                                                }}
                                            />
                                        ) : (
                                            <>· {name}</>
                                        )}
                                    </span>
                                </div>
                                {user?.id === r.userId && (
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteReview(r.bookId, r.id)
                                        }
                                    >
                                        Delete
                                    </Button>
                                )}
                            </div>
                            {r.comment ? (
                                <p className="mb-0 small">{r.comment}</p>
                            ) : null}
                            {r.createdAt ? (
                                <small className="text-muted">{r.createdAt}</small>
                            ) : null}
                        </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            )}

            <Modal show={showDelete} onHide={() => !deleting && setShowDelete(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Delete «{book.name}»? This cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDelete(false)}
                        disabled={deleting}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                        {deleting ? "Deleting…" : "Delete"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default BookScreen;
