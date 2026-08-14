# Blueprint A — Reportes de caso

**Uso:** plantilla editorial de referencia para preparar reportes de casos académicos.

> Este blueprint es material de trabajo. Requiere validación clínica, pedagógica y editorial antes de marcar un caso como publicado.

## Metadata pública

```text
caso_id:
titulo:
tipo: reporte_academico
especialidad:
eje_transversal:
resumen_publico:
estado: borrador | en_revision | publicado | archivado
```

## Lectura pública

Ruta de destino:

```text
casos_contenido/{casoId}/secciones/lectura
```

Contenido recomendado:

- Vignette o presentación clara del caso.
- Ficha técnica clínica.
- Objetivos de aprendizaje.
- Resumen público sin datos identificables.
- Preguntas de preparación o discusión.

## Documento de solución y facilitación

La guía de solución debe mantenerse separada de la lectura pública y reservarse para personal autorizado. Puede incluir:

- Objetivos pedagógicos.
- Análisis clínico y contextual.
- Diagnóstico diferencial o mapa de decisiones.
- Puntos clave de discusión.
- Preguntas de reflexión y debriefing.
- Integración explícita de inclusión, bioética y seguridad.

## Revisión antes de publicar

- Validación clínica.
- Validación pedagógica.
- Revisión editorial.
- Anonimización y confidencialidad.
- Fuentes y referencias en APA 7.
- Metadatos reales de Google Docs.
- Consistencia del `casoId` en todas las rutas.
