import React, { useEffect, useState } from "react";
import {
    fetchDataSimple,
    postDataSimple,
    putDataSimple,
    deleteDataSimple
} from "../utils/api.js";
import "../css/General.css";

export default function GestRoles() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [rolAEliminar, setRolAEliminar] = useState(null);
    const [rolAEditar, setRolAEditar] = useState(null);
    const [nuevoRol, setNuevoRol] = useState({ nombre: "" });

    // --- FILTRO POR NOMBRE Y PAGINACIÓN ---
    const [filtroNombre, setFiltroNombre] = useState("");
    const [pagina, setPagina] = useState(1);
    const rolesPorPagina = 10;
    const rolesFiltrados = roles.filter(r =>
        filtroNombre === "" || (r.nombre || "").toLowerCase().includes(filtroNombre.toLowerCase())
    );
    const totalPaginas = Math.ceil(rolesFiltrados.length / rolesPorPagina);
    const indexUltimo = pagina * rolesPorPagina;
    const indexPrimero = indexUltimo - rolesPorPagina;
    const rolesActuales = rolesFiltrados.slice(indexPrimero, indexUltimo);
    const handleAnterior = () => setPagina((p) => Math.max(p - 1, 1));
    const handleSiguiente = () => setPagina((p) => Math.min(p + 1, totalPaginas));
    const handleIrPagina = (num) => setPagina(num);

    useEffect(() => {
        fetchDataSimple("/api/roles/listar")
            .then(setRoles)
            .catch(() => setRoles([]))
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (e) => {
        setNuevoRol({ ...nuevoRol, [e.target.name]: e.target.value });
    };

    // CREAR ROL
    const handleCrearRol = (e) => {
        e.preventDefault();
        postDataSimple("/api/roles", nuevoRol)
            .then((data) => {
                setRoles([...roles, data]);
                setShowModal(false);
                setNuevoRol({ nombre: "" });
            })
            .catch(() => alert("Error al crear rol"));
    };

    // EDITAR
    const handleEditarClick = (rol) => {
        setRolAEditar(rol);
        setNuevoRol({ nombre: rol.nombre });
        setShowEditModal(true);
    };

    const handleEditarRol = (e) => {
        e.preventDefault();
        putDataSimple(`/api/roles/${rolAEditar.id}`, nuevoRol)
            .then((data) => {
                setRoles(roles.map(r => (r.id === data.id ? data : r)));
                setShowEditModal(false);
                setRolAEditar(null);
            })
            .catch(() => alert("Error al editar rol"));
    };

    // ELIMINAR
    const handleEliminarClick = (rol) => {
        setRolAEliminar(rol);
        setShowDeleteModal(true);
    };

    const handleEliminarRol = () => {
        deleteDataSimple(`/api/roles/${rolAEliminar.id}`)
            .then(() => {
                setRoles(roles.filter(r => r.id !== rolAEliminar.id));
                setShowDeleteModal(false);
                setRolAEliminar(null);
            })
            .catch(() => alert("Error al eliminar rol"));
    };

    return (
        <div>
            {/* Filtros y botón añadir en fila superior */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex flex-wrap gap-2 items-center flex-1 min-w-0">
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-full sm:w-48 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChange={e => { setFiltroNombre(e.target.value); setPagina(1); }}
                    />
                    <button
                        className="px-3 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300 transition-all duration-150"
                        onClick={() => { setFiltroNombre(""); setPagina(1); }}
                    >Limpiar filtro</button>
                </div>
                <button
                    className="px-4 py-2 rounded bg-gradient-to-r from-green-400 to-green-600 text-white font-bold shadow hover:scale-105 hover:from-green-500 hover:to-green-700 transition-all duration-150"
                    onClick={() => setShowModal(true)}
                >
                    + Añadir rol
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
                                <th className="px-4 py-2 border-b text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rolesActuales.map(rol => (
                                <tr
                                    key={rol.id}
                                    className={"bg-white hover:bg-blue-100 transition-colors border-b"}
                                >
                                    <td className="px-4 py-2 border-b-2">{rol.id}</td>
                                    <td className="px-4 py-2 border-b-2">{rol.nombre}</td>
                                    <td className="px-4 py-2 border-b-2 space-x-2 flex">
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={() => handleEditarClick(rol)}>Editar</button>
                                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800" onClick={() => handleEliminarClick(rol)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {rolesActuales.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center text-gray-400 py-4">
                                        No hay roles registrados.
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

            {/* Modal para crear rol */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Nuevo Rol</h3>
                        <form onSubmit={handleCrearRol} className="space-y-4">
                            <input
                                name="nombre"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre del rol"
                                value={nuevoRol.nombre}
                                onChange={handleInputChange}
                                required
                                maxLength={20}
                            />
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

            {/* Modal para editar rol */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Editar Rol</h3>
                        <form onSubmit={handleEditarRol} className="space-y-4">
                            <input
                                name="nombre"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre del rol"
                                value={nuevoRol.nombre}
                                onChange={handleInputChange}
                                required
                                maxLength={20}
                            />
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

            {/* Modal de confirmación para eliminar */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-sm text-center">
                        <h3 className="text-lg font-bold mb-4">¿Estás seguro de eliminar este rol?</h3>
                        <p className="mb-6 text-gray-700">{rolAEliminar?.nombre}</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={handleEliminarRol}
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