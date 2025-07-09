import React from 'react';
import '../css/BotonWhatsApp.css';

const BotonWhatsApp = ({ number = "51970358691", message = "¡Pide por WhatsApp!" }) => {

    // Mensaje predeterminado que se enviará
    const mensajePredeterminado = "¡Hola! Estoy interesado en sus productos.";

    // Genera el enlace con el mensaje codificado para URL
    const enlaceWhatsApp = `https://wa.me/${number}?text=${encodeURIComponent(mensajePredeterminado)}`;

    return (
        <div
            className="whatsapp-float"
            data-tooltip={message}
            onClick={() => window.open(enlaceWhatsApp, '_blank')}
            aria-label="Contactar por WhatsApp"
            role="button"
            tabIndex={0}
        >
            <i className="fab fa-whatsapp whatsapp-icon"></i>
        </div>
    );
};

export default BotonWhatsApp;