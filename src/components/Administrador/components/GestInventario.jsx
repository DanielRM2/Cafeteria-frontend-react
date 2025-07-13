import React, { useEffect, useState } from "react";
import {
    fetchDataSimple,
    putDataSimple,
    deleteDataSimple
} from "../utils/api.js";
import "../css/General.css";

export default function GestInventario() {
    const [inventario, setInventario] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [registroAEliminar, setRegistroAEliminar] = useState(null);
    const [registroAEditar, setRegistroAEditar] = useState(null);
    const [nuevoRegistro, setNuevoRegistro] = useState({
        idProducto: "",
        cantidadDisponible: ""
    });

    // --- FILTROS Y PAGINACIÓN ---
    const [filtroIdInventario, setFiltroIdInventario] = useState("");
    const [filtroProducto, setFiltroProducto] = useState("");
    const [pagina, setPagina] = useState(1);
    const itemsPorPagina = 10;

    // Filtrado encadenado
    const inventarioFiltrado = inventario.filter(item =>
        (filtroIdInventario === "" || String(item.idInventario).includes(filtroIdInventario)) &&
        (filtroProducto === "" || (item.nombreProducto || productos.find(p => p.idProducto === item.idProducto)?.nombre || "").toLowerCase().includes(filtroProducto.toLowerCase()))

    );
    const totalPaginas = Math.ceil(inventarioFiltrado.length / itemsPorPagina);
    const indexUltimo = pagina * itemsPorPagina;
    const indexPrimero = indexUltimo - itemsPorPagina;
    const inventarioActual = inventarioFiltrado.slice(indexPrimero, indexUltimo);
    const handleAnterior = () => setPagina((p) => Math.max(p - 1, 1));
    const handleSiguiente = () => setPagina((p) => Math.min(p + 1, totalPaginas));
    const handleIrPagina = (num) => setPagina(num);

    // Cargar inventario y productos
    useEffect(() => {
        Promise.all([
            fetchDataSimple("/api/inventario"),
            fetchDataSimple("/api/productos/listar")
        ])
            .then(([inv, prods]) => {
                setInventario(inv);
                setProductos(prods);
            })
            .catch(() => {
                setInventario([]);
                setProductos([]);
            })
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (e) => {
        setNuevoRegistro({ ...nuevoRegistro, [e.target.name]: e.target.value });
    };

    // EDITAR
    const handleEditarClick = (registro) => {
        setRegistroAEditar(registro);
        setNuevoRegistro({
            idProducto: registro.idProducto,
            nombreProducto: registro.nombreProducto || productos.find(p => p.idProducto === registro.idProducto)?.nombre || "",
            cantidadDisponible: registro.cantidadDisponible
        });
        setShowEditModal(true);
    };

    const handleEditarRegistro = (e) => {
        e.preventDefault();
        putDataSimple(`/api/inventario/${registroAEditar.idInventario}`, {
            idProducto: Number(nuevoRegistro.idProducto),
            nombreProducto: nuevoRegistro.nombreProducto,
            cantidadDisponible: Number(nuevoRegistro.cantidadDisponible)
        })
            .then((data) => {
                setInventario(inventario.map(r => (r.idInventario === data.idInventario ? data : r)));
                setShowEditModal(false);
                setRegistroAEditar(null);
            })
            .catch(() => alert("Error al editar registro de inventario"));
    };

    // ELIMINAR
    const handleEliminarClick = (registro) => {
        setRegistroAEliminar(registro);
        setShowDeleteModal(true);
    };

    const handleEliminarRegistro = () => {
        deleteDataSimple(`/api/inventario/${registroAEliminar.idInventario}`)
            .then(() => {
                setInventario(inventario.filter(r => r.idInventario !== registroAEliminar.idInventario));
                setShowDeleteModal(false);
                setRegistroAEliminar(null);
            })
            .catch(() => alert("Error al eliminar registro de inventario"));
    };

    return (
        <div>
            {/* Filtros avanzados arriba de la tabla y del cargando */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex flex-wrap gap-2 items-center flex-1 min-w-0">
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-32 min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="ID Inventario"
                        value={filtroIdInventario}
                        onChange={e => { setFiltroIdInventario(e.target.value); setPagina(1); }}
                    />
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-40 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Producto"
                        value={filtroProducto}
                        onChange={e => { setFiltroProducto(e.target.value); setPagina(1); }}
                    />

                    <button
                        className="px-3 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300 transition-all duration-150"
                        onClick={() => {
                            setFiltroIdInventario(""); setFiltroProducto(""); setPagina(1);
                        }}
                    >Limpiar filtros</button>
                </div>
            </div>
            {loading ? (
                <div className="text-gray-500">Cargando...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-blue-200 rounded-lg shadow">
                        <thead>
                            <tr className="bg-blue-200">
                                <th className="px-4 py-2 border-b text-left">ID</th>
                                <th className="px-4 py-2 border-b text-left">Producto</th>
                                <th className="px-4 py-2 border-b text-left">Cantidad Disponible</th>
                                <th className="px-4 py-2 border-b text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventarioActual.map(item => (
                                <tr
                                    key={item.idInventario}
                                    className={"bg-white hover:bg-blue-100 transition-colors border-b"}
                                >
                                    <td className="px-4 py-2 border-b-2">{item.idInventario}</td>
                                    <td className="px-4 py-2 border-b-2">{item.nombreProducto || productos.find(p => p.idProducto === item.idProducto)?.nombre || item.idProducto}</td>
                                    <td className="px-4 py-2 border-b-2">{item.cantidadDisponible}</td>
                                    <td className="px-4 py-2 border-b-2 space-x-2 flex">
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={() => handleEditarClick(item)}>Editar</button>
                                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800" onClick={() => handleEliminarClick(item)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {inventarioActual.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-400 py-4">
                                        No hay registros de inventario.
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

            {/* Modal para editar registro */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Editar Registro de Inventario</h3>
                        <form onSubmit={handleEditarRegistro} className="space-y-4">
                            <input
                                name="nombreProducto"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre del producto"
                                value={nuevoRegistro.nombreProducto}
                                onChange={handleInputChange}
                                required
                                maxLength={50}
                            />
                            <input
                                name="cantidadDisponible"
                                type="number"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Cantidad disponible"
                                value={nuevoRegistro.cantidadDisponible}
                                onChange={handleInputChange}
                                required
                                min="0"
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
                        <h3 className="text-lg font-bold mb-4">¿Estás seguro de eliminar este registro?</h3>
                        <p className="mb-6 text-gray-700">{registroAEliminar?.nombreProducto}</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={handleEliminarRegistro}
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