# ADR 0005: Experiencia, interfaz y accesibilidad

Fecha: 2026-08-14

Estado: aceptada como dirección de UX/UI

## Contexto

Praxis reúne recorridos con necesidades distintas: consulta pública de casos,
operación de estaciones durante eventos y herramientas internas de preparación
y publicación. Las decisiones de experiencia estaban repartidas entre el
contrato Firestore, el plan del importador, la memoria editorial y la
implementación del PMV.

La interfaz también representa accesos que evolucionarán desde códigos
compartidos hacia identidad y permisos reales. Debe comunicar con precisión qué
está autorizado, qué es una simulación funcional y qué datos proceden de un
respaldo local.

## Principios

- Priorizar la tarea activa y el uso repetido sobre la presentación comercial.
- Mantener recorridos cortos, estados visibles y acciones reversibles.
- Usar lenguaje comprensible para la persona usuaria; reservar rutas, IDs y
  nombres de campos para diagnósticos dirigidos a coordinación técnica.
- No presentar ocultamiento, códigos compartidos o selección de vista como
  autorización real.
- No depender únicamente del color, iconos o posición para comunicar estado.
- Diseñar primero para teclado, pantallas pequeñas y conectividad inestable.

## Decisión prioritaria: UX inversa

Praxis adopta `UX inversa` como criterio obligatorio: cada recorrido se diseña
desde su salida, retorno y recuperación antes de considerar completo el camino
exitoso. No basta con definir cómo entrar o avanzar; primero debe quedar claro
cómo volver, corregir, cancelar, reintentar y continuar después de una
interrupción.

Para cada vista y acción se decide, en este orden:

1. qué estado anterior debe conservarse;
2. cómo vuelve la persona sin perder trabajo innecesariamente;
3. qué operaciones puede cancelar o deshacer;
4. cómo corrige datos inválidos sin reiniciar el recorrido;
5. qué ocurre ante falta de datos, permisos, conexión o tiempo;
6. qué información necesita para reintentar o pedir ayuda;
7. cómo se confirma el éxito y cuál es el siguiente paso.

Una funcionalidad no se considera terminada si carece de retorno predecible,
recuperación ante errores o salida segura. Cuando exista tensión entre añadir
un nuevo camino exitoso y completar la recuperación del flujo actual, se
prioriza completar el flujo actual, salvo una excepción documentada.

La UX inversa no autoriza a conservar secretos ni información sensible para
facilitar la recuperación. El estado recuperable debe respetar las decisiones
de IAM, privacidad y caducidad.

## Decisión prioritaria: poka-yoke de diseño

Praxis adopta poka-yoke de diseño para prevenir errores previsibles antes de
que ocurran. La interfaz debe hacer difícil ejecutar una acción inválida y fácil
reconocer la opción correcta. Un mensaje de error es la última barrera, no la
primera estrategia.

Los mecanismos preferidos son:

- ofrecer opciones válidas en lugar de pedir texto libre cuando existe un
  vocabulario cerrado;
- distinguir visual y verbalmente nombres visibles, IDs, códigos públicos,
  secretos y estados todavía no activos;
- usar valores iniciales seguros que no publiquen, eliminen ni concedan acceso;
- validar formato, requisitos, colisiones y relaciones antes de habilitar una
  operación;
- mostrar alcance y resultado previsto antes de escribir o publicar;
- bloquear acciones imposibles y explicar qué requisito falta;
- pedir confirmación específica para acciones destructivas o difíciles de
  revertir;
- evitar controles adyacentes o etiquetas ambiguas que faciliten elegir el
  recurso, rol o destino equivocado;
- repetir en backend las validaciones críticas; la prevención visual no
  sustituye autorización, integridad ni atomicidad.

Aplicaciones obligatorias en Praxis:

| Riesgo | Poka-yoke requerido |
| --- | --- |
| Confundir título y `casoId` | Presentarlos con etiquetas y formatos distintos; no derivar un cambio de ID al editar el título |
| Referenciar un caso inexistente | Comprobar la relación antes de crear o actualizar una estación |
| Tratar una propuesta como dato activo | Mostrar `No guardado` o `Propuesta` y exigir una operación posterior explícita |
| Elegir un rol no asignado | Mostrar solo asignaciones permitidas; en el PMV etiquetar la selección como vista simulada |
| Abrir una estación incompleta | Deshabilitar su apertura y explicar si falta caso o contenido requerido |
| Publicar contenido no aprobado | Mantener `Publicar` bloqueado hasta completar custodia, validaciones y aprobaciones |
| Perder contexto al salir | Confirmar la salida y describir exactamente qué estado se perderá |
| Guardar secretos en respaldo | Filtrar códigos privados, tokens y credenciales antes de persistir datos locales |
| Repetir una escritura por doble acción | Bloquear el control mientras se procesa y hacer la operación resistente a reintentos |

Un poka-yoke no debe ocultar una operación necesaria ni encerrar a la persona en
un flujo sin salida. Prevención y UX inversa se complementan: primero se evita
el error y, si aun ocurre, se ofrece corrección y recuperación.

## Arquitectura de navegación

La entrada principal ofrece tres recorridos:

```text
Catálogo
  -> explorar casos publicados
  -> consultar lectura pública

Evento
  -> introducir código de entrada
  -> obtener el contexto permitido
  -> abrir estaciones

Centro de recursos
  -> consultar guías y plantillas
  -> acceder a herramientas internas cuando estén operativas
```

La navegación debe indicar la sección realmente activa. En Inicio no se marca
Catálogo como seleccionado. En móvil deben seguir disponibles Inicio, Catálogo,
Evento y Recursos sin depender de elementos ocultos para escritorio.

Durante un evento se conserva de forma visible el contexto de evento, estación,
modo de acceso y vista activa. Salir del evento requiere confirmación cuando se
pueda perder contexto o tiempo de estación.

## Vistas y transiciones

Cada vista tiene una tarea principal y un retorno predecible:

| Vista | Tarea principal | Destinos directos | Retorno esperado |
| --- | --- | --- | --- |
| Inicio | Elegir recorrido | Catálogo, entrada a evento, recursos | No aplica |
| Catálogo | Buscar y comparar casos | Detalle de caso | Inicio |
| Detalle público | Leer un caso publicado | Acceso instructor del PMV | Catálogo |
| Entrada a evento | Validar modo y código | Estaciones del evento | Inicio |
| Estaciones | Elegir vista permitida y estación | Detalle de estación | Entrada o salida confirmada |
| Detalle de estación | Consultar contenido y tiempo | Impresión o PDF | Estaciones |
| Recursos | Elegir guía, plantilla o herramienta | Recurso o herramienta seleccionada | Inicio |
| Calculadora | Priorizar un caso o producto | Impresión de resultado | Recursos |
| Generador interno | Proponer o consultar IDs y accesos | Resultado descargable | Recursos |
| Importador | Validar, custodiar y publicar un paquete | Vista previa, resultado e informe | Recursos |

Las transiciones aplican estas reglas:

- `Volver` regresa a la vista de origen, no siempre a Inicio.
- Al volver del detalle, el Catálogo conserva filtros, búsqueda y posición de
  lectura durante la sesión de navegación.
- Al volver de una estación, el evento conserva modo de acceso, vista elegida,
  lista de estaciones y contexto temporal que siga vigente.
- Cambiar de estación no cambia silenciosamente la vista activa.
- Cambiar de recorrido principal descarta el contexto temporal solo después de
  confirmar cuando exista riesgo de pérdida.
- Un error recuperable mantiene a la persona en la misma vista y conserva los
  valores no sensibles.
- Una vista protegida no aparece brevemente antes de completar la autorización.
- La acción atrás del navegador y el control visible `Volver` deben producir un
  resultado equivalente cuando el enrutamiento lo permita.

El detalle de caso es una misma familia de vista con contextos diferentes. En
Catálogo muestra lectura pública; en Evento muestra únicamente las secciones
permitidas por la vista o asignación activa. El encabezado, retorno, acciones y
mensajes deben reflejar ese contexto y no reutilizar etiquetas incorrectas como
`Volver al catálogo` dentro de un evento.

## Acceso, identidad y roles

La interfaz usa términos distintos para capacidades distintas:

```text
Modo de acceso
  -> forma de entrada, por ejemplo participante o staff.

Vista simulada
  -> selección funcional del PMV para previsualizar contenido por rol.

Rol asignado
  -> permiso contextual asociado a una identidad y a un recurso.
```

Mientras el PMV use un código compartido de staff, elegir Instructor, Actor o
SimTech se presenta como `Vista de prueba` o `Visualizar como`. No se afirma que
el código haya asignado ese rol a la persona.

Cuando exista IAM, la aplicación obtiene las vistas permitidas a partir de la
identidad y sus asignaciones. No debe pedir a la persona que seleccione un rol
que no tiene. Si posee varias asignaciones válidas, puede cambiar entre ellas y
la interfaz debe mostrar el alcance de cada una.

Esta decisión complementa el
[ADR 0004: Evolución de IAM y códigos](0004-evolucion-iam-y-codigos.md).

## Estados y recuperación

Toda vista remota debe contemplar:

```text
cargando
vacío
éxito
advertencia
error recuperable
error bloqueante
modo respaldo
```

Los errores de formularios se muestran junto al campo o acción que los produjo,
conservan los valores no sensibles y mueven el foco al mensaje o control que
requiere corrección. Un código incorrecto o un evento inexistente no debe
reemplazar el formulario sin ofrecer `Corregir` o `Volver`.

Los mensajes dirigidos a participantes explican qué pueden hacer. Los detalles
como rutas Firestore solo aparecen en herramientas internas o diagnósticos para
coordinación.

Las acciones con escritura distinguen claramente advertencias y bloqueantes,
muestran una vista previa del resultado y solicitan confirmación antes de una
operación irreversible o de publicación.

## Respaldo offline

El modo respaldo permite continuar con información cargada previamente y debe
indicar la antigüedad o momento de actualización cuando esté disponible. No se
presenta como contenido sincronizado ni como una autenticación nueva.

El almacenamiento local no conserva códigos privados, tokens ni secretos. Una
experiencia protegida solo puede continuar offline a partir de un contexto ya
autorizado y con alcance explícito; no vuelve a validar un secreto extraído del
evento cacheado. Al expirar el respaldo, la interfaz elimina los datos y pide
conexión para recuperar el contexto.

## Componentes e interacción

Los componentes se definen por responsabilidad y no por una pantalla concreta:

| Componente | Responsabilidad | Decisión de uso |
| --- | --- | --- |
| Encabezado global | Identidad y navegación principal | Marca solo la sección activa y ofrece alternativa móvil |
| Barra de contexto | Evento, estación, acceso y vista | Solo aparece dentro del recorrido de evento |
| Control Volver | Retorno a la vista de origen | Conserva el estado de la vista anterior |
| Selector segmentado | Elegir entre pocas opciones equivalentes | Se usa para modo de entrada, no para navegación global |
| Pestañas | Alternar secciones del mismo recurso | No cambian de entidad ni simulan autorización |
| Filtros | Reducir resultados del catálogo | Muestran criterios activos y permiten restablecerlos |
| Lista de estaciones | Mostrar orden y disponibilidad | Una estación sin caso explica el bloqueo y no parece activa |
| Formulario | Capturar y validar datos | Conserva valores no sensibles y asocia errores con campos |
| Aviso de estado | Informar carga, error, advertencia u offline | Incluye significado textual y acción cuando sea recuperable |
| Diálogo | Confirmar o completar una tarea breve | No sustituye una vista cuando la tarea requiere varios pasos |
| Vista previa | Revisar cambios antes de escribir | Distingue altas, modificaciones, rechazos y bloqueantes |
| Botón de acción | Ejecutar un comando | Usa jerarquía primaria, secundaria o destructiva consistente |
| Tarjeta | Representar un elemento repetido o herramienta | No se usa como contenedor decorativo de una sección completa |

Un comportamiento compartido debe resolverse en un componente común cuando eso
evite divergencias de accesibilidad, estado o lenguaje. Las variantes visuales
no deben cambiar el significado del componente entre vistas.

- Los botones ejecutan acciones y los enlaces navegan a recursos o destinos.
- Pestañas, selectores segmentados y diálogos siguen su patrón ARIA completo.
- El foco es visible, sigue un orden lógico y vuelve al control de origen al
  cerrar un diálogo.
- Los diálogos confinan el foco mientras están abiertos y permiten cancelar con
  `Escape` cuando la operación todavía es reversible.
- Los controles tienen etiqueta persistente; el placeholder no sustituye una
  etiqueta.
- Los estados deshabilitados explican el motivo cuando esa información ayuda a
  completar la tarea.
- Los objetivos táctiles mantienen un tamaño cómodo y no dependen de hover.

## Presentación visual y responsive

La interfaz mantiene un carácter operativo, sobrio y legible. La jerarquía se
construye con tipografía, espacio, contraste y agrupación antes que con tarjetas
decorativas. Las tarjetas se reservan para elementos repetidos, herramientas o
contenidos realmente delimitados; no se anidan.

Los colores de estado son consistentes y siempre se acompañan de texto. Las
etiquetas, códigos y nombres largos pueden envolver sin desbordar. Tablas,
pestañas, barras de contexto y formularios deben comprobarse en móvil y
escritorio sin solapamientos ni pérdida de acciones.

## Accesibilidad mínima

- HTML semántico y nombres accesibles para controles.
- Operación completa mediante teclado.
- Contraste suficiente en texto, controles, foco y estados.
- Regiones de estado anunciadas sin interrumpir innecesariamente.
- Pestañas con `role`, `aria-selected`, `tabindex` y flechas de navegación.
- Diálogos con título, descripción cuando corresponda, foco inicial, captura de
  foco y restauración al cerrar.
- Contenido comprensible al ampliar texto y en anchos móviles.
- La impresión o PDF conserva títulos, contexto y contenido esencial.

## Consecuencias

- La UX inversa es un criterio de aceptación, no una mejora opcional posterior.
- Los poka-yoke de diseño son criterios de aceptación para operaciones con
  identidad, relaciones, permisos, publicación o pérdida de estado.
- Los cambios visuales deben preservar el significado de acceso y estado.
- Un flujo no se considera completo si solo contempla el camino exitoso.
- La selección actual de roles de staff debe renombrarse como vista simulada
  hasta implementar asignaciones IAM.
- El caché del evento debe excluir `codigo_staff` y cualquier otro secreto.
- La navegación general debe representar correctamente Inicio, Catálogo,
  Evento y Recursos en escritorio y móvil.
- Las vistas secundarias deben volver a su origen y conservar el estado de
  navegación definido para Catálogo, Evento y Recursos.
- Encabezado global, barra de contexto, avisos, pestañas y diálogos deben tener
  una implementación compartida o un contrato común de comportamiento.
- Los patrones de pestañas y diálogos existentes requieren completar su
  comportamiento de teclado y foco.

## Validación

Cada flujo nuevo o modificado debe comprobar al menos:

1. retorno, cancelación y recuperación sin pérdida innecesaria de estado;
2. corrección y reintento después de un error recuperable;
3. prevención de entradas, relaciones y acciones inválidas mediante poka-yoke;
4. recorrido principal con teclado;
5. ancho móvil y escritorio;
6. carga, vacío, error y recuperación;
7. permisos o vista correspondientes al contexto;
8. conectividad interrumpida cuando el flujo admita respaldo;
9. ausencia de secretos en almacenamiento local y mensajes visibles.

Las pruebas visuales no sustituyen las pruebas de autorización, datos o reglas.
