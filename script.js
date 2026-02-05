// script.js

const calcular = () => {
    try {
        let totalVariable = 0;
        let htmlDetalle = "<ul>";

        for (const clave in CONFIG.PRODUCTOS) {
            const producto = CONFIG.PRODUCTOS[clave];
            const inputElement = document.getElementById(`input-${clave}`);
            
            if (!inputElement) {
                console.error(`No se encontró el input: input-${clave}`);
                continue;
            }

            const cantidad = parseFloat(inputElement.value) || 0;

            // Fórmulas
            const ventaPonderada = cantidad * producto.valorPromedio * producto.porcentajePago;
            const comisionProducto = ventaPonderada * producto.comisionNivel;

            totalVariable += comisionProducto;

            htmlDetalle += `
                <li style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px solid #eee;">
                    <span>${producto.nombre}:</span>
                    <strong>$${comisionProducto.toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong>
                </li>`;
        }

        htmlDetalle += "</ul>";

        document.getElementById('detalle-productos').innerHTML = htmlDetalle;
        document.getElementById('total-variable').innerText = `$${totalVariable.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
        
    } catch (error) {
        alert("Error en el cálculo. Revisá la consola (F12)");
        console.error(error);
    }
};

// Asignar el evento al botón
document.getElementById('btn-calcular').onclick = calcular;
