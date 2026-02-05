document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        PRODUCTOS: {
            B2B: { valor: 140000, pago: 0.65 },
            HOGAR: { valor: 140000, pago: 0.65 },
            POSPAGO: { valor: 75000, pago: 0.65 },
            PREPAGO: { valor: 25000, pago: 0.60 }
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

    btnLimpiar.onclick = () => {
        document.querySelectorAll('input').forEach(i => i.value = "");
        document.getElementById('resultado-card').classList.add('hidden');
    };

    btnCalcular.onclick = () => {
        const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
        const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
        const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
        const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;
        const nivelSel = document.getElementById('select-nivel').value;

        let total = 0;
        let html = "";
        let tasa = 0;

        if (esquema === "STAFF") {
            tasa = CONFIG.NIVELES_STAFF[nivelSel];
            const items = [{n:"B2B", v:vB2B, p:CONFIG.PRODUCTOS.B2B}, {n:"Hogar", v:vHog, p:CONFIG.PRODUCTOS.HOGAR}, {n:"Pospago", v:vPos, p:CONFIG.PRODUCTOS.POSPAGO}, {n:"Prepago", v:vPre, p:CONFIG.PRODUCTOS.PREPAGO}];
            items.forEach(i => {
                let sub = Math.round(i.v * i.p.valor * i.p.pago * tasa);
                total += sub;
                html += `<div class="res-item"><span>${i.n}</span><strong>Gs. ${sub.toLocaleString('es-PY')}</strong></div>`;
            });
        } else {
            const escala = vB2B + vHog;
            const llave = escala > 0;
            let idx = (escala >= 16) ? 2 : (escala >= 9 ? 1 : 0);
            tasa = CONFIG.PESOS_CORRETAJE[nivelSel][idx];

            const items = [{n:"B2B", v:vB2B, p:CONFIG.PRODUCTOS.B2B, k:true}, {n:"Hogar", v:vHog, p:CONFIG.PRODUCTOS.HOGAR, k:true}, {n:"Pospago", v:vPos, p:CONFIG.PRODUCTOS.POSPAGO, k:false}, {n:"Prepago", v:vPre, p:CONFIG.PRODUCTOS.PREPAGO, k:false}];
            items.forEach(i => {
                let sub = (i.k || llave) ? Math.round(i.v * i.p.valor * i.p.pago * tasa) : 0;
                total += sub;
                html += `<div class="res-item"><span>${i.n}</span><strong>Gs. ${sub.toLocaleString('es-PY')}</strong></div>`;
            });

            let viatico = (escala >= 15) ? 1700000 : (escala >= 6 ? 800000 + ((escala-6)*100000) : 0);
            if (viatico > 0) {
                total += viatico;
                html += `<div class="res-item" style="color:var(--blue); font-weight:bold;"><span>Viático</span><strong>Gs. ${viatico.toLocaleString('es-PY')}</strong></div>`;
            }
        }

        document.getElementById('detalle-productos').innerHTML = html;
        document.getElementById('total-variable').innerText = "Gs. " + total.toLocaleString('es-PY');
        document.getElementById('resultado-card').classList.remove('hidden');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
});
