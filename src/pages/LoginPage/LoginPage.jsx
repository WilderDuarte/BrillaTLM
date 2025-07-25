import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/brilla.png";
import logogoogle from "../../assets/google.png";
import "./LoginPage.css";
import { auth, db, googleProvider } from "../../firebase";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    GoogleAuthProvider,
} from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const checkUserEstado = async (email) => {
        const usuariosRef = collection(db, "usuarios");
        const q = query(usuariosRef, where("correo", "==", email));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return { existe: false };

        const userDoc = querySnapshot.docs[0].data();
        return {
            existe: true,
            activo: userDoc.estado === "activo",
        };
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            return Swal.fire("Error", "Todos los campos son obligatorios", "error");
        }

        if (password.length < 6) {
            return Swal.fire("Error", "Contraseña mínima de 6 caracteres", "warning");
        }

        try {
            const estadoUsuario = await checkUserEstado(email.toLowerCase());

            if (!estadoUsuario.existe) {
                return Swal.fire("Error", "Usuario no registrado", "error");
            }

            if (!estadoUsuario.activo) {
                return Swal.fire("Acceso denegado", "Usuario inactivo", "warning");
            }

            await signInWithEmailAndPassword(auth, email, password);
            Swal.fire("Éxito", "Inicio de sesión exitoso", "success");
            navigate("/dashboard");
        } catch (error) {
            Swal.fire("Error", "Credenciales incorrectas", "error");
        }
    };

    const loginConGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const emailGoogle = result.user.email.toLowerCase();

            const estadoUsuario = await checkUserEstado(emailGoogle);

            if (!estadoUsuario.existe) {
                await auth.signOut();
                return Swal.fire(
                    "Error",
                    "Este correo no está registrado. Por favor regístrate primero y contacta al administrador.",
                    "error"
                );
            }

            if (!estadoUsuario.activo) {
                await auth.signOut();
                return Swal.fire("Acceso denegado", "Usuario inactivo", "warning");
            }

            const signInMethods = await fetchSignInMethodsForEmail(auth, emailGoogle);

            if (
                signInMethods.includes("password") &&
                !signInMethods.includes("google.com")
            ) {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                await linkWithCredential(result.user, credential);
                console.log("Cuenta vinculada con Google.");
            }
            Swal.fire("Bienvenido", `Sesión iniciada con Google como ${emailGoogle}`, "success");
            navigate("/dashboard");
        } catch (error) {
            console.error("Error Google Login:", error);
            Swal.fire("Error", "No se pudo iniciar sesión con Google", "error");
        }
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
                        onClick={loginConGoogle}
                        className="btn btn-danger w-100 mb-3 d-flex align-items-center justify-content-center"
                    >
                        <img
                            src={logogoogle}
                            alt="Google Logo"
                            className="me-2"
                            style={{ width: "20px" }}
                        />
                        Iniciar con Google
                    </button>

                    <div className="text-center small-links">
                        <Link to="/register" className="text-secondary d-block mb-2">
                            ¿No tienes cuenta? Regístrate
                        </Link>
                        <Link to="/forgot-password" className="text-secondary">
                            ¿Olvidaste tu contraseña?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
