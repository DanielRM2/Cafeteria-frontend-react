import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function RutaProtegida({ children }) {
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('rol');
    const location = useLocation();

    // Solo permite acceso si hay token y el rol es CLIENTE
    return (token && rol === 'CLIENTE') ? children : (
        <Navigate
            to="/login"
            replace
            state={{ from: location.pathname, mensaje: 'Debes iniciar sesión para acceder a esta página.' }}
        />
    );
}
