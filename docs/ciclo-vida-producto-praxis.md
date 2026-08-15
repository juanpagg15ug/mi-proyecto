# Ciclo de vida del producto Praxis

Fecha: 2026-08-14

Estado: marco estratégico para validación; no constituye una ADR ni un
cronograma comprometido

## 1. Propósito

Definir cómo Praxis pasa de hipótesis de producto a operación repetible,
integración institucional, escala, madurez y eventual retiro. Este marco ayuda
a decidir qué evidencia necesita cada etapa y evita interpretar un prototipo,
piloto o integración como producto terminado.

El ciclo de vida del producto no sustituye:

- el ciclo de preparación y ejecución de una simulación;
- el ciclo editorial y de publicación de un caso;
- el ciclo de una release de software;
- el ciclo de una integración o migración;
- los planes técnicos y ADR de cada scope.

Esos ciclos se relacionan, pero tienen owners, riesgos y ritmos distintos.

## 2. Unidad de avance

Praxis avanza cuando aumenta su capacidad de sostener experiencias reales con
contexto íntegro, menor coordinación fragmentada y recuperación comprobable.

Agregar funcionalidades, completar pantallas o desplegar código no demuestra
por sí solo avance de etapa. Cada transición exige evidencia operacional.

Indicador rector propuesto:

> Porcentaje de experiencias ejecutadas de principio a fin con contexto
> íntegro y sin incidencias críticas de coordinación.

Este indicador continúa como hipótesis hasta definir línea base, integridad de
contexto y severidad de incidencias.

## 3. Evaluación de etapa actual

Evaluación provisional al 14 de agosto de 2026:

```text
Producto
  -> PMV funcional previo a validación operacional repetida

Contenido
  -> plantillas y casos en preparación y revisión

Operación
  -> flujo de evento disponible; pendiente de evidencia suficiente en eventos reales

Seguridad
  -> controles funcionales de interfaz; IAM real pendiente

Integración
  -> planes y contratos candidatos; sin piloto institucional
```

Esta evaluación no es un certificado de madurez. Debe actualizarse con
resultados de eventos, incidentes, decisiones y cambios de alcance.

## 4. Etapas del producto

### Etapa 0: descubrimiento del problema

**Objetivo:** comprobar que la coordinación fragmentada, pérdida de contexto,
versiones y dependencia del papel constituyen un problema relevante.

Evidencia:

- entrevistas y observación del proceso actual;
- herramientas y transferencias manuales utilizadas;
- incidentes, tiempos y reimpresiones;
- personas responsables y consecuencias del problema.

Puerta de salida:

> Existe un problema repetido, una población concreta y una mejora observable
> que justifica experimentar.

### Etapa 1: encuadre de solución y prototipo

**Objetivo:** probar recorridos y conceptos sin presentarlos como operación
confiable.

Evidencia:

- prototipo con casos, eventos y estaciones;
- validación de lenguaje y tareas;
- frontera inicial de producto;
- riesgos y supuestos explícitos.

Puerta de salida:

> Personas representativas comprenden el flujo y pueden completar una tarea
> controlada con asistencia.

### Etapa 2: PMV funcional

**Objetivo:** conectar el recorrido mínimo de preparación y ejecución con datos
y contenido suficientemente reales para ensayar.

Evidencia:

- catálogo, evento, estaciones y vistas funcionales;
- contenido versionado identificable;
- recuperación y contingencia básicas;
- límites de seguridad y operación documentados;
- defectos críticos inventariados.

Puerta de salida:

> Una simulación pequeña puede ensayarse de principio a fin sin depender de
> comportamientos no documentados.

### Etapa 3: validación operacional

**Objetivo:** utilizar Praxis en eventos pequeños y aprender bajo condiciones
reales sin convertir el piloto en dependencia crítica prematura.

Evidencia:

- varios eventos con participantes, facilitación y coordinación reales;
- línea base y comparación de tiempo, papel e incidencias;
- interrupciones y recuperación observadas;
- decisiones de continuar, corregir o retirar capacidades;
- contenido y responsabilidades validados.

Puerta de salida:

> Praxis reduce una fricción importante de forma repetida y el equipo puede
> operar el flujo con contingencia aceptable.

### Etapa 4: productización Standalone

**Objetivo:** convertir el aprendizaje de pilotos en una operación autónoma,
repetible, soportable y segura.

Evidencia:

- onboarding y configuración reproducibles;
- IAM y protección de contenido según riesgo;
- observabilidad, soporte, respaldo y recuperación;
- contratos y datos locales mínimos estables;
- pruebas de recorridos y operación documentada;
- costos de mantenimiento conocidos.

Puerta de salida:

> Una institución puede operar Praxis en el alcance soportado sin depender del
> equipo constructor para cada evento.

### Etapa 5: validación de integración

**Objetivo:** comprobar que proveedores institucionales reducen duplicación sin
debilitar el core ni el modo Standalone.

Evidencia:

- proveedor local y adaptador externo comparables;
- ownership, semántica y políticas definidos;
- degradación y datos desactualizados probados;
- privacidad, autorización y auditoría aprobadas;
- estrategia de convivencia, migración o retiro por capacidad;
- mejora medible frente al modo autónomo.

Puerta de salida:

> La integración aporta valor operacional probado y puede mantenerse sin crear
> un segundo sistema de registro accidental.

### Etapa 6: escala controlada

**Objetivo:** ampliar instituciones, eventos, proveedores o volumen sin perder
continuidad, seguridad y capacidad de soporte.

Evidencia:

- contratos versionados y compatibilidad;
- métricas por institución y modo de despliegue;
- aislamiento de configuración y datos;
- soporte, incidentes y recuperación con responsables claros;
- rendimiento y costos dentro de presupuestos acordados;
- gobierno de cambios y migraciones.

Puerta de salida:

> El crecimiento no aumenta incidentes críticos ni trabajo manual de forma
> desproporcionada.

### Etapa 7: madurez y optimización

**Objetivo:** mejorar confiabilidad, eficiencia y resultados sin expandir el
scope por inercia.

Trabajo típico:

- simplificar recorridos y retirar duplicaciones;
- automatizar operaciones repetidas con evidencia;
- optimizar restricciones y capacidad;
- fortalecer interoperabilidad y observabilidad;
- revisar pricing, soporte y niveles de servicio si aplican;
- reevaluar capacidades con baja adopción o alto costo.

Puerta de continuidad:

> Cada inversión conserva una relación demostrable con resultados del producto
> o reducción de riesgo.

### Etapa 8: deprecación, sustitución o retiro

**Objetivo:** cerrar de forma segura una capacidad, modo de despliegue,
integración o el producto cuando ya no justifique su costo o riesgo.

Requisitos:

- consumidores e impacto identificados;
- alternativa o cierre comunicado;
- exportación, retención y eliminación definidas;
- escrituras bloqueadas en la fecha acordada;
- integraciones, secretos e infraestructura retirados;
- acceso histórico limitado cuando corresponda;
- evidencia de cierre y responsables.

Puerta de salida:

> No quedan dependencias ocultas, datos sin owner ni sistemas legacy activos por
> omisión.

## 5. Ciclo de vida de una capacidad

El producto puede estar en una etapa mientras sus capacidades se encuentran en
otras. Por ejemplo, eventos puede estar en validación operacional y Odoo en
descubrimiento.

Cada capacidad usa este ciclo:

```text
Candidata
  -> problema e hipótesis registrados

Descubrimiento
  -> usuarios, reglas, datos y alternativas observados

Experimento
  -> alcance limitado y métrica definida

Piloto
  -> uso real con contingencia y soporte cercano

Soportada
  -> contrato, operación, seguridad y soporte comprometidos

En revisión
  -> valor, costo o riesgo cuestionado

Deprecada
  -> no se amplía; consumidores reciben transición

Retirada
  -> operación y dependencias cerradas
```

Una tarjeta visible, un prototipo o código desplegado no convierten una
capacidad en soportada.

## 6. Ciclos relacionados

| Ciclo | Unidad | Pregunta principal |
| --- | --- | --- |
| Producto | Praxis | ¿Demuestra valor y puede sostenerse en su etapa? |
| Capacidad | Dashboard, importador, rotaciones, integración | ¿Debe descubrirse, soportarse o retirarse? |
| Experiencia | Evento o simulación | ¿Puede prepararse, ejecutarse y reconstruirse? |
| Contenido | Caso o guía | ¿Qué versión está en trabajo, aprobada o publicada? |
| Software | Release de aplicación | ¿Qué cambio se despliega, observa y revierte? |
| Instalación | Institución o tenant | ¿Cómo se configura, migra, actualiza o retira? |
| Integración | Adaptador y contrato | ¿Cómo se autentica, sincroniza, degrada y termina? |

Los estados no se heredan entre ciclos. Un producto en piloto puede usar una
release de software estable; un caso publicado no demuestra que la operación
del evento esté validada; una integración técnica funcional no está soportada
hasta completar seguridad, contingencia y ownership.

## 7. Modos de despliegue y madurez

`Standalone`, `Integrated` y `Ecosystem` no son necesariamente etapas lineales.
Son modos que pueden alcanzar diferente madurez:

```text
Standalone soportado
Integrated experimental
Ecosystem en descubrimiento
```

Praxis no debe abandonar un modo estable solo para presentar otro como más
avanzado. Cada modo necesita alcance, soporte, seguridad, costos y política de
retiro propios.

## 8. Gobierno de portafolio

Las capacidades se evalúan mediante el
[procedimiento de evaluación](procedimiento-evaluacion-capacidades.md), que
separa valor, arquitectura, seguridad, UX y operación antes de autorizar un
experimento o promoción.

Toda capacidad candidata debe declarar:

- problema y población;
- relación con la tesis de producto;
- owner de producto y técnico;
- etapa actual;
- métrica y línea base;
- riesgos y dependencias;
- costo de operación esperado;
- criterio de avance;
- criterio de detención o retiro.

El dashboard operacional, scoreboard, experiencia documental integrada,
integraciones y automatizaciones no se priorizan por visibilidad. Avanzan
cuando reducen una fricción o riesgo medible de la experiencia.

El scoreboard competitivo requiere además una decisión pedagógica, privacidad
y seguridad psicológica; no se deriva automáticamente de disponer de datos.

## 9. Revisiones y decisiones

Se recomienda revisar el ciclo:

- después de cada piloto o evento relevante;
- antes de promover una capacidad a soportada;
- antes de cambiar de modo de despliegue;
- después de un incidente crítico;
- antes de una migración, consolidación o retiro;
- en una revisión periódica de producto y arquitectura.

Cada revisión produce una decisión explícita:

```text
continuar
ajustar alcance
repetir experimento
pausar
deprecar
retirar
```

No decidir también tiene costo: mantiene capacidades, integraciones y sistemas
legacy sin una justificación vigente.

## 10. Métricas por etapa

| Etapa | Evidencia principal |
| --- | --- |
| Descubrimiento | Frecuencia, severidad y costo del problema |
| Prototipo | Comprensión y finalización de tareas controladas |
| PMV | Recorrido completo y defectos conocidos |
| Validación operacional | Eventos exitosos, recuperación, coordinación y papel |
| Productización | Autonomía operativa, seguridad, soporte y confiabilidad |
| Integración | Duplicación evitada, calidad, latencia y degradación |
| Escala | Incidentes, rendimiento, soporte y costo por experiencia |
| Madurez | Retención, eficiencia, simplificación y resultado sostenido |
| Retiro | Consumidores migrados, datos resueltos y dependencias cerradas |

## 11. Guardrails

- No promover por cantidad de funcionalidades.
- No declarar validación operacional a partir de una demo.
- No llamar soportada a una integración sin contingencia y owner.
- No confundir uso con valor ni actividad con resultado.
- No ampliar el scope para justificar inversión pasada.
- No mantener capacidades sin métrica, owner o condición de salida.
- No retirar sin resolver datos, consumidores, permisos y trazabilidad.
- No usar una fecha pública para omitir seguridad o recuperación.

## 12. Relación con decisiones y planes

- [Procedimiento de evaluación de capacidades](procedimiento-evaluacion-capacidades.md): convierte los filtros en una puerta reutilizable.
- [Visión de producto](vision-producto-praxis.md): define tesis, unidad de valor y métricas iniciales.
- [Transferencia vigente](transferencia-praxis.md): registra estado implementado y siguiente entrega.
- [Mapa de decisiones candidatas](mapa-decisiones-arquitectonicas-candidatas.md): gobierna la promoción de temas a ADR.
- [Plan de orquestación e interoperabilidad](plan-evolucion-orquestacion-interoperabilidad.md): aplica etapas futuras a providers e integración.
- [Plan de evolución arquitectónica](plan-migracion-arquitectura-react.md): gestiona separación técnica y posible migración de interfaz.
- [ADR 0005](decisiones/0005-experiencia-interfaz-y-accesibilidad.md): mantiene recuperación y prevención durante todas las etapas.
- [ADR 0006](decisiones/0006-versionado-y-ciclo-editorial-por-scope.md): demuestra que una capacidad local tiene ciclo propio.
