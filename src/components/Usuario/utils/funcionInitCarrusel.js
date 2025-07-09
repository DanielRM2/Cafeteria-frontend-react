let indiceImagenActual = 0;          // Guarda el índice de la imagen que se está mostrando
let intervaloCarrusel = null;       // Almacena el intervalo del carrusel automático

export function iniciarCarrusel() {
    const imagenes = document.querySelectorAll('.carousel-item'); // Selecciona todas las imágenes del carrusel

    // Función para mostrar una imagen específica
    function mostrarImagen(indice) {
        // Asegura que el índice esté dentro del rango (si es negativo o mayor, lo ajusta)
        const indiceSeguro = (indice + imagenes.length) % imagenes.length;

        // Oculta la imagen actual
        imagenes[indiceImagenActual]?.classList.remove('active');

        // Actualiza el índice y muestra la nueva imagen
        indiceImagenActual = indiceSeguro;
        imagenes[indiceImagenActual]?.classList.add('active');
    }

    // Función para pasar a la siguiente imagen
    function siguienteImagen() {
        mostrarImagen(indiceImagenActual + 1);
    }

    // Función para iniciar el cambio automático de imágenes
    function inicioAutomatico(intervalo = 8000) { // Por defecto, cambia cada 6 segundos
        // Limpia el intervalo si ya existe (para evitar múltiples intervalos)
        if (intervaloCarrusel) {
            clearInterval(intervaloCarrusel);
        }

        // Muestra la primera imagen inmediatamente
        mostrarImagen(0);

        // Configura el intervalo para cambiar imágenes automáticamente
        intervaloCarrusel = setInterval(siguienteImagen, intervalo);
    }

    // Inicia el carrusel automáticamente al cargar
    inicioAutomatico();
}