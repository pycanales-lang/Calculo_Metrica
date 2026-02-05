// script.js - TODO EN UNO (Configuración + Lógica)

const CONFIG = {
    PRODUCTOS: {
        POSPAGO: {
            nombre: "Pospago",
            valorPromedio: 15000,
            porcentajePago: 0.85,
            comisionNivel: 0.10
        },
        B2B: {
            nombre: "B2B",
            valorPromedio: 50000,
            porcentajePago: 0.90,
            comisionNivel: 0.12
        },
        HOGAR: {
            nombre: "Hogar",
            valorPromedio: 25000,
            porcentajePago: 0.80,
            comisionNivel: 0.15
        },
        PREPAGO: {
            nombre: "Prepago",
            valorPromedio: 2000,
            porcentajePago: 1.00,
            comisionNivel: 0.05
        }
    }
};

const calcular = () => {
    console.log("Iniciando cálculo..."); // Esto aparecerá en la consola (F12)
    
    let totalVariable = 0;
    let htmlDetalle = "<ul>";

    try {
        for (const clave in CONFIG.PRODUCTOS) {
            const producto = CONFIG.PRODUCTOS[clave];
            const inputElement = document.getElementById(`input-${clave}`);
            
            if (inputElement) {
                const cantidad = parseFloat(inputElement.value) || 0;

                // Lógica de negocio
                const ventaPonderada = cantidad * producto.valorPromedio * producto.porcentajePago;
                const comisionProducto = ventaPonderada * producto.comisionNivel;

                totalVariable += comisionProducto;

                htmlDetalle += `
                    <li style="display: flex; justify-content: space-between; margin-bottom: 5px; border-bottom: 1px solid #eee; padding: 5px;">
                        <span>${producto.nombre}:</span>
                        <strong>$${comisionProducto.toLocaleString('es-AR', {minimumFractionDigits: 2})}</strong>
                    </li>`;
            }
        }

        htmlDetalle += "</ul>";

        // Inyectar resultados
        document.getElementById('detalle-productos').innerHTML = htmlDetalle;
        document.getElementById('total-variable').innerText = `$${totalVariable.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
        
    } catch (err) {
        console.error("Error detallado:", err);
    }
};

// Asignar el evento cuando la ventana cargue
window.onload = () => {
    const btn = document.getElementById('btn-calcular');
    if (btn) {
        btn.onclick = calcular;
        console.log("Botón configurado correctamente.");
    } else {
        console.error("No se encontró el botón con ID 'btn-calcular'");
    }
};
