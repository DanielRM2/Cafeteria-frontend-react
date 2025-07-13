import React, { useEffect, useState } from "react";
import {
    fetchDataSimple,
    postDataSimple,
    putDataSimple,
    deleteDataSimple
} from "../utils/api.js";

export default function GestEmpleados() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [staffAEditar, setStaffAEditar] = useState(null);
    const [nuevoStaff, setNuevoStaff] = useState({
        nombreCompleto: "",
        correo: "",
        contrasena: "",
        rol: "EMPLEADO"
    });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [empleadoAEliminar, setEmpleadoAEliminar] = useState(null);

    // --- FILTROS Y PAGINACIÓN (restaurados y mejorados) ---
    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCorreo, setFiltroCorreo] = useState("");
    const [filtroRol, setFiltroRol] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [pagina, setPagina] = useState(1);
    const empleadosPorPagina = 10;
    const rolesUnicos = Array.from(new Set(staff.map(e => e.rol)));
    const staffFiltrado = staff.filter(e =>
        (filtroNombre === "" || e.nombreCompleto.toLowerCase().includes(filtroNombre.toLowerCase())) &&
        (filtroCorreo === "" || e.correo.toLowerCase().includes(filtroCorreo.toLowerCase())) &&
        (filtroRol === "" || e.rol === filtroRol) &&
        (filtroEstado === "" || (filtroEstado === "activo" ? e.activo : !e.activo))
    );
    const totalPaginas = Math.ceil(staffFiltrado.length / empleadosPorPagina);
    const indexUltimo = pagina * empleadosPorPagina;
    const indexPrimero = indexUltimo - empleadosPorPagina;
    const staffActual = staffFiltrado.slice(indexPrimero, indexUltimo);
    const handleAnterior = () => setPagina(p => Math.max(p - 1, 1));
    const handleSiguiente = () => setPagina(p => Math.min(p + 1, totalPaginas));
    const handleIrPagina = (num) => setPagina(num);

    useEffect(() => {
        fetchDataSimple("/api/staff/listar")
            .then(setStaff)
            .catch(() => setStaff([]))
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (e) => {
        setNuevoStaff({ ...nuevoStaff, [e.target.name]: e.target.value });
    };

    // CREAR STAFF
    const handleCrearStaff = (e) => {
        e.preventDefault();
        postDataSimple("/api/staff/registro", nuevoStaff)
            .then(() => fetchDataSimple("/api/staff/listar").then(setStaff))
            .then(() => {
                setShowModal(false);
                setNuevoStaff({
                    nombreCompleto: "",
                    correo: "",
                    contrasena: "",
                    rol: "EMPLEADO"
                });
            })
            .catch(() => alert("Error al crear staff"));
    };

    // EDITAR STAFF
    const handleEditarClick = (s) => {
        setStaffAEditar(s);
        setNuevoStaff({
            nombreCompleto: s.nombreCompleto,
            correo: s.correo,
            contrasena: "",
            rol: s.rol
        });
        setShowEditModal(true);
    };

    const handleEditarStaff = (e) => {
        e.preventDefault();
        const req = { ...nuevoStaff };
        if (!req.contrasena) delete req.contrasena;
        putDataSimple(`/api/staff/${staffAEditar.id}`, req)
            .then(() => fetchDataSimple("/api/staff/listar").then(setStaff))
            .then(() => {
                setShowEditModal(false);
                setStaffAEditar(null);
            })
            .catch(() => alert("Error al editar staff"));
    };

    // ELIMINAR STAFF (con modal)
    const handleEliminarClick = (empleado) => {
        setEmpleadoAEliminar(empleado);
        setShowDeleteModal(true);
    };

    const handleEliminarStaff = () => {
        if (!empleadoAEliminar) return;
        deleteDataSimple(`/api/staff/${empleadoAEliminar.id}`)
            .then(() => setStaff(staff.filter(s => s.id !== empleadoAEliminar.id)))
            .then(() => {
                setShowDeleteModal(false);
                setEmpleadoAEliminar(null);
            })
            .catch(() => alert("Error al eliminar staff"));
    };

    // BLOQUEAR/DESBLOQUEAR STAFF
    const handleCambiarEstado = (empleado) => {
        putDataSimple(`/api/staff/${empleado.id}/estado?activo=${!empleado.activo}`)
            .then((data) => {
                setStaff(staff.map(s => (s.id === data.id ? data : s)));
            })
            .catch(() => alert("Error al cambiar estado del staff"));
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                {/* Filtros alineados a la izquierda */}
                <div className="flex flex-wrap gap-2 items-center flex-1 min-w-0">
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-48 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChange={e => { setFiltroNombre(e.target.value); setPagina(1); }}
                    />
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-48 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Buscar por correo..."
                        value={filtroCorreo}
                        onChange={e => { setFiltroCorreo(e.target.value); setPagina(1); }}
                    />
                    <select
                        className="border border-blue-300 rounded px-3 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                        value={filtroRol}
                        onChange={e => { setFiltroRol(e.target.value); setPagina(1); }}
                    >
                        <option value="">Todos los roles</option>
                        {rolesUnicos.map(rol => (
                            <option key={rol} value={rol}>{rol}</option>
                        ))}
                    </select>
                    <select
                        className="border border-blue-300 rounded px-3 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                        value={filtroEstado}
                        onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="activo">Activo</option>
                        <option value="inactivo">Inactivo</option>
                    </select>
                    <button
                        className="px-3 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300 transition-all duration-150"
                        onClick={() => {
                            setFiltroNombre(""); setFiltroCorreo(""); setFiltroRol(""); setFiltroEstado(""); setPagina(1);
                        }}
                    >Limpiar filtros</button>
                </div>
                {/* Botón agregar alineado a la derecha, estilo GestCategoria */}
                <button
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded shadow hover:scale-105 hover:from-green-500 hover:to-green-700 transition-all duration-150 min-w-[170px]"
                    onClick={() => setShowModal(true)}
                >
                    + Añadir staff
                </button>
            </div>
            {loading ? (
                <div className="text-gray-500">Cargando...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-blue-200 rounded-lg shadow">
                        <thead>
                        <tr className="bg-blue-200">
                            <th className="px-4 py-2 border-b text-left">ID</th>
                            <th className="px-4 py-2 border-b text-left">Nombre</th>
                            <th className="px-4 py-2 border-b text-left">Correo</th>
                            <th className="px-4 py-2 border-b text-left">Rol</th>
                            <th className="px-4 py-2 border-b text-left">Estado</th>
                            <th className="px-4 py-2 border-b text-left">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {staffActual.map(empleado => (
                            <tr
                                key={empleado.id}
                                className={"bg-white hover:bg-blue-100 transition-colors border-b"}
                            >
                                <td className="px-4 py-2 border-b-2">{empleado.id}</td>
                                <td className="px-4 py-2 border-b-2">{empleado.nombreCompleto}</td>
                                <td className="px-4 py-2 border-b-2">{empleado.correo}</td>
                                <td className="px-4 py-2 border-b-2">{empleado.rol}</td>
                                <td className="px-4 py-2 border-b-2">
                                    {empleado.activo ? (
                                        <span className="text-green-600 font-semibold">Activo</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">Bloqueado</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b-2 space-x-2 flex">
                                    <button
                                        className={`px-4 py-2 rounded text-white ${empleado.activo ? "bg-red-500 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-800"}`}
                                        onClick={() => handleCambiarEstado(empleado)}
                                    >
                                        {empleado.activo ? "Bloquear" : "Desbloquear"}
                                    </button>
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800"
                                        onClick={() => handleEditarClick(empleado)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800"
                                        onClick={() => handleEliminarClick(empleado)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {staffActual.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center text-gray-400 py-4">
                                    No hay staff registrados.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                    <div className="flex justify-center items-center mt-4 gap-1 flex-wrap">
                        <button
                            className="px-4 py-2 rounded bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-all duration-150 disabled:opacity-50"
                            onClick={handleAnterior}
                            disabled={pagina === 1}
                        >
                            Anterior
                        </button>
                        <div className="flex gap-1">
                            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                                <button
                                    key={num}
                                    className={`px-3 py-2 rounded border font-bold focus:outline-none ${
                                        pagina === num
                                            ? "bg-blue-500 text-white border-blue-600 shadow-lg scale-105"
                                            : "bg-white text-blue-700 border-blue-200 hover:bg-blue-100 hover:scale-105 hover:shadow"
                                    }`}
                                    onClick={() => handleIrPagina(num)}
                                    disabled={pagina === num}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        <button
                            className="px-4 py-2 rounded bg-gradient-to-r from-blue-400 to-blue-600 text-white font-semibold shadow hover:scale-105 hover:from-blue-500 hover:to-blue-700 transition-all duration-150 disabled:opacity-50"
                            onClick={handleSiguiente}
                            disabled={pagina === totalPaginas || totalPaginas === 0}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            {/* Modal para crear staff */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Nuevo Staff</h3>
                        <form onSubmit={handleCrearStaff} className="space-y-4">
                            <input
                                name="nombreCompleto"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre completo"
                                value={nuevoStaff.nombreCompleto}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="correo"
                                type="email"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Correo"
                                value={nuevoStaff.correo}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="contrasena"
                                type="password"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Contraseña"
                                value={nuevoStaff.contrasena}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                name="rol"
                                className="w-full border px-3 py-2 rounded"
                                value={nuevoStaff.rol}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="ADMINISTRADOR">Administrador</option>
                                <option value="EMPLEADO">Empleado</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Crear
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para editar staff */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Editar Staff</h3>
                        <form onSubmit={handleEditarStaff} className="space-y-4">
                            <input
                                name="nombreCompleto"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre completo"
                                value={nuevoStaff.nombreCompleto}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="correo"
                                type="email"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Correo"
                                value={nuevoStaff.correo}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="contrasena"
                                type="password"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nueva contraseña (opcional)"
                                value={nuevoStaff.contrasena}
                                onChange={handleInputChange}
                            />
                            <select
                                name="rol"
                                className="w-full border px-3 py-2 rounded"
                                value={nuevoStaff.rol}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="ADMINISTRADOR">Administrador</option>
                                <option value="EMPLEADO">Empleado</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded"
                                    onClick={() => setShowEditModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal para eliminar staff */}
            {showDeleteModal && empleadoAEliminar && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-sm text-center">
                        <h3 className="text-lg font-bold mb-4">¿Estás seguro de eliminar este empleado?</h3>
                        <p className="mb-6 text-gray-700">{empleadoAEliminar.nombreCompleto} ({empleadoAEliminar.correo})</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={handleEliminarStaff}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}