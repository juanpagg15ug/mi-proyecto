# Contrato Firestore del PMV

Proyecto Firebase: `praxis-prio`

## Gobernanza de fuentes maestras

### Estado transicional al 12 de agosto de 2026

SIM-POCUS todavía no cuenta con una cuenta ni un Drive institucional propio porque la entidad continúa en constitución legal. Los Google Docs maestros de los casos viven temporalmente en el Drive personal de Juanpa. Esto se acepta únicamente como estado transicional y no como arquitectura institucional final.

La misma dependencia debe revisarse para el proyecto Firebase `praxis-prio`: confirmar bajo qué cuenta de Google está registrado y planear su transferencia junto con la de Drive cuando SIM-POCUS tenga identidad institucional.

### Carpetas maestras registradas

- Carpeta raíz de casos clínicos y gobernanza: [praxis casos clinicos](https://drive.google.com/drive/folders/1xlQrxJzV4EQ-lcbFZj3fByJHr4XPp393).
- Carpeta de plantillas y Blueprints maestros: [3. PLANTILLAS Y BLUEPRINTS MAESTROS](https://drive.google.com/drive/folders/1yQuO03oTJPXeIzJs6hSdQVn6ZSAW23Fh?usp=sharing).

La primera carpeta funciona como raíz organizativa; la segunda es la fuente de las plantillas editoriales usadas para preparar los casos y guiones del PMV. Estos enlaces son referencias de origen, no una integración automática con Google Drive.

### Mitigación inmediata

- Mantener una única carpeta raíz para los documentos maestros, claramente separada de otros archivos personales.
- Usar dentro de esa carpeta la misma taxonomía del Banco General Praxis.
- Registrar en Firestore `fuente_google_doc_id`, `fuente_google_doc_url`, `version` y `actualizado_en` para cada sección.
- No crear copias nuevas al reorganizar la propiedad: el ID de un Google Doc se conserva al moverlo o transferirlo.

### Migración institucional futura

Cuando exista la cuenta institucional, mover o transferir la carpeta raíz y verificar permisos, propiedad y acceso del equipo. No recrear los documentos ni cambiar `fuente_google_doc_id` salvo que una verificación demuestre que el documento maestro fue reemplazado. Confirmar también la propiedad, facturación y administradores del proyecto Firebase antes de la transferencia.

## Nomenclatura obligatoria

- `codigo_staff`: campo del documento de evento.
- `caso_id`: campo de una estacion que apunta a `casos/{caso_id}`.
- `eventos/{eventoId}`: el ID del documento es el codigo que escribe el participante.
- Acceso `Participante`: codigo de evento, rol `estudiante`.
- Acceso `Staff`: codigo de evento + `codigo_staff`, roles `instructor`, `actor` o `simtech`.

No usar `codigo_staf`, `codigoStaff`, `staff_code`, `staffCode`, `casoId` ni `caso` como nombres de campos en Firestore.

## Rutas

```text
casos/{casoId}
casos_contenido/{casoId}/secciones/lectura
casos_contenido/{casoId}/secciones/escenario
casos_contenido/{casoId}/secciones/debriefing
eventos/{eventoId}
eventos/{eventoId}/estaciones/{estacionId}
```

## Caso publico

`casos/{casoId}` contiene solo metadata:

```text
titulo
tipo
especialidad
eje_transversal
resumen_publico
estado
```

En el PMV, `estado` debe ser `publicado`.

## Seccion lectura

`casos_contenido/{casoId}/secciones/lectura`:

```text
vignette_estudiante
ficha_tecnica
objetivos_aprendizaje
fuente_google_doc_id
fuente_google_doc_url
version
actualizado_en
```

## Seccion escenario

`casos_contenido/{casoId}/secciones/escenario`:

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

> En Firestore el campo debe escribirse `guion_actor` (sin espacio). La forma partida anterior es solo un recordatorio visual y no es un nombre valido.

## Seccion debriefing

`casos_contenido/{casoId}/secciones/debriefing`:

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

## Evento de demo

```text
eventos/SIM-CONG-2026
  nombre: "Taller Internacional de Crisis Anestesicas 2026"
  fecha: fecha del evento
  codigo_staff: "STAFF-2026"
```

## Estacion de demo

```text
eventos/SIM-CONG-2026/estaciones/ST-01
  nombre: "Via Aerea Dificil"
  caso_id: "SIM-AN-2026-01"
  orden: 1
  duracion_minutos: 10
```

## Seed manual minimo

1. Crear `casos/SIM-AN-2026-01`.
2. Crear sus tres documentos bajo `casos_contenido/SIM-AN-2026-01/secciones/`.
3. Crear `eventos/SIM-CONG-2026` con `codigo_staff`.
4. Crear `estaciones/ST-01` dentro del evento.
5. Confirmar que `caso_id` coincide exactamente con el ID del caso.
6. Probar participante con `SIM-CONG-2026`.
7. Probar staff con `SIM-CONG-2026` + `STAFF-2026`.

## Contenido de la Épica 5

El contenido curado del PMV está separado del contrato de datos para facilitar revisión y copia manual:

- [Blueprint A — Reportes de caso](contenido/blueprint-a-casos.md): dos reportes clínicos para el catálogo y sus secciones de lectura.
- [Blueprint B — Vía Aérea Difícil](contenido/blueprint-b-via-aerea-dificil.md): las cuatro fichas de la estación `ST-01` para estudiante, actor, SimTech e instructor.

Ambos documentos están marcados como borrador pendiente de validación clínica, pedagógica y editorial. El estado `publicado-pendiente-validacion` no debe usarse como publicación final sin completar esas revisiones.

## Tabla de seed PMV

Esta tabla es la referencia compartida para consola, pruebas y ensayo del 22. Los IDs son deliberadamente explícitos: no crear códigos alternativos ni cambiar `codigo_staff` por variantes.

| Elemento | Ruta | ID o valor canónico |
|---|---|---|
| Evento | `eventos/{eventoId}` | `SIM-CONG-2026` |
| Código staff | `eventos/SIM-CONG-2026.codigo_staff` | `STAFF-2026` |
| Estación | `eventos/SIM-CONG-2026/estaciones/{estacionId}` | `ST-01` |
| Caso | `casos/{casoId}` | `SIM-AN-2026-01` |
| Sección clínica | `casos_contenido/SIM-AN-2026-01/secciones/{sectionId}` | `lectura` |
| Sección escenario | `casos_contenido/SIM-AN-2026-01/secciones/{sectionId}` | `escenario` |
| Sección debriefing | `casos_contenido/SIM-AN-2026-01/secciones/{sectionId}` | `debriefing` |

### Metadatos de Google Docs por sección

Cada sección debe conservar el origen y la versión del contenido, incluso cuando el texto se copie manualmente desde Google Docs. Sustituir los valores de ejemplo por los datos reales del documento maestro.

| Campo | Ejemplo | Obligatorio en PMV |
|---|---|---|
| `fuente_google_doc_id` | `1AbCDeFGhiJKlmnOPqRstUvWXyz` | Sí |
| `fuente_google_doc_url` | `https://docs.google.com/document/d/1AbCDeFGhiJKlmnOPqRstUvWXyz/edit` | Recomendado |
| `version` | `v1.0` | Sí |
| `actualizado_en` | `2026-08-12T12:00:00-06:00` | Sí |

Los cuatro campos deben aparecer en `lectura`, `escenario` y `debriefing`. `actualizado_en` se guarda como fecha ISO-8601 si se captura como texto durante el seed manual; no mezclar formatos entre secciones.

## Publicacion

Antes de la demo, desde la raiz del proyecto:

```text
npm run validate
npm run deploy:rules
npm run deploy:hosting
```

Las reglas actuales son de PMV: lectura publica y escritura bloqueada. No representan autenticacion real; la proteccion por rol se implementa en la interfaz hasta una futura migracion a Firebase Authentication.

## Mensajes diferenciados del flujo de evento

La UI debe conservar estos diagnósticos para que el staff pueda corregir el seed sin interpretar un error genérico:

| Situación | Mensaje esperado |
|---|---|
| Evento inexistente | `No existe un evento con ese código.` |
| Código staff incorrecto | `El código privado del staff no coincide con este evento.` |
| Evento sin estaciones | `Este evento todavía no tiene estaciones.` |
| Estación sin caso | `Sin caso vinculado` |
| Caso sin contenido | `Este caso no tiene contenido operativo disponible para este rol.` |

## Resiliencia para uso en vivo (E4.6)

La aplicación guarda localmente, durante 24 horas, el último evento y sus estaciones, además de la metadata y las secciones del caso que el navegador ya cargó correctamente. Si Firestore deja de responder, la vista muestra un aviso de `Modo respaldo` y continúa con esos datos.

El respaldo no es autenticación ni sincroniza cambios: solo permite continuar una estación previamente abierta o cargada en ese dispositivo. El staff debe validar el código online antes del inicio; el código por sí solo no protege los datos frente a un usuario que inspeccione el cliente.

Cada estación de caso incluye `Guardar respaldo PDF`, que abre la impresión del navegador para guardar una copia local o imprimirla antes de iniciar. El procedimiento operativo recomendado es:

1. Con conectividad, abrir el evento y cada estación que se vaya a usar.
2. Abrir cada caso y verificar que el contenido de la vista correspondiente carga.
3. Usar `Guardar respaldo PDF` para conservar una copia por estación.
4. Preguntar a Sandra el 15 de agosto por la conectividad disponible en el venue y hacer una prueba con WiFi lento o desconectado.
