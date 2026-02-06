document.addEventListener('DOMContentLoaded', function() {
    // 1. GESTIÓN DEL MODAL
    const modal = document.getElementById('modal-disclaimer');
    const btnCerrarModal = document.getElementById('btn-aceptar-modal');

    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', function() {
            modal.style.display = 'none'; // Esto elimina el bloqueo por completo
        });
    }

    // 2. CONFIGURACIÓN DE DATOS
    const DATA = {
        PRECIOS: {
            B2B: { v: 140000, p: 0.65 },
            HOGAR: { v: 140000, p: 0.65 },
            POSPAGO: { v: 75000, p: 0.65 },
            PREPAGO: { v: 25000, p: 0.60 }
        },
        TASAS_STAFF: [0.15, 0.15, 0.20, 0.30, 0.45],
        TASAS_CORRETAJE: {
            N1: [0.30, 0.30, 0.30, 0.40, 0.50],
            N2: [0.50, 0.50, 0.50, 0.50, 0.50],
            N3: [0.50, 0.50, 0.75, 0.75, 1.00]
        },
        SUELDO_BASE: 2900000
    };

    const btnCalcular = document.getElementById('btn-calcular');
    const areaResultados = document.getElementById('resultados-area');

    btnCalcular.onclick = function() {
        // Captura de valores
        const b2b = parseInt(document.getElementById('input-B2B').value) || 0;
        const hog = parseInt(document.getElementById('input-HOGAR').value) || 0;
        const pos = parseInt(document.getElementById('input-POSPAGO').value) || 0;
        const pre = parseInt(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        const sumaLlave = b2b + hog;
        let totalAcumulado = 0;
        let detalleHTML = "";

        // Función de suma M0-M4
        const calcularProducto = (cant, obj, esLlave) => {
            let sub = 0;
            for (let i = 0; i < 5; i++) {
                let tasa = 0;
                if (esquema === "STAFF") {
                    tasa = DATA.TASAS_STAFF[i];
                } else {
                    let escala = (sumaLlave >= 16) ? 'N3' : (sumaLlave >= 9 ? 'N2' : 'N1');
                    tasa = DATA.TASAS_CORRETAJE[escala][i];
                }
                
                // Regla Corretaje
                if (esquema === "CORRETAJE" && !esLlave && sumaLlave === 0) {
                    sub += 0;
                } else {
                    sub += (cant * obj.v * obj.p * tasa);
                }
            }
            return Math.round(sub);
        };

        const res = {
            "B2B": calcularProducto(b2b, DATA.PRECIOS.B2B, true),
            "HOGAR": calcularProducto(hog, DATA.PRECIOS.HOGAR, true),
            "POSPAGO": calcularProducto(pos, DATA.PRECIOS.POSPAGO, false),
            "PREPAGO": calcularProducto(pre, DATA.PRECIOS.PREPAGO, false)
        };

        // Generar filas
        for (let p in res) {
            totalAcumulado += res[p];
            detalleHTML += `<div class="row-item"><span>${p} Acumulado</span><strong>Gs. ${res[p].toLocaleString('es-PY')}</strong></div>`;
        }

        // Sumar Sueldo Staff
        if (esquema === "STAFF") {
            totalAcumulado += DATA.SUELDO_BASE;
            detalleHTML += `<div class="row-item" style="color:var(--primary-blue); font-weight:bold;"><span>SUELDO BASE</span><strong>Gs. ${DATA.SUELDO_BASE.toLocaleString('es-PY')}</strong></div>`;
        }

        // Sumar Viático Corretaje
        let viatico = 0;
        if (esquema === "CORRETAJE") {
            const tV = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
            let keys = Object.keys(tV).map(Number).filter(k => k <= sumaLlave).pop();
            viatico = keys ? tV[keys] : 0;
            totalAcumulado += viatico;
        }

        // Inyectar Resultados
        document.getElementById('grid-detalles').innerHTML = detalleHTML;
        document.getElementById('display-total').innerText = "Gs. " + totalAcumulado.toLocaleString('es-PY');
        document.getElementById('display-viatico').innerText = viatico > 0 ? `+ VIÁTICO INCLUIDO: Gs. ${viatico.toLocaleString('es-PY')}` : "";
        
        areaResultados.classList.remove('hidden');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
});
