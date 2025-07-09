import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useMensajeTemporal() {
    const location = useLocation();
    const [mensaje, setMensaje] = useState(location.state?.mensaje);

    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => {
                setMensaje(null);
            }, 3300);
            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    return mensaje;
}
