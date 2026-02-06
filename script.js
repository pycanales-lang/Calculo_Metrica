document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        PRODUCTOS: {
            B2B: { v: 140000, p: 0.65 },
            HOGAR: { v: 140000, p: 0.65 },
            POSPAGO: { v: 75000, p: 0.65 },
            PREPAGO: { v: 25000, p: 0.60 }
        },
       // TABLA STAFF: Porcentajes fijos directos
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

    const btnCalcular = document.getElementById('btn-calcular');
    const grid = document.getElementById('grid-niveles');

    btnCalcular.onclick = function() {
        const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
        const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
        const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
        const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        const escalaEscuela = vB2B + vHog;
        const tieneLlave = (escalaEscuela > 0);
        
        let sumatoriaNiveles = 0;
        grid.innerHTML = ""; 

        ["M0", "M1", "M2", "M3", "M4"].forEach(nivel => {
            let tasa = (esquema === "STAFF") ? CONFIG.NIVELES_STAFF[nivel] : 
                       CONFIG.PESOS_CORRETAJE[nivel][(escalaEscuela >= 16) ? 2 : (escalaEscuela >= 9 ? 1 : 0)];

            let variable = Math.round((vB2B * CONFIG.PRODUCTOS.B2B.v * CONFIG.PRODUCTOS.B2B.p * tasa) +
                                      (vHog * CONFIG.PRODUCTOS.HOGAR.v * CONFIG.PRODUCTOS.HOGAR.p * tasa));
            
            if (esquema === "STAFF" || tieneLlave) {
                variable += Math.round((vPos * CONFIG.PRODUCTOS.POSPAGO.v * CONFIG.PRODUCTOS.POSPAGO.p * tasa) +
                                       (vPre * CONFIG.PRODUCTOS.PREPAGO.v * CONFIG.PRODUCTOS.PREPAGO.p * tasa));
            }

            sumatoriaNiveles += variable;

            grid.innerHTML += `
                <div class="nivel-box">
                    <div><label>NIVEL ${nivel}</label><strong>${(tasa*100).toFixed(0)}%</strong></div>
                    <div>Gs. ${variable.toLocaleString('es-PY')}</div>
                </div>`;
        });

        let viatico = 0;
        if (esquema === "CORRETAJE") {
            const tabla = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
            let escalaOk = Object.keys(tabla).map(Number).filter(k => k <= escalaEscuela).pop();
            viatico = escalaOk ? tabla[escalaOk] : 0;
        }

        const granTotal = sumatoriaNiveles + viatico;

        grid.innerHTML += `
            <div class="grand-total-card">
                <div style="font-size: 10px; opacity: 0.8;">SISTEMA TOTAL (FIJO + VAR PROM)</div>
                <div class="grand-total-amount">Gs. ${granTotal.toLocaleString('es-PY')}</div>
                ${viatico > 0 ? `<div style="font-size:11px; margin-top:5px;">Incluye Viático: Gs. ${viatico.toLocaleString('es-PY')}</div>` : ''}
            </div>`;

        document.getElementById('resultados-area').classList.remove('hidden');
    };
});
