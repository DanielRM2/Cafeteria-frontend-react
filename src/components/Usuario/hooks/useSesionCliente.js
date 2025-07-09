import { useEffect, useState } from "react";

export function useSesionCliente() {
    const [cliente, setCliente] = useState(() => {
        const clienteGuardado = localStorage.getItem("cliente");
        return clienteGuardado ? JSON.parse(clienteGuardado) : null;
    });

    useEffect(() => {
        const handleStorage = () => {
            const clienteGuardado = localStorage.getItem("cliente");
            setCliente(clienteGuardado ? JSON.parse(clienteGuardado) : null);
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    const cerrarSesion = () => {
        localStorage.removeItem("cliente");
        localStorage.removeItem("token");
        localStorage.removeItem("rol");
        setCliente(null);
    };

    return { cliente, cerrarSesion };
}