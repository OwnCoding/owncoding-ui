import { useMemo, useState } from 'react'
import Icon from './Icon.jsx'
import { Button, EmptyState, Skeleton } from './ui.jsx'
import SegmentedField from './SegmentedField.jsx'
import { cn } from '../utils/cn.js'
import { TONOS } from '../utils/estadoEquipo.js'
import {
  DIAS_SEMANA,
  agruparPorDia,
  etiquetaDia,
  etiquetaDiaCorta,
  etiquetaMes,
  hoyClave,
  mismoMes,
  rangoMes,
  rangoSemana,
  sumarDias,
  sumarMeses,
} from '../utils/calendario.js'

// Calendario de una pantalla: grilla mensual (y vista semanal opcional) con los
// ítems que le pasa el consumidor, conteo por día, detalle del día elegido y
// lista por día en mobile (sin scroll horizontal).
//
// Portable: no hace fetch ni navega. `items` es una lista de `{ id, fecha,
// titulo, hora?, detalle?, tono?, href? }` con `fecha` en clave de día
// `YYYY-MM-DD` (ver `utils/calendario.js`); el rango visible se avisa por
// `onCambiarPeriodo(ancla, { desde, hasta, dias })` para que la pantalla pida
// los datos que correspondan. Cada ítem se puede dibujar a medida con
// `renderItem(item, { vista, dia })`.
//
// El día se maneja como día puro (sin hora ni zona): no se corre de fecha al
// viajar entre server y navegador. El "hoy" es el día local del equipo.

const TONO_ITEM = { info: TONOS.chip.info, ok: TONOS.chip.ok, warn: TONOS.chip.warn, bad: TONOS.chip.bad }

function ItemCalendario({ item, contexto, onElegir }) {
  const tono = TONO_ITEM[item.tono] || TONOS.chip.mute
  const titulo = [item.hora, item.titulo].filter(Boolean).join(' · ')
  const clases = cn(
    'flex w-full items-center gap-1.5 rounded-md border text-left transition hover:brightness-110',
    contexto.vista === 'lista' ? 'px-2.5 py-1.5 text-xs' : 'px-1.5 py-0.5 text-[11px]',
    tono,
  )
  const contenido = (
    <>
      {item.hora && <span className="shrink-0 tabular-nums opacity-80">{item.hora}</span>}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{item.titulo}</span>
        {contexto.vista === 'lista' && item.detalle && <span className="block truncate opacity-80">{item.detalle}</span>}
      </span>
    </>
  )
  const etiqueta = [titulo, item.detalle].filter(Boolean).join(' — ')
  return item.href ? (
    <a href={item.href} title={etiqueta} className={clases} onClick={() => onElegir?.(item)}>
      {contenido}
    </a>
  ) : (
    <button type="button" title={etiqueta} className={clases} onClick={() => onElegir?.(item)}>
      {contenido}
    </button>
  )
}

function ListaDias({ dias, porDia, hoy, onElegir, renderItem, soloConItems }) {
  const visibles = soloConItems ? dias.filter((dia) => (porDia.get(dia)?.length ?? 0) > 0 || dia === hoy) : dias
  if (!visibles.length) return <EmptyState compact icon="calendar" title="Sin movimientos en el período" />
  return (
    <div className="divide-y divide-ink-600/60">
      {visibles.map((dia) => {
        const delDia = porDia.get(dia) || []
        return (
          <section key={dia} className="py-2">
            <header className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-semibold text-fore">{etiquetaDia(dia)}</span>
              {dia === hoy && (
                <span className="rounded-full bg-fono/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-fono-text">Hoy</span>
              )}
            </header>
            <div className="mt-1 space-y-1">
              {delDia.length === 0 ? (
                <p className="px-1 text-xs text-mute">Sin movimientos</p>
              ) : (
                delDia.map((item, indice) =>
                  renderItem ? (
                    <div key={item.id ?? indice}>{renderItem(item, { vista: 'lista', dia })}</div>
                  ) : (
                    <ItemCalendario key={item.id ?? indice} item={item} contexto={{ vista: 'lista', dia }} onElegir={onElegir} />
                  ),
                )
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

export default function Calendario({
  items = [],
  vistas = ['mes'],
  vista,
  vistaPorDefecto = 'mes',
  onCambiarVista,
  ancla,
  anclaPorDefecto,
  onCambiarPeriodo,
  diaSeleccionado,
  onSeleccionarDia,
  onElegirItem,
  renderItem,
  maxPorDia = 2,
  cargando = false,
  mostrarDetalle = true,
  soloConItemsEnLista = true,
  hoy,
  ariaLabel = 'Calendario',
  className,
}) {
  const claveHoy = useMemo(() => hoyClave(hoy), [hoy])
  const [vistaInterna, setVistaInterna] = useState(vistaPorDefecto)
  const [anclaInterna, setAnclaInterna] = useState(() => anclaPorDefecto || ancla || claveHoy)
  const [seleccionInterna, setSeleccionInterna] = useState(null)

  const vistaActual = vistas.includes(vista) ? vista : vistas.includes(vistaInterna) ? vistaInterna : vistas[0] || 'mes'
  const anclaActual = String(ancla || anclaInterna || claveHoy).slice(0, 10)
  const seleccion = diaSeleccionado !== undefined ? diaSeleccionado : seleccionInterna

  const rango = useMemo(
    () => (vistaActual === 'semana' ? rangoSemana(anclaActual) : rangoMes(anclaActual)),
    [vistaActual, anclaActual],
  )
  const porDia = useMemo(() => agruparPorDia(items), [items])
  const totalEnRango = useMemo(
    () => rango.dias.reduce((suma, dia) => suma + (porDia.get(dia)?.length ?? 0), 0),
    [rango, porDia],
  )
  const delSeleccionado = seleccion ? porDia.get(seleccion) || [] : []

  const periodo =
    vistaActual === 'semana' ? `${etiquetaDiaCorta(rango.desde)} – ${etiquetaDiaCorta(rango.hasta)}` : etiquetaMes(anclaActual)

  function cambiarVista(siguiente) {
    if (vista === undefined) setVistaInterna(siguiente)
    onCambiarVista?.(siguiente)
    cambiarSeleccion(null)
  }

  function mover(delta) {
    const siguiente = vistaActual === 'semana' ? sumarDias(anclaActual, delta * 7) : sumarMeses(anclaActual, delta)
    if (ancla === undefined) setAnclaInterna(siguiente)
    onCambiarPeriodo?.(siguiente, vistaActual === 'semana' ? rangoSemana(siguiente) : rangoMes(siguiente))
    cambiarSeleccion(null)
  }

  function irHoy() {
    if (ancla === undefined) setAnclaInterna(claveHoy)
    onCambiarPeriodo?.(claveHoy, vistaActual === 'semana' ? rangoSemana(claveHoy) : rangoMes(claveHoy))
    cambiarSeleccion(claveHoy)
  }

  function cambiarSeleccion(dia) {
    if (diaSeleccionado === undefined) setSeleccionInterna(dia)
    onSeleccionarDia?.(dia)
  }

  return (
    <section className={cn('space-y-3', className)} aria-label={ariaLabel}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => mover(-1)}
            aria-label={vistaActual === 'semana' ? 'Semana anterior' : 'Mes anterior'}
            title={vistaActual === 'semana' ? 'Semana anterior' : 'Mes anterior'}
            className="toque-44 grid h-11 w-11 place-items-center rounded-lg border border-interactivo text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore"
          >
            <Icon name="back" className="h-4 w-4" />
          </button>
          <Button type="button" variant="outline" onClick={irHoy} title="Ir al día de hoy">
            Hoy
          </Button>
          <button
            type="button"
            onClick={() => mover(1)}
            aria-label={vistaActual === 'semana' ? 'Semana siguiente' : 'Mes siguiente'}
            title={vistaActual === 'semana' ? 'Semana siguiente' : 'Mes siguiente'}
            className="toque-44 grid h-11 w-11 place-items-center rounded-lg border border-interactivo text-mute transition hover:border-fono hover:bg-fono/10 hover:text-fore"
          >
            <Icon name="back" className="h-4 w-4 rotate-180" />
          </button>
        </div>

        <p className="order-last w-full text-sm font-semibold text-fore sm:order-none sm:w-auto" aria-live="polite">
          {periodo}
        </p>

        {vistas.length > 1 && (
          <SegmentedField
            value={vistaActual}
            onChange={cambiarVista}
            ariaLabel="Vista del calendario"
            options={[
              ['mes', 'Mes', 'calendar'],
              ['semana', 'Semana', 'list'],
            ]}
          />
        )}
      </div>

      {cargando ? (
        <div className="grid grid-cols-7 gap-1 p-1" role="status" aria-live="polite" aria-busy="true">
          <span className="sr-only">Cargando calendario…</span>
          {Array.from({ length: 35 }, (_, indice) => (
            <Skeleton key={indice} className="h-20" />
          ))}
        </div>
      ) : (
        <>
          {/* Escritorio: grilla real por semanas. */}
          <div className="hidden overflow-hidden rounded-xl border border-ink-600 md:block">
            <div className="grid grid-cols-7 border-b border-ink-600 bg-ink-900/60">
              {DIAS_SEMANA.map((dia) => (
                <span key={dia} className="px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-mute">
                  {dia}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {rango.dias.map((dia) => {
                const delDia = porDia.get(dia) || []
                const ocultos = delDia.length - maxPorDia
                const esHoy = dia === claveHoy
                const esSeleccionado = dia === seleccion
                return (
                  <div
                    key={dia}
                    data-fuera={mismoMes(dia, anclaActual) ? undefined : 'true'}
                    data-hoy={esHoy ? 'true' : undefined}
                    data-seleccionado={esSeleccionado ? 'true' : undefined}
                    className={cn(
                      'flex min-h-[6.5rem] flex-col gap-1 border-b border-r border-ink-600/60 p-1 last:border-r-0',
                      !mismoMes(dia, anclaActual) && 'bg-ink-800/40',
                      esSeleccionado && 'bg-fono/5',
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => cambiarSeleccion(esSeleccionado ? null : dia)}
                      aria-label={`Ver el detalle de ${etiquetaDia(dia)}`}
                      aria-pressed={esSeleccionado}
                      title={etiquetaDia(dia)}
                      className={cn(
                        'flex items-center justify-between rounded-md px-1 py-0.5 text-xs transition',
                        esHoy ? 'bg-fono/15 font-bold text-fono-text' : 'text-mute hover:bg-ink-700 hover:text-fore',
                      )}
                    >
                      <span className="tabular-nums">{Number(dia.slice(8, 10))}</span>
                      {delDia.length > 0 && (
                        <span className="rounded-full bg-ink-600 px-1 text-[10px] font-semibold tabular-nums text-mute" title={`${delDia.length} movimientos`}>
                          {delDia.length}
                        </span>
                      )}
                    </button>
                    <div className="space-y-0.5">
                      {delDia.slice(0, maxPorDia).map((item, indice) =>
                        renderItem ? (
                          <div key={item.id ?? indice}>{renderItem(item, { vista: 'grilla', dia })}</div>
                        ) : (
                          <ItemCalendario key={item.id ?? indice} item={item} contexto={{ vista: 'grilla', dia }} onElegir={onElegirItem} />
                        ),
                      )}
                    </div>
                    {ocultos > 0 && (
                      <button
                        type="button"
                        onClick={() => cambiarSeleccion(dia)}
                        title={`Ver ${delDia.length} movimientos`}
                        className="rounded-md px-1 text-left text-[10px] font-semibold text-fono-light transition hover:bg-fono/10"
                      >
                        +{ocultos} más
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile: lista por día (sin grilla apretada ni scroll horizontal). */}
          <div className="md:hidden">
            <ListaDias
              dias={rango.dias}
              porDia={porDia}
              hoy={claveHoy}
              onElegir={onElegirItem}
              renderItem={renderItem}
              soloConItems={soloConItemsEnLista}
            />
          </div>
        </>
      )}

      {!cargando && totalEnRango === 0 && (
        <div role="status"><EmptyState compact icon="calendar" title="Sin movimientos en el período" /></div>
      )}

      {mostrarDetalle && seleccion && (
        <section className="rounded-xl border border-ink-600 bg-ink-800 p-3" aria-label={`Detalle de ${etiquetaDia(seleccion)}`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold text-fore">{etiquetaDia(seleccion)}</p>
            <div className="flex items-center gap-2">
              <span className="text-xs tabular-nums text-mute">
                {delSeleccionado.length} {delSeleccionado.length === 1 ? 'movimiento' : 'movimientos'}
              </span>
              <Button type="button" variant="ghost" onClick={() => cambiarSeleccion(null)} title="Cerrar el detalle del día">
                Cerrar
              </Button>
            </div>
          </div>
          {delSeleccionado.length === 0 ? (
            <EmptyState compact icon="calendar" title="Sin movimientos" description="Elegí otro día o navegá a otro período." />
          ) : (
            <div className="mt-2 space-y-1">
              {delSeleccionado.map((item, indice) =>
                renderItem ? (
                  <div key={item.id ?? indice}>{renderItem(item, { vista: 'lista', dia: seleccion })}</div>
                ) : (
                  <ItemCalendario key={item.id ?? indice} item={item} contexto={{ vista: 'lista', dia: seleccion }} onElegir={onElegirItem} />
                ),
              )}
            </div>
          )}
        </section>
      )}
    </section>
  )
}
