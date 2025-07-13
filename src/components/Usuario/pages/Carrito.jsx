import "../css/General.css";
import "../css/Carrito.css";
import "../css/Cuenta.css";
import React, { useState } from 'react';
import { useSesionCliente } from "../hooks/useSesionCliente.js";
import { useCarrito } from "../hooks/useCarrito.js";
import WizardCompra from "../components/WizardCompra";
import { URL } from "../utils/api.js";

export default function Carrito() {

    const { carrito, eliminarDelCarrito, actualizarCantidad, totalCarrito, stockMap } = useCarrito();
    const {cliente} = useSesionCliente();
    const [wizardAbierto, setWizardAbierto] = useState(false);
    const [mostrarModal, setMostrarModal] = useState(false);

    const handleCompra = () => {
        if (!cliente) {
            setMostrarModal(true);
            return;
        }
        setWizardAbierto(true);
    };

    const cerrarModal = () => setMostrarModal(false);
    const irALogin = () => window.location.href = "/login";

    return (
        <div>

            <div className="banner">
                <img src="/images/banner-carrito.jpg" className="banner-image" alt="Banner"/>
                <div className="texto1">Mi carrito</div>
            </div>

            <div className="contenido-carrito">
                {carrito.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-16">
                        <img src="/images/carro-vacio.png" alt="Carrito vacío" className="w-24 h-24 mb-4" />
                        <p className="text-lg font-semibold mb-4">Tu carrito está vacío</p>
                        <p className="text-gray-600 mb-6">¡Comienza a agregar productos ahora!</p>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                            onClick={() => window.location.href = "/menu"}

                        >
                            Explorar productos
                        </button>
                    </div>
                ) : (
                    <div className="carrito-layout">
                        {/* Tabla de productos */}
                        <table className="tabla-carrito">
                            <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {carrito.map(producto => (
                                <tr key={producto.idProducto}>
                                    <td data-label="Producto">
                                        <div className="producto-info">
                                            <img
                                                src={`${URL}/uploads/${producto.imagen}`}
                                                alt={producto.nombre}
                                                className="producto-imagen-carrito"
                                            />
                                            <div className="producto-detalle-carrito">
                                                <strong>{producto.nombre}</strong>
                                                <p>{producto.descripcion}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-label="Cantidad">
                                        <div className="flex items-center">
                                            <button
                                                className="bg-gray-200 px-2 py-1 rounded-l hover:bg-gray-300"
                                                onClick={() => actualizarCantidad(producto.idProducto, producto.cantidad - 1)}
                                                disabled={producto.cantidad <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="px-4">{producto.cantidad}</span>
                                            <button
                                                className="bg-gray-200 px-2 py-1 rounded-r hover:bg-gray-300"
                                                onClick={() => actualizarCantidad(producto.idProducto, producto.cantidad + 1)}
                                                disabled={producto.cantidad >= (stockMap[producto.idProducto] || 99)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td data-label="Precio">
                                        S/. {(producto.precio * producto.cantidad).toFixed(2)}
                                    </td>
                                    <td data-label="Eliminar">
                                        <div className="boton-eliminar"
                                             onClick={() => eliminarDelCarrito(producto.idProducto)}>
                                            🗑️
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <table className="tabla-resumen">
                            <thead>
                            <tr>
                                <th colSpan="2" className="resumen-compra-header">
                                    <span>🛒</span>
                                    <span>Resumen de tu compra</span>
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {/* Fila para cupón */}
                            <tr>
                                <td colSpan="2">
                                    <div className="resumen-compra-cupon">
                                        <span>🏷️</span>
                                        <input type="text" placeholder="Ingresa un cupón de descuento"/>
                                        <button>Aplicar</button>
                                    </div>
                                </td>
                            </tr>

                            {/* Fila de subtotal */}
                            <tr className="resumen-compra-subtotal">
                                <td>Subtotal:</td>
                                <td style={{textAlign: "right"}}>S/. {totalCarrito.toFixed(2)}</td>
                            </tr>

                            {/* Fila de total */}
                            <tr className="resumen-compra-total">
                                <td>Total a pagar:</td>
                                <td style={{textAlign: "right"}}>S/. {totalCarrito.toFixed(2)}</td>
                            </tr>

                            {/* Botón pagar */}
                            <tr>
                                <td colSpan="2" className="resumen-compra-boton" style={{textAlign: "center"}}>
                                    <button onClick={handleCompra} disabled={carrito.length === 0}>
                                        🔒︎ Ir a pagar
                                    </button>
                                </td>
                            </tr>

                            {/* Notas */}
                            <tr>
                                <td colSpan="2">
                                    <div className="resumen-compra-notas">
                                        <div>
                                            <b>Notas:</b> Todos los precios incluyen IGV.
                                        </div>
                                        <div>
                                            <b>Política:</b> Revisa tu pedido antes de confirmar. No se aceptan
                                            devoluciones de productos perecibles.
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                )}
            </div>

            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Iniciar sesión</h2>
                        <p className="mb-4">Debes iniciar sesión para realizar una compra.</p>
                        <div className="flex justify-end">
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2" onClick={cerrarModal}>Cancelar</button>
                            <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={irALogin}>Iniciar sesión</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Wizard modal centrado */}
            {wizardAbierto && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: '#0008',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div className="modal-wizard" style={{
                        background: 'white',
                        borderRadius: 10,
                        padding: 0,
                        boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
                        minWidth: 350,
                        maxWidth: 500,
                        position: 'relative'
                    }}>
                        <button onClick={() => setWizardAbierto(false)} style={{
                            position: 'absolute',
                            top: 18,
                            right: 18,
                            fontSize: 20,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer'
                        }}>✖
                        </button>
                        <WizardCompra onClose={() => setWizardAbierto(false)}/>
                    </div>
                </div>
            )}

        </div>
    );
}
