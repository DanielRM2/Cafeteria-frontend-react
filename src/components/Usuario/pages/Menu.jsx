import React, { useState } from 'react';
import { useRef } from 'react';
import "../css/Menu.css";
import "../css/General.css";
import "../css/Cuenta.css";
import { fetchData } from "../utils/fetchData.js";
import { useCarrito } from "../hooks/useCarrito.js";
import { URL } from "../utils/api.js";

const apiData = fetchData("/api/productos/listar-por-categoria");

export default function Menu() {

    const [mensajeStock, setMensajeStock] = useState("");
    const [mostrarModal, setMostrarModal] = useState(false);

    const mostrarNotificacion = (mensaje) => {
        setMensajeStock(mensaje);
        setMostrarModal(true);
    };

    const cerrarModal = () => {
        setMostrarModal(false);
    };

    const { agregarAlCarrito, cantidadTotal } = useCarrito(mostrarNotificacion); 
    const productos = apiData.read();
    const cartRef = useRef(null);

    const categorias = Object.entries(
        productos.reduce((acc, producto) => {
            (acc[producto.nombreCategoria] = acc[producto.nombreCategoria] || []).push(producto);
            return acc;
        }, {})
    );

    const handleAddToCart = (e, producto) => {
        e.preventDefault();
        agregarAlCarrito(producto);

        if (cartRef.current) {
            cartRef.current.classList.add("cart-bounce");
            setTimeout(() => {
                cartRef.current.classList.remove("cart-bounce");
            }, 500);
        }
    };


    return (
        <div>

            {mostrarModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <div className="flex items-center">
                            <svg className="w-6 h-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 11-12.728 0 9 9 0 0112.728 0zM12 8v4m0 4h.01"></path>
                            </svg>
                            <span>{mensajeStock}</span>
                        </div>
                        <button onClick={cerrarModal} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Cerrar</button>
                    </div>
                </div>
            )}

            <div className="banner">
                <img src="/images/banner-menu.jpg" className="banner-image" alt="Banner"/>
                <div className="texto1">Menú</div>
            </div>

            <main>
                <div className="productos-container">
                    {categorias.map(([nombreCategoria, productos]) => (
                        <div key={nombreCategoria} className="categoria-container">
                            <h2 className="categoria-title">{nombreCategoria}</h2>
                            <div className="productos-grid">
                                {productos.map((producto) => (
                                    <div key={producto.idProducto} className="producto-card">
                                        <img
                                            src={`${URL}/uploads/${producto.imagen}`}
                                            alt={producto.nombre}
                                            className="producto-img"
                                        />
                                        <h2>{producto.nombre}</h2>
                                        <p>{producto.descripcion}</p>
                                        <h2>S/. {producto.precio.toFixed(2)}</h2>
                                        <div className="stock-info text-sm text-gray-600">En stock: {producto.stock}</div>
                                        <button
                                            onClick={(e) => handleAddToCart(e, producto)}
                                            className="add-to-cart-button"
                                        >
                                            Agregar al carrito
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <li>
                    <a href="/carrito">
                        <div ref={cartRef} className="cart-toggle" data-count={cantidadTotal}>
                            🛒
                        </div>
                    </a>
                </li>
            </main>

            {/* Botón de Carrito flotante */}
            <footer>
                <div className="footer-container">
                    <hr/>
                    <p> 2025 Urban Coffee. Todos los derechos reservados.</p>
                </div>
            </footer>

        </div>

    );
}