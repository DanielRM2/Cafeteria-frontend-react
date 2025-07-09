import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useLoginRegistro() {
    const navigate = useNavigate();

    const [datosLogin, setDatosLogin] = useState({ email: '', password: '' });
    const [datosRegistro, setDatosRegistro] = useState({
        nombreCompleto: '',
        email: '',
        password: '',
        telefono: '',
    });

    const [registroExitoso, setRegistroExitoso] = useState(false);
    const [mensajeLogin, setMensajeLogin] = useState('');
    const [mensajeRegistro, setMensajeRegistro] = useState('');

    const manejarCambioLogin = (e) => {
        setDatosLogin({ ...datosLogin, [e.target.name]: e.target.value });
    };

    const manejarCambioRegistro = (e) => {
        setDatosRegistro({ ...datosRegistro, [e.target.name]: e.target.value });
    };

    const enviarLogin = async (e) => {
        e.preventDefault();
        setMensajeLogin('');
        try {
            const respuesta = await fetch('http://localhost:8080/api/cliente/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correo: datosLogin.email,
                    contrasena: datosLogin.password
                })
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                localStorage.setItem("token", data.token);
                localStorage.setItem("rol", data.rol || "CLIENTE");
                localStorage.setItem("cliente", JSON.stringify(data.cliente));
                window.location.href = "/cuenta";
            } else {
                const error = await respuesta.json();
                setMensajeLogin(error.message || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error en login:', error);
            setMensajeLogin('Error en la conexión al servidor');
        }
    };

    const enviarRegistro = async (e) => {
        e.preventDefault();
        setMensajeRegistro('');
        setRegistroExitoso(false);
        try {
            const respuesta = await fetch('http://localhost:8080/api/cliente/registro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombreCompleto: datosRegistro.nombreCompleto,
                    correo: datosRegistro.email,
                    contrasena: datosRegistro.password,
                    telefono: datosRegistro.telefono,
                })
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                setMensajeRegistro("¡Registro exitoso! Ahora puedes iniciar sesión.");
                setRegistroExitoso(true);
                setDatosRegistro({ nombreCompleto: '', email: '', password: '', telefono: '' });
            } else {
                let errorMsg = "";
                if (typeof data === "string") {
                    errorMsg = data;
                } else {
                    errorMsg = data.message || "Error al registrarse";
                }
                if (errorMsg.includes("correo ya esta registrado")) {
                    setMensajeRegistro("El correo electrónico ya está registrado. Intenta con otro.");
                } else {
                    setMensajeRegistro(errorMsg);
                }
            }
        } catch (error) {
            console.error('Error en registro:', error);
            setMensajeRegistro('Error en la conexión al servidor');
        }
    };

    return {
        datosLogin,
        setDatosLogin,
        datosRegistro,
        setDatosRegistro,
        manejarCambioLogin,
        manejarCambioRegistro,
        enviarLogin,
        enviarRegistro,
        registroExitoso,
        setRegistroExitoso,
        mensajeLogin,
        setMensajeLogin,
        mensajeRegistro,
        setMensajeRegistro
    };
}