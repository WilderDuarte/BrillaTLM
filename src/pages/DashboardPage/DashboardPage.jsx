// Importación de librerías necesarias
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar,Nav,Container,NavDropdown,Image,Button } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";
import Swal from "sweetalert2";
import { auth } from "../../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import NavbarDashboard from "../../Components/NavbarDashboard";
import FooterDashboard from "../../Components/FooterDashboard";
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

    if (!user) return null;

    return (
        <>
            {/* NAVBAR */}
            <NavbarDashboard />

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
            <FooterDashboard />
        </>
    );
}

export default DashboardPage;
