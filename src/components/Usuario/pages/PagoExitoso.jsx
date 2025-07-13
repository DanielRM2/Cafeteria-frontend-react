import React, { useEffect, useState } from "react";
import { fetchDataSimple } from "../utils/api.js";
import Spinner from "../components/loading.jsx"; // ajusta la ruta si es necesario

const PagoExitoso = () => {
    const [pedido, setPedido] = useState(null);
    const [estado, setEstado] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const preferenceId = params.get("preference_id");

        if (!preferenceId) {
            setError("No se encontró el preference_id en la URL.");
            setLoading(false);
            return;
        }

        let intervalo;

        const obtenerEstado = async () => {
            try {
                const data = await fetchDataSimple(`/api/pagos/preferencia/${preferenceId}/pedido`);
                setPedido(data);
                setEstado(data.estado);

                if (data.estado === "CONFIRMADO") {
                    clearInterval(intervalo);
                    setLoading(false);
                }
            } catch (e) {
                setError("No se pudo obtener el estado del pedido.");
                clearInterval(intervalo);
                setLoading(false);
            }
        };

        obtenerEstado();
        intervalo = setInterval(obtenerEstado, 5000);

        return () => clearInterval(intervalo);
    }, []);

    if (loading) return <Spinner />;
    if (error) return <div style={{ color: "red", textAlign: "center", marginTop: "3rem" }}>{error}</div>;

    return (
        <div style={{
            maxWidth: 400,
            margin: "2rem auto",
            padding: 24,
            border: "1px solid #eee",
            borderRadius: 8
        }}>
            <h2>Estado de tu pedido</h2>
            <p><b>Estado:</b> {estado}</p>

            {pedido && (
                <div>
                    <p><b>N° Pedido:</b> {pedido.idPedido}</p>
                    <p><b>Total:</b> S/ {pedido.total}</p>
                </div>
            )}

            <p>✅ ¡Pago exitoso! Tu pedido está confirmado.</p>
        </div>
    );
};

export default PagoExitoso;
