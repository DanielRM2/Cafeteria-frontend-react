import React, { useEffect, useState } from "react";
import { useSesionCliente } from "../hooks/useSesionCliente.js";

export default function Pedidos() {
    const { cliente } = useSesionCliente();
    const [pedidos, setPedidos] = useState([]);
    const [mensaje, setMensaje] = useState("");
    const [pedidoActivo, setPedidoActivo] = useState(null);

    useEffect(() => {
        if (cliente?.id) {
            fetch(`http://localhost:8080/api/pedidos/cliente/${cliente.id}`)
                .then(res => res.json())
                .then(data => setPedidos(data))
                .catch(() => setMensaje("Error al cargar pedidos"));
        }
    }, [cliente]);

    useEffect(() => {
        if (mensaje) {
            const timer = setTimeout(() => setMensaje(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [mensaje]);

    return (
        <div>
            <h3 className="text-2xl font-bold mb-4">Mis Pedidos</h3>

            {mensaje && (
                <div className="mb-4 px-4 py-2 bg-red-100 text-red-800 border border-red-300 rounded transition-all duration-300">
                    {mensaje}
                </div>
            )}

            {/* Tabla de pedidos principal */}
            <div className="w-full overflow-x-auto">
                <table className="min-w-[800px] text-sm bg-white rounded shadow">
                    <thead>
                    <tr className="bg-green-100 text-green-900">
                        <th className="py-2 px-4 text-left"># Pedido</th>
                        <th className="py-2 px-4 text-left">Fecha Pedido</th>
                        <th className="py-2 px-4 text-left">Estado</th>
                        <th className="py-2 px-4 text-left">Método Entrega</th>
                        <th className="py-2 px-4 text-left">Dirección</th>
                        <th className="py-2 px-4 text-left">Total</th>
                        <th className="py-2 px-4 text-left">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pedidos.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="py-4 text-center text-gray-500">
                                No tienes pedidos registrados.
                            </td>
                        </tr>
                    ) : (
                        pedidos.map(pedido => (
                            <tr key={pedido.idPedido} className="border-b hover:bg-green-50">
                                <td className="py-2 px-4">{pedido.idPedido}</td>
                                <td className="py-2 px-4">{pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleString() : "-"}</td>
                                <td className="py-2 px-4">{pedido.estado}</td>
                                <td className="py-2 px-4">{pedido.metodoEntrega || "-"}</td>
                                <td className="py-2 px-4">{pedido.direccion || "-"}</td>
                                <td className="py-2 px-4">S/ {pedido.total?.toFixed(2) ?? "-"}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        onClick={() => setPedidoActivo(pedido)}
                                    >
                                        Ver detalles
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Modal de detalles */}
            {pedidoActivo && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <h4 className="text-xl font-bold mb-2">Detalle del pedido #{pedidoActivo.idPedido}</h4>
                        <div className="mb-2"><b>Estado:</b> {pedidoActivo.estado}</div>
                        <div className="mb-2"><b>Método de entrega:</b> {pedidoActivo.metodoEntrega}</div>
                        <div className="mb-2"><b>Dirección:</b> {pedidoActivo.direccion}</div>
                        <div className="mb-2"><b>Fecha pedido:</b> {pedidoActivo.fechaPedido ? new Date(pedidoActivo.fechaPedido).toLocaleString() : "-"}</div>
                        <div className="mb-2"><b>Fecha entrega:</b> {pedidoActivo.fechaEntrega ? new Date(pedidoActivo.fechaEntrega).toLocaleString() : "-"}</div>
                        <div className="mb-2"><b>Total:</b> S/ {pedidoActivo.total?.toFixed(2) ?? "-"}</div>

                        <h5 className="font-semibold mt-4 mb-2">Productos:</h5>
                        <div className="overflow-x-auto">
                            <table className="min-w-[600px] text-sm bg-gray-50 rounded">
                                <thead>
                                <tr>
                                    <th className="py-1 px-2 text-left">Producto</th>
                                    <th className="py-1 px-2 text-left">Cantidad</th>
                                    <th className="py-1 px-2 text-left">Precio Unitario</th>
                                    <th className="py-1 px-2 text-left">Subtotal</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pedidoActivo.detalles?.length > 0 ? pedidoActivo.detalles.map(det => (
                                    <tr key={det.idDetallePedido}>
                                        <td className="py-1 px-2">{det.nombreProducto}</td>
                                        <td className="py-1 px-2">{det.cantidad}</td>
                                        <td className="py-1 px-2">S/ {det.precioUnitario?.toFixed(2)}</td>
                                        <td className="py-1 px-2">S/ {det.subtotal?.toFixed(2)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="py-2 text-center text-gray-500">
                                            Sin productos
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>

                        {pedidoActivo.pago && (
                            <>
                                <h5 className="font-semibold mt-4 mb-2">Pago:</h5>
                                <div className="mb-2"><b>Método:</b> {pedidoActivo.pago.metodo}</div>
                                <div className="mb-2"><b>Monto:</b> S/ {pedidoActivo.pago.monto?.toFixed(2)}</div>
                                <div className="mb-2"><b>Estado:</b> {pedidoActivo.pago.estado}</div>
                                <div className="mb-2"><b>Fecha pago:</b> {pedidoActivo.pago.fechaPago ? new Date(pedidoActivo.pago.fechaPago).toLocaleString() : "-"}</div>
                            </>
                        )}

                        <div className="flex justify-end mt-6">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setPedidoActivo(null)}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
