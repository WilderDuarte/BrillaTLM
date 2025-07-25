import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/brilla.png";
import "../LoginPage/LoginPage.css";
import "./RegisterPage.css"
//  Imports para Firebase
import { auth, db } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


function RegisterPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombres: "",
        apellidos: "",
        correo: "",
        cedula: "",
        fechaNacimiento: "",
        telefono: "",
        sexo: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    const {
        nombres,
        apellidos,
        correo,
        cedula,
        fechaNacimiento,
        telefono,
        sexo,
        password,
        confirmPassword,
    } = formData;

    // Validaciones básicas
    if (
        !nombres || !apellidos || !correo || !cedula || !fechaNacimiento ||
        !telefono || !sexo || !password || !confirmPassword
    ) {
        return Swal.fire("Error", "Todos los campos son obligatorios", "error");
    }

    if (password.length < 6) {
        return Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres", "warning");
    }

    if (password !== confirmPassword) {
        return Swal.fire("Error", "Las contraseñas no coinciden", "error");
    }

    try {
        const normalizedEmail = correo.toLowerCase();

        // Crear usuario en Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        const user = userCredential.user;

        // Guardar datos en Firestore
        await setDoc(doc(db, "usuarios", user.uid), {
            uid: user.uid,
            nombres,
            apellidos,
            correo: normalizedEmail,
            cedula,
            fechaNacimiento,
            telefono,
            sexo,
            rol: "auxiliar",
            estado: "pendiente",
            creadoEn: new Date(),
            authMethod: "password",
        });

        Swal.fire("Registrado", "Usuario creado exitosamente", "success");
        navigate("/");
    } catch (error) {
        console.error("Error al registrar:", error);

        if (error.code === "auth/email-already-in-use") {
            Swal.fire({
                icon: "error",
                title: "Correo ya registrado",
                text: "Este correo ya está en uso. Si crees que es un error, por favor consulta con el administrador.",
            });
        } else if (error.code === "auth/invalid-email") {
            Swal.fire({
                icon: "error",
                title: "Correo inválido",
                text: "El formato del correo no es válido.",
            });
        } else if (error.code === "auth/weak-password") {
            Swal.fire({
                icon: "warning",
                title: "Contraseña débil",
                text: "La contraseña debe tener al menos 6 caracteres.",
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message || "No se pudo completar el registro.",
            });
        }
    }
};


    return (
        <div className="d-flex justify-content-center align-items-center vh-100 login-bg register-scrollable">
            <div className="card p-4 shadow login-card ">
                <div className="text-center mb-3">
                    <img src={logo} alt="Brilla Logo" className="logo-shadow" />
                </div>

                <h2 className="login-title">Registro de Usuario</h2>

                {/* <form onSubmit={handleSubmit}> */}
                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group mb-3">
                        <label>Nombres</label>
                        <input
                            type="text"
                            className="form-control"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Apellidos</label>
                        <input
                            type="text"
                            className="form-control"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Correo electrónico</label>
                        <input
                            type="email"
                            className="form-control"
                            name="correo"
                            value={formData.correo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Cédula</label>
                        <input
                            type="text"
                            className="form-control"
                            name="cedula"
                            value={formData.cedula}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Fecha de nacimiento</label>
                        <input
                            type="date"
                            className="form-control"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Teléfono</label>
                        <input
                            type="tel"
                            className="form-control"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group mb-3">
                        <label>Sexo</label>
                        <select
                            className="form-control"
                            name="sexo"
                            value={formData.sexo}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione</option>
                            <option value="Masculino">Masculino</option>
                            <option value="Femenino">Femenino</option>
                        </select>
                    </div>

                    <div className="form-group mb-3">
                        <label>Contraseña</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <div className="form-group mb-3">
                        <label>Repetir contraseña</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                className={`form-control ${formData.confirmPassword.length > 0
                                        ? formData.password !== formData.confirmPassword
                                            ? "is-invalid"
                                            : "is-valid"
                                        : ""
                                    }`}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-warning w-100 fw-bold text-white mb-2">
                        Registrarse
                    </button>

                    <Link to="/" className="btn btn-secondary w-100">
                        Volver al Login
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
