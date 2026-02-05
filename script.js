// script.js
document.getElementById('btn-calcular').addEventListener('click', () => {
    const ventas = document.getElementById('ventas-pospago').value;
    document.getElementById('output').innerText = `El sistema está conectado. Valor ingresado: ${ventas}`;
    console.log("Conexión exitosa.");
});
