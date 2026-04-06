import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Row, Button, Spinner, Alert } from "react-bootstrap";
import HomeCarousel from "../components/Carousel";
import Book from "../components/Book";
import { booksApi } from "../lib/booksApi";

const HomeScreen = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            setError(null);
            try {
                const { data } = await booksApi.list();
                if (!cancelled) setBooks(Array.isArray(data) ? data : []);
            } catch (e) {
                if (!cancelled) {
                    setError(
                        e.response?.data?.message ||
                            "No se pudieron cargar los libros."
                    );
                    setBooks([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <>
            <HomeCarousel />

            <div className="container my-5">
                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                    <h2 className="mb-0">Los más vendidos</h2>
                    <Link to="/books/new">
                        <Button variant="primary">Nuevo libro</Button>
                    </Link>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" role="status" />
                    </div>
                ) : (
                    <Row>
                        {books.length === 0 && !error ? (
                            <Col>
                                <p className="text-muted">
                                    No hay libros todavía.{" "}
                                    <Link to="/books/new">Crea el primero</Link>.
                                </p>
                            </Col>
                        ) : (
                            books.map((book) => (
                                <Col key={book.id} sm={12} md={6} lg={4} xl={3}>
                                    <Book book={book} />
                                </Col>
                            ))
                        )}
                    </Row>
                )}
            </div>
        </>
    );
};

export default HomeScreen;
