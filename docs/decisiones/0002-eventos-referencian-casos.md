# ADR 0002: Los eventos referencian casos

Fecha: 2026-08-14

Estado: aceptada e implementada en el PMV

## Contexto

Un mismo caso puede utilizarse en varios eventos y también existir en el
catálogo sin pertenecer a ninguno. Duplicar contenido dentro de cada evento
produciría versiones divergentes y dificultaría las actualizaciones.

## Decisión

Los casos y su contenido son independientes:

```text
casos/{casoId}
casos_contenido/{casoId}/secciones/{sectionId}
```

Los eventos seleccionan casos mediante estaciones:

```text
eventos/{eventoId}/estaciones/{estacionId}
  caso_id: {casoId}
```

`caso_id` debe coincidir exactamente con el ID de `casos` y
`casos_contenido`. Las secciones canónicas son `lectura`, `escenario` y
`debriefing`; no usan IDs automáticos.

El nombre o título visible de un caso es metadata mutable y no es su identidad.
Renombrar el caso o los encabezados de sus secciones en Google Docs tampoco
cambia `casoId`, `sectionId` ni las referencias de las estaciones. Esos cambios
editoriales solo llegan a Firestore mediante una publicación explícita del
snapshot. En cambio, cambiar un `casoId` o uno de los IDs canónicos de sección
es una migración de datos y referencias, no una corrección editorial.

## Consecuencias

- Un caso puede estar publicado sin evento.
- Un evento no duplica contenido clínico.
- Varias estaciones pueden reutilizar el mismo caso.
- El rol y el contexto determinan qué secciones carga la interfaz.
- Cambiar el título o nombre visible no obliga a modificar las estaciones.
- Eliminar un caso o cambiar su `casoId` requiere revisar y actualizar todas sus
  estaciones, además de las rutas de contenido asociadas.
- El importador debe validar relaciones antes de escribir.

## Alternativa descartada

Guardar una copia completa del caso dentro de cada evento. Se descarta por
duplicación, deriva editorial y mayor costo de mantenimiento.
