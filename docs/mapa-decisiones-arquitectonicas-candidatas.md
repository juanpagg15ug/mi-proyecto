# Mapa de decisiones arquitectónicas candidatas

Fecha: 2026-08-14

Estado: registro de temas para evaluación; no constituye una ADR

## 1. Propósito

Identificar decisiones surgidas durante la planificación de orquestación e
interoperabilidad que podrían aplicarse a otros scopes de Praxis.

Este documento evita dos errores:

- convertir un plan futuro en fuente global de decisiones vinculantes;
- copiar patrones entre recursos, casos, eventos, IAM e integraciones sin
  comprobar que comparten restricciones y semántica.

Una decisión incluida aquí es una candidata. Solo se considera aceptada cuando
un ADR declara alcance, alternativas, consecuencias y evidencia suficiente.

## 2. Ciclo de una decisión

```text
Observación
  -> aparece una tensión o patrón en un scope

Candidata
  -> se formula una decisión posible y sus límites

Experimento
  -> se prueba en un caso real o implementación acotada

Evaluación
  -> se comparan resultados, riesgos y alternativas

ADR
  -> se acepta, rechaza o limita explícitamente

Implementación y revisión
  -> se aplica por scope y se comprueba si sigue siendo válida
```

La coincidencia de nombres o tecnologías no sustituye este ciclo.

## 3. Decisiones ya aceptadas relacionadas

| Tema | Decisión vigente | Alcance actual |
| --- | --- | --- |
| Fuente editorial y snapshot | ADR 0001 | PMV de casos y contenido publicado |
| Referencias entre eventos y casos | ADR 0002 | Modelo Firestore del PMV |
| Identidades y custodia | ADR 0003 | Diseño del importador |
| Identidad, roles globales y contextuales | ADR 0004 | Dirección de evolución IAM |
| Recuperación y prevención de errores | ADR 0005 | Dirección de UX/UI |
| Versiones paralelas y canales | ADR 0006 | Centro de recursos; benchmarking transversal |

Estas decisiones aportan precedentes, pero no resuelven automáticamente los
temas candidatos de este mapa.

## 4. Inventario de candidatas transversales

| Candidata | Estado | Scopes potenciales | Evidencia antes de ADR |
| --- | --- | --- | --- |
| Separar reglas institucionales y operacionales | Formulada en el plan de orquestación | IAM, eventos, integraciones, importador | Casos reales de conflicto, owner y precedencia comprobable |
| Separar identidad, afiliación, privilegio y asignación | Parcialmente respaldada por ADR 0004 | IAM, eventos, autores, organizaciones | Modelo con participantes internos y externos; políticas de acceso |
| Resolver ownership con poseer/integrar/referenciar | Hipótesis estratégica | Todos los bounded contexts | Matriz por entidad, consumidores y costo de duplicación |
| Mantener Standalone como invariante | Hipótesis arquitectónica | Despliegue, proveedores, offline | Piloto local y externo con equivalencia de casos de uso |
| Modos Standalone, Integrated y Ecosystem | Hipótesis de despliegue y producto | Instalación y operación institucional | Instituciones reales, topologías, soporte y costos |
| Usar puertos y capa anticorrupción | Dirección compatible con plan de capas | Odoo, LMS, SIS, inventarios | Caso de uso local y al menos un adaptador externo comparables |
| Gobernar restricciones sin entregar el core al ERP | Guardrail propuesto | Recursos, agenda, personal, rotaciones | Pilotos con restricciones duras, blandas, inciertas y de capacidad |
| Fijar release o snapshot por experiencia | Hipótesis de producto | Casos, estaciones, eventos, caché | Modelo de identidad, migración y corrección urgente |
| Estrategia por capacidad para migración y legacy | Guardrail propuesto | Datos, frontend, proveedores e infraestructura | Inventario de consumidores, rollback, retención y condición de salida |
| Separar estado editorial y de publicación | Aplicado localmente por ADR 0006 | Casos, importador, recursos | Benchmark por scope y compatibilidad de estados actuales |
| Experiencia documental integrada o externa | Capacidad candidata en descubrimiento | Centro de recursos, eventos, autoría y revisión | Prueba por formato, rol y dispositivo; continuidad, permisos, accesibilidad y offline |

## 5. Familias de decisión

### Semántica y bounded contexts

Incluye ownership, reglas institucionales frente a operacionales y separación
de identidad, afiliación, privilegio y asignación.

Pregunta rectora:

> ¿Qué significado posee cada scope y qué traducción explícita permite cruzar
> su frontera sin importar reglas ajenas?

Posible resultado futuro: una ADR de fronteras de dominio y políticas
contextuales. No debe aprobarse hasta observar conflictos reales en eventos e
integraciones.

### Despliegue y dependencia

Incluye modos Standalone, Integrated y Ecosystem, proveedores locales,
degradación y operación sin sistemas externos.

Pregunta rectora:

> ¿Qué propiedades del core deben conservarse independientemente de la
> topología institucional?

Posible resultado futuro: una ADR de modos soportados y requisitos mínimos de
operación. La propuesta comercial no basta como evidencia técnica.

### Integración y capa anticorrupción

Incluye providers, adaptadores, contratos canónicos, referencias externas y
traducción de estados.

Pregunta rectora:

> ¿Cómo consume Praxis una capacidad externa sin convertir su dominio en una
> representación de Odoo, LMS, SIS o Firebase?

Posible resultado futuro: una ADR después de comparar proveedor local y primer
adaptador real. No se generaliza a partir de interfaces hipotéticas.

### Restricciones y decisiones

Incluye disponibilidad administrativa, Teoría de Restricciones, cuellos de
botella, alternativas aprobadas y precedencia entre seguridad, experiencia y
eficiencia.

Pregunta rectora:

> ¿Cómo informa una restricción externa la factibilidad sin modificar
> silenciosamente la experiencia?

Posible resultado futuro: una ADR de gobernanza de restricciones si los pilotos
demuestran patrones repetibles entre recursos, personal, espacios y tiempo.

### Evolución, migración y legado

Incluye convivencia federada, migración, consolidación, sustitución progresiva,
archivo y retiro.

Pregunta rectora:

> ¿Cómo cambia el owner de una capacidad sin duplicar indefinidamente datos,
> reglas o sistemas de registro?

Posible resultado futuro: una política transversal de transición, acompañada
por decisiones específicas para cada migración. Una política común no sustituye
el plan de corte de cada scope.

### Versionado y continuidad

Incluye releases fijados por experiencia, snapshots, estados editoriales,
publicación, caché y reconstrucción posterior.

Pregunta rectora:

> ¿Qué unidad inmutable necesita cada consumidor para evitar cambios
> silenciosos y conservar trazabilidad?

Posible resultado futuro: ADR específica para releases de casos y referencias
desde estaciones. El modelo de carpetas del Centro de recursos no se copia a
Firestore.

### Experiencia documental

Actualmente los PDF se abren en una pestaña nueva y los Word se descargan. Esa
línea base es simple y conserva fidelidad, pero puede romper el contexto de
Praxis, aumentar cambios de ventana y dificultar el retorno durante una
experiencia.

La candidata no consiste únicamente en incrustar archivos. Debe decidir qué
experiencia corresponde a cada propósito:

```text
Consulta publicada
  -> lectura rápida y estable de una versión concreta

Consulta operacional
  -> material correcto para rol, estación y release, con retorno seguro

Revisión editorial
  -> comentarios, comparación y aprobación con identidad y trazabilidad

Autoría colaborativa
  -> edición en la fuente maestra, posiblemente Google Docs
```

Opciones que deben compararse:

| Opción | Ventaja posible | Riesgo o límite |
| --- | --- | --- |
| Pestaña externa o descarga | Bajo acoplamiento y fidelidad del formato | Pérdida de contexto y más navegación |
| Vista previa embebida del proveedor | Implementación rápida para documentos autorizados | Cookies, permisos, bloqueo de iframe, dependencia y accesibilidad |
| Visor PDF dentro de Praxis | Navegación, búsqueda y retorno integrados | Peso, móvil, impresión, accesibilidad y mantenimiento |
| Contenido estructurado nativo | Mejor adaptación por rol, responsive y offline | Transformación, pérdida de fidelidad y duplicación |
| Enlace de edición a Google Docs | Colaboración y fuente maestra existentes | Cambio de contexto y permisos externos |
| Autoría nativa en Praxis | Flujo unificado y reglas propias | Scope de editor completo, conflictos y alto costo |

Google Drive y Docs API permiten seleccionar, leer, exportar, custodiar y
transformar documentos; no proporcionan por sí solas un editor colaborativo
embebido equivalente a Google Docs. Un enlace o preview tampoco sustituye
autorización de Praxis ni garantiza acceso offline.

La decisión puede ser híbrida por formato y tarea. Por ejemplo, contenido
operacional estructurado dentro de Praxis, PDF con visor integrado, Word como
descarga y autoría mediante enlace controlado a Google Docs.

Preguntas de evaluación:

1. ¿Qué tarea se interrumpe hoy por abrir otra pestaña?
2. ¿Qué formatos y tamaños aparecen realmente?
3. ¿Debe consultarse, anotarse, revisarse o editarse?
4. ¿Qué release debe quedar fijado y cómo se evita mostrar una revisión nueva?
5. ¿Qué roles pueden ver el documento completo o solo contenido derivado?
6. ¿Qué ocurre sin conexión o si Google no está disponible?
7. ¿El visor conserva teclado, lector de pantalla, zoom, búsqueda e impresión?
8. ¿Funciona en dispositivos móviles usados durante una estación?
9. ¿Cómo vuelve la persona al contexto exacto de Praxis?
10. ¿El beneficio compensa dependencia, carga y mantenimiento?

Métricas candidatas:

- tiempo para localizar y abrir el material correcto;
- cambios de pestaña, pérdidas de contexto y retornos fallidos;
- documentos abiertos con versión o rol incorrectos;
- finalización de tareas por móvil, teclado y lector de pantalla;
- tiempo de carga, errores de permisos y disponibilidad offline;
- papel o descargas evitadas sin perder contingencia;
- preferencia y errores comparados con la línea base externa.

Puerta para experimentar:

> Un piloto identifica una tarea frecuente donde la pestaña externa produce
> fricción medible y dispone de un documento no sensible o correctamente
> protegido para comparar ambas experiencias.

Puerta para soportar:

> La opción integrada mejora continuidad y finalización sin degradar permisos,
> accesibilidad, fidelidad, rendimiento, recuperación ni modo standalone.

Posible resultado futuro: una decisión de experiencia documental por scope y
tipo de contenido. No se debe adoptar un único visor o editor para toda Praxis
solo por disponer de APIs.

## 6. Criterios para promover a ADR

Antes de promover una candidata se aplica el
[procedimiento de evaluación de capacidades](procedimiento-evaluacion-capacidades.md).

Una candidata puede promoverse cuando:

1. existe una decisión concreta que debe orientar más de una implementación;
2. se conocen al menos dos alternativas reales;
3. el alcance y los scopes afectados están identificados;
4. existe evidencia de un piloto, incidente, benchmark o restricción externa;
5. pueden describirse consecuencias y estrategia de migración;
6. se conoce qué decisión vigente complementa, extiende o reemplaza;
7. se identifica cómo validar y revisar la decisión después de adoptarla.

No se crea una ADR únicamente para documentar vocabulario, una preferencia o
una posibilidad futura sin decisión inmediata.

## 7. Orden sugerido de evaluación

```text
Eventos pequeños reales
  -> releases fijados y modelo operacional
  -> prueba acotada de consulta documental en una tarea observada
  -> identidad, afiliación y asignaciones contextuales
  -> restricciones de recursos y rotaciones
  -> proveedor local y modo Standalone
  -> primer adaptador institucional
  -> estrategia de transición por capacidad
  -> evaluación de modos Integrated y Ecosystem
```

Este orden puede cambiar por oportunidades institucionales, pero una integración
no debe convertir hipótesis transversales en contratos globales sin evaluación.

## 8. Relación con documentos

- [Ciclo de vida del producto](ciclo-vida-producto-praxis.md): separa etapas del producto, capacidades e integraciones.
- [Plan futuro de orquestación e interoperabilidad](plan-evolucion-orquestacion-interoperabilidad.md): aplica las candidatas a una evolución concreta.
- [Plan futuro de evolución arquitectónica](plan-migracion-arquitectura-react.md): separa capas y evalúa migración de presentación.
- [Visión de producto](vision-producto-praxis.md): define continuidad y frontera del producto.
- [Decisiones arquitectónicas](decisiones/): contiene únicamente decisiones aceptadas con su alcance.
