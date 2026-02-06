document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        PRODUCTOS: {
            B2B: { v: 140000, p: 0.65 },
            HOGAR: { v: 140000, p: 0.65 },
            POSPAGO: { v: 75000, p: 0.65 },
            PREPAGO: { v: 25000, p: 0.60 }
        },
        NIVELES_STAFF: { "M0": 0.15, "M1": 0.15, "M2": 0.20, "M3": 0.30, "M4": 0.45 },
        PESOS_CORRETAJE: {
            "M0": [0.30, 0.50, 0.50], "M1": [0.30, 0.50, 0.50],
            "M2": [0.30, 0.50, 0.75], "M3": [0.40, 0.50, 0.75], "M4": [0.50, 0.50, 1.00]
        }
    };

    const btnCalcular = document.getElementById('btn-calcular');
    const grid = document.getElementById('grid-niveles');

    btnCalcular.onclick = () => {
        const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
        const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
        const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
        const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        const escalaEscuela = vB2B + vHog; // La llave siempre es B2B + Hogar
        const tieneLlave = (escalaEscuela > 0);
        
        let sumatoriaTodosLosNiveles = 0;
        grid.innerHTML = ""; 

        ["M0", "M1", "M2", "M3", "M4"].forEach(nivel => {
            let tasa = 0;
            if (esquema === "STAFF") {
                tasa = CONFIG.NIVELES_STAFF[nivel]; //
            } else {
                let idx = (escalaEscuela >= 16) ? 2 : (escalaEscuela >= 9 ? 1 : 0); //
                tasa = CONFIG.PESOS_CORRETAJE[nivel][idx];
            }

            // Cálculo Variable
            let variableNivel = Math.round((vB2B*CONFIG.PRODUCTOS.B2B.v*CONFIG.PRODUCTOS.B2B.p*tasa) +
                                           (vHog*CONFIG.PRODUCTOS.HOGAR.v*CONFIG.PRODUCTOS.HOGAR.p*tasa));
            
            // Si es Staff o tiene llave en Corretaje, suma Pospago/Prepago
            if (esquema === "STAFF" || tieneLlave) {
                variableNivel += Math.round((vPos*CONFIG.PRODUCTOS.POSPAGO.v*CONFIG.PRODUCTOS.POSPAGO.p*tasa) +
                                            (vPre*CONFIG.PRODUCTOS.PREPAGO.v*CONFIG.PRODUCTOS.PREPAGO.p*tasa));
            }

            sumatoriaTodosLosNiveles += variableNivel;

            const div = document.createElement('div');
            div.className = 'nivel-box';
            div.innerHTML = `
                <div class="lvl-info">
                    <span>NIVEL ${nivel}</span>
                    <strong>VARIABLE: Gs. ${variableNivel.toLocaleString('es-PY')}</strong>
                </div>
                <div class="lvl-amount">${(tasa*100).toFixed(0)}%</div>
            `;
            grid.appendChild(div);
        });

        // VIÁTICO (Solo se suma una vez al gran total si es Corretaje)
        let viaticoTotal = 0;
        if (esquema === "CORRETAJE") {
            const tablaViatico = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
            let keys = Object.keys(tablaViatico).map(Number).sort((a,b)=>a-b);
            let escalaEncontrada = keys.filter(k => k <= escalaEscuela).pop();
            viaticoTotal = escalaEncontrada ? tablaViatico[escalaEncontrada] : 0;
        }

        const montoFinalCalculado = sumatoriaTodosLosNiveles + viaticoTotal;

        // Inyectar el Gran Total al final
        const totalDiv = document.createElement('div');
        totalDiv.className = 'grand-total-card';
        totalDiv.innerHTML = `
            <span class="grand-total-label">SISTEMA TOTAL (FIJO + VAR PROM)</span>
            <div class="grand-total-amount">Gs. ${montoFinalCalculado.toLocaleString('es-PY')}</div>
            ${viaticoTotal > 0 ? `<small style="color:var(--accent); font-size:10px;">INCLUYE VIÁTICO: Gs. ${viaticoTotal.toLocaleString('es-PY')}</small>` : ''}
        `;
        grid.appendChild(totalDiv);

        document.getElementById('resultados-area').classList.remove('hidden');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
});
