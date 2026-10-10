# App Store — checklist canónico (publicación móvil)

Alcance: las apps del grupo, iPhone e iPad cuando corresponda. Checklist de
trabajo: **no garantiza aprobación** de Apple. Este doc no contiene credenciales.

**Cuenta:** Apple Developer (USD99/año) **disponible según el dueño**; membresía,
App Store Connect y acuerdos **no verificados** de forma independiente. No se
marca la cuenta como verificada hasta que el dueño aporte el estado real. Los
datos de cuenta, acuerdos, firma, identidad legal, billing y mercados son
**inputs/decisiones indelegables del dueño** cuando faltan.

## Autonomía técnica (alcance aprobado)

- Cumplir el alcance aprobado **incluye** desarrollar la API móvil/backend,
  preparar un cliente compatible (Expo u otro que corresponda) y las
  adaptaciones necesarias. No se vuelve a pedir autorización general ni por
  dependencia técnica concreta.
- Si un endpoint no existe, **se implementa de verdad** antes de afirmar que la
  app quedó conectada; un scaffold no entrega.
- La arquitectura se decide contra el inventario real de cada app (web, tenant,
  auth, roles, datos y contrato de API vigente). **Swift no es obligatorio**;
  se reutiliza la movilidad existente antes de agregar un stack paralelo.
- La UI reutiliza los objetos de esta biblioteca (`docs/REGLAS.md`); el equipo
  mantiene web/tenant/auth/roles/datos con tests significativos.
- La app debe aportar utilidad más allá de la web reempaquetada (guía 4.2).

## Checklist

### Cuenta y alcance

- [x] Cuenta Apple Developer **disponible según el dueño**, sin verificación
      independiente.
- [ ] Membresía activa, App Store Connect y acuerdos.
- [ ] Nombre/responsable/idiomas/países/compatibilidad iPhone-iPad por app.
- Fuente: <https://developer.apple.com/help/account/membership/program-enrollment>

### App y compilación

- [ ] Versión funcional sin placeholders, enlaces rotos ni fallos; prueba en
      dispositivos reales.
- [ ] Utilidad más allá de web reempaquetada (regla 4.2). Swift no es
      obligatorio; la tecnología elegida cumple las reglas y produce una app
      compatible.
- [ ] **Xcode 26+ y SDK iOS/iPadOS 26+** (vigente desde el 28-04-2026). El SDK
      no determina por sí solo la versión mínima del SO. Requisito comprobado en
      la fuente oficial de Apple (sin verificación de toolchain local).
- [ ] Bundle ID/equipo/versión/build coherentes con App Store Connect.
- [ ] Firma de distribución, perfil de aprovisionamiento, archive y upload
      (Xcode puede gestionarlos).
- Fuentes: <https://developer.apple.com/app-store/review/guidelines/>,
  <https://developer.apple.com/news/upcoming-requirements/?id=04282026a>,
  <https://developer.apple.com/help/app-store-connect/reference/app-information/app-information/>,
  <https://developer.apple.com/help/account/provisioning-profiles/create-an-app-store-provisioning-profile>

### Ficha

- [ ] Registro con plataforma/nombre/idioma/Bundle ID/SKU.
- [ ] Ícono, descripción, keywords, categoría, copyright y URL de soporte
      funcional.
- [ ] Clasificación por edad real, precio, territorios y modo de publicación.
- [ ] Capturas de la app funcionando (sin datos reales) en tamaños Apple; iPad
      si se admite; el video **no** sustituye las capturas.
- Fuentes: <https://developer.apple.com/app-store/submitting/>,
  <https://developer.apple.com/help/app-store-connect/reference/app-information/screenshot-specifications>

### Privacidad y revisión

- [ ] Política de privacidad con URL accesible y acceso dentro de la app.
- [ ] App Privacy conforme a los datos y SDKs terceros **reales**; «no data»
      solo si corresponde.
- [ ] Permisos (cámara, micrófono, ubicación, etc.) justificados y solicitados
      correctamente.
- [ ] Backend disponible, acceso completo para Apple, instrucciones, contacto y
      recursos; login de cuenta demo/modalidad admitida; credenciales solo en el
      campo privado de revisión.
- [ ] Cifrado/exportación y documentación si aplica; HTTPS no exige por sí solo
      documentación extra.
- Fuentes: <https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/>,
  <https://developer.apple.com/app-store/review/guidelines/#privacy>,
  <https://developer.apple.com/help/app-review/before-submitting-for-review/complete-review>,
  <https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations>

## Condicionales (documentar «No aplica» con fundamento)

- [ ] **Creación de cuentas:** eliminación iniciable dentro de la app, no mera
      desactivación.
      <https://developer.apple.com/support/offering-account-deletion-in-your-app/>
- [ ] **Login social:** alternativa equivalente con garantías de privacidad
      (como Sign in with Apple), salvo excepciones fundamentadas.
      <https://developer.apple.com/app-store/review/guidelines/#login-services>
- [ ] **Pagos:** físico vs digital; IAP generalmente requerido para lo digital
      (excepciones por servicio/mercado); no todo SaaS exige IAP ni todo
      externo está permitido.
      <https://developer.apple.com/app-store/review/guidelines/#payments>
- [ ] **Ventas Apple:** contrato de apps de pago, banco, fiscal e IAP de prueba.
      <https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/overview-for-configuring-in-app-purchases/>
- [ ] **UGC:** filtrado, reportes, atención, bloqueo de abusivos y contacto
      público.
      <https://developer.apple.com/app-store/review/guidelines/#user-generated-content>
- [ ] **SDK/API:** privacy manifests, required reason APIs y firmas de SDK si
      son exigibles.
      <https://developer.apple.com/support/third-party-SDK-requirements/>,
      <https://developer.apple.com/documentation/bundleresources/privacy-manifest-files>
- [ ] **ATT:** solo si hay rastreo aplicable; no toda analítica requiere ATT.
      <https://developer.apple.com/app-store/user-privacy-and-data-use/>
- [ ] **Regulados/menores:** obligaciones, licencias y responsable; derechos del
      contenido ajeno.
      <https://developer.apple.com/help/app-review/before-submitting-for-review/complete-review>
- [ ] **UE/DSA:** declarar trader status incluso sin distribución en la UE;
      verificar datos públicos cuando aplique.
      <https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements>

## Envío

1. Cerrar los aplicables y subir el build.
2. TestFlight es recomendado, no requisito general:
   <https://developer.apple.com/testflight/>
3. Seleccionar build/metadatos y **agregar a revisión**.
4. Pulsar **Submit for Review**: agregar a revisión **no** envía
   automáticamente.
   <https://developer.apple.com/help/app-store-connect/manage-submissions-to-app-review/submit-an-app>
5. Resolver observaciones de Apple y publicar tras la aprobación según la
   modalidad elegida.

## Aplicación por app

- Inventariar cada app (iOS/Expo existente, API y contratos de fuente), crear
  unidades de implementación por **gap demostrado** con owner/source/criterio/
  evidencia y reutilizar los objetos de esta biblioteca.
- **Sin runtime iOS, toolchain o build firmado no hay `AppStoreREADY`**; los
  scaffold y checklists documentales no reemplazan el gap de código.
- La **QA diferida** para avanzar código **no exime** las pruebas de
  dispositivo, capturas y flujos privados requeridos al enviar a Apple.
- No se hace upload/submission, no se aceptan acuerdos ni billing y no se
  configura la cuenta por acuse: el canal privado del dueño decide.
