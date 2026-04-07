import React, { useContext } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Header = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>MyBookStore</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <LinkContainer to="/books/new">
                                <Nav.Link>New book</Nav.Link>
                            </LinkContainer>
                            {!user ? (
                                <>
                                    <LinkContainer to="/login">
                                        <Nav.Link>Sign in</Nav.Link>
                                    </LinkContainer>
                                    <LinkContainer to="/register">
                                        <Nav.Link>Register</Nav.Link>
                                    </LinkContainer>
                                </>
                            ) : (
                                <NavDropdown
                                    title={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.email}
                                    id="user-dropdown"
                                >
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to="/orders">
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Item onClick={handleLogout}>
                                        Sign out
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                            {user && (
                                <LinkContainer to="/cart">
                                    <Nav.Link className="d-flex align-items-center">
                                        <FaShoppingCart style={{ marginRight: "5px" }} />
                                        Cart
                                    </Nav.Link>
                                </LinkContainer>
                            )}
                            <LinkContainer to="/about">
                                <Nav.Link>About</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
