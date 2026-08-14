# Blueprint B — Guion de simulación clínica

**Uso:** ejemplo de referencia para preparar una estación de simulación.

> El guion maestro debe validarse clínica, pedagógica y editorialmente. No sustituye protocolos institucionales ni la valoración de un paciente real.

## Caso y estación

```text
caso_id: SIM-AN-2026-01
evento_id: opcional
estacion_id: opcional
duracion_escenario: 10 minutos
duracion_debriefing: 15 minutos
```

## Sección `lectura`

Destino:

```text
casos_contenido/{casoId}/secciones/lectura
```

Debe contener la viñeta del estudiante, la información que se entrega si se solicita y los objetivos visibles.

## Sección `escenario`

Destino:

```text
casos_contenido/{casoId}/secciones/escenario
```

Puede contener:

- `guion_actor`.
- `script_desarrollo`.
- `materiales`.
- `equipamiento`.
- `criterios_activacion`.
- Estado inicial y progresión del simulador.
- Acciones esperadas y respuestas del escenario.

## Sección `debriefing`

Destino:

```text
casos_contenido/{casoId}/secciones/debriefing
```

Debe incluir:

- Puntos clave de aprendizaje.
- Lista de cotejo técnica y no técnica.
- Preguntas de reflexión.
- Aplicación a la práctica futura.
- Integración de inclusión y comunicación.

## Diseño pedagógico

La secuencia recomendada es:

1. Contexto y briefing.
2. Experiencia en el escenario.
3. Captar emociones.
4. Comprender hechos y decisiones.
5. Concluir aprendizajes y acciones futuras.

El evento selecciona el caso mediante `caso_id`; no duplica el contenido del caso.
