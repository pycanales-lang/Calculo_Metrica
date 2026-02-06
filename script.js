document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        PRODUCTOS: {
            B2B: { v: 140000, p: 0.65 },
            HOGAR: { v: 140000, p: 0.65 },
            POSPAGO: { v: 75000, p: 0.65 },
            PREPAGO: { v: 25000, p: 0.60 }
        },
        // Tasas según tu imagen de Staff
        NIVELES_STAFF: { "M0": 0.15, "M1": 0.15, "M2": 0.20, "M3": 0.30, "M4": 0.45 },
        // Pesos según tu imagen de Corretaje (Escala 1-8, 9-15, 16-25)
        PESOS_CORRETAJE: {
            "M0": [0.30, 0.50, 0.50], 
            "M1": [0.30, 0.50, 0.50],
            "M2": [0.30, 0.50, 0.75], 
            "M3": [0.40, 0.50, 0.75], 
            "M4": [0.50, 0.50, 1.00]
        }
    };

    const btnCalcular = document.getElementById('btn-calcular');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const grid = document.getElementById('grid-niveles');
    const resultadosArea = document.getElementById('resultados-area');

    if (btnLimpiar) {
        btnLimpiar.onclick = () => {
            document.querySelectorAll('input').forEach(i => i.value = "");
            if (resultadosArea) resultadosArea.classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    }

    if (btnCalcular) {
        btnCalcular.onclick = function() {
            // Captura de valores con fallback a 0
            const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
            const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
            const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
            const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;
            const esquema = document.getElementById('select-esquema').value;

            // Lógica de Escala (B2B + HOME)
            const escalaEscuela = vB2B + vHog;
            const tieneLlave = (escalaEscuela > 0);
            
            let sumatoriaVariableNiveles = 0;
            grid.innerHTML = ""; 

            // Generar tarjetas por cada nivel
            const niveles = ["M0", "M1", "M2", "M3", "M4"];
            
            niveles.forEach(nivel => {
                let tasa = 0;
                if (esquema === "STAFF") {
                    tasa = CONFIG.NIVELES_STAFF[nivel];
                } else {
                    // Determinar columna de peso en Corretaje por escala
                    let idx = 0;
                    if (escalaEscuela >= 16) idx = 2;
                    else if (escalaEscuela >= 9) idx = 1;
                    tasa = CONFIG.PESOS_CORRETAJE[nivel][idx];
                }

                // Cálculo de productos base (B2B y Hogar siempre pagan si hay venta)
                let varB2B = Math.round(vB2B * CONFIG.PRODUCTOS.B2B.v * CONFIG.PRODUCTOS.B2B.p * tasa);
                let varHog = Math.round(vHog * CONFIG.PRODUCTOS.HOGAR.v * CONFIG.PRODUCTOS.HOGAR.p * tasa);
                
                // Pospago y Prepago dependen de la llave (B2B+Home > 0) en Corretaje
                let varPos = 0;
                let varPre = 0;
                
                if (esquema === "STAFF" || tieneLlave) {
                    varPos = Math.round(vPos * CONFIG.PRODUCTOS.POSPAGO.v * CONFIG.PRODUCTOS.POSPAGO.p * tasa);
                    varPre = Math.round(vPre * CONFIG.PRODUCTOS.PREPAGO.v * CONFIG.PRODUCTOS.PREPAGO.p * tasa);
                }

                let subtotalNivel = varB2B + varHog + varPos + varPre;
                sumatoriaVariableNiveles += subtotalNivel;

                // Crear elemento visual para el nivel
                const div = document.createElement('div');
                div.className = 'nivel-box';
                div.innerHTML = `
                    <div class="lvl-info">
                        <span>NIVEL ${nivel} | PESO: ${(tasa*100).toFixed(0)}%</span>
                        <strong>VARIABLE: Gs. ${subtotalNivel.toLocaleString('es-PY')}</strong>
                    </div>
                `;
                grid.appendChild(div);
            });

            // Cálculo de Viático Único (Corretaje)
            let viaticoCalculado = 0;
            if (esquema === "CORRETAJE") {
                const tablaViatico = {
                    6: 800000, 7: 900000, 8: 1000000, 9: 900000, 
                    12: 1000000, 15: 1200000, 16: 1200000, 20: 1500000, 25: 1700000
                };
                let puntosEscala = Object.keys(tablaViatico).map(Number).sort((a,b) => a-b);
                let nivelLogrado = puntosEscala.filter(p => p <= escalaEscuela).pop();
                viaticoCalculado = nivelLogrado ? tablaViatico[nivelLogrado] : 0;
            }

            // TOTAL FINAL (Suma de todos los niveles + Viático)
            const montoGranTotal = sumatoriaVariableNiveles + viaticoCalculado;

            const totalCard = document.createElement('div');
            totalCard.className = 'grand-total-card';
            totalCard.innerHTML = `
                <span class="grand-total-label">SISTEMA TOTAL (FIJO + VAR PROM)</span>
                <div class="grand-total-amount">Gs. ${montoGranTotal.toLocaleString('es-PY')}</div>
                ${viaticoCalculado > 0 ? `<div style="color:var(--accent); font-size:11px; margin-top:5px;">VIÁTICO INCLUIDO: Gs. ${viaticoCalculado.toLocaleString('es-PY')}</div>` : ''}
            `;
            grid.appendChild(totalCard);

            if (resultadosArea) resultadosArea.classList.remove('hidden');
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        };
    }
});
