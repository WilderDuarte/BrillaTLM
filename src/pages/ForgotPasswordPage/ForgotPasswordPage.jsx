import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/brilla.png";
import "../Styles/StyleGral.css";

function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            return Swal.fire("Error", "Ingresa un correo electrónico", "error");
        }

        try {
            await sendPasswordResetEmail(auth, email);
            Swal.fire({
                title: "Enviado",
                text: "Revisa tu correo para restablecer tu contraseña, podría estar en SPAM y tienes aproximadamente 1 hora.",
                icon: "success",
                confirmButtonText: "OK",
            }).then(() => {
                navigate("/");
            });
        } catch (error) {
            console.error(error);
            Swal.fire("Error", error.message || "No se pudo enviar el enlace", "error");
        }
    };

    return (
        <div className="auth-bg d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow auth-card">
                <div className="text-center mb-3">
                    <img src={logo} alt="Logo Brilla" className="logo-shadow" />
                </div>
                <h2 className="auth-title">Recuperar contraseña</h2>

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Correo electrónico"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-warning w-100 fw-bold mb-2">
                        Enviar enlace
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="btn btn-secondary w-100"
                    >
                        Volver al Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
