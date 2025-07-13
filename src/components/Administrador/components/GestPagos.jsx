import React, { useEffect, useState } from "react";
import { fetchDataSimple } from "../utils/api.js";
import "../css/General.css";

export default function GestPagos() {
    const [pagos, setPagos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagina, setPagina] = useState(1);
    const [pagosPorPagina] = useState(10);

    // --- FILTROS Y PAGINACIÓN ---
    const [filtroIdPago, setFiltroIdPago] = useState("");
    const [filtroIdPedido, setFiltroIdPedido] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroFechaInicio, setFiltroFechaInicio] = useState("");
    const [filtroFechaFin, setFiltroFechaFin] = useState("");
    // Estados únicos para selects
    const estadosUnicos = Array.from(new Set(pagos.map(p => p.estado).filter(Boolean)));

    // Filtrado encadenado
    const pagosFiltrados = pagos.filter(p =>
        (filtroIdPago === "" || String(p.idPago).includes(filtroIdPago)) &&
        (filtroIdPedido === "" || String(p.idPedido).includes(filtroIdPedido)) &&
        (filtroEstado === "" || p.estado === filtroEstado) &&
        (filtroFechaInicio === "" || new Date(p.fechaPago) >= new Date(filtroFechaInicio)) &&
        (filtroFechaFin === "" || new Date(p.fechaPago) <= new Date(filtroFechaFin))
    );
    const totalPaginas = Math.ceil(pagosFiltrados.length / pagosPorPagina);
    const indexUltimo = pagina * pagosPorPagina;
    const indexPrimero = indexUltimo - pagosPorPagina;
    const pagosActuales = pagosFiltrados.slice(indexPrimero, indexUltimo);
    const handleAnterior = () => setPagina((p) => Math.max(p - 1, 1));
    const handleSiguiente = () => setPagina((p) => Math.min(p + 1, totalPaginas));
    const handleIrPagina = (num) => setPagina(num);

    useEffect(() => {
        fetchDataSimple("/api/pagos/listar")
            .then(setPagos)
            .catch(() => setPagos([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div>
            {/* Filtros avanzados arriba de la tabla y del cargando */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div className="flex flex-wrap gap-2 items-center flex-1 min-w-0">
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-32 min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="ID Pago"
                        value={filtroIdPago}
                        onChange={e => { setFiltroIdPago(e.target.value); setPagina(1); }}
                    />
                    <input
                        type="text"
                        className="border border-blue-300 rounded px-3 py-2 w-32 min-w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="ID Pedido"
                        value={filtroIdPedido}
                        onChange={e => { setFiltroIdPedido(e.target.value); setPagina(1); }}
                    />
                    <select
                        className="border border-blue-300 rounded px-3 py-2 min-w-[120px] focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
                        value={filtroEstado}
                        onChange={e => { setFiltroEstado(e.target.value); setPagina(1); }}
                    >
                        <option value="">Todos los estados</option>
                        {estadosUnicos.map(est => (
                            <option key={est} value={est}>{est}</option>
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
                            setFiltroIdPago(""); setFiltroIdPedido(""); setFiltroEstado(""); setFiltroFechaInicio(""); setFiltroFechaFin(""); setPagina(1);
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
                            <th className="px-4 py-2 border-b text-left">ID Pago</th>
                            <th className="px-4 py-2 border-b text-left">ID Pedido</th>
                            <th className="px-4 py-2 border-b text-left">Monto (S/.)</th>
                            <th className="px-4 py-2 border-b text-left">Estado</th>
                            <th className="px-4 py-2 border-b text-left">MercadoPago ID</th>
                            <th className="px-4 py-2 border-b text-left">Estado MP</th>
                            <th className="px-4 py-2 border-b text-left">Enlace de Pago</th>
                            <th className="px-4 py-2 border-b text-left">Correo del Pagador</th>
                            <th className="px-4 py-2 border-b text-left">Fecha Pago</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pagosActuales.map(pago => (
                            <tr
                                key={pago.idPago}
                                className={"bg-white hover:bg-blue-100 transition-colors border-b"}
                            >
                                <td className="px-4 py-2 border-b-2">{pago.idPago}</td>
                                <td className="px-4 py-2 border-b-2">{pago.idPedido}</td>
                                <td className="px-4 py-2 border-b-2">{Number(pago.monto).toFixed(2)}</td>
                                <td className="px-4 py-2 border-b-2">{pago.estado}</td>
                                <td className="px-4 py-2 border-b-2">{pago.mercadoPagoId}</td>
                                <td className="px-4 py-2 border-b-2">{pago.mercadoPagoStatus}</td>
                                <td className="px-4 py-2 border-b-2">{pago.paymentLink ? (<a href={pago.paymentLink} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Ver enlace</a>) : (<span className="text-gray-400">-</span>)}</td>
                                <td className="px-4 py-2 border-b-2">{pago.payerEmail}</td>
                                <td className="px-4 py-2 border-b-2">{pago.fechaPago ? new Date(pago.fechaPago).toLocaleString() : "-"}</td>
                            </tr>
                        ))}
                        {pagosActuales.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center text-gray-400 py-4">
                                    No hay pagos registrados.
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
        </div>
    );
}