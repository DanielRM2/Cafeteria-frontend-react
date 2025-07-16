import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * RutaProtegida
 * @param {ReactNode} children - El contenido de la ruta protegida.
 * @param {string|string[]} rolesPermitidos - Rol o array de roles permitidos (opcional).
 * @param {string} redirectTo - Ruta de redirección si no hay acceso (opcional).
 * @param {string} tipo - "staff" para rutas de staff, "cliente" para rutas de cliente (opcional, default: cliente)
 */
export default function RutaProtegida({ children, rolesPermitidos, redirectTo, tipo = "cliente" }) {
    const token = tipo === 'staff'
        ? localStorage.getItem('token_staff')
        : localStorage.getItem('token_cliente');
    const rol = localStorage.getItem('rol');
    const location = useLocation();

    // Si se especifican roles, verifica que el rol esté permitido
    const rolValido = !rolesPermitidos ||
        (Array.isArray(rolesPermitidos) ? rolesPermitidos.includes(rol) : rol === rolesPermitidos);

    return (token && rolValido) ? children : (
        <Navigate
            to={redirectTo}
            replace
            state={{ from: location.pathname, mensaje: 'Debes iniciar sesión para acceder a esta página.' }}
        />
    );
}