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
    const btnLimpiar = document.getElementById('btn-limpiar');
    const grid = document.getElementById('grid-niveles');

    btnLimpiar.onclick = () => {
        document.querySelectorAll('input').forEach(i => i.value = "");
        document.getElementById('resultados-area').classList.add('hidden');
    };

    btnCalcular.onclick = () => {
        const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
        const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
        const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
        const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        const escalaEscuela = vB2B + vHog;
        grid.innerHTML = ""; 

        ["M0", "M1", "M2", "M3", "M4"].forEach(nivel => {
            let tasa = 0;
            if (esquema === "STAFF") {
                tasa = CONFIG.NIVELES_STAFF[nivel];
            } else {
                let idx = (escalaEscuela >= 16) ? 2 : (escalaEscuela >= 9 ? 1 : 0);
                tasa = CONFIG.PESOS_CORRETAJE[nivel][idx];
            }

            // Calculo de Variable
            let variable = Math.round((vB2B*CONFIG.PRODUCTOS.B2B.v*CONFIG.PRODUCTOS.B2B.p*tasa) +
                                      (vHog*CONFIG.PRODUCTOS.HOGAR.v*CONFIG.PRODUCTOS.HOGAR.p*tasa));
            
            // Llave para Pospago/Prepago en Corretaje
            if (esquema === "STAFF" || escalaEscuela > 0) {
                variable += Math.round((vPos*CONFIG.PRODUCTOS.POSPAGO.v*CONFIG.PRODUCTOS.POSPAGO.p*tasa) +
                                       (vPre*CONFIG.PRODUCTOS.PREPAGO.v*CONFIG.PRODUCTOS.PREPAGO.p*tasa));
            }

            let viatico = 0;
            if (esquema === "CORRETAJE") {
                const tablaViatico = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
                // Encontrar el viático correspondiente o el anterior más cercano
                let keys = Object.keys(tablaViatico).map(Number).sort((a,b)=>a-b);
                let escalaEncontrada = keys.filter(k => k <= escalaEscuela).pop();
                viatico = escalaEncontrada ? tablaViatico[escalaEncontrada] : 0;
            }

            const total = variable + viatico;

            const div = document.createElement('div');
            div.className = 'nivel-box';
            div.innerHTML = `
                <div class="lvl-info">
                    <span>${nivel} - RATIO ${(tasa*100).toFixed(0)}%</span>
                    <strong>SISTEMA OPERATIVO</strong>
                </div>
                <div class="lvl-amount">Gs. ${total.toLocaleString('es-PY')}</div>
            `;
            grid.appendChild(div);
        });

        document.getElementById('resultados-area').classList.remove('hidden');
    };
});
