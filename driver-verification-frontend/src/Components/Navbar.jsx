import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4 rounded">
      <Container>
        <Navbar.Brand href="/">Driver Verification</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Link className="nav-link" to="/register">Register Driver</Link>
            <Link className="nav-link" to="/status">Check Status</Link>
            <Link className="nav-link" to="/admin/login">Admin Panel</Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
