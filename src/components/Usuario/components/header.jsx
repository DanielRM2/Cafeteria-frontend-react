import { useLocation } from 'react-router-dom';
import { toggleMenu } from "../utils/funcionToggleHeader.js";
import { useSesionCliente } from "../hooks/useSesionCliente.js";
import "../css/General.css";
import React from "react";

export default function Header() {
    const { cliente } = useSesionCliente();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const NavItem = ({ path, label }) => (
        <li>
            <a href={path} className={isActive(path) ? "active" : ""}>
                {label}
            </a>
        </li>
    );

    return (
        <header>
            <div className="navbar" id="myTopnav">
                <div className="logo-brand-container">
                    <img src="/images/logo.png" className="logo" alt="Logo" />
                    <h1 className="brand-name">
                        <span className="urban">URBAN</span><br />
                        <span className="coffee">COFFEE</span>
                    </h1>
                </div>
                <nav>
                    <ul>
                        <NavItem path="/index" label="INICIO" />
                        <NavItem path="/menu" label="MENÚ" />
                        <NavItem path="/carrito" label="CARRITO" />
                        <NavItem path="/nosotros" label="NOSOTROS" />
                        {cliente ? (
                            <NavItem path="/cuenta" label="CUENTA" />
                        ) : (
                            <NavItem path="/login" label="INICIAR SESIÓN" />
                        )}
                    </ul>
                </nav>
                <a onClick={toggleMenu} className="icon" aria-label="Toggle menu">
                    <span className="menu-icon">
                        <i id="menuIconBars" className="fa fa-bars active"></i>
                        <i id="menuIconTimes" className="fa fa-times"></i>
                    </span>
                </a>
            </div>
        </header>
    );
}
