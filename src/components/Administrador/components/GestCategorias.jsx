import React, { useEffect, useState } from "react";
import {
    fetchDataSimple,
    postDataSimple,
    putDataSimple,
    deleteDataSimple
} from "../utils/api.js";
import "../css/General.css";

export default function GestCategorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);
    const [categoriaAEditar, setCategoriaAEditar] = useState(null);
    const [nuevaCategoria, setNuevaCategoria] = useState({
        nombreCategoria: ""
    });
    const [filtroNombre, setFiltroNombre] = useState("");
    // --- PAGINACIÓN ---
    const [pagina, setPagina] = useState(1);
    const categoriasPorPagina = 10;

    useEffect(() => {
        fetchDataSimple("/api/categorias-producto/listar")
            .then(setCategorias)
            .catch(() => setCategorias([]))
            .finally(() => setLoading(false));
    }, []);

    const handleInputChange = (e) => {
        setNuevaCategoria({ ...nuevaCategoria, [e.target.name]: e.target.value });
    };

    // CREAR CATEGORÍA
    const handleCrearCategoria = (e) => {
        e.preventDefault();
        postDataSimple("/api/categorias-producto", nuevaCategoria)
            .then((data) => {
                setCategorias([...categorias, data]);
                setShowModal(false);
                setNuevaCategoria({ nombreCategoria: "" });
            })
            .catch(() => alert("Error al crear categoría"));
    };

    // EDITAR
    const handleEditarClick = (categoria) => {
        setCategoriaAEditar(categoria);
        setNuevaCategoria({ nombreCategoria: categoria.nombreCategoria });
        setShowEditModal(true);
    };

    const handleEditarCategoria = (e) => {
        e.preventDefault();
        putDataSimple(`/api/categorias-producto/${categoriaAEditar.idCategoriaProducto}`, nuevaCategoria)
            .then((data) => {
                setCategorias(categorias.map(c => (c.idCategoriaProducto === data.idCategoriaProducto ? data : c)));
                setShowEditModal(false);
                setCategoriaAEditar(null);
            })
            .catch(() => alert("Error al editar categoría"));
    };

    // ELIMINAR
    const handleEliminarClick = (categoria) => {
        setCategoriaAEliminar(categoria);
        setShowDeleteModal(true);
    };

    const handleEliminarCategoria = () => {
        deleteDataSimple(`/api/categorias-producto/${categoriaAEliminar.idCategoriaProducto}`)
            .then(() => {
                setCategorias(categorias.filter(c => c.idCategoriaProducto !== categoriaAEliminar.idCategoriaProducto));
                setShowDeleteModal(false);
                setCategoriaAEliminar(null);
            })
            .catch(() => alert("Error al eliminar categoría"));
    };

    // Filtrado por nombre
    const categoriasFiltradas = categorias.filter(cat => cat.nombreCategoria.toLowerCase().includes(filtroNombre.toLowerCase()));
    const totalPaginas = Math.ceil(categoriasFiltradas.length / categoriasPorPagina);
    const indexUltimo = pagina * categoriasPorPagina;
    const indexPrimero = indexUltimo - categoriasPorPagina;
    const categoriasActuales = categoriasFiltradas.slice(indexPrimero, indexUltimo);

    const handleAnterior = () => setPagina(p => Math.max(p - 1, 1));
    const handleSiguiente = () => setPagina(p => Math.min(p + 1, totalPaginas));
    const handleIrPagina = (num) => setPagina(num);

    return (
        <div>
            {/* Filtro por nombre y botón nueva categoría */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
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
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded shadow hover:scale-105 hover:from-green-500 hover:to-green-700 transition-all duration-150"
                    onClick={() => setShowModal(true)}
                >
                    + Añadir categoría
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
                        {categoriasActuales.map((cat) => (
                            <tr key={cat.idCategoriaProducto} className="bg-white hover:bg-blue-100 transition-colors border-b">
                                <td className="px-4 py-2 border-b-2">{cat.idCategoriaProducto}</td>
                                <td className="px-4 py-2 border-b-2">{cat.nombreCategoria}</td>
                                <td className="px-4 py-2 border-b-2 flex gap-2">
                                    <button onClick={() => handleEditarClick(cat)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800 font-bold shadow">Editar</button>
                                    <button onClick={() => handleEliminarClick(cat)} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800 font-bold shadow">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                        {categoriasActuales.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center text-gray-400 py-4">
                                    No hay categorías registradas.
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

            {/* Modal para crear categoría */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Nueva Categoría</h3>
                        <form onSubmit={handleCrearCategoria} className="space-y-4">
                            <input
                                name="nombreCategoria"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre de la categoría"
                                value={nuevaCategoria.nombreCategoria}
                                onChange={handleInputChange}
                                required
                                maxLength={50}
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

            {/* Modal para editar categoría */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Editar Categoría</h3>
                        <form onSubmit={handleEditarCategoria} className="space-y-4">
                            <input
                                name="nombreCategoria"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre de la categoría"
                                value={nuevaCategoria.nombreCategoria}
                                onChange={handleInputChange}
                                required
                                maxLength={50}
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
                        <h3 className="text-lg font-bold mb-4">¿Estás seguro de eliminar esta categoría?</h3>
                        <p className="mb-6 text-gray-700">{categoriaAEliminar?.nombreCategoria}</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={handleEliminarCategoria}
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