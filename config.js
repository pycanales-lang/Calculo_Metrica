document.addEventListener('DOMContentLoaded', () => {
    const boton = document.getElementById('btn-calcular');

    boton.addEventListener('click', () => {
        let totalVariable = 0;
        let htmlDetalle = "<ul>";

        for (const clave in CONFIG.PRODUCTOS) {
            const producto = CONFIG.PRODUCTOS[clave];
            
            // Buscamos el input por su ID (ej: input-POSPAGO)
            const inputElement = document.getElementById(`input-${clave}`);
            const cantidad = parseFloat(inputElement.value) || 0;

            // Fórmulas de tu Excel
            const ventaPonderada = cantidad * producto.valorPromedio * producto.porcentajePago;
            const comisionProducto = ventaPonderada * producto.comisionNivel;

            totalVariable += comisionProducto;

            // Agregamos fila al detalle
            htmlDetalle += `
                <li>
                    <span>${producto.nombre}:</span>
                    <span>$${comisionProducto.toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
                </li>`;
        }

        htmlDetalle += "</ul>";

        // Inyectamos resultados
        document.getElementById('detalle-productos').innerHTML = htmlDetalle;
        document.getElementById('total-variable').innerText = `$${totalVariable.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    });
});
