document.addEventListener('DOMContentLoaded', function() {
    // 1. GESTIÓN DEL MODAL Y LIMPIEZA
    document.getElementById('btn-aceptar-modal').onclick = () => document.getElementById('modal-disclaimer').style.display = 'none';
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.onfocus = function() { if (this.value == "0") this.value = ""; };
        input.onblur = function() { if (this.value == "") this.value = "0"; };
    });

    // 2. CAMBIO DINÁMICO DE IMÁGENES DE AYUDA
    const selectEsquema = document.getElementById('select-esquema');
    const helpContainer = document.getElementById('help-content-dinamico');

    function actualizarAyuda() {
        const modo = selectEsquema.value;
        if (modo === "STAFF") {
            helpContainer.innerHTML = `
                <p>• <strong>Tope Pospago:</strong> Máx. 3 unidades.</p>
                <p>• <strong>Acelerador:</strong> Activo desde 31 instalaciones.</p>
                <div class="img-container">
                    <span>POLÍTICA STAFF VIGENTE</span>
                    <img src="assets/politica-staff.png" alt="Staff">
                </div>
                <div class="img-container">
                    <span>ESCALA ACELERADOR QTY</span>
                    <img src="assets/acelerador.png" alt="Acelerador">
                </div>`;
        } else {
            helpContainer.innerHTML = `
                <p>• <strong>Comisión Pura:</strong> Pago por escala de llaves.</p>
                <p>• <strong>Movilidad:</strong> Requiere venta de Hogar/B2B.</p>
                <div class="img-container">
                    <span>MÉTRICA CORRETAJE M3 EN ADELANTE</span>
                    <img src="assets/metrica-corretaje.png" alt="Corretaje">
                </div>`;
        }
    }

    selectEsquema.onchange = actualizarAyuda;
    actualizarAyuda(); // Ejecutar al cargar para que empiece en Staff

    // 3. LÓGICA DE CÁLCULO (MANTENEMOS LA VERSIÓN 4.0)
    const DATA = {
        PRECIOS: { B2B: { v: 140000, p: 0.65 }, HOGAR: { v: 140000, p: 0.65 }, POSPAGO: { v: 75000, p: 0.65 }, PREPAGO: { v: 25000, p: 0.60 } },
        TASAS_NORMAL: [0.15, 0.15, 0.20, 0.30, 0.45],
        TASAS_ACELERADO: [0.20, 0.20, 0.30, 0.30, 0.50],
        TASAS_CORRETAJE: { N1: [0.30, 0.30, 0.30, 0.40, 0.50], N2: [0.50, 0.50, 0.50, 0.50, 0.50], N3: [0.50, 0.50, 0.75, 0.75, 1.00] },
        SUELDO_BASE: 2900000
    };

    document.getElementById('btn-calcular').onclick = function() {
        let b2b = parseInt(document.getElementById('input-B2B').value) || 0;
        let hog = parseInt(document.getElementById('input-HOGAR').value) || 0;
        let posOriginal = parseInt(document.getElementById('input-POSPAGO').value) || 0;
        let pre = parseInt(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = selectEsquema.value;

        let posCalculo = (esquema === "STAFF" && posOriginal > 3) ? 3 : posOriginal;
        if (esquema === "STAFF" && posOriginal > 3) document.getElementById('alert-pospago').classList.remove('hidden');
        else document.getElementById('alert-pospago').classList.add('hidden');

        const sumaHome = b2b + hog;
        const usaAcelerador = (esquema === "STAFF" && sumaHome >= 31);
        let total = 0;
        let detalleHTML = "";

        const calc = (cant, obj, esLlave) => {
            let sub = 0;
            let tasas = (esquema === "STAFF") ? (usaAcelerador ? DATA.TASAS_ACELERADO : DATA.TASAS_NORMAL) : DATA.TASAS_CORRETAJE[(sumaHome >= 16 ? 'N3' : (sumaHome >= 9 ? 'N2' : 'N1'))];
            for (let i = 0; i < 5; i++) {
                if (esquema === "CORRETAJE" && !esLlave && sumaHome === 0) sub += 0;
                else sub += (cant * obj.v * obj.p * tasas[i]);
            }
            return Math.round(sub);
        };

        const res = { "B2B": calc(b2b, DATA.PRECIOS.B2B, true), "HOGAR": calc(hog, DATA.PRECIOS.HOGAR, true), "POSPAGO": calc(posCalculo, DATA.PRECIOS.POSPAGO, false), "PREPAGO": calc(pre, DATA.PRECIOS.PREPAGO, false) };

        for (let p in res) {
            total += res[p];
            detalleHTML += `<div class="row-item"><span>${p}</span><strong>Gs. ${res[p].toLocaleString('es-PY')}</strong></div>`;
        }

        if (esquema === "STAFF") {
            let acelerador = 0;
            if (usaAcelerador) {
                if (sumaHome >= 46) acelerador = 1800000;
                else if (sumaHome >= 41) acelerador = 1500000;
                else if (sumaHome >= 36) acelerador = 1000000;
                else if (sumaHome >= 31) acelerador = 700000;
                total += acelerador;
                document.getElementById('display-bono').innerText = "🚀 ACELERADOR: Gs. " + acelerador.toLocaleString('es-PY');
            } else document.getElementById('display-bono').innerText = "";
            total += DATA.SUELDO_BASE;
            detalleHTML += `<div class="row-item" style="color:var(--azul-tigo);font-weight:bold;"><span>BÁSICO</span><strong>Gs. ${DATA.SUELDO_BASE.toLocaleString('es-PY')}</strong></div>`;
        } else {
            const tV = {7:800000, 8:900000, 9:1000000, 10:900000, 12:1200000, 15:1500000, 16:1500000, 20:1700000, 25:2000000};
            let keys = Object.keys(tV).map(Number).filter(k => k <= sumaHome).pop();
            let v = keys ? tV[keys] : 0;
            total += v;
            document.getElementById('display-bono').innerText = v > 0 ? "🚚 VIÁTICO: Gs. " + v.toLocaleString('es-PY') : "";
        }

        document.getElementById('grid-detalles').innerHTML = detalleHTML;
        document.getElementById('display-total').innerText = "Gs. " + total.toLocaleString('es-PY');
        document.getElementById('resultados-area').classList.remove('hidden');
    };
});
