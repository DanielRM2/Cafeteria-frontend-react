import { useNavigate } from 'react-router-dom';
import React, { useEffect, useRef, useState } from "react";
import "../css/General.css";
import "../css/Login.css";
import { iniciarCarrusel } from "../utils/funcionInitCarrusel.js";
import { useSesionCliente } from "../hooks/useSesionCliente.js";
import { useLoginRegistro } from "../hooks/useLoginRegistro.js";

export default function Login() {
    const navigate = useNavigate();
    const { cliente } = useSesionCliente();
    const [visiblePass, setVisiblePass] = useState("");
    const [mostrarRegistro, setMostrarRegistro] = useState(false);
    const formularioEnviadoRef = useRef(false);

    const {
        datosLogin,
        manejarCambioLogin,
        enviarLogin,
        datosRegistro,
        manejarCambioRegistro,
        enviarRegistro,
        registroExitoso,
        setRegistroExitoso,
        mensajeLogin,
        setMensajeLogin,
        mensajeRegistro,
        setMensajeRegistro
    } = useLoginRegistro();

    useEffect(() => {
        // Si ya hay sesión activa (token y rol), redirige a /cuenta
        const token = localStorage.getItem('token_cliente');
        const rol = localStorage.getItem('rol');
        if (token && rol === 'CLIENTE') {
            navigate('/cuenta');
        }
    }, [navigate]);

    useEffect(() => {
        if (cliente) navigate("/cuenta");
    }, [cliente, navigate]);

    useEffect(() => {
        iniciarCarrusel();
    }, []);

    useEffect(() => {
        if (registroExitoso) {
            setMostrarRegistro(false);
            setRegistroExitoso(false);
            setMensajeLogin("¡Registro exitoso! Ahora puedes iniciar sesión.");
            formularioEnviadoRef.current = false;
        }
    }, [registroExitoso]);

    useEffect(() => {
        if (mensajeLogin) {
            const timer = setTimeout(() => setMensajeLogin(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [mensajeLogin]);

    useEffect(() => {
        if (mensajeRegistro) {
            const timer = setTimeout(() => setMensajeRegistro(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [mensajeRegistro]);

    const handleSubmitLogin = (e) => {
        formularioEnviadoRef.current = true;
        enviarLogin(e);
    };

    const handleSubmitRegistro = (e) => {
        formularioEnviadoRef.current = true;
        enviarRegistro(e);
    };

    return (
        <div>

            {/* Carrusel */}
            <div className="container">
                <div className="carousel">
                    <div className="carousel-item active"><img src="/images/carrusel/item1.jpg" alt="item 1" /></div>
                    <div className="carousel-item"><img src="/images/carrusel/item2.jpg" alt="item 2" /></div>
                    <div className="carousel-item"><img src="/images/carrusel/item3.jpg" alt="item 3" /></div>
                </div>

                {/* Contenedor de formularios */}
                <div className="form-container">
                    <div className="form-inner">
                        {/* REGISTRO */}
                        <div className={`register-container ${mostrarRegistro ? "active" : ""}`}>
                                {mensajeRegistro && (
                                    <div
                                        className={`alerta-login ${mensajeRegistro.includes("exitoso") ? "exito" : "error"}`}>
                                        {mensajeRegistro}
                                    </div>
                                )}
                                <h1>Registro de cuenta</h1>
                                <form onSubmit={handleSubmitRegistro}>
                                    <p>Nombre completo</p>
                                    <input
                                        type="text"
                                        name="nombreCompleto"
                                        placeholder="Nombre completo"
                                        value={datosRegistro.nombreCompleto}
                                        onChange={manejarCambioRegistro}
                                        required
                                        minLength="2"
                                        maxLength="50"
                                        pattern="[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+"
                                        title="Solo letras y espacios"
                                        className={formularioEnviadoRef.current && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,50}$/.test(datosRegistro.nombreCompleto) ? 'invalid' : ''}
                                    />
                                    {formularioEnviadoRef.current && !/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]{2,50}$/.test(datosRegistro.nombreCompleto) &&
                                        <span className="error-message">Solo letras (mín. 2 caracteres)</span>
                                    }

                                    <p>Correo electrónico</p>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Correo electrónico"
                                        value={datosRegistro.email}
                                        onChange={manejarCambioRegistro}
                                        required
                                    />

                                    <p>Contraseña</p>
                                    <label className="password-label">
                                        <input
                                            type={visiblePass === "register" ? "text" : "password"}
                                            name="password"
                                            placeholder="Contraseña"
                                            value={datosRegistro.password}
                                            onChange={manejarCambioRegistro}
                                            required
                                            minLength="5"
                                        />
                                        <span
                                            className="show-btn"
                                            onClick={() => setVisiblePass(visiblePass === "register" ? "" : "register")}
                                        >
                                            <i className={visiblePass === "register" ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                        </span>
                                    </label>

                                    <p>Número de celular</p>
                                    <input
                                        type="tel"
                                        name="telefono"
                                        placeholder="Número de celular"
                                        value={datosRegistro.telefono}
                                        onChange={manejarCambioRegistro}
                                        required
                                        pattern="9[0-9]{8}"
                                    />

                                    <button type="submit">Registrarse</button>
                                    <p className="switch-form">
                                        ¿Ya tienes una cuenta?{" "}
                                        <a onClick={() => {
                                            setMostrarRegistro(false);
                                            formularioEnviadoRef.current = false;
                                            setMensajeLogin('');
                                        }}>
                                            Inicia sesión aquí
                                        </a>
                                    </p>
                                </form>
                        </div>

                        {/* LOGIN*/}
                        <div className={`login-container ${!mostrarRegistro ? "active" : ""}`}>
                            {mensajeLogin && (
                                <div
                                    className={`alerta-login ${mensajeLogin.includes("exitoso") ? "exito" : "error"}`}>
                                    {mensajeLogin}
                                </div>
                            )}
                            <h1>Inicio de sesión</h1>
                            <form onSubmit={handleSubmitLogin}>
                                <p>Correo electrónico</p>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Correo electrónico"
                                    value={datosLogin.email}
                                    onChange={manejarCambioLogin}
                                    required
                                />

                                <p>Contraseña</p>
                                <label className="password-label">
                                    <input
                                        type={visiblePass === "login" ? "text" : "password"}
                                        name="password"
                                        placeholder="Contraseña"
                                        value={datosLogin.password}
                                        onChange={manejarCambioLogin}
                                        required
                                    />
                                    <span
                                        className="show-btn"
                                        onClick={() => setVisiblePass(visiblePass === "login" ? "" : "login")}
                                    >
                                        <i className={visiblePass === "login" ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                                        </span>
                                </label>

                                <button type="submit">Iniciar sesión</button>
                                <p className="switch-form">
                                    ¿No tienes cuenta?{" "}
                                    <a onClick={() => {
                                        setMostrarRegistro(true);
                                        formularioEnviadoRef.current = false;
                                        setMensajeRegistro('');
                                    }}>
                                        Regístrate ahora
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
