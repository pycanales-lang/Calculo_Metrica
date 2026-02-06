document.addEventListener('DOMContentLoaded', function() {
    const DATA = {
        PRECIOS: {
            B2B: { v: 140000, p: 0.65 },
            HOGAR: { v: 140000, p: 0.65 },
            POSPAGO: { v: 75000, p: 0.65 },
            PREPAGO: { v: 25000, p: 0.60 }
        },
        TASAS_STAFF: [0.15, 0.15, 0.20, 0.30, 0.45],
        TASAS_CORRETAJE: {
            N1: [0.30, 0.30, 0.30, 0.40, 0.50], // 1-8 ventas llave
            N2: [0.50, 0.50, 0.50, 0.50, 0.50], // 9-15 ventas llave
            N3: [0.50, 0.50, 0.75, 0.75, 1.00]  // 16-25 ventas llave
        },
        SALARIO_FIJO_STAFF: 2900000
    };

    const btn = document.getElementById('btn-calcular');
    const resultadosArea = document.getElementById('resultados-area');

    btn.onclick = function() {
        // Captura de datos
        const b2b = parseInt(document.getElementById('input-B2B').value) || 0;
        const hog = parseInt(document.getElementById('input-HOGAR').value) || 0;
        const pos = parseInt(document.getElementById('input-POSPAGO').value) || 0;
        const pre = parseInt(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        const escalaLlave = b2b + hog;
        let sumaTotalFinal = 0;
        let htmlDetalle = "";

        // Función de suma acumulada (M0 + M1 + M2 + M3 + M4)
        const calcVertical = (cant, precioObj, esLlave) => {
            let acumulado = 0;
            for (let i = 0; i < 5; i++) {
                let tasa = 0;
                if (esquema === "STAFF") {
                    tasa = DATA.TASAS_STAFF[i];
                } else {
                    let nivel = (escalaLlave >= 16) ? 'N3' : (escalaLlave >= 9 ? 'N2' : 'N1');
                    tasa = DATA.TASAS_CORRETAJE[nivel][i];
                }

                // En Corretaje, Pospago/Prepago solo pagan si escalaLlave > 0
                if (esquema === "CORRETAJE" && !esLlave && escalaLlave === 0) {
                    acumulado += 0;
                } else {
                    acumulado += (cant * precioObj.v * precioObj.p * tasa);
                }
            }
            return Math.round(acumulado);
        };

        const res = {
            "B2B": calcVertical(b2b, DATA.PRECIOS.B2B, true),
            "HOGAR": calcVertical(hog, DATA.PRECIOS.HOGAR, true),
            "POSPAGO": calcVertical(pos, DATA.PRECIOS.POSPAGO, false),
            "PREPAGO": calcVertical(pre, DATA.PRECIOS.PREPAGO, false)
        };

        // 1. Sumar Variable de productos
        for (let item in res) {
            sumaTotalFinal += res[item];
            htmlDetalle += `<div class="product-row"><span>${item} (Acumulado)</span><strong>Gs. ${res[item].toLocaleString('es-PY')}</strong></div>`;
        }

        // 2. Sumar Salario Fijo si es STAFF
        if (esquema === "STAFF") {
            sumaTotalFinal += DATA.SALARIO_FIJO_STAFF;
            htmlDetalle += `
                <div class="product-row" style="background: rgba(188, 19, 254, 0.15); color: #fff; font-weight: bold;">
                    <span>SALARIO FIJO BASE</span>
                    <strong>Gs. ${DATA.SALARIO_FIJO_STAFF.toLocaleString('es-PY')}</strong>
                </div>`;
        }

        // 3. Sumar Viático si es CORRETAJE
        let viatico = 0;
        if (esquema === "CORRETAJE") {
            const tablaV = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
            let keys = Object.keys(tablaV).map(Number).filter(k => k <= escalaLlave).pop();
            viatico = keys ? tablaV[keys] : 0;
            sumaTotalFinal += viatico;
        }

        // Renderizado Final
        document.getElementById('grid-detalles').innerHTML = htmlDetalle;
        document.getElementById('display-total').innerText = "Gs. " + sumaTotalFinal.toLocaleString('es-PY');
        document.getElementById('display-viatico').innerText = viatico > 0 ? `+ VIÁTICO: Gs. ${viatico.toLocaleString('es-PY')}` : "";
        
        resultadosArea.classList.remove('hidden');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
});
