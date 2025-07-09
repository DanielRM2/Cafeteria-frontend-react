import { useNavigate } from 'react-router-dom';
import "../css/General.css";
import "../css/Carrito.css";
import React, { useState } from 'react';
import { useSesionCliente } from "../hooks/useSesionCliente.js";
import { useCarrito } from "../hooks/useCarrito.js";
import { fetchData } from "../utils/fetchData.js";

const apiData = fetchData("http://localhost:8080/api/metodosEntrega/listar");

export default function Carrito() {

    const { carrito, eliminarDelCarrito, actualizarCantidad, totalCarrito, stockMap } = useCarrito();

    const {cliente} = useSesionCliente();

    const navigate = useNavigate();

    const metodosEntrega = apiData.read();

    const [seleccion, setSeleccion] = useState(null);

    const manejarCambio = (e) => {
        const metodoSeleccionado = metodosEntrega.find(m => m.nombre === e.target.value);
        setSeleccion(metodoSeleccionado);
    };

    const handleCompra = () => {
        if (!cliente) {
            alert("Debes iniciar sesión para realizar una compra.");
            navigate("/login");
            return;
        }
        if (!seleccion) {
            alert("Debes seleccionar un método de entrega antes de comprar.");
            return;
        }
        // Aquí se proseguiría el proceso de compra...
        alert("Procediendo con la compra...");
    };

    return (
        <div>

            <div className="banner">
                <img src="/images/banner-carrito.jpg" className="banner-image" alt="Banner"/>
                <div className="texto1">Mi carrito</div>
            </div>

            <div className="contenido-carrito">
                {carrito.length === 0 ? (
                    <p>Tu carrito está vacío.</p>
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
                                                src={`/images/${producto.imagen}`}
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
                                        <input
                                            type="number"
                                            value={producto.cantidad}
                                            min="0"
                                            max={stockMap[producto.idProducto] || 99}
                                            onChange={e => {
                                                const value = e.target.value;
                                                // Permitir cualquier valor numérico, la lógica del hook maneja el 0 y los inválidos
                                                actualizarCantidad(
                                                    producto.idProducto,
                                                    Number(value)
                                                );
                                            }}
                                        />
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

                        {/* Tabla del total */}
                        <table className="tabla-total">
                            <tbody>
                            <tr>
                                <td><strong>Subtotal:</strong></td>
                                <td><strong>S/. {totalCarrito.toFixed(2)}</strong></td>
                            </tr>
                            <tr>
                                <td>
                                        <div>
                                            <strong>Método de entrega:</strong>
                                        </div>
                                        {metodosEntrega?.map((m, index) => (
                                            <label key={index} style={{display: 'block', cursor: 'pointer'}}>
                                                <input
                                                    type="radio"
                                                    name="metodoEntrega"
                                                    value={m.nombre}
                                                    onChange={manejarCambio}
                                                    checked={seleccion?.nombre === m.nombre}
                                                />
                                                {m.nombre}
                                            </label>
                                        ))}
                                </td>
                                <td>
                                        {seleccion ? (
                                            <strong>S/. {seleccion.costo.toFixed(2)}</strong>
                                        ) : (
                                            <p>Pendiente</p>
                                        )}
                                </td>
                            </tr>

                            <tr>
                                <td><strong>Total:</strong></td>
                                <td>
                                    <strong>
                                        S/. {(totalCarrito + (seleccion ? Number(seleccion.costo) : 0)).toFixed(2)}
                                    </strong>
                                </td>
                            </tr>
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan="2" className="td-comprar">
                                    <button className="btn-comprar" onClick={handleCompra}>
                                        🔒︎ Comprar
                                    </button>
                                </td>
                            </tr>
                            </tfoot>
                        </table>

                    </div>
                )}
            </div>


        </div>
    );
}
