import React, { useState, useEffect } from "react";
import { postDataSimple } from "../utils/api.js";
import "../css/General.css";

export default function Login() {
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);

    // Redirige si ya hay token
    useEffect(() => {
        const token = localStorage.getItem("token_staff");
        if (token) {
            window.location.href = "/administracion/home?dashboard";
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const data = await postDataSimple("/api/staff/login", {
                correo,
                contrasena
            });
            // Guarda el token y el rol en localStorage o contexto global
            localStorage.setItem("token_staff", data.token);
            localStorage.setItem("rol", data.rol);
            // Redirecciona según el rol o muestra mensaje de éxito
            window.location.href = "/administracion/home";
        } catch (err) {
            setError(err.mensaje || "Credenciales inválidas");
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-cover bg-center" style={{
            backgroundImage:
                'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url(/images/fondo-admin.jpg)'
        }}>
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
            >
                <h2 className="text-3xl font-bold mb-8 text-center">Inicio de sesión administrativo</h2>
                {error && (
                    <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>
                )}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Correo electrónico</label>
                    <input
                        type="email"
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-1 font-medium">Contraseña</label>
                    <div className="relative">
                        <input
                            type={mostrarContrasena ? "text" : "password"}
                            className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                            onClick={() => setMostrarContrasena(!mostrarContrasena)}
                        >
                            <i className={mostrarContrasena ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Ingresando..." : "Iniciar sesión"}
                </button>
            </form>
        </div>
    );
}