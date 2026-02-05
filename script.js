document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Configuración de datos (Valores en Guaraníes)
    const CONFIG = {
        PRODUCTOS: {
            POSPAGO: { nombre: "Pospago", valor: 150000, pago: 0.85, comision: 0.10 },
            B2B: { nombre: "B2B", valor: 500000, pago: 0.90, comision: 0.12 },
            HOGAR: { nombre: "Hogar", valor: 250000, pago: 0.80, comision: 0.15 },
            PREPAGO: { nombre: "Prepago", valor: 20000, pago: 1.00, comision: 0.05 }
        }
    };

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            let acumuladoTotal = 0;
            let listaHtml = "<ul>";

            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const input = document.getElementById(`input-${key}`);
                const cantidad = parseFloat(input.value) || 0;

                // Cálculo: Unidades * Valor * %Pago * %Comisión
                // Usamos Math.round para asegurar que no haya decimales ocultos
                const resultado = Math.round(cantidad * p.valor * p.pago * p.comision);
                acumuladoTotal += resultado;

                // Formateo en Gs. sin decimales
                const resultadoFmt = resultado.toLocaleString('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:5px 0;">
                                <span>${p.nombre}:</span> 
                                <strong>Gs. ${resultadoFmt}</strong>
                              </li>`;
            }

            listaHtml += "</ul>";

            const totalFmt = acumuladoTotal.toLocaleString('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

            document.getElementById('detalle-productos').innerHTML = listaHtml;
            document.getElementById('total-variable').innerText = "Gs. " + totalFmt;
        };
    }
});
