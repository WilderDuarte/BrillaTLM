// src/Components/NavbarDashboard.jsx
import { Navbar, Nav, Container, NavDropdown, Image } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { auth, googleProvider } from "../../firebase";
import { linkWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import logo from "../../assets/brilla.png";

function NavbarDashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(setUser);
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "¿Cerrar sesión?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, salir",
        });
        if (result.isConfirmed) navigate("/logout");
    };

    const handleLinkGoogle = async () => {
        try {
            await linkWithPopup(user, googleProvider);
            await auth.currentUser.reload();
            setUser(auth.currentUser);
            Swal.fire("Cuenta vinculada", "Tu cuenta de Google fue vinculada.", "success");
        } catch (error) {
            if (error.code === "auth/credential-already-in-use") {
                Swal.fire("Error", "Esta cuenta ya está vinculada a otro usuario.", "error");
            } else {
                Swal.fire("Error", error.message, "error");
            }
        }
    };

    if (!user) return null;

    return (
        <Navbar expand="lg" bg="dark" variant="dark" className="dashboard-navbar">
            <Container>
                <Navbar.Brand onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
                    <img src={logo} alt="Brilla Logo" height="40" />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <NavDropdown title="Personas" menuVariant="dark">
                            <NavDropdown.Item onClick={() => navigate("/clientes")}>Clientes</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate("/assistant")}>Auxiliares</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Cronograma" menuVariant="dark">
                            <NavDropdown.Item onClick={() => navigate("/cronograma/ingresar")}>Ingresar</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate("/cronograma/listar")}>Listar</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Servicios" menuVariant="dark">
                            <NavDropdown.Item onClick={() => navigate("/servicios/ingresar")}>Ingresar</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate("/servicios/listar")}>Listar</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link onClick={() => navigate("/opcion")}>Opción</Nav.Link>
                        <NavDropdown
                            title={
                                user.photoURL ? (
                                    <Image src={user.photoURL} roundedCircle width="30" height="30" />
                                ) : (
                                    <FaUserCircle size={24} color="#fff" />
                                )
                            }
                            align="end"
                            menuVariant="dark"
                        >
                            <NavDropdown.Item disabled>{user?.email || "Usuario"}</NavDropdown.Item>
                            {!user.providerData.some((p) => p.providerId === "google.com") && (
                                <NavDropdown.Item onClick={handleLinkGoogle}>Vincular cuenta Google</NavDropdown.Item>
                            )}
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarDashboard;
