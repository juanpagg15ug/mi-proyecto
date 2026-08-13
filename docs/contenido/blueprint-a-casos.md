# Blueprint A — Reportes de caso

Estado: borrador PMV para revisión clínica, pedagógica y editorial antes de publicarse en Firestore.

Fuente de plantilla: [Plantillas y Blueprints maestros](https://drive.google.com/drive/folders/1yQuO03oTJPXeIzJs6hSdQVn6ZSAW23Fh?usp=sharing). Este archivo es una adaptación de trabajo; el documento maestro continúa en Drive.

Estos dos reportes son material de trabajo para `casos/{casoId}` y `casos_contenido/{casoId}/secciones/lectura`. No sustituyen protocolos institucionales ni la valoración de un paciente real.

## Caso 1 — Vía aérea difícil no anticipada

### Metadata pública

```text
caso_id: SIM-AN-2026-01
titulo: Vía aérea difícil no anticipada durante inducción anestésica
tipo: Simulación clínica
especialidad: Anestesiología y medicina crítica
eje_transversal: Comunicación y trabajo en equipo
estado: publicado-pendiente-validacion
```

### Resumen público

Durante la inducción anestésica de un adulto con obesidad y datos incompletos en la evaluación preoperatoria, la ventilación con mascarilla se vuelve progresivamente difícil y la primera estrategia de intubación falla. El equipo debe reconocer el deterioro, verbalizar el plan de rescate y priorizar la oxigenación.

### Vignette del estudiante

Paciente adulto de 56 años, 118 kg, programado para una cirugía abdominal no urgente. Refiere ronquido intenso y somnolencia diurna, pero no cuenta con estudios previos disponibles. En la valoración inicial está consciente, ansioso y hemodinámicamente estable. No se entrega fotografía ni medición adicional salvo que el estudiante la solicite.

Tras la inducción, el paciente presenta dificultad para mantener la ventilación con mascarilla. La capnografía es irregular. La primera laringoscopia no permite visualizar las cuerdas vocales. El equipo debe detenerse, pedir ayuda, optimizar la posición, usar el dispositivo disponible y declarar oportunamente el plan de rescate.

### Ficha técnica clínica

- Población: adulto con factores de riesgo de vía aérea difícil.
- Entorno: quirófano de cirugía electiva.
- Nivel: intermedio; requiere reconocimiento de deterioro y liderazgo compartido.
- Duración sugerida: 10 minutos de escenario y 15 minutos de debriefing.
- Recursos: maniquí adulto o simulador de vía aérea, monitor, bolsa-válvula-mascarilla, videolaringoscopio o dispositivo equivalente, dispositivo supraglótico, carro de vía aérea difícil.
- Resultado crítico: el equipo prioriza oxigenación, solicita ayuda y cambia de estrategia antes de acumular intentos.

### Objetivos de aprendizaje

1. Reconocer signos de ventilación e intubación difíciles y comunicarlos en voz alta.
2. Aplicar una secuencia de rescate coherente con los recursos y protocolos locales.
3. Distribuir tareas y cerrar el circuito de comunicación durante una crisis.
4. Escalar la ayuda y declarar el cambio de plan antes de que se agoten las opciones.

### Preguntas de preparación

- ¿Qué datos faltantes pedirías antes de inducir?
- ¿Qué señales hacen que la ventilación sea el problema prioritario?
- ¿Quién lidera, quién prepara el rescate y quién monitoriza el tiempo y la oxigenación?

## Caso 2 — Deterioro respiratorio en recuperación

### Metadata pública

```text
caso_id: SIM-AN-2026-02
titulo: Hipoventilación y deterioro respiratorio en recuperación anestésica
tipo: Reporte de caso
especialidad: Anestesiología y recuperación postoperatoria
eje_transversal: Seguridad del paciente y escalamiento
estado: publicado-pendiente-validacion
```

### Resumen público

Una persona adulta llega a recuperación después de un procedimiento breve. Inicialmente parece estable, pero desarrolla somnolencia, hipoventilación y desaturación. El equipo debe identificar el patrón, revisar causas reversibles, intervenir de forma escalonada y pedir apoyo antes de que el deterioro progrese.

### Vignette del estudiante

Paciente de 43 años, posterior a procedimiento ambulatorio con analgesia opioide. Ingresa somnoliento pero despertable a la voz. La frecuencia respiratoria es baja y la saturación fluctúa. El expediente menciona apnea del sueño referida por la familia, sin plan perioperatorio documentado.

Al inicio responde a estímulo verbal. Si el equipo no reevalúa de forma continua, aumenta la somnolencia y la ventilación se vuelve inadecuada. La información sobre medicación reciente y acompañamiento familiar se entrega solo cuando se solicita de forma dirigida.

### Ficha técnica clínica

- Población: adulto en recuperación postanestésica con riesgo de hipoventilación.
- Entorno: unidad de recuperación con monitorización básica.
- Nivel: básico-intermedio; se evalúa reevaluación, comunicación y escalamiento.
- Duración sugerida: 8 minutos de escenario y 12 minutos de debriefing.
- Recursos: monitor, oxígeno, bolsa-válvula-mascarilla, aspiración, expediente simulado y lista de medicamentos.
- Resultado crítico: el equipo identifica ventilación inadecuada, activa apoyo y no se limita a subir el oxígeno sin corregir la causa.

### Objetivos de aprendizaje

1. Diferenciar hipoxemia aislada de ventilación inadecuada mediante reevaluación clínica.
2. Buscar causas reversibles y revisar la medicación administrada.
3. Escalar la intervención y solicitar apoyo con un mensaje estructurado.
4. Entregar una transferencia clínica clara al equipo receptor.

### Preguntas de preparación

- ¿Qué información necesitas antes de decidir que el paciente está listo para egreso?
- ¿Qué hallazgos obligan a priorizar ventilación y no solo oxígeno suplementario?
- ¿Cómo comunicarías el deterioro al anestesiólogo responsable?

## Revisión obligatoria antes de publicar

- Validación clínica por anestesiología.
- Validación pedagógica de objetivos, dificultad y criterios de logro.
- Revisión de que las intervenciones coincidan con los protocolos del venue.
- Revisión editorial y eliminación de cualquier instrucción que pueda interpretarse como indicación para un paciente real.
- Completar metadatos de Google Docs en las tres secciones antes del seed.
