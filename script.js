document.addEventListener('DOMContentLoaded', function() {
    
    const CONFIG = {
        PRODUCTOS: {
            POSPAGO: { nombre: "Pospago", valor: 150000, pago: 0.85, comisionBase: 0.10 },
            B2B: { nombre: "B2B", valor: 500000, pago: 0.90, comisionBase: 0.12 },
            HOGAR: { nombre: "Hogar", valor: 250000, pago: 0.80, comisionBase: 0.15 },
            PREPAGO: { nombre: "Prepago", valor: 20000, pago: 1.00, comisionBase: 0.05 }
        },
        // Factores multiplicadores por nivel
        NIVELES: {
            "M0": 1.0,
            "M1": 1.1,
            "M2": 1.2,
            "M3": 1.3,
            "M4": 1.5
        }
    };

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            let acumuladoTotal = 0;
            let listaHtml = "<ul>";
            
            // Obtenemos el nivel seleccionado
            const nivelSeleccionado = document.getElementById('select-nivel').value;
            const factorNivel = CONFIG.NIVELES[nivelSeleccionado];

            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const input = document.getElementById(`input-${key}`);
                const cantidad = parseFloat(input.value) || 0;

                // NUEVA LÓGICA: Se incluye el factorNivel
                // Venta Ponderada * Comisión Base * Factor de Nivel
                const resultado = Math.round(cantidad * p.valor * p.pago * p.comisionBase * factorNivel);
                acumuladoTotal += resultado;

                const resultadoFmt = resultado.toLocaleString('es-PY', { minimumFractionDigits: 0 });

                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:5px 0;">
                                <span>${p.nombre} (${nivelSeleccionado}):</span> 
                                <strong>Gs. ${resultadoFmt}</strong>
                              </li>`;
            }

            listaHtml += "</ul>";
            const totalFmt = acumuladoTotal.toLocaleString('es-PY', { minimumFractionDigits: 0 });

            document.getElementById('detalle-productos').innerHTML = listaHtml;
            document.getElementById('total-variable').innerText = "Gs. " + totalFmt;
        };
    }
});
