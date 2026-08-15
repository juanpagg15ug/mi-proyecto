# Procedimiento para evaluar capacidades de Praxis

Fecha: 2026-08-15

Estado: procedimiento de trabajo para pilotos y decisiones; no sustituye ADR,
revisión clínica, seguridad ni validación operacional

## 1. Propósito

Aplicar una evaluación repetible antes de diseñar, implementar o promover una
capacidad de Praxis. El procedimiento separa filtros que suelen confundirse:

```text
Valor de producto
  -> ¿debe existir en Praxis?

Arquitectura e implementación
  -> ¿Praxis debe poseer, integrar o referenciar y cómo puede construirse?

Seguridad, privacidad y cumplimiento
  -> ¿puede operar sin exponer personas, contenido o sistemas?

UX y accesibilidad
  -> ¿la tarea puede completarse, corregirse y recuperarse?

Operación y soporte
  -> ¿puede sostenerse en un evento real y retirarse de forma segura?
```

Una respuesta favorable en un filtro no compensa el incumplimiento de otro.

## 2. Cuándo se activa

Se usa cuando:

- aparece una feature o capacidad nueva;
- un piloto revela una fricción repetida;
- se propone integrar un proveedor o API;
- una capacidad experimental quiere declararse soportada;
- un cambio modifica roles, permisos, datos o reglas operacionales;
- se evalúa migrar, sustituir o retirar una solución existente.

Una corrección pequeña puede usar una versión abreviada si no cambia
comportamiento, datos, permisos, contratos ni operación.

## 3. Entrada mínima

La propuesta debe declarar:

```text
nombre
problema observado
personas y scopes afectados
evidencia disponible
resultado esperado
alternativas conocidas
riesgos iniciales
owner de evaluación
```

Sin problema observado o hipótesis comprobable, la capacidad permanece como
candidata y no entra a implementación.

## 4. Filtro 1: valor de producto

Preguntas:

1. ¿Qué fricción entre preparación, ejecución, recuperación o aprendizaje
   reduce?
2. ¿Quién recibe valor y quién podría quedar perjudicado?
3. ¿Preserva la continuidad del contexto?
4. ¿Reduce coordinación, incertidumbre, riesgo o dependencia del papel?
5. ¿Existe una herramienta externa que resuelva suficientemente la tarea?
6. ¿Qué métrica cambiaría si funciona?
7. ¿Qué ocurre si no se construye?

Decisión:

```text
no pertenece
observar más
candidata para experimento
```

Si no existe beneficio observable, se detiene.

## 5. Filtro 2: frontera y arquitectura

Clasificar:

```text
Poseer
  -> lógica específica y canónica de Praxis

Integrar
  -> capacidad externa consumida mediante contrato

Referenciar
  -> identidad externa y contexto mínimo
```

Preguntas:

- ¿Quién es owner del dato y de la regla?
- ¿Es regla institucional, clínica, pedagógica u operacional?
- ¿Qué modo de despliegue debe soportarla?
- ¿Cómo funciona en Standalone y en degradación?
- ¿Requiere migración, convivencia, consolidación o retiro?
- ¿Activa una candidata del mapa o contradice un ADR?
- ¿Puede revertirse sin romper una experiencia preparada?

Salida: alternativa recomendada, límites del scope y decisión de crear ADR
antes o después del experimento.

## 6. Filtro 3: seguridad, privacidad y cumplimiento

Comprobar:

- identidad y autorización efectiva;
- mínimo privilegio y separación de roles;
- clasificación y minimización de datos;
- contenido público, reservado o sensible;
- retención, auditoría y eliminación;
- secretos, tokens y credenciales;
- validaciones repetidas en backend cuando corresponda;
- obligaciones clínicas, legales e institucionales;
- contingencia ante proveedor o conexión indisponible.

Un bloqueante impide piloto con datos reales. Puede autorizarse un prototipo
aislado con datos sintéticos si el objetivo y los límites están documentados.

## 7. Filtro 4: UX y accesibilidad

Aplicar UX inversa y poka-yoke:

- tarea principal y contexto visibles;
- retorno predecible;
- prevención y corrección de errores;
- recuperación ante interrupción;
- estados de carga, vacío, advertencia, error y offline;
- teclado, foco, semántica y lector de pantalla;
- móvil, conectividad y condiciones reales de uso;
- lenguaje según rol, sin exponer detalles internos innecesarios;
- no depender solo de color, iconos o posición;
- alternativa cuando una integración o formato no funciona.

Comparar la propuesta con la línea base actual. Una experiencia más integrada
no se considera mejor si degrada finalización, permisos, accesibilidad,
fidelidad o recuperación.

## 8. Filtro 5: viabilidad y operación

Evaluar:

- complejidad y costo de implementación;
- dependencias y soporte;
- rendimiento y observabilidad;
- pruebas necesarias;
- fallback, rollback e idempotencia;
- capacitación y operación cotidiana;
- costos recurrentes y límites de API;
- owner técnico y operativo;
- criterio de deprecación y retiro.

Una capacidad sin owner, métrica o condición de salida no se declara soportada.

## 9. Decisión de experimento

Una capacidad está lista para experimento cuando:

$$
valor \land viabilidad \land seguridad \land UX \land operabilidad
$$

El experimento debe especificar:

- hipótesis falsable;
- línea base;
- alcance y población;
- datos permitidos;
- duración;
- métrica primaria y guardrails;
- contingencia;
- criterio de éxito, ajuste y detención.

La solución mínima debe permitir que el resultado discrimine entre
alternativas. No necesita anticipar toda la arquitectura futura.

## 10. Resultado del piloto

Después del piloto se registra:

```text
continuar
ajustar y repetir
pausar
resolver localmente
promover a ADR
deprecar
retirar
```

Una capacidad pasa a soportada únicamente cuando dispone de:

- beneficio repetido;
- contrato y alcance estables;
- seguridad y accesibilidad verificadas;
- contingencia y recuperación;
- soporte y observabilidad;
- documentación operativa;
- owner y costo aceptados.

## 11. Plantilla de registro

```markdown
# Evaluación: <capacidad>

Estado: candidata | descubrimiento | experimento | piloto | soportada | en revisión
Owner:
Fecha:

## Problema y evidencia

## Actores y scopes

## Valor esperado y métrica

## Poseer, integrar o referenciar

## Alternativas comparadas

## Seguridad y privacidad

## UX, accesibilidad y recuperación

## Viabilidad y operación

## Hipótesis y diseño del experimento

## Resultado

## Decisión y siguiente revisión
```

El registro puede vivir en una issue, documento de experimento o artefacto de
producto. Una decisión duradera con consecuencias arquitectónicas debe
promoverse a ADR.

## 12. Versión abreviada para planificación

Antes de iniciar una feature, responder:

```text
1. ¿Qué problema observado resuelve?
2. ¿Para quién crea valor y qué métrica cambia?
3. ¿Praxis la posee, integra o referencia?
4. ¿Qué datos, permisos y reglas afecta?
5. ¿Cómo se usa, corrige, recupera y abandona?
6. ¿Cómo funciona en móvil, offline y con accesibilidad?
7. ¿Qué alternativa más simple existe?
8. ¿Cómo se prueba y qué resultado la detendría?
9. ¿Quién la opera, soporta y retira?
```

Si una respuesta crítica falta, la tarea vuelve a descubrimiento.

## 13. Referencias

- [Visión de producto](vision-producto-praxis.md)
- [Ciclo de vida del producto](ciclo-vida-producto-praxis.md)
- [Mapa de decisiones arquitectónicas candidatas](mapa-decisiones-arquitectonicas-candidatas.md)
- [ADR 0005: experiencia, interfaz y accesibilidad](decisiones/0005-experiencia-interfaz-y-accesibilidad.md)
- [Plan futuro de orquestación e interoperabilidad](plan-evolucion-orquestacion-interoperabilidad.md)
