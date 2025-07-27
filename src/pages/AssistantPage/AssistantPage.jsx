import React, { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import Swal from "sweetalert2";
import { Table, Button, Modal, Form } from "react-bootstrap";
import NavbarDashboard from "../Components/NavbarDashboard";
import FooterDashboard from "../Components/FooterDashboard";

const AssistantPage = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

    // Cargar usuarios desde Firestore al iniciar la página
    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                const datos = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsuarios(datos);
            } catch (error) {
                console.error("Error al obtener usuarios:", error);
            }
        };

        obtenerUsuarios();
    }, []);

    // Confirmar y eliminar usuario
    const eliminarUsuario = async (id) => {
        const resultado = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (resultado.isConfirmed) {
            try {
                await deleteDoc(doc(db, "usuarios", id));
                setUsuarios(usuarios.filter((u) => u.id !== id));
                Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
            } catch (error) {
                console.error("Error al eliminar usuario:", error);
            }
        }
    };

    // Abrir modal para editar usuario
    const abrirModal = (usuario) => {
        setUsuarioSeleccionado({ ...usuario });
        setMostrarModal(true);
    };

    // Cerrar modal
    const cerrarModal = () => {
        setMostrarModal(false);
        setUsuarioSeleccionado(null);
    };

    // Guardar cambios del usuario
    const guardarCambios = async () => {
        try {
            await updateDoc(doc(db, "usuarios", usuarioSeleccionado.id), usuarioSeleccionado);
            setUsuarios((prev) =>
                prev.map((u) => (u.id === usuarioSeleccionado.id ? usuarioSeleccionado : u))
            );
            cerrarModal();
            Swal.fire("Actualizado", "Los datos del usuario han sido actualizados.", "success");
        } catch (error) {
            console.error("Error al actualizar:", error);
        }
    };

    // Calcular edad desde la fecha de nacimiento
    const calcularEdad = (fecha) => {
        const [year, month, day] = fecha.split("-");
        const nacimiento = new Date(year, month - 1, day);
        const hoy = new Date();
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const mesDiferencia = hoy.getMonth() - nacimiento.getMonth();
        if (mesDiferencia < 0 || (mesDiferencia === 0 && hoy.getDate() < nacimiento.getDate())) {
            edad--;
        }
        return edad;
    };

    // Mostrar fecha como dd-mm-yyyy (sin desfase)
    const formatearFecha = (fecha) => {
        const [year, month, day] = fecha.split("-");
        const date = new Date(year, month - 1, day);
        const dia = String(date.getDate()).padStart(2, "0");
        const mes = String(date.getMonth() + 1).padStart(2, "0");
        const anio = date.getFullYear();
        return `${dia}-${mes}-${anio}`;
    };

    return (
        <>
            {/* NAVBAR */}
            <NavbarDashboard />

            {/* LISTAR TABLA */}
            <div className="container mt-5" style={{ paddingTop: '60px' }}>
                <h2 className="mb-4 text-center" > Listado de Auxiliares </h2>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered text-center">
                        <thead className="table-dark">
                            <tr>
                                <th>Nombres </th>
                                < th > Apellidos </th>
                                < th > Fecha Nac. </th>
                                < th > Edad </th>
                                < th > Cédula </th>
                                < th > Teléfono </th>
                                < th > Correo </th>
                                < th > Sexo </th>
                                < th > Estado </th>
                                < th > Rol </th>
                                < th > Acciones </th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios
                                .sort((a, b) => {
                                    // Primero por rol: admin primero
                                    if (a.rol === 'admin' && b.rol !== 'admin') return -1;
                                    if (a.rol !== 'admin' && b.rol === 'admin') return 1;
                                    // Si ambos son auxiliares, ordenar por nombres alfabéticamente
                                    return a.nombres.localeCompare(b.nombres);
                                })
                                .map((usuario) => (
                                    <tr key={usuario.id} >
                                        <td>{usuario.nombres} </td>
                                        < td > {usuario.apellidos} </td>
                                        < td > {formatearFecha(usuario.fechaNacimiento)
                                        } </td>
                                        < td > {calcularEdad(usuario.fechaNacimiento)} </td>
                                        < td > {usuario.cedula} </td>
                                        < td > {usuario.telefono} </td>
                                        < td > {usuario.correo} </td>
                                        < td > {usuario.sexo} </td>
                                        < td >
                                            <span
                                                className={
                                                    `badge ${usuario.estado === 'activo'
                                                        ? 'bg-success'
                                                        : usuario.estado === 'inactivo'
                                                            ? 'bg-danger'
                                                            : 'bg-warning text-dark'
                                                    }`
                                                }
                                            >
                                                {usuario.estado}
                                            </span>
                                        </td>
                                        < td >
                                            <span
                                                className={
                                                    `badge ${usuario.rol === 'admin'
                                                        ? 'bg-success'
                                                        : 'bg-secondary'
                                                    }`
                                                }
                                            >
                                                {usuario.rol}
                                            </span>
                                        </td>
                                        < td >
                                            <Button
                                                variant="warning"
                                                className="me-2"
                                                onClick={() => abrirModal(usuario)}
                                            >
                                                Editar
                                            </Button>
                                            < Button variant="danger" onClick={() => eliminarUsuario(usuario.id)}>
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <p className="text-muted mt-2 small text-center">
                    * Correo y rol no pueden ser editados desde esta interfaz.
                </p>


                {/* Modal para editar usuario */}
                <Modal show={mostrarModal} onHide={cerrarModal} >
                    <Modal.Header closeButton >
                        <Modal.Title>Editar Auxiliar </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            usuarioSeleccionado && (
                                <>
                                    <Form.Group className="mb-3" >
                                        <Form.Label>Nombres </Form.Label>
                                        < Form.Control
                                            type="text"
                                            value={usuarioSeleccionado.nombres}
                                            onChange={(e) =>
                                                setUsuarioSeleccionado({ ...usuarioSeleccionado, nombres: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                    < Form.Group className="mb-3" >
                                        <Form.Label>Apellidos </Form.Label>
                                        < Form.Control
                                            type="text"
                                            value={usuarioSeleccionado.apellidos}
                                            onChange={(e) =>
                                                setUsuarioSeleccionado({ ...usuarioSeleccionado, apellidos: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                    < Form.Group className="mb-3" >
                                        <Form.Label>Cédula </Form.Label>
                                        < Form.Control
                                            type="text"
                                            value={usuarioSeleccionado.cedula}
                                            onChange={(e) =>
                                                setUsuarioSeleccionado({ ...usuarioSeleccionado, cedula: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                    < Form.Group className="mb-3" >
                                        <Form.Label>Teléfono </Form.Label>
                                        < Form.Control
                                            type="text"
                                            value={usuarioSeleccionado.telefono}
                                            onChange={(e) =>
                                                setUsuarioSeleccionado({ ...usuarioSeleccionado, telefono: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                    < Form.Group className="mb-3" >
                                        <Form.Label>Fecha de Nacimiento </Form.Label>
                                        < Form.Control
                                            type="date"
                                            value={usuarioSeleccionado.fechaNacimiento}
                                            onChange={(e) =>
                                                setUsuarioSeleccionado({ ...usuarioSeleccionado, fechaNacimiento: e.target.value })
                                            }
                                        />
                                    </Form.Group>
                                    < Form.Group className="mb-3" >
                                        <Form.Label>Sexo </Form.Label>
                                        < Form.Select
                                            value={usuarioSeleccionado.sexo}
                                            onChange={(e) =>
                                                setUsuarioSeleccionado({ ...usuarioSeleccionado, sexo: e.target.value })
                                            }
                                        >
                                            <option value="" > Selecciona </option>
                                            < option value="Masculino" > Masculino </option>
                                            < option value="Femenino" > Femenino </option>
                                        </Form.Select>
                                    </Form.Group>
                                    < Form.Group className="mb-3" >
                                        <Form.Label>Estado </Form.Label>
                                        < Form.Select
                                            value={usuarioSeleccionado.estado}
                                            onChange={(e) =>
                                                setUsuarioSeleccionado({ ...usuarioSeleccionado, estado: e.target.value })
                                            }
                                        >
                                            <option value="pendiente" > Pendiente </option>
                                            <option value="activo" > Activo </option>
                                            <option value="inactivo" > Inactivo </option>
                                        </Form.Select>
                                    </Form.Group>
                                </>
                            )}
                    </Modal.Body>
                    < Modal.Footer >
                        <Button variant="secondary" onClick={cerrarModal} >
                            Cancelar
                        </Button>
                        < Button variant="primary" onClick={guardarCambios} >
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>

            {/* FOOTER */}
            <FooterDashboard />
        </>
    );
};

export default AssistantPage;
