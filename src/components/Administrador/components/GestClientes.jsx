import React, { useEffect, useState } from "react";
import { fetchDataSimple, putDataSimple } from "../utils/api.js";
import "../css/General.css";

export default function GestCliente() {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filtroNombre, setFiltroNombre] = useState("");
    const [filtroCorreo, setFiltroCorreo] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    // --- PAGINACIÓN ---
    const [pagina, setPagina] = useState(1);
    const clientesPorPagina = 10;

    useEffect(() => {
        fetchDataSimple("/api/cliente/listar")
            .then(setClientes)
            .catch(() => setClientes([]))
            .finally(() => setLoading(false));
    }, []);

    // Filtros encadenados
    const clientesFiltrados = clientes.filter(c =>
        (filtroNombre === "" || c.nombreCompleto.toLowerCase().includes(filtroNombre.toLowerCase())) &&
        (filtroCorreo === "" || c.correo.toLowerCase().includes(filtroCorreo.toLowerCase())) &&
        (filtroEstado === "" || (filtroEstado === "activo" ? c.activo : !c.activo))
    );
    const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
    const indexUltimo = pagina * clientesPorPagina;
    const indexPrimero = indexUltimo - clientesPorPagina;
    const clientesActuales = clientesFiltrados.slice(indexPrimero, indexUltimo);

    const handleCambiarEstado = (cliente) => {
        putDataSimple(`/api/cliente/${cliente.id}/estado?activo=${!cliente.activo}`)
            .then((data) => {
                setClientes(clientes.map(c => (c.id === data.id ? data : c)));
            })
            .catch(() => alert("Error al cambiar estado del cliente"));
    };

    const handleAnterior = () => setPagina(p => Math.max(p - 1, 1));
    const handleSiguiente = () => setPagina(p => Math.min(p + 1, totalPaginas));
    const handleIrPagina = (num) => setPagina(num);

    return (
        <div>
            {/* Filtros avanzados arriba de la tabla y del cargando */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
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
                            setFiltroNombre(""); setFiltroCorreo(""); setFiltroEstado(""); setPagina(1);
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
                            <th className="px-4 py-2 border-b text-left">Nombre</th>
                            <th className="px-4 py-2 border-b text-left">Correo</th>
                            <th className="px-4 py-2 border-b text-left">Teléfono</th>
                            <th className="px-4 py-2 border-b text-left">Rol</th>
                            <th className="px-4 py-2 border-b text-left">Estado</th>
                            <th className="px-4 py-2 border-b text-left">Acciones</th>
                        </tr>
                        </thead>
                        <tbody>
                        {clientesActuales.map(cliente => (
                            <tr
                                key={cliente.id}
                                className={"bg-white hover:bg-blue-100 transition-colors border-b"}
                            >
                                <td className="px-4 py-2 border-b-2">{cliente.id}</td>
                                <td className="px-4 py-2 border-b-2">{cliente.nombreCompleto}</td>
                                <td className="px-4 py-2 border-b-2">{cliente.correo}</td>
                                <td className="px-4 py-2 border-b-2">{cliente.telefono}</td>
                                <td className="px-4 py-2 border-b-2">{cliente.rol}</td>
                                <td className="px-4 py-2 border-b-2">
                                    {cliente.activo ? (
                                        <span className="text-green-600 font-semibold">Activo</span>
                                    ) : (
                                        <span className="text-red-600 font-semibold">Inactivo</span>
                                    )}
                                </td>
                                <td className="px-4 py-2 border-b-2">
                                    {/* Botón bloquear/desbloquear, no tocar */}
                                    <button
                                        className={cliente.activo ? "bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700" : "bg-green-500 text-white px-3 py-1 rounded hover:bg-green-700"}
                                        onClick={() => handleCambiarEstado(cliente)}
                                    >
                                        {cliente.activo ? "Bloquear" : "Desbloquear"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {clientesActuales.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center text-gray-400 py-4">
                                    No hay clientes registrados.
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