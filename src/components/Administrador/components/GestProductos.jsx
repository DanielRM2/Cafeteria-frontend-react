import React, { useEffect, useState } from "react";
import {
    fetchDataSimple,
    deleteDataSimple,
    postDataForm,
    putDataForm,
    URL
} from "../utils/api.js";
import "../css/General.css";


export default function GestProductos() {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
    const [productoAEditar, setProductoAEditar] = useState(null);
    const [nuevoProducto, setNuevoProducto] = useState({
        nombre: "",
        descripcion: "",
        precio: "",
        idCategoriaProducto: "",
        stock: ""
    });
    const [imagenFile, setImagenFile] = useState(null);

    // Filtros
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [filtroPrecioMin, setFiltroPrecioMin] = useState('');
    const [filtroPrecioMax, setFiltroPrecioMax] = useState('');
    const [filtroNombre, setFiltroNombre] = useState('');

    // --- PAGINACIÓN ---
    const [pagina, setPagina] = useState(1);
    const productosPorPagina = 10;

    useEffect(() => {
        fetchDataSimple("/api/productos/listar")
            .then(setProductos)
            .catch(() => setProductos([]))
            .finally(() => setLoading(false));

        fetchDataSimple("/api/categorias-producto/listar")
            .then(setCategorias)
            .catch(() => setCategorias([]));
    }, []);

    const handleInputChange = (e) => {
        setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
    };

    // CREAR PRODUCTO
    const handleCrearProducto = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", nuevoProducto.nombre);
        formData.append("descripcion", nuevoProducto.descripcion);
        formData.append("precio", nuevoProducto.precio);
        formData.append("idCategoriaProducto", nuevoProducto.idCategoriaProducto);
        formData.append("stock", nuevoProducto.stock);
        if (imagenFile) {
            formData.append("imagen", imagenFile);
        } else {
            alert("Debes seleccionar una imagen");
            return;
        }
        postDataForm("/api/productos", formData)
            .then((data) => {
                setProductos([...productos, data]);
                setShowModal(false);
                setNuevoProducto({ nombre: "", descripcion: "", precio: "", idCategoriaProducto: "", stock: "" });
                setImagenFile(null);
            })
            .catch(() => alert("Error al crear producto"));
    };

    // EDITAR
    const handleEditarClick = (prod) => {
        setProductoAEditar(prod);
        setNuevoProducto({
            nombre: prod.nombre,
            descripcion: prod.descripcion || "",
            precio: prod.precio,
            idCategoriaProducto: prod.idCategoriaProducto,
            stock: prod.stock
        });
        setImagenFile(null);
        setShowEditModal(true);
    };

    const handleEditarProducto = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nombre", nuevoProducto.nombre);
        formData.append("descripcion", nuevoProducto.descripcion);
        formData.append("precio", nuevoProducto.precio);
        formData.append("idCategoriaProducto", nuevoProducto.idCategoriaProducto);
        formData.append("stock", nuevoProducto.stock);
        if (imagenFile) {
            formData.append("imagen", imagenFile);
        }
        putDataForm(`/api/productos/${productoAEditar.idProducto}`, formData)
            .then((data) => {
                setProductos(productos.map(p => (p.idProducto === data.idProducto ? data : p)));
                setShowEditModal(false);
                setProductoAEditar(null);
                setImagenFile(null);
            })
            .catch(() => alert("Error al editar producto"));
    };

    // ELIMINAR
    const handleEliminarClick = (prod) => {
        setProductoAEliminar(prod);
        setShowDeleteModal(true);
    };

    const handleEliminarProducto = () => {
        deleteDataSimple(`/api/productos/${productoAEliminar.idProducto}`)
            .then(() => {
                setProductos(productos.filter(p => p.idProducto !== productoAEliminar.idProducto));
                setShowDeleteModal(false);
                setProductoAEliminar(null);
            })
            .catch(() => alert("Error al eliminar producto"));
    };

    // Filtrado de productos
    const productosFiltrados = productos.filter(prod => {
        if (filtroCategoria && prod.idCategoriaProducto !== Number(filtroCategoria)) return false;
        if (filtroPrecioMin && Number(prod.precio) < Number(filtroPrecioMin)) return false;
        if (filtroPrecioMax && Number(prod.precio) > Number(filtroPrecioMax)) return false;
        if (filtroNombre && !prod.nombre.toLowerCase().includes(filtroNombre.toLowerCase())) return false;
        return true;
    });

    const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
    const indexUltimo = pagina * productosPorPagina;
    const indexPrimero = indexUltimo - productosPorPagina;
    const productosActuales = productosFiltrados.slice(indexPrimero, indexUltimo);

    const handleAnterior = () => setPagina(p => Math.max(p - 1, 1));
    const handleSiguiente = () => setPagina(p => Math.min(p + 1, totalPaginas));
    const handleIrPagina = (num) => setPagina(num);

    return (
        <div>
            {/* Filtros y botón añadir producto */}
            <div className="mb-4 flex flex-col sm:flex-row gap-2 sm:items-center justify-between">
                <div className="flex flex-wrap gap-2 items-center flex-1 min-w-0">
                    <select
                        className="border border-blue-300 rounded px-3 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                        value={filtroCategoria}
                        onChange={e => { setFiltroCategoria(e.target.value); setPagina(1); }}
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.idCategoriaProducto} value={cat.idCategoriaProducto}>
                                {cat.nombreCategoria}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        className="border border-blue-300 rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="S/. Mín"
                        value={filtroPrecioMin}
                        onChange={e => { setFiltroPrecioMin(e.target.value); setPagina(1); }}
                        min="0"
                    />
                    <input
                        type="number"
                        className="border border-blue-300 rounded px-3 py-2 w-24 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="S/. Máx."
                        value={filtroPrecioMax}
                        onChange={e => { setFiltroPrecioMax(e.target.value); setPagina(1); }}
                        min="0"
                    />
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-40 min-w-[120px] flex-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Buscar por nombre..."
                        value={filtroNombre}
                        onChange={e => { setFiltroNombre(e.target.value); setPagina(1); }}
                    />
                    <button
                        className="px-3 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300 transition-all duration-150"
                        onClick={() => {
                            setFiltroCategoria('');
                            setFiltroPrecioMin('');
                            setFiltroPrecioMax('');
                            setFiltroNombre('');
                            setPagina(1);
                        }}
                    >Limpiar filtros</button>
                </div>
                <button
                    className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white font-semibold rounded shadow hover:scale-105 hover:from-green-500 hover:to-green-700 transition-all duration-150"
                    onClick={() => setShowModal(true)}
                >
                    + Añadir producto
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
                                <th className="px-4 py-2 border-b text-left">Descripción</th>
                                <th className="px-4 py-2 border-b text-left">Precio (S/.)</th>
                                <th className="px-4 py-2 border-b text-left">Categoría</th>
                                <th className="px-4 py-2 border-b text-left">Stock</th>
                                <th className="px-4 py-2 border-b text-left">Imagen</th>
                                <th className="px-4 py-2 border-b text-left">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosActuales
                                .map((prod) => (
                                    <tr
                                        key={prod.idProducto}
                                        className={
                                            "bg-white hover:bg-blue-100 transition-colors border-b"
                                        }
                                    >
                                        <td className="px-4 py-2 border-b-2">{prod.idProducto}</td>
                                        <td className="px-4 py-2 border-b-2">{prod.nombre}</td>
                                        <td className="px-4 py-2 border-b-2">{prod.descripcion}</td>
                                        <td className="px-4 py-2 border-b-2">{prod.precio.toFixed(2)}</td>
                                        <td className="px-4 py-2 border-b-2">{prod.nombreCategoria}</td>
                                        <td className="px-4 py-2 border-b-2">{prod.stock}</td>
                                        <td className="px-4 py-2 border-b-2">
                                            {prod.imagen && (
                                                <img
                                                    src={`${URL}/uploads/${prod.imagen}`}
                                                    alt={prod.nombre}
                                                    className="h-12 w-12 object-cover rounded"
                                                />
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border-b space-x-2 flex">
                                            <button className=" bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800" onClick={() => handleEditarClick(prod)}>Editar</button>
                                            <button className=" bg-red-500 text-white px-4 py-2 rounded hover:bg-red-800" onClick={() => handleEliminarClick(prod)}>Eliminar</button>
                                        </td>
                                    </tr>
                                ))}
                            {productosActuales.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center text-gray-400 py-4">
                                        No hay productos registrados.
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

            {/* Modal para crear producto */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Nuevo Producto</h3>
                        <form onSubmit={handleCrearProducto} className="space-y-4">
                            <input
                                name="nombre"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre"
                                value={nuevoProducto.nombre}
                                onChange={handleInputChange}
                                required
                            />
                            <textarea
                                name="descripcion"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Descripción"
                                value={nuevoProducto.descripcion}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="precio"
                                type="number"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Precio"
                                value={nuevoProducto.precio}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                name="idCategoriaProducto"
                                className="w-full border px-3 py-2 rounded"
                                value={nuevoProducto.idCategoriaProducto}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map(cat => (
                                    <option key={cat.idCategoriaProducto} value={cat.idCategoriaProducto}>
                                        {cat.nombreCategoria}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="stock"
                                type="number"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Stock"
                                value={nuevoProducto.stock}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="imagen"
                                type="file"
                                accept="image/*"
                                className="w-full border px-3 py-2 rounded"
                                onChange={e => setImagenFile(e.target.files[0])}
                                required
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded"
                                    onClick={() => {
                                        setShowModal(false);
                                        setImagenFile(null);
                                    }}
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

            {/* Modal para editar producto */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <div className="bg-white rounded shadow-lg p-8 w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Editar Producto</h3>
                        <form onSubmit={handleEditarProducto} className="space-y-4">
                            <input
                                name="nombre"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Nombre"
                                value={nuevoProducto.nombre}
                                onChange={handleInputChange}
                                required
                            />
                            <textarea
                                name="descripcion"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Descripción"
                                value={nuevoProducto.descripcion}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="precio"
                                type="number"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Precio"
                                value={nuevoProducto.precio}
                                onChange={handleInputChange}
                                required
                            />
                            <select
                                name="idCategoriaProducto"
                                className="w-full border px-3 py-2 rounded"
                                value={nuevoProducto.idCategoriaProducto}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map(cat => (
                                    <option key={cat.idCategoriaProducto} value={cat.idCategoriaProducto}>
                                        {cat.nombreCategoria}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="stock"
                                type="number"
                                className="w-full border px-3 py-2 rounded"
                                placeholder="Stock"
                                value={nuevoProducto.stock}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                name="imagen"
                                type="file"
                                accept="image/*"
                                className="w-full border px-3 py-2 rounded"
                                onChange={e => setImagenFile(e.target.files[0])}
                            />
                            {productoAEditar?.imagen && (
                                <img
                                    src={`http://localhost:8080/uploads/${productoAEditar.imagen}`}
                                    alt={productoAEditar.nombre}
                                    className="h-20 w-20 object-cover rounded mt-2"
                                />
                            )}
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-200 rounded"
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setImagenFile(null);
                                    }}
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
                        <h3 className="text-lg font-bold mb-4">¿Estás seguro de eliminar este producto?</h3>
                        <p className="mb-6 text-gray-700">{productoAEliminar?.nombre}</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded"
                                onClick={handleEliminarProducto}
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