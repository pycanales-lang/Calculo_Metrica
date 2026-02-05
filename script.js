// script.js
document.getElementById('btn-calcular').addEventListener('click', () => {
    // Probamos accediendo a un valor de la configuración
    const tasaPospago = CONFIG.PRODUCTOS.POSPAGO.comisionNivel * 100;
    
    document.getElementById('output').innerText = 
        `Configuración cargada. La tasa de comisión para Pospago es: ${tasaPospago}%`;
});
