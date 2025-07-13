import React, { useEffect, useState } from "react";
import { useSesionCliente } from "../hooks/useSesionCliente.js";
import { fetchDataSimple, putDataSimple, deleteDataSimple } from "../utils/api.js";

export default function Perfil() {
    const { cliente, cerrarSesion } = useSesionCliente();
    const [perfil, setPerfil] = useState(null);
    const [editando, setEditando] = useState(false);
    const [form, setForm] = useState({ nombreCompleto: "", correo: "", telefono: "", contrasena: "" });
    const [mensaje, setMensaje] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    useEffect(() => {
        if (cliente?.id) {
            // Obtener el cliente completo desde la API
            fetchDataSimple(`/api/cliente/${cliente.id}`)
                .then(data => {
                    setPerfil(data);
                    setForm({
                        nombreCompleto: data.nombreCompleto || "",
                        correo: data.correo || "",
                        telefono: data.telefono || "",
                        contrasena: ""
                    });
                })
                .catch(error => {
                    console.error('Error al obtener el perfil:', error);
                    setMensaje('Error al cargar el perfil');
                });
        }
    }, [cliente]);

    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => setMensaje(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEditar = () => {
        setEditando(true);
        setMensaje(null);
    };

    const handleCancelar = () => {
        setEditando(false);
        setForm({
            nombreCompleto: perfil.nombreCompleto || "",
            correo: perfil.correo || "",
            telefono: perfil.telefono || "",
            contrasena: ""
        });
        setMensaje(null);
    };

    const hayCambios = () => {
        return (
            form.nombreCompleto !== perfil.nombreCompleto ||
            form.correo !== perfil.correo ||
            form.telefono !== perfil.telefono ||
            (form.contrasena && form.contrasena.trim() !== "")
        );
    };

    const handleGuardar = async e => {
        e.preventDefault();

        if (!hayCambios()) {
            setMensaje({ tipo: "error", texto: "No has realizado ningún cambio." });
            return;
        }

        try {
            const body = { ...form };
            if (!body.contrasena) delete body.contrasena;

            const actualizado = await putDataSimple(`/api/cliente/${perfil.id}`, body);
            setPerfil(actualizado);
            setEditando(false);
            setMensaje({ tipo: "exito", texto: "Perfil actualizado correctamente." });
        } catch (error) {
            setMensaje({ tipo: "error", texto: error.message || "Hubo un error al actualizar." });
        }
    };

    const handleEliminar = async () => {
        try {
            await deleteDataSimple(`/api/cliente/${perfil.id}`);
            cerrarSesion();
            window.location.href = "/login";
        } catch (error) {
            setMensaje({ tipo: "error", texto: error.message || "Hubo un error al eliminar la cuenta." });
        }
    };

    if (!perfil) return <div>Cargando...</div>;

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Mi Perfil</h3>

            {mensaje && (
                <div
                    className={`mb-4 px-4 py-2 rounded transition-all duration-300 border
                        ${mensaje.tipo === "exito"
                        ? "bg-green-100 text-green-800 border-green-300"
                        : "bg-red-100 text-red-800 border-red-300"
                    }`}
                >
                    {mensaje.texto}
                </div>
            )}

            {!editando ? (
                <div className="bg-white rounded shadow p-4 space-y-2">
                    <div><span className="font-semibold">Nombre:</span> {perfil.nombreCompleto}</div>
                    <div><span className="font-semibold">Correo:</span> {perfil.correo}</div>
                    <div><span className="font-semibold">Teléfono:</span> {perfil.telefono}</div>
                    <div className="flex gap-4 mt-4">
                        <button
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            onClick={handleEditar}
                        >Editar</button>
                        <button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            onClick={() => setMostrarModal(true)}
                        >Eliminar cuenta</button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleGuardar} className="bg-white rounded shadow p-4 space-y-4">
                    <div>
                        <label className="block font-semibold mb-1">Nombre completo</label>
                        <input
                            name="nombreCompleto"
                            value={form.nombreCompleto}
                            onChange={handleChange}
                            placeholder="Ingrese su nombre completo"
                            className="w-full border rounded px-2 py-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Correo</label>
                        <input
                            name="correo"
                            type="email"
                            value={form.correo}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            className="w-full border rounded px-2 py-1"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Teléfono</label>
                        <input
                            name="telefono"
                            value={form.telefono}
                            onChange={handleChange}
                            placeholder="Número de celular"
                            className="w-full border rounded px-2 py-1"
                            maxLength={9}
                            pattern="\d{9}"
                            inputMode="numeric"
                            title="El número debe tener exactamente 9 dígitos"
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-1">Contraseña (opcional)</label>
                        <input
                            name="contrasena"
                            type="password"
                            value={form.contrasena}
                            onChange={handleChange}
                            placeholder="Dejar vacío si no desea cambiar"
                            className="w-full border rounded px-2 py-1"
                            minLength="5"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >Guardar</button>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            onClick={handleCancelar}
                        >Cancelar</button>
                    </div>
                </form>
            )}

            {mostrarModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">¿Estás seguro?</h2>
                        <p className="mb-6">¿Deseas eliminar tu cuenta? Esta acción no se puede deshacer.</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setMostrarModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEliminar}
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
