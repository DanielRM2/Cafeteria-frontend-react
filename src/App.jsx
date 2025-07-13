import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RutaProtegida from './components/RutaProtegida.jsx';
import Spinner from './components/Usuario/components/loading.jsx';
import Header from './components/Usuario/components/header.jsx';

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


function App() {
    const isAdminRoute = location.pathname.startsWith("/administracion");

    return (
        <BrowserRouter>
            {!isAdminRoute && <Header />}
            <Suspense fallback={<Spinner />}>
                <Routes>
                    {/* Rutas Cliente */}
                    <Route index path="/index" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/pago-exitoso" element={<Pagoexito />} />
                    <Route path="/wizard" element={<WizardCompra />} />

                    {/* Rutas protegidas para el cliente */}
                    <Route path="/cuenta" element={
                        <RutaProtegida rolesPermitidos="CLIENTE" redirectTo="/login">
                            <Cuenta />
                        </RutaProtegida>
                    } />


                    {/* Rutas Staff */}
                    <Route index path="/administracion/login" element={<AdminLogin />} />

                    {/* Rutas protegidas para el staff */}
                    <Route path="/administracion/home" element={
                        <RutaProtegida rolesPermitidos={["ADMINISTRADOR", "EMPLEADO"]} redirectTo="/administracion/login">
                            <AdminHome />
                        </RutaProtegida>
                    } />

                    {/* Rutas protegidas solo para el administrador */}
                    <Route path="/administracion/home?tab=roles" element={
                        <RutaProtegida rolesPermitidos={["ADMINISTRADOR"]} redirectTo={"/administracion/?tab=productos"}>
                            <GestRoles />
                        </RutaProtegida>
                    } />
                    <Route path="/administracion/home?tab=empleados" element={
                        <RutaProtegida rolesPermitidos={["ADMINISTRADOR"]} redirectTo={"/administracion/home"}>
                            <GestEmpleados />
                        </RutaProtegida>
                    } />
                </Routes>
            </Suspense>
        </BrowserRouter>

    );
}

export default App;
