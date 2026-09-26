// Abastecimiento F1 (#250): prioridades, estados, contadores y la tarjeta de
// necesidad del panel «Por comprar».
import { describe, expect, test } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  ChipOrigen,
  ChipPrioridad,
  ContadoresCompra,
  ESTADOS_NECESIDAD,
  EtiquetaLote,
  ManifiestoEnvio,
  ORIGENES_NECESIDAD,
  PASOS_ENVIO,
  PASOS_NECESIDAD,
  PRIORIDADES_COMPRA,
  ResumenRecepcion,
  TarjetaCompra,
  TarjetaLote,
  TarjetaNecesidad,
  TarjetaRecepcion,
  claveDeEstado,
  claveDeEstadoCompra,
  claveDeEstadoEnvio,
  claveDePrioridad,
  claveRevision,
  colorDeTono,
  esIncidencia,
  estadoEnvio,
  etiquetaCompra,
  etiquetaEnvio,
  etiquetaMetodoEnvio,
  etiquetaNecesidad,
  etiquetaOrigen,
  etiquetaPrioridad,
  etiquetaRecepcion,
  etiquetaRevision,
  iconoMetodoEnvio,
  iconoOrigen,
  ordenarPorPrioridad,
  tonoNecesidad,
  tonoOrigen,
  tonoPrioridad,
  tonoRecepcion,
} from '../src/index.js'

describe('abastecimiento F1', () => {
  test('prioridades del contrato (URGENTE/ALTA/NORMAL/BAJA) con alias de la UI', () => {
    expect(Object.keys(PRIORIDADES_COMPRA)).toEqual(['urgente', 'alta', 'normal', 'baja'])
    expect(etiquetaPrioridad('URGENTE')).toBe('Urgente')
    expect(tonoPrioridad('urgente')).toBe('bad')
    expect(claveDePrioridad('ALTA')).toBe('alta')
    expect(etiquetaPrioridad('media')).toBe('Normal')
    expect(etiquetaPrioridad('desconocida')).toBe('Normal')
    const ordenadas = ordenarPorPrioridad([{ id: 1, prioridad: 'BAJA' }, { id: 2, prioridad: 'URGENTE' }, { id: 3 }])
    expect(ordenadas.map((n) => n.id)).toEqual([2, 3, 1])
  })

  test('orígenes con etiqueta, tono e ícono (y clave libre en mute)', () => {
    expect(Object.keys(ORIGENES_NECESIDAD)).toContain('sale_no_stock')
    expect(etiquetaOrigen('SALE_NO_STOCK')).toBe('Venta sin stock')
    expect(tonoOrigen('sale_no_stock')).toBe('warn')
    expect(iconoOrigen('RESERVATION_NO_STOCK')).toBe('clock')
    expect(etiquetaOrigen('CDE')).toBe('CDE')
    expect(tonoOrigen('CDE')).toBe('mute')
  })

  test('estados del contrato con alias de la UI', () => {
    for (const clave of ['ABIERTA', 'ASIGNADA', 'COMPRADA', 'RECIBIDA', 'CANCELADA']) {
      expect(ESTADOS_NECESIDAD[claveDeEstado(clave)], `falta ${clave}`).toBeTruthy()
    }
    expect(etiquetaNecesidad('ABIERTA')).toBe('Por comprar')
    expect(etiquetaNecesidad('por_comprar')).toBe('Por comprar')
    expect(claveDeEstado('COMPRADA')).toBe('comprada')
    expect(tonoNecesidad('incidencia')).toBe('bad')
    expect(etiquetaNecesidad('inexistente')).toBe('Por comprar')
    expect(PASOS_NECESIDAD[0]).toBe('abierta')
    expect(colorDeTono('ok')).toBe('green')
    expect(colorDeTono('x')).toBe('slate')
  })

  test('estados de compra, envío, método y recepción (contrato F2–F5)', () => {
    expect(etiquetaCompra('RECIBIDA')).toBe('Recibida')
    expect(etiquetaCompra('CANCELADA')).toBe('Cancelada')
    expect(claveDeEstadoCompra('EN_TRANSITO')).toBe('en_transito')
    expect(etiquetaEnvio('CON_INCIDENCIA')).toBe('Con incidencia')
    expect(claveDeEstadoEnvio('RECEPCION_PARCIAL')).toBe('recepcion_parcial')
    expect(estadoEnvio('desconocido').etiqueta).toBe('Borrador')
    expect(PASOS_ENVIO[0]).toBe('borrador')
    expect(etiquetaMetodoEnvio('IMPORTACION')).toBe('Importación')
    expect(iconoMetodoEnvio('aex')).toBe('send')
    expect(etiquetaRecepcion('CONFIRMADA')).toBe('Confirmada')
    expect(tonoRecepcion('cancelada')).toBe('mute')
  })

  test('TarjetaCompra y TarjetaLote muestran el contrato', () => {
    const compra = renderToStaticMarkup(
      <TarjetaCompra codigo="COM-CDE-0048" proveedor="Importadora XYZ" estado="COMPRADA" unidades={12} conImei={9} costo={1500} moneda="USD" referencia="Factura 001-123" />,
    )
    expect(compra).toContain('COM-CDE-0048')
    expect(compra).toContain('Importadora XYZ')
    expect(compra).toContain('Comprada')
    expect(compra).toContain('9 de 12')
    expect(compra).toContain('US$')
    expect(compra).toContain('Factura 001-123')

    const lote = renderToStaticMarkup(
      <TarjetaLote codigo="ENV-CDE-ASU-0021" estado="EN_TRANSITO" origen="CDE" destino="Asunción" metodo="BUS" empresa="Nsa" guia="123" unidades={12} conImei={9} eta="2026-10-02" />,
    )
    expect(lote).toContain('ENV-CDE-ASU-0021')
    expect(lote).toContain('CDE → Asunción')
    expect(lote).toContain('En tránsito')
    expect(lote).toContain('Bus')
    expect(lote).toContain('Nsa · Guía 123')
  })

  test('resultados de recepción tolerantes a las claves del backend (F5)', () => {
    expect(claveRevision('DANADO')).toBe('danado')
    expect(claveRevision('sin_imei')).toBe('sinImei')
    expect(etiquetaRevision('RECIBIDO')).toBe('Recibido')
    expect(esIncidencia('FALTANTE')).toBe(true)
    expect(esIncidencia('RECIBIDO')).toBe(false)
  })

  test('ResumenRecepcion cuenta por resultado (mapa del backend o ítems)', () => {
    const mapa = renderToStaticMarkup(<ResumenRecepcion resumen={{ RECIBIDO: 12, FALTANTE: 1, DANADO: 1 }} />)
    expect(mapa).toContain('12')
    expect(mapa).toContain('recibidos')
    expect(mapa).toContain('faltan')
    expect(mapa).toContain('dañadas')
    expect(mapa).toContain('text-bad')

    const items = renderToStaticMarkup(<ResumenRecepcion items={[{ resultado: 'RECIBIDO' }, { resultado: 'SOBRANTE' }]} />)
    expect(items).toContain('recibido')
    expect(items).toContain('sobran')
    expect(renderToStaticMarkup(<ResumenRecepcion resumen={{}} />)).toBe('')
  })

  test('TarjetaRecepcion muestra el lote por recibir', () => {
    const html = renderToStaticMarkup(
      <TarjetaRecepcion codigo="ENV-CDE-ASU-0021" estado="EN_TRANSITO" origen="CDE" destino="Asunción" metodo="BUS" eta="2026-10-02" unidades={12} conImei={9} deposito="Depósito 1" />,
    )
    expect(html).toContain('ENV-CDE-ASU-0021')
    expect(html).toContain('CDE → Asunción')
    expect(html).toContain('En tránsito')
    expect(html).toContain('Bus')
    expect(html).toContain('Depósito 1')
    expect(html).toContain('9 de 12')
  })

  test('ManifiestoEnvio imprime el lote con IMEI conocidos y pendientes', () => {
    const html = renderToStaticMarkup(
      <ManifiestoEnvio
        codigo="ENV-CDE-ASU-0021"
        origen="CDE"
        destino="Asunción"
        metodo="TRANSPORTADORA"
        empresa="AEX"
        guia="123"
        responsable="Ana"
        compra="COM-CDE-0048"
        lineas={[{ producto: 'iPhone 15', capacidad: '128 GB', condicion: 'NEW', cantidad: 6, imeis: ['356789104523178'], pendientes: 3 }]}
      />,
    )
    expect(html).toContain('ENV-CDE-ASU-0021')
    expect(html).toContain('CDE → Asunción')
    expect(html).toContain('Transportadora')
    expect(html).toContain('AEX')
    expect(html).toContain('COM-CDE-0048')
    expect(html).toContain('iPhone 15')
    expect(html).toContain('128 GB · Nuevo')
    expect(html).toContain('356789104523178')
    expect(html).toContain('3 IMEI pendientes')
    expect(html).toContain('6')
    expect(html).toContain('unidades')
  })

  test('EtiquetaLote: PRODUCTO n DE N, IMEI o pendiente y QR', () => {
    const etiqueta = renderToStaticMarkup(
      <EtiquetaLote codigo="ENV-CDE-ASU-0021" numero={3} total={12} producto="iPhone 15" variante="128 GB · Negro · Nuevo" serial="356789104523178" pedido="MOB-0042" destino="Asunción" />,
    )
    expect(etiqueta).toContain('Producto 3 de 12')
    expect(etiqueta).toContain('iPhone 15')
    expect(etiqueta).toContain('356789104523178')
    expect(etiqueta).toContain('MOB-0042')
    expect(etiqueta).toContain('Asunción')

    const pendiente = renderToStaticMarkup(<EtiquetaLote producto="X" pendienteImei qr="data:image/png;base64,AAA" />)
    expect(pendiente).toContain('IMEI pendiente')
    expect(pendiente).toContain('src="data:image/png;base64,AAA"')
  })

  test('ChipOrigen pinta el ícono y el tono del origen', () => {
    const html = renderToStaticMarkup(<ChipOrigen origen="SALE_NO_STOCK" />)
    expect(html).toContain('Venta sin stock')
    expect(html).toContain('text-warn')
    expect(html).toContain('<svg')
  })

  test('ChipPrioridad pinta el tono y acepta etiqueta propia', () => {
    const urgente = renderToStaticMarkup(<ChipPrioridad prioridad="URGENTE" />)
    expect(urgente).toContain('Urgente')
    expect(urgente).toContain('text-bad')
    expect(urgente).toContain('Prioridad urgente')
    expect(renderToStaticMarkup(<ChipPrioridad prioridad="alta" />)).toContain('text-warn')
    expect(renderToStaticMarkup(<ChipPrioridad prioridad="baja" etiqueta="Sin apuro" />)).toContain('Sin apuro')
  })

  test('ContadoresCompra: números tabulares, sin negativos', () => {
    const texto = renderToStaticMarkup(<ContadoresCompra pendiente={4} comprado={1} faltan={3} />)
    expect(texto).toContain('4')
    expect(texto).toContain('pendiente')
    expect(texto).toContain('faltan')
    expect(texto).toContain('text-bad')
    const chips = renderToStaticMarkup(<ContadoresCompra variante="chips" pendiente={-2} faltan={0} />)
    expect(chips).toContain('>0<')
    expect(chips).not.toContain('>-2<')
  })

  test('TarjetaNecesidad compone producto, prioridad, estado, fecha y destinos', () => {
    const html = renderToStaticMarkup(
      <TarjetaNecesidad
        producto="iPhone 15 Pro"
        variante="256 GB · Titanio natural · Nuevo"
        prioridad="URGENTE"
        estado="ABIERTA"
        origen="SALE_NO_STOCK"
        centro="CDE"
        fechaPrometida="2026-09-30"
        vinculo={{ etiqueta: 'Pedido MOB-0042' }}
        destinos={[{ etiqueta: 'Pedido MOB-0042', cantidad: 1 }, { etiqueta: 'stock', cantidad: 3 }]}
        pendiente={4}
        comprado={1}
        faltan={3}
        observaciones="El cliente confirmó color"
      />,
    )
    expect(html).toContain('iPhone 15 Pro')
    expect(html).toContain('256 GB')
    expect(html).toContain('Urgente')
    expect(html).toContain('Por comprar')
    expect(html).toContain('Venta sin stock')
    expect(html).toContain('CDE')
    expect(html).toContain('Pedido MOB-0042')
    expect(html).toContain('El cliente confirmó color')
    expect(html).toContain('data-estado="ABIERTA"')
    const conAbrir = renderToStaticMarkup(<TarjetaNecesidad producto="X" onAbrir={() => {}} acciones={<button>Abrir</button>} />)
    expect(conAbrir).toContain('<button')
    expect(conAbrir).toContain('Abrir')
  })
})
