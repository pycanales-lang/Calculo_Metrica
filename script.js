document.addEventListener('DOMContentLoaded', function() {
    
    const CONFIG = {
        PRODUCTOS: {
            B2B:     { nombre: "B2B",     valor: 140000, pago: 0.65 },
            HOGAR:   { nombre: "Hogar",   valor: 140000, pago: 0.65 },
            POSPAGO: { nombre: "Pospago", valor: 75000,  pago: 0.65 },
            PREPAGO: { nombre: "Prepago", valor: 25000,  pago: 0.60 }
        },
        NIVELES_STAFF: {
            "M0": 0.15, "M1": 0.15, "M2": 0.20, "M3": 0.30, "M4": 0.45
        },
        // TABLA CORRETAJE: [Nivel 1 (1-8), Nivel 2 (9-15), Nivel 3 (16+)]
        PESOS_CORRETAJE: {
            "M0": [0.30, 0.50, 0.50],
            "M1": [0.30, 0.50, 0.50],
            "M2": [0.30, 0.50, 0.75],
            "M3": [0.40, 0.50, 0.75],
            "M4": [0.50, 0.50, 1.00]
        }
    };

    // Viático basado SOLO en la productividad de B2B + Hogar
    function calcularViatico(prodEscala) {
        if (prodEscala < 6) return 0;
        if (prodEscala >= 15) return 1700000;
        return 800000 + ((prodEscala - 6) * 100000);
    }

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            let acumuladoVariable = 0;
            let listaHtml = "<ul>";
            
            const esquema = document.getElementById('select-esquema').value;
            const nivelSel = document.getElementById('select-nivel').value;

            const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
            const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
            
            // LA ESCALA ES SOLO B2B + HOME
            const prodEscala = vB2B + vHog;
            const tieneLlaveCorretaje = (prodEscala > 0);

            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const cantidad = parseFloat(document.getElementById(`input-${key}`).value) || 0;
                let tasa = 0;
                let resultado = 0;

                if (esquema === "STAFF") {
                    tasa = CONFIG.NIVELES_STAFF[nivelSel];
                    resultado = Math.round(cantidad * p.valor * p.pago * tasa);
                } else {
                    // CORRETAJE: El peso depende de la Escala (B2B + Hogar)
                    let idx = 0; 
                    if (prodEscala >= 9 && prodEscala <= 15) idx = 1;
                    else if (prodEscala >= 16) idx = 2;
                    
                    tasa = CONFIG.PESOS_CORRETAJE[nivelSel][idx];

                    if (key === "B2B" || key === "HOGAR") {
                        resultado = Math.round(cantidad * p.valor * p.pago * tasa);
                    } else {
                        // Solo suma si B2B + Hogar > 0
                        resultado = tieneLlaveCorretaje ? Math.round(cantidad * p.valor * p.pago * tasa) : 0;
                    }
                }

                acumuladoVariable += resultado;
                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:8px 0;">
                                <span>${p.nombre}:</span> 
                                <strong>Gs. ${resultado.toLocaleString('es-PY')}</strong>
                              </li>`;
            }

            let viaticoFinal = 0;
            if (esquema === "CORRETAJE") {
                viaticoFinal = calcularViatico(prodEscala);
                if (viaticoFinal > 0) {
                    listaHtml += `<li style="display:flex; justify-content:space-between; padding:8px 0; color: #2980b9; font-weight: bold; border-top: 2px solid #3498db; margin-top: 5px;">
                                    <span>Viático (Escala B2B+Home: ${prodEscala}):</span> 
                                    <strong>Gs. ${viaticoFinal.toLocaleString('es-PY')}</strong>
                                  </li>`;
                }
            }

            listaHtml += "</ul>";
            const totalGral = acumuladoVariable + viaticoFinal;

            document.getElementById('detalle-productos').innerHTML = 
                `<p style="font-size: 0.8rem; background: #f8f9fa; padding: 8px; border-radius: 4px; border-left: 4px solid #3498db;">
                    <b>Modo:</b> ${esquema} | <b>Escala (B2B+Home):</b> ${prodEscala} | <b>Peso:</b> ${(tasa*100).toFixed(0)}%
                </p>` + listaHtml;
            
            document.getElementById('total-variable').innerText = "Gs. " + totalGral.toLocaleString('es-PY');
        };
    }
});
