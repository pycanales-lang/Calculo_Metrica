document.addEventListener('DOMContentLoaded', function() {
    
    const CONFIG = {
        PRODUCTOS: {
            B2B:     { nombre: "B2B",     valor: 140000, pago: 0.65 },
            HOGAR:   { nombre: "Hogar",   valor: 140000, pago: 0.65 },
            POSPAGO: { nombre: "Pospago", valor: 75000,  pago: 0.65 },
            PREPAGO: { nombre: "Prepago", valor: 25000,  pago: 0.60 }
        },
        NIVELES: {
            "M0": 0.15,
            "M1": 0.15,
            "M2": 0.20,
            "M3": 0.30,
            "M4": 0.45
        }
    };

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            let acumuladoTotal = 0;
            let listaHtml = "<ul>";
            
            const nivelSeleccionado = document.getElementById('select-nivel').value;
            const tasaComision = CONFIG.NIVELES[nivelSeleccionado];

            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const input = document.getElementById(`input-${key}`);
                
                // Esta es la "PRODUCTIVIDAD" (Cantidad de ventas ingresadas)
                const productividad = parseFloat(input.value) || 0;

                // FÓRMULA CORREGIDA: (PRODUCTIVIDAD * VALOR PROMEDIO * % PAGOS) * NIVEL
                const resultado = Math.round((productividad * p.valor * p.pago) * tasaComision);
                
                acumuladoTotal += resultado;

                const resultadoFmt = resultado.toLocaleString('es-PY', { minimumFractionDigits: 0 });

                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:8px 0;">
                                <span>${p.nombre}:</span> 
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
