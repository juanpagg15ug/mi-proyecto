# Blueprint B — Guion de simulación

Estado: borrador PMV para revisión clínica, pedagógica y editorial.

Fuente de plantilla: [Plantillas y Blueprints maestros](https://drive.google.com/drive/folders/1yQuO03oTJPXeIzJs6hSdQVn6ZSAW23Fh?usp=sharing). Este archivo contiene la adaptación de trabajo para la estación demo; el guion maestro continúa en Drive.

Caso vinculado: `SIM-AN-2026-01`  
Evento demo: `SIM-CONG-2026`  
Estación demo: `ST-01 — Vía Aérea Difícil`  
Duración: 10 minutos de escenario + 15 minutos de debriefing

Este documento contiene las cuatro fichas del guion. El contenido debe copiarse manualmente a las tres secciones Firestore, no publicarse automáticamente desde este archivo.

## Ficha 1 — Participante / lectura clínica

Destino: `casos_contenido/SIM-AN-2026-01/secciones/lectura`

### Vignette del estudiante

Paciente adulto de 56 años, 118 kg, programado para cirugía abdominal no urgente. Refiere ronquido intenso y somnolencia diurna. No hay estudios previos disponibles. Está consciente, ansioso y hemodinámicamente estable.

Después de la inducción, la ventilación con mascarilla se vuelve difícil. La capnografía es irregular y el primer intento de laringoscopia no permite visualizar las cuerdas vocales. Explica en voz alta lo que encuentras, pide los recursos que necesites y prioriza mantener la oxigenación.

### Información que se entrega si se solicita

- Evaluación de apertura oral: limitada.
- Movilidad cervical: discretamente reducida.
- Dentición: incisivos superiores prominentes.
- Ayuno: confirmado.
- Carro de vía aérea difícil: disponible en el quirófano contiguo.
- Ayuda adicional: un segundo profesional puede llegar si se solicita.

### Objetivos visibles

- Reconocer la dificultad de ventilación e intubación.
- Organizar el equipo y verbalizar un plan de rescate.
- Pedir ayuda y cambiar de estrategia de forma oportuna.
- Mantener comunicación cerrada durante la crisis.

## Ficha 2 — Actor / paciente estandarizado

Destino: campo `guion_actor` dentro de `casos_contenido/SIM-AN-2026-01/secciones/escenario`

### Rol

Interpretas a un paciente anestesiado mediante el simulador disponible. No improvises datos clínicos nuevos. Responde solo a las claves entregadas por el facilitador o por el estado del simulador.

### Conducta por fase

| Fase | Conducta |
|---|---|
| Inicio | Antes de la inducción, expresa ansiedad y pregunta si el procedimiento será seguro. Si preguntan por sueño o ronquido, confirma ambos. |
| Ventilación inicial | Tras la inducción simulada, permite ventilación parcial con mascarilla. La capnografía debe verse irregular. |
| Primer intento | Si el equipo intenta intubar sin optimizar, mantén la dificultad y no entregues una vía fácil. |
| Reorientación | Si el equipo pide ayuda, mejora posición o solicita otro dispositivo, permite una respuesta gradual del simulador según la preparación definida. |
| Escalamiento | Si el equipo declara un plan de rescate y prioriza oxigenación, el facilitador puede estabilizar el escenario para cerrar el aprendizaje. |

### Frases permitidas antes de la inducción

- “Estoy muy ansioso, ¿qué pasa si no pueden colocar el tubo?”
- “Me han dicho que ronco mucho.”
- “No recuerdo haber tenido una anestesia difícil.”

No entregues espontáneamente la apertura oral, movilidad cervical, dentición ni disponibilidad del carro; esas respuestas requieren una pregunta directa.

## Ficha 3 — SimTech / operación del escenario

Destino: campo `script_desarrollo` dentro de `casos_contenido/SIM-AN-2026-01/secciones/escenario`

### Montaje

- Maniquí adulto o simulador de vía aérea.
- Monitor con frecuencia cardiaca, presión arterial, SpO2 y capnografía.
- Bolsa-válvula-mascarilla.
- Laringoscopio y videolaringoscopio si están disponibles.
- Dispositivo supraglótico.
- Carro de vía aérea difícil visible o señalizado.
- Cronómetro independiente.

### Estado inicial

- Frecuencia cardiaca: 86/min.
- Presión arterial: 138/82 mmHg.
- SpO2: 98% con oxígeno previo a la inducción.
- Capnografía: normal antes de la inducción.
- Personal disponible: operador principal y asistente.

### Progresión y claves

| Tiempo aproximado | Clave técnica | Respuesta esperada del equipo |
|---|---|---|
| 0–2 min | Inducción simulada; SpO2 permanece inicialmente estable. | Confirmar roles, monitorización y plan de vía aérea. |
| 2–4 min | Ventilación difícil; SpO2 desciende gradualmente a 92% si no se optimiza. | Pedir ayuda, optimizar posición y sellado, revisar oxigenación. |
| 4–6 min | Primer intento de intubación sin visión adecuada; SpO2 puede descender a 86%. | Detener intentos repetidos, declarar dificultad y cambiar de estrategia. |
| 6–8 min | Si se solicita, acercar videolaringoscopio o dispositivo supraglótico. | Distribuir tareas y ejecutar el plan de rescate. |
| 8–10 min | Estabilizar cuando el equipo prioriza oxigenación y comunica el plan. | Resumir estado, siguiente paso y necesidad de apoyo. |

### Criterios de parada

Detén el escenario si el equipo logra una estrategia de oxigenación eficaz, si el facilitador identifica un riesgo de equipo o si se alcanza el límite de 10 minutos. El objetivo no es completar una intubación perfecta, sino demostrar reconocimiento, comunicación y rescate organizado.

## Ficha 4 — Instructor / debriefing

Destino: `casos_contenido/SIM-AN-2026-01/secciones/debriefing`

### Criterios de observación

- Identificó y verbalizó la ventilación difícil.
- Solicitó ayuda antes de acumular intentos.
- Asignó funciones claras al equipo.
- Priorizó oxigenación y reevaluación.
- Cambió de estrategia después del primer intento fallido.
- Cerró el circuito de comunicación con el asistente.

### Debriefing sugerido

1. **Reacción:** ¿Qué fue lo primero que notaste y qué pensaste que estaba ocurriendo?
2. **Análisis:** ¿En qué momento la ventilación pasó a ser la prioridad? ¿Qué señales usaste?
3. **Análisis:** ¿Qué ayudó o dificultó la comunicación del equipo?
4. **Aplicación:** ¿Qué declararías en voz alta la próxima vez antes de iniciar la inducción?
5. **Cierre:** ¿Qué recurso o protocolo local consultarás para preparar tu plan de vía aérea difícil?

### Puntos clave

- Una primera intubación fallida debe activar reevaluación, comunicación y cambio de plan, no una repetición automática.
- La oxigenación y la ventilación son prioridades del equipo completo.
- Pedir ayuda temprano es una intervención de seguridad.
- El guion debe adaptarse a los recursos y protocolos del venue; el facilitador no debe convertirlo en una receta clínica universal.

### Checklist de cierre

- [ ] El equipo identificó la dificultad.
- [ ] Hubo una declaración explícita del plan.
- [ ] Se pidió ayuda.
- [ ] Se evitó insistir sin reevaluar.
- [ ] Se realizó una reflexión sobre comunicación y escalamiento.

## Metadatos de la fuente

Completar con los documentos maestros reales antes de publicar:

```text
fuente_google_doc_id: PENDIENTE_REVISION
fuente_google_doc_url: PENDIENTE_REVISION
version: v0.1-borrador
actualizado_en: 2026-08-12T00:00:00-06:00
```
