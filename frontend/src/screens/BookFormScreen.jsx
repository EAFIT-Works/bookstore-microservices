import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Form, Row, Spinner } from "react-bootstrap";
import { booksApi } from "../lib/booksApi";

const emptyForm = {
    name: "",
    author: "",
    description: "",
    price: "",
    image: "",
    countInStock: "",
};

const BookFormScreen = ({ mode }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = mode === "edit";

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isEdit) return;
        let cancelled = false;
        (async () => {
            try {
                const { data } = await booksApi.getById(id);
                if (cancelled) return;
                setForm({
                    name: data.name ?? "",
                    author: data.author ?? "",
                    description: data.description ?? "",
                    price: data.price ?? "",
                    image: data.image ?? "",
                    countInStock:
                        data.countInStock !== undefined && data.countInStock !== null
                            ? String(data.countInStock)
                            : "",
                });
                setError(null);
            } catch (e) {
                if (!cancelled) {
                    setError(
                        e.response?.data?.message ||
                            "Could not load book."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [isEdit, id]);

    const onChange = (field) => (e) => {
        setForm((f) => ({ ...f, [field]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!form.name.trim() || !form.author.trim()) {
            setError("Name and author are required.");
            return;
        }
        const payload = {
            name: form.name.trim(),
            author: form.author.trim(),
            description: form.description.trim() || undefined,
            price: form.price === "" ? undefined : Number(form.price),
            image: form.image.trim() || undefined,
            countInStock:
                form.countInStock === ""
                    ? undefined
                    : Number.parseInt(form.countInStock, 10),
        };
        setSaving(true);
        try {
            if (isEdit) {
                await booksApi.update(id, payload);
                navigate(`/book/${id}`);
            } else {
                const { data } = await booksApi.create(payload);
                navigate(`/book/${data.id}`);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    (isEdit
                        ? "Could not update book."
                        : "Could not create book.")
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    return (
        <>
            <div className="mb-4">
                <Link to={isEdit ? `/book/${id}` : "/"}>
                    <Button variant="light">← Back</Button>
                </Link>
            </div>

            <h2 className="mb-4">{isEdit ? "Edit book" : "New book"}</h2>

            {error && (
                <Alert variant="danger" dismissible onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            <Form onSubmit={onSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                value={form.name}
                                onChange={onChange("name")}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group className="mb-3" controlId="author">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                value={form.author}
                                onChange={onChange("author")}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3" controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={form.description}
                        onChange={onChange("description")}
                    />
                </Form.Group>
                <Row>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                step="any"
                                min="0"
                                value={form.price}
                                onChange={onChange("price")}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="countInStock">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                value={form.countInStock}
                                onChange={onChange("countInStock")}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Image URL</Form.Label>
                            <Form.Control
                                type="url"
                                placeholder="https://..."
                                value={form.image}
                                onChange={onChange("image")}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Button type="submit" variant="primary" disabled={saving}>
                    {saving ? "Saving…" : isEdit ? "Save changes" : "Create book"}
                </Button>
            </Form>
        </>
    );
};

export default BookFormScreen;
