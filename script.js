// script.js
document.getElementById('btn-calcular').addEventListener('click', () => {
    let totalVariable = 0;
    let htmlDetalle = "<ul>";

    // Recorremos los productos definidos en el CONFIG
    for (const clave in CONFIG.PRODUCTOS) {
        const producto = CONFIG.PRODUCTOS[clave];
        
        // 1. Obtener cantidad vendida desde el HTML
        const cantidad = parseFloat(document.getElementById(`input-${clave}`).value) || 0;

        // 2. Aplicar lógica de negocio
        const ventaPonderada = cantidad * producto.valorPromedio * producto.porcentajePago;
        const comisionProducto = ventaPonderada * producto.comisionNivel;

        // 3. Acumular al total
        totalVariable += comisionProducto;

        // 4. Formatear detalle para el usuario
        htmlDetalle += `<li>${producto.nombre}: $${comisionProducto.toLocaleString('es-AR')}</li>`;
    }

    htmlDetalle += "</ul>";

    // Mostrar resultados en el HTML
    document.getElementById('detalle-productos').innerHTML = htmlDetalle;
    document.getElementById('total-variable').innerText = `$${totalVariable.toLocaleString('es-AR')}`;
});
