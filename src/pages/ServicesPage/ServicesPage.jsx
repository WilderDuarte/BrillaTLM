import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import Swal from 'sweetalert2';
import NavbarDashboard from "../Components/NavbarDashboard";
import FooterDashboard from "../Components/FooterDashboard";
import './ServicesPage.css'

const ServicesPage = () => {
    const [servicios, setServicios] = useState([]);
    const [nuevoServicio, setNuevoServicio] = useState({
        categoria: '',
        servicio: '',
        tiempoAprox: '',
        valor: '',
        descripcion: '',
        publico: '',
        activo: true,
        destacado: false
    });
    const [editandoId, setEditandoId] = useState(null);
    const [formAbierto, setFormAbierto] = useState(false);

    useEffect(() => {
        obtenerServicios();
    }, []);

    const obtenerServicios = async () => {
        const querySnapshot = await getDocs(collection(db, 'servicios'));
        const serviciosObtenidos = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setServicios(serviciosObtenidos);
    };

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setNuevoServicio({
            ...nuevoServicio,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            if (editandoId) {
                const docRef = doc(db, 'servicios', editandoId);
                await updateDoc(docRef, nuevoServicio);
                Swal.fire('Editado', 'El servicio fue actualizado con éxito', 'success');
            } else {
                await addDoc(collection(db, 'servicios'), nuevoServicio);
                Swal.fire('Registrado', 'El nuevo servicio fue creado', 'success');
            }
            obtenerServicios();
            limpiarFormulario();
        } catch (error) {
            console.error('Error al guardar:', error);
            Swal.fire('Error', 'Hubo un problema al guardar el servicio', 'error');
        }
    };

    const limpiarFormulario = () => {
        setNuevoServicio({
            categoria: '',
            servicio: '',
            tiempoAprox: '',
            valor: '',
            descripcion: '',
            publico: '',
            activo: true,
            destacado: false
        });
        setEditandoId(null);
        setFormAbierto(false);
    };

    const handleEditar = servicio => {
        setNuevoServicio(servicio);
        setEditandoId(servicio.id);
        setFormAbierto(true);
    };

    const handleEliminar = async id => {
        const confirm = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará el servicio',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (confirm.isConfirmed) {
            await deleteDoc(doc(db, 'servicios', id));
            Swal.fire('Eliminado', 'El servicio fue eliminado correctamente', 'success');
            obtenerServicios();
            if (editandoId === id) limpiarFormulario();
        }
    };

    return (
        <>
            <NavbarDashboard />

            <div className="container mt-4">
                <h2 className="mb-3 text-center">Gestión de Servicios</h2>

                <details open={formAbierto}>
                    <summary className="btn btn-outline-dark mb-3">
                        {editandoId ? 'Editar servicio' : 'Registrar nuevo servicio'}
                    </summary>

                    <div className="card shadow-sm">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row mb-3">
                                    <div className="col-md-3">
                                        <label className="form-label">Categoría</label>
                                        <input
                                            type="text"
                                            name="categoria"
                                            className="form-control"
                                            value={nuevoServicio.categoria}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Servicio</label>
                                        <input
                                            type="text"
                                            name="servicio"
                                            className="form-control"
                                            value={nuevoServicio.servicio}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Tiempo (min)</label>
                                        <input
                                            type="text"
                                            name="tiempoAprox"
                                            className="form-control"
                                            value={nuevoServicio.tiempoAprox}
                                            onChange={handleChange}
                                            placeholder="Ej: 30"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Valor</label>
                                        <input
                                            type="number"
                                            name="valor"
                                            className="form-control"
                                            value={nuevoServicio.valor}
                                            onChange={handleChange}
                                            placeholder="Solo números"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label">Público</label>
                                        <select
                                            name="publico"
                                            className="form-select"
                                            value={nuevoServicio.publico}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Seleccionar</option>
                                            <option value="hombre">Hombre</option>
                                            <option value="mujer">Mujer</option>
                                            <option value="mixto">Mixto</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row mb-3 align-items-center">
                                    <div className="col-md-3">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="activo"
                                                checked={nuevoServicio.activo}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">¿Activo?</label>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="destacado"
                                                checked={nuevoServicio.destacado}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">¿Destacado?</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Descripción</label>
                                    <input
                                        type="text"
                                        name="descripcion"
                                        className="form-control"
                                        value={nuevoServicio.descripcion}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="submit"
                                        className={`btn ${editandoId ? 'btn-primary' : 'btn-success'}`}
                                    >
                                        {editandoId ? 'Editar Servicio' : 'Registrar Servicio'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={limpiarFormulario}
                                    >
                                        Limpiar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </details>

                <p className="text-muted text-center mt-3">
                    * Para editar un servicio, presione "Editar" y modifique los campos.
                </p>

                {/* TABLA */}
                <table className="table table-bordered table-hover">
                    <thead className="table-dark text-center">
                        <tr>
                            <th>Categoría</th>
                            <th>Servicio</th>
                            <th>Tiempo</th>
                            <th>Valor</th>
                            <th>Descripción</th>
                            <th>Público</th>
                            <th>Activo</th>
                            <th>Destacado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {servicios.map(servicio => (
                            <tr key={servicio.id}>
                                <td>{servicio.categoria}</td>
                                <td>{servicio.servicio}</td>
                                <td>{servicio.tiempoAprox}</td>
                                <td>${servicio.valor}</td>
                                <td>{servicio.descripcion}</td>
                                <td>{servicio.publico}</td>
                                <td>
                                    <span className={`badge ${servicio.activo ? 'bg-success' : 'bg-secondary'}`}>
                                        {servicio.activo ? 'Sí' : 'No'}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${servicio.destacado ? 'bg-warning text-dark' : 'bg-light text-dark'}`}>
                                        {servicio.destacado ? '★' : '—'}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleEditar(servicio)}>
                                        Editar
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(servicio.id)}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {servicios.length === 0 && (
                            <tr>
                                <td colSpan="9" className="text-center text-muted">
                                    No hay servicios registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <FooterDashboard />
        </>
    );
};

export default ServicesPage;
