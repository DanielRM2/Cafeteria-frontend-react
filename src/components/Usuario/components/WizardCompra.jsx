import React, { useEffect, useState } from "react";
import { fetchDataSimple, postDataSimple } from "../utils/api.js";
import { useSesionCliente } from "../hooks/useSesionCliente.js";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../hooks/useCarrito.js";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import "../css/WizardCompraTransitions.css";
import SpinnerInterno from "./loadingInterno.jsx";

export default function WizardCompra({ onClose }) {
    const { cliente } = useSesionCliente();
    const navigate = useNavigate();
    const [direcciones, setDirecciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const { carrito, totalCarrito } = useCarrito();

    // Métodos de entrega
    const [metodosEntrega, setMetodosEntrega] = useState([]);
    const [cargandoMetodos, setCargandoMetodos] = useState(true);
    const [errorMetodos, setErrorMetodos] = useState("");
    const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);

    // Paso del wizard
    const [paso, setPaso] = useState(1);
    const totalPasos = 3;

    // Estado global para pago
    const [loadingPago, setLoadingPago] = useState(false);
    const [errorPago, setErrorPago] = useState("");

    useEffect(() => {
        const cargarDirecciones = async () => {
            setCargando(true);
            setError("");
            try {
                if (cliente?.id) {
                    const data = await fetchDataSimple(`/api/direcciones-cliente/cliente/${cliente.id}`);
                    setDirecciones(data);
                } else {
                    setDirecciones([]);
                    setError("No hay cliente logueado");
                }
            } catch (e) {
                setError("Error al cargar direcciones");
            } finally {
                setCargando(false);
            }
        };
        cargarDirecciones();
    }, [cliente]);

    useEffect(() => {
        const cargarMetodos = async () => {
            setCargandoMetodos(true);
            setErrorMetodos("");
            try {
                const data = await fetchDataSimple("/api/metodosEntrega/listar");
                setMetodosEntrega(data);
            } catch (e) {
                setErrorMetodos("Error al cargar métodos de entrega");
            } finally {
                setCargandoMetodos(false);
            }
        };
        cargarMetodos();
    }, []);

    const direccionPredeterminada = direcciones.find(d => d.predeterminada);

    // --- Estilos wizard ---
    const colorPrimario = '#007211';
    const colorSecundario = '#e0f3e6';
    const pasoActivoStyle = {
        background: colorPrimario,
        color: 'white',
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        border: `2px solid ${colorPrimario}`
    };
    const pasoInactivoStyle = {
        background: colorSecundario,
        color: colorPrimario,
        borderRadius: '50%',
        width: 36,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: 18,
        border: `2px solid ${colorSecundario}`
    };
    const pasoLabelStyle = {
        marginTop: 4,
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
        minWidth: 65
    };

    // --- Barra de pasos dinámica y numeración adaptativa ---
    function BarraPasos() {
        const requiereDireccion = metodoSeleccionado && metodoSeleccionado.nombre.toLowerCase().includes('domicilio');
        let pasos;
        let pasoActual = paso;
        if (requiereDireccion) {
            pasos = [
                { label: 'Entrega', key: 'entrega' },
                { label: 'Dirección', key: 'direccion' },
                { label: 'Resumen', key: 'resumen' }
            ];
        } else {
            pasos = [
                { label: 'Entrega', key: 'entrega' },
                { label: 'Resumen', key: 'resumen' }
            ];
            if (paso === 3) pasoActual = 2;
        }
        // Barra de progreso animada
        const progressPercent = ((pasos.findIndex(p => pasoActual === (requiereDireccion ? pasos.indexOf(p)+1 : (p.key === 'entrega' ? 1 : 2))) + 1) / pasos.length) * 100;
        return (
            <div style={{position:'relative', display:'flex', justifyContent:'center', alignItems:'flex-start', gap:32, marginBottom: 32, minHeight: 60}}>
                {/* Barra de progreso de fondo */}
                <div style={{position:'absolute', left:18, right:18, top:'50%', height:4, background:'#e0f3e6', borderRadius:2, zIndex:0}}/>
                {/* Barra de progreso animada */}
                <div className="wizard-bar-progress" style={{width: `calc(${progressPercent}% - 18px)`, background: colorPrimario}}/>
                {pasos.map((p, i) => (
                    <React.Fragment key={p.key}>
                        <div style={{display:'flex', flexDirection:'column', alignItems:'center', zIndex:2}}>
                            <div style={pasoActual === i+1 ? pasoActivoStyle : pasoInactivoStyle}>
                                {i+1}
                                {pasoActual > i+1 && (
                                    <span style={{color:'#3ec96b', fontWeight:900, marginLeft:4, fontSize:18}}>✓</span>
                                )}
                            </div>
                            <div style={pasoLabelStyle}>{p.label}</div>
                        </div>
                        {i < pasos.length - 1 && (
                            <div style={{height:2, width:36, background: pasoActual > i+1 ? colorPrimario : colorSecundario, marginTop: 17, zIndex:1}}/>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    }

    // Paso 1: Elegir método de entrega
    function PasoMetodoEntrega() {
        const [showError, setShowError] = useState(false);
        function handleContinuar() {
            if (!metodoSeleccionado) {
                setShowError(true);
                return;
            }
            setShowError(false);
            if (metodoSeleccionado.nombre.toLowerCase().includes('domicilio')) {
                setPaso(2);
            } else {
                setPaso(3);
            }
        }
        return (
            <>
                <div style={{fontWeight:'bold', fontSize:18, marginBottom:12, textAlign:'center', color: colorPrimario}}>
                    Paso 1: Elige el método de entrega
                </div>
                <hr style={{marginBottom:16}}/>
                <div style={{marginTop:12, marginBottom:8}}>
                    <strong>Método de entrega:</strong>
                    <div style={{marginTop:8}}>
                        {metodosEntrega.map((m, idx) => (
                            <label key={m.idMetodoEntrega} style={{display:'block', cursor:'pointer', marginBottom:6}}>
                                <input
                                    type="radio"
                                    name="metodoEntrega"
                                    value={m.nombre}
                                    checked={metodoSeleccionado?.idMetodoEntrega === m.idMetodoEntrega}
                                    onChange={() => { setMetodoSeleccionado(m); setShowError(false); }}
                                    style={{marginRight:6}}
                                />
                                {m.nombre} <span style={{color:'#666', fontSize:13}}>(S/. {m.costo.toFixed(2)})</span>
                            </label>
                        ))}
                    </div>
                    {showError && (
                        <div style={{color:'#e74c3c', fontWeight:500, marginTop:6, fontSize:15}}>
                            Por favor selecciona un método de entrega para continuar.
                        </div>
                    )}
                </div>
                <div style={{display:'flex', justifyContent:'flex-end', marginTop: 10}}>
                    <button
                        onClick={handleContinuar}
                        style={{ background: colorPrimario, color: 'white', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, cursor:'pointer' }}
                    >
                        Continuar
                    </button>
                </div>
            </>
        );
    }

    // Paso 2: Dirección solo si es envío a domicilio
    function PasoDireccion() {
        const requiereDireccion = metodoSeleccionado && metodoSeleccionado.nombre.toLowerCase().includes('domicilio');
        if (!requiereDireccion) {
            setPaso(3); // Avanza automáticamente si no requiere dirección
            return null;
        }
        return (
            <>
                <div style={{fontWeight:'bold', fontSize:18, marginBottom:12, textAlign:'center', color: colorPrimario}}>
                    Paso 2: Selecciona tu dirección de envío
                </div>
                <hr style={{marginBottom:16}}/>
                {direccionPredeterminada ? (
                    <>
                        <div style={{ marginBottom: 12 }}>
                            <strong>Dirección predeterminada:</strong>
                            <div><b>Dirección:</b> {direccionPredeterminada.direccion}</div>
                            <div><b>Distrito:</b> {direccionPredeterminada.distrito}</div>
                            <div><b>Referencia:</b> {direccionPredeterminada.referencia || '-'} </div>
                        </div>
                        <button
                            onClick={() => navigate('/cuenta?tab=direcciones')}
                            style={{ marginRight: 12, marginBottom: 8, background: colorSecundario, color: colorPrimario, border: `1.5px solid ${colorPrimario}`, borderRadius: 6, padding: '7px 14px', fontWeight: 500, cursor:'pointer' }}
                        >
                            Cambiar dirección predeterminada
                        </button>
                        <div style={{display:'flex', justifyContent:'space-between', gap:12, marginTop:8}}>
                            <button
                                onClick={() => setPaso(1)}
                                style={{background: colorSecundario, color: colorPrimario, border: `1.5px solid ${colorPrimario}`, borderRadius: 6, padding: '7px 14px', fontWeight: 500, cursor:'pointer'}}
                            >
                                Volver
                            </button>
                            <button
                                onClick={() => setPaso(3)}
                                style={{background: colorPrimario, color: 'white', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, cursor:'pointer'}}
                            >
                                Continuar
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div style={{ color: 'red', marginBottom: 12 }}>
                            No tienes ninguna dirección predeterminada.<br/>
                            {direcciones.length > 0 ? "(Tienes direcciones pero ninguna marcada como predeterminada)" : "(No tienes direcciones registradas)"}
                        </div>
                        <button
                            onClick={() => navigate('/cuenta?tab=direcciones')}
                            style={{ marginBottom: 8, background: colorPrimario, color: 'white', border: 'none', borderRadius: 6, padding: '7px 18px', fontWeight: 600, cursor:'pointer' }}
                        >
                            Ir a gestionar direcciones
                        </button>
                        <div style={{marginTop:8, display:'flex', justifyContent:'flex-start'}}>
                            <button
                                onClick={() => setPaso(1)}
                                style={{background: colorSecundario, color: colorPrimario, border: `1.5px solid ${colorPrimario}`, borderRadius: 6, padding: '7px 14px', fontWeight: 500, cursor:'pointer'}}
                            >
                                Volver
                            </button>
                        </div>
                    </>
                )}
            </>
        );
    }

    // Paso 3: Resumen del carrito y total (número de paso dinámico)
    function PasoResumen({ pasoResumen }) {
        const handleConfirmarPedido = async () => {
            if (loadingPago) return; // Previene doble envío
            setLoadingPago(true);
            setErrorPago("");
            try {
                // 1. Crear pedido con el payload correcto, enviando siempre idDireccion y la fecha actual
                const fechaPedido = new Date().toISOString().slice(0, 19); // formato 'YYYY-MM-DDTHH:mm:ss'
                const pedidoPayload = {
                    idCliente: cliente.id,
                    idMetodoEntrega: metodoSeleccionado.idMetodoEntrega,
                    idDireccion: metodoSeleccionado && metodoSeleccionado.nombre && metodoSeleccionado.nombre.toLowerCase().includes('domicilio')
                        ? (direccionPredeterminada ? direccionPredeterminada.idDireccion : null)
                        : null,
                    total: (totalCarrito + Number(metodoSeleccionado.costo)),
                    fechaPedido: fechaPedido,
                    detalles: carrito.map(prod => ({
                        idProducto: prod.idProducto,
                        cantidad: prod.cantidad,
                        precioUnitario: prod.precio,
                        subtotal: prod.precio * prod.cantidad
                    }))
                };
                const pedido = await postDataSimple("/api/pedidos", pedidoPayload);
                // 2. Generar link de pago
                const pago = await postDataSimple("/api/pagos", {
                    idPedido: pedido.idPedido || pedido.id,
                    idCliente: cliente.id,
                    monto: pedido.total,
                    payerEmail: cliente.correo
                });
                // 3. Redireccionar automáticamente
                window.location.href = pago.paymentLink;
            } catch (e) {
                setErrorPago(e.message || "Error al confirmar pedido o generar pago.");
            } finally {
                setLoadingPago(false);
            }
        };

        return (
            <>
                <div style={{fontWeight:'bold', fontSize:18, marginBottom:12, textAlign:'center', color: colorPrimario}}>
                    Paso {pasoResumen}: Resumen y confirmación
                </div>
                <hr style={{marginBottom:16}}/>
                {carrito.length === 0 ? (
                    <div style={{color:'red', textAlign:'center'}}>Tu carrito está vacío.</div>
                ) : (
                    <div style={{marginBottom: 16}}>
                        <table style={{width:'100%', borderCollapse:'collapse', background:'#f9f9f9', borderRadius:8, overflow:'hidden'}}>
                            <thead>
                            <tr style={{background: colorSecundario}}>
                                <th style={{padding:8, fontWeight:600, color:colorPrimario, borderBottom:'1px solid #ddd'}}>Producto</th>
                                <th style={{padding:8, fontWeight:600, color:colorPrimario, borderBottom:'1px solid #ddd'}}>Cant.</th>
                                <th style={{padding:8, fontWeight:600, color:colorPrimario, borderBottom:'1px solid #ddd'}}>Subtotal</th>
                            </tr>
                            </thead>
                            <tbody>
                            {carrito.map((prod) => (
                                <tr key={prod.idProducto}>
                                    <td style={{padding:7}}>{prod.nombre}</td>
                                    <td style={{padding:7, textAlign:'center'}}>{prod.cantidad}</td>
                                    <td style={{padding:7, textAlign:'right'}}>S/. {(prod.precio * prod.cantidad).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                            <tfoot>
                            <tr>
                                <td colSpan={2} style={{padding:7, textAlign:'right', fontWeight:600}}>Subtotal:</td>
                                <td style={{padding:7, textAlign:'right', fontWeight:600}}>S/. {totalCarrito.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{padding:7, textAlign:'right', fontWeight:600}}>Envío:</td>
                                <td style={{padding:7, textAlign:'right', fontWeight:600}}>
                                    {metodoSeleccionado ? `S/. ${metodoSeleccionado.costo.toFixed(2)}` : '--'}
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={2} style={{padding:7, textAlign:'right', fontWeight:600, color:colorPrimario}}>Total:</td>
                                <td style={{padding:7, textAlign:'right', fontWeight:600, color:colorPrimario}}>
                                    {metodoSeleccionado ? `S/. ${(totalCarrito + Number(metodoSeleccionado.costo)).toFixed(2)}` : '--'}
                                </td>
                            </tr>
                            </tfoot>
                        </table>
                    </div>
                )}
                {errorPago && (
                    <div style={{color:'#e74c3c', fontWeight:500, marginBottom:12, textAlign:'center'}}>
                        {errorPago}
                    </div>
                )}
                <div style={{display:'flex', justifyContent:'space-between', gap:12, marginTop:8}}>
                    <button
                        onClick={() => setPaso(metodoSeleccionado && metodoSeleccionado.nombre.toLowerCase().includes('domicilio') ? 2 : 1)}
                        style={{background: colorSecundario, color: colorPrimario, border: `1.5px solid ${colorPrimario}`, borderRadius: 6, padding: '7px 14px', fontWeight: 500, cursor:'pointer'}}
                        disabled={loadingPago}
                    >
                        Volver
                    </button>
                    <button
                        className="btn-confirmar"
                        onClick={handleConfirmarPedido}
                        disabled={carrito.length === 0 || !metodoSeleccionado || (metodoSeleccionado.nombre.toLowerCase().includes('domicilio') && !direccionPredeterminada) || loadingPago}
                        style={{ background: colorPrimario, color: 'white', border: 'none', borderRadius: 6, padding: '8px 30px', fontWeight: 700, fontSize: 17, cursor: loadingPago ? 'not-allowed' : 'pointer', opacity: loadingPago ? 0.7 : 1 }}
                    >
                        {loadingPago ? "Procesando..." : "Confirmar pedido"}
                    </button>
                </div>
            </>
        );
    }

    // Ajuste: pasoActual para contenido y número de paso resumen
    let requiereDireccion = metodoSeleccionado && metodoSeleccionado.nombre.toLowerCase().includes('domicilio');
    let pasoVisual = paso;
    let pasoResumenNum = 3;
    if (!requiereDireccion) {
        if (paso === 3) pasoVisual = 2;
        pasoResumenNum = 2;
    }

    // --- Animación de transición de pasos ---
    function PasoAnimado() {
        let contenido;
        if (pasoVisual === 1) contenido = <PasoMetodoEntrega />;
        else if (requiereDireccion && pasoVisual === 2) contenido = <PasoDireccion />;
        else contenido = <PasoResumen pasoResumen={pasoResumenNum} />;
        return (
            <SwitchTransition mode="out-in">
                <CSSTransition
                    key={pasoVisual + (requiereDireccion ? '-d' : '-r')}
                    timeout={300}
                    classNames="wizard-step-fade"
                    unmountOnExit
                >
                    <div>{contenido}</div>
                </CSSTransition>
            </SwitchTransition>
        );
    }

    if (cargandoMetodos) return <SpinnerInterno />;
    if (errorMetodos) return <div style={{color:'red', padding: 32, textAlign:'center'}}>Error: {errorMetodos}</div>;
    if (cargando) return <SpinnerInterno />;
    if (error) return <div style={{color:'red', padding: 32, textAlign:'center'}}>Error: {error}</div>;

    return (
        <div style={{padding: 24, minWidth: 340, maxWidth: 440, background:'#fff', borderRadius:18, boxShadow:'0 6px 32px 0 #0002', position:'relative'}}>
            {/* Botón cerrar (X) rojo, circular, medio fuera del wizard */}
            <button
                aria-label="Cerrar wizard"
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: -22,
                    right: -22,
                    width: 44,
                    height: 44,
                    background: '#fff',
                    border: '2.5px solid #e74c3c',
                    borderRadius: '50%',
                    boxShadow: '0 2px 8px #0002',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    color: '#e74c3c',
                    cursor: 'pointer',
                    zIndex: 10,
                    transition: 'background 0.18s, color 0.18s, border 0.18s',
                }}
                onMouseOver={e => {
                    e.currentTarget.style.background = '#e74c3c';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.border = '2.5px solid #e74c3c';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.background = '#fff';
                    e.currentTarget.style.color = '#e74c3c';
                    e.currentTarget.style.border = '2.5px solid #e74c3c';
                }}
            >
                ×
            </button>
            {/* Barra de pasos dinámica arriba */}
            <BarraPasos />
            {/* Contenido animado según paso visual */}
            <PasoAnimado />
        </div>
    );
}