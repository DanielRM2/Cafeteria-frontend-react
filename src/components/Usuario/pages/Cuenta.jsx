import React, { useState } from "react";
import { useSesionCliente } from "../hooks/useSesionCliente.js";
import Perfil from "../components/perfil.jsx";
import Direcciones from "../components/direcciones.jsx";
import Pedidos from "../components/Pedidos.jsx";
import "../css/Cuenta.css";

export default function Cuenta() {
    const { cerrarSesion } = useSesionCliente();
    const [opcion, setOpcion] = useState("perfil");

    const renderContenido = () => {
        switch (opcion) {
            case "perfil": return <Perfil />;
            case "direcciones": return <Direcciones />;
            case "pedidos": return <Pedidos />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[100vh]
            pt-[160px] sm:pt-[160px] md:pt-[160px] lg:pt-[120px] xl:pt-[120px]
            px-1 md:px-4 bg-gray-100 pb-[20px]"
        >
            {/* Sidebar */}
            <aside className="md:w-1/4 w-full bg-white shadow md:rounded-l-lg p-0 md:p-4 border-r">
                <nav className="flex md:flex-col flex-row">

                    {/* Mi perfil */}
                    <div className={`boton-animado ${opcion === "perfil" ? "activa" : ""}`}>
                        <button
                            className={`w-full text-left px-4 py-3 transition
                                ${opcion === "perfil"
                                ? "bg-green-200 font-bold text-green-900"
                                : "text-gray-700 hover:bg-green-100"
                            }`}
                            onClick={() => setOpcion("perfil")}
                        >
                            👤 Mi perfil
                        </button>
                    </div>

                    {/* Mis direcciones */}
                    <div className={`boton-animado ${opcion === "direcciones" ? "activa" : ""}`}>
                        <button
                            className={`w-full text-left px-4 py-3 transition
                                ${opcion === "direcciones"
                                ? "bg-green-200 font-bold text-green-900"
                                : "text-gray-700 hover:bg-green-100"
                            }`}
                            onClick={() => setOpcion("direcciones")}
                        >
                            🏠 Mis direcciones
                        </button>
                    </div>

                    {/* Mis pedidos */}
                    <div className={`boton-animado ${opcion === "pedidos" ? "activa" : ""}`}>
                        <button
                            className={`w-full text-left px-4 py-3 transition
                                ${opcion === "pedidos"
                                ? "bg-green-200 font-bold text-green-900"
                                : "text-gray-700 hover:bg-green-100"
                            }`}
                            onClick={() => setOpcion("pedidos")}
                        >
                            🛒 Mis pedidos
                        </button>
                    </div>

                    {/* Cerrar sesión */}
                    <div className="boton-animado">
                        <button
                            className="w-full text-left px-4 py-3 text-red-700 hover:bg-red-100 transition"
                            onClick={() => {
                                cerrarSesion();
                                window.location.href = "/login";
                            }}
                        >
                            🚪 Cerrar sesión
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Contenido */}
            <main className="flex-1 bg-gray-50 p-6 rounded-b-lg md:rounded-l-none md:rounded-r-lg shadow">
                {renderContenido()}
            </main>
        </div>
    );
}
