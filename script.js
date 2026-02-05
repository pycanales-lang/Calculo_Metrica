function calcular() {

  // 1️⃣ Capturar ventas
  const b2b = Number(document.getElementById('b2b').value) || 0;
  const hogar = Number(document.getElementById('hogar').value) || 0;
  const pospago = Number(document.getElementById('pospago').value) || 0;
  const prepago = Number(document.getElementById('prepago').value) || 0;

  // 2️⃣ Venta ponderada por producto
  const ventaB2B =
    b2b *
    CONFIG.productos.b2b.valor *
    CONFIG.productos.b2b.pago;

  const ventaHogar =
    hogar *
    CONFIG.productos.hogar.valor *
    CONFIG.productos.hogar.pago;

  const ventaPospago =
    pospago *
    CONFIG.productos.pospago.valor *
    CONFIG.productos.pospago.pago;

  const ventaPrepago =
    prepago *
    CONFIG.productos.prepago.valor *
    CONFIG.productos.prepago.pago;

  // 3️⃣ Total ponderado
  const totalPonderado =
    ventaB2B +
    ventaHogar +
    ventaPospago +
    ventaPrepago;

  // 4️⃣ Comisión M0 (15%)
  const comision =
    totalPonderado *
    CONFIG.niveles.M0;

  // 5️⃣ Mostrar resultado
  document.getElementById('resultado').innerText =
    "Comisión estimada: $ " +
    comision.toLocaleString("es-ES");

}
