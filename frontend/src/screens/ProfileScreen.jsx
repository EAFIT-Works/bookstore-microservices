import React, { useContext } from "react";
import { Container, Card, Row, Col, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const ProfileScreen = () => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return (
            <Container className="py-5 text-center">
                <h3>Not signed in</h3>
                <Link to="/login">Sign in</Link>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4">Profile</h2>
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card className="shadow rounded-4 p-4">
                        <h3>
                            {user.firstName} {user.lastName}
                        </h3>
                        <ListGroup variant="flush" className="mt-3">
                            <ListGroup.Item>
                                <strong>Email:</strong> {user.email}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Balance:</strong>{" "}
                                {user.balance != null ? user.balance : 0}
                            </ListGroup.Item>
                            <ListGroup.Item className="d-flex gap-3 flex-wrap">
                                <Link to="/cart">Cart</Link>
                                <Link to="/orders">Orders</Link>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProfileScreen;
