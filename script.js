document.addEventListener('DOMContentLoaded', function() {
    const DATA = {
        PRECIOS: {
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

    const btn = document.getElementById('btn-calcular');

    btn.onclick = () => {
        const prod = {
            B2B: parseInt(document.getElementById('input-B2B').value) || 0,
            HOGAR: parseInt(document.getElementById('input-HOGAR').value) || 0,
            POSPAGO: parseInt(document.getElementById('input-POSPAGO').value) || 0,
            PREPAGO: parseInt(document.getElementById('input-PREPAGO').value) || 0
        };
        const esquema = document.getElementById('select-esquema').value;
        const escalaLlave = prod.B2B + prod.HOGAR;
        
        let sumaTotalFinal = 0;
        let htmlDetalle = "";

        // Función para calcular la sumatoria de un producto (M0 + M1 + M2 + M3 + M4)
        const calcularSumaProducto = (cantidad, precioObj, esLlave) => {
            let acumulado = 0;
            for (let i = 0; i < 5; i++) {
                let tasa = 0;
                if (esquema === "STAFF") {
                    tasa = DATA.TASAS_STAFF[i];
                } else {
                    let nivelEscala = (escalaLlave >= 16) ? 'N3' : (escalaLlave >= 9 ? 'N2' : 'N1');
                    tasa = DATA.TASAS_CORRETAJE[nivelEscala][i];
                }
                
                // Si es corretaje y NO es producto llave y NO hay ventas de llave, suma 0
                if (esquema === "CORRETAJE" && !esLlave && escalaLlave === 0) {
                    acumulado += 0;
                } else {
                    acumulado += (cantidad * precioObj.v * precioObj.p * tasa);
                }
            }
            return Math.round(acumulado);
        };

        // Calculamos cada producto
        const resultados = {
            B2B: calcularSumaProducto(prod.B2B, DATA.PRECIOS.B2B, true),
            HOGAR: calcularSumaProducto(prod.HOGAR, DATA.PRECIOS.HOGAR, true),
            POSPAGO: calcularSumaProducto(prod.POSPAGO, DATA.PRECIOS.POSPAGO, false),
            PREPAGO: calcularSumaProducto(prod.PREPAGO, DATA.PRECIOS.PREPAGO, false)
        };

        // Generar HTML de detalle
        for (let key in resultados) {
            sumaTotalFinal += resultados[key];
            htmlDetalle += `
                <div class="product-row">
                    <span>${key} (M0-M4)</span>
                    <strong>Gs. ${resultados[key].toLocaleString('es-PY')}</strong>
                </div>`;
        }

        // Lógica de Viático (Solo Corretaje)
        let viatico = 0;
        if (esquema === "CORRETAJE") {
            const tablaV = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
            let keys = Object.keys(tablaV).map(Number).filter(k => k <= escalaLlave).pop();
            viatico = keys ? tablaV[keys] : 0;
            sumaTotalFinal += viatico;
        }

        // Mostrar resultados
        document.getElementById('grid-detalles').innerHTML = htmlDetalle;
        document.getElementById('display-total').innerText = "Gs. " + sumaTotalFinal.toLocaleString('es-PY');
        document.getElementById('display-viatico').innerText = viatico > 0 ? `+ VIÁTICO INCLUIDO: Gs. ${viatico.toLocaleString('es-PY')}` : "";
        document.getElementById('resultados-area').classList.remove('hidden');
        
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
});
