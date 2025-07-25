// src/pages/DashboardPage.jsx
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Image, Button } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import logo from '../../assets/brilla.png';
import './DashboardPage.css';

function DashboardPage() {
    const navigate = useNavigate();
    const user = auth.currentUser;

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: '¿Cerrar sesión?',
            text: '¿Estás seguro de que deseas salir del sistema?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
        });

        if (result.isConfirmed) {
            await signOut(auth);
            navigate('/');
        }
    };

    return (
        <>
            {/* NAVBAR */}
            <Navbar expand="lg" bg="dark" variant="dark" className="dashboard-navbar">
                <Container>
                    <Navbar.Brand onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        <img src={logo} alt="Brilla Logo" height="40" />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <NavDropdown
                                title={
                                    <>
                                        {user?.photoURL ? (
                                            <Image src={user.photoURL} roundedCircle width="30" height="30" />
                                        ) : (
                                            <FaUserCircle size={24} color="#fff" />
                                        )}
                                    </>
                                }
                                id="user-nav-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item disabled>
                                    {user?.email || 'Usuario'}
                                </NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* CONTENIDO CENTRAL */}
            <main className="dashboard-main">
                <Container className="text-center dashboard-welcome">
                    <img src={logo} alt="Brilla" className="dashboard-logo" />
                    {user?.photoURL ? (
                        <Image src={user.photoURL} roundedCircle className="dashboard-avatar" />
                    ) : (
                        <FaUserCircle size={80} className="dashboard-avatar" />
                    )}
                    <h2 className="mt-3">¡Bienvenido/a al sistema de Brilla!</h2>
                    <p className="dashboard-user-info">
                        <strong>{user?.displayName || 'Usuario'}</strong><br />
                        {user?.email}
                    </p>
                    <Button variant="danger" onClick={handleLogout}>Cerrar Sesión</Button>
                </Container>
            </main>
        </>
    );
}

export default DashboardPage;
