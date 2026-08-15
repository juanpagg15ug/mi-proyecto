# Plan del Importador Editorial Praxis

Fecha: 2026-08-14

Estado: planificado; no implementado

## 1. Objetivo

El importador conecta el paquete editorial de un caso con el snapshot
estructurado que consume Praxis:

```text
Google Drive
  -> selección de fuentes
  -> validación editorial y técnica
  -> custodia canónica
  -> vista previa
  -> escritura controlada en Firestore
```

La primera versión está dirigida a coordinadores. No es un sistema de autoría,
un editor de documentos ni una sincronización continua con Google Docs.

El importador es una línea de producto centrada en integridad editorial. No
sustituye la validación operacional del flujo de eventos ni representa por sí
solo el roadmap completo de Praxis. Su avance debe convivir con pilotos
pequeños, corrección de defectos y medición de valor para los demás actores de
la experiencia.

## 2. Ubicación en la aplicación

El punto de entrada estará en:

```text
Centro de recursos -> Herramientas de trabajo -> Importador editorial
```

No se mostrará una tarjeta sin acción útil. La herramienta puede aparecer
cuando permita seleccionar y validar un paquete. La acción `Publicar` debe
permanecer bloqueada hasta disponer de autenticación, custodia y escritura
segura.

## 3. Stack de Google Workspace

No existe una única API genérica de Google Workspace para este flujo. El
importador combinará servicios especializados:

```text
Google Identity Services
  -> consentimiento OAuth y token de acceso de la cuenta del operador.

Google Picker API
  -> selección visual de archivos concretos.

Google Drive API v3
  -> metadata, capacidades, descarga, exportación, carpetas, copias y custodia.

Google Docs API v1
  -> lectura de estructura y contenido de Google Docs nativos.
```

Picker no mueve, copia u organiza archivos. Esas operaciones corresponden a
Drive API. Docs API tampoco administra ubicación, propiedad o permisos.

La aplicación actual es JavaScript sin React. La integración debe usar Google
Identity Services y Picker directamente o el componente web oficial; no se
introducirá `react-google-drive-picker`.

### Configuración requerida

En el proyecto de Google Cloud se deben habilitar:

- Google Picker API;
- Google Drive API;
- Google Docs API.

También se requieren:

- un OAuth Client ID de tipo aplicación web;
- orígenes JavaScript autorizados para producción y emulador local;
- una API key restringida por origen y limitada a Picker API;
- el número de proyecto como `App ID` de Picker;
- pantalla de consentimiento OAuth configurada.

El token OAuth es obligatorio para que Picker muestre archivos privados. La API
key identifica y restringe la aplicación; no sustituye el consentimiento del
usuario.

### Scopes

Scope inicial:

```text
https://www.googleapis.com/auth/drive.file
```

`drive.file` permite trabajar con los archivos que el usuario abre o comparte
con la aplicación mediante Picker. Está admitido por Drive API y Docs API, y
evita solicitar lectura de todo el Drive.

No se solicitarán inicialmente:

```text
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/drive.readonly
https://www.googleapis.com/auth/documents
https://www.googleapis.com/auth/documents.readonly
```

Los scopes amplios solo se evaluarán si aparece un requisito que no pueda
resolverse con selección explícita. La justificación y el impacto de
verificación OAuth deberán documentarse antes de agregarlos.

Los access tokens se mantienen en memoria durante la operación. No se escriben
en `localStorage`, Firestore, metadata, logs o informes. Una operación posterior
de custodia realizada como la cuenta de alojamiento usa su propia autorización;
no reutiliza o transfiere el token del operador.

### Tratamiento por tipo de archivo

Google Doc nativo:

```text
MIME: application/vnd.google-apps.document
Picker -> Drive files.get -> Docs documents.get -> transformación estructurada
```

Docs API devuelve cuerpo, párrafos, tablas, estilos, listas, rangos y otros
elementos estructurales. Esa estructura ayuda a reconocer secciones y notas,
pero no elimina la revisión humana ni convierte automáticamente contenido
clínico libre en campos confiables.

Archivo `.docx` almacenado en Drive:

```text
MIME: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Picker -> Drive files.get con alt=media -> parser backend o conversión explícita
```

Docs API no lee directamente un `.docx` binario. Para producir contenido
estructurado se debe elegir una de estas políticas:

1. Convertir explícitamente una copia a Google Docs y leerla con Docs API.
2. Descargar el blob y procesarlo con una biblioteca DOCX en backend.
3. Validar y custodiar el archivo, pero bloquear la publicación hasta que exista
   contenido estructurado revisado.

La primera implementación preferirá Google Docs nativos para extracción. Los
`.docx` se aceptarán para validar el paquete y conservar el original, pero no se
publicarán como snapshot estructurado mediante una conversión silenciosa.

Drive `files.export` se usa para exportar documentos nativos y tiene un límite
de 10 MB por exportación. Los blobs se descargan con `files.get?alt=media`. Antes
de cualquiera de las dos operaciones se verifica `capabilities.canDownload`.

### APIs opcionales

Apps Script puede evaluarse como proceso autorizado por la cuenta de alojamiento
durante la etapa transitoria de `Mi unidad`. No es necesario para Picker ni para
leer documentos y no se adoptará sin definir autenticación, despliegue y
auditoría.

Las APIs administrativas de Google Workspace solo serían necesarias para una
futura organización o Unidad compartida institucional. No forman parte del
primer importador.

## 4. Responsabilidades e identidades

El diseño separa identidades que pueden usar correos distintos:

```text
Autor
  -> prepara el contenido y la metadata.

Operador del importador
  -> coordinador autenticado que selecciona, valida y confirma.

Propietario de Drive
  -> cuenta donde vive un documento de origen.

Cuenta o unidad de alojamiento
  -> custodia las copias canónicas de Praxis.

Responsable técnico
  -> configura Firebase, OAuth y la aplicación.
```

La autenticación de Praxis autoriza operaciones en el importador. Google OAuth
autoriza las operaciones de Drive del usuario correspondiente. Los correos no
tienen que coincidir y una autorización no sustituye a la otra.

No se deben guardar tokens OAuth, contraseñas o claves activas dentro de
`metadata.json` o Firestore.

## 5. Contrato de entrada

El esquema canónico es:

```text
schema_version: praxis.case.package.v1
```

Paquete de simulación:

```text
Caso/
├── 00_Metadata/metadata.json
├── 01_Lectura/lectura.docx
├── 02_Escenario/escenario.docx
├── 03_Debriefing/debriefing.docx
└── 04_Referencias/
```

Paquete de reporte académico:

```text
Caso/
├── 00_Metadata/metadata.json
├── 01_Reporte/reporte.docx
├── 02_Solucion_Facilitacion/solucion.docx
└── 03_Referencias/
```

El contrato debe variar por producto. Un reporte académico no debe exigir
`escenario` o `debriefing`.

La metadata mínima debe identificar:

- `schema_version`;
- `caso_id`;
- título, producto, especialidad y clasificación;
- estado y versión;
- archivos y tipos de sección;
- referencias de Drive disponibles;
- estado de las validaciones;
- requisitos de importación sin secretos.

El generador actual descarga `praxis.case.v1`. Debe alinearse con
`praxis.case.package.v1` antes de integrarlo como productor oficial del paquete.

## 6. Flujo funcional

### Paso 1: acceso

- Autenticar al coordinador con Firebase Authentication.
- Comprobar en backend que tiene permiso para importar.
- No reutilizar como seguridad el código global actual del generador.

### Paso 2: identidad del caso

- Leer o completar la metadata.
- Validar el formato de `caso_id`.
- Consultar colisiones en Firestore.
- Distinguir creación, actualización permitida y rechazo.

El importador no asigna silenciosamente el siguiente número. Los IDs propuestos
no quedan reservados hasta que exista una operación persistida.

### Paso 3: selección de fuentes

Usar Google Picker con alcance `drive.file`. Para el primer flujo se prefieren
controles explícitos por sección:

```text
Lectura      [Seleccionar en Drive] [archivo] [estado]
Escenario    [Seleccionar en Drive] [archivo] [estado]
Debriefing   [Seleccionar en Drive] [archivo] [estado]
```

Picker solo debe compartir con la aplicación los archivos elegidos. No se debe
recorrer o copiar el resto del Drive del operador.

Se pueden aceptar Google Docs y `.docx` si la transformación definida para cada
tipo es verificable. La selección de un archivo no implica que ya esté bajo
custodia de Praxis.

### Paso 4: validación

Ejecutar las validaciones sin escribir:

- esquema y versión soportada;
- consistencia de `caso_id` y nombres;
- secciones requeridas por producto;
- tipo MIME, disponibilidad y permisos de cada archivo;
- colisiones y relaciones Firestore;
- metadata y fuentes obligatorias;
- estado editorial y aprobaciones;
- notas de plantilla, placeholders y contenido ambiguo;
- reglas de anonimización e inclusión que puedan comprobarse;
- campos estructurados requeridos por el snapshot.

Cada resultado se clasifica como:

```text
válido       -> puede continuar
advertencia  -> requiere revisión o confirmación
bloqueante   -> impide escribir o publicar
```

### Paso 5: custodia

Los archivos de origen se conservan sin mover, renombrar o modificar. Antes de
publicar debe existir una copia canónica dentro de la ruta oficial de Praxis.

Compartir o seleccionar un archivo no cambia su propietario ni su ubicación.
Una copia creada por el operador dentro de una carpeta compartida de `Mi unidad`
puede seguir perteneciendo al operador. El proceso debe verificar:

- ID de la copia canónica;
- ubicación esperada;
- propietario o unidad responsable;
- capacidad de lectura posterior;
- versión y procedencia.

Mientras se use `Mi unidad`, la copia definitiva debe crearla una operación
autorizada como la cuenta de alojamiento o debe completarse una transferencia
de propiedad comprobable. A futuro se prefiere una Unidad compartida
institucional.

Firestore guarda las referencias canónicas, no los enlaces temporales del
operador. Si la custodia no puede comprobarse, el caso puede quedar
`en_revision`, pero no `publicado`.

### Paso 6: vista previa

Mostrar antes de escribir:

- caso y versión;
- archivos de origen y copias canónicas;
- rutas Firestore afectadas;
- documentos nuevos, modificados o rechazados;
- campos resultantes por sección;
- advertencias y bloqueantes;
- estado final propuesto.

La vista previa debe representar el snapshot real, no únicamente tres enlaces
de Drive.

### Paso 7: escritura

- Ejecutar la escritura en backend con Admin SDK.
- Volver a validar identidad, permiso, esquema y colisiones.
- Usar una operación atómica por caso.
- Registrar auditoría del operador, versión, resultado y rutas afectadas.
- Generar un informe descargable.

El estado inicial es `borrador` o `en_revision`. `publicado` requiere custodia,
contenido completo y aprobaciones clínica, pedagógica, editorial y de
anonimización.

## 7. Transformación a Firestore

Metadata pública:

```text
casos/{casoId}
```

Contenido estructurado:

```text
casos_contenido/{casoId}/secciones/lectura
casos_contenido/{casoId}/secciones/escenario
casos_contenido/{casoId}/secciones/debriefing
```

Cada sección conserva:

```text
fuente_google_doc_id
fuente_google_doc_url
version
actualizado_en
```

Los enlaces no sustituyen los campos que consume la interfaz, por ejemplo:

```text
lectura     -> vignette_estudiante, ficha_tecnica, objetivos_aprendizaje
escenario   -> guion_actor, script_desarrollo, materiales, equipamiento
debriefing  -> debriefing, checklist, preguntas_reflexion, puntos_clave
```

La estrategia de extracción debe definirse antes de publicar. Para la primera
versión es preferible recibir contenido estructurado y revisable junto al
documento humano. La interpretación clínica totalmente automática de `.docx`
arbitrarios queda fuera de alcance.

## 8. Notas de plantilla

El importador debe detectar notas de llenado, marcadores, ejemplos y contenido
ambiguo. Nunca debe copiarlos silenciosamente a Firestore.

Modos admitidos:

```text
Modo revisión
  -> detiene el flujo y pide corregir el documento de origen.

Modo limpieza autorizada
  -> propone retirar solo patrones conocidos, muestra el resultado y exige
     confirmación.
```

Si no puede distinguir una instrucción de contenido real, debe bloquear la
publicación y conservar el hallazgo en el informe.

## 9. Política de errores y cargas

Un error estructural, de esquema o de relaciones invalida el caso completo. La
carga parcial solo se admite para lotes cuyos registros sean independientes y
cuando la interfaz muestre exactamente cuáles entrarán.

Resultado conceptual:

```json
{
  "resultado": "rechazado | listo_para_importar | importacion_parcial",
  "alcance": "caso_completo | registros_independientes",
  "validos": 3,
  "rechazados": 1,
  "errores": [
    {
      "registro": "casos/SIM-AN-2026-03",
      "campo": "caso_id",
      "codigo": "ID_DUPLICADO",
      "motivo": "El documento ya existe en Firestore.",
      "accion": "Revisar el caso existente o elegir otro ID."
    }
  ]
}
```

Nunca se continúa desde caché ni se inicia una escritura sin conexión.

## 10. Seguridad

- Firebase Authentication protege el acceso al importador.
- Las reglas y el backend aplican autorización; ocultar controles no basta.
- Google OAuth y Firebase Authentication son autorizaciones separadas.
- Los tokens no se escriben en Firestore ni en metadata.
- Los secretos no viajan dentro del paquete editorial.
- Toda escritura registra identidad, fecha, alcance y resultado.
- La publicación requiere una confirmación explícita.

La autenticación del importador es la primera entrega de la evolución IAM, pero
el IAM transversal de toda Praxis queda fuera de esta implementación.

## 11. Fases de implementación

### Fase A: validación sin escritura

- tarjeta del importador en el Centro de recursos;
- autenticación del coordinador;
- Picker por sección;
- lectura de metadata;
- validaciones y reporte descargable;
- ninguna copia o escritura definitiva.

### Fase B: custodia y vista previa

- creación de copias canónicas;
- verificación de propiedad y ubicación;
- transformación estructurada;
- vista previa de rutas y cambios.

### Fase C: escritura controlada

- backend con Admin SDK;
- operación atómica por caso;
- auditoría;
- estados `borrador` y `en_revision`.

### Fase D: publicación

- comprobación de aprobaciones;
- cambio explícito a `publicado`;
- informe final y verificación desde catálogo.

## 12. Criterios de aceptación del primer importador

- Un coordinador autorizado puede seleccionar únicamente los archivos del caso.
- El sistema rechaza un esquema desconocido sin escribir.
- Las tres secciones de simulación se validan por separado.
- Los reportes usan su propio contrato de secciones.
- El sistema distingue origen y copia canónica.
- Ningún archivo ajeno a la selección se copia o modifica.
- La vista previa enumera todas las rutas Firestore afectadas.
- Un bloqueante impide la escritura.
- La escritura de un caso es atómica.
- Un caso no queda `publicado` sin aprobaciones y custodia verificadas.
- El resultado deja un informe y una entrada de auditoría.

## 13. Fuera de alcance

- autoservicio completo de autores;
- editor colaborativo dentro de Praxis;
- gestión completa de revisores y comentarios;
- IAM transversal de toda la aplicación;
- asignaciones persistidas de staff por evento;
- sincronización continua o bidireccional con Google Docs;
- extracción clínica sin revisión humana;
- migración institucional de Drive o Firebase;
- dashboard administrativo general;
- preparación offline del importador.

## 14. Referencias

- [README del proyecto](../README.md)
- [Contrato Firestore](firestore-pmv.md)
- [Memoria editorial](ia-generacion-casos-praxis.md)
- [ADR 0001: Drive y Firestore](decisiones/0001-drive-fuente-firestore-snapshot.md)
- [ADR 0003: identidades y custodia](decisiones/0003-identidades-y-custodia.md)
- [ADR 0004: IAM y códigos](decisiones/0004-evolucion-iam-y-codigos.md)
