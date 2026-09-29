# Reglas del ecosistema OwnCoding (Segundo Cerebro)

Reglas **vigentes del ecosistema**, complementan a `docs/REGLAS.md` §15
(transversales) y aplican a **todas las apps del grupo** (MobOS, ScaleOS,
LedBox, PagaYa…). Este es el **anexo de ecosistema** —acceso, permisos,
seguridad, infraestructura, pagos, correo y publicación—; la interfaz (campos,
avisos, shell, pie, notificaciones) sigue en `docs/REGLAS.md`.

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
| Reutilización antes de crear | Este paquete + `docs/ALIMENTAR.md` y `docs/PLANTILLA-OBJETOS.md` |
