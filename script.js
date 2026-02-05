document.addEventListener('DOMContentLoaded', function() {
    
    const CONFIG = {
        PRODUCTOS: {
            B2B:     { nombre: "B2B",     valor: 140000, pago: 0.65 },
            HOGAR:   { nombre: "Hogar",   valor: 140000, pago: 0.65 },
            POSPAGO: { nombre: "Pospago", valor: 75000,  pago: 0.65 },
            PREPAGO: { nombre: "Prepago", valor: 25000,  pago: 0.60 }
        },
        // Niveles diferenciados según tu Excel
        NIVELES_STAFF: {
            "M0": 0.15, "M1": 0.15, "M2": 0.20, "M3": 0.30, "M4": 0.45
        },
        NIVELES_CORRETAJE: {
            "M0": 0.30, "M1": 0.30, "M2": 0.30, "M3": 0.40, "M4": 0.50 // Ajustar según los pesos reales de tu tabla de corretaje
        },
        VIATICO_CORRETAJE: 1200000 
    };

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            let acumuladoVariable = 0;
            let listaHtml = "<ul>";
            
            const esquema = document.getElementById('select-esquema').value;
            const nivelSeleccionado = document.getElementById('select-nivel').value;
            
            // Elegir la tabla de niveles correcta
            const tablaNiveles = (esquema === "STAFF") ? CONFIG.NIVELES_STAFF : CONFIG.NIVELES_CORRETAJE;
            const tasaComision = tablaNiveles[nivelSeleccionado];

            // Capturar ventas llave para la validación
            const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
            const vHogar = parseFloat(document.getElementById('input-HOGAR').value) || 0;
            
            // Condición: ¿Tiene ventas en B2B o Hogar?
            const tieneLlave = (vB2B > 0 || vHogar > 0);

            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const input = document.getElementById(`input-${key}`);
                const cantidad = parseFloat(input.value) || 0;

                let resultado = 0;

                // LÓGICA DE HABILITACIÓN:
                // Si es B2B o Hogar, calcula siempre.
                // Si es Pospago o Prepago, solo calcula si tieneLlave es verdadero.
                if (key === "B2B" || key === "HOGAR") {
                    resultado = Math.round((cantidad * p.valor * p.pago) * tasaComision);
                } else {
                    if (tieneLlave) {
                        resultado = Math.round((cantidad * p.valor * p.pago) * tasaComision);
                    } else {
                        resultado = 0; // No habilita comisión para Pospago/Prepago
                    }
                }

                acumuladoVariable += resultado;
                const resultadoFmt = resultado.toLocaleString('es-PY', { minimumFractionDigits: 0 });

                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:8px 0; ${resultado === 0 && cantidad > 0 ? 'color: red;' : ''}">
                                <span>${p.nombre}: ${resultado === 0 && cantidad > 0 ? '(Requiere B2B/Hogar)' : ''}</span> 
                                <strong>Gs. ${resultadoFmt}</strong>
                              </li>`;
            }

            // Viático
            let viatico = 0;
            if (esquema === "CORRETAJE") {
                viatico = CONFIG.VIATICO_CORRETAJE;
                listaHtml += `<li style="display:flex; justify-content:space-between; padding:8px 0; color: #2980b9; font-weight: bold;">
                                <span>Viático Fijo:</span> 
                                <strong>Gs. ${viatico.toLocaleString('es-PY')}</strong>
                              </li>`;
            }

            listaHtml += "</ul>";
            const totalFinal = acumuladoVariable + viatico;

            document.getElementById('detalle-productos').innerHTML = listaHtml;
            document.getElementById('total-variable').innerText = "Gs. " + totalFinal.toLocaleString('es-PY');
        };
    }
});
