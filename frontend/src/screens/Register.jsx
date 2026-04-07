import { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Register = () => {
    const { register } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const firstName = e.target.firstName.value.trim();
        const lastName = e.target.lastName.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;

        try {
            await register({ email, password, firstName, lastName });
            navigate("/");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    err.message ||
                    "Could not register."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "80vh" }}
        >
            <Card className="p-10 shadow rounded-4" style={{ width: "28rem" }}>
                <Card.Body>
                    <h3 className="text-center mb-4">Create account</h3>

                    {error && (
                        <Alert variant="danger" className="py-2">
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="regFirstName">
                            <Form.Label>First name</Form.Label>
                            <Form.Control
                                name="firstName"
                                required
                                autoComplete="given-name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="regLastName">
                            <Form.Label>Last name</Form.Label>
                            <Form.Control
                                name="lastName"
                                required
                                autoComplete="family-name"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="regEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                required
                                autoComplete="email"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="regPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                required
                                minLength={6}
                                autoComplete="new-password"
                            />
                            <Form.Text muted>At least 6 characters.</Form.Text>
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="w-100 mt-2 rounded-pill"
                            disabled={loading}
                        >
                            {loading ? "Creating account…" : "Register"}
                        </Button>
                    </Form>

                    <p className="text-center mt-3 mb-0 text-muted small">
                        Already have an account?{" "}
                        <Link to="/login">Sign in</Link>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Register;
