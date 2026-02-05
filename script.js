function calcular() {

  // 1️⃣ Capturar ventas
  const b2b = Number(document.getElementById('b2b').value);
  const hogar = Number(document.getElementById('hogar').value);
  const pospago = Number(document.getElementById('pospago').value);
  const prepago = Number(document.getElementById('prepago').value);

  // 2️⃣ Calcular venta ponderada
  const calcB2B =
    b2b *
    CONFIG.productos.b2b.valor *
    CONFIG.productos.b2b.pago;

  const calcHogar =
    hogar *
    CONFIG.productos.hogar.valor *
    CONFIG.productos.hogar.pago;

  const calcPospago =
    pospago *
    CONFIG.productos.pospago.valor *
    CONFIG.productos.pospago.pago;

  const calcPrepago =
    prepago *
    CONFIG.productos.prepago.valor *
    CONFIG.productos.prepago.pago;

  // 3️⃣ Total base
  const totalBase =
    calcB2B +
    calcHogar +
    calcPospago +
    calcPrepago;

  // 4️⃣ Mostrar resultado
  document.getElementById('resultado').innerText =
    'Venta ponderada total: $ ' +
    totalBase.toLocaleString();
}
