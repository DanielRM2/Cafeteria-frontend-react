import React, { useEffect, useState } from "react";

const PagoExitoso = () => {
    const [pedido, setPedido] = useState(null);
    const [estado, setEstado] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const preferenceId = params.get("preference_id");
        if (!preferenceId) {
            setError("No se encontró el preference_id en la URL.");
            setLoading(false);
            return;
        }
        fetch(`http://localhost:8080/api/pagos/preferencia/${preferenceId}/pedido`)
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                setPedido(data);
                setEstado(data.estado);
            })
            .catch(() => setError("No se pudo obtener el estado del pedido."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Cargando información del pago...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h2>Estado de tu pedido</h2>
            <p><b>Estado:</b> {estado}</p>
            {pedido && (
                <div>
                    <p><b>N° Pedido:</b> {pedido.idPedido}</p>
                    <p><b>Total:</b> S/ {pedido.total}</p>
                    {/* Puedes mostrar más información aquí si lo deseas */}
                </div>
            )}
            {estado === "CONFIRMADO" && <p>¡Pago exitoso! Tu pedido está confirmado.</p>}
            {estado !== "CONFIRMADO" && <p>Tu pago está en proceso o fue rechazado.</p>}
        </div>
    );
};

export default PagoExitoso;