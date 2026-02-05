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

    btnLimpiar.onclick = () => {
        document.querySelectorAll('input').forEach(i => i.value = "");
        document.getElementById('resultado-card').classList.add('hidden');
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    btnCalcular.onclick = () => {
        const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
        const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
        const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
        const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;

        const esquema = document.getElementById('select-esquema').value;
        const nivelSel = document.getElementById('select-nivel').value;

        let totalVariable = 0;
        let htmlResumen = "";
        let tasa = 0;

        if (esquema === "STAFF") {
            tasa = CONFIG.NIVELES_STAFF[nivelSel];
            const items = [
                {n: "B2B", v: vB2B, p: CONFIG.PRODUCTOS.B2B},
                {n: "Hogar", v: vHog, p: CONFIG.PRODUCTOS.HOGAR},
                {n: "Pospago", v: vPos, p: CONFIG.PRODUCTOS.POSPAGO},
                {n: "Prepago", v: vPre, p: CONFIG.PRODUCTOS.PREPAGO}
            ];
            items.forEach(i => {
                let sub = Math.round(i.v * i.p.valor * i.p.pago * tasa);
                totalVariable += sub;
                htmlResumen += `<div><span>${i.n}</span><strong>Gs. ${sub.toLocaleString('es-PY')}</strong></div>`;
            });
        } else {
            const escalaEscuela = vB2B + vHog;
            const tieneLlave = (escalaEscuela > 0);
            let idx = (escalaEscuela >= 16) ? 2 : (escalaEscuela >= 9 ? 1 : 0);
            tasa = CONFIG.PESOS_CORRETAJE[nivelSel][idx];

            const items = [
                {n: "B2B", v: vB2B, p: CONFIG.PRODUCTOS.B2B, key: true},
                {n: "Hogar", v: vHog, p: CONFIG.PRODUCTOS.HOGAR, key: true},
                {n: "Pospago", v: vPos, p: CONFIG.PRODUCTOS.POSPAGO, key: false},
                {n: "Prepago", v: vPre, p: CONFIG.PRODUCTOS.PREPAGO, key: false}
            ];

            items.forEach(i => {
                let sub = (i.key || tieneLlave) ? Math.round(i.v * i.p.valor * i.p.pago * tasa) : 0;
                totalVariable += sub;
                let error = (!i.key && !tieneLlave && i.v > 0) ? ' <span style="color:red">!</span>' : '';
                htmlResumen += `<div><span>${i.n}${error}</span><strong>Gs. ${sub.toLocaleString('es-PY')}</strong></div>`;
            });

            let viatico = (escalaEscuela >= 15) ? 1700000 : (escalaEscuela >= 6 ? 800000 + ((escalaEscuela-6)*100000) : 0);
            if (viatico > 0) {
                totalVariable += viatico;
                htmlResumen += `<div style="color:#0056b3; font-weight:bold;"><span>Viático (Esc. ${escalaEscuela})</span><strong>Gs. ${viatico.toLocaleString('es-PY')}</strong></div>`;
            }
        }

        document.getElementById('detalle-productos').innerHTML = htmlResumen;
        document.getElementById('total-variable').innerText = "Gs. " + totalVariable.toLocaleString('es-PY');
        document.getElementById('resultado-card').classList.remove('hidden');
        
        // Auto-scroll al resultado en móviles
        setTimeout(() => {
            document.getElementById('resultado-card').scrollIntoView({behavior: 'smooth'});
        }, 100);
    };
});
