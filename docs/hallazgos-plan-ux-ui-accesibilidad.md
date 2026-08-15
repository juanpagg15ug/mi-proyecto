# Hallazgos y plan de acción de UX/UI y accesibilidad

Fecha: 2026-08-14

Estado: evaluación inicial; plan propuesto

Documento de referencia:
[ADR 0005: Experiencia, interfaz y accesibilidad](decisiones/0005-experiencia-interfaz-y-accesibilidad.md).

## 1. Objetivo

Evaluar el PMV de Praxis frente a la dirección de experiencia, interfaz y
accesibilidad aceptada en el ADR 0005, registrar las brechas observadas y
convertirlas en un plan de acción verificable.

Este documento no constituye una certificación WCAG. Es una revisión técnica y
funcional del estado actual, orientada a reducir barreras y completar los
criterios internos de aceptación.

## 2. Alcance y método

La evaluación cubrió:

- Inicio y navegación global.
- Catálogo y detalle público de casos.
- Entrada, contexto, estaciones y salida de eventos.
- Centro de recursos, calculadora y generador interno.
- Estados de carga, vacío, error y respaldo offline.
- Operación con teclado, foco, semántica HTML y patrones ARIA.
- Presentación responsive en escritorio y un viewport móvil de 390 por 844 px.
- Revisión estática de HTML, CSS y JavaScript.
- Ejecución local con Firebase Emulator y revisión mediante Playwright.

La sintaxis JavaScript se validó con `npm run validate`. No existe todavía una
suite automatizada de accesibilidad, contraste o recorridos de teclado.

## 3. Resultado general

**Calificación global: 5/10 — cumplimiento parcial.**

| Dimensión | Nota | Evaluación |
| --- | ---: | --- |
| Claridad visual y legibilidad | 7/10 | Jerarquía comprensible, textos claros y diseño móvil sin desbordamiento horizontal en la muestra revisada. |
| Navegación y orientación | 4/10 | El estado activo no representa la vista real y la navegación principal desaparece en móvil. |
| UX inversa y recuperación | 4/10 | Hay confirmación de salida, pero varios errores destruyen el formulario y se pierde estado al volver. |
| Formularios y prevención de errores | 6/10 | Predominan etiquetas persistentes y opciones cerradas, pero faltan asociaciones, bloqueo durante procesos y corrección contextual. |
| Teclado, foco y patrones ARIA | 3/10 | Pestañas, selectores, diálogos y controles expandibles están incompletos. |
| Estados remotos y respaldo offline | 5/10 | Existen carga, vacío, error, respaldo y caducidad, pero faltan reintento, antigüedad visible y filtrado seguro. |
| Validación automatizada | 2/10 | Solo se comprueba sintaxis JavaScript. |

La aplicación permite completar varios caminos exitosos, pero aún no satisface
el criterio del ADR según el cual un flujo requiere retorno predecible,
recuperación y salida segura para considerarse terminado.

## 4. Fortalezas observadas

- El documento usa idioma español y existe un `main` identificable.
- La jerarquía de títulos es generalmente comprensible.
- La mayoría de los formularios visibles tienen etiquetas persistentes.
- Las estaciones sin caso se muestran deshabilitadas y explican el bloqueo.
- Catálogo y eventos contemplan estados de carga, vacío y error básico.
- El respaldo offline tiene una caducidad de 24 horas y se identifica con texto.
- Salir de un evento solicita confirmación y describe el contexto que se perderá.
- Las propuestas del generador indican que no están guardadas ni activas.
- La interfaz inicial no presentó desbordamiento horizontal en el viewport móvil revisado.
- Los estados visuales importantes suelen incluir texto además del color.

## 5. Hallazgos

### UX-001: el respaldo local puede conservar secretos

**Prioridad:** bloqueante  
**Ámbito:** privacidad, offline, confianza

`renderEventView` guarda el objeto completo del evento antes de extraer
`codigo_staff`. Si ese campo forma parte del documento, queda incluido en
`localStorage`, en contradicción con el ADR 0005.

**Impacto:** un código privado puede recuperarse desde el navegador y el modo
offline puede confundirse con una nueva validación de acceso.

**Acción requerida:** construir una representación explícita para respaldo que
incluya únicamente campos permitidos. Eliminar de respaldos nuevos y existentes
`codigo_staff`, `codigo_instructor`, tokens, credenciales y campos privados.

**Criterios de aceptación:**

- Ninguna clave de `localStorage` contiene códigos, tokens o credenciales.
- El evento offline conserva solo metadata pública, estaciones autorizadas y el alcance ya validado.
- Una prueba automatizada falla si aparece un nombre de campo secreto en el respaldo.
- Un respaldo expirado se elimina y solicita conexión.

### UX-002: contenido estructurado se presenta como `[object Object]`

**Prioridad:** bloqueante  
**Ámbito:** contenido, legibilidad, detalle de caso

La vista de detalle selecciona el primer valor verdadero de una sección y lo
interpela directamente en HTML. Cuando Firestore entrega un objeto
estructurado, el navegador muestra `[object Object]` en lugar del contenido.

**Impacto:** el caso publicado puede resultar ilegible y la tarea principal de
consulta no se puede completar.

**Acción requerida:** definir un renderizador por tipo de campo admitido y
validar el contrato de contenido antes de mostrar una sección. No usar una
conversión implícita de objetos a texto.

**Criterios de aceptación:**

- Texto, listas y estructuras admitidas se presentan con semántica apropiada.
- Un tipo desconocido produce un estado comprensible y registrable, nunca `[object Object]`.
- Existe una prueba con el caso real y otra con contenido incompleto.

### UX-003: los errores de entrada al evento eliminan el formulario

**Prioridad:** alta  
**Ámbito:** UX inversa, formularios, recuperación

Evento inexistente, código staff incorrecto y fallo de conexión reemplazan el
contenido de la vista. El formulario original dispone de una región para
errores, pero no se utiliza durante la validación remota.

**Impacto:** la persona no puede corregir el código ni reintentar en el mismo
contexto y puede perder valores que no son sensibles.

**Acción requerida:** mantener el formulario, asociar el error con el campo o
la acción correspondiente, mover el foco al punto de corrección y ofrecer
`Reintentar` cuando proceda. El código privado se debe limpiar tras un error de
validación.

**Criterios de aceptación:**

- Un código de evento incorrecto conserva el formulario y el modo de acceso.
- El mensaje está relacionado mediante `aria-describedby` o equivalente.
- El foco llega al mensaje o al campo que requiere corrección.
- Los errores de red incluyen `Reintentar` sin duplicar solicitudes.

### UX-004: navegación global incorrecta en Inicio y ausente en móvil

**Prioridad:** alta  
**Ámbito:** navegación, orientación, responsive

La cabecera aplica siempre el estado visual de Catálogo y oculta todo el
elemento `nav` por debajo del breakpoint `md`. En móvil solo queda disponible la
marca que lleva a Inicio.

**Impacto:** se comunica una ubicación incorrecta y los recorridos principales
no están disponibles desde cualquier vista móvil.

**Acción requerida:** pasar a la cabecera una sección activa explícita y crear
una navegación móvil accesible con Inicio, Catálogo, Evento y Recursos.

**Criterios de aceptación:**

- Inicio no marca Catálogo como activo.
- Solo la sección actual usa `aria-current="page"`.
- Las cuatro entradas están disponibles a 320 px sin solapamientos.
- La navegación se opera con teclado y no depende de hover.

### UX-005: pestañas y selector segmentado no completan el patrón ARIA

**Prioridad:** alta  
**Ámbito:** teclado, semántica, componentes compartidos

El selector Participante/Staff declara un `tablist`, pero sus botones no son
`tab`. Las pestañas de detalle y del generador no implementan foco itinerante,
relación con paneles ni navegación mediante flechas.

**Impacto:** las tecnologías de asistencia reciben una estructura incompleta y
las personas que usan teclado deben recorrer todas las opciones con `Tab`.

**Acción requerida:** diferenciar el selector segmentado de modo de acceso de
las pestañas de contenido y crear una implementación compartida para cada
patrón.

**Criterios de aceptación:**

- Cada pestaña tiene `role="tab"`, `aria-selected`, `aria-controls` y `tabindex` correcto.
- Cada panel tiene `role="tabpanel"` y nombre o relación con su pestaña.
- Flechas, Inicio y Fin cambian el foco según el patrón adoptado.
- El selector de acceso tiene nombre, estado y comportamiento coherentes sin simular navegación.

### UX-006: los diálogos no confinan ni restauran el foco

**Prioridad:** alta  
**Ámbito:** teclado, foco, salida segura

Los diálogos de salida y acceso proporcionan foco inicial y cierre con
`Escape`, pero permiten que `Tab` alcance el contenido de fondo. Al cerrar no
devuelven el foco al control que los abrió.

**Impacto:** se pierde el contexto de operación y una persona puede interactuar
accidentalmente con contenido que debería estar inerte.

**Acción requerida:** crear un componente común de diálogo que gestione título,
descripción, foco inicial, captura, fondo inerte, `Escape` y restauración.

**Criterios de aceptación:**

- `Tab` y `Shift+Tab` permanecen dentro del diálogo.
- `Escape` cierra únicamente operaciones reversibles.
- Al cerrar, el foco vuelve al botón de origen.
- El fondo no es interactivo mientras el diálogo está abierto.

### UX-007: volver no conserva filtros, posición ni historial

**Prioridad:** alta  
**Ámbito:** navegación, continuidad, UX inversa

Volver desde un detalle vuelve a renderizar y consultar el catálogo. No se
conservan filtros ni posición de lectura. La aplicación tampoco mantiene un
historial de vistas equivalente al botón visible `Volver`.

**Impacto:** comparar varios casos requiere repetir trabajo y el botón Atrás del
navegador produce resultados poco previsibles.

**Acción requerida:** definir estado de navegación por recorrido, conservar los
valores no sensibles durante la sesión y sincronizar transiciones con History
API.

**Criterios de aceptación:**

- Catálogo recupera filtros, conteo, posición y foco del caso abierto.
- Evento recupera acceso, vista, estaciones y contexto temporal vigente.
- Atrás del navegador y `Volver` llevan al mismo origen cuando corresponde.
- Cambiar de recorrido confirma la pérdida de contexto relevante.

### UX-008: la calculadora contiene controles sin semántica completa

**Prioridad:** media  
**Ámbito:** formularios, teclado, resultados dinámicos

El bloque `Avanzado: Calculadora WSJF` es un `div` con evento `click`; no se
puede activar de forma estándar con teclado y no comunica si está expandido.
Varias etiquetas tampoco están relacionadas con su control mediante `for`.

**Impacto:** parte de la calculadora no es operable mediante teclado y los
campos pueden anunciarse sin su contexto completo.

**Acción requerida:** usar un botón con `aria-expanded` y `aria-controls`,
asociar todas las etiquetas y anunciar los resultados sin interrumpir cada
cambio.

**Criterios de aceptación:**

- Todos los controles se alcanzan y operan solo con teclado.
- Cada `input` y `select` tiene nombre accesible persistente.
- El estado expandido se anuncia correctamente.
- La recomendación y los totales tienen una estrategia de anuncio documentada.

### UX-009: estados remotos incompletos y sin contrato compartido

**Prioridad:** media  
**Ámbito:** carga, vacío, error, offline

Las vistas incluyen mensajes de carga, vacío y error, pero no siguen un
contrato común. Algunas cargas no son regiones de estado, varios errores no
ofrecen recuperación y el aviso offline no muestra la fecha del respaldo aunque
se almacena `savedAt`.

**Impacto:** los cambios asíncronos pueden pasar inadvertidos y no siempre queda
claro qué información es actual o qué acción permite continuar.

**Acción requerida:** crear un aviso de estado compartido para carga, vacío,
éxito, advertencia, error recuperable, error bloqueante y respaldo.

**Criterios de aceptación:**

- Cada vista remota declara los siete estados definidos en el ADR.
- Carga y resultados relevantes se anuncian con la prioridad apropiada.
- El respaldo muestra fecha o antigüedad y nunca se presenta como sincronizado.
- Los errores recuperables incluyen una acción disponible por teclado.

### UX-010: falta validación automatizada de accesibilidad y recorridos

**Prioridad:** media  
**Ámbito:** calidad, prevención de regresiones

El script actual verifica sintaxis JavaScript, pero no cubre comportamiento,
teclado, accesibilidad, responsive ni seguridad del respaldo.

**Impacto:** una corrección visual o funcional puede reintroducir barreras sin
ser detectada antes del despliegue.

**Acción requerida:** incorporar pruebas de componentes y recorridos con
Playwright y un analizador de accesibilidad compatible con el proyecto.

**Criterios de aceptación:**

- La integración continua ejecuta recorridos críticos en móvil y escritorio.
- No hay infracciones automáticas críticas o serias sin excepción documentada.
- Existen pruebas explícitas de teclado, foco, errores, historial y caché.
- La revisión manual cubre contraste, zoom, texto largo, impresión y lectores de pantalla.

## 6. Plan de acción

### Fase 0: proteger datos y restaurar contenido esencial

**Objetivo:** resolver los defectos que comprometen privacidad o impiden leer un
caso.

| Orden | Trabajo | Hallazgos | Responsable sugerido | Evidencia de cierre |
| ---: | --- | --- | --- | --- |
| 1 | Filtrar y migrar el respaldo local | UX-001 | Frontend + seguridad | Prueba de almacenamiento sin secretos |
| 2 | Renderizar el esquema estructurado de casos | UX-002 | Frontend + contenido | Caso real legible y pruebas de tipos |

No se debe ampliar el alcance funcional antes de completar esta fase.

### Fase 1: navegación, recuperación y teclado

**Objetivo:** completar los recorridos actuales antes de añadir nuevos caminos
exitosos.

| Orden | Trabajo | Hallazgos | Responsable sugerido | Evidencia de cierre |
| ---: | --- | --- | --- | --- |
| 3 | Mantener y corregir el formulario de evento | UX-003 | Frontend | Pruebas de error y reintento |
| 4 | Corregir sección activa y navegación móvil | UX-004 | UX/UI + frontend | Pruebas a 320, 390 y 1280 px |
| 5 | Implementar pestañas y selector compartidos | UX-005 | Frontend | Pruebas de flechas y ARIA |
| 6 | Implementar diálogo compartido | UX-006 | Frontend | Pruebas de captura y retorno del foco |
| 7 | Conservar estado e historial | UX-007 | Frontend | Recorridos Atrás/Volver automatizados |

### Fase 2: consistencia de componentes y estados

**Objetivo:** reducir divergencias y hacer predecibles los comportamientos
compartidos.

| Orden | Trabajo | Hallazgos | Responsable sugerido | Evidencia de cierre |
| ---: | --- | --- | --- | --- |
| 8 | Corregir semántica de la calculadora | UX-008 | Frontend | Recorrido completo solo con teclado |
| 9 | Unificar avisos y estados remotos | UX-009 | UX writing + frontend | Matriz de estados por vista |
| 10 | Añadir foco visible y movimiento reducido | Transversal | UX/UI + frontend | Revisión visual y de preferencias |
| 11 | Revisar contraste y texto ampliado | Transversal | UX/UI + QA | Comprobación de contraste y zoom al 200 % |

### Fase 3: prevención de regresiones

**Objetivo:** convertir los criterios del ADR en controles repetibles.

| Orden | Trabajo | Hallazgos | Responsable sugerido | Evidencia de cierre |
| ---: | --- | --- | --- | --- |
| 12 | Incorporar Playwright y análisis automático | UX-010 | Frontend + QA | Comando reproducible local y en CI |
| 13 | Crear datos deterministas para pruebas | UX-002, UX-003, UX-009 | Datos + QA | Fixtures sin contenido sensible |
| 14 | Ejecutar revisión manual asistida | Transversal | QA + personas usuarias | Informe por navegador y tecnología de apoyo |

## 7. Matriz mínima de validación

Cada recorrido modificado se debe comprobar en:

| Condición | Comprobación mínima |
| --- | --- |
| Teclado | Orden lógico, foco visible, activación, cancelación y retorno del foco |
| Móvil | 320 y 390 px sin pérdida de navegación, acciones ni contenido |
| Escritorio | 1280 px con jerarquía y longitud de línea legibles |
| Zoom | 200 % sin solapamiento ni pérdida de controles |
| Carga | Mensaje anunciado y sin cambio inesperado de foco |
| Vacío | Explicación y siguiente acción cuando exista |
| Error recuperable | Valores no sensibles conservados, corrección y reintento |
| Error bloqueante | Motivo comprensible, retorno seguro y ayuda apropiada |
| Offline | Antigüedad visible, alcance explícito y ausencia de secretos |
| Impresión/PDF | Título, evento, estación, vista y contenido esencial presentes |
| Texto largo | Etiquetas, nombres, IDs y códigos envuelven sin desbordar |
| Preferencias | Movimiento reducido respetado cuando se solicite |

## 8. Definición de terminado

Una acción del plan se considera terminada cuando:

1. cumple todos sus criterios de aceptación;
2. incluye una comprobación automatizada cuando el comportamiento sea estable y repetible;
3. pasa `npm run validate` y la suite de recorridos;
4. se revisa con teclado en móvil y escritorio;
5. no introduce secretos en almacenamiento, mensajes o datos de prueba;
6. actualiza este documento si cambia el riesgo, el alcance o la decisión de diseño.

## 9. Seguimiento

La calificación debe repetirse al cerrar cada fase. La meta inicial es alcanzar
al menos 8/10 sin hallazgos bloqueantes ni altos abiertos. Una nota numérica no
sustituye los criterios: cualquier defecto que exponga secretos o impida
completar un recorrido esencial bloquea la aceptación aunque el promedio sea
superior.
