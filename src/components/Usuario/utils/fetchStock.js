import { fetchDataSimple } from "./api.js"; // Ajusta el path según tu estructura

export async function fetchStock(idProducto) {
    const data = await fetchDataSimple(`/api/inventario/${idProducto}`);
    return data.cantidadDisponible;
}
