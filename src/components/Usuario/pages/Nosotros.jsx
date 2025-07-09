import "../css/General.css";
import "../css/Nosotros.css";
import React from "react";
import WhatsAppButton from "../componentes/BotonWhatsApp.jsx";

export default function Nosotros() {

    return (
        <div>

            <div className="banner">
                <img src="/images/banner-nosotros.jpg" className="banner-image" alt="Banner Nosotros"/>
                <div className="texto1">Sobre nosotros</div>
            </div>

            <div className="contenido">

                <section className="info-nosotros">
                    <div className="contenedor-nosotros">
                        <img src="/images/logo.png" alt="Logo Urban Coffee" className="logo-nosotros"/>

                        <div className="texto-nosotros">
                            <h2>Misión</h2>
                            <p>Acercarte a tu café favorito con solo unos clics. Queremos que disfrutes de una
                                experiencia rápida, cómoda y personalizada, ya sea desde casa, el trabajo o donde
                                estés.</p>

                            <h2>Visión</h2>
                            <p>Convertirnos en tu cafetería de confianza, combinando sabor, tecnología e innovación
                                para estar siempre cerca de ti.</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Botón de WhatsApp flotante */}
            <WhatsAppButton/>

            <footer>
                <div className="footer-container">
                    <hr/>
                    <p>© 2025 Urban Coffee. Todos los derechos reservados.</p>
                </div>
            </footer>


        </div>
    );
}
