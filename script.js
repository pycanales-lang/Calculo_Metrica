document.addEventListener('DOMContentLoaded', function() {
    // MODAL
    const modal = document.getElementById('modal-disclaimer');
    const btnCerrarModal = document.getElementById('btn-aceptar-modal');
    btnCerrarModal.onclick = () => modal.style.display = 'none';

    // LIMPIAR CEROS AL TOCAR EL INPUT
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.onfocus = function() {
            if (this.value == "0") this.value = "";
        };
        input.onblur = function() {
            if (this.value == "") this.value = "0";
        };
    });

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

    btnCalcular.onclick = function() {
        const b2b = parseInt(document.getElementById('input-B2B').value) || 0;
        const hog = parseInt(document.getElementById('input-HOGAR').value) || 0;
        const pos = parseInt(document.getElementById('input-POSPAGO').value) || 0;
        const pre = parseInt(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        const sumaLlave = b2b + hog;
        let total = 0;
        let detalleHTML = "";

        const calc = (cant, obj, esLlave) => {
            let sub = 0;
            for (let i = 0; i < 5; i++) {
                let tasa = (esquema === "STAFF") ? DATA.TASAS_STAFF[i] : 
                           DATA.TASAS_CORRETAJE[(sumaLlave >= 16 ? 'N3' : (sumaLlave >= 9 ? 'N2' : 'N1'))][i];
                
                if (esquema === "CORRETAJE" && !esLlave && sumaLlave === 0) sub += 0;
                else sub += (cant * obj.v * obj.p * tasa);
            }
            return Math.round(sub);
        };

        const res = { "B2B": calc(b2b, DATA.PRECIOS.B2B, true), "HOGAR": calc(hog, DATA.PRECIOS.HOGAR, true), "POSPAGO": calc(pos, DATA.PRECIOS.POSPAGO, false), "PREPAGO": calc(pre, DATA.PRECIOS.PREPAGO, false) };

        for (let p in res) {
            total += res[p];
            detalleHTML += `<div class="row-item"><span>${p}</span><strong>Gs. ${res[p].toLocaleString('es-PY')}</strong></div>`;
        }

        if (esquema === "STAFF") {
            total += DATA.SUELDO_BASE;
            detalleHTML += `<div class="row-item" style="color:var(--azul-tigo);font-weight:bold;"><span>BÁSICO</span><strong>Gs. ${DATA.SUELDO_BASE.toLocaleString('es-PY')}</strong></div>`;
        } else {
            const tV = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
            let keys = Object.keys(tV).map(Number).filter(k => k <= sumaLlave).pop();
            let v = keys ? tV[keys] : 0;
            total += v;
            if(v > 0) document.getElementById('display-viatico').innerText = "+ VIÁTICO: Gs. " + v.toLocaleString('es-PY');
        }

        document.getElementById('grid-detalles').innerHTML = detalleHTML;
        document.getElementById('display-total').innerText = "Gs. " + total.toLocaleString('es-PY');
        document.getElementById('resultados-area').classList.remove('hidden');
    };
});
