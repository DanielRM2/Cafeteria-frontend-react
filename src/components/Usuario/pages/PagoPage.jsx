import React, { useState, useEffect } from "react";

const PagoPage = () => {
    const [idPedido, setIdPedido] = useState("");
    const [clientes, setClientes] = useState([]);
    const [clienteSeleccionado, setClienteSeleccionado] = useState("");
    const [paymentLink, setPaymentLink] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/api/cliente/listar")
            .then(res => res.json())
            .then(data => setClientes(data));
    }, []);

    const handlePagar = async () => {
        setLoading(true);
        setPaymentLink(null);
        try {
            const response = await fetch("http://localhost:8080/api/pagos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    idPedido: Number(idPedido),
                    idCliente: Number(clienteSeleccionado),
                    monto: 2.0,
                    payerEmail: "cliente@correo.com"
                }),
            });
            if (!response.ok) {
                throw new Error("Pedido o cliente no encontrado, o error en el pago");
            }
            const data = await response.json();
            setPaymentLink(data.paymentLink);
        } catch (error) {
            alert(error.message);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 400, margin: "2rem auto", padding: 24, border: "1px solid #eee", borderRadius: 8 }}>
            <h2>Resumen de pago</h2>
            <label>
                <strong>Cliente:</strong>
                <select
                    value={clienteSeleccionado}
                    onChange={e => setClienteSeleccionado(e.target.value)}
                    style={{ width: "100%", marginTop: 8, marginBottom: 16, padding: 8 }}
                >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map(cliente =>
                        <option key={cliente.id} value={cliente.id}>
                            {cliente.nombreCompleto} ({cliente.correo})
                        </option>
                    )}
                </select>
            </label>
            <label>
                <strong>ID del Pedido:</strong>
                <input
                    type="number"
                    value={idPedido}
                    onChange={e => setIdPedido(e.target.value)}
                    style={{ width: "100%", marginTop: 8, marginBottom: 16, padding: 8 }}
                    placeholder="Ingresa el ID de un pedido existente"
                />
            </label>
            <p><strong>Total a pagar:</strong> S/ 2.00</p>
            <button
                onClick={handlePagar}
                disabled={loading || !idPedido || !clienteSeleccionado}
                style={{
                    background: "#009ee3",
                    color: "#fff",
                    border: "none",
                    padding: "12px 32px",
                    borderRadius: 6,
                    fontSize: 16,
                    cursor: "pointer"
                }}
            >
                {loading ? "Generando pago..." : "Pagar con Mercado Pago"}
            </button>
            {paymentLink && (
                <div style={{ marginTop: 24 }}>
                    <a
                        href={paymentLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            display: "inline-block",
                            background: "#00bb6a",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: 6,
                            textDecoration: "none",
                            fontWeight: "bold"
                        }}
                    >
                        Ir a Mercado Pago
                    </a>
                </div>
            )}
        </div>
    );
};

export default PagoPage;