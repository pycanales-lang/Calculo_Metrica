document.addEventListener('DOMContentLoaded', function() {
    
    const CONFIG = {
        PRODUCTOS: {
            B2B:     { nombre: "B2B",     valor: 140000, pago: 0.65 },
            HOGAR:   { nombre: "Hogar",   valor: 140000, pago: 0.65 },
            POSPAGO: { nombre: "Pospago", valor: 75000,  pago: 0.65 },
            PREPAGO: { nombre: "Prepago", valor: 25000,  pago: 0.60 }
        },
        // TABLA STAFF: Porcentajes fijos por nivel (Mantenido según lo acordado)
        NIVELES_STAFF: {
            "M0": 0.15, "M1": 0.15, "M2": 0.20, "M3": 0.30, "M4": 0.45
        },
        // TABLA CORRETAJE: Pesos dinámicos [Nivel 1, Nivel 2, Nivel 3]
        PESOS_CORRETAJE: {
            "M0": [0.30, 0.50, 0.50],
            "M1": [0.30, 0.50, 0.50],
            "M2": [0.30, 0.50, 0.75],
            "M3": [0.40, 0.50, 0.75],
            "M4": [0.50, 0.50, 1]
        }
    };

    // Función de viático progresivo para Corretaje
    function calcularViaticoCorretaje(productividad) {
        if (productividad < 6) return 0;
        if (productividad >= 15) return 1700000;
        return 800000 + ((productividad - 6) * 100000);
    }

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            let acumuladoVariable = 0;
            let listaHtml = "<ul>";
            
            const esquema = document.getElementById('select-esquema').value;
            const nivelSeleccionado = document.getElementById('select-nivel').value;

            // Captura de valores de entrada
            const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
            const vHogar = parseFloat(document.getElementById('input-HOGAR').value) || 0;
            const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
            const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;
            
            const prodTotal = vB2B + vHogar + vPos + vPre;
            const tieneLlave = (vB2B > 0 || vHogar > 0);

            // DETERMINAR TASA (Lógica separada por esquema)
            let tasaComision = 0;
            if (esquema === "STAFF") {
                tasaComision = CONFIG.NIVELES_STAFF[nivelSeleccionado];
            } else {
                // Para Corretaje, el peso depende de la Prod. Total (Nivel 1, 2 o 3)
                let idx = 0; // Nivel 1 (1-8)
                if (prodTotal >= 9 && prodTotal <= 15) idx = 1; // Nivel 2 (9-15)
                else if (prodTotal >= 16) idx = 2; // Nivel 3 (16+)
                tasaComision = CONFIG.PESOS_CORRETAJE[nivelSeleccionado][idx];
            }

            // CÁLCULO DE PRODUCTOS
            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const cantidad = parseFloat(document.getElementById(`input-${key}`).value) || 0;
                let resultado = 0;

                // Lógica de habilitación
                // En Staff o Corretaje, B2B/Hogar siempre comisionan.
                // Pospago/Prepago solo si hay B2B o Hogar.
                if (key === "B2B" || key === "HOGAR") {
                    resultado = Math.round(cantidad * p.valor * p.pago * tasaComision);
                } else {
                    resultado = tieneLlave ? Math.round(cantidad * p.valor * p.pago * tasaComision) : 0;
                }

                acumuladoVariable += resultado;
                
                // Formateo visual
                let extraInfo = (cantidad > 0 && !tieneLlave && (key === "POSPAGO" || key === "PREPAGO")) 
                                ? ' <span style="color:red; font-size:10px;">(Falta B2B/Home)</span>' 
                                : '';

                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:8px 0;">
                                <span>${p.nombre}${extraInfo}:</span> 
                                <strong>Gs. ${resultado.toLocaleString('es-PY')}</strong>
                              </li>`;
            }

            // VIÁTICOS (Solo Corretaje)
            let viatico = 0;
            if (esquema === "CORRETAJE") {
                viatico = calcularViaticoCorretaje(prodTotal);
                if (viatico > 0) {
                    listaHtml += `<li style="display:flex; justify-content:space-between; padding:8px 0; color: #2980b9; font-weight: bold; border-top: 2px solid #3498db;">
                                    <span>Viático (Escala ${prodTotal}):</span> 
                                    <strong>Gs. ${viatico.toLocaleString('es-PY')}</strong>
                                  </li>`;
                }
            }

            listaHtml += "</ul>";
            const totalFinal = acumuladoVariable + viatico;

            // Inyectar en pantalla
            document.getElementById('detalle-productos').innerHTML = 
                `<p style="font-size: 0.8rem; background: #eee; padding: 5px; border-radius: 4px;">
                    <b>${esquema}</b> | Peso: ${(tasaComision*100).toFixed(0)}% | Prod: ${prodTotal}
                </p>` + listaHtml;
            
            document.getElementById('total-variable').innerText = "Gs. " + totalFinal.toLocaleString('es-PY');
        };
    }
});
