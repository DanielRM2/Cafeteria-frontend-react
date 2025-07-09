import React from 'react';
import { useRef } from 'react';
import "../css/Menu.css";
import "../css/General.css";
import { fetchData } from "../utils/fetchData.js";
import { useCarrito } from "../hooks/useCarrito.js";


const apiData = fetchData("http://localhost:8080/api/productos/listar-por-categoria");


export default function Menu() {

    const { agregarAlCarrito, cantidadTotal } = useCarrito(); // NUEVO
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
                                            <img src={`/images/${producto.imagen}`} alt={producto.nombre} className="producto-img" />
                                            <h2>{producto.nombre}</h2>
                                            <p>{producto.descripcion}</p>
                                            <h2>S/. {producto.precio.toFixed(2)}</h2>
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
                    <p>© 2025 Urban Coffee. Todos los derechos reservados.</p>
                </div>
            </footer>

        </div>

    );
}



