// Importación de librerías necesarias
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Navbar,
    Nav,
    Container,
    NavDropdown,
    Image,
    Button,
} from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";

// Importar desde tu archivo y directamente desde firebase
import { auth, googleProvider } from "../../firebase";
import { linkWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";

import logo from "../../assets/brilla.png";
import "./DashboardPage.css";

function DashboardPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    // Escucha el estado del usuario autenticado
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser);
        });
        return () => unsubscribe();
    }, []);

    // Cerrar sesión
    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "¿Cerrar sesión?",
            text: "¿Estás seguro de que deseas salir del sistema?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            navigate("/logout");
        }
    };


    // Enlazar cuenta con Google
    const handleLinkGoogle = async () => {
        try {
            await linkWithPopup(user, googleProvider);

            // Recargar datos del usuario desde Firebase
            await auth.currentUser.reload();
            const updatedUser = auth.currentUser;

            setUser(updatedUser); // Actualiza el estado con los nuevos datos

            Swal.fire(
                "Cuenta vinculada",
                "Tu cuenta de Google fue vinculada exitosamente.",
                "success"
            );
        } catch (error) {
            if (error.code === "auth/credential-already-in-use") {
                Swal.fire(
                    "Error",
                    "Esta cuenta de Google ya está vinculada a otro usuario.",
                    "error"
                );
            } else {
                Swal.fire("Error", error.message, "error");
            }
        }
    };


    if (!user) return null;

    return (
        <>
            {/* NAVBAR */}
            <Navbar expand="lg" bg="dark" variant="dark" className="dashboard-navbar">
                <Container>
                    <Navbar.Brand
                        onClick={() => navigate("/dashboard")}
                        style={{ cursor: "pointer" }}
                    >
                        <img src={logo} alt="Brilla Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown title="Personas" menuVariant="dark">
                                <NavDropdown.Item onClick={() => navigate("/clientes")}>
                                    Clientes
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate("/auxiliares")}>
                                    Auxiliares
                                </NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title="Cronograma" menuVariant="dark">
                                <NavDropdown.Item onClick={() => navigate("/cronograma/ingresar")}>
                                    Ingresar
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate("/cronograma/listar")}>
                                    Listar
                                </NavDropdown.Item>
                            </NavDropdown>

                            <NavDropdown title="Servicios" menuVariant="dark">
                                <NavDropdown.Item onClick={() => navigate("/servicios/ingresar")}>
                                    Ingresar
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={() => navigate("/servicios/listar")}>
                                    Listar
                                </NavDropdown.Item>
                            </NavDropdown>

                            <Nav.Link onClick={() => navigate("/opcion")} className="nav-item-hover">
                                Opción
                            </Nav.Link>

                            {/* Usuario */}
                            <NavDropdown
                                title={
                                    user.photoURL ? (
                                        <Image src={user.photoURL} roundedCircle width="30" height="30" />
                                    ) : (
                                        <FaUserCircle size={24} color="#fff" />
                                    )
                                }
                                id="user-nav-dropdown"
                                align="end"
                                menuVariant="dark"
                            >
                                <NavDropdown.Item disabled>
                                    {user?.email || "Usuario"}
                                </NavDropdown.Item>

                                {/* Mostrar opción solo si no está enlazado con Google */}
                                {!user.providerData.some((p) => p.providerId === "google.com") && (
                                    <NavDropdown.Item onClick={handleLinkGoogle}>
                                        Vincular cuenta Google
                                    </NavDropdown.Item>
                                )}

                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    Cerrar Sesión
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* CONTENIDO CENTRAL */}
            <main className="dashboard-main">
                <Container className="text-center dashboard-welcome">
                    <img src={logo} alt="Brilla" className="dashboard-logo" />
                    {user.photoURL ? (
                        <Image src={user.photoURL} roundedCircle className="dashboard-avatar" />
                    ) : (
                        <FaUserCircle size={80} className="dashboard-avatar" />
                    )}
                    <h2 className="mt-3">¡Bienvenido/a al sistema de Brilla!</h2>
                    <p className="dashboard-user-info">
                        <strong>{user.displayName || "Usuario"}</strong>
                        <br />
                        {user.email}
                    </p>
                    <Button variant="danger" onClick={handleLogout}>
                        Cerrar Sesión
                    </Button>
                </Container>
            </main>

            {/* FOOTER */}
            <footer className="footer mt-auto bg-dark">
                <Container className="text-center text-light py-2">
                    <small>© 2025 Brilla. All rights reserved.</small>
                </Container>
            </footer>
        </>
    );
}

export default DashboardPage;
