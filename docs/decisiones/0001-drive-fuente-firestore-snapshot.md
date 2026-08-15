# ADR 0001: Drive como fuente y Firestore como snapshot

Fecha: 2026-08-14

Estado: aceptada para el PMV

## Contexto

Los casos se redactan y revisan de forma colaborativa en Google Docs. La
aplicación necesita lecturas predecibles, rápidas y estructuradas durante el
catálogo y los eventos. Consultar Google Docs directamente desde el frontend
acoplaría la experiencia en vivo a permisos, formato y disponibilidad editorial.

## Decisión

Se asignan responsabilidades distintas:

```text
Google Docs  -> fuente editorial maestra
Firestore    -> metadata y snapshot publicado
Navegador    -> caché temporal de continuidad
PDF local    -> respaldo manual por estación
```

Cada sección de Firestore conserva `fuente_google_doc_id`,
`fuente_google_doc_url`, `version` y `actualizado_en` para mantener trazabilidad.
El frontend consume Firestore y no consulta Google Docs como fuente de contenido
en tiempo real.

## Consecuencias

- La edición en Drive no modifica automáticamente la aplicación.
- Publicar exige transformar y versionar un snapshot.
- Un enlace de Drive no sustituye los campos estructurados de Firestore.
- La aplicación puede seguir funcionando temporalmente con contenido ya cargado.
- Debe existir una operación editorial explícita para actualizar el snapshot.
- Al mover o transferir un documento canónico se conserva su ID siempre que no
  haya sido reemplazado.

## Evolución

El importador automatizará validación, custodia, transformación y escritura. La
sincronización continua o bidireccional queda fuera de su primera versión.
