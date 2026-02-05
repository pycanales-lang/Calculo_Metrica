document.addEventListener('DOMContentLoaded', function() {
    
    const CONFIG = {
        PRODUCTOS: {
            B2B:     { valor: 140000, pago: 0.65 },
            HOGAR:   { valor: 140000, pago: 0.65 },
            POSPAGO: { valor: 75000,  pago: 0.65 },
            PREPAGO: { valor: 25000,  pago: 0.60 }
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

    // BOTÓN LIMPIAR
    if (btnLimpiar) {
        btnLimpiar.onclick = function() {
            document.querySelectorAll('input').forEach(i => i.value = "");
            document.getElementById('resultado-card').classList.add('result-hidden');
            window.scrollTo(0,0);
        };
    }

    // BOTÓN CALCULAR
    if (btnCalcular) {
        btnCalcular.onclick = function() {
            const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
            const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
            const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
            const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;

            const esquema = document.getElementById('select-esquema').value;
            const nivelSel = document.getElementById('select-nivel').value;

            let acumuladoVariable = 0;
            let listaHtml = "<ul>";
            let tasaFinal = 0;

            if (esquema === "STAFF") {
                tasaFinal = CONFIG.NIVELES_STAFF[nivelSel];
                const res = {
                    B2B: Math.round(vB2B * CONFIG.PRODUCTOS.B2B.valor * CONFIG.PRODUCTOS.B2B.pago * tasaFinal),
                    Hogar: Math.round(vHog * CONFIG.PRODUCTOS.HOGAR.valor * CONFIG.PRODUCTOS.HOGAR.pago * tasaFinal),
                    Pospago: Math.round(vPos * CONFIG.PRODUCTOS.POSPAGO.valor * CONFIG.PRODUCTOS.POSPAGO.pago * tasaFinal),
                    Prepago: Math.round(vPre * CONFIG.PRODUCTOS.PREPAGO.valor * CONFIG.PRODUCTOS.PREPAGO.pago * tasaFinal)
                };
                for (const k in res) {
                    acumuladoVariable += res[k];
                    listaHtml += `<li><span>${k}</span><strong>Gs. ${res[k].toLocaleString('es-PY')}</strong></li>`;
                }
            } else {
                const escala = vB2B + vHog;
                const tieneLlave = (escala > 0);
                let idx = (escala >= 16) ? 2 : (escala >= 9 ? 1 : 0);
                tasaFinal = CONFIG.PESOS_CORRETAJE[nivelSel][idx];

                const res = {
                    B2B: Math.round(vB2B * CONFIG.PRODUCTOS.B2B.valor * CONFIG.PRODUCTOS.B2B.pago * tasaFinal),
                    Hogar: Math.round(vHog * CONFIG.PRODUCTOS.HOGAR.valor * CONFIG.PRODUCTOS.HOGAR.pago * tasaFinal),
                    Pospago: tieneLlave ? Math.round(vPos * CONFIG.PRODUCTOS.POSPAGO.valor * CONFIG.PRODUCTOS.POSPAGO.pago * tasaFinal) : 0,
                    Prepago: tieneLlave ? Math.round(vPre * CONFIG.PRODUCTOS.PREPAGO.valor * CONFIG.PRODUCTOS.PREPAGO.pago * tasaFinal) : 0
                };

                for (const k in res) {
                    acumuladoVariable += res[k];
                    let aviso = (!tieneLlave && (k === 'Pospago' || k === 'Prepago') && (vPos > 0 || vPre > 0)) ? ' <small style="color:red">(Req. B2B/Home)</small>' : '';
                    listaHtml += `<li><span>${k}${aviso}</span><strong>Gs. ${res[k].toLocaleString('es-PY')}</strong></li>`;
                }

                let viatico = (escala >= 15) ? 1700000 : (escala >= 6 ? 800000 + ((escala-6)*100000) : 0);
                if (viatico > 0) {
                    acumuladoVariable += viatico;
                    listaHtml += `<li style="color:var(--primary); font-weight:bold; border-top:1px solid #e2e8f0; margin-top:5px; padding-top:10px;">
                        <span>Viático (Escala ${escala})</span><strong>Gs. ${viatico.toLocaleString('es-PY')}</strong></li>`;
                }
            }

            document.getElementById('detalle-productos').innerHTML = listaHtml;
            document.getElementById('total-variable').innerText = "Gs. " + acumuladoVariable.toLocaleString('es-PY');
            document.getElementById('resultado-card').classList.remove('result-hidden');
        };
    }
});
