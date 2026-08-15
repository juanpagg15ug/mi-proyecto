# Plan futuro de orquestación e interoperabilidad Praxis

Fecha: 2026-08-14

Estado: propuesta de evolución para validación; no iniciada

## 1. Propósito

Definir una evolución gradual para que Praxis opere como capa especializada de
experiencia y orquestación, con capacidad de funcionar de forma autónoma o de
integrarse con sistemas institucionales como Odoo, LMS, SIS e inventarios.

Este plan no sustituye el PMV, la siguiente entrega del importador editorial ni
las decisiones vigentes. Odoo es un candidato de integración para SIM-POCUS,
no una dependencia obligatoria ni una selección definitiva para toda
institución.

## 2. Tesis de arquitectura

Praxis debe poseer la lógica que hace ejecutable una experiencia de simulación.
Puede consumir o referenciar datos administrativos gestionados por otros
sistemas sin duplicar sus modelos maestros.

Frase rectora:

> Un sistema institucional puede saber quién viene, cuándo viene y qué recursos
> existen; Praxis debe saber qué experiencia debe ocurrir cuando esa persona
> llega.

La integración es una capacidad de Praxis, no una condición de existencia. El
core debe operar contra contratos propios y admitir implementaciones locales o
externas.

## 3. Resultado buscado

Praxis debe poder convertir información administrativa en una experiencia
operable y reproducible:

```text
Información institucional
  -> evento, participantes, recursos y formación previa

Praxis
  -> publicación fijada del caso
  -> estaciones y requerimientos
  -> grupos, rotaciones, tiempos y transiciones
  -> vistas e instrucciones por responsabilidad
  -> estado operacional y recuperación

Resultado
  -> experiencia ejecutada con contexto íntegro y trazabilidad suficiente
```

El éxito no consiste en copiar más datos dentro de Praxis. Consiste en reducir
coordinación fragmentada, incertidumbre de versiones, papel y trabajo manual
durante la preparación y la ejecución.

## 4. Frontera de capacidades

Cada capacidad se clasifica antes de diseñarse:

```text
Poseer
  -> Praxis define identidad, reglas, estados y persistencia canónica.

Integrar
  -> Praxis consume o solicita una capacidad mediante un contrato estable.

Referenciar
  -> Praxis conserva solo la identidad externa y el contexto operacional.
```

Matriz inicial para benchmarking:

| Capacidad | Dirección propuesta | Owner candidato | Responsabilidad de Praxis |
| --- | --- | --- | --- |
| Casos y releases | Poseer | Praxis | Contenido estructurado, roles, publicación y trazabilidad |
| Estaciones | Poseer | Praxis | Configuración operativa, caso fijado, tiempos y estado |
| Grupos y rotaciones | Poseer | Praxis | Secuencia, concurrencia, transiciones y recuperación |
| Requerimientos de estación | Poseer | Praxis | Declarar qué tipo y cantidad de recursos necesita la experiencia |
| Ejecución operacional | Poseer | Praxis | Contexto activo, vistas, tiempo, incidencias y continuidad |
| Persona o contacto maestro | Referenciar | Odoo, SIS o proveedor local | Identidad contextual y asignación a la experiencia |
| Evento administrativo | Integrar o referenciar | Odoo, agenda institucional o proveedor local | Extensión especializada y estado operacional |
| Inventario y activos | Integrar | Odoo u otro inventario | Consultar y asociar disponibilidad; no duplicar gestión patrimonial |
| Cursos y formación teórica | Integrar | LMS | Relacionar prerrequisitos y devolver resultados cuando se acuerde |
| Registro académico oficial | Referenciar o integrar | LMS o SIS | Emitir evidencia; no asumir custodia oficial sin contrato |
| Analítica institucional | Integrar | BI institucional | Proveer eventos o resultados autorizados y minimizados |

La matriz es una hipótesis. Cada integración requiere confirmar owner, base
legal, permisos, disponibilidad, semántica, latencia y operación sin conexión.

## 5. Límites de datos

Praxis conserva el contexto necesario para ejecutar, aunque el dato maestro
viva fuera:

```text
participantRef
  -> provider, externalId y snapshot operacional mínimo permitido

administrativeEventRef
  -> provider, externalId y datos necesarios para enlazar la experiencia

resourceRef
  -> provider, externalId, tipo requerido y asignación contextual
```

No deben copiarse por conveniencia datos patrimoniales, financieros, académicos
o personales que Praxis no necesite para operar. Una referencia externa no
garantiza disponibilidad ni autorización; esas condiciones deben comprobarse
en el momento definido por el caso de uso.

Praxis sí conserva como información propia:

- la experiencia y sus estaciones;
- el release o snapshot fijado para cada estación;
- grupos, secuencias, tiempos y reglas de transición;
- requerimientos declarados y asignaciones operacionales;
- estado de ejecución, incidencias y trazabilidad acordada.

## 6. Arquitectura objetivo preliminar

La dirección coincide con la separación por capas ya propuesta:

```text
Presentación
  -> preparación, operación y recuperación de la experiencia

Aplicación
  -> configurar experiencia, fijar release, generar rotación,
     comprobar recursos, iniciar estación y registrar transición

Dominio Praxis
  -> Experiencia, CasoRelease, Estación, Rotación,
     RequerimientoRecurso, Ejecución y referencias externas

Puertos
  -> ParticipantProvider, AdministrativeEventProvider,
     ResourceProvider, LearningProvider

Adaptadores
  -> Local, Odoo, LMS, SIS u otros sistemas institucionales
```

Los nombres son preliminares. No se crearán interfaces genéricas antes de tener
un caso de uso local probado y un segundo proveedor que permita comparar el
contrato.

Contratos candidatos:

```text
ParticipantProvider
  -> resolveParticipant, listEventParticipants

AdministrativeEventProvider
  -> getEvent, listEvents

ResourceProvider
  -> getResource, checkAvailability, getLocation

LearningProvider
  -> getPrerequisiteStatus, publishOutcome
```

`reserve`, `release` y cualquier escritura externa quedan fuera del primer
piloto. Primero debe validarse una integración de consulta sin efectos.

## 7. Modos de despliegue como hipótesis comercial

### Standalone

Praxis usa proveedores locales para los datos mínimos de evento,
participantes y recursos. No pretende convertirse en ERP; ofrece solo lo
necesario para operar la experiencia.

### Integrated

Praxis consume uno o más sistemas existentes mediante adaptadores. Odoo puede
proveer eventos, contactos e inventario; un LMS puede proveer formación previa.

### Ecosystem

Praxis coordina múltiples proveedores institucionales y aplica resolución de
identidades, políticas y auditoría entre sistemas.

Estos niveles deben validarse con instituciones reales. No constituyen todavía
paquetes comerciales ni compromisos de funcionalidad.

## 8. Principios de evolución

- Probar primero la experiencia completa, no la cantidad de conectores.
- Implementar proveedor local antes del adaptador externo equivalente.
- Mantener el dominio independiente de Odoo, Firebase y la interfaz.
- Fijar releases para evitar cambios silenciosos en eventos preparados.
- Empezar con lectura y vista previa antes de escribir en sistemas externos.
- Conservar operación degradada cuando una integración no esté disponible.
- Minimizar datos personales y patrimoniales replicados.
- Aplicar IAM, autorización y auditoría en backend; no confiar en controles de
  interfaz.
- Mantener recuperación, accesibilidad y respaldo operacional.
- No introducir abstracciones sin un caso de uso y una prueba que las exijan.

## 9. Guardrails de producto y arquitectura

### Orquestación con frontera explícita

`Orquestación` no autoriza a Praxis a convertirse en un motor empresarial
genérico. Praxis coordina únicamente las capacidades necesarias para preparar,
ejecutar, recuperar y reconstruir una experiencia clínica o educativa
compleja.

Quedan fuera de esta dirección, salvo una decisión posterior con evidencia:

- un motor universal de workflows;
- un diseñador genérico de procesos institucionales;
- sincronización bidireccional indiscriminada;
- administración financiera, comercial o patrimonial;
- gestión maestra de contactos;
- calendario institucional general;
- analítica empresarial de propósito general;
- conectores cuyo único objetivo sea ampliar el catálogo de integraciones.

Una capacidad no entra al roadmap por ser técnicamente integrable. Debe reducir
una fricción observable de la experiencia o preservar su continuidad.

### Experiencia antes que abstracción

Los puertos no se diseñan a partir de las tablas o APIs de un proveedor. Se
derivan de casos de uso de Praxis ya observados con datos locales.

Antes de crear o ampliar un `Provider` se debe responder:

1. qué decisión o acción de la experiencia necesita esos datos;
2. cuál es el mínimo dato requerido;
3. cuándo debe estar disponible;
4. qué ocurre si falta o está desactualizado;
5. cómo se prueba el mismo caso de uso con un proveedor local;
6. qué segundo proveedor o evidencia demuestra que el contrato no refleja solo
   a Odoo.

Si estas respuestas no existen, se mantiene una implementación local concreta
y se pospone la abstracción.

### Odoo como candidato, no como premisa

Para SIM-POCUS, Odoo es el candidato principal del primer piloto institucional
porque puede concentrar eventos, contactos, inventario y LMS. Esa conveniencia
no lo convierte automáticamente en sistema de registro definitivo.

La adopción requiere comprobar módulos, versión, custodia, identificadores,
API, permisos, calidad de datos, operación y soporte institucional. Si otro
sistema posee una entidad o capacidad, el plan debe respetar ese owner aunque
Odoo disponga de una función semejante.

### Standalone como invariante

El modo standalone no es únicamente una oferta comercial. Protege propiedades
arquitectónicas y operativas:

- el dominio de Praxis conserva semántica propia;
- el desarrollo y las pruebas no requieren infraestructura institucional;
- una institución pequeña puede operar con datos mínimos locales;
- una caída externa no impide necesariamente ejecutar una experiencia ya
  preparada;
- los adaptadores pueden compararse contra un comportamiento de referencia.

Una integración no se aprueba si elimina el modo autónomo sin una decisión
arquitectónica posterior que justifique explícitamente el costo y el riesgo.

### Criterios de detención

Una línea de evolución debe detenerse o volver a diseño cuando:

- no mejora una métrica de preparación, ejecución o recuperación;
- exige duplicar datos maestros sin una finalidad operacional clara;
- introduce dependencia del proveedor dentro del dominio;
- requiere disponibilidad permanente de un sistema externo durante la
  ejecución sin contingencia aceptable;
- amplía administración institucional pero no la experiencia;
- aumenta exposición de datos o complejidad operativa más de lo que reduce
  coordinación;
- no puede explicar quién es owner del dato y quién responde por su calidad.

## 10. Roadmap por fases

### Fase 0: validar la línea base operacional

**Objetivo:** comprobar una simulación pequeña de principio a fin con el PMV.

Trabajo:

- ejecutar uno o dos casos en dos estaciones;
- registrar herramientas externas, papel, dudas de versión e intervenciones;
- introducir una interrupción de conexión o navegación;
- medir preparación, recuperación y continuidad;
- documentar qué información administrativa fue realmente necesaria.

**Puerta de salida:** existe una línea base y una lista priorizada de fricciones
observadas, no solo supuestas.

### Fase 1: estabilizar y separar el core

**Objetivo:** preparar límites internos sin cambiar todavía el sistema de
registro.

Trabajo:

- completar los bloqueantes del PMV y pruebas de recorridos críticos;
- ejecutar el importador editorial según su plan vigente;
- extraer casos de uso y repositorios conforme al plan arquitectónico;
- definir modelos de `Experiencia`, `CasoRelease`, `Estación` y `Ejecución`;
- mantener adaptadores Firebase detrás de contratos internos.

**Puerta de salida:** las reglas principales se prueban sin DOM ni Firebase, y
el PMV conserva equivalencia funcional.

### Fase 2: releases fijados por experiencia

**Objetivo:** impedir que una publicación cambie silenciosamente un evento ya
preparado.

Trabajo:

- decidir release frente a snapshot como unidad fijada;
- extender el ADR 0002 sin duplicar contenido clínico por evento;
- definir identidad, inmutabilidad, retiro y correcciones urgentes;
- migrar estaciones existentes con una estrategia explícita;
- alinear caché, importador y auditoría con la release fijada.

**Puerta de salida:** una experiencia preparada conserva la misma versión aunque
se publique una nueva, y puede reconstruirse qué release utilizó.

### Fase 3: modelo operacional de experiencia

**Objetivo:** demostrar el diferenciador de Praxis antes de integrar un ERP.

Trabajo:

- requerimientos tipados de recursos por estación;
- grupos, secuencia y matriz de rotación;
- tiempos y reglas de transición;
- estado de preparación y ejecución;
- manejo de incidencias y recuperación;
- vistas operacionales para coordinación y facilitación.

**Puerta de salida:** una simulación pequeña puede prepararse y ejecutarse con
menos coordinación externa que la línea base.

### Fase 4: contratos y proveedores locales

**Objetivo:** comprobar la abstracción sin depender de un proveedor externo.

Trabajo:

- definir únicamente los puertos requeridos por casos de uso existentes;
- implementar proveedores locales para participantes, evento administrativo y
  recursos;
- usar referencias estables y snapshots mínimos;
- simular indisponibilidad y recuperación del proveedor;
- probar sustitución de adaptadores sin cambiar reglas del dominio.

**Puerta de salida:** la experiencia funciona en modo autónomo y el dominio no
conoce estructuras específicas de Firebase u Odoo.

### Fase 5: piloto Odoo de solo lectura para SIM-POCUS

**Objetivo:** validar Odoo como sistema de información institucional sin
convertirlo en dependencia.

Alcance inicial:

- seleccionar un evento administrativo de Odoo;
- resolver participantes inscritos mediante referencias;
- consultar recursos y disponibilidad para los requerimientos de estaciones;
- mostrar procedencia, momento de consulta y estado de sincronización;
- conservar una alternativa local o una degradación explícita.

Fuera de alcance:

- reservas o movimientos de inventario;
- creación o edición de contactos maestros;
- facturación y administración comercial;
- sincronización bidireccional general;
- dependencia directa de modelos internos como `stock.quant` desde el dominio.

**Puerta de salida:** el mismo caso de uso opera con proveedores local y Odoo,
las diferencias del contrato están documentadas y se demuestra reducción de
trabajo duplicado.

### Fase 6: acciones externas controladas

**Objetivo:** evaluar escrituras solo donde aporten valor probado.

Candidatos:

- reservar y liberar recursos;
- devolver asistencia o resultados a LMS/SIS;
- recibir cambios de disponibilidad;
- sincronizar cambios administrativos relevantes.

Requisitos previos:

- IAM y autorización de servicio;
- idempotencia, reintentos y conciliación;
- vista previa y confirmación;
- auditoría y correlación entre sistemas;
- compensación ante operaciones parciales;
- límites de datos y retención aprobados.

**Puerta de salida:** cada escritura es trazable, repetible de forma segura y
recuperable ante fallos parciales.

### Fase 7: interoperabilidad mult proveedor

**Objetivo:** validar Praxis en ecosistemas institucionales heterogéneos.

Trabajo posible:

- segundo adaptador real para probar que los puertos no reflejan solo Odoo;
- resolución de referencias entre proveedores;
- políticas por institución y selección de adaptador;
- observabilidad de sincronización y salud de conectores;
- contratos versionados y compatibilidad de capacidades.

**Puerta de salida:** añadir un proveedor no exige modificar reglas centrales de
la experiencia ni degradar el modo standalone.

## 11. Líneas transversales

### Identidad y autorización

El ADR 0004 sigue siendo la dirección. Una identidad externa no concede por sí
misma acceso a Praxis. Las asignaciones de experiencia y los permisos deben
resolverse y auditarse en el alcance correspondiente.

### Custodia y publicación

Los ADR 0001 y 0003 continúan vigentes para contenido editorial. Integrar Odoo
no cambia la necesidad de publicación explícita, snapshot predecible y custodia
canónica de los casos.

### Versionado

El ADR 0006 es evidencia del Centro de recursos, no un esquema para copiar. El
modelo de releases de casos requiere una decisión específica y debe preservar
la referencia estable definida por el ADR 0002.

### Offline y degradación

La ejecución no puede depender de una consulta externa en cada transición. Se
debe definir qué snapshot operacional puede conservarse, por cuánto tiempo y
qué acciones quedan bloqueadas cuando el proveedor no está disponible.

### Privacidad y minimización

Las referencias de participantes deben evitar replicar perfiles completos. El
piloto necesita una evaluación de datos, finalidad, retención, acceso y
eliminación antes de usar información real.

### Observabilidad

Cada llamada de integración debe registrar proveedor, operación, correlación,
latencia y resultado sin exponer tokens ni datos personales innecesarios.

## 12. Decisiones necesarias antes del piloto Odoo

No se inicia el adaptador hasta resolver:

1. qué módulos y versión de Odoo usa la institución;
2. quién es owner de personas, eventos, recursos e inscripciones;
3. qué API y mecanismo de autenticación están permitidos;
4. qué identificadores son estables y exportables;
5. qué datos puede almacenar Praxis y durante cuánto tiempo;
6. qué ocurre durante indisponibilidad o datos desactualizados;
7. qué volumen, latencia y límites de API se esperan;
8. qué instancia de prueba y datos anonimizados estarán disponibles;
9. quién opera, monitorea y revoca la integración;
10. qué métrica justificaría pasar de consulta a escritura.

Estas respuestas deben producir un ADR de integración específico. Este plan no
selecciona todavía endpoints, SDK, middleware ni topología de despliegue.

## 13. Métricas y benchmarking

Comparar modo actual, standalone evolucionado e integrado:

| Dimensión | Indicador candidato |
| --- | --- |
| Preparación | Tiempo para configurar evento, estaciones y rotaciones |
| Duplicación | Datos introducidos en más de un sistema |
| Versiones | Incidentes o dudas sobre el release usado |
| Recursos | Requerimientos sin asignación o disponibilidad confirmada |
| Ejecución | Intervenciones manuales y tiempo perdido por estación |
| Recuperación | Tiempo para continuar después de una incidencia |
| Papel | Páginas, paquetes y reimpresiones por evento |
| Integración | Latencia, errores, reintentos y antigüedad de datos |
| Trazabilidad | Experiencias cuyo contexto puede reconstruirse |
| Adopción | Tareas realizadas en el flujo previsto frente a canales paralelos |

Una integración no se considera exitosa solo porque intercambia datos. Debe
reducir duplicación o fricción sin empeorar continuidad, seguridad y operación
autónoma.

## 14. Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| Convertir Praxis en mini-ERP | Aplicar la matriz poseer/integrar/referenciar antes de cada épica |
| Convertir Odoo en dependencia | Proveedor local primero y pruebas de modo degradado |
| Diseñar puertos según tablas de Odoo | Contratos derivados de casos de uso de Praxis |
| Duplicar personas o activos | Referencias externas y snapshots mínimos con retención |
| Integrar antes de probar el core | Completar fases de releases y operación primero |
| Eventos inconsistentes entre sistemas | Definir owner y distinguir evento administrativo de experiencia |
| Exponer borradores o contenido sensible | IAM, reglas, publicación explícita y releases inmutables |
| Fallos parciales en escrituras | Lectura primero; luego idempotencia, auditoría y compensación |
| Scope comercial prematuro | Validar Standalone/Integrated/Ecosystem con evidencia |
| Reducir papel sin contingencia | Mantener respaldo proporcional y medir dependencia real |

## 15. Relación con planes vigentes

Orden recomendado de precedencia operativa:

```text
Estabilización del PMV
  -> importador editorial
  -> separación de dominio e infraestructura
  -> releases fijados por experiencia
  -> modelo operacional y rotaciones
  -> proveedores locales
  -> piloto Odoo de solo lectura
  -> escrituras y ecosistema, si la evidencia las justifica
```

Este orden no obliga a esperar a terminar toda la migración de interfaz. La
separación del dominio y los pilotos pueden convivir con la aplicación actual,
siempre que no dupliquen reglas ni interrumpan el PMV.

## 16. Entregables de decisión

Cada fase debe cerrar con evidencia y una decisión explícita:

- informe de línea base operacional;
- modelo y ADR de release fijado por experiencia;
- contrato probado del modelo operacional;
- puertos y proveedor local con pruebas;
- informe del piloto Odoo y comparación con standalone;
- ADR por cada escritura externa aprobada;
- decisión de continuar, ajustar o detener la expansión de integraciones.

## 17. Referencias

- [Visión de producto](vision-producto-praxis.md)
- [Transferencia vigente](transferencia-praxis.md)
- [Plan del importador editorial](importador-praxis.md)
- [Plan de evolución arquitectónica](plan-migracion-arquitectura-react.md)
- [Contrato Firestore del PMV](firestore-pmv.md)
- [ADR 0001: Drive y snapshot publicado](decisiones/0001-drive-fuente-firestore-snapshot.md)
- [ADR 0002: eventos referencian casos](decisiones/0002-eventos-referencian-casos.md)
- [ADR 0003: identidades y custodia](decisiones/0003-identidades-y-custodia.md)
- [ADR 0004: evolución de IAM y códigos](decisiones/0004-evolucion-iam-y-codigos.md)
- [ADR 0005: experiencia, interfaz y accesibilidad](decisiones/0005-experiencia-interfaz-y-accesibilidad.md)
- [ADR 0006: versionado por scope](decisiones/0006-versionado-y-ciclo-editorial-por-scope.md)
