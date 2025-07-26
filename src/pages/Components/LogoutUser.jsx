import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import Swal from "sweetalert2";

function LogoutHandler() {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            await signOut(auth);
            sessionStorage.setItem("justLoggedOut", "true");
            await Swal.fire({
                icon: "success",
                title: "Sesión cerrada",
                text: "Has cerrado sesión con éxito.",
                timer: 2000,
                showConfirmButton: false,
            });
            navigate("/", { replace: true });
        };

        logout();
    }, [navigate]);

    return null;
}

export default LogoutHandler;
