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

Algunos guardrails de este plan pueden extrapolarse a otros scopes. Se registran
como candidatas en el
[mapa de decisiones arquitectónicas](mapa-decisiones-arquitectonicas-candidatas.md),
pero no son política global hasta que una ADR defina y acepte su alcance.

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

institutionalAffiliation
  -> relación institucional contextual solo cuando una política la requiera

administrativeEventRef
  -> provider, externalId y datos necesarios para enlazar la experiencia

resourceRef
  -> provider, externalId, tipo requerido y asignación contextual
```

No deben copiarse por conveniencia datos patrimoniales, financieros, académicos
o personales que Praxis no necesite para operar. Una referencia externa no
garantiza disponibilidad ni autorización; esas condiciones deben comprobarse
en el momento definido por el caso de uso.

La afiliación institucional no equivale a una asignación operacional. Una
persona puede ser asociada activa, numeraria, aspirante, empleada, invitada o no
tener vínculo directo y, dentro de una experiencia, actuar como participante,
facilitadora, instructora, actriz, SimTech u observadora. Praxis conserva solo
la dimensión necesaria para aplicar una política explícita.

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
  -> resolvePerson, getInstitutionalAffiliations, listEventEnrollments

ExperienceAssignmentService (dominio Praxis)
  -> assignEventRole, assignStationRole, authorizeExperienceAccess

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

El modo de despliegue modifica la resolución de ownership y las políticas, pero
no el significado del core:

| Decisión | Standalone | Integrated | Ecosystem |
| --- | --- | --- | --- |
| Dato maestro administrativo | Proveedor local mínimo | Sistema institucional acordado | Owner explícito por entidad y organización |
| Asignación operacional | Praxis | Praxis | Praxis, con referencias de uno o más proveedores |
| Autorización | Política local de Praxis | Identidad federada más política Praxis | Federación y política contextual por institución |
| Disponibilidad de recursos | Registro local simplificado | Consulta al inventario owner | Resolución entre inventarios y políticas de precedencia |
| Operación degradada | Datos locales | Snapshot permitido y contingencia | Degradación por proveedor sin perder el core |

Una misma institución puede utilizar modos distintos por capacidad. Por
ejemplo, participantes integrados con Odoo y recursos gestionados localmente.
El modo no debe inferirse globalmente ni obligar a migrar todas las entidades al
mismo tiempo.

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

Un proveedor de identidad o participantes no concede roles operacionales. La
traducción entre un dato institucional y una asignación en Praxis pertenece a
una política explícita del dominio, no al adaptador.

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

### Reglas de gestión frente a reglas de operación

Praxis no debe mezclar reglas administrativas de una organización con reglas
que controlan la ejecución de una simulación. Ambas pueden afectar una misma
experiencia, pero tienen owner, finalidad, vigencia y consecuencias distintas.

```text
Reglas de gestión institucional
  -> afiliación, elegibilidad, inscripción, pago, agenda, jornada,
     autorización administrativa, inventario y políticas organizacionales

Reglas de operación de la simulación
  -> release del caso, grupos, estación asignada, responsabilidad operacional,
     tiempo, rotación, transición, criterios de inicio o parada,
     contingencia y recuperación
```

El sistema institucional decide, por ejemplo, si una persona está inscrita o
si un activo puede asignarse administrativamente. Praxis decide cómo participa
esa persona en la experiencia, qué estación ejecuta, qué material recibe y qué
debe ocurrir en cada transición.

La integración no importa reglas de gestión como si fueran reglas de
simulación. Traduce resultados explícitos entre contextos:

```text
inscripción válida en sistema institucional
  -> candidato elegible para una asignación en Praxis

recurso disponible en inventario
  -> candidato para cubrir un requerimiento de estación

asignación operacional aprobada en Praxis
  -> acceso temporal al contexto de evento o estación
```

Ninguna traducción es automática por coincidencia de nombres, jerarquía o
estado. Debe existir una política identificable, comprobable y auditable.

Cuando las reglas entren en tensión se aplica esta precedencia:

1. seguridad de las personas, parada del escenario y contingencia operacional;
2. autorización efectiva y protección de información;
3. integridad de la experiencia fijada y sus asignaciones activas;
4. restricciones administrativas comunicadas antes de la ejecución;
5. preferencias logísticas que puedan reprogramarse.

Esta precedencia no permite que Praxis ignore una prohibición institucional ni
que un ERP cambie silenciosamente una simulación en curso. Los conflictos deben
producir un estado visible, una decisión humana cuando corresponda y un registro
de qué regla prevaleció y por qué.

Las reglas clínicas y pedagógicas del contenido tampoco deben confundirse con
reglas administrativas u operacionales. Definen validez del caso, objetivos y
criterios de desempeño; su modificación sigue el ciclo editorial y no ocurre
como efecto lateral de una integración.

### Restricciones y disponibilidad de recursos

La Teoría de Restricciones puede orientar la preparación y ejecución: Praxis
debe identificar qué limitación determina la capacidad real de la experiencia,
proteger ese recurso crítico y evitar optimizar componentes que no aumentan el
flujo global.

La información administrativa de inventario, agenda o personal es una entrada
de factibilidad, no la autoridad sobre el diseño pedagógico ni sobre el core de
Praxis. Un proveedor puede informar que un recurso está disponible, reservado,
fuera de servicio o en ubicación distinta. Praxis decide qué impacto tiene ese
estado sobre una estación y qué alternativas son válidas para la experiencia.

Las restricciones se clasifican antes de aplicar una decisión:

```text
Restricción dura
  -> seguridad, autorización, requisito clínico o recurso sin sustituto;
     bloquea iniciar o continuar en la configuración afectada

Restricción de capacidad
  -> cantidad de equipos, espacios, facilitadores o tiempo;
     limita concurrencia, grupos o ritmo de rotación

Restricción blanda
  -> preferencia logística o recurso sustituible;
     permite alternativa aprobada sin cambiar el objetivo

Restricción incierta
  -> dato ausente, desactualizado o proveedor no disponible;
     exige verificación, contingencia o decisión humana
```

Praxis no debe declarar disponible un recurso que el sistema responsable marca
como no utilizable. Tampoco debe cancelar, degradar o rediseñar silenciosamente
una experiencia por un cambio administrativo. Debe mostrar la restricción, el
cuello de botella y su alcance, y ofrecer únicamente respuestas previamente
permitidas:

```text
mantener configuración y resolver el recurso
reducir concurrencia o ajustar la rotación
usar sustituto pedagógica y técnicamente aprobado
reprogramar la estación
bloquear y escalar para decisión humana
```

El ciclo operacional inspirado en Teoría de Restricciones es:

1. identificar la restricción que limita la experiencia;
2. decidir cómo aprovecharla sin comprometer seguridad ni objetivos;
3. subordinar grupos, secuencia y recursos no críticos a esa decisión;
4. ampliar capacidad o sustituir el recurso cuando esté aprobado;
5. volver a evaluar, porque el cuello de botella puede trasladarse.

La optimización administrativa busca utilización de activos, costos o agenda.
La optimización de Praxis busca continuidad, seguridad y logro de la
experiencia. Ninguna métrica administrativa debe prevalecer automáticamente
sobre esas prioridades.

### Estrategia de transición y sistemas legacy

Adoptar interoperabilidad exige decidir qué ocurre con cada sistema y conjunto
de datos existente. `Integrar` no significa mantener dos sistemas activos para
siempre ni copiar todos los registros a Praxis.

Cada capacidad debe elegir explícitamente una estrategia:

```text
Convivencia federada
  -> cada sistema conserva su responsabilidad y se intercambian referencias

Migración
  -> datos y responsabilidad pasan a un nuevo owner con corte y validación

Fusión o consolidación
  -> varios modelos se unifican bajo un contrato canónico y se eliminan
     duplicados con reglas de resolución

Sustitución progresiva
  -> el sistema nuevo asume casos de uso por etapas mientras el anterior reduce
     su alcance

Archivo o legacy de consulta
  -> el sistema anterior deja de operar y permanece accesible solo por
     trazabilidad, retención o requisitos legales

Retiro
  -> datos permitidos se eliminan y se apagan integraciones e infraestructura
```

La estrategia se decide por capacidad, no para toda la plataforma de una sola
vez. Personas pueden permanecer federadas, mientras una planificación local de
eventos se migra y un inventario histórico queda como legacy de consulta.

No se recomienda fusionar bases de datos completas. La consolidación debe
partir de ownership, identidad canónica, semántica de campos, calidad, retención
y consumidores. Un identificador coincidente no demuestra que dos registros
representen la misma entidad.

Durante una convivencia temporal deben definirse:

- sistema de registro y sistema consumidor por entidad;
- dirección de sincronización y campos autorizados;
- reglas de resolución de conflictos;
- identificadores y tabla de correspondencias;
- momento de corte y criterio para dejar de escribir en el sistema anterior;
- reconciliación, auditoría, rollback y contingencia;
- retención, acceso y fecha de retiro del legacy;
- responsable operativo y costo de mantener cada sistema.

Una integración temporal sin fecha, owner o condición de salida se considera
deuda arquitectónica. El plan debe evitar que Praxis se convierta en un segundo
sistema de registro accidental y que una sincronización transitoria se vuelva
permanente por omisión.

Antes de migrar o consolidar se requiere inventario de consumidores y una
prueba de reversión. Ningún corte debe realizarse durante una simulación activa
ni cambiar referencias fijadas por una experiencia preparada.

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
- clasificación de restricciones duras, de capacidad, blandas e inciertas;
- detección del cuello de botella de la experiencia y alternativas aprobadas;
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
- representar afiliación institucional y asignación operacional como
  dimensiones independientes;
- probar participantes internos, invitados externos y personas sin afiliación
  institucional directa;
- simular indisponibilidad y recuperación del proveedor;
- probar sustitución de adaptadores sin cambiar reglas del dominio.
- documentar qué datos locales son permanentes en Standalone y cuáles son
  candidatos a federación, migración o retiro al activar una integración.

**Puerta de salida:** la experiencia funciona en modo autónomo y el dominio no
conoce estructuras específicas de Firebase u Odoo.

### Fase 5: piloto Odoo de solo lectura para SIM-POCUS

**Objetivo:** validar Odoo como sistema de información institucional sin
convertirlo en dependencia.

Alcance inicial:

- seleccionar un evento administrativo de Odoo;
- resolver participantes inscritos mediante referencias;
- conservar las categorías institucionales como contexto, sin convertirlas
  automáticamente en roles o privilegios de Praxis;
- crear las asignaciones de evento y estación mediante reglas operacionales de
  Praxis;
- consultar recursos y disponibilidad para los requerimientos de estaciones;
- transformar disponibilidad administrativa en restricciones visibles, sin
  alterar automáticamente la configuración operacional;
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
- estrategia de convivencia, migración o retiro por capacidad y proveedor;
- observabilidad de sincronización y salud de conectores;
- contratos versionados y compatibilidad de capacidades.

**Puerta de salida:** añadir un proveedor no exige modificar reglas centrales de
la experiencia ni degradar el modo standalone.

## 11. Líneas transversales

### Identidad y autorización

El ADR 0004 sigue siendo la dirección. Una identidad externa no concede por sí
misma acceso a Praxis. Las asignaciones de experiencia y los permisos deben
resolverse y auditarse en el alcance correspondiente.

La interoperabilidad separa cuatro dimensiones:

```text
Identidad
  -> quién es la persona y qué sistema la referencia

Afiliación institucional
  -> relación con una asociación u organización

Privilegios administrativos
  -> acciones permitidas en el sistema institucional

Asignación operacional
  -> responsabilidad temporal dentro de una experiencia o estación
```

No se usa un campo universal `role` para mezclar estas dimensiones. Una
jerarquía institucional no concede automáticamente acceso a coordinación,
instrucción, debriefing o administración en Praxis. Del mismo modo, una persona
externa puede recibir una asignación operacional válida cuando la política de
la experiencia lo permita.

La autorización efectiva combina identidad válida, asignación contextual y
política del recurso. Una afiliación puede intervenir en elegibilidad,
inscripción o condiciones administrativas solo cuando exista una regla
documentada; no se hereda como privilegio operacional implícito.

Las asignaciones deben indicar alcance y vigencia, por ejemplo evento,
estación, responsabilidad, inicio y expiración. Cuando Praxis conserve una
afiliación externa como snapshot, debe registrar procedencia y momento de
consulta para no presentarla como dato institucional actualizado.

La autorización responde a políticas; la ejecución responde además a reglas
operacionales. Una persona puede estar autorizada para participar y todavía no
tener grupo o estación asignados. Del mismo modo, una asignación operacional no
subsana una inscripción inválida cuando la institución exige esa condición.

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
11. qué categorías de afiliación existen y para qué políticas son relevantes;
12. qué reglas convierten una inscripción en asignación operacional, sin
  heredar jerarquías o privilegios institucionales;
13. qué sistema decide elegibilidad, asignación, autorización y revocación en
  cada etapa.
14. qué reglas son de gestión institucional y cuáles pertenecen a la operación
  de la simulación;
15. cómo se traducen sus resultados y qué precedencia se aplica ante un
  conflicto durante preparación o ejecución.
16. qué recursos constituyen restricciones duras, cuáles admiten sustitución y
  quién aprueba las alternativas;
17. qué antigüedad del dato de disponibilidad es aceptable y cuándo debe
  verificarse nuevamente antes de ejecutar.
18. si cada capacidad convivirá, migrará, se consolidará, se sustituirá o se
  retirará;
19. cuál es el sistema de registro durante la transición y qué condición cierra
  la sincronización temporal;
20. qué datos legacy deben conservarse, por cuánto tiempo y con qué acceso;
21. cómo se revierte el corte sin afectar una experiencia preparada o activa.

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
| Restricciones | Cuellos de botella detectados antes del evento y tiempo de resolución |
| Ejecución | Intervenciones manuales y tiempo perdido por estación |
| Recuperación | Tiempo para continuar después de una incidencia |
| Papel | Páginas, paquetes y reimpresiones por evento |
| Integración | Latencia, errores, reintentos y antigüedad de datos |
| Transición | Registros conciliados, conflictos, duplicados y tiempo hasta retirar el legacy |
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
| Convertir jerarquía institucional en permisos operacionales | Separar afiliación, privilegios administrativos y asignaciones contextuales |
| Excluir participantes externos por falta de afiliación | Autorizar mediante asignación de experiencia y política explícita |
| Usar `role` con significados incompatibles | Nombres y contratos delimitados por contexto, alcance y vigencia |
| Mezclar reglas administrativas y operacionales | Owners separados, traducciones explícitas y precedencia documentada |
| Cambiar una simulación activa por una actualización institucional | Fijar contexto operacional y exigir conciliación visible |
| Optimizar utilización administrativa a costa de la experiencia | Priorizar seguridad, continuidad y objetivos; registrar la restricción |
| Tratar disponibilidad como decisión pedagógica | Clasificar impacto y usar solo alternativas aprobadas por Praxis |
| Mantener dos sistemas de registro indefinidamente | Owner temporal, fecha o condición de salida y plan de corte |
| Crear un legacy nuevo durante la integración | Estrategia por capacidad, presupuesto de retiro y observabilidad de consumidores |
| Fusionar registros con semántica distinta | Identidad canónica, reglas de correspondencia y conciliación previa |
| Romper experiencias durante una migración | Releases y referencias fijadas, ventana de corte y rollback probado |
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

- [Mapa de decisiones arquitectónicas candidatas](mapa-decisiones-arquitectonicas-candidatas.md)
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
