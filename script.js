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

    function obtenerViatico(escala) {
        if (escala < 6) return 0;
        if (escala >= 15) return 1700000;
        return 800000 + ((escala - 6) * 100000);
    }

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            // 1. Captura de Inputs
            const vB2B = parseFloat(document.getElementById('input-POSPAGO').previousElementSibling ? document.getElementById('input-B2B').value : 0) || 0;
            const vHog = parseFloat(document.getElementById('input-HOGAR').value) || 0;
            const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
            const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;

            const esquema = document.getElementById('select-esquema').value;
            const nivelSel = document.getElementById('select-nivel').value;

            let acumuladoVariable = 0;
            let listaHtml = "<ul>";
            let tasaFinal = 0;

            // 2. LÓGICA STAFF
            if (esquema === "STAFF") {
                tasaFinal = CONFIG.NIVELES_STAFF[nivelSel];
                
                // B2B
                let rB2B = Math.round(vB2B * CONFIG.PRODUCTOS.B2B.valor * CONFIG.PRODUCTOS.B2B.pago * tasaFinal);
                // Hogar
                let rHog = Math.round(vHog * CONFIG.PRODUCTOS.HOGAR.valor * CONFIG.PRODUCTOS.HOGAR.pago * tasaFinal);
                // Pospago
                let rPos = Math.round(vPos * CONFIG.PRODUCTOS.POSPAGO.valor * CONFIG.PRODUCTOS.POSPAGO.pago * tasaFinal);
                // Prepago
                let rPre = Math.round(vPre * CONFIG.PRODUCTOS.PREPAGO.valor * CONFIG.PRODUCTOS.PREPAGO.pago * tasaFinal);

                acumuladoVariable = rB2B + rHog + rPos + rPre;

                listaHtml += `<li>B2B: <strong>Gs. ${rB2B.toLocaleString('es-PY')}</strong></li>`;
                listaHtml += `<li>Hogar: <strong>Gs. ${rHog.toLocaleString('es-PY')}</strong></li>`;
                listaHtml += `<li>Pospago: <strong>Gs. ${rPos.toLocaleString('es-PY')}</strong></li>`;
                listaHtml += `<li>Prepago: <strong>Gs. ${rPre.toLocaleString('es-PY')}</strong></li>`;

            } 
            // 3. LÓGICA CORRETAJE
            else {
                const escalaCorretaje = vB2B + vHog;
                const tieneLlave = (escalaCorretaje > 0);
                
                let idx = 0;
                if (escalaCorretaje >= 9 && escalaCorretaje <= 15) idx = 1;
                else if (escalaCorretaje >= 16) idx = 2;
                
                tasaFinal = CONFIG.PESOS_CORRETAJE[nivelSel][idx];

                let rB2B = Math.round(vB2B * CONFIG.PRODUCTOS.B2B.valor * CONFIG.PRODUCTOS.B2B.pago * tasaFinal);
                let rHog = Math.round(vHog * CONFIG.PRODUCTOS.HOGAR.valor * CONFIG.PRODUCTOS.HOGAR.pago * tasaFinal);
                
                // Productos dependientes de la llave
                let rPos = tieneLlave ? Math.round(vPos * CONFIG.PRODUCTOS.POSPAGO.valor * CONFIG.PRODUCTOS.POSPAGO.pago * tasaFinal) : 0;
                let rPre = tieneLlave ? Math.round(vPre * CONFIG.PRODUCTOS.PREPAGO.valor * CONFIG.PRODUCTOS.PREPAGO.pago * tasaFinal) : 0;

                acumuladoVariable = rB2B + rHog + rPos + rPre;

                listaHtml += `<li>B2B: <strong>Gs. ${rB2B.toLocaleString('es-PY')}</strong></li>`;
                listaHtml += `<li>Hogar: <strong>Gs. ${rHog.toLocaleString('es-PY')}</strong></li>`;
                listaHtml += `<li>Pospago: <strong>Gs. ${rPos.toLocaleString('es-PY')}</strong> ${!tieneLlave && vPos > 0 ? '<small style="color:red">(Req. B2B/Home)</small>' : ''}</li>`;
                listaHtml += `<li>Prepago: <strong>Gs. ${rPre.toLocaleString('es-PY')}</strong></li>`;

                // Viático
                let viatico = obtenerViatico(escalaCorretaje);
                if (viatico > 0) {
                    acumuladoVariable += viatico;
                    listaHtml += `<li style="color:blue; border-top:1px solid #ccc; margin-top:5px;">Viático (Escala ${escalaCorretaje}): <strong>Gs. ${viatico.toLocaleString('es-PY')}</strong></li>`;
                }
            }

            listaHtml += "</ul>";
            document.getElementById('detalle-productos').innerHTML = listaHtml;
            document.getElementById('total-variable').innerText = "Gs. " + acumuladoVariable.toLocaleString('es-PY');
        };
    }
});
