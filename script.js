document.addEventListener('DOMContentLoaded', function() {
    // 1. GESTIÓN DEL MODAL Y LIMPIEZA DE INPUTS
    const modal = document.getElementById('modal-disclaimer');
    const btnCerrarModal = document.getElementById('btn-aceptar-modal');
    btnCerrarModal.onclick = () => modal.style.display = 'none';

    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.onfocus = function() { if (this.value == "0" || this.placeholder == "0") this.value = ""; };
        input.onblur = function() { if (this.value == "") this.value = "0"; };
    });

    // 2. CONFIGURACIÓN DE POLÍTICAS
    const DATA = {
        PRECIOS: {
            B2B: { v: 140000, p: 0.65 },
            HOGAR: { v: 140000, p: 0.65 },
            POSPAGO: { v: 75000, p: 0.65 },
            PREPAGO: { v: 25000, p: 0.60 }
        },
        TASAS_NORMAL: [0.15, 0.15, 0.20, 0.30, 0.45],
        TASAS_ACELERADO: [0.20, 0.20, 0.30, 0.30, 0.50], // Métrica HOME 31+
        TASAS_CORRETAJE: {
            N1: [0.30, 0.30, 0.30, 0.40, 0.50],
            N2: [0.50, 0.50, 0.50, 0.50, 0.50],
            N3: [0.50, 0.50, 0.75, 0.75, 1.00]
        },
        SUELDO_BASE: 2900000
    };

    const btnCalcular = document.getElementById('btn-calcular');

    btnCalcular.onclick = function() {
        // Captura de datos
        let b2b = parseInt(document.getElementById('input-B2B').value) || 0;
        let hog = parseInt(document.getElementById('input-HOGAR').value) || 0;
        let posOriginal = parseInt(document.getElementById('input-POSPAGO').value) || 0;
        let pre = parseInt(document.getElementById('input-PREPAGO').value) || 0;
        const esquema = document.getElementById('select-esquema').value;

        // Regla: Tope Pospago Staff (Máximo 3)
        let posCalculo = posOriginal;
        if (esquema === "STAFF" && posOriginal > 3) {
            posCalculo = 3;
            document.getElementById('alert-pospago').classList.remove('hidden');
        } else {
            document.getElementById('alert-pospago').classList.add('hidden');
        }

        const sumaHome = b2b + hog;
        const usaAcelerador = (esquema === "STAFF" && sumaHome >= 31);
        let totalAcumulado = 0;
        let detalleHTML = "";

        // Función Maestra de Cálculo Vertical M0-M4
        const calcVertical = (cant, obj, esLlave) => {
            let subtotal = 0;
            let tasas = [];
            
            if (esquema === "STAFF") {
                tasas = usaAcelerador ? DATA.TASAS_ACELERADO : DATA.TASAS_NORMAL;
            } else {
                let escala = (sumaHome >= 16) ? 'N3' : (sumaHome >= 9 ? 'N2' : 'N1');
                tasas = DATA.TASAS_CORRETAJE[escala];
            }

            for (let i = 0; i < 5; i++) {
                // Regla Corretaje: Solo paga móviles si hay llaves (B2B/Hogar)
                if (esquema === "CORRETAJE" && !esLlave && sumaHome === 0) {
                    subtotal += 0;
                } else {
                    subtotal += (cant * obj.v * obj.p * tasas[i]);
                }
            }
            return Math.round(subtotal);
        };

        const res = {
            "B2B": calcVertical(b2b, DATA.PRECIOS.B2B, true),
            "HOGAR": calcVertical(hog, DATA.PRECIOS.HOGAR, true),
            "POSPAGO": calcVertical(posCalculo, DATA.PRECIOS.POSPAGO, false),
            "PREPAGO": calcVertical(pre, DATA.PRECIOS.PREPAGO, false)
        };

        // Renderizar Detalle
        for (let p in res) {
            totalAcumulado += res[p];
            let extraTag = (p === "POSPAGO" && posOriginal > 3) ? " (Tope 3)" : "";
            detalleHTML += `<div class="row-item"><span>${p}${extraTag}</span><strong>Gs. ${res[p].toLocaleString('es-PY')}</strong></div>`;
        }

        // 3. LÓGICA DE BONOS (ACELERADOR O VIÁTICO)
        let bonoExtra = 0;
        if (esquema === "STAFF") {
            // Acelerador QTY Fijo
            if (usaAcelerador) {
                if (sumaHome >= 46) bonoExtra = 1800000;
                else if (sumaHome >= 41) bonoExtra = 1500000;
                else if (sumaHome >= 36) bonoExtra = 1000000;
                else if (sumaHome >= 31) bonoExtra = 700000;
                
                totalAcumulado += bonoExtra;
                document.getElementById('display-acelerador').innerText = "🔥 ACELERADOR: Gs. " + bonoExtra.toLocaleString('es-PY');
            } else {
                document.getElementById('display-acelerador').innerText = "";
            }
            // Sumar Sueldo Fijo
            totalAcumulado += DATA.SUELDO_BASE;
            detalleHTML += `<div class="row-item" style="color:var(--azul-tigo);font-weight:bold;"><span>SUELDO BÁSICO</span><strong>Gs. ${DATA.SUELDO_BASE.toLocaleString('es-PY')}</strong></div>`;
        } else {
            // Viático Corretaje
            const tablaV = {6:800000, 7:900000, 8:1000000, 9:900000, 12:1000000, 15:1200000, 16:1200000, 20:1500000, 25:1700000};
            let keys = Object.keys(tablaV).map(Number).filter(k => k <= sumaHome).pop();
            bonoExtra = keys ? tablaV[keys] : 0;
            totalAcumulado += bonoExtra;
            document.getElementById('display-acelerador').innerText = bonoExtra > 0 ? "🚚 VIÁTICO: Gs. " + bonoExtra.toLocaleString('es-PY') : "";
        }

        // Mostrar Resultados
        document.getElementById('grid-detalles').innerHTML = detalleHTML;
        document.getElementById('display-total').innerText = "Gs. " + totalAcumulado.toLocaleString('es-PY');
        document.getElementById('resultados-area').classList.remove('hidden');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    };
});
