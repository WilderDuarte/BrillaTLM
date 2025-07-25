import React from "react";
import { Dropdown, Image } from "react-bootstrap";
import { FaSignOutAlt } from "react-icons/fa";
import logoBrilla from "../../assets/brilla.png"; 
import userDefault from "../../assets/user.png"; 
import "./DashboardPage.css";

const DashboardPage = ({ user, onLogout }) => {
    return (
        <div className="dashboard-container">
            {/* NAVBAR */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
                <div className="navbar-brand d-flex align-items-center">
                    <img src={logoBrilla} alt="Brilla" height="35" className="me-2" />
                </div>

                <div className="ms-auto d-flex align-items-center gap-3">
                    <Dropdown>
                        <Dropdown.Toggle variant="secondary" id="dropdown-personas">
                            Personas
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item>Auxiliares</Dropdown.Item>
                            <Dropdown.Item>Clientes</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <button className="btn btn-outline-light">Opción 1</button>
                    <button className="btn btn-outline-light">Opción 2</button>
                    <button className="btn btn-outline-light">Opción 3</button>

                    <Dropdown align="end">
                        <Dropdown.Toggle
                            variant="outline-light"
                            className="d-flex align-items-center"
                            id="dropdown-user"
                        >
                            <Image
                                src={user?.photoURL || userDefault}
                                roundedCircle
                                width={30}
                                height={30}
                                className="me-2"
                            />
                            <span className="d-none d-md-inline">
                                {user?.email || "Usuario"}
                            </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.ItemText>{user?.email}</Dropdown.ItemText>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={onLogout}>
                                <FaSignOutAlt className="me-2" />
                                Cerrar Sesión
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </nav>

            {/* MAIN CONTENT */}
            <div className="welcome-container text-center">
                <img src={logoBrilla} alt="Logo Brilla" className="logo-main" />
                <h2 className="mt-4 text-primary fw-bold">
                    Bienvenido al sistema de BrillaTLM
                </h2>
                <Image
                    src={user?.photoURL || userDefault}
                    roundedCircle
                    width={100}
                    height={100}
                    className="mt-3"
                />
                <h4 className="mt-2 text-secondary">
                    {user?.displayName || "Usuario"}
                </h4>
            </div>

            {/* FOOTER */}
            <footer className="footer mt-auto text-center py-3 bg-dark text-light">
                © 2025 Brilla. All rights reserved.
            </footer>
        </div>
    );
};

export default DashboardPage;
