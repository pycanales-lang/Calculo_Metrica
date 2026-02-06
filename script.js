document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        PRODUCTOS: {
            B2B: { valor: 140000, pago: 0.65 },
            HOGAR: { valor: 140000, pago: 0.65 },
            POSPAGO: { valor: 75000, pago: 0.65 },
            PREPAGO: { valor: 25000, pago: 0.60 }
        },
        NIVELES_STAFF: { "M0": 0.15, "M1": 0.17, "M2": 0.20, "M3": 0.23, "M4": 0.25 },
        PESOS_CORRETAJE: {
            "M0": [0.30, 0.50, 0.50], "M1": [0.30, 0.50, 0.50],
            "M2": [0.30, 0.50, 0.75], "M3": [0.30, 0.50, 0.75], "M4": [0.30, 0.50, 0.75]
        }
    };

    const btnCalcular = document.getElementById('btn-calcular');
    const btnLimpiar = document.getElementById('btn-limpiar');
    const containerNiveles = document.getElementById('grid-niveles');

    btnLimpiar.onclick = () => {
        document.querySelectorAll('input').forEach(i => i.value = "");
        document.getElementById('resultados-container').classList.add('hidden');
    };

    btnCalcular.onclick = () => {
        const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
        const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
        const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
        const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        const escalaEscuela = vB2B + vHog;
        const tieneLlave = (escalaEscuela > 0);
        
        containerNiveles.innerHTML = ""; // Limpiar grid anterior

        // CALCULAR CADA NIVEL (M0 a M4)
        ["M0", "M1", "M2", "M3", "M4"].forEach(nivel => {
            let totalNivel = 0;
            let tasa = 0;

            if (esquema === "STAFF") {
                tasa = CONFIG.NIVELES_STAFF[nivel];
            } else {
                let idx = (escalaEscuela >= 16) ? 2 : (escalaEscuela >= 9 ? 1 : 0);
                tasa = CONFIG.PESOS_CORRETAJE[nivel][idx];
            }

            // Calculo de productos
            let rB2B = Math.round(vB2B * CONFIG.PRODUCTOS.B2B.valor * CONFIG.PRODUCTOS.B2B.pago * tasa);
            let rHog = Math.round(vHog * CONFIG.PRODUCTOS.HOGAR.valor * CONFIG.PRODUCTOS.HOGAR.pago * tasa);
            
            let rPos = (esquema === "STAFF" || tieneLlave) ? Math.round(vPos * CONFIG.PRODUCTOS.POSPAGO.valor * CONFIG.PRODUCTOS.POSPAGO.pago * tasa) : 0;
            let rPre = (esquema === "STAFF" || tieneLlave) ? Math.round(vPre * CONFIG.PRODUCTOS.PREPAGO.valor * CONFIG.PRODUCTOS.PREPAGO.pago * tasa) : 0;

            totalNivel = rB2B + rHog + rPos + rPre;

            // Sumar viático solo si es Corretaje
            let viatico = 0;
            if (esquema === "CORRETAJE") {
                viatico = (escalaEscuela >= 15) ? 1700000 : (escalaEscuela >= 6 ? 800000 + ((escalaEscuela-6)*100000) : 0);
                totalNivel += viatico;
            }

            // Crear Tarjeta de Nivel
            const card = document.createElement('div');
            card.className = 'nivel-card';
            card.innerHTML = `
                <div class="nivel-header">
                    <span class="nivel-badge">Nivel ${nivel} (${Math.round(tasa*100)}%)</span>
                    <span class="nivel-total">Gs. ${totalNivel.toLocaleString('es-PY')}</span>
                </div>
                <div class="nivel-detalles">
                    Variable: Gs. ${(totalNivel - viatico).toLocaleString('es-PY')} 
                    ${viatico > 0 ? ` | Viático: Gs. ${viatico.toLocaleString('es-PY')}` : ''}
                </div>
            `;
            containerNiveles.appendChild(card);
        });

        document.getElementById('resultados-container').classList.remove('hidden');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
});
