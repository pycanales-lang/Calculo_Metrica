// CONFIGURACIÓN DE NEGOCIO (Antes en config.js)
const CONFIG = {
    PRODUCTOS: {
        POSPAGO: {
            nombre: "Pospago",
            valorPromedio: 15000,
            porcentajePago: 0.85,
            comisionNivel: 0.10
        },
        B2B: {
            nombre: "B2B",
            valorPromedio: 50000,
            porcentajePago: 0.90,
            comisionNivel: 0.12
        },
        HOGAR: {
            nombre: "Hogar",
            valorPromedio: 25000,
            porcentajePago: 0.80,
            comisionNivel: 0.15
        },
        PREPAGO: {
            nombre: "Prepago",
            valorPromedio: 2000,
            porcentajePago: 1.00,
            comisionNivel: 0.05
        }
    }
};

// FUNCIÓN DE CÁLCULO
const calcular = () => {
    let totalVariable = 0;
    let htmlDetalle = "<ul>";

    try {
        for (const clave in CONFIG.PRODUCTOS) {
            const producto = CONFIG.PRODUCTOS[clave];
            const inputElement = document.getElementById(`input-${clave}`);
            
            if (inputElement) {
                const cantidad = parseFloat(inputElement.value) || 0;

                // Lógica: Ventas * Valor * %Pago
                const ventaPonderada = cantidad * producto.valorPromedio * producto.porcentajePago;
                // Comisión: Venta Ponderada * %Comisión
                const comisionProducto = ventaPonderada * producto.comisionNivel;

                totalVariable += comisionProducto;

                htmlDetalle += `
                    <li style="display: flex; justify-content: space-between; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px;">
                        <span>${producto.nombre}:</span>
                        <strong>$${comisionProducto.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                    </li>`;
            }
        }

        htmlDetalle += "</ul>";

        // Mostrar en pantalla
        document.getElementById('detalle-productos').innerHTML = htmlDetalle;
        document.getElementById('total-variable').innerText = `$${totalVariable.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        
        console.log("Cálculo realizado con éxito.");
    } catch (err) {
        console.error("Error en el proceso:", err);
    }
};

// ASIGNACIÓN DEL EVENTO
window.onload = () => {
    const boton = document.getElementById('btn-calcular');
    if (boton) {
        boton.onclick = calcular;
    }
};
