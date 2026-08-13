# Contrato Firestore del PMV

Proyecto Firebase: `praxis-prio`

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

## Publicacion

Antes de la demo, desde la raiz del proyecto:

```text
npm run validate
npm run deploy:rules
npm run deploy:hosting
```

Las reglas actuales son de PMV: lectura publica y escritura bloqueada. No representan autenticacion real; la proteccion por rol se implementa en la interfaz hasta una futura migracion a Firebase Authentication.
