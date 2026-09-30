# Reglas del ecosistema OwnCoding (Segundo Cerebro)

Reglas **vigentes del ecosistema**, complementan a `docs/REGLAS.md` §15
(transversales) y aplican a **todas las apps del grupo** (MobOS, ScaleOS,
LedBox, PagaYa…). Este es el **anexo de ecosistema** —acceso, permisos,
seguridad, infraestructura, pagos, correo, publicación y **datos personales
(Ley 7593/2025, §12)**—; la interfaz (campos, avisos, shell, pie,
notificaciones) sigue en `docs/REGLAS.md`.

**Docs canónicos del Segundo Cerebro (`Apps/Reglas/`):**
1. *Reglas de diseño de aplicaciones* (18/09).
2. *OwnCoding Hub — guía operativa* (28/09).
3. *AEX — API de integraciones* (solo si la app integra AEX; ver §AEX).

**Alcance y límites**

- Estas reglas son **universales del ecosistema**. Las **reglas propias por
  app** (Scale OS, MobOS, PagaYa…) viven en cada app y **no se promueven** a
  este documento.
- Donde una regla toca la interfaz, el objeto vive en la biblioteca y el
  detalle UI en `docs/REGLAS.md`: **pie y versión (§14)**, **formato de
  notificaciones (§16)** y **reglas transversales (§15)**; las referencias
  cruzadas están al final.

---

## 1. Acceso y cuentas

- Siempre correo + contraseña; Google/OAuth es adicional.
- Registro inicial corto; perfil, empresa y datos extra después.
- Recuperación visible junto al login.
- Contraseñas ocultas con botón de ver/ocultar; sesiones seguras y revocables.
- OAuth con `state`, PKCE, `nonce`, email verificado y cookies seguras.

## 2. Permisos y datos

- Roles/permisos centralizados y validados en servidor.
- Aislamiento estricto por empresa; nunca confiar en `tenantId` del navegador.
- Auditoría de accesos, permisos, eliminaciones, descuentos y finanzas.
- PIN individual y trazabilidad para operación sensible.

## 3. Eliminación y privacidad

- Zona visible de eliminación/cierre de cuenta.
- Reautenticación, doble confirmación, exportación y período recuperable.
- Archivar antes de borrar; nunca eliminar historial financiero auditable.

## 4. Seguridad técnica

- Secretos solo en variables privadas del servidor: nunca Git, frontend, logs ni SC.
- Rate-limit en login, recuperación, PIN, archivos y enlaces públicos.
- CSP, HSTS, CORS limitado, protección contra framing y carga segura de archivos.
- Backups y restauración probada antes de datos reales.

## 5. Diseño, marca y publicación

- Componentes compartidos para footer/versión, OAuth, botones, favicon, SEO y layouts.
- **Un componente por tipo de dato** (moneda, correo, RUC/CI, teléfono, fecha,
  búsqueda, porcentaje…): el campo sale de la biblioteca y la pantalla no
  reimplementa su lógica; editar el objeto corrige a todas las apps (interfaz:
  `docs/REGLAS.md` §1).
- Un solo activo visual canónico para logo, favicon, PWA, emails y tarjetas.
- Cada ruta debe tener URL recuperable, autorización y footer común con versión real.
- Antes de publicar: build, flujos críticos, permisos sin privilegios, HTTPS, dominio, health y smoke test.

## 6. Versionado y pendientes

- Una única fuente de versión; cada deploy incrementa parche y la versión visible debe ser la realmente publicada.
- Al cerrar trabajo: versión desplegada, agentes y pendientes numerados.
- Pendientes separados entre implementables, bloqueados externos y mejoras futuras.

## 7. Reutilización

- Antes de crear algo nuevo, buscar bases/componentes en GitHub.
- Evaluar licencia, actividad, seguridad, compatibilidad y costo de personalización.
- Personalizar producto, UX, datos y marca; no copiar interfaces sin revisión.
- **Biblioteca primero, sin duplicar:** si el objeto existe en este paquete, se
  usa ese y la variante se pide por **prop**; la copia local se borra en el
  mismo cambio. Reimplementar un campo o su lógica por pantalla queda prohibido
  (fuente única por tipo de dato, interfaz en `docs/REGLAS.md` §1).
- **Editar una vez, corregir todas:** la lógica compartida (validación,
  normalización, formato y alineación de los campos) vive en la biblioteca; el
  arreglo entra ahí y las apps lo reciben al subir la versión fija.

## 8. Infraestructura OwnCoding Hub

- Hub/Coolify es la infraestructura por defecto: deploy, PostgreSQL, variables, logs, healthchecks y backups.
- Un repo privado y servicio propio por app; variables reales solo en Hub.
- Secretos runtime sin “Build Variable” salvo necesidad real.
- Webhook aceptado no es deploy sano: confirmar finalización, healthcheck y smoke.
- Backup creado no equivale a recuperación: hay que restaurarlo y probarlo.

## 9. Correo WEEM

- Todas las apps usan WEEM como relay transaccional mientras compartan dominio.
- Perfil, token, alias, logo y color propios por app (alias tipo `scaleos@weem.com.py`).
- Invitaciones, recuperación, verificación y avisos deben salir con identidad de la app.
- Aceptación HTTP no prueba entrega final.

## 10. SaaS, pagos y dominios

- Empresa activa separada de la identidad de la persona.
- Pagos solo se acreditan mediante webhook firmado, idempotente y validado.
- Estados explícitos: borrador, pendiente, pagado, fallido, reembolsado, cancelado y abandonado.
- Dominios nuevos requieren DNS, HTTPS, OAuth, cookies, webhooks, recovery email y staging.
- No romper links antiguos al cambiar dominio.

## 11. Demos, RUC, admin y UX

- Demos aisladas: sin correos, cobros ni datos reales.
- RUC desde servidor, con revisión manual antes de guardar y aislamiento por empresa.
- Superadmin separado del dueño de una agencia, con privilegio global y auditoría.
- Cuadrícula/lista con selector compacto por iconos, preferencia guardada.
- Notificaciones en popup accesible; acciones frecuentes con iconos y tooltip.
- Búsqueda contextual sin acciones destructivas.
- Invitaciones revocables, vencibles, auditables y con Google o correo/contraseña.

## 12. Protección de datos personales (Ley 7593/2025)

La **Ley N° 7593/2025 «De Protección de Datos Personales»** aplica a todo dato
de una persona física que trate una app del grupo. El **negocio es el
responsable** ante el titular y el ecosistema (Hub, WEEM, AEX…) actúa como su
**encargado**; la autoridad de control es la **Agencia Nacional de Protección
de Datos Personales (MITIC)**. Estas reglas son el piso operativo —finalidad,
transparencia, seguridad y derechos del titular— para formularios, APIs, logs,
correo y demos; el encuadre legal de cada negocio lo valida su asesoría.

### 12.1 Finalidad, base legal y consentimiento

- **Finalidad determinada y visible por dato.** Cada campo tiene un «para qué»
  documentado y visible en el punto de recolección; no se recolecta «por si
  acaso» ni se reutilizan los datos para fines incompatibles con el informado.
- **Minimización.** Solo lo necesario para esa finalidad; los datos opcionales
  se marcan como opcionales y no bloquean el flujo (documento, dirección o
  fecha de nacimiento se piden solo cuando operan).
- **Consentimiento granular, explícito y no pre-tildado.** Una casilla por
  finalidad, separada de los términos y condiciones; arranca **sin marcar** y
  se registra **versión de la política, fecha y canal** de cada aceptación. Es
  **revocable en cualquier momento**, con la misma trazabilidad que la
  aceptación y efecto inmediato.
- **Datos sensibles con controles extra** (salud, biometría, menores,
  situaciones financieras): consentimiento explícito, acceso por rol mínimo,
  cifrado en tránsito y en reposo, sin PII sensible en logs, URLs ni push, y
  revisión previa antes de exponerlos.

### 12.2 Transparencia (aviso y política de privacidad)

- **Aviso en cada punto de recolección** —login, registro, reserva, checkout,
  formularios con datos y **pie institucional** (`ProductFooter`)—: dice la
  finalidad y enlaza la política; nunca queda en letra chica ni solo en un
  documento descargable.
- **Política pública, clara y accesible** (es-PY, sin jerga legal): quién trata
  los datos y cómo contactarlo, para qué, cuánto tiempo, con quién se comparten
  (encargados y ubicación), cómo ejercer los derechos y cómo reclamar ante la
  autoridad.
- **Versionado de la política:** versión y fecha visibles; un cambio material
  se anuncia y obliga a **volver a pedir consentimiento** si toca las
  finalidades; la versión anterior queda consultable.
- **Rol plataforma vs. negocio:** el negocio informa que es responsable y el
  ecosistema que actúa como encargado por su cuenta; ambos roles quedan
  escritos en la política y en el vínculo entre las partes.

### 12.3 Seguridad y privacidad por defecto

- **Aislamiento por empresa y permisos** (§2): validación en servidor, sin
  confiar en el navegador; **auditoría** de accesos, cambios y exportaciones de
  datos personales (quién, cuándo, qué y desde dónde).
- **Secretos solo en el entorno** (§4) y cifrado de los datos personales y sus
  respaldos en tránsito y en reposo.
- **Minimización de PII en logs, errores, correo y notificaciones:** documento,
  teléfono y correo enmascarados; nunca datos completos, tokens ni clases de
  dato en URLs ni en la pantalla bloqueada (§16).
- **Demos y pruebas sin datos reales** (§11): seeds, `demoStorage`, staging y
  capacitaciones con datos ficticios.
- **Rate-limit** en login, recuperación, exportación y endpoints de datos
  (§4); **procedimiento de brechas**: detectar, contener, evaluar, registrar y
  notificar a la autoridad y a los titulares afectados dentro del plazo legal,
  con un canal visible para reportar incidentes.

### 12.4 Derechos del titular

- **Acceso, rectificación, supresión (cancelación), oposición y revocación**
  —y **portabilidad** cuando la app ofrezca exportación—, gratuitos y sin
  justificar el pedido.
- **Zona visible de privacidad** en el perfil/configuración y **canal
  alternativo** (correo o WhatsApp) para quien no puede entrar; la respuesta
  llega **dentro de los 30 días corridos**.
- **Exportación y eliminación en autoservicio** con reautenticación, doble
  confirmación y **período recuperable**; la baja de la cuenta conserva el
  historial financiero auditable (§3), restringido y sin otras finalidades.
- **Verificación razonable de identidad** sin pedir más datos que los
  necesarios para confirmar que es el titular.
- La **revocación** deja de tratar el dato para esa finalidad y se registra
  igual que la aceptación (versión, fecha y canal).

### 12.5 Encargados, retención y destrucción

- **Encargados documentados:** cada tercero (WEEM, Hub/Coolify, pasarelas,
  analítica, soporte o proveedores) con finalidad, datos compartidos, ubicación
  y contrato; no hay transferencias sorpresa.
- **Retención por tipo con plazo definido** (comunicaciones hasta la
  revocación, operación mientras dure la relación, logs acotados…); al vencer
  se **elimina o anonimiza** de forma verificable, también en respaldos y en
  los encargados.
- **Excepción de historial financiero auditable:** se conserva por obligación
  contable/fiscal (§3), con acceso restringido y sin reutilizarse para otras
  finalidades.

### 12.6 Privacidad por diseño en la interfaz

- En cada punto de recolección se muestra **finalidad + enlace a la política**
  con `AvisoPrivacidad`; el consentimiento va con `ConsentimientoDatos`
  (casilla explícita, versión visible y **nunca pre-tildada**).
- **Consentimientos separados** (esencial vs. comunicaciones/marketing) y
  **estado visible** en el perfil: qué se aceptó, qué versión y cómo revocarlo.
- **Datos rectificables** desde la propia pantalla; la corrección se propaga y
  queda auditada.
- **Derechos alcanzables en ≤2 clics** desde donde viven los datos y desde el
  pie; los enlaces no se esconden.
- La app registra aceptación y revocación con `registroConsentimiento`
  (finalidad, versión, fecha, canal y titular) y lo persiste para auditoría.

**Checklist por app (adopción):**

- [ ] Cada dato personal tiene finalidad visible y solo se piden los necesarios.
- [ ] Consentimientos separados, sin pre-tildar, con versión/fecha/canal y
      revocación a la vista.
- [ ] Política pública y versionada, enlazada desde login, registro, reserva,
      checkout y pie.
- [ ] Zona de privacidad + canal alternativo; respuesta en ≤30 días corridos.
- [ ] Auditoría de accesos, PII enmascarada en logs, demos sin datos reales y
      procedimiento de brechas escrito.
- [ ] Encargados y retención documentados, con borrado/anonimización al vencer.
- [ ] Exportación y eliminación con doble confirmación y período recuperable;
      revocación accesible.

---

## AEX (referencia opcional)

Solo para las apps que **integren AEX**: sandbox, claves protegidas, webhooks y
paso controlado a producción. Guía canónica: *AEX — API de integraciones*
(`Apps/Reglas/`). **No** es un requisito del ecosistema para el resto de las
apps.

---

## Referencias cruzadas con la biblioteca

| Regla del ecosistema | Dónde vive en la biblioteca / docs |
| --- | --- |
| Acceso: correo + contraseña, OAuth adicional, recuperación visible, contraseñas ocultas y enlaces de correo | `AuthLayout`, `GoogleButton`, `PasswordInput`, `PegarEnlaceToken` y `docs/REGLAS.md` §2 bis; el flujo y los tokens son del backend |
| OAuth con `state`, PKCE, `nonce`, email verificado y cookies seguras | 100% servidor: la UI solo usa `GoogleButton`; tokens y sesiones en `docs/TOKENS.md` de la app |
| Permisos, aislamiento por empresa, auditoría y PIN | Backend + shell; la UI usa los bloqueos de autorización y el PIN del POS (`docs/REGLAS.md` §10) |
| Eliminación/privacidad: reautenticación, doble confirmación, archivar antes de borrar | `ConfirmarConPalabra` (confirmación reforzada) y las reglas de confirmación de `docs/REGLAS.md` §5 |
| Diseño/publicación: footer con versión real, marca canónica y URLs recuperables | **§14 Pie institucional** (`ProductFooter`) y **§15.7** rutas canónicas; versión única con `hayVersionNueva`/`compararVersiones` |
| Versionado visible («la versión visible es la publicada») | **§14** (pie) + **§15.10** (aviso de versión nueva); `partesVersion`/`compararVersiones` |
| Notificaciones: popup accesible, identidad por app, avisos al usuario | **§16 Formato de notificaciones** (`CampanaAvisos`, `payloadPush`, `enHorarioSilencioso`) y **§15.6** microcopy |
| Cero éxito falso en pagos, webhooks, relay y deploy | **§15.1** + **§16** («sin relay → en cola, no enviado»); la confirmación real es del backend |
| UX: cuadrícula/lista con selector compacto y preferencia guardada; iconos con tooltip; búsqueda contextual | `ListGridToggle`, `IconAction`, `Switch`, `SearchField`/`PaletaComandos` y `docs/REGLAS.md` §1; el «último usado» es el patrón #209 |
| Demos aisladas (sin correos, cobros ni datos reales) | **§15.2 Paridad demo** y los seeds/`demoStorage` de cada app |
| Protección de datos (finalidad visible, consentimiento sin pre-tildar y revocable, política versionada, derechos del titular) | **§12** + `AvisoPrivacidad` y `ConsentimientoDatos` (`docs/REGLAS.md` §1 y §15); `registroConsentimiento` arma el registro, el backend lo persiste y responde |
| Seguridad de datos personales (auditoría, PII enmascarada, demos sin datos reales, brechas) | §2 y §4 (aislamiento y secretos), §11 (demos) y **§12.3** |
| Reutilización antes de crear | Este paquete + `docs/ALIMENTAR.md` y `docs/PLANTILLA-OBJETOS.md` |
