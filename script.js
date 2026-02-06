document.addEventListener('DOMContentLoaded', function() {
    // Modal y Limpieza de inputs
    document.getElementById('btn-aceptar-modal').onclick = () => document.getElementById('modal-disclaimer').style.display = 'none';
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.onfocus = function() { if (this.value == "0") this.value = ""; };
        input.onblur = function() { if (this.value == "") this.value = "0"; };
    });

    const DATA = {
        PRECIOS: { B2B: { v: 140000, p: 0.65 }, HOGAR: { v: 140000, p: 0.65 }, POSPAGO: { v: 75000, p: 0.65 }, PREPAGO: { v: 25000, p: 0.60 } },
        TASAS_NORMAL: [0.15, 0.15, 0.20, 0.30, 0.45],
        TASAS_ACELERADO: [0.20, 0.20, 0.30, 0.30, 0.50], // Nueva Métrica Perfil HOME
        TASAS_CORRETAJE: { N1: [0.30, 0.30, 0.30, 0.40, 0.50], N2: [0.50, 0.50, 0.50, 0.50, 0.50], N3: [0.50, 0.50, 0.75, 0.75, 1.00] },
        SUELDO_BASE: 2900000
    };

    document.getElementById('btn-calcular').onclick = function() {
        let b2b = parseInt(document.getElementById('input-B2B').value) || 0;
        let hog = parseInt(document.getElementById('input-HOGAR').value) || 0;
        let posOriginal = parseInt(document.getElementById('input-POSPAGO').value) || 0;
        let pre = parseInt(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        // 1. APLICAR TOPE POSPAGO STAFF (Máximo 3)
        let posCalculo = posOriginal;
        if (esquema === "STAFF" && posOriginal > 3) {
            posCalculo = 3;
            document.getElementById('alert-pospago').classList.remove('hidden');
        } else {
            document.getElementById('alert-pospago').classList.add('hidden');
        }

        const sumaHome = b2b + hog;
        const usaAcelerador = (esquema === "STAFF" && sumaHome >= 31);
        let total = 0;
        let detalleHTML = "";

        // Función de cálculo
        const calc = (cant, obj, esLlave) => {
            let sub = 0;
            let tasas = [];
            if (esquema === "STAFF") {
                tasas = usaAcelerador ? DATA.TASAS_ACELERADO : DATA.TASAS_NORMAL;
            } else {
                let escala = (sumaHome >= 16) ? 'N3' : (sumaHome >= 9 ? 'N2' : 'N1');
                tasas = DATA.TASAS_CORRETAJE[escala];
            }

            for (let i = 0; i < 5; i++) {
                if (esquema === "CORRETAJE" && !esLlave && sumaHome === 0) sub += 0;
                else sub += (cant * obj.v * obj.p * tasas[i]);
            }
            return Math.round(sub);
        };

        const res = { 
            "B2B": calc(b2b, DATA.PRECIOS.B2B, true), 
            "HOGAR": calc(hog, DATA.PRECIOS.HOGAR, true), 
            "POSPAGO": calc(posCalculo, DATA.PRECIOS.POSPAGO, false), 
            "PREPAGO": calc(pre, DATA.PRECIOS.PREPAGO, false) 
        };

        for (let p in res) {
            total += res[p];
            let labelAdicional = (p === "POSPAGO" && posOriginal > 3) ? ` (Topado a 3)` : "";
            detalleHTML += `<div class="row-item"><span>${p}${labelAdicional}</span><strong>Gs. ${res[p].toLocaleString('es-PY')}</strong></div>`;
        }

        // 2. SUMAR ACELERADOR QTY (FIJO EXTRA)
        let plusImporte = 0;
        if (usaAcelerador) {
            if (sumaHome >= 46) plusImporte = 1800000;
            else if (sumaHome >= 41) plusImporte = 1500000;
            else if (sumaHome >= 36) plusImporte = 1000000;
            else if (sumaHome >= 31) plusImporte = 700000;
            
            total += plusImporte;
            document.getElementById('display-acelerador').innerText = "🔥 ACELERADOR QTY: Gs. " + plusImporte.toLocaleString('es-PY');
        } else {
            document.getElementById('display-acelerador').innerText = "";
        }

        if (esquema === "STAFF") {
            total += DATA.SUELDO_BASE;
            detalleHTML += `<div class="row-item" style="color:var(--azul-tigo);font-weight:bold;"><span>BÁSICO</span><strong>Gs. ${DATA.SUELDO_BASE.toLocaleString('es-PY')}</strong></div>`;
        }

        document.getElementById('grid-detalles').innerHTML = detalleHTML;
        document.getElementById('display-total').innerText = "Gs. " + total.toLocaleString('es-PY');
        document.getElementById('resultados-area').classList.remove('hidden');
    };
});
