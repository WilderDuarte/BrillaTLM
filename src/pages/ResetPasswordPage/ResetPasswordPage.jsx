import React, { useState, useEffect } from "react";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../firebase";
import Swal from "sweetalert2";
import { useSearchParams, useNavigate } from "react-router-dom";
import logo from "../../assets/brilla.png";
import "../Styles/StyleGral.css";

function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const oobCode = searchParams.get("oobCode");

    const passwordsMatch = newPassword === repeatPassword && newPassword.length > 0;

    useEffect(() => {
        if (!oobCode) {
            Swal.fire({
                icon: "error",
                title: "Enlace inválido",
                text: "El código no es válido o ha expirado",
                confirmButtonColor: "#6a1b9a",
            }).then(() => navigate("/"));
        }
    }, [oobCode, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await confirmPasswordReset(auth, oobCode, newPassword);
            Swal.fire({
                icon: "success",
                title: "Contraseña actualizada",
                text: "Ahora puedes iniciar sesión",
                confirmButtonColor: "#6a1b9a",
            }).then(() => navigate("/"));
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
                confirmButtonColor: "#6a1b9a",
            });
        }
    };

    return (
        <div className="auth-form-container auth-bg">
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="text-center mb-3">
                    <img src={logo} alt="Logo Brilla" className="logo-shadow" />
                </div>
                <h2 className="text-center mb-4">Nueva contraseña</h2>

                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    className={`form-control mb-3 ${newPassword && repeatPassword ? (passwordsMatch ? "is-valid" : "is-invalid") : ""}`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Repetir contraseña"
                    className={`form-control mb-4 ${newPassword && repeatPassword ? (passwordsMatch ? "is-valid" : "is-invalid") : ""}`}
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                />

                <button
                    type="submit"
                    className="btn btn-warning w-100"
                    disabled={!passwordsMatch}
                >
                    Cambiar contraseña
                </button>
            </form>
        </div>
    );
}

export default ResetPasswordPage;
