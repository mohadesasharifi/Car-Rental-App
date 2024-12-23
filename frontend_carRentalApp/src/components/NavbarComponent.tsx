/** @format */
import React from 'react'; // Add this line

import { Link, useNavigate } from "react-router-dom";
import {  Nav, Navbar } from "react-bootstrap";

function AppNavbar() {
    return (
        <Navbar>
            <Nav className="mr-auto">
                <Nav.Item>
                <Nav.Link as={Link} to="/">
                    Home
                </Nav.Link>
            </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/vehicles">
                        Vehicles
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/trips">
                        Trips
                    </Nav.Link>
                </Nav.Item>

                <Nav.Item>
                    <Nav.Link as={Link} to="/relocations">
                        Relocations
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/maintenance">
                        Maintenance
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/charts">
                        Charts
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/lifetime">
                        Lifetime
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/locations">
                        Locations
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
    );
}

export default AppNavbar;