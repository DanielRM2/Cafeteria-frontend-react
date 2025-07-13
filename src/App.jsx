// App.jsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import RutaProtegida from './components/RutaProtegida.jsx';
import Spinner from './components/Usuario/components/loading.jsx';
import Header from './components/Usuario/components/header.jsx';
import LayoutUsuario from './components/Usuario/utils/Layout.jsx';

// lazy imports
const Home = lazy(() => import('./components/Usuario/pages/Home.jsx'));
const Menu = lazy(() => import('./components/Usuario/pages/Menu.jsx'));
const Nosotros = lazy(() => import('./components/Usuario/pages/Nosotros.jsx'));
const Carrito = lazy(() => import('./components/Usuario/pages/Carrito.jsx'));
const Login = lazy(() => import('./components/Usuario/pages/Login.jsx'));
const Cuenta = lazy(() => import('./components/Usuario/pages/Cuenta.jsx'));
const Pagoexito = lazy(() => import('./components/Usuario/pages/PagoExitoso.jsx'));
const WizardCompra = lazy(() => import('./components/Usuario/components/WizardCompra.jsx'));

const AdminHome = lazy(() => import('./components/Administrador/pages/DashboardAdmin.jsx'));
const AdminLogin = lazy(() => import('./components/Administrador/pages/Login.jsx'));
const GestRoles = lazy(() => import('./components/Administrador/components/GestRoles.jsx'));
const GestEmpleados = lazy(() => import('./components/Administrador/components/GestEmpleados.jsx'));

// Componente que contiene rutas + lógica de header
function AppContent() {
    const location = useLocation();
    const ocultarHeaderEn = ["/wizard", "/pago-exitoso"];
    const mostrarHeader = !location.pathname.startsWith("/administracion") && !ocultarHeaderEn.includes(location.pathname);

    return (
        <>
            {mostrarHeader && <Header />}

            <Suspense fallback={<Spinner />}>
                <Routes>
                    {/* Rutas con layout */}
                    <Route element={<LayoutUsuario />}>
                        <Route index path="/index" element={<Home />} />
                        <Route path="/menu" element={<Menu />} />
                        <Route path="/nosotros" element={<Nosotros />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/carrito" element={<Carrito />} />
                        <Route path="/pago-exitoso" element={<Pagoexito />} />
                        <Route path="/wizard" element={<WizardCompra />} />
                        <Route path="/cuenta" element={
                            <RutaProtegida rolesPermitidos="CLIENTE" redirectTo="/login">
                                <Cuenta />
                            </RutaProtegida>
                        } />
                    </Route>

                    {/* Rutas staff */}
                    <Route path="/administracion/login" element={<AdminLogin />} />
                    <Route path="/administracion/home" element={
                        <RutaProtegida rolesPermitidos={["ADMINISTRADOR", "EMPLEADO"]} redirectTo="/administracion/login">
                            <AdminHome />
                        </RutaProtegida>
                    } />
                    <Route path="/administracion/home?tab=roles" element={
                        <RutaProtegida rolesPermitidos={["ADMINISTRADOR"]} redirectTo="/administracion/home">
                            <GestRoles />
                        </RutaProtegida>
                    } />
                    <Route path="/administracion/home?tab=empleados" element={
                        <RutaProtegida rolesPermitidos={["ADMINISTRADOR"]} redirectTo="/administracion/home">
                            <GestEmpleados />
                        </RutaProtegida>
                    } />
                </Routes>
            </Suspense>
        </>
    );
}

// Envolver AppContent en BrowserRouter
export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}
