# Transferencia de Proyecto Praxis

Fecha de transferencia: 2026-08-14
Proyecto Firebase: `praxis-prio`
Sitio: `https://praxis-prio.web.app/`
Rama de trabajo: `main`

## 1. Resumen

Praxis es una plataforma web para un Banco General de casos y para experiencias operativas de simulacion. El Banco General contiene casos independientes; los eventos seleccionan casos mediante estaciones, pero no duplican su contenido.

El documento PDF compartido durante la sesion es una referencia historica de arquitectura. La implementacion actual es mas amplia y debe conservarse como fuente operativa principal. El PDF no debe usarse para retroceder el modelo vigente.

## 2. Fuentes y responsabilidades

```text
Google Docs       = fuente maestra editorial y colaborativa
Firestore         = metadata y snapshot publicado que consume la aplicacion
Navegador         = cache temporal para continuidad offline
PDF local         = respaldo manual de contingencia
```

Google Docs no se consulta directamente desde el frontend. Firestore conserva los metadatos de origen por seccion:

```text
fuente_google_doc_id
fuente_google_doc_url
version
actualizado_en
```

No se deben crear copias nuevas de los Google Docs solo por moverlos de carpeta. El ID del documento debe conservarse.

## 3. Modelo Firestore vigente

La base confirmada es Firestore Native, edicion `STANDARD`, base `(default)`, region `nam5`.

### Caso

```text
casos/{casoId}
```

Metadata publica actual:

```text
titulo
tipo
especialidad
eje_transversal
resumen_publico
estado
codigo_instructor
```

Valores recomendados:

```text
estado: borrador | en_revision | publicado | archivado
```

`codigo_instructor` es un control visual temporal del PMV. No es seguridad real y debera sustituirse por Firebase Authentication y reglas por rol.

Para la herramienta independiente de claves existe tambien el documento global:

```text
configuracion/accesos
  codigo_instructor: "VALOR_PRIVADO_DEL_PMV"
```

Este documento habilita el generador antes de que exista un `casoId`. No debe
confundirse con el `codigo_instructor` que puede conservar cada caso para la
revision fuera de evento.

### Contenido del caso

El contenido vive fuera del documento publico, pero conserva el mismo `casoId`:

```text
casos_contenido/{casoId}/secciones/lectura
casos_contenido/{casoId}/secciones/escenario
casos_contenido/{casoId}/secciones/debriefing
```

Los IDs de las secciones son fijos. No usar IDs automaticos.

#### `lectura`

Contenido publico para catalogo y participante:

```text
vignette_estudiante
ficha_tecnica
objetivos_aprendizaje
fuente_google_doc_id
fuente_google_doc_url
version
actualizado_en
```

#### `escenario`

Contenido operativo del escenario, que puede incluir material para actor y SimTech segun el rol:

```text
guion_actor
script_desarrollo
materiales
equipamiento
criterios_activacion
fuente_google_doc_id
fuente_google_doc_url
version
actualizado_en
```

#### `debriefing`

Contenido para instructor o facilitador:

```text
debriefing
checklist
preguntas_reflexion
puntos_clave
fuente_google_doc_id
fuente_google_doc_url
version
actualizado_en
```

### Evento y estaciones

```text
eventos/{eventoId}
eventos/{eventoId}/estaciones/{estacionId}
```

El evento selecciona casos existentes:

```text
eventos/SIM-CONG-2026/estaciones/ST-01
```

Campos de una estacion:

```text
nombre
caso_id
orden
duracion_minutos
```

El campo `caso_id` debe coincidir exactamente con el ID del documento en `casos` y `casos_contenido`.

## 4. Ejemplo canonico

```text
casos/SIM-AN-2026-01
casos_contenido/SIM-AN-2026-01/secciones/lectura
casos_contenido/SIM-AN-2026-01/secciones/escenario
casos_contenido/SIM-AN-2026-01/secciones/debriefing
eventos/SIM-CONG-2026
eventos/SIM-CONG-2026/estaciones/ST-01
```

Un caso puede ser publico y no pertenecer a ningun evento. Un evento solo crea una seleccion contextual del caso.

## 5. Flujo actual de acceso

### Catalogo

1. La aplicacion lee todos los documentos de `casos`.
2. Muestra filtros locales por `tipo` y `especialidad`.
3. Al abrir un caso, carga `lectura`.
4. El caso no necesita estar vinculado a un evento.

### Instructor fuera de evento

1. El caso publico muestra el boton `Acceso instructor`.
2. El usuario introduce el valor de `codigo_instructor`.
3. Si coincide, la vista carga `lectura`, `escenario` y `debriefing`.
4. La vista muestra las pestañas completas.

Este acceso es funcional para el PMV, pero el codigo se compara en el navegador y las reglas actuales permiten lectura publica. Por tanto, una persona con acceso tecnico podria leer los documentos directamente.

### Generador de claves del caso

Desde la pantalla inicial se puede abrir una herramienta independiente de
claves, similar a la calculadora de priorizacion. Solicita unicamente el codigo
global de `configuracion/accesos`, despues presenta dropdowns para año, producto,
area y eje/categoria, y genera el siguiente numero disponible. No es un
dashboard administrativo y no escribe en Firestore ni en Google Drive. Deriva
valores para copiar y mantener consistencia editorial:

```text
ID Firestore / caso_id: {casoId}
Carpeta de Google Drive: {casoId}__{producto}__{especialidad}__{subcategoria}
Secciones: lectura | escenario | debriefing
```

La herramienta tiene dos acciones separadas:

```text
Generar propuesta:
  Lee los casos existentes, calcula el siguiente NN y no escribe en Firestore.

Consultar caso existente:
  Recibe un casoId ya creado, lee su metadata y muestra sus relaciones reales.
```

La propuesta usa el formato `{PREFIJO}-{AREA}-{AÑO}-{NN}`. El dropdown de
prefijo ofrece `SIM` para casos Praxis/SIM-POCUS, `URL` para casos vinculados a
la Universidad Rafael Landívar y `REP` como opción futura para reportes. El
prefijo y `NN` se
eligen manualmente en dropdowns; no se calcula un incremento automatico. Esto
evita colisiones entre propuestas que nunca se publicaron y casos que si
existen en Firestore. Antes de mostrar la propuesta, la herramienta consulta
`casos/{casoId}` y la rechaza si la clave ya existe. La propuesta tambien
normaliza los valores para producir un nombre estable de carpeta y una ruta
jerarquica de Google Drive:

```text
SIM-POCUS/01_Banco_General/{producto}/{especialidad}/{categoria}/{nombre_de_carpeta}
```

La consulta revisa las estaciones bajo
`eventos/{eventoId}/estaciones/{estacionId}` y muestra las coincidencias por
`caso_id`. La generación de codigos para eventos,
estaciones, staff e instructores queda para una automatizacion futura; no se
implementa todavia un dashboard administrativo.

La UX de la herramienta esta organizada en pasos visibles: validar acceso y
despues elegir una accion en la barra lateral. El panel derecho muestra solo
una opcion a la vez: `Proponer ID`, `Planificar evento`, `Consultar caso` o
`Proponer acceso`. Cada
accion indica si lee datos o si solo prepara una propuesta; ninguna de estas
acciones persiste cambios en el PMV.

`Planificar evento` no se limita a generar un codigo. Recoge una ficha
preliminar con prefijo institucional, tipo de evento, año, edicion, nombre,
alcance, fecha, sede, estaciones previstas, responsable, casos publicados
seleccionados y equipo/instructores previstos por rol. Los casos se cargan
desde `casos` con `estado == publicado`; el equipo se captura como una nota
preliminar porque el PMV no tiene una coleccion de usuarios ni asignaciones
persistentes. Produce un
`eventoId` como `{PREFIJO}-{TIPO}-{AÑO}-{EDICION}`, consulta
`eventos/{eventoId}` para detectar colisiones y muestra una ruta sugerida en
`SIM-POCUS/02_Eventos/`. No crea el evento, sus estaciones, usuarios ni
permisos.

### Evento

1. El participante introduce el ID del evento.
2. La aplicacion carga el documento del evento y sus estaciones.
3. El staff debe introducir tambien `codigo_staff`.
4. La estacion abre el caso usando `caso_id`.
5. Las secciones se seleccionan por rol:

```text
estudiante -> lectura
actor      -> lectura + escenario
simtech    -> escenario
instructor -> lectura + escenario + debriefing
```

## 6. Respaldo offline vigente

El archivo [public/js/offlineCache.js](../public/js/offlineCache.js) guarda en `localStorage` durante 24 horas:

```text
evento y estaciones
metadata del caso
secciones del caso que ya cargaron correctamente
```

Si Firestore deja de responder, las vistas intentan utilizar el respaldo local y muestran el aviso `Modo respaldo`.

### Limitacion actual

El sistema no puede recuperar por primera vez un caso que nunca se haya cargado si el dispositivo ya esta sin conexion. Para una operacion en vivo se debe preparar cada dispositivo con conexion:

1. Abrir el evento.
2. Abrir todas las estaciones que se usaran.
3. Abrir cada caso.
4. Verificar el contenido correspondiente al rol.
5. Usar `Guardar respaldo PDF`.
6. Probar con WiFi lento y sin conexion.

### Evolucion recomendada

Crear un preparador offline de evento que descargue y verifique el paquete necesario antes del taller. Para datos reservados, no publicar `escenario` ni `debriefing` como archivos estaticos dentro de `public/`, porque cualquier URL de Hosting seria descargable. Para esa capa se requiere cache autorizado, IndexedDB, paquete cifrado o una aplicacion/entorno controlado.

## 7. Taxonomia del Banco General

El arbol visual debe construirse con metadata, no con colecciones anidadas de Firestore. Todos los casos permanecen en `casos/{casoId}` y la interfaz los agrupa por campos.

Campos de clasificacion recomendados para una siguiente iteracion:

```text
producto
categoria_catalogo
subcategoria_catalogo
visibilidad
```

La vista de catalogo ya admite esos campos de forma compatible hacia atras:
cuando existen valores en los documentos publicados, muestra filtros por
`producto`, `categoria_catalogo` y `subcategoria_catalogo`. Los documentos que
no tienen esos campos siguen apareciendo mediante los filtros actuales de
`tipo` y `especialidad`.

El catalogo filtra localmente `estado == publicado` despues de leer la
coleccion. Esto evita agregar una consulta compuesta o un indice nuevo durante
el PMV.

Ejemplo:

```text
producto: guion_simulacion
categoria_catalogo: Guiones de simulacion clinica
subcategoria_catalogo: Manejo de crisis (CRM)
visibilidad: publico
```

No se deben renombrar todavia `tipo`, `especialidad` ni `eje_transversal`, porque la interfaz actual ya los utiliza.

Valores sugeridos:

```text
producto: reporte_articulo | guion_simulacion
visibilidad: publico | evento | borrador
```

La taxonomia del PDF es historica y puede orientar la UI:

```text
Banco General Praxis
├── Reportes y articulos academicos
│   ├── Anestesiologia
│   ├── Oftalmologia
│   └── Rotaciones interprofesionales
└── Guiones de simulacion clinica
    ├── Anestesiologia
    └── Medicina interna / Urgencias
```

## 8. Indices y configuracion

La base es Firestore Standard. Las consultas actuales solo hacen lecturas por ID y listados completos; no usan `where`, `orderBy`, `limit` ni `collectionGroup`.

Estado comprobado:

```text
Indices compuestos remotos: 0
Excepciones de campo remotas: 0
```

El repositorio contiene [firestore.indexes.json](../firestore.indexes.json) con:

```json
{
  "indexes": [],
  "fieldOverrides": []
}
```

No agregar indices compuestos hasta que una consulta real los requiera.

## 9. Reglas actuales y seguridad

[firestore.rules](../firestore.rules) permite lectura publica de `casos`, `casos_contenido` y `eventos`, y bloquea escrituras desde la aplicacion.

Esto es una decision de PMV, no el modelo final de seguridad. Para la siguiente etapa:

1. Integrar Firebase Authentication.
2. Definir claims o permisos por rol.
3. Aplicar precedencia contextual por evento.
4. Proteger `escenario` y `debriefing` por documento.
5. Restringir `ficha` o material tecnico segun el rol SimTech.
6. Retirar `codigo_instructor` del documento publico cuando exista autenticacion real.

## 10. Contenido y gobernanza

Los blueprints actuales son borradores y deben validarse clinica, pedagogica y editorialmente antes de marcar un caso como publicado. No usar `publicado-pendiente-validacion` como publicacion final.

Antes de publicar contenido:

- completar los metadatos reales de Google Docs;
- comprobar que el `casoId` sea consistente en todas las rutas;
- revisar que los campos tengan los nombres canonicos;
- probar lectura publica;
- probar acceso instructor;
- probar cada rol de evento;
- probar el respaldo offline.

## 11. Archivos relevantes

- [public/js/views/caseDetailView.js](../public/js/views/caseDetailView.js): carga de metadata, secciones, roles, acceso instructor y respaldo offline.
- [public/js/views/eventView.js](../public/js/views/eventView.js): entrada a eventos, validacion de codigo staff y carga de estaciones.
- [public/js/views/catalogovView.js](../public/js/views/catalogovView.js): catalogo y filtros actuales.
- [public/js/offlineCache.js](../public/js/offlineCache.js): cache local de 24 horas.
- [docs/firestore-pmv.md](firestore-pmv.md): contrato detallado vigente del PMV.
- [firestore.rules](../firestore.rules): reglas de lectura y escritura actuales.
- [firestore.indexes.json](../firestore.indexes.json): configuracion explicita de indices.

### Centro de recursos publico

La aplicacion incluye una vista `Centro de recursos` accesible desde el inicio y
desde el header del catalogo. Publica copias controladas de:

```text
public/docs/blueprint-a-casos.md
public/docs/blueprint-b-via-aerea-dificil.md
public/docs/guia-editorial-casos.md
```

El mismo Centro de recursos concentra tambien las herramientas internas del
PMV:

```text
Calculadora de priorizacion
Proponer IDs y claves de acceso
```

La calculadora se abre directamente. El generador solicita primero el codigo
global de instructor y despues muestra los dropdowns para proponer un `casoId`,
consultar un caso existente o proponer una clave de acceso para instructor,
staff o participante. El inicio no muestra accesos separados para estas
herramientas; el Centro de recursos funciona como su punto comun de entrada.

Las claves propuestas son candidatas locales: no se guardan, no se reservan y
no quedan activas. Para que una clave funcione debe registrarse posteriormente
en el documento o flujo correspondiente. No confundir:

```text
ID de caso       = identificador Firestore, por ejemplo SIM-AN-2026-01
Clave propuesta  = candidato generado por la herramienta
Clave activa     = valor configurado en Firestore y usado por la aplicacion
```

No copiar a `public/` la transferencia tecnica, `firestore-pmv.md`, las reglas,
el roadmap completo ni documentos que contengan rutas, codigos o decisiones
operativas internas. Los recursos editoriales son documentacion de apoyo y no
modifican el modelo Firestore.

## 12. Validacion y despliegue

Validacion local:

```powershell
npm run validate
```

Despliegue de reglas:

```powershell
npm run deploy:rules
```

Despliegue del frontend:

```powershell
npm run deploy:hosting
```

No hacer deploy de contenido clinico de borrador sin validacion y sin sustituir los placeholders de Google Docs.

## 13. Checklist de entrega

- [ ] Confirmar que `casos/{casoId}` tiene metadata completa.
- [ ] Confirmar que el estado sea correcto.
- [ ] Confirmar que `lectura`, `escenario` y `debriefing` existan con esos IDs exactos.
- [ ] Confirmar que `lectura` funcione desde el catalogo.
- [ ] Confirmar que `codigo_instructor` funcione para el PMV.
- [ ] Confirmar que el caso este vinculado a una estacion solo cuando corresponda.
- [ ] Confirmar acceso de estudiante, actor, SimTech e instructor en eventos.
- [ ] Precargar casos y estaciones antes de una actividad sin conectividad.
- [ ] Guardar respaldo PDF por estacion.
- [ ] Validar el flujo online y offline.
- [ ] Planificar migracion a Firebase Authentication.
