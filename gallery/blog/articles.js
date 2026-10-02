import { BLOG_POSTS } from './metadata.js'

// Complete article bodies stay out of the interactive gallery bundle.
const BLOG_CONTENT = [
  {
    "slug": "sistema-diseno-react-compartido",
    "sections": [
      {
        "heading": "Compartir decisiones, no solo botones",
        "paragraphs": [
          "Un sistema de diseño es una forma de acordar cómo se comporta un producto. El color de un botón importa, pero también su estado deshabilitado, el mensaje que acompaña un error y la forma de recuperar una tarea. Cuando cada aplicación resuelve esos detalles por separado, las diferencias se acumulan y el mantenimiento depende de recordar qué copia contiene la última corrección.",
          "OwnCoding UI reúne componentes, utilidades y reglas en una biblioteca compartida. Su galería permite observar contratos antes de adoptarlos: qué pieza es visual, qué export corresponde a una API y qué demostración usa datos locales. Esa separación evita tratar una función de validación como un componente y ayuda a elegir una entrada adecuada para cada necesidad."
        ]
      },
      {
        "heading": "Empezar por un recorrido pequeño",
        "paragraphs": [
          "La primera adopción no necesita reemplazar toda la aplicación. Conviene elegir un formulario frecuente, identificar sus campos y conectar un componente existente con el estado del producto. Después se revisan las etiquetas, los errores y el comportamiento móvil. El objetivo inicial es comprobar que la pieza compartida encaja en una tarea concreta, no cambiar todos los estilos de una vez.",
          "Los tokens y estilos incluidos sirven como base común. Las diferencias de una aplicación pueden expresarse mediante propiedades y composición, en lugar de copiar archivos y modificarlos. Si una excepción se repite en varios productos, merece discutirse como una variante del sistema; si pertenece a una sola operación, puede permanecer en la aplicación consumidora."
        ]
      },
      {
        "heading": "Mantener claro el límite de responsabilidad",
        "paragraphs": [
          "La biblioteca presenta y organiza información, pero no sustituye las decisiones del servidor. Una pantalla de clientes necesita permisos, aislamiento de datos y persistencia definidos por la aplicación. Una demostración que muestra un cliente ficticio solo explica el flujo de interfaz. Conservar ese límite permite reutilizar una misma pieza sin trasladar accidentalmente reglas de negocio entre productos.",
          "En la práctica, conviene documentar quién controla el valor, qué evento entrega el componente y quién ejecuta una consulta. RucField, por ejemplo, recibe un proveedor mediante consultar; la biblioteca no inventa una conexión oficial. Esa disciplina hace que el diseño sea reutilizable sin ocultar dependencias externas ni prometer servicios que no están activados."
        ]
      },
      {
        "heading": "Revisar antes de ampliar la adopción",
        "paragraphs": [
          "La galería es un punto de partida para revisar estados, no una certificación de producción de cada aplicación. Después de integrar una pieza hay que probar su contexto real: contenido largo, teclado, permisos y errores de red. Registrar esos resultados permite extender el sistema a otros recorridos con evidencia y evita confundir una apariencia consistente con una operación segura.",
          "Antes de extender el sistema, registra la tarea elegida, las propiedades utilizadas y el resultado esperado. Esa pequeña referencia permite comparar futuras actualizaciones con el comportamiento que el equipo decidió mantener."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/index.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/index.js"
      },
      {
        "label": "Código: src/styles/tokens.css",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/styles/tokens.css"
      },
      {
        "label": "Código: gallery/catalog.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/gallery/catalog.js"
      }
    ]
  },
  {
    "slug": "logos-bancos-compacto-horizontal",
    "sections": [
      {
        "heading": "El espacio define la variante",
        "paragraphs": [
          "Un selector de cuentas y una cabecera de institución no necesitan el mismo formato de marca. El primero suele ofrecer una fila corta junto al nombre; la segunda puede reservar más espacio para un identificador horizontal. Elegir una variante por su función ayuda a que la información sea legible sin obligar a todos los bancos a entrar en una misma proporción.",
          "OwnCoding UI distingue variantes compactas y horizontales mediante BancoLogo y sus metadatos. La revisión completa de la galería permite compararlas en un mismo contexto. El nombre visible de la institución sigue siendo importante: reconocer una marca no debería ser la única forma de saber qué opción se está seleccionando."
        ]
      },
      {
        "heading": "No convertir iniciales en un logo",
        "paragraphs": [
          "Una inicial puede ser un fallback útil cuando no hay imagen, pero no debe presentarse como una marca verificada. Un asset real tiene una procedencia y una variante concreta. El catálogo conserva esa diferencia para no hacer pasar una aproximación visual por un archivo institucional, y la interfaz debe mantener visible cualquier limitación relevante.",
          "Si falta una variante, es preferible indicarlo y conservar el nombre que dibujar una supuesta versión oficial. También importa separar disponibilidad técnica de vigencia institucional: tener un archivo no demuestra que una entidad opere hoy bajo las mismas condiciones. La revisión de cobertura y la selección comercial pertenecen a un proceso distinto del renderizado."
        ]
      },
      {
        "heading": "Escalar el contenedor sin recortar la imagen",
        "paragraphs": [
          "Para mejorar una marca pequeña se puede aumentar la superficie disponible o ajustar el espacio del contenedor. Lo que no conviene es estirar la imagen hasta convertirla en un cuadrado ni recortar partes de su identidad. La galería utiliza presentación contenida para mantener las proporciones del original, incluso cuando un archivo incorpora márgenes blancos.",
          "Los fondos también forman parte de la legibilidad. Un símbolo claro sobre transparencia puede desaparecer en un tema claro, mientras que una marca oscura puede perder contraste sobre un panel oscuro. La variante y su fondo se revisan juntos. El caso de BNF muestra ese criterio: su compacta utiliza una superficie azul coherente con la presentación horizontal."
        ]
      },
      {
        "heading": "Una revisión visual no implica respaldo",
        "paragraphs": [
          "Mostrar una marca en una biblioteca de interfaz no significa que el banco respalde el proyecto ni que exista una integración transaccional. Antes de usarla en un producto, revisa la procedencia, el uso permitido y el contexto de presentación. Comprueba además la vista móvil, los nombres extensos y el estado sin asset para que la selección siga siendo comprensible.",
          "En la revisión final, compara ambas variantes en el mismo tamaño de pantalla. Comprueba que la institución siga siendo identificable al reducir el espacio y que el texto acompañante no quede desplazado por un archivo demasiado ancho."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/components/BancoLogo.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/BancoLogo.jsx"
      },
      {
        "label": "Código: src/utils/bancos.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/utils/bancos.js"
      },
      {
        "label": "Código: docs/financial-assets-manifest.json",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/docs/financial-assets-manifest.json"
      }
    ]
  },
  {
    "slug": "pagos-billeteras-marcas",
    "sections": [
      {
        "heading": "Una marca no explica toda la operación",
        "paragraphs": [
          "En una pantalla de cobro pueden convivir nombres de redes, soluciones para comercios, tarjetas y billeteras. Agruparlos solo por el color del logo produce una lista atractiva, pero poco útil para quien necesita elegir una forma de pagar. La pregunta correcta es qué acción permite cada opción dentro de esa aplicación y qué condiciones ya fueron verificadas.",
          "La galería de OwnCoding UI muestra marcas como Bancard, Dinelco, upay y Pik en un grupo visual para comercios. Esa organización ayuda a revisar la interfaz, pero no sustituye una evaluación comercial ni declara que todas las marcas tengan funciones idénticas. El catálogo de presentación describe assets y relaciones; el producto define las operaciones que realmente ofrece."
        ]
      },
      {
        "heading": "Diferenciar catálogo e integración",
        "paragraphs": [
          "MedioPagoLogo resuelve una representación visual. No genera un enlace de pago, no autoriza una tarjeta y no confirma la liquidación de una venta. Es importante mantener esos verbos fuera de una demostración de logos. Una opción puede estar disponible como imagen en la biblioteca y seguir pendiente como proveedor en la aplicación consumidora.",
          "Por eso, el estado operativo debe provenir del servidor o de la configuración validada del producto. Una lista puede distinguir opciones activas, próximas y no disponibles, sin convertir la presencia del logo en una promesa. El usuario necesita entender cuándo su selección producirá un cobro real y cuándo simplemente está viendo una muestra del diseño."
        ]
      },
      {
        "heading": "Mostrar relaciones sin inventar equivalencias",
        "paragraphs": [
          "Algunas marcas tienen relaciones registradas en los metadatos del proyecto. Esa información puede dar contexto a una billetera o a una institución vinculada, pero no debe reemplazar el nombre que el usuario reconoce. Mostrar ambos niveles con claridad evita que una relación de marca termine convertida en una equivalencia jurídica o comercial que la interfaz no puede demostrar.",
          "Un buen ejemplo de composición es mantener la marca de la opción principal y añadir contexto secundario cuando resulte relevante. La explicación debe ser breve y revisable. Si la procedencia no alcanza para sostener una relación, la aplicación debe omitirla o señalar el límite, en lugar de completar el hueco con una suposición."
        ]
      },
      {
        "heading": "Probar el cobro fuera de la galería",
        "paragraphs": [
          "La validación visual revisa tamaño, contraste, selección y estados. La validación de pagos requiere evidencia distinta: configuración del proveedor, permisos, respuestas de error y confirmación de la operación en el entorno correspondiente. Conservar esta separación evita que una demostración profesional se interprete como una pasarela lista para mover dinero. El diseño ayuda a explicar el proceso; la integración debe demostrarlo.",
          "Antes de habilitar una opción, registra su estado comercial y su estado técnico por separado. Así el equipo puede actualizar la integración sin alterar la identidad visual ni mostrar disponibilidad que todavía no fue comprobada."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/components/MedioPagoLogo.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/MedioPagoLogo.jsx"
      },
      {
        "label": "Código: src/utils/mediosPago.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/utils/mediosPago.js"
      },
      {
        "label": "Código: src/utils/relacionesFinancieras.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/utils/relacionesFinancieras.js"
      }
    ]
  },
  {
    "slug": "telefono-paraguay-595",
    "sections": [
      {
        "heading": "Reducir trabajo sin bloquear excepciones",
        "paragraphs": [
          "Cuando una aplicación trabaja principalmente con personas de Paraguay, empezar con +595 evita repetir una selección habitual. Sin embargo, ese valor inicial no debería convertirse en una restricción silenciosa. Un contacto internacional necesita poder elegir otro país sin buscar un segundo formulario ni modificar a mano un prefijo oculto.",
          "PhoneField combina el número local con un selector de país. La galería permite buscar por nombre, ISO o prefijo y ofrece una bandera como señal visual. El texto sigue siendo necesario porque una bandera sola no explica el código ni garantiza que todas las personas la reconozcan. El selector debe funcionar también con teclado, no únicamente con un clic."
        ]
      },
      {
        "heading": "Guardar la representación adecuada",
        "paragraphs": [
          "El componente distingue la parte local, el código y la representación internacional. Su API conserva onChange para la parte local y ofrece onCountryCodeChange, onCountryChange y onInternationalChange para aplicaciones que necesitan más contexto. Adoptar esos eventos explícitamente evita ensamblar cadenas diferentes en cada pantalla o deducir el país solo a partir de un número visible.",
          "La utilidad telefonoE164 forma parte de ese recorrido, junto a la validación internacional. El producto debe decidir qué dato guarda y qué dato muestra al usuario. Un teléfono presentado con espacios puede ser más fácil de leer, mientras que una integración puede necesitar una forma normalizada. Esa decisión conviene mantenerla consistente entre alta, edición e importación."
        ]
      },
      {
        "heading": "Validar no significa verificar propiedad",
        "paragraphs": [
          "Aceptar un formato de teléfono no demuestra que el número pertenezca a una persona concreta ni que pueda recibir mensajes. La validación del campo ayuda a detectar entradas incompatibles con sus reglas, pero cualquier verificación de contacto requiere un proceso adicional definido por la aplicación. La galería no realiza ese proceso ni envía mensajes.",
          "También merece atención el pegado de un número internacional. El usuario puede copiar un contacto con prefijo, espacios y símbolos. La demostración permite revisar ese comportamiento y comprobar qué país queda seleccionado. Si la aplicación limita el catálogo de países, esa limitación debe ser visible y coherente con sus necesidades, no un efecto accidental del primer ejemplo."
        ]
      },
      {
        "heading": "Revisar errores en el contexto real",
        "paragraphs": [
          "Prueba un número vacío, uno incompleto, un cambio de país y una edición después de un error. Comprueba que el mensaje describa cómo corregir la entrada y que no aparezca como castigo antes de empezar a escribir. Finalmente, revisa la pantalla móvil: selector, búsqueda y teclado deben permitir terminar la tarea sin ocultar el campo principal.",
          "Al revisar una importación de contactos, conserva el dato original para poder explicar una corrección. La normalización debe ayudar al usuario a reconocer su teléfono, no transformar silenciosamente un número ambiguo en otro distinto."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/components/PhoneField.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/PhoneField.jsx"
      },
      {
        "label": "Código: src/components/CountryPhoneSelect.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/CountryPhoneSelect.jsx"
      },
      {
        "label": "Código: src/utils/telefono.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/utils/telefono.js"
      }
    ]
  },
  {
    "slug": "ciudad-departamento-paraguay",
    "sections": [
      {
        "heading": "Eliminar una decisión repetida",
        "paragraphs": [
          "Pedir ciudad y departamento como dos campos independientes puede producir combinaciones contradictorias. Una persona selecciona una ciudad conocida y luego tiene que recordar su departamento, aunque el sistema ya dispone de esa relación. Autocompletar reduce ese trabajo siempre que el resultado proceda de una selección reconocida y pueda explicarse en pantalla.",
          "La galería usa CityAutocomplete y departamentoDe para mostrar el recorrido ciudad hacia departamento. Encarnación e Itapúa son el ejemplo inicial de esa demostración. La derivación es visible al lado del campo, por lo que no se convierte en un cambio oculto. Los datos proceden del catálogo incluido, no de una consulta gubernamental en vivo."
        ]
      },
      {
        "heading": "Escribir y seleccionar no son lo mismo",
        "paragraphs": [
          "Mientras se escribe, el texto puede ser una consulta parcial o una ciudad que el catálogo no reconoce. La aplicación no debería tratar cada pulsación como una dirección confirmada. El evento de selección ofrece un punto claro para aplicar la ciudad y su departamento, mientras que onChange permite conservar lo que la persona está intentando buscar.",
          "Esa diferencia es importante al editar un registro existente. Si el usuario cambia la ciudad, revisa cuándo debes limpiar o recalcular el departamento anterior. Mantener un departamento viejo junto a una consulta nueva puede crear un dato aparentemente completo pero contradictorio. El flujo debe comunicar cuándo existe una coincidencia y cuándo falta elegir una opción válida."
        ]
      },
      {
        "heading": "Resolver entradas no encontradas",
        "paragraphs": [
          "Un catálogo local tiene límites de cobertura y de actualización. Si no aparece una ciudad, la interfaz debe decirlo sin asumir que el usuario está equivocado. Según el producto, puede existir una entrada manual, una solicitud de revisión o una restricción explícita. Lo importante es no asignar un departamento probable solo para evitar un campo vacío.",
          "La búsqueda también necesita gestionar resultados atrasados cuando hay un proveedor asíncrono. Una respuesta para una consulta anterior no debería reemplazar la selección actual. CityAutocomplete contempla invalidación de búsquedas; la aplicación debe respetar sus eventos y revisar ese comportamiento al conectar un origen distinto del catálogo local de la demostración."
        ]
      },
      {
        "heading": "No confundir ciudad con ubicación completa",
        "paragraphs": [
          "Derivar un departamento no verifica una dirección postal ni localiza una vivienda. Calle, referencia y otros datos siguen siendo decisiones del formulario de la aplicación. Prueba nombres largos, acentos, consultas sin coincidencia y navegación con teclado. Después verifica el registro guardado: la automatización tiene valor cuando evita inconsistencias, no cuando solamente llena más campos.",
          "Deja constancia del catálogo utilizado y del tratamiento de excepciones. Esa información ayuda a soporte cuando una persona informa una localidad ausente y permite actualizar los datos sin improvisar soluciones diferentes en cada formulario."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/components/CityAutocomplete.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/CityAutocomplete.jsx"
      },
      {
        "label": "Código: src/catalog/ciudades.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/catalog/ciudades.js"
      }
    ]
  },
  {
    "slug": "ruc-extraccion-confirmable",
    "sections": [
      {
        "heading": "La consulta no debe ser una escritura automática",
        "paragraphs": [
          "Autocompletar una razón social puede ahorrar tiempo, pero también puede reemplazar información válida con un resultado equivocado. Por eso el recorrido de RucField separa consultar, revisar y aplicar. La persona ve qué devolvió el proveedor y decide si utiliza esos datos; una respuesta por sí sola no modifica definitivamente el cliente.",
          "En la galería, el proveedor es simulado y los nombres corresponden a fixtures locales. Cambiar entre los ejemplos muestra resultados distintos para explicar el flujo, no demostrar cobertura de una base tributaria real. Ese límite aparece junto al campo y debe mantenerse visible cuando una demo se comparte fuera del equipo que la construyó."
        ]
      },
      {
        "heading": "Conservar un contrato explícito",
        "paragraphs": [
          "RucField recibe value y onChange para la entrada controlada, consultar para ejecutar una búsqueda y onAplicar para entregar el resultado confirmado. Si no hay proveedor, la biblioteca no consulta por su cuenta. La aplicación consumidora define el origen de los datos, su autenticación y el manejo de permisos; el componente se ocupa de presentar ese contrato.",
          "El campo elimina letras y conserva una representación numérica con separador opcional para el verificador. Esa ayuda de entrada no demuestra que la identificación exista ni que el resultado pertenezca a la persona que está usando el formulario. La comprobación del dato y las decisiones comerciales siguen siendo responsabilidades del producto y de su fuente verificable."
        ]
      },
      {
        "heading": "Invalidar resultados cuando cambia la consulta",
        "paragraphs": [
          "Una persona puede cambiar el número mientras la consulta anterior sigue pendiente. Aplicar la respuesta anterior al nuevo número sería un error difícil de detectar porque la interfaz aparentaría haber completado todos los campos correctamente. El componente invalida resultados al cambiar la entrada, el proveedor o las condiciones que permiten extraer.",
          "También hay que probar la ruta de error. Si el proveedor no responde, la tarea debe poder continuar según las reglas del producto, por ejemplo mediante edición manual. El mensaje no debe asegurar que un cliente no existe cuando solo hubo un fallo técnico. Distinguir ausencia de coincidencia y falta de disponibilidad evita decisiones basadas en información incompleta."
        ]
      },
      {
        "heading": "CI y RUC no son una búsqueda universal",
        "paragraphs": [
          "La demo presenta búsqueda de clientes por CI y extracción por RUC como recorridos independientes. No afirma que cualquier CI pueda convertirse en un registro tributario ni que exista una consulta universal de identidad. Al integrar una fuente real, documenta su procedencia, cobertura y actualización. Confirma luego que la interfaz siga mostrando el origen y pidiendo revisión antes de aplicar.",
          "Para soporte, registra errores sin exponer identificadores completos ni copiar respuestas sensibles en la interfaz pública. La trazabilidad de una consulta debe permitir investigar un fallo sin convertir la demo o los mensajes en una fuga de información."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/components/RucField.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/RucField.jsx"
      },
      {
        "label": "Código: src/utils/ruc.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/utils/ruc.js"
      },
      {
        "label": "Código: gallery/main.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/gallery/main.jsx"
      }
    ]
  },
  {
    "slug": "formularios-validacion-accesibilidad",
    "sections": [
      {
        "heading": "Cada campo necesita un propósito visible",
        "paragraphs": [
          "Un formulario no se entiende por la cantidad de componentes que incluye, sino por la relación entre cada pregunta y la tarea de la persona. Antes de elegir un campo, define qué información necesitas y por qué. Una etiqueta visible ayuda a identificar el dato incluso después de escribir, cuando el placeholder ya no puede orientar.",
          "OwnCoding UI ofrece piezas como Label, Input, EmailField y MoneyInput que pueden combinarse en recorridos distintos. Al integrarlas, revisa que el identificador del campo y la etiqueta estén relacionados y que los mensajes de ayuda correspondan a esa entrada. Una composición visual consistente no arregla por sí sola una etiqueta ausente o una instrucción confusa."
        ]
      },
      {
        "heading": "Explicar el error y la recuperación",
        "paragraphs": [
          "Un borde rojo comunica que algo requiere atención, pero no explica cómo resolverlo. El mensaje debe indicar qué entrada necesita corregirse y qué espera el formulario. También conviene decidir cuándo mostrarlo: durante la escritura, después de salir del campo o al enviar. Esa decisión debe evitar interrupciones innecesarias sin ocultar problemas que impiden avanzar.",
          "La validación de interfaz reduce errores frecuentes, pero no reemplaza la validación del servidor. Un campo numérico puede ayudar a escribir un monto; la aplicación aún debe comprobar permisos, rangos y reglas de la operación. Mantener ambos niveles permite que el mensaje sea útil sin presentar la pantalla como una garantía de integridad de los datos."
        ]
      },
      {
        "heading": "Revisar un recorrido completo con teclado",
        "paragraphs": [
          "La prueba no termina cuando cada control recibe foco. Hay que recorrer la tarea: abrir un selector, buscar una opción, elegirla, corregir un dato y enviar. Observa si el foco sigue siendo visible y si se puede salir de paneles y diálogos. Un usuario debe entender dónde está y qué acción ocurrirá antes de confirmarla.",
          "Los controles deshabilitados y los estados de carga también necesitan revisión. Un botón inactivo sin explicación puede parecer roto. Si existe una condición pendiente, descríbela cerca de la acción. Si una consulta tarda, muestra su estado sin borrar la entrada. La accesibilidad se vuelve parte del flujo cuando permite resolver estas situaciones, no solo pasar por la pantalla."
        ]
      },
      {
        "heading": "Probar contenido que rompe el ejemplo ideal",
        "paragraphs": [
          "Usa etiquetas largas, mensajes de error completos, tamaños de pantalla pequeños y datos sin coincidencia. Verifica que los textos no se recorten y que el orden móvil mantenga la relación entre campo y ayuda. Los ejemplos de la galería permiten comenzar esa revisión; la aplicación debe repetirla con sus reglas y su contenido real antes de considerar cerrado el formulario.",
          "Incluye la revisión de mensajes en las pruebas del formulario. Cambiar una frase puede alterar la altura, la asociación con un campo o el entendimiento de una acción, aunque el componente siga renderizando sin errores."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/components/ui.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/ui.jsx"
      },
      {
        "label": "Código: src/components/EmailField.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/EmailField.jsx"
      }
    ]
  },
  {
    "slug": "estados-vacio-carga-error",
    "sections": [
      {
        "heading": "Una lista vacía puede significar varias cosas",
        "paragraphs": [
          "Que no haya filas en pantalla no explica qué pasó. Puede ser la primera visita de un usuario, una búsqueda sin coincidencias o una petición todavía pendiente. Mostrar el mismo mensaje en todas esas situaciones obliga a la persona a adivinar si debe crear un dato, cambiar un filtro o esperar.",
          "OwnCoding UI incluye Skeleton, EmptyState y ErrorState como piezas distintas. Elegirlas según el estado real de la aplicación permite separar expectativa, ausencia y fallo. Un esqueleto comunica que el contenido se está preparando; un estado vacío puede explicar qué falta; un error debe describir cómo recuperar la tarea sin afirmar más de lo que se sabe."
        ]
      },
      {
        "heading": "El vacío necesita contexto y una acción",
        "paragraphs": [
          "En una cuenta nueva, la acción podría ser crear el primer registro. En una búsqueda, puede ser limpiar los filtros. En una sección sin permisos, el problema no es que falten datos, sino que no corresponde mostrarlos. La aplicación debe conocer esa diferencia antes de seleccionar la copia y el componente.",
          "Un estado vacío útil explica dónde está el usuario, por qué no ve contenido y qué puede hacer después. No necesita rellenar toda la pantalla con ilustraciones ni enlaces genéricos. Si el espacio es pequeño, una descripción breve y una acción concreta ayudan más que una tarjeta grande que repite el título de la sección."
        ]
      },
      {
        "heading": "El error no debe borrar el trabajo",
        "paragraphs": [
          "Cuando una consulta falla, conserva la información que el usuario ya escribió siempre que el flujo lo permita. Un error técnico no debería transformarse en una pérdida de trabajo ni en una afirmación de que el registro no existe. Separa los mensajes de disponibilidad de los mensajes de validación y de las restricciones de permiso.",
          "Si hay una acción de reintento, define qué operación repite y cuándo está disponible. Un botón que dispara varias solicitudes mientras la primera continúa puede empeorar la experiencia. El producto debe controlar esos estados; ErrorState organiza la presentación, pero no decide por sí mismo la estrategia de red ni los límites del proveedor."
        ]
      },
      {
        "heading": "Diseñar el estado intermedio",
        "paragraphs": [
          "Además de probar éxito y fallo, revisa la transición entre ambos. Cambia filtros durante la carga, vacía una consulta y abre una sección sin registros. Comprueba que el título, el contenido y la acción correspondan al mismo contexto. Esa coherencia permite confiar en lo que la pantalla informa y evita que un resultado viejo parezca una respuesta nueva.",
          "Antes de aprobar una pantalla, anota qué conoce la aplicación en cada estado. Esa descripción simple permite detectar mensajes demasiado categóricos y acciones que no ayudan a resolver el problema que realmente ocurrió."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/components/ui.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/ui.jsx"
      }
    ]
  },
  {
    "slug": "footers-prefooters-version-app",
    "sections": [
      {
        "heading": "El final de la página también es navegación",
        "paragraphs": [
          "Un footer no debería ser un depósito de enlaces que no encontraron lugar arriba. Al llegar al final, una persona puede necesitar volver a una sección, revisar la versión o encontrar un recurso relacionado. Elegir esas acciones según el contexto hace que el cierre de la página ayude a continuar, en lugar de repetir toda la navegación principal.",
          "OwnCoding UI ofrece ProductFooter y ProductPrefooter como piezas diferentes. El footer presenta identidad y enlaces de cierre; el prefooter permite organizar contenido o una acción previa. La galería muestra ambos para que una aplicación elija la composición que necesita, sin imponer un bloque comercial grande en cada pantalla administrativa."
        ]
      },
      {
        "heading": "Separar identidad de contenido",
        "paragraphs": [
          "La identidad de aplicación puede incluir nombre y versión mediante crearIdentidadApp. Compartir ese modelo evita que distintas pantallas escriban la versión de formas incompatibles o mantengan cadenas manuales que quedan viejas. Aun así, una etiqueta de versión solo describe el dato que recibe: no demuestra por sí sola qué commit está desplegado.",
          "Para soporte y operación, conviene conectar esa presentación con una evidencia de build. La galería ofrece status.json como recurso separado. Mostrar ambos niveles permite distinguir una versión de paquete de la identidad del despliegue, y evita que un usuario interprete una etiqueta visual como confirmación de que el servidor ya recibió el último cambio."
        ]
      },
      {
        "heading": "Usar el prefooter cuando existe una siguiente tarea",
        "paragraphs": [
          "Un prefooter funciona mejor cuando propone una acción relacionada con lo que se acaba de leer. Puede reunir documentación, acceso al catálogo o una explicación breve de adopción. Si no hay una siguiente tarea clara, omitirlo es una decisión válida. Añadir columnas únicamente para ocupar espacio suele hacer más difícil encontrar el enlace importante.",
          "En móvil, revisa el orden de esos bloques y el tamaño de sus acciones. Una columna de escritorio puede convertirse en una secuencia larga; por eso hay que decidir qué información necesita prioridad. Mantén títulos descriptivos y evita que enlaces secundarios tengan más peso visual que la acción útil para completar el recorrido."
        ]
      },
      {
        "heading": "Revisar los enlaces como parte de la calidad",
        "paragraphs": [
          "Prueba que cada destino existe y que su etiqueta describe lo que se abrirá. No publiques correos o rutas ficticias con apariencia de contacto real. Comprueba también nombres extensos, versiones y estados de tema. Un cierre sobrio, consistente y verificable aporta más confianza que una sección ornamental que promete canales o servicios todavía no disponibles.",
          "Mantén una lista pequeña de destinos de cierre y revísala al publicar nuevas secciones. Añadir documentación útil al footer permite descubrirla sin aumentar el peso de la navegación que acompaña cada tarea administrativa."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: src/components/ProductFooter.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/ProductFooter.jsx"
      },
      {
        "label": "Código: src/components/ProductPrefooter.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/components/ProductPrefooter.jsx"
      },
      {
        "label": "Código: src/utils/appIdentity.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/src/utils/appIdentity.js"
      }
    ]
  },
  {
    "slug": "galeria-componentes-adopcion-pruebas",
    "sections": [
      {
        "heading": "Una preview responde preguntas concretas",
        "paragraphs": [
          "Antes de adoptar un componente, necesitas saber cómo se usa, qué recibe y qué devuelve. Una captura ayuda a entender la apariencia, pero una demostración interactiva permite revisar estados y decisiones. La galería de OwnCoding UI organiza exports visuales y de API para que esa exploración no dependa de reconocer nombres en una lista de archivos.",
          "Los ejemplos locales facilitan probar sin enviar datos ni depender de un proveedor externo. Esa ventaja tiene un límite importante: una demo aislada no demuestra permisos, persistencia o disponibilidad de una integración en producción. Su valor es ofrecer un punto de partida reproducible para entender la interfaz, no reemplazar la validación de la aplicación consumidora."
        ]
      },
      {
        "heading": "Elegir un caso de uso antes de copiar una muestra",
        "paragraphs": [
          "Empieza por una tarea del producto: editar un teléfono, elegir una ciudad o confirmar una razón social. Identifica el componente que resuelve la interacción y conecta sus eventos al estado existente. Si la muestra contiene fixtures, reemplázalos con un origen explícito y conserva las advertencias mientras ese origen siga siendo simulado.",
          "Evita copiar el componente a una carpeta local para modificarlo sin seguimiento. Una integración por props mantiene las correcciones compartidas y facilita revisar cambios posteriores. Cuando falta una capacidad repetida, documenta el caso y propón una extensión del contrato. Cuando la regla pertenece a un solo negocio, mantenla fuera del componente genérico."
        ]
      },
      {
        "heading": "Probar comportamiento, no solo renderizado",
        "paragraphs": [
          "La primera prueba puede confirmar que una etiqueta aparece, pero la tarea necesita más. Cambia el valor, dispara un error, responde tarde a una consulta y comprueba que el resultado corresponde a la entrada actual. Las piezas con eventos asíncronos merecen escenarios de carrera; las piezas de selección necesitan rutas de teclado y estados sin opciones.",
          "Después prueba la composición dentro de la aplicación: contenido largo, permisos y pantalla móvil. Un componente puede funcionar correctamente por separado y quedar mal integrado por un evento incorrecto o un contenedor que lo recorta. La revisión visual y las pruebas de comportamiento se complementan porque detectan problemas distintos en el mismo recorrido."
        ]
      },
      {
        "heading": "Separar entrega de código y cierre de producción",
        "paragraphs": [
          "Un commit publicado demuestra una entrega de código; un build exitoso demuestra que pudo construirse; una comprobación en el dominio demuestra algo sobre el despliegue actual. Ninguna evidencia sustituye a las demás. Usa la galería para acordar el comportamiento esperado y luego verifica la versión y el flujo real antes de comunicar que una integración está terminada.",
          "Documenta el escenario revisado y la evidencia obtenida para que otra persona pueda repetirlo. Una prueba reproducible tiene más valor que una captura aislada cuando cambia un componente, un proveedor o el entorno desplegado."
        ]
      }
    ],
    "sources": [
      {
        "label": "Código: gallery/catalog.js",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/gallery/catalog.js"
      },
      {
        "label": "Código: gallery/component-previews.jsx",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/gallery/component-previews.jsx"
      },
      {
        "label": "Código: scripts/gallery-check.mjs",
        "url": "https://github.com/dariodeoli/owncoding-ui/blob/main/scripts/gallery-check.mjs"
      }
    ]
  }
]

export const BLOG_ARTICLES = BLOG_CONTENT.map((content) => ({ ...BLOG_POSTS.find((post) => post.slug === content.slug), ...content }))
