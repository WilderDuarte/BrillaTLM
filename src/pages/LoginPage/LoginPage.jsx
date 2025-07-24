import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/brilla.png";
import logogoogle from "../../assets/google.png";
import "./LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();

        if (!email || !password) {
            return Swal.fire("Error", "Todos los campos son obligatorios", "error");
        }

        if (password.length < 6) {
            return Swal.fire(
                "Error",
                "La contraseña debe tener al menos 6 caracteres",
                "warning"
            );
        }

        Swal.fire("Bienvenido", "Inicio de sesión exitoso", "success");
        // Aquí irá la lógica de Firebase luego
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 login-bg">
            <div className="card p-4 shadow login-card">
                <div className="text-center mb-3">
                    <img src={logo} alt="Brilla Logo" className="logo-shadow" />
                </div>

                <h2 className="login-title">Iniciar Sesión</h2>

                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3 text-start">
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Ingresa tu correo"
                            required
                        />
                    </div>

                    <div className="form-group mb-3 text-start">
                        <label>Contraseña</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-warning w-100 mb-2 text-white fw-bold"
                    >
                        Iniciar sesión
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger w-100 mb-3 d-flex align-items-center justify-content-center google-btn"
                    >
                        <img
                            src={logogoogle}
                            alt="Google Logo"
                            className="me-2"
                            style={{ width: "20px" }}
                        />
                        Iniciar con Google
                    </button>

                    <div className="d-flex flex-column text-center small-links">
                        <Link
                            to="/register"
                            className="text-decoration-none text-secondary mb-2"
                        >
                            ¿No tienes cuenta? Regístrate
                        </Link>
                        <Link
                            to="/forgot-password"
                            className="text-decoration-none text-secondary"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
