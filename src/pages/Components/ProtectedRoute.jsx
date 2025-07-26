// src/components/ProtectedRoute.js
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute = ({ children }) => {
    const [user, loading] = useAuthState(auth);

    const [estadoValido, setEstadoValido] = React.useState(null);

    useEffect(() => {
        const verificarEstado = async () => {
            if (user) {
                const docRef = doc(db, "usuarios", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().estado === "activo") {
                    setEstadoValido(true);
                } else {
                    setEstadoValido(false);
                    Swal.fire("Acceso restringido", "Tu cuenta no está activa.", "error");
                }
            }
        };

        if (user) verificarEstado();
    }, [user]);

    if (loading) return <div>Cargando...</div>;

    if (!user) {
        Swal.fire("Acceso restringido", "Debes iniciar sesión.", "warning");
        return <Navigate to="/" />;
    }

    if (estadoValido === false) {
        return <Navigate to="/" />;
    }

    if (estadoValido === null && user) {
        return <div></div>;
    }

    return children;
};

export default ProtectedRoute;
