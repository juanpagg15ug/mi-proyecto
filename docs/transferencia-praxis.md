# Transferencia de Proyecto Praxis

Fecha de transferencia: 2026-08-14

Proyecto Firebase: `praxis-prio`

Sitio: <https://praxis-prio.web.app/>

Rama de trabajo: `main`

## 1. Propósito de este documento

Este archivo es un snapshot de entrega. Resume qué está implementado, qué tiene
límites conocidos, cuál es la siguiente implementación y qué queda fuera de ese
alcance.

No contiene el contrato Firestore completo, el diseño detallado del importador
ni el historial de decisiones. Esos temas viven en los documentos enlazados al
final.

## 2. Estado consolidado

### Realizado en el repositorio

- Shell web con entradas a catálogo, evento y Centro de recursos.
- Catálogo que muestra casos con `estado == publicado` y filtros locales por
  tipo, especialidad, producto, categoría y subcategoría.
- Detalle de caso con lectura pública y pestañas según contexto.
- Flujo funcional de evento con código, modo participante o staff, estaciones y
  relación por `caso_id`.
- Vistas de estudiante, instructor, actor y SimTech con selección de secciones
  en la interfaz.
- Contexto visible de evento, estación, rol y modo de acceso.
- Temporizador para participante y confirmación antes de salir del evento.
- Caché local de 24 horas para eventos y casos cargados previamente.
- Impresión o respaldo PDF por estación.
- Modelo Firestore para casos, contenido, eventos y estaciones.
- Reglas PMV con lectura pública y escritura bloqueada desde el cliente.
- Centro de recursos con las seis plantillas Word oficiales presentes en
  `public/docs/oficiales/`.
- Calculadora de priorización.
- Herramienta interna para proponer IDs, rutas de Drive, planificaciones de
  evento y candidatos de acceso sin persistir cambios.
- Emuladores de Hosting y Firestore.
- Validación sintáctica de JavaScript mediante `npm run validate`.

### Realizado parcialmente o con límites

- Los códigos controlan la experiencia de la interfaz, pero no son
  autenticación o autorización real.
- `casos_contenido`, incluidos `escenario` y `debriefing`, continúa con lectura
  pública en las reglas del PMV.
- Los roles de staff se seleccionan en la interfaz; no existen usuarios ni
  asignaciones persistidas por evento o estación.
- El respaldo offline solo funciona para contenido cargado previamente y no es
  una sesión autorizada.
- El contenido se transcribe o carga manualmente en Firestore. No existe
  sincronización con Drive.
- El número secuencial del generador se elige manualmente y no queda reservado.
- La metadata descargada por el generador usa `praxis.case.v1`; todavía no cumple
  el contrato `praxis.case.package.v1`.
- La descarga de metadata de evento no está conectada correctamente.
- La consulta de relaciones del caso queda interrumpida por el mismo defecto de
  manejadores en `caseKeyGeneratorView.js`.
- El motor de eventos está disponible para pruebas funcionales, pero no consta
  una validación operativa completa en un evento real.
- No existe suite automatizada de pruebas unitarias, de reglas o end-to-end.

## 3. Ruta inmediata alineada con la visión

Praxis se encuentra como PMV funcional previo a validación operacional
repetida. La siguiente ruta no es una sola feature: combina una entrega técnica
con evidencia en experiencias reales.

```text
Línea operacional
  -> probar eventos pequeños, recuperación, roles y continuidad

Línea editorial
  -> validar y custodiar contenido mediante el importador

Línea de confianza
  -> cerrar defectos, seguridad, pruebas y contingencia

Línea de evidencia
  -> medir coordinación, papel, incidencias y valor por actor
```

Las líneas avanzan de forma coordinada. La implementación editorial no debe
posponer indefinidamente la prueba del flujo de evento, y un piloto no debe
publicar contenido sin validación ni ignorar los límites de seguridad.

### 3.1 Siguiente implementación técnica

La siguiente pieza es el importador editorial en:

```text
Centro de recursos -> Herramientas de trabajo -> Importador editorial
```

El primer alcance incluye:

1. Autenticación real de coordinador limitada inicialmente al importador.
2. Google Identity Services y Google Picker con selección explícita de fuentes
  por sección.
3. Drive API para metadata, capacidades, descarga, copias y custodia; Docs API
  para estructura de Google Docs nativos.
4. Lectura y validación de `praxis.case.package.v1`.
5. Validación de IDs, colisiones, secciones, metadata, notas de plantilla,
   permisos y estados editoriales.
6. Copia canónica bajo custodia de la cuenta o unidad de alojamiento de Praxis.
7. Transformación a `casos` y `casos_contenido`.
8. Vista previa de cambios, advertencias y bloqueantes.
9. Escritura atómica por caso mediante backend con Admin SDK.
10. Auditoría e informe descargable.
11. Estado inicial `borrador` o `en_revision`.
12. Publicación solo con custodia y aprobaciones comprobadas.
13. Corrección y alineación del generador con los contratos que consumirá el
    importador.

El diseño completo, las fases y los criterios de aceptación están en
[importador-praxis.md](importador-praxis.md).

La primera entrega ejecutable del importador corresponde a validación sin
escritura: autenticación del coordinador, selección explícita, lectura de
metadata, validaciones y reporte. Custodia, transformación, escritura y
publicación se habilitan por fases cuando cumplan sus propias puertas de
seguridad y operación.

### 3.2 Validación operacional paralela

Antes de considerar el producto validado se requieren eventos pequeños, de
preferencia con alcance controlado de hasta 20 participantes:

1. seleccionar uno o dos casos revisados y estaciones manejables;
2. preparar contenido y acceso para participante, instructor, actor y SimTech;
3. ejecutar junto al proceso habitual y conservar contingencia;
4. introducir una interrupción o recuperación controlada;
5. registrar dudas de versión, búsquedas, mensajes, papel e intervenciones;
6. cerrar con observaciones de coordinación, facilitación y participantes;
7. decidir qué corregir, repetir, soportar o retirar antes del siguiente evento.

El congreso u otro evento de mayor exposición no debe ser el primer uso real.
Debe recibir una versión estabilizada a partir de pilotos previos y congelar
alcance con tiempo suficiente para ensayo y contingencia.

### 3.3 Valor por actor

La ruta no exige construir la misma cantidad para cada actor, pero cada entrega
debe declarar a quién beneficia y qué recorridos no puede degradar.

| Actor | Valor que debe comprobar Praxis |
| --- | --- |
| Coordinación | Menos búsquedas, mensajes paralelos, dudas de versión e intervenciones durante el evento |
| Participante | Entrada comprensible, contexto correcto, siguiente acción y recuperación sin exposición de contenido reservado |
| Instructor o facilitador | Caso y debriefing correctos, tiempo, estado de estación y capacidad de resolver incidencias |
| Actor | Guion y respuestas correspondientes a la estación y release utilizados |
| SimTech | Montaje, materiales, progresión y cambios operacionales visibles |
| Autor | Plantillas claras, borrador revisable y vacíos explícitos sin exigir conocimiento técnico interno |
| Revisión y publicación | Validaciones, custodia, vista previa, trazabilidad y bloqueo de publicaciones incompletas |
| Institución | Operación reproducible, menor dependencia del papel, límites de datos y evidencia para decidir integración o escala |

### 3.4 Puerta del horizonte inmediato

El horizonte inmediato se considera completo cuando:

- al menos un evento pequeño produce evidencia operacional utilizable;
- los defectos críticos encontrados tienen decisión y responsable;
- el contenido utilizado puede identificarse y reconstruirse;
- la recuperación y el respaldo proporcional fueron probados;
- el importador valida un paquete sin escribir ni publicar silenciosamente;
- se establece línea base de coordinación, incidencias y papel;
- la siguiente prioridad se decide con esos resultados, no solo con el plan
  previo.

Esto no convierte dashboard, scoreboard, rotaciones avanzadas u Odoo en
entregas inmediatas. Esas capacidades permanecen candidatas hasta que los
pilotos demuestren la fricción y los datos que deben resolver.

La experiencia documental integrada también permanece candidata. Los PDF y
documentos continúan con apertura externa o descarga hasta comparar, en una
tarea observada, continuidad, permisos, accesibilidad, móvil, offline y
fidelidad frente a un visor o contenido nativo.

## 4. Fuera del primer importador

- Autoservicio para que autores creen cuentas, administren borradores e importen
  directamente.
- Aprobación o publicación directa por el autor.
- Gestión completa de revisores, comentarios, devoluciones y aprobaciones.
- IAM transversal para toda la aplicación.
- Asignaciones persistidas de staff por evento o estación.
- Sustitución completa de códigos por identidad, aliases e invitaciones.
- Dashboard administrativo general.
- Migración institucional de Drive o Firebase.
- Creación de una Unidad compartida institucional.
- Sincronización continua o bidireccional con Google Docs.
- Extracción clínica totalmente automática sin revisión humana.
- Migración amplia del esquema y backfill de casos existentes.
- Preparador offline autorizado o cifrado.
- Competencia por equipos, intentos y puntuación sin una decisión funcional
  aprobada.

La arquitectura del importador no debe impedir estas evoluciones. Debe mantener
separados autor, operador, revisor, publicador, propietario de Drive y
responsable técnico.

## 5. Operación vigente

### Fuentes

```text
Google Docs  -> fuente editorial maestra
Firestore    -> metadata y snapshot publicado
Navegador    -> caché temporal de continuidad
PDF local    -> respaldo manual por estación
```

Google Docs no se consulta directamente desde el frontend. Las secciones de
Firestore conservan ID, URL, versión y fecha de su fuente editorial.

### Catálogo

1. Lee la colección `casos`.
2. Filtra localmente `estado == publicado`.
3. Muestra filtros compatibles con campos actuales y ampliados.
4. Al abrir un caso, carga `lectura`.
5. Un caso no necesita pertenecer a un evento.

### Evento

1. El participante introduce el ID del evento.
2. El staff introduce además `codigo_staff`.
3. La aplicación carga el evento y sus estaciones.
4. Cada estación abre el caso indicado por `caso_id`.
5. La interfaz selecciona secciones por rol:

```text
estudiante -> lectura
actor      -> lectura + escenario
simtech    -> escenario
instructor -> lectura + escenario + debriefing
```

Esto es control funcional de interfaz. Las reglas actuales no protegen las
secciones por rol.

### Centro de recursos

El Centro de recursos contiene:

```text
Guías y plantillas
  -> reporte académico
  -> guion de simulación por tres secciones
  -> guía editorial

Herramientas de trabajo
  -> calculadora de priorización
  -> IDs y claves de acceso
  -> importador editorial, cuando exista validación funcional
```

No debe mostrarse una tarjeta vacía para el importador. `Publicar` permanece
bloqueado hasta disponer de autenticación, custodia y escritura segura.

### Generador interno

La herramienta permite:

- proponer un `caso_id` y comprobar colisiones;
- calcular una ruta sugerida de Drive;
- preparar una planificación de evento;
- consultar metadata de un caso;
- proponer candidatos locales de acceso.

No reserva IDs, crea estaciones, activa claves, escribe Firestore o modifica
Drive.

Estado de salidas:

```text
metadata-{casoId}.json          -> funcional, esquema preliminar
metadata-evento-{eventoId}.json -> pendiente de corregir
informe-{casoId}.json           -> parcial
```

## 6. Seguridad vigente

[firestore.rules](../firestore.rules) permite lectura pública de `casos`,
`casos_contenido`, `eventos` y sus subcolecciones. Bloquea escrituras desde la
aplicación.

`codigo_instructor`, `codigo_staff` y el código global de herramientas se
comparan en el navegador. No deben utilizarse para proteger contenido sensible.

La autenticación del importador será la primera entrega de una evolución IAM
más amplia. La decisión completa está en
[ADR 0004](decisiones/0004-evolucion-iam-y-codigos.md).

## 7. Respaldo offline

`public/js/offlineCache.js` guarda durante 24 horas:

- evento y estaciones;
- metadata del caso;
- secciones ya cargadas para la vista correspondiente.

Antes de una actividad con conectividad incierta:

1. Abrir el evento.
2. Abrir todas las estaciones.
3. Verificar cada vista necesaria.
4. Guardar el respaldo PDF por estación.
5. Probar con WiFi lento y sin conexión.

El sistema no puede recuperar por primera vez contenido que nunca fue cargado en
ese dispositivo.

## 8. Validación y despliegue

Instalar dependencias:

```powershell
npm install
```

Iniciar emuladores:

```powershell
npm run dev
```

Validar JavaScript:

```powershell
npm run validate
```

Desplegar reglas:

```powershell
npm run deploy:rules
```

Desplegar frontend:

```powershell
npm run deploy:hosting
```

No desplegar contenido clínico de borrador, placeholders o fuentes sin revisar.

## 9. Checklist de entrega y operación

- [ ] Confirmar metadata completa en `casos/{casoId}`.
- [ ] Confirmar el estado editorial correcto.
- [ ] Confirmar las secciones requeridas con IDs exactos.
- [ ] Probar lectura pública desde el catálogo.
- [ ] Probar el control temporal de acceso instructor.
- [ ] Confirmar relaciones `caso_id` solo donde correspondan.
- [ ] Probar estudiante, actor, SimTech e instructor en eventos.
- [ ] Precargar eventos y casos antes de operar sin conexión.
- [ ] Guardar respaldo PDF por estación.
- [ ] Validar el flujo online y offline en condiciones reales.
- [ ] Ejecutar un piloto pequeño y registrar incidencias, recuperación y actores afectados.
- [ ] Establecer línea base de coordinación, búsquedas, mensajes y papel por evento.
- [ ] Corregir descargas y consulta de relaciones del generador.
- [ ] Alinear metadata del generador con `praxis.case.package.v1`.
- [ ] Implementar la fase A del importador sin escritura.

## 10. Documentos de referencia

- [README del proyecto](../README.md)
- [Visión de producto](vision-producto-praxis.md)
- [Ciclo de vida del producto](ciclo-vida-producto-praxis.md)
- [Mapa de decisiones arquitectónicas candidatas](mapa-decisiones-arquitectonicas-candidatas.md)
- [Plan futuro de orquestación e interoperabilidad](plan-evolucion-orquestacion-interoperabilidad.md)
- [Contrato Firestore del PMV](firestore-pmv.md)
- [Plan del importador](importador-praxis.md)
- [Memoria editorial para IA](ia-generacion-casos-praxis.md)
- [ADR 0001: Drive y Firestore](decisiones/0001-drive-fuente-firestore-snapshot.md)
- [ADR 0002: eventos y casos](decisiones/0002-eventos-referencian-casos.md)
- [ADR 0003: identidades y custodia](decisiones/0003-identidades-y-custodia.md)
- [ADR 0004: IAM y códigos](decisiones/0004-evolucion-iam-y-codigos.md)

El PDF histórico de arquitectura puede orientar contexto, pero no debe usarse
para retroceder el modelo vigente.
