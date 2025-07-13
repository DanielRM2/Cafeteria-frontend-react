import React, { useEffect, useState } from "react";
import { fetchDataSimple } from "../utils/api.js";
import "../css/General.css";

export default function GestPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detallePedido, setDetallePedido] = useState(null);
    const [showDetalleModal, setShowDetalleModal] = useState(false);

    const [filtroCliente, setFiltroCliente] = useState("");
    const [filtroCorreo, setFiltroCorreo] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroMetodo, setFiltroMetodo] = useState("");
    const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
    const [filtroFechaFin, setFiltroFechaFin] = useState("");

    // --- PAGINACIÓN ---
    const [pagina, setPagina] = useState(1);
    const pedidosPorPagina = 10;

    // Filtros encadenados
    const pedidosFiltrados = pedidos.filter(p =>
        (filtroCliente === "" || (p.nombreCliente && p.nombreCliente.toLowerCase().includes(filtroCliente.toLowerCase()))) &&
        (filtroCorreo === "" || (p.correo && p.correo.toLowerCase().includes(filtroCorreo.toLowerCase()))) &&
        (filtroEstado === "" || p.estado === filtroEstado) &&
        (filtroMetodo === "" || p.metodoEntrega === filtroMetodo) &&
        (filtroFechaInicio === "" || (p.fechaPedido && new Date(p.fechaPedido) >= new Date(filtroFechaInicio))) &&
        (filtroFechaFin === "" || (p.fechaPedido && new Date(p.fechaPedido) <= new Date(filtroFechaFin)))
    );
    const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
    const indexUltimo = pagina * pedidosPorPagina;
    const indexPrimero = indexUltimo - pedidosPorPagina;
    const pedidosActuales = pedidosFiltrados.slice(indexPrimero, indexUltimo);

    const handleAnterior = () => setPagina(p => Math.max(p - 1, 1));
    const handleSiguiente = () => setPagina(p => Math.min(p + 1, totalPaginas));
    const handleIrPagina = (num) => setPagina(num);

    // Métodos de entrega únicos
    const metodosEntrega = Array.from(new Set(pedidos.map(p => p.metodoEntrega).filter(Boolean)));

    useEffect(() => {
        fetchDataSimple("/api/pedidos/listar")
            .then(setPedidos)
            .catch(() => setPedidos([]))
            .finally(() => setLoading(false));
    }, []);

    const handleVerDetalle = (pedido) => {
        setDetallePedido(pedido);
        setShowDetalleModal(true);
    };

    return (
        <div>
            {/* Filtros avanzados arriba de la tabla y del cargando */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex flex-wrap gap-2 items-center flex-1 min-w-0">
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-48 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Buscar por cliente..."
                        value={filtroCliente}
                        onChange={e => { setFiltroCliente(e.target.value); setPagina(1); }}
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
                        value={filtroEstado}
                        onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }}
                    >
                        <option value="">Todos los estados</option>
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="ENTREGADO">ENTREGADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                    </select>
                    <select
                        className="border border-blue-300 rounded px-3 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                        value={filtroMetodo}
                        onChange={e => { setFiltroMetodo(e.target.value); setPagina(1); }}
                    >
                        <option value="">Todos los métodos</option>
                        {metodosEntrega.map(m => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                    <input
                        type="date"
                        className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={filtroFechaInicio}
                        onChange={e => { setFiltroFechaInicio(e.target.value); setPagina(1); }}
                    />
                    <span className="text-gray-400">a</span>
                    <input
                        type="date"
                        className="border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        value={filtroFechaFin}
                        onChange={e => { setFiltroFechaFin(e.target.value); setPagina(1); }}
                    />
                    <button
                        className="px-3 py-2 bg-gray-200 rounded font-semibold hover:bg-gray-300 transition-all duration-150"
                        onClick={() => {
                            setFiltroCliente(""); setFiltroCorreo(""); setFiltroEstado(""); setFiltroMetodo(""); setFiltroFechaInicio(""); setFiltroFechaFin(""); setPagina(1);
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
                            <th className="px-4 py-2 border-b text-left">Cliente</th>
                            <th className="px-4 py-2 border-b text-left">Método Entrega</th>
                            <th className="px-4 py-2 border-b text-left">Dirección</th>
                            <th className="px-4 py-2 border-b text-left">Fecha Pedido</th>
                            <th className="px-4 py-2 border-b text-left">Estado</th>
                            <th className="px-4 py-2 border-b text-left">Total (S/.)</th>
                            <th className="px-4 py-2 border-b text-left">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pedidosActuales.map(pedido => (
                            <tr
                                key={pedido.idPedido}
                                className={"bg-white hover:bg-blue-100 transition-colors border-b"}
                            >
                                <td className="px-4 py-2 border-b-2">{pedido.idPedido}</td>
                                <td className="px-4 py-2 border-b-2">{pedido.nombreCliente || "-"}</td>
                                <td className="px-4 py-2 border-b-2">{pedido.metodoEntrega || "-"}</td>
                                <td className="px-4 py-2 border-b-2">{pedido.direccion || "-"}</td>
                                <td className="px-4 py-2 border-b-2">{pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleString("es-PE") : "-"}</td>
                                <td className="px-4 py-2 border-b-2">{pedido.estado}</td>
                                <td className="px-4 py-2 border-b-2">{Number(pedido.total).toFixed(2)}</td>
                                <td className="px-4 py-2 border-b-2">
                                    <button
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-800 font-bold shadow"
                                        onClick={() => handleVerDetalle(pedido)}
                                    >
                                        Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {pedidosActuales.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center text-gray-400 py-4">
                                    No hay pedidos registrados.
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

            {/* Modal de Detalles */}
            {showDetalleModal && detallePedido && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl relative animate-fade-in">
                        <button
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition-colors"
                            onClick={() => setShowDetalleModal(false)}
                            aria-label="Cerrar"
                        >
                            &#10005;
                        </button>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100 rounded-full p-3">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4m-5 4h18" /></svg>
                            </div>
                            <h3 className="text-xl font-bold text-blue-800">Detalles del Pedido #{detallePedido.idPedido}</h3>
                        </div>
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="mb-1"><span className="font-semibold">Cliente:</span> {detallePedido.nombreCliente || "-"}</div>
                                <div className="mb-1"><span className="font-semibold">Método de Entrega:</span> {detallePedido.metodoEntrega || "-"}</div>
                                <div className="mb-1"><span className="font-semibold">Dirección:</span> {detallePedido.direccion || "-"}</div>
                                <div className="mb-1"><span className="font-semibold">Estado:</span> <span className={`rounded px-2 py-1 text-xs font-bold ${detallePedido.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : detallePedido.estado === 'ENTREGADO' ? 'bg-green-100 text-green-800' : detallePedido.estado === 'CANCELADO' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-800'}`}>{detallePedido.estado}</span></div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="mb-1"><span className="font-semibold">Fecha Pedido:</span> {detallePedido.fechaPedido ? new Date(detallePedido.fechaPedido).toLocaleString("es-PE") : "-"}</div>
                                <div className="mb-1"><span className="font-semibold">Fecha Entrega:</span> {detallePedido.fechaEntrega ? new Date(detallePedido.fechaEntrega).toLocaleString("es-PE") : "-"}</div>
                                <div className="mb-1"><span className="font-semibold">Total:</span> <span className="text-blue-800 font-bold">S/. {Number(detallePedido.total).toFixed(2)}</span></div>
                            </div>
                        </div>
                        <h4 className="font-semibold mb-2 text-blue-700">Productos:</h4>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded shadow">
                                <thead>
                                <tr className="bg-blue-100">
                                    <th className="px-4 py-2 text-left text-xs font-bold text-blue-700">Producto</th>
                                    <th className="px-4 py-2 text-center text-xs font-bold text-blue-700">Cantidad</th>
                                    <th className="px-4 py-2 text-center text-xs font-bold text-blue-700">Precio Unitario</th>
                                    <th className="px-4 py-2 text-center text-xs font-bold text-blue-700">Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {detallePedido.detalles && detallePedido.detalles.length > 0 ? detallePedido.detalles.map((item, idx) => (
                                    <tr key={idx} className="border-b last:border-b-0 hover:bg-blue-50">
                                        <td className="px-4 py-2">{item.nombreProducto}</td>
                                        <td className="px-4 py-2 text-center">{item.cantidad}</td>
                                        <td className="px-4 py-2 text-center">S/. {Number(item.precioUnitario).toFixed(2)}</td>
                                        <td className="px-4 py-2 text-center font-semibold text-blue-700">S/. {(item.cantidad * item.precioUnitario).toFixed(2)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-400 py-4">Sin productos</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}