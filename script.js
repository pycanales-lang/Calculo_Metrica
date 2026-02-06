document.addEventListener('DOMContentLoaded', function() {
    // Configuración exacta basada en tus tablas de Excel
    const DATA = {
        PRECIOS: {
            B2B: { v: 140000, p: 0.65 },
            HOGAR: { v: 140000, p: 0.65 },
            POSPAGO: { v: 75000, p: 0.65 },
            PREPAGO: { v: 25000, p: 0.60 }
        },
        TASAS_STAFF: [0.15, 0.15, 0.20, 0.30, 0.45], 
        TASAS_CORRETAJE: {
            N1: [0.30, 0.30, 0.30, 0.40, 0.50], // Escala 1-8
            N2: [0.50, 0.50, 0.50, 0.50, 0.50], // Escala 9-15
            N3: [0.50, 0.50, 0.75, 0.75, 1.00]  // Escala 16-25
        }
    };

    const btn = document.getElementById('btn-calcular');
    const resultadosArea = document.getElementById('resultados-area');

    if (btn) {
        btn.onclick = function() {
            // Captura de valores asegurando que sean números
            const b2b = parseInt(document.getElementById('input-B2B').value) || 0;
            const hog = parseInt(document.getElementById('input-HOGAR').value) || 0;
            const pos = parseInt(document.getElementById('input-POSPAGO').value) || 0;
            const pre = parseInt(document.getElementById('input-PREPAGO').value) || 0;
            const esquema = document.getElementById('select-esquema').value;
            
            const escalaLlave = b2b + hog;
            const tieneLlave = (escalaLlave > 0);
            
            let sumaTotalFinal = 0;
            let htmlDetalle = "";

            // Función de cálculo por producto (Sumando M0 a M4)
            const calcularSumaProducto = (cantidad, precioObj, esProductoLlave) => {
                let acumulado = 0;
                for (let i = 0; i < 5; i++) {
                    let tasa = 0;
                    if (esquema === "STAFF") {
                        tasa = DATA.TASAS_STAFF[i];
                    } else {
                        let nivelEscala = (escalaLlave >= 16) ? 'N3' : (escalaLlave >= 9 ? 'N2' : 'N1');
                        tasa = DATA.TASAS_CORRETAJE[nivelEscala][i];
                    }

                    // En CORRETAJE, productos no-llave (pos/pre) solo pagan si escalaLlave > 0
                    if (esquema === "CORRETAJE" && !esProductoLlave && !tieneLlave) {
                        acumulado += 0;
                    } else {
                        acumulado += (cantidad * precioObj.v * precioObj.p * tasa);
                    }
                }
                return Math.round(acumulado);
            };

            const res = {
                "B2B": calcularSumaProducto(b2b, DATA.PRECIOS.B2B, true),
                "HOGAR": calcularSumaProducto(hog, DATA.PRECIOS.HOGAR, true),
                "POSPAGO": calcularSumaProducto(pos, DATA.PRECIOS.POSPAGO, false),
                "PREPAGO": calcularSumaProducto(pre, DATA.PRECIOS.PREPAGO, false)
            };

            // Armar el resumen visual
            for (let nombre in res) {
                sumaTotalFinal += res[nombre];
                htmlDetalle += `
                    <div class="product-row">
                        <span>${nombre} (ACUMULADO M0-M4)</span>
                        <strong>Gs. ${res[nombre].toLocaleString('es-PY')}</strong>
                    </div>`;
            }

            // Cálculo del Viático
            let viatico = 0;
            if (esquema === "CORRETAJE") {
                const tablaV = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
                let keys = Object.keys(tablaV).map(Number).filter(k => k <= escalaLlave).pop();
                viatico = keys ? tablaV[keys] : 0;
                sumaTotalFinal += viatico;
            }

            // Inyectar en el HTML
            document.getElementById('grid-detalles').innerHTML = htmlDetalle;
            document.getElementById('display-total').innerText = "Gs. " + sumaTotalFinal.toLocaleString('es-PY');
            document.getElementById('display-viatico').innerText = viatico > 0 ? `+ VIÁTICO: Gs. ${viatico.toLocaleString('es-PY')}` : "";
            
            // Mostrar el área de resultados
            resultadosArea.classList.remove('hidden');
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        };
    }
});
