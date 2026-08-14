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

Las salidas pueden descargarse localmente como JSON:

```text
Proponer ID       -> metadata-{casoId}.json
Planificar evento -> metadata-evento-{eventoId}.json
Consultar caso    -> informe-{casoId}.json
```

La descarga no crea ni modifica documentos en Firestore, Google Drive o
Firebase Storage. Es un archivo de trabajo para revisión y posterior carga
manual.

### Compatibilidad futura con importacion

Las descargas de metadata se consideran el contrato preliminar para un futuro
flujo de importacion de casos y eventos. No deben tratarse solo como informes
visuales. El importador futuro debera poder leer `schema_version`, validar los
IDs, comprobar colisiones y convertir el archivo en documentos Firestore sin
depender de nombres visibles de la interfaz.

Archivos de trabajo previstos:

```text
metadata-{casoId}.json
  -> propuesta de caso y referencias a sus secciones/fuentes

metadata-evento-{eventoId}.json
  -> propuesta de evento, casos seleccionados, estaciones y equipo previsto

informe-{casoId}.json
  -> salida de consulta para lectura humana; no es un archivo de importacion
```

La descarga de plantillas y la preparacion de metadata no requieren codigo de
acceso. La metadata puede generarse desde las herramientas de propuesta o ser
entregada por el coordinador/administrador. El requisito de autorizacion
aplica al futuro importador cuando este tenga capacidad de escribir en el
sistema, y la metadata nunca debe incluir el codigo secreto:

```json
{
  "schema_version": "praxis.case.package.v1",
  "importacion": {
    "metadata_preparada": true,
    "autorizacion_para_escritura": "requerida_en_importador",
    "metodo": "codigo_del_sistema_o_autenticacion",
    "contacto_si_no_hay_acceso": "Coordinador o administrador de Praxis"
  }
}
```

No guardar `codigo_instructor`, `codigo_staff` ni ninguna clave activa dentro
de `metadata.json`. El importador deberá solicitar autorización solo al
momento de escribir; si no existe, mostrará que se debe contactar al
coordinador o administrador del sistema. Preparar o descargar el archivo no
debe quedar bloqueado por ese código.

La expectativa para autores debe comunicarse antes de descargar las plantillas:
una entrega no consiste solo en archivos Word. El paquete esperado es:

```text
Caso/
├── 00_Metadata/metadata.json
├── 01_Lectura/lectura.docx
├── 02_Escenario/escenario.docx
└── 03_Debriefing/debriefing.docx
```

El autor puede descargar las plantillas y preparar `metadata.json` con el
formato indicado, sin acceder al generador interno. El coordinador/administrador
puede generar una primera version de metadata y entregarla al autor. Despues el paquete pasa
por revision clinica, pedagogica y editorial. La autorizacion se solicitara
solo cuando exista un importador con capacidad de escribir en el sistema.

La nota sobre `metadata.json` debe aparecer junto a la estructura de carpetas y
las secciones que el autor va a descargar, porque forma parte del paquete de
entrega. La herramienta de propuestas repite la aclaracion al abrirse para
mantener el contexto, pero no debe convertirse en requisito para descargar las
plantillas. El generador de IDs, relaciones y planificación si solicita codigo:
es una herramienta interna para coordinadores y administradores, ya que revela
procesos que un usuario comun no necesita conocer.

El Centro de recursos sigue un flujo de dos niveles para autores:

```text
Centro de recursos
  -> Elegir tipo de guía
  -> Entrar a la guía
  -> Ver sus secciones y documentos Word
  -> Revisar expectativas de entrega e importación
  -> Descargar los archivos necesarios
```

El generador interno de IDs y relaciones aparece como herramienta separada y
no se presenta como paso obligatorio para autores. La metadata puede ser
preparada por el autor con el formato indicado o entregada posteriormente por
el coordinador/administrador.

La implementacion de la UI refleja este flujo: la primera pantalla muestra
tarjetas para elegir `Reporte de caso clinico academico`, `Guion de caso de
simulacion clinica` o `Guia editorial de casos`. El boton `Entrar a la guia`
abre una ficha con sus secciones, documentos Word descargables, expectativas de
entrega y estructura del paquete. Las herramientas internas permanecen en una
seccion separada y no forman parte del recorrido normal del autor.

### Notas de llenado de las plantillas

Las plantillas Word oficiales contienen texto de diseño instruccional, notas de
llenado, ejemplos y marcadores para el autor. Esos elementos ayudan a completar
el documento, pero no son contenido publicable del caso.

El importador futuro debe:

1. Detectar notas de plantilla por estilos, marcadores, etiquetas y patrones
   conocidos.
2. Mostrar una advertencia con el archivo, sección y texto detectado.
3. Indicar si la importación es bloqueante o si permite limpieza automática.
4. No publicar nunca las notas como `vignette_estudiante`, `script_desarrollo`,
   `debriefing` o cualquier otro campo operativo.
5. Ofrecer dos políticas explícitas:

```text
Modo revisión:
  Detiene la importación y pide al autor retirar las notas manualmente.

Modo limpieza autorizada:
  Elimina únicamente patrones de notas conocidos, muestra una previsualización
  del texto resultante y exige confirmación antes de continuar.
```

Si el sistema no puede distinguir con seguridad una nota de instrucciones del
contenido real, debe marcarla como `requiere_revision` y bloquear la publicación
en lugar de borrarla silenciosamente. El informe de validación deberá incluir:

```text
archivo
seccion
tipo: nota_de_llenado | marcador | ejemplo | contenido_ambiguo
severidad: advertencia | bloqueante
accion_recomendada
```

Reglas para mantener compatibilidad:

1. Conservar `schema_version` en cada archivo.
2. Mantener `caso_id`, `evento_id`, `estacion_id` y `casos_contenido` como nombres canonicos.
3. Separar propuestas de estados persistidos: `borrador`, `en_revision`, `publicado` y `archivado`.
4. No generar automaticamente numeros que no hayan sido reservados o creados.
5. Validar colisiones contra Firestore antes de importar.
6. No importar enlaces de Drive como permisos; solo como referencias (`id`, `url`, `folder_id`).
7. Mantener las relaciones evento-caso en estaciones mediante `caso_id`.
8. Permitir que el importador rechace el archivo completo y muestre errores por campo antes de escribir.

El importador tambien debera generar un resultado visible en la interfaz. No
debe limitarse a un mensaje generico como `Importacion fallida`.

Formato conceptual del resultado:

```json
{
  "resultado": "rechazado | listo_para_importar | importacion_parcial",
  "alcance": "archivo_completo | registros_parciales",
  "total_registros": 4,
  "validos": 3,
  "rechazados": 1,
  "errores": [
    {
      "registro": "casos/SIM-AN-2026-03",
      "campo": "caso_id",
      "codigo": "ID_DUPLICADO",
      "motivo": "El documento ya existe en Firestore.",
      "accion": "Elegir otro ID o revisar el caso existente."
    }
  ]
}
```

La interfaz debera informar claramente:

- que archivo se reviso;
- cuantos registros contiene;
- cuantos son validos;
- cuantos fueron rechazados;
- el campo y registro que causan cada error;
- el motivo del rechazo en lenguaje comprensible;
- si se rechazo el archivo completo o solo algunos registros;
- si existe una accion disponible para corregir y volver a validar.

Politica de carga:

```text
Rechazo completo:
  Un error estructural, de esquema o de relaciones invalida todo el archivo.

Carga parcial:
  Solo se permite si cada registro es independiente y la interfaz muestra
  exactamente cuales entrarian y cuales quedarian fuera.

Sin escritura:
  Si existe cualquier error, el importador debe detenerse antes de escribir
  salvo que la persona confirme explicitamente una carga parcial valida.
```

El resumen previo a confirmar debe presentar una tabla o lista de cambios con
estado `valido`, `advertencia` o `rechazado`. El usuario debe poder descargar
tambien el informe de validacion para conservar la razon de rechazo y corregir
el archivo original.

El futuro flujo recomendado sera:

```text
Descargar metadata
  -> Revisar JSON
  -> Importar archivo
  -> Validar esquema y relaciones
  -> Mostrar errores, advertencias y alcance de carga
  -> Mostrar resumen de cambios
  -> Confirmar carga completa o parcial
  -> Crear/actualizar documentos Firestore
```

Hasta que ese flujo exista, las descargas permanecen locales y no tienen
efecto de escritura.

`Planificar evento` no se limita a generar un codigo. Recoge una ficha
preliminar con prefijo institucional, tipo de evento, año, edicion, nombre,
alcance, fecha, sede, estaciones previstas, responsable, casos publicados
seleccionados, instructor lider, instructores asistentes y equipo operativo
previsto por rol. Los casos se cargan
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

### Hallazgo pendiente: alineacion con plantillas oficiales

Las plantillas oficiales de SIM-POCUS distinguen entre Reporte de Caso Clinico
Academico y Guion de Caso de Simulacion Clinica, y contienen mas metadata y
secciones que el contrato minimo del PMV. Por el momento no se cambia el
modelo vigente ni se migran documentos.

El contrato actual se considera suficiente para el PMV y conserva estos campos
compatibles:

```text
titulo
tipo
especialidad
eje_transversal
resumen_publico
estado
codigo_instructor
```

Como hallazgo para una fase posterior, las plantillas oficiales sugieren
evaluar campos comunes como:

```text
autores
afiliaciones
nivel_formacion
palabras_clave
duracion_briefing_minutos
duracion_escenario_minutos
duracion_debriefing_minutos
recursos_necesarios
integracion_inclusion
```

Para Reportes Academicos se debera evaluar la representacion de resumen,
introduccion, presentacion cronologica, discusion, conclusiones, referencias
APA 7 y anexos anonimizados. Para Guiones de Simulacion se debera evaluar
briefing, pacto de ficcion, confidencialidad, estado inicial, progresion,
acciones esperadas, respuestas del simulador, pistas, criterios de parada y
las fases `captar`, `comprender` y `concluir` del debriefing.

Decision actual: **no implementar este cambio durante el PMV**. Antes de una
migracion se debe revisar el contenido real de las tres plantillas oficiales,
definir un esquema versionado compatible y preparar una estrategia de
backfill. No renombrar los campos actuales sin una migracion planificada.

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
- [ia-generacion-casos-praxis.md](ia-generacion-casos-praxis.md): memoria y prompt maestro para generar paquetes de casos con las plantillas oficiales.

### Centro de recursos publico

La aplicacion incluye una vista `Centro de recursos` accesible desde el inicio y
desde el header del catalogo. La interfaz debe mostrar las plantillas oficiales
en formato Word desde:

```text
public/docs/oficiales/plantilla-1-reporte-caso-clinico-academico.docx
public/docs/oficiales/guia-editorial-casos.docx
```

La guia de simulacion oficial esta separada por secciones y vive en:

```text
public/docs/oficiales/simulacion/current/
├── 01_Lectura - v1Plantilla de Viñeta y Lectura Pública.docx
├── 02_Escenario - v1Plantilla de Guion y Script del Instructor.docx
└── 03_Debriefing - v1Plantilla de Facilitación y Listas de Cotejo.docx
```

La version anterior, de documento unico, se conserva solo como archivo
historico en:

```text
public/docs/oficiales/simulacion/archive/v1/
└── plantilla-2-guion-caso-simulacion-clinica.docx
```

El Centro de recursos presenta primero la guia y despues sus tres documentos.
No debe ofrecer como plantilla activa el antiguo Word unico de simulacion ni
usarlo como fuente para nuevas importaciones.

Los archivos Markdown resumidos no son la fuente oficial visible del Centro de
recursos. Pueden conservarse como apoyo técnico interno, pero no deben
reemplazar las plantillas Word.

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
