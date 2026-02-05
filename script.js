function calcular() {
  const b2b = Number(document.getElementById('b2b').value);
  const hogar = Number(document.getElementById('hogar').value);
  const pospago = Number(document.getElementById('pospago').value);
  const prepago = Number(document.getElementById('prepago').value);

  const totalVentas = b2b + hogar + pospago + prepago;

  document.getElementById('resultado').innerText =
    'Ventas cargadas: ' + totalVentas;
}
