import { useId } from 'react'
import Checkbox from './Checkbox.jsx'
import EnlaceLinea from './EnlaceLinea.jsx'
import { cn } from '../utils/cn.js'

// Consentimiento de datos personales (Ley 7593/2025): casilla explícita por
// finalidad, con la versión de la política a la vista. **Nunca se marca sola**:
// sin `checked` arranca destildada y solo cambia por `onChange`; la app llama a
// `registroConsentimiento` al aceptar o revocar para persistir la trazabilidad.
export default function ConsentimientoDatos({
  checked = false,
  onChange,
  finalidad,
  detalle,
  politicaUrl,
  politicaTexto = 'Política de privacidad',
  onPolitica,
  version,
  error,
  disabled = false,
  required = false,
  id,
  className,
  ...props
}) {
  const generado = useId()
  const campoId = id || generado
  const politicaId = `${campoId}-politica`
  const errorId = `${campoId}-error`
  return (
    <div className={cn('space-y-1.5', className)} data-testid="consentimiento-datos">
      <Checkbox
        id={campoId}
        checked={Boolean(checked)}
        onChange={onChange}
        label={finalidad}
        descripcion={detalle}
        variante="tarjeta"
        disabled={disabled}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${politicaId} ${errorId}` : politicaId}
        {...props}
      />
      <p id={politicaId} className="text-xs leading-relaxed text-mute">
        {politicaUrl ? (
          <span>
            Leé la <EnlaceLinea href={politicaUrl} onClick={onPolitica}>{politicaTexto}</EnlaceLinea>
            {version ? ' · ' : null}
          </span>
        ) : null}
        {version ? <span>versión {version} · </span> : null}
        podés revocarlo cuando quieras.
      </p>
      {error && <p id={errorId} role="alert" className="text-xs text-bad-text">{error}</p>}
    </div>
  )
}
