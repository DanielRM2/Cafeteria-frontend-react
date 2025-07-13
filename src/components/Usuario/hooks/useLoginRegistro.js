import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postDataSimple } from "../utils/api.js"; // ajusta la ruta según tu estructura

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
            const data = await postDataSimple("/api/cliente/login", {
                correo: datosLogin.email,
                contrasena: datosLogin.password
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("rol", data.rol || "CLIENTE");
            localStorage.setItem("cliente", JSON.stringify(data.cliente));
            window.location.href = "/cuenta";

        } catch (error) {
            setMensajeLogin(error.message || 'Credenciales inválidas');
        }
    };

    const enviarRegistro = async (e) => {
        e.preventDefault();
        setMensajeRegistro('');
        setRegistroExitoso(false);
        try {
            const data = await postDataSimple("/api/cliente/registro", {
                nombreCompleto: datosRegistro.nombreCompleto,
                correo: datosRegistro.email,
                contrasena: datosRegistro.password,
                telefono: datosRegistro.telefono,
            });

            setMensajeRegistro("¡Registro exitoso! Ahora puedes iniciar sesión.");
            setRegistroExitoso(true);
            setDatosRegistro({ nombreCompleto: '', email: '', password: '', telefono: '' });

        } catch (error) {
            const msg = typeof error === "string" ? error : error.message || "Error al registrarse";
            if (msg.includes("correo ya esta registrado")) {
                setMensajeRegistro("El correo electrónico ya está registrado. Intenta con otro.");
            } else {
                setMensajeRegistro(msg);
            }
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
