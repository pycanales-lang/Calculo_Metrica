document.addEventListener('DOMContentLoaded', function() {
    
    const CONFIG = {
        PRODUCTOS: {
            B2B:     { nombre: "B2B",     valor: 140000, pago: 0.65 },
            HOGAR:   { nombre: "Hogar",   valor: 140000, pago: 0.65 },
            POSPAGO: { nombre: "Pospago", valor: 75000,  pago: 0.65 },
            PREPAGO: { nombre: "Prepago", valor: 25000,  pago: 0.60 }
        },
        // MANTENEMOS STAFF INTACTO (Manual por nivel)
        NIVELES_STAFF: {
            "M0": 0.15, "M1": 0.15, "M2": 0.20, "M3": 0.30, "M4": 0.45
        },
        // TABLA DINÁMICA CORRETAJE (Pesos según Nivel 1, 2 o 3 del Excel)
        PESOS_CORRETAJE: {
            "M0": [0.30, 0.50, 0.50], // [Nivel 1 (1-8), Nivel 2 (9-15), Nivel 3 (16+)]
            "M1": [0.30, 0.50, 0.50],
            "M2": [0.30, 0.50, 0.75],
            "M3": [0.40, 0.50, 0.75],
            "M4": [0.50, 0.50, 1]
        }
    };

    // Función para obtener Viático según Escala (Exclusivo Corretaje)
    function obtenerViatico(cantidad) {
        if (cantidad < 6) return 0;
        if (cantidad >= 15) return 1700000; // Tope máximo según Excel
        let base = 800000; // Escala 6
        let extra = (cantidad - 6) * 100000;
        return base + extra;
    }

    const boton = document.getElementById('btn-calcular');

    if (boton) {
        boton.onclick = function() {
            let acumuladoVariable = 0;
            let productividadTotal = 0;
            let listaHtml = "<ul>";
            
            const esquema = document.getElementById('select-esquema').value;
            const nivelSeleccionado = document.getElementById('select-nivel').value;

            // Calculamos Productividad Total primero para Corretaje
            const vB2B = parseFloat(document.getElementById('input-B2B').value) || 0;
            const vHogar = parseFloat(document.getElementById('input-HOGAR').value) || 0;
            const vPos = parseFloat(document.getElementById('input-POSPAGO').value) || 0;
            const vPre = parseFloat(document.getElementById('input-PREPAGO').value) || 0;
            productividadTotal = vB2B + vHogar + vPos + vPre;

            const tieneLlave = (vB2B > 0 || vHogar > 0);

            // Determinar Tasa de Comisión
            let tasaComision = 0;
            if (esquema === "STAFF") {
                tasaComision = CONFIG.NIVELES_STAFF[nivelSeleccionado];
            } else {
                // Lógica de Niveles 1, 2, 3 para Corretaje
                let idx = 0;
                if (productividadTotal >= 9 && productividadTotal <= 15) idx = 1;
                else if (productividadTotal >= 16) idx = 2;
                tasaComision = CONFIG.PESOS_CORRETAJE[nivelSeleccionado][idx];
            }

            // Cálculo por producto
            for (const key in CONFIG.PRODUCTOS) {
                const p = CONFIG.PRODUCTOS[key];
                const cantidad = parseFloat(document.getElementById(`input-${key}`).value) || 0;
                let resultado = 0;

                if (key === "B2B" || key === "HOGAR") {
                    resultado = Math.round((cantidad * p.valor * p.pago) * tasaComision);
                } else {
                    resultado = tieneLlave ? Math.round((cantidad * p.valor * p.pago) * tasaComision) : 0;
                }

                acumuladoVariable += resultado;
                listaHtml += `<li style="display:flex; justify-content:space-between; border-bottom:1px solid #ccc; padding:8px 0;">
                                <span>${p.nombre}:</span> 
                                <strong>Gs. ${resultado.toLocaleString('es-PY')}</strong>
                              </li>`;
            }

            // Viático y Resumen Final
            let viatico = (esquema === "CORRETAJE") ? obtenerViatico(productividadTotal) : 0;
            
            if (viatico > 0) {
                listaHtml += `<li style="display:flex; justify-content:space-between; padding:8px 0; color: #2980b9; font-weight: bold;">
                                <span>Viático (Escala ${productividadTotal}):</span> 
                                <strong>Gs. ${viatico.toLocaleString('es-PY')}</strong>
                              </li>`;
            }

            listaHtml += "</ul>";
            const totalFinal = acumuladoVariable + viatico;

            document.getElementById('detalle-productos').innerHTML = 
                `<p style="font-size: 0.85rem; color: #666; margin-bottom: 10px;">
                    Modo: ${esquema} | Productividad: ${productividadTotal} | Peso Aplicado: ${(tasaComision*100).toFixed(0)}%
                </p>` + listaHtml;
            
            document.getElementById('total-variable').innerText = "Gs. " + totalFinal.toLocaleString('es-PY');
        };
    }
});
