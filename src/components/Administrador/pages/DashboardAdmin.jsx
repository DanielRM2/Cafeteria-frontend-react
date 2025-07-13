import React, { useState, useEffect } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "react-router-dom";
import GestProductos from "../components/GestProductos.jsx";
import GestCategorias from "../components/GestCategorias.jsx";
import GestPedidos from "../components/GestPedidos.jsx";
import GestClientes from "../components/GestClientes.jsx";
import GestEmpleados from "../components/GestEmpleados.jsx";
import GestPagos from "../components/GestPagos.jsx";
import GestVentas from "../components/GestVentas.jsx";
import GestInventario from "../components/GestInventario.jsx";
import GestEntregas from "../components/GestEntregas.jsx";
import GestRoles from "../components/GestRoles.jsx";
import DashboardResumen from "../components/DashboardResumen.jsx";

const menuOptions = [
    { key: "dashboard", label: "Dashboard", icon: "🏠" },
    { key: "productos", label: "Productos", icon: "📦" },
    { key: "categorias", label: "Categorías", icon: "🏷️" },
    { key: "pedidos", label: "Pedidos", icon: "🧾" },
    { key: "clientes", label: "Clientes", icon: "👤" },
    { key: "empleados", label: "Empleados", icon: "🧑‍💼" },
    { key: "pagos", label: "Pagos", icon: "💳" },
    { key: "ventas", label: "Ventas", icon: "📈" },
    { key: "inventario", label: "Inventario", icon: "📋" },
    { key: "entregas", label: "Métodos de Entrega", icon: "🚚" },
    { key: "roles", label: "Roles", icon: "🔑" },
    { key: "salir", label: "Salir", icon: "🚪" },
];

export default function PageDashboard() {
    const [searchParams, setSearchParams] = useSearchParams();
    const tab = searchParams.get("tab") || "dashboard";
    const [selected, setSelected] = useState(tab);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark';
    });

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        const newTheme = isDarkMode ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        setIsDarkMode(!isDarkMode);
    };

    useEffect(() => {
        setSelected(tab);
    }, [tab]);

    const rol = localStorage.getItem("rol");

    const cambiarTab = (key) => {
        // Si el tab es exclusivo de admin y el usuario NO es admin, muestra modal
        if ((key === "roles" || key === "empleados") && rol !== "ADMINISTRADOR") {
            setShowAdminModal(true);
            return;
        }
        setSelected(key);
        setSearchParams({ tab: key });
        if (window.innerWidth < 1024) setSidebarOpen(false);
    };

    // Si el usuario no es admin e intenta acceder directo por URL a los tabs protegidos, muestra el modal y NO renderiza el componente
    if ((selected === "roles" || selected === "empleados") && rol !== "ADMINISTRADOR") {
        return (
            <>
                {/* Modal solo administradores */}
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs text-center">
                        <h2 className="text-lg font-bold mb-4 text-red-600">Acceso restringido</h2>
                        <p className="mb-6">Esta sección es solo para administradores.</p>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => {
                                window.location.href = "/administracion/home?tab=dashboard";
                            }}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // Cuando se cierra el modal, regresa al dashboard si no es admin y estaba en tab protegido
    const handleCloseAdminModal = () => {
        setShowAdminModal(false);
        if (selected === "roles" || selected === "empleados") {
            setSelected("dashboard");
            setSearchParams({ tab: "dashboard" });
        }
    };

    // Efecto para cerrar sesión cuando se selecciona "salir"
    useEffect(() => {
        if (selected === "salir") {
            localStorage.removeItem("token");
            localStorage.removeItem("rol");
            window.location.href = "/administracion/login";
        }
    }, [selected]);

    return (
        <div className="flex h-[100vh] bg-gray-50 dark:bg-gray-900">
            {/* Modal solo administradores */}
            {showAdminModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-8 max-w-xs text-center">
                        <h2 className="text-lg font-bold mb-4 text-red-600">Acceso restringido</h2>
                        <p className="mb-6">Esta sección es solo para administradores.</p>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleCloseAdminModal}
                        >
                            Entendido
                        </button>
                    </div>
                </div>
            )}
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar con fondo blanco garantizado */}
            <aside
                className={`fixed lg:relative w-64 lg:w-1/5 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-dark-border shadow-md flex flex-col h-full z-50 transition-all duration-300 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                <div className="h-16 flex items-center justify-between px-4 border-b dark:border-dark-border">
                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">Admin Panel</span>
                    <div className="flex items-center gap-2">
                        <button
                            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
                            onClick={() => setSidebarOpen(false)}
                        >
                            ✕
                        </button>
                        <button
                            onClick={toggleTheme}
                            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                            {isDarkMode ? (
                                <SunIcon className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <MoonIcon className="w-5 h-5 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
                <ul className="flex flex-col gap-1 px-2">
                    {menuOptions.map(opt => (
                        <li key={opt.key}>
                            <button
                                onClick={() => cambiarTab(opt.key)}
                                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors duration-200 focus:outline-none ${
                                    selected === opt.key
                                        ? "bg-blue-600 text-white font-semibold shadow"
                                        : "text-gray-700 dark:text-dark-text hover:bg-gray-100 dark:hover:bg-dark-mode hover:text-blue-700 dark:hover:text-blue-400"
                                }`}
                            >
                                <span className="text-lg">{opt.icon}</span>
                                <span>{opt.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
                <div className="p-4 text-xs text-gray-400 text-center border-t border-gray-200">
                    &copy; {new Date().getFullYear()} Urban Coffee
                </div>
            </aside>

            {/* Main Content Responsivo */}
            <main
                className={`flex-1 p-4 lg:p-8 overflow-y-auto transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-0 bg-gray-100 dark:bg-gray-900`}>
                {/* Mobile header */}
                <div className="lg:hidden flex items-center justify-between mb-4">
                    <button
                        className="p-2 rounded-md bg-blue-600 text-white fixed top-4 left-4 z-40 hover:bg-blue-700 focus:outline-none"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden lg:block">
                        {menuOptions.find(opt => opt.key === selected)?.label}
                    </h1>
                    <div className="w-10"></div>
                    {/* Spacer para alinear el título */}
                </div>
                {selected === "dashboard" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Dashboard General</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <DashboardResumen />
                        </div>
                    </div>
                )}
                {selected === "productos" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Productos</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestProductos />
                        </div>
                    </div>
                )}
                {selected === "categorias" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Categorías</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestCategorias />
                        </div>
                    </div>
                )}
                {selected === "pedidos" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Pedidos</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestPedidos />
                        </div>
                    </div>
                )}
                {selected === "clientes" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Clientes</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestClientes />
                        </div>
                    </div>
                )}
                {selected === "empleados" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Empleados</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestEmpleados />
                        </div>
                    </div>
                )}
                {selected === "pagos" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Pagos</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestPagos />
                        </div>
                    </div>
                )}
                {selected === "ventas" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Ventas</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestVentas />
                        </div>
                    </div>
                )}
                {selected === "inventario" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Inventario</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestInventario />
                        </div>
                    </div>
                )}
                {selected === "entregas" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Entregas</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestEntregas />
                        </div>
                    </div>
                )}
                {selected === "roles" && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Gestión de Roles</h2>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:8">
                            <GestRoles />
                        </div>
                    </div>
                )}
                {selected === "salir"}
            </main>
        </div>
    );
}