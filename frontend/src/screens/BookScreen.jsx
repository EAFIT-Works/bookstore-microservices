import React, { useState, useEffect } from "react";
import { booksApi } from "../lib/booksApi";
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
} from "react-bootstrap";

const BookScreen = () => {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
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
                            "No se pudo cargar el libro."
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

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await booksApi.remove(id);
            navigate("/");
        } catch (e) {
            setError(
                e.response?.data?.message || "No se pudo eliminar el libro."
            );
        } finally {
            setDeleting(false);
            setShowDelete(false);
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
                        <Button variant="light">← Regresar al Catálogo</Button>
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
                    <Button variant="light" aria-label="Regresar a la página principal">
                        ← Regresar al Catálogo
                    </Button>
                </Link>
                <Link to={`/book/${id}/edit`} className="ms-auto">
                    <Button variant="outline-primary">Editar</Button>
                </Link>
                <Button variant="outline-danger" onClick={() => setShowDelete(true)}>
                    Eliminar
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
                        <ListGroup.Item>Autor: {book.author}</ListGroup.Item>
                        <ListGroup.Item variant="flush">
                            Descripción: {book.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            Estado:{" "}
                            {book.countInStock > 0 ? "Disponible" : "No Disponible"}{" "}
                            ({book.countInStock}) uds
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <strong>Precio:</strong> {book.price}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
            </Row>

            <Modal show={showDelete} onHide={() => !deleting && setShowDelete(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar libro</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Seguro que quieres eliminar «{book.name}»? Esta acción no se puede
                    deshacer.
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDelete(false)}
                        disabled={deleting}
                    >
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDelete} disabled={deleting}>
                        {deleting ? "Eliminando…" : "Eliminar"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default BookScreen;
