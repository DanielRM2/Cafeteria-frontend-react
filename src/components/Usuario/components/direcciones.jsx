import React, { useEffect, useState } from "react";
import { useSesionCliente } from "../hooks/useSesionCliente.js";
import { fetchDataSimple, postDataSimple, putDataSimple, deleteDataSimple } from "../utils/api.js";
import SpinnerInterno from "./loadingInterno.jsx";

export default function Direcciones() {
    const { cliente } = useSesionCliente();
    const [direcciones, setDirecciones] = useState([]);
    const [form, setForm] = useState({ direccion: "", referencia: "", distrito: "" });
    const [editandoId, setEditandoId] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
    const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
    const [direccionAEliminar, setDireccionAEliminar] = useState(null);
    const [marcandoPredeterminadaId, setMarcandoPredeterminadaId] = useState(null);
    const [cargando, setCargando] = useState(true); // 👈 NUEVO

    const cargarDirecciones = async () => {
        try {
            setCargando(true); // 👈 NUEVO
            const data = await fetchDataSimple(`/api/direcciones-cliente/cliente/${cliente.id}`);
            setDirecciones(data);
        } catch {
            setMensaje("Error al cargar direcciones");
        } finally {
            setCargando(false); // 👈 NUEVO
        }
    };

    useEffect(() => {
        if (cliente?.id) cargarDirecciones();
    }, [cliente]);

    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => setMensaje(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const limpiarForm = () => setForm({ direccion: "", referencia: "", distrito: "" });

    const handleSubmit = async e => {
        e.preventDefault();
        setMensaje("");
        const body = { ...form, idCliente: cliente.id };

        try {
            let data;
            if (editandoId) {
                data = await putDataSimple(`/api/direcciones-cliente/${editandoId}`, body);
                setDirecciones(direcciones.map(d => d.idDireccion === editandoId ? data : d));
                setMensaje("Dirección actualizada");
                setMostrarModalEditar(false);
            } else {
                data = await postDataSimple(`/api/direcciones-cliente`, body);
                setDirecciones([...direcciones, data]);
                setMensaje("Dirección agregada");
                setMostrarModalCrear(false);
            }
            limpiarForm();
            setEditandoId(null);
        } catch (err) {
            setMensaje("No se pudo guardar la dirección");
        }
    };

    const handleEditar = direccion => {
        setEditandoId(direccion.idDireccion);
        setForm({
            direccion: direccion.direccion,
            referencia: direccion.referencia || "",
            distrito: direccion.distrito || ""
        });
        setMensaje("");
        setMostrarModalEditar(true);
    };

    const confirmarEliminar = direccion => {
        setDireccionAEliminar(direccion);
        setMostrarModal(true);
    };

    const eliminarDireccion = async () => {
        if (!direccionAEliminar) return;
        try {
            await deleteDataSimple(`/api/direcciones-cliente/${direccionAEliminar.idDireccion}`);
            setDirecciones(direcciones.filter(d => d.idDireccion !== direccionAEliminar.idDireccion));
            setMensaje("Dirección eliminada");
        } catch {
            setMensaje("No se pudo eliminar");
        } finally {
            setMostrarModal(false);
            setDireccionAEliminar(null);
        }
    };

    const marcarComoPredeterminada = async (idDireccion) => {
        setMensaje("");
        setMarcandoPredeterminadaId(idDireccion);
        try {
            const updatedDireccion = await putDataSimple(`/api/direcciones-cliente/${idDireccion}/predeterminada`);
            setDirecciones(prev =>
                prev.map(d =>
                    d.idDireccion === updatedDireccion.idDireccion
                        ? updatedDireccion
                        : { ...d, predeterminada: false }
                )
            );
            setMensaje("Dirección predeterminada actualizada");
        } catch (err) {
            console.error("Error al marcar como predeterminada:", err);
            setMensaje("No se pudo marcar como predeterminada");
        } finally {
            setMarcandoPredeterminadaId(null);
        }
    };

    // 👉 Mostrar spinner mientras se cargan las direcciones
    if (cargando) {
        return <SpinnerInterno />;
    }

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Mis Direcciones</h3>

            {mensaje && (
                <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded">
                    {mensaje}
                </div>
            )}

            <div className="space-y-4">
                {direcciones.length === 0 && <div>No tienes direcciones registradas.</div>}
                {direcciones.map(direccion => (
                    <div key={direccion.idDireccion}
                         className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                            <div><span className="font-semibold">Distrito:</span> {direccion.distrito || "-"}</div>
                            <div><span className="font-semibold">Dirección:</span> {direccion.direccion}</div>
                            <div><span className="font-semibold">Referencia:</span> {direccion.referencia || "-"}</div>

                            {direccion.predeterminada ? (
                                <div className="mt-2 inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                                    ✔ Dirección predeterminada
                                </div>
                            ) : (
                                <button
                                    onClick={() => marcarComoPredeterminada(direccion.idDireccion)}
                                    className="mt-2 inline-block px-3 py-1 bg-amber-500 text-white rounded hover:bg-orange-600 text-sm"
                                    disabled={marcandoPredeterminadaId === direccion.idDireccion}
                                >
                                    {marcandoPredeterminadaId === direccion.idDireccion ? "Actualizando..." : "Marcar como predeterminada"}
                                </button>
                            )}
                        </div>

                        <div className="flex gap-2 mt-3 md:mt-0 md:ml-4">
                            <button onClick={() => handleEditar(direccion)}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Editar</button>
                            <button onClick={() => confirmarEliminar(direccion)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => setMostrarModalCrear(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    📝 Agregar nueva dirección
                </button>
            </div>


            {/* Modal Crear */}
            {mostrarModalCrear && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Agregar nueva dirección</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="font-medium mb-1">Distrito</label>
                                <input name="distrito" value={form.distrito} onChange={handleChange} className="border rounded px-2 py-1" />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-1">Dirección</label>
                                <input name="direccion" value={form.direccion} onChange={handleChange} className="border rounded px-2 py-1" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-1">Referencia</label>
                                <input name="referencia" value={form.referencia} onChange={handleChange} className="border rounded px-2 py-1" />
                            </div>
                            <div className="flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => { limpiarForm(); setMostrarModalCrear(false); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Editar */}
            {mostrarModalEditar && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">Editar dirección</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col">
                                <label className="font-medium mb-1">Distrito</label>
                                <input name="distrito" value={form.distrito} onChange={handleChange} className="border rounded px-2 py-1" />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-1">Dirección</label>
                                <input name="direccion" value={form.direccion} onChange={handleChange} className="border rounded px-2 py-1" required />
                            </div>
                            <div className="flex flex-col">
                                <label className="font-medium mb-1">Referencia</label>
                                <input name="referencia" value={form.referencia} onChange={handleChange} className="border rounded px-2 py-1" />
                            </div>
                            <div className="flex justify-end gap-4 mt-4">
                                <button type="button" onClick={() => { limpiarForm(); setMostrarModalEditar(false); setEditandoId(null); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Eliminar */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">¿Estás seguro?</h2>
                        <p className="mb-6">¿Deseas eliminar la dirección seleccionada?</p>
                        <div className="flex justify-end gap-4">
                            <button onClick={() => { setMostrarModal(false); setDireccionAEliminar(null); }} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
                            <button onClick={eliminarDireccion} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
