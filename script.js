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
        },
        VIATICO_CORRETAJE: 1200000 // Monto extra para Corretaje
    };

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            let acumuladoVariable = 0;
            let listaHtml = "<ul>";
            
            const esquema = document.getElementById('select-esquema').value;
            const nivelSeleccionado = document.getElementById('select-nivel').value;
            const tasaComision = CONFIG.NIVELES[nivelSeleccionado];

            // 1. Calcular Variable por producto
            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const input = document.getElementById(`input-${key}`);
                const productividad = parseFloat(input.value) || 0;

                const resultado = Math.round((productividad * p.valor * p.pago) * tasaComision);
                acumuladoVariable += resultado;

                const resultadoFmt = resultado.toLocaleString('es-PY', { minimumFractionDigits: 0 });

                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:8px 0;">
                                <span>${p.nombre}:</span> 
                                <strong>Gs. ${resultadoFmt}</strong>
                              </li>`;
            }

            // 2. Lógica de Viático
            let viatico = 0;
            if (esquema === "CORRETAJE") {
                viatico = CONFIG.VIATICO_CORRETAJE;
                listaHtml += `<li style="display:flex; justify-content:space-between; padding:8px 0; color: #2980b9;">
                                <span>Viático Fijo:</span> 
                                <strong>Gs. ${viatico.toLocaleString('es-PY')}</strong>
                              </li>`;
            }

            listaHtml += "</ul>";

            // 3. Total Final (Variable + Viático)
            const totalFinal = acumuladoVariable + viatico;
            
            const totalFmt = totalFinal.toLocaleString('es-PY', { minimumFractionDigits: 0 });

            document.getElementById('detalle-productos').innerHTML = listaHtml;
            document.getElementById('total-variable').innerText = "Gs. " + totalFmt;
        };
    }
});
