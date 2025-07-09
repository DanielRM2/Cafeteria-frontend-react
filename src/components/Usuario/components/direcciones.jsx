import React, { useEffect, useState } from "react";
import { useSesionCliente } from "../hooks/useSesionCliente.js";

export default function Direcciones() {
    const { cliente } = useSesionCliente();
    const [direcciones, setDirecciones] = useState([]);
    const [form, setForm] = useState({ direccion: "", referencia: "", distrito: "" });
    const [editandoId, setEditandoId] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);
    const [direccionAEliminar, setDireccionAEliminar] = useState(null);

    // Cargar direcciones al montar o cambiar cliente
    useEffect(() => {
        if (cliente?.id) {
            fetch(`http://localhost:8080/api/direcciones-cliente/cliente/${cliente.id}`)
                .then(res => res.json())
                .then(data => setDirecciones(data))
                .catch(() => setMensaje("Error al cargar direcciones"));
        }
    }, [cliente]);

    // Mensaje automático que desaparece a los 5 segundos
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
        try {
            const body = { ...form, idCliente: cliente.id };
            const url = editandoId
                ? `http://localhost:8080/api/direcciones-cliente/${editandoId}`
                : `http://localhost:8080/api/direcciones-cliente`;
            const method = editandoId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error("Error al guardar dirección");
            const data = await res.json();
            if (editandoId) {
                setDirecciones(direcciones.map(d => d.idDireccion === editandoId ? data : d));
                setMensaje("Dirección actualizada");
            } else {
                setDirecciones([...direcciones, data]);
                setMensaje("Dirección agregada");
            }
            limpiarForm();
            setEditandoId(null);
        } catch {
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
    };

    const confirmarEliminar = direccion => {
        setDireccionAEliminar(direccion);
        setMostrarModal(true);
    };

    const eliminarDireccion = async () => {
        if (!direccionAEliminar) return;
        try {
            const res = await fetch(`http://localhost:8080/api/direcciones-cliente/${direccionAEliminar.idDireccion}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error();
            setDirecciones(direcciones.filter(d => d.idDireccion !== direccionAEliminar.idDireccion));
            setMensaje("Dirección eliminada");
        } catch {
            setMensaje("No se pudo eliminar");
        } finally {
            setMostrarModal(false);
            setDireccionAEliminar(null);
        }
    };

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Mis Direcciones</h3>

            {mensaje && (
                <div className="mb-4 px-4 py-2 bg-green-100 text-green-800 border border-green-300 rounded transition-all duration-300">
                    {mensaje}
                </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="bg-white rounded shadow p-4 mb-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                        <label htmlFor="distrito" className="mb-1 font-medium">Distrito</label>
                        <input
                            id="distrito"
                            name="distrito"
                            placeholder="Ingrese el distrito"
                            value={form.distrito}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="direccion" className="mb-1 font-medium">Dirección</label>
                        <input
                            id="direccion"
                            name="direccion"
                            placeholder="Ingrese la dirección"
                            value={form.direccion}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label htmlFor="referencia" className="mb-1 font-medium">Referencia</label>
                        <input
                            id="referencia"
                            name="referencia"
                            placeholder="Ingrese una referencia"
                            value={form.referencia}
                            onChange={handleChange}
                            className="border rounded px-2 py-1"
                        />
                    </div>
                </div>

                <div className="flex gap-4 mt-2">
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        {editandoId ? "Actualizar" : "Agregar"}
                    </button>
                    {editandoId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditandoId(null);
                                limpiarForm();
                            }}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* Lista de direcciones */}
            <div className="space-y-4">
                {direcciones.length === 0 && <div>No tienes direcciones registradas.</div>}
                {direcciones.map(direccion => (
                    <div key={direccion.idDireccion}
                         className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <div><span className="font-semibold">Distrito:</span> {direccion.distrito || "-"}</div>
                            <div><span className="font-semibold">Dirección:</span> {direccion.direccion}</div>
                            <div><span className="font-semibold">Referencia:</span> {direccion.referencia || "-"}</div>
                        </div>
                        <div className="flex gap-2 mt-2 md:mt-0">
                        <button onClick={() => handleEditar(direccion)}
                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">Editar
                            </button>
                            <button onClick={() => confirmarEliminar(direccion)}
                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de confirmación */}
            {mostrarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">¿Estás seguro?</h2>
                        <p className="mb-6">¿Deseas eliminar la dirección seleccionada?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setMostrarModal(false);
                                    setDireccionAEliminar(null);
                                }}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={eliminarDireccion}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
