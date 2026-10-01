// Relaciones verificadas entre marcas de consumo/pago y las instituciones que
// les prestan servicios financieros. Este registro no clasifica a la marca como
// banco, financiera o EMPE y no importa los catálogos visuales, evitando ciclos.

export const FECHA_VERIFICACION_RELACIONES_FINANCIERAS = '2026-10-01'

const operador = (nombreLegal, fuenteOficial, extra = {}) => Object.freeze({
  nombreLegal,
  fuenteOficial,
  verificadoEn: FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  ...extra,
})

const relacion = (marca, datos) => Object.freeze({
  marca,
  verificadoEnRelacion: FECHA_VERIFICACION_RELACIONES_FINANCIERAS,
  actividad: 'activa',
  ...datos,
  alias: Object.freeze([...(datos.alias || [])]),
})

export const RELACIONES_FINANCIERAS = Object.freeze({
  Mango: relacion('Mango', {
    alias: ['Billetera Mango', 'Mango App'],
    financialProvider: 'Tu Financiera',
    fuenteRelacion: 'https://mangoapp.com.py/terms-and-conditions/',
    fuenteActividad: 'https://mangoapp.com.py/',
    operador: operador('Mango Payment S.A.', 'https://mangoapp.com.py/terms-and-conditions/', { ruc: '80108618-3' }),
  }),
  Vaquita: relacion('Vaquita', {
    alias: ['App Vaquita'],
    financialProvider: 'Finlatina',
    fuenteRelacion: 'https://www.vaquita.com.py/terminosycondiciones/',
    fuenteActividad: 'https://www.vaquita.com.py/',
    operador: operador('MUTECH S.R.L.', 'https://www.vaquita.com.py/terminosycondiciones/'),
  }),
  EKO: relacion('EKO', {
    alias: ['Eko', 'App Eko', 'Eko Paraguay'],
    institucionPadre: 'Banco Familiar',
    financialProvider: 'Banco Familiar',
    fuenteRelacion: 'https://www.eko.com.py/src/pdf/byc-billetera-eko.pdf',
    fuenteActividad: 'https://www.eko.com.py/',
    operador: operador('Banco Familiar S.A.E.C.A.', 'https://www.eko.com.py/src/pdf/byc-billetera-eko.pdf'),
  }),
  eCLUB: relacion('eCLUB', {
    alias: ['eClub', 'ECLUB'],
    financialProvider: 'Interfisa Banco',
    fuenteRelacion: 'https://eclub.com.py/',
    fuenteActividad: 'https://eclub.com.py/',
    operador: operador('ECLUB Paraguay S.A.', 'https://eclub.com.py/'),
  }),
  Pik: relacion('Pik', {
    alias: ['PIK'],
    financialProvider: 'Itaú',
    fuenteRelacion: 'https://www.pik.com.py/bases-y-condiciones-reintegros',
    fuenteActividad: 'https://www.pik.com.py/',
    operador: operador('Pont S.A.', 'https://www.pik.com.py/'),
  }),
})

export const MARCAS_CON_RELACION_FINANCIERA = Object.freeze(Object.keys(RELACIONES_FINANCIERAS))

export function normalizarRelacionFinanciera(texto) {
  return String(texto || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}

const INDICE_RELACIONES = new Map()
for (const [marca, registro] of Object.entries(RELACIONES_FINANCIERAS)) {
  for (const clave of [marca, ...registro.alias]) INDICE_RELACIONES.set(normalizarRelacionFinanciera(clave), marca)
}

export function relacionFinancieraDe(marca) {
  const canonica = INDICE_RELACIONES.get(normalizarRelacionFinanciera(marca))
  return canonica && Object.hasOwn(RELACIONES_FINANCIERAS, canonica) ? RELACIONES_FINANCIERAS[canonica] : null
}

export function buscarRelacionesFinancieras(consulta = '') {
  const termino = normalizarRelacionFinanciera(consulta)
  if (!termino) return MARCAS_CON_RELACION_FINANCIERA.map((marca) => RELACIONES_FINANCIERAS[marca])
  return MARCAS_CON_RELACION_FINANCIERA
    .map((marca) => RELACIONES_FINANCIERAS[marca])
    .filter((registro) => [
      registro.marca,
      ...registro.alias,
      registro.institucionPadre,
      registro.financialProvider,
      registro.operador.nombreLegal,
    ].filter(Boolean).some((valor) => normalizarRelacionFinanciera(valor).includes(termino)))
}

export function institucionesSugeridasPorMarca(consulta) {
  return [...new Set(buscarRelacionesFinancieras(consulta).flatMap((registro) => [
    registro.institucionPadre,
    registro.financialProvider,
  ]).filter(Boolean))]
}

export function marcasRelacionadasConInstitucion(institucion) {
  const termino = normalizarRelacionFinanciera(institucion)
  if (!termino) return []
  return MARCAS_CON_RELACION_FINANCIERA.filter((marca) => {
    const registro = RELACIONES_FINANCIERAS[marca]
    return [registro.institucionPadre, registro.financialProvider]
      .filter(Boolean)
      .some((valor) => normalizarRelacionFinanciera(valor) === termino)
  })
}
