document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Configuración de datos
    const CONFIG = {
        PRODUCTOS: {
            POSPAGO: { nombre: "Pospago", valor: 15000, pago: 0.85, comision: 0.10 },
            B2B: { nombre: "B2B", valor: 50000, pago: 0.90, comision: 0.12 },
            HOGAR: { nombre: "Hogar", valor: 25000, pago: 0.80, comision: 0.15 },
            PREPAGO: { nombre: "Prepago", valor: 2000, pago: 1.00, comision: 0.05 }
        }
    };

    // 2. Referencia al botón
    const boton = document.getElementById('btn-calcular');

    // 3. Función de cálculo
    if (boton) {
        boton.onclick = function() {
            let acumuladoTotal = 0;
            let listaHtml = "<ul>";

            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const input = document.getElementById(`input-${key}`);
                const cantidad = parseFloat(input.value) || 0;

                // Cálculo según tu Excel: Unidades * Valor * %Pago * %Comisión
                const resultado = cantidad * p.valor * p.pago * p.comision;
                acumuladoTotal += resultado;

                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:5px 0;">
                                <span>${p.nombre}:</span> 
                                <strong>$${resultado.toLocaleString('es-AR', {minimumFractionDigits:2})}</strong>
                              </li>`;
            }

            listaHtml += "</ul>";

            // Inyectar resultados en el HTML
            document.getElementById('detalle-productos').innerHTML = listaHtml;
            document.getElementById('total-variable').innerText = "$" + acumuladoTotal.toLocaleString('es-AR', {minimumFractionDigits:2});
        };
        console.log("Sistema cargado y listo.");
    } else {
        console.error("Error crítico: No se encontró el botón de cálculo.");
    }
});
