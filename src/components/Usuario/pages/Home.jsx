import React from 'react';
import { Link } from 'react-router-dom';
import WhatsAppButton from '../components/BotonWhatsApp.jsx';
import "../css/General.css";
import "../css/Home.css";
import { fetchData } from "../utils/fetchData.js";


const apiData = fetchData("http://localhost:8080/api/productos/listar-populares");


export default function Home() {

    const data = apiData.read();

    return (


        <div>

            <div className="banner">
                <img src="/images/banner-inicio.png" className="banner-image" alt="Banner"/>
                <div className="texto1">Descubre el encanto de nuestros sabores</div>
            </div>

            <main>
                <section className="product-section">
                    <h1 className="section-title">LOS MÁS POPULARES</h1>
                            <div className="product-list">
                                {data?.map((producto, index) => (
                                    <div className="product-card1" key={index}>
                                        <img
                                            src={`/images/${producto.imagen}`}
                                            className="product-image"
                                            alt={producto.nombre}
                                        />
                                        <h2>{producto.nombre}</h2>
                                        <p>{producto.descripcion}</p>
                                        <h3>S/. {producto.precio.toFixed(2)}</h3>
                                    </div>
                                ))}
                            </div>
                            <div className="product-button">
                                <Link to="/menu" className="view-more-button">Ver más productos</Link>
                            </div>
                    </section>
            </main>

            <div className="fondo">
                <img src="/images/fondoa.png" className="fondo-image" alt="Fondo A"/>
                <div className="fondo2">
                    <div className="fondo2-img-seccion">
                        <img src="/images/fondob.png" className="fondo2-image" alt="Fondo B"/>
                    </div>
                    <div className="fondo2-texto-seccion">
                        <h2>
                            Conoce nuestra esencia, lo que hace única cada taza: sabores auténticos, aromas
                            irresistibles e
                            ingredientes frescos que despiertan tus sentidos.
                        </h2>
                        <Link to="/nosotros" className="view-more-button">Ver más sobre nosotros</Link>
                    </div>
                </div>
            </div>

            {/* Botón de WhatsApp flotante */}
            <WhatsAppButton />

            <footer>
                <div className="footer-container">
                    <hr/>
                    <p>© 2025 Urban Coffee. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
