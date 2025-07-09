export async function fetchStock(idProducto) {
    const res = await fetch(`http://localhost:8080/api/inventario/${idProducto}`);
    if (!res.ok) throw new Error("Error al consultar inventario");
    const data = await res.json();
    return data.cantidadDisponible;
}