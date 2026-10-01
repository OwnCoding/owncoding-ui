import Icon from './Icon.jsx'

// Teclado numérico en pantalla (cobro en tablet/móvil): dígitos 1–9, «00», «0» y
// borrar. Portable: el valor entra y sale por props (`onChange` recibe el texto
// limpio), `max` limita el largo y no toca el input real del formulario.
const TECLAS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0']

export default function NumericKeypad({ value = '', onChange, max, className, ariaLabel = 'Teclado numérico de cobro' }) {
  function agregar(tecla) {
    const siguiente = `${value || ''}${tecla}`.replace(/^0+(?=\d)/, '')
    onChange(max ? siguiente.slice(0, max) : siguiente)
  }
  return (
    <div role="group" className={className ?? 'mt-2 grid max-w-[19rem] grid-cols-3 gap-2'} aria-label={ariaLabel}>
      {TECLAS.map((tecla) => (
        <button
          key={tecla}
          type="button"
          onClick={() => agregar(tecla)}
          className="min-h-11 rounded-xl border border-fore/10 bg-fore/[.04] text-lg font-semibold text-fore transition hover:border-fono/60 hover:bg-fono/10 active:scale-[.97]"
          aria-label={`Agregar ${tecla}`}
        >
          {tecla}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange((value || '').slice(0, -1))}
        className="min-h-11 rounded-xl border border-fore/10 bg-fore/[.04] text-mute transition hover:border-fono/60 hover:bg-fono/10 active:scale-[.97]"
        aria-label="Borrar último dígito"
      >
        <Icon name="backspace" className="mx-auto h-5 w-5" />
      </button>
    </div>
  )
}
