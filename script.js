// script.js
document.getElementById('btn-calcular').addEventListener('click', () => {
    const p = CONFIG.PRODUCTOS;
    
    // Captura de valores de los inputs
    const vPospago = document.getElementById('input-POSPAGO').value || 0;
    const vB2b = document.getElementById('input-B2B').value || 0;
    const vHogar = document.getElementById('input-HOGAR').value || 0;
    const vPrepago = document.getElementById('input-PREPAGO').value || 0;

    // Validación simple en el output
    document.getElementById('detalle-productos').innerText = 
        `Inputs detectados -> Pospago: ${vPospago}, B2B: ${vB2b}, Hogar: ${vHogar}, Prepago: ${vPrepago}`;
});
