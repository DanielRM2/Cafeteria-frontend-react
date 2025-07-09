import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Usuario/components/RutaProtegida.jsx';
import Spinner from './components/Usuario/components/loading.jsx'; // Importa el spinner
import Header from './components/Usuario/components/header.jsx';

const Home = lazy(() => import('./components/Usuario/pages/Home.jsx'));
const Menu = lazy(() => import('./components/Usuario/pages/Menu.jsx'));
const Nosotros = lazy(() => import('./components/Usuario/pages/Nosotros.jsx'));
const Carrito = lazy(() => import('./components/Usuario/pages/Carrito.jsx'));
const Login = lazy(() => import('./components/Usuario/pages/Login.jsx'));
const Cuenta = lazy(() => import('./components/Usuario/pages/Cuenta.jsx'));
const Pago = lazy(() => import('./components/Usuario/pages/PagoPage.jsx'));
const Pagoexito = lazy(() => import('./components/Usuario/pages/PagoExitoso.jsx'));

function App() {
    return (
        <BrowserRouter>
            <Header />
            <Suspense fallback={<Spinner />}>
                <Routes>
                    <Route index path="/index" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/carrito" element={<Carrito />} />
                    <Route path="/pago" element={<Pago />} />
                    <Route path="/pago-exitoso" element={<Pagoexito />} />

                    {/* Rutas protegidas */}
                    <Route path="/cuenta" element={
                        <PrivateRoute>
                            <Cuenta />
                        </PrivateRoute>
                    } />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

export default App;
