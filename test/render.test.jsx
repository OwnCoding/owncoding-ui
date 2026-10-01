import { describe, expect, test, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  Aviso,
  FormField,
  DataTable,
  Badge,
  BarraProgreso,
  Button,
  Card,
  CeldaMoneda,
  ChipEstado,
  ChipsLocks,
  ConteoChecklist,
  EmptyState,
  ErrorState,
  FichaCertificado,
  FilaChecklist,
  FilaDato,
  BarraLote,
  CampoSeriales,
  ColumnaLote,
  ContadorLote,
  DestinoRecepcion,
  FilaRevision,
  GradoBadge,
  IconAction,
  IconoCategoria,
  EstadoBadge,
  ListGridToggle,
  NumericKeypad,
  PeriodoTabs,
  ProductCombobox,
  RucField,
  SeccionColapsable,
  SegmentedField,
  SerialTexto,
  Subtabs,
  Input,
  Label,
  IndicadorConexion,
  MedidorBateria,
  PasosEquipo,
  MedidorStock,
  ResumenDestinos,
  ResumenIncidencias,
  SelectorIncidencia,
  TileRol,
  Vencimiento,
  Money,
  Modal,
  PageHeader,
  Nota,
  Select,
  SemaforoItem,
  Skeleton,
  SectionState,
  Stat,
  Stepper,
  Switch,
  Textarea,
  TileEquipo,
  VistaPreviaPapel,
} from '../src/index.js'
import { BotonDentroCampo, imeiValido } from '../src/index.js'
import { CELDA_DATO, CELDA_ENCABEZADO, CELDA_NUMERO, ROTULO_DATO, ROTULO_SECCION } from '../src/index.js'

// Smoke mínimo: los objetos renderizan en el servidor y el HTML trae el
// contrato (rol, aria, clase). No reemplaza al QA visual de cada app.

describe('render de los objetos base', () => {
  test('botón y campos', () => {
    expect(renderToStaticMarkup(<Button>Guardar</Button>)).toContain('>Guardar<')
    expect(renderToStaticMarkup(<Button variant="outline" disabled>Guardar</Button>)).toContain('disabled')
    expect(renderToStaticMarkup(<Input value="hola" readOnly />)).toContain('value="hola"')
    expect(renderToStaticMarkup(<Textarea rows={2} defaultValue="nota" />)).toContain('rows="2"')
    expect(renderToStaticMarkup(<Label htmlFor="x">Nombre</Label>)).toContain('for="x"')
    expect(renderToStaticMarkup(<Select value="a" onChange={() => {}}><option value="a">A</option></Select>)).toContain('<select')
  })

  test('avisos con el rol que corresponde', () => {
    expect(renderToStaticMarkup(<Aviso>Error</Aviso>)).toContain('role="alert"')
    expect(renderToStaticMarkup(<Aviso tono="ok">Listo</Aviso>)).toContain('role="status"')
    expect(renderToStaticMarkup(<Aviso tono="warn">Ojo</Aviso>)).toContain('border-warn/30')
    expect(renderToStaticMarkup(<Aviso como="div"><b>Error</b></Aviso>)).toContain('<div role="alert"')
  })

  test('estados, cápsulas y celdas', () => {
    expect(renderToStaticMarkup(<EmptyState title="Nada" />)).toContain('Nada')
    expect(renderToStaticMarkup(<ErrorState description="Falló" />)).toContain('Falló')
    expect(renderToStaticMarkup(<Skeleton className="h-4" />)).toContain('animate-pulse')
    expect(renderToStaticMarkup(<Badge color="green">Activo</Badge>)).toContain('Activo')
    // Dentro del scope v2 el chip va tipo pill (clase del scope, no estilo suelto).
    expect(renderToStaticMarkup(<Badge color="green">Activo</Badge>)).toContain('v2-chip')
    expect(renderToStaticMarkup(<Stat label="Ventas" valor="10" />)).toContain('Ventas')
    expect(renderToStaticMarkup(<Card>Contenido</Card>)).toContain('Contenido')
  })

  test('IconAction: el tamaño táctil agranda el área y conserva el contrato', () => {
    // #13: el chico mide 44 px reales en móvil y vuelve a 28 px en escritorio.
    const chico = renderToStaticMarkup(<IconAction icon="eye" label="Ver resumen" />)
    expect(chico).toContain('aria-label="Ver resumen"')
    expect(chico).toContain('h-11 w-11 md:h-7 md:w-7')
    const tactil = renderToStaticMarkup(<IconAction icon="eye" label="Ver resumen" tone="fono" size="touch" />)
    expect(tactil).toContain('aria-label="Ver resumen"')
    expect(tactil).toContain('h-9 w-9')
    // 36 px de dibujo + 44 px de área de toque (#249).
    expect(tactil).toContain('toque-44')
    expect(tactil).not.toContain('h-11 w-11')
  })

  test('los controles agrupados miden 44 px de alto (#249)', () => {
    const segmentado = renderToStaticMarkup(<SegmentedField value="dia" onChange={() => {}} options={[['dia', 'Día'], ['mes', 'Mes']]} />)
    expect(segmentado).toContain('min-h-11')
    const solapas = renderToStaticMarkup(<Subtabs value="uno" onChange={() => {}} items={[['uno', 'Uno', 12], ['dos', 'Dos']]} />)
    expect(solapas).toContain('>12<')
    expect(solapas).toContain('min-h-11')
    const lista = renderToStaticMarkup(<ListGridToggle value="list" onChange={() => {}} />)
    expect(lista).toContain('toque-44')
  })

  test('el estado de sección compone los objetos que ya existen (#1)', () => {
    const vacio = renderToStaticMarkup(<SectionState title="Sin cobros" description="Todavía no hay movimientos" action={<button>Crear cobro</button>} />)
    expect(vacio).toContain('Sin cobros')
    expect(vacio).toContain('Todavía no hay movimientos')
    expect(vacio).toContain('Crear cobro')
    expect(vacio).not.toContain('role="alert"')

    const cargando = renderToStaticMarkup(<SectionState estado="cargando" description="Cargando cobros" />)
    expect(cargando).toContain('animate-pulse') // Skeleton, no un spinner nuevo
    expect(cargando).toContain('role="status"')
    expect(cargando).toContain('aria-busy="true"')

    const error = renderToStaticMarkup(<SectionState estado="error" description="No pudimos cargar los cobros" onRetry={() => {}} />)
    expect(error).toContain('Algo salió mal') // predeterminado de ErrorState
    expect(error).toContain('role="alert"')
    expect(error).toContain('Reintentar')
    expect(error).toContain('py-12')

    const compacto = renderToStaticMarkup(<SectionState estado="error" title="Falló" compact />)
    expect(compacto).toContain('py-6')
    expect(compacto).not.toContain('py-12')
  })

  test('dinero, fila de dato y barra de progreso', () => {
    expect(renderToStaticMarkup(<Money value={1201032} />)).toContain('Gs 1.201.032')
    expect(renderToStaticMarkup(<Money value={1234.56} currency="USD" />)).toContain('US$ 1,234.56')
    expect(renderToStaticMarkup(<CeldaMoneda valor={150000} tono="ok" />)).toContain('Gs 150.000')
    expect(renderToStaticMarkup(<FilaDato etiqueta="Pagado" valor="Gs 10.000" />)).toContain('Pagado')
    const barra = renderToStaticMarkup(<BarraProgreso valor={30} etiqueta="Avance" />)
    expect(barra).toContain('role="progressbar"')
    expect(barra).toContain('30%')
  })

  test('el switch es un checkbox accesible', () => {
    const html = renderToStaticMarkup(<Switch checked onChange={() => {}} ariaLabel="Activo" />)
    expect(html).toContain('type="checkbox"')
    expect(html).toContain('checked')
  })

  test('no se exporta un alias Toggle: el interruptor es uno solo (#186)', async () => {
    const modulo = await import('../src/index.js')
    expect(modulo.Toggle).toBeUndefined()
    expect(typeof modulo.Switch).toBe('function')
  })

  test('las clases de tabla son únicas y estables', () => {
    expect(ROTULO_DATO).toBe('text-[10px] font-bold uppercase tracking-wider text-mute')
    expect(CELDA_ENCABEZADO).toBe(`truncate ${ROTULO_DATO}`)
    expect(ROTULO_SECCION).toBe('text-xs font-bold uppercase tracking-wider text-mute')
    expect(CELDA_DATO).toBe('truncate text-xs text-mute')
    expect(CELDA_NUMERO).toBe('text-right tabular-nums')
  })

  test('el modal elige el ancho por tamaño y el botón vive dentro del campo', () => {
    const amplio = renderToStaticMarkup(<Modal open title="Proveedores" size="amplio">…</Modal>)
    expect(amplio).toContain('max-w-3xl')
    expect(renderToStaticMarkup(<Modal open title="Aviso" />)).toContain('max-w-xl')
    expect(renderToStaticMarkup(<Modal open title="Chico" size="corto" />)).toContain('max-w-md')
    // El cierre del modal conserva el alto táctil de 44 px (#249).
    expect(renderToStaticMarkup(<Modal open title="Aviso" onClose={() => {}} />)).toContain('toque-44 rounded-lg p-2')
    expect(renderToStaticMarkup(<Modal open title="Grande" size="completo" />)).toContain('max-w-5xl')

    const boton = renderToStaticMarkup(<BotonDentroCampo etiqueta="Extraer los datos del RUC" />)
    expect(boton).toContain('Extraer los datos del RUC')
    expect(boton).toContain('absolute inset-y-0 right-0')
    const ocupado = renderToStaticMarkup(<BotonDentroCampo etiqueta="Extraer" ocupado />)
    expect(ocupado).toContain('Consultando…')
    expect(ocupado).toContain('animate-spin')
  })

  test('la nota y la barra de gráfico salen de los objetos', () => {
    const nota = renderToStaticMarkup(<Nota>Sin seguimiento asignado</Nota>)
    expect(nota).toContain('border-warn/30 bg-warn/10')
    expect(nota).toContain('text-mute')
    expect(nota).not.toContain('role="status"')
    expect(renderToStaticMarkup(<Nota tono="info" compact>Dato de referencia</Nota>)).toContain('border-info/25 bg-info/10')
    expect(renderToStaticMarkup(<Nota tono="neutro">Neutra</Nota>)).toContain('border-ink-600 bg-ink-800/40')

    const barra = renderToStaticMarkup(<BarraProgreso valor={30} max={60} pista="bg-ink-600" relleno="bg-blue-line" etiqueta="Ventas del mes" />)
    expect(barra).toContain('role="progressbar"')
    expect(barra).toContain('bg-ink-600')
    expect(barra).toContain('bg-blue-line')
    expect(barra).toContain('aria-valuenow="50"')
    expect(renderToStaticMarkup(<BarraProgreso valor={10} tono="onbrand" />)).toContain('bg-onbrand')
  })

  test('operación de equipos: semáforo, chips, batería, grado, tile y stepper (#240/#241)', () => {
    const punto = renderToStaticMarkup(<SemaforoItem estado="falla" etiqueta="Pantalla" detalle="Rayón profundo" />)
    expect(punto).toContain('Pantalla: Falla')
    expect(punto).toContain('Rayón profundo')
    expect(punto).toContain('text-bad')

    const fila = renderToStaticMarkup(<FilaChecklist etiqueta="Face ID" estado="ok" nota="Probado en 3 intentos" />)
    expect(fila).toContain('Face ID')
    expect(fila).toContain('Probado en 3 intentos')
    const conteo = renderToStaticMarkup(<ConteoChecklist pasan={12} total={12} />)
    expect(conteo).toContain('12 de 12 pass')
    expect(conteo).toContain('text-pass')
    expect(renderToStaticMarkup(<ConteoChecklist pasan={10} total={12} fallas={2} />)).toContain('2 fallas')

    const chip = renderToStaticMarkup(<ChipEstado estado="pass" />)
    expect(chip).toContain('Certificado')
    expect(chip).toContain('border-pass/30')
    expect(renderToStaticMarkup(<ChipEstado estado="falla" />)).toContain('Con fallas')

    const locks = renderToStaticMarkup(<ChipsLocks locks={[{ clave: 'icloud', estado: 'libre' }, { clave: 'mdm', estado: 'activo' }, { clave: 'esn', estado: 'desconocido' }]} />)
    expect(locks).toContain('iCloud / Find My')
    expect(locks).toContain('MDM: Activo')
    expect(locks).toContain('ESN / lista negra: Sin dato')

    const bateria = renderToStaticMarkup(<MedidorBateria porcentaje={86} ciclos={412} />)
    expect(bateria).toContain('86%')
    expect(bateria).toContain('412 ciclos')
    expect(bateria).toContain('role="progressbar"')
    expect(renderToStaticMarkup(<MedidorBateria porcentaje={null} />)).toContain('Sin dato')
    expect(renderToStaticMarkup(<MedidorBateria porcentaje={72} variante="chip" />)).toContain('text-bad')

    const grado = renderToStaticMarkup(<GradoBadge grado="B" conDescripcion />)
    expect(grado).toContain('Grado B')
    expect(grado).toContain('Marcas leves de uso')
    expect(renderToStaticMarkup(<GradoBadge grado="Z" />)).toContain('Z')

    const stepper = renderToStaticMarkup(<Stepper pasos={[{ id: 'intake', etiqueta: 'Intake' }, { id: 'diag', etiqueta: 'Diagnóstico' }, { id: 'listo', etiqueta: 'Listo' }]} actual="diag" hechos={['intake']} />)
    expect(stepper).toContain('Intake')
    expect(stepper).toContain('Diagnóstico')
    expect(stepper).toContain('text-pass')
    // El paso actual lleva la utilidad del v2 (burbuja azul AA en el scope).
    expect(stepper).toContain('oc-paso-activo')

    const tile = renderToStaticMarkup(<TileEquipo modelo="iPhone 13" imei="•••• 1234" estado="pass" grado="A" bateria={94} locks={[{ clave: 'icloud', estado: 'libre' }]} />)
    expect(tile).toContain('iPhone 13')
    expect(tile).toContain('•••• 1234')
    expect(tile).toContain('Certificado')
    expect(tile).toContain('Grado A')
    expect(tile).toContain('94%')
    expect(tile).toContain('iCloud / Find My')
    expect(renderToStaticMarkup(<TileEquipo modelo="MacBook Pro" />)).toContain('M5 5h14v10H5z')

    const icono = renderToStaticMarkup(<IconoCategoria categoria="AirPods" />)
    expect(icono).toContain('<svg')
    expect(icono).toContain('M7 3.5a3 3 0 0 1 3 3v7')
    expect(renderToStaticMarkup(<IconoCategoria categoria="Servicio" />)).toContain('<svg')
    expect(renderToStaticMarkup(<IconoCategoria icono="mobile" />)).toContain('M8 2h8a2 2 0 0 1 2 2v16')
  })

  test('la ficha de certificado compone los objetos del informe (#240)', () => {
    const ficha = renderToStaticMarkup(
      <FichaCertificado
        empresa="Tienda Demo"
        modelo="iPhone 13"
        imei="•••• 1234"
        grado="B"
        bateria={86}
        ciclos={412}
        locks={[{ clave: 'icloud', estado: 'libre' }, { clave: 'mdm', estado: 'desconocido' }]}
        aprobados={11}
        total={12}
        verificadoPor="Ana"
        verificadoAt="22/09/2026 10:30"
        enlace="https://moboss.online/u/DEMO0001"
      />,
    )
    expect(ficha).toContain('iPhone 13')
    expect(ficha).toContain('•••• 1234')
    expect(ficha).toContain('Grado B')
    expect(ficha).toContain('86%')
    expect(ficha).toContain('412 ciclos')
    expect(ficha).toContain('11 de 12 pass')
    expect(ficha).toContain('iCloud / Find My: Libre')
    expect(ficha).toContain('MDM: Sin dato')
    expect(ficha).toContain('Verificado por Ana · 22/09/2026 10:30')
    expect(ficha).toContain('Certificado')
    // El QR se genera en el cliente (useEffect): en SSR no aparece la imagen.
    expect(ficha).not.toContain('<img')
    expect(renderToStaticMarkup(<FichaCertificado modelo="iPad" total={0} />)).toContain('Sin verificación física')
    // El chip de la cabecera refleja el estado real del equipo cuando la app lo pasa.
    expect(renderToStaticMarkup(<FichaCertificado modelo="iPad" estado="revision" />)).toContain('En revisión')
  })

  test('Stat con tono y nota, dinero con símbolo propio y chip de negocio', () => {
    const kpi = renderToStaticMarkup(<Stat label="Por cobrar" valor="Gs 1.200.000" tono="danger" nota="3 cobros vencidos" />)
    expect(kpi).toContain('Por cobrar')
    expect(kpi).toContain('text-bad')
    expect(kpi).toContain('3 cobros vencidos')
    // Compatibilidad: sin tono el valor sigue en el color de texto de siempre.
    expect(renderToStaticMarkup(<Stat label="Ventas" valor="10" />)).toContain('text-fore')

    expect(renderToStaticMarkup(<Money value={1201032} simbolo="Gs." />)).toContain('Gs. 1.201.032')
    expect(renderToStaticMarkup(<Money value={1201032} />)).toContain('Gs 1.201.032')
    expect(renderToStaticMarkup(<CeldaMoneda valor={150000} simbolo="₲" />)).toContain('₲ 150.000')

    const chip = renderToStaticMarkup(<ChipEstado estado="aprobado" />)
    expect(chip).toContain('Aprobado')
    expect(chip).toContain('border-ok/30')
    expect(chip).toContain('data-estado="aprobado"')
    expect(chip).toContain('title="Aprobado"')
    const etiquetaPropia = renderToStaticMarkup(<ChipEstado estado="vencido" etiqueta="Pago vencido" tono="warn" />)
    expect(etiquetaPropia).toContain('Pago vencido')
    expect(etiquetaPropia).toContain('border-warn/30')
  })

  test('la vista previa del papel usa el ancho real del formato (#241)', () => {
    const previa = renderToStaticMarkup(<VistaPreviaPapel formato="thermal-80" contenido="<p>Hola</p>" titulo="Vista previa del comprobante" />)
    expect(previa).toContain('max-w-[302px]')
    expect(previa).toContain('mx-auto')
    expect(previa).toContain('title="Vista previa del comprobante"')
    expect(renderToStaticMarkup(<VistaPreviaPapel formato="a4" contenido="<p>A4</p>" />)).toContain('max-w-[794px]')
    expect(renderToStaticMarkup(<VistaPreviaPapel formato="thermal-58" contenido="x" />)).toContain('max-w-[219px]')
    expect(renderToStaticMarkup(<VistaPreviaPapel formato="desconocido" contenido="x" />)).not.toContain('mx-auto')
  })

  test('los objetos de dato y detalle del lote 20 renderizan con su contrato', () => {
    // EstadoBadge: etiqueta y color del mapa; crudo y vacío explícito si falta.
    const estados = { PENDIENTE: { label: 'Pendiente', color: 'orange' }, PAGADO: { label: 'Pagado', color: 'green' } }
    expect(renderToStaticMarkup(<EstadoBadge mapa={estados} valor="PAGADO" />)).toContain('Pagado')
    expect(renderToStaticMarkup(<EstadoBadge mapa={estados} valor="RARO" />)).toContain('RARO')
    expect(renderToStaticMarkup(<EstadoBadge mapa={estados} valor="" />)).toContain('Sin estado')

    // SerialTexto: el final siempre visible y el vacío explícito.
    const serial = renderToStaticMarkup(<SerialTexto serial="356789104523178" />)
    expect(serial).toContain('3178')
    expect(serial).toContain('title="356789104523178"')
    expect(renderToStaticMarkup(<SerialTexto serial="" />)).toContain('—')

    // SeccionColapsable: cerrada por defecto, con el panel oculto pero en el DOM.
    const seccion = renderToStaticMarkup(<SeccionColapsable titulo="Detalle" resumen="3 ítems"><p>contenido</p></SeccionColapsable>)
    expect(seccion).toContain('aria-expanded="false"')
    expect(seccion).toContain('hidden=""')
    expect(seccion).toContain('contenido')
    expect(renderToStaticMarkup(<SeccionColapsable titulo="Detalle" abierta><p>contenido</p></SeccionColapsable>)).toContain('aria-expanded="true"')
    // `id` es alias de `clave` (apps que ya lo llamaban así): no rompe el render.
    expect(renderToStaticMarkup(<SeccionColapsable id="pedido-1" titulo="Detalle" abierta><p>contenido</p></SeccionColapsable>)).toContain('aria-expanded="true"')

    // ProductCombobox: contrato de combobox (la lista se abre recién al tipear).
    const combo = renderToStaticMarkup(<ProductCombobox products={[{ id: 'p1', nombre: 'iPhone 15' }]} />)
    expect(combo).toContain('role="combobox"')
    expect(combo).toContain('aria-expanded="false"')
    expect(combo).toContain('aria-autocomplete="list"')

    // RucField: el extractor solo aparece si la app pasa `consultar`.
    const ruc = renderToStaticMarkup(<RucField value="80012345-6" onChange={() => {}} consultar={async () => ({ name: 'ACME' })} />)
    expect(ruc).toContain('Extraer los datos del RUC')
    expect(ruc).toContain('La razón social se aplica solo si la confirmás.')
    const sinConsultar = renderToStaticMarkup(<RucField value="80012345-6" onChange={() => {}} />)
    expect(sinConsultar).not.toContain('Extraer los datos del RUC')
  })

  test('los componentes del lote 22 renderizan con su contrato', () => {
    const barra = renderToStaticMarkup(<BarraLote cantidad={3} onLimpiar={() => {}}><button>Exportar</button></BarraLote>)
    expect(barra).toContain('3 seleccionada(s)')
    expect(barra).toContain('Exportar')
    expect(renderToStaticMarkup(<BarraLote cantidad={0} />)).toBe('')

    const periodos = renderToStaticMarkup(<PeriodoTabs periodo="mes" setPeriodo={() => {}} />)
    expect(periodos).toContain('Mes')
    expect(periodos).toContain('aria-pressed="true"')

    const teclado = renderToStaticMarkup(<NumericKeypad value="12" onChange={() => {}} />)
    expect(teclado).toContain('aria-label="Agregar 00"')
    expect(teclado).toContain('aria-label="Borrar último dígito"')
    expect(teclado).toContain('<svg')
  })
  test('PageHeader con miga de sección (lote 23)', () => {
    const html = renderToStaticMarkup(<PageHeader title="Unidades" migas={[{ etiqueta: 'Inventario', href: '/pos/inventario' }, { etiqueta: 'Unidades' }]} />)
    expect(html).toContain('aria-label="Miga de sección"')
    expect(html).toContain('href="/pos/inventario"')
    expect(html).toContain('aria-current="page"')
    expect(renderToStaticMarkup(<PageHeader title="Unidades" />)).not.toContain('Miga de sección')
  })
  test('los objetos del abastecimiento y el stepper en tarjetas (lote 24)', () => {
    // Stepper del flujo de entrega (variante tarjetas).
    const tarjetas = renderToStaticMarkup(<Stepper variante="tarjetas" pasos={['Pendiente', 'Preparando', 'En camino', 'Entregado']} actual={2} />)
    expect(tarjetas).toContain('sm:grid-flow-col')
    expect(tarjetas).toContain('En camino')
    expect(tarjetas).toContain('oc-paso-activo')
    expect(tarjetas).toContain('bg-ok/15')

    // Campo de seriales por lote: cuenta listos, repetidos e inválidos.
    const campo = renderToStaticMarkup(<CampoSeriales valor={'490154203237518\n490154203237518\n12345'} validar={imeiValido} />)
    expect(campo).toContain('1 listo(s) para cargar')
    expect(campo).toContain('1 repetido(s)')
    expect(campo).toContain('1 inválido(s)')
    expect(campo).toContain('490154203237518')

    // Medidor de stock contra el punto de reposición.
    expect(renderToStaticMarkup(<MedidorStock stock={0} umbral={5} />)).toContain('Agotado')
    expect(renderToStaticMarkup(<MedidorStock stock={3} umbral={5} />)).toContain('Reponer')
    expect(renderToStaticMarkup(<MedidorStock stock={24} umbral={5} />)).toContain('24 de 5')
    expect(renderToStaticMarkup(<MedidorStock stock={null} umbral={5} />)).toContain('Sin dato')
    expect(renderToStaticMarkup(<MedidorStock stock={2} umbral={5} variante="chip" />)).toContain('border-warn/30')
    expect(renderToStaticMarkup(<MedidorStock stock={2} umbral={5} variante="barra" />)).toContain('role="progressbar"')
  })
  test('los objetos de envíos y recepción (lote 25)', () => {
    // Contador de lote «N de M».
    expect(renderToStaticMarkup(<ContadorLote recibidos={3} total={12} />)).toContain('3 de 12')
    expect(renderToStaticMarkup(<ContadorLote recibidos={12} total={12} variante="chip" />)).toContain('border-ok/30')
    expect(renderToStaticMarkup(<ContadorLote recibidos={3} total={12} variante="barra" mostrarFaltan />)).toContain('faltan 9')
    expect(renderToStaticMarkup(<ContadorLote total={12} />)).toContain('Sin dato')

    // Destinos de la compra consolidada.
    const destinos = renderToStaticMarkup(<ResumenDestinos destinos={[{ etiqueta: 'Pedido MOB-0042', cantidad: 1 }, { etiqueta: 'Stock', cantidad: 3 }]} />)
    expect(destinos).toContain('Pedido MOB-0042')
    expect(destinos).toContain('Stock')
    expect(renderToStaticMarkup(<ResumenDestinos destinos={[]} />)).toBe('')

    // Incidencias de la recepción.
    const incidencias = renderToStaticMarkup(<ResumenIncidencias incidencias={[{ tipo: 'faltante', cantidad: 2 }, { tipo: 'sinImei', cantidad: 5 }]} />)
    expect(incidencias).toContain('Faltan')
    expect(incidencias).toContain('Sin IMEI')
    expect(renderToStaticMarkup(<ResumenIncidencias incidencias={[{ tipo: 'faltante', cantidad: 0 }]} />)).toContain('Sin incidencias')

    // Banner de conexión del shell (superficie roja con texto legible por tema).
    const banner = renderToStaticMarkup(<IndicadorConexion enLinea={false} variante="banner" />)
    expect(banner).toContain('bg-bad')
    expect(banner).toContain('text-white dark:text-onbrand')
    expect(renderToStaticMarkup(<IndicadorConexion enLinea pendientes={3} variante="banner" onSincronizar={() => {}} />)).toContain('Sincronizar')
  })
  test('los objetos de recepción (lote 26)', () => {
    // Fila de revisión: estado del mapa compartido y serial con los últimos 4.
    const fila = renderToStaticMarkup(<FilaRevision etiqueta="iPhone 15 · 128 GB" serial="356789104523178" estado="ok" />)
    expect(fila).toContain('iPhone 15')
    expect(fila).toContain('3178')
    expect(fila).toContain('>OK<')
    const faltante = renderToStaticMarkup(<FilaRevision etiqueta="AirPods" estado="faltante" detalle="No llegó" />)
    expect(faltante).toContain('Falta')
    expect(faltante).toContain('border-bad/25')
    expect(faltante).toContain('No llegó')
    expect(renderToStaticMarkup(<FilaRevision etiqueta="iPad" />)).toContain('IMEI pendiente')

    // Selector de incidencia: activo con el tono del tipo y vuelve a null.
    const selector = renderToStaticMarkup(<SelectorIncidencia valor="danado" tipos={['danado', 'incorrecto']} />)
    expect(selector).toContain('aria-pressed="true"')
    expect(selector).toContain('Dañada')
    expect(selector).toContain('border-bad/40')
    expect(selector).not.toContain('Sin IMEI')

    // Cierre de la recepción: depósito, un clic y aviso de IMEI pendientes.
    const cierre = renderToStaticMarkup(<DestinoRecepcion destino={{ id: 'dep-1', nombre: 'Depósito 1' }} depositos={[{ id: 'dep-1', nombre: 'Depósito 1' }, { id: 'dep-2', nombre: 'Depósito 2' }]} pendientes={3} onRecibir={() => {}} />)
    expect(cierre).toContain('Depósito 1')
    expect(cierre).toContain('Recibir todo')
    expect(cierre).toContain('3 unidad(es) sin IMEI')
    expect(cierre).toContain('<select')
    const sinAlternativas = renderToStaticMarkup(<DestinoRecepcion destino={{ id: 'dep-1', nombre: 'Depósito 1' }} onRecibir={() => {}} />)
    expect(sinAlternativas).not.toContain('<select')
    expect(sinAlternativas).toContain('Recibir todo')
  })
  test('los objetos de los lotes A/C/E/F/G (lote 28)', () => {
    // Stat en modo consola: delta como chip y barra cuando no hay delta.
    const chip = renderToStaticMarkup(<Stat label="Ventas" valor="12" delta={4.2} deltaComo="chip" />)
    expect(chip).toContain('v2-numero')
    expect(chip).toContain('bg-ok/15')
    expect(chip).toContain('↑ 4.2%')
    const barra = renderToStaticMarkup(<Stat label="Ticket" valor="Gs 250.000" barra="bad" />)
    expect(barra).toContain('bg-bad')

    // Stepper compacto del servicio (puntos + paso actual).
    const pasos = renderToStaticMarkup(<PasosEquipo pasos={['Por verificar', 'Verificado', 'Listo']} actual={1} />)
    expect(pasos).toContain('Paso 2 de 3: Verificado')
    expect(pasos).toContain('data-paso="2"')
    expect(pasos).toContain('w-5 bg-fono')
    expect(renderToStaticMarkup(<PasosEquipo pasos={[{ id: 'a', etiqueta: 'Uno' }, { id: 'b', etiqueta: 'Dos' }]} actual="b" />)).toContain('Paso 2 de 2: Dos')

    // Tile de rol/acceso.
    const rol = renderToStaticMarkup(<TileRol titulo="Gerente" descripcion="Opera el día a día" cantidad={18} total={32} dominios={[{ etiqueta: 'Ventas', activo: true }, { etiqueta: 'Finanzas' }]} />)
    expect(rol).toContain('Gerente')
    expect(rol).toContain('18')
    expect(rol).toContain('/32')
    expect(rol).toContain('Ventas')
    expect(rol).toContain('bg-ok/15') // chip verde del dominio activo
    expect(renderToStaticMarkup(<TileRol titulo="Vendedor" onAbrir={() => {}} />)).toContain('<button')

    // Ficha del certificado: contrato pendiente del informe público (#240).
    const ficha = renderToStaticMarkup(<FichaCertificado modelo="iPhone 15" puntaje={85} condicion="Seminuevo" repuestosNoOem="Pantalla" repuestosNoOemNota="Cambio con repuesto no original" />)
    expect(ficha).toContain('Puntaje')
    expect(ficha).toContain('85%')
    expect(ficha).toContain('Condición')
    expect(ficha).toContain('Seminuevo')
    expect(ficha).toContain('Repuestos no OEM')
    expect(ficha).toContain('Cambio con repuesto no original')
  })
  test('los objetos del taller/rack y servicio (lote 29)', () => {
    // Stepper en tarjetas con detalle (el pipeline del taller con conteos).
    const flujo = renderToStaticMarkup(<Stepper variante="tarjetas" ariaLabel="Flujo del taller" pasos={[{ etiqueta: 'Recepción', detalle: '2 equipos' }, { etiqueta: 'Diagnóstico', detalle: '1 equipo' }, 'Reparación']} actual={1} />)
    expect(flujo).toContain('aria-label="Flujo del taller"')
    expect(flujo).toContain('2 equipos')
    expect(flujo).toContain('oc-paso-activo')

    // Columna de lote: cabecera con chip, contador y acciones; vacío explícito.
    const columna = renderToStaticMarkup(<ColumnaLote etiqueta="Por verificar" tono="orange" contador={5} acciones={<button>Imprimir (5)</button>}><div>Equipo</div></ColumnaLote>)
    expect(columna).toContain('Por verificar')
    expect(columna).toContain('Imprimir (5)')
    expect(columna).toContain('Equipo')
    const vacia = renderToStaticMarkup(<ColumnaLote etiqueta="Listo" vacio="Sin equipos" />)
    expect(vacia).toContain('Sin equipos')

    // Vencimiento con semáforo.
    const vencido = renderToStaticMarkup(<Vencimiento fecha="2020-01-01" variante="chip" />)
    expect(vencido).toContain('venció')
    expect(vencido).toContain('border-bad/30')
    const porVencer = renderToStaticMarkup(<Vencimiento fecha={new Date(Date.now() + 3 * 86400000).toISOString()} />)
    expect(porVencer).toContain('en 3 d')
    expect(porVencer).toContain('text-warn')
    expect(renderToStaticMarkup(<Vencimiento fecha={null} />)).toContain('—')
  })
})

describe('DataTable (#109)', () => {
  test('sin tope de altura: la página scrollea y solo queda overflow horizontal', () => {
    const html = renderToStaticMarkup(
      <DataTable columns={[{ key: 'nombre', label: 'Nombre' }]} rows={[{ id: 'a', nombre: 'Ana' }]} />,
    )
    expect(html).toContain('overflow-x-auto')
    expect(html).not.toContain('max-h-')
    expect(html).not.toContain('overflow-auto')
    // #114: el encabezado no es pegajoso por defecto (evita superponerse).
    expect(html).not.toContain('sticky top-12')
    expect(html).toContain('select-none')

    const fijo = renderToStaticMarkup(
      <DataTable encabezadoFijo columns={[{ key: 'nombre', label: 'Nombre' }]} rows={[{ id: 'a', nombre: 'Ana' }]} />,
    )
    expect(fijo).toContain('sticky top-12')
  })

  test('conserva los datos en tarjetas móviles genéricas y expone semántica de tabla', () => {
    const getRowKey = vi.fn((row) => `persona-${row.id}`)
    const html = renderToStaticMarkup(
      <DataTable
        caption="Personas"
        getRowKey={getRowKey}
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'correo', label: 'Correo', render: (row) => <a href={`mailto:${row.correo}`}>{row.correo}</a> },
          { key: 'interno', label: 'Interno', mobile: false },
        ]}
        rows={[{ id: 'a', nombre: 'Ana', correo: 'ana@example.com', interno: 'oculto en móvil' }]}
      />,
    )
    expect(html).toContain('<caption class="sr-only">Personas</caption>')
    expect(html).toContain('scope="col"')
    expect(html).toContain('<dl')
    expect(html).toContain('<dt class="text-xs font-medium text-mute">Nombre</dt>')
    expect(html).toContain('ana@example.com')
    expect(html).not.toContain('text-xs font-medium text-mute">Interno</dt>')
    expect(getRowKey).toHaveBeenCalledWith(expect.objectContaining({ id: 'a' }), 0)
  })

  test('el estado de carga se anuncia sin exponer una tabla vacía', () => {
    const html = renderToStaticMarkup(<DataTable columns={[]} rows={[]} loading />)
    expect(html).toContain('role="status"')
    expect(html).toContain('aria-busy="true"')
    expect(html).toContain('Cargando datos…')
  })
})

describe('FormField con acción (#112)', () => {
  test('label → fila [input + botón] → hint debajo de la fila', () => {
    const html = renderToStaticMarkup(
      <FormField label="RUC / C.I." htmlFor="ruc" hint="Con el padrón conectado el titular se completa solo." accion={<Button>Consultar titular</Button>}>
        <input id="ruc" />
      </FormField>,
    )
    const input = html.indexOf('<input')
    const boton = html.indexOf('Consultar titular')
    const hint = html.indexOf('Con el padrón conectado')
    expect(input).toBeGreaterThan(-1)
    expect(boton).toBeGreaterThan(input)
    expect(hint).toBeGreaterThan(boton)
    expect(html).toContain('min-w-0 flex-1')
    expect(html).toContain('shrink-0')
  })
})
