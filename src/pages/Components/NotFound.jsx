import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
import Swal from "sweetalert2";

function NotFoundPage() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return; // Espera a que termine de verificar el usuario

        const wasLoggedOut = sessionStorage.getItem("justLoggedOut");

        if (wasLoggedOut) {
            sessionStorage.removeItem("justLoggedOut"); // Limpia la marca
            return; // Evita mostrar alert si venías de cerrar sesión
        }

        if (user) {
            Swal.fire({
                icon: "error",
                title: "Página no encontrada",
                text: "Redirigiendo al Dashboard...",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => navigate("/dashboard"));
        } else {
            Swal.fire({
                icon: "warning",
                title: "Ruta inválida",
                text: "Redirigiendo al inicio de sesión...",
                timer: 2000,
                showConfirmButton: false,
            }).then(() => navigate("/"));
        }
    }, [user, loading, navigate]);

    if (loading) return null; // evita render antes de saber si hay usuario

    return null; // o puedes mostrar un loader si deseas
}

export default NotFoundPage;
