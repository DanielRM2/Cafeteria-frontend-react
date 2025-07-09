import { useState, useEffect } from 'react';
import { fetchStock } from '../utils/fetchStock.js';

export function useCarrito() {
    const [carrito, setCarrito] = useState(() => {
        const almacenado = localStorage.getItem("carrito");
        return almacenado ? JSON.parse(almacenado) : [];
    });

    const [stockMap, setStockMap] = useState({});

    useEffect(() => {
        async function cargarStock() {
            const nuevoStockMap = {};
            for (const producto of carrito) {
                try {
                    const stock = await fetchStock(producto.idProducto);
                    nuevoStockMap[producto.idProducto] = stock;
                } catch {
                    nuevoStockMap[producto.idProducto] = 0;
                }
            }
            setStockMap(nuevoStockMap);
        }
        if (carrito.length > 0) cargarStock();
        else setStockMap({});
    }, [carrito]);

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (producto) => {
        setCarrito(prev => {
            const existente = prev.find(p => p.idProducto === producto.idProducto);
            const stock = stockMap[producto.idProducto] ?? 99;
            if (existente) {
                if (existente.cantidad + 1 > stock) {
                    alert(`Solo hay ${stock} unidades disponibles para este producto.`);
                    return prev;
                }
                return prev.map(p => p.idProducto === producto.idProducto ? { ...p, cantidad: p.cantidad + 1 } : p);
            }
            if (stock < 1) {
                alert("Producto sin stock disponible.");
                return prev;
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const eliminarDelCarrito = (idProducto) => {
        setCarrito(prev => prev.filter(p => p.idProducto !== idProducto));
    };

    const actualizarCantidad = (idProducto, cantidad) => {
        const stock = stockMap[idProducto] ?? 99;
        if (isNaN(cantidad)) return; // No actualizar si es NaN
        if (cantidad <= 0) {
            // Si llega a 0 o menos, elimina el producto del carrito
            setCarrito(prev => prev.filter(p => p.idProducto !== idProducto));
            return;
        }
        if (cantidad > stock) {
            alert(`Solo hay ${stock} unidades disponibles para este producto.`);
            return;
        }
        setCarrito(prev =>
            prev.map(p => p.idProducto === idProducto ? { ...p, cantidad: cantidad } : p)
        );
    };

    const limpiarCarrito = () => setCarrito([]);

    const totalCarrito = carrito.reduce((total, p) => total + p.precio * p.cantidad, 0);

    const cantidadTotal = carrito.reduce((total, p) => total + p.cantidad, 0);

    return {
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        actualizarCantidad,
        limpiarCarrito,
        totalCarrito,
        cantidadTotal,
        stockMap
    };
}
