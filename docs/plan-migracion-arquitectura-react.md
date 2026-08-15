# Plan futuro de evolución arquitectónica y adopción de React

Fecha: 2026-08-14

Estado: planificado para evaluación futura; no iniciado

## 1. Propósito

Definir una ruta gradual para separar responsabilidades, introducir un modelo
de dominio ligero y evaluar React sin detener la evolución del PMV ni ejecutar
una reescritura completa.

Este plan no establece que Praxis deba migrar obligatoriamente a React ni que
todo el código deba convertirse en clases. La decisión final dependerá de
evidencia obtenida después de estabilizar la aplicación actual.

## 2. Motivación

Las vistas actuales combinan varias responsabilidades:

- generación de HTML;
- acceso a Firestore;
- lectura y escritura de respaldo local;
- validación de formularios y códigos;
- estado de navegación y sesión;
- reglas de acceso y contenido visible;
- interacción, foco y anuncios accesibles.

La cantidad de funciones no es por sí misma un defecto. El riesgo aparece
cuando una misma función conoce infraestructura, reglas del negocio, estado y
presentación. Esa mezcla dificulta probar los recorridos, reutilizar patrones de
accesibilidad y cambiar de tecnología de interfaz.

## 3. Principios de la evolución

- Estabilizar antes de migrar.
- Separar responsabilidades antes de introducir un framework.
- Migrar recorridos completos, no archivos aislados.
- Mantener funciones puras cuando expresen mejor una transformación.
- Usar clases solo para objetos con identidad, estado o ciclo de vida real.
- Adoptar conceptos de DDD de forma proporcional; no implementar ceremonias o
  abstracciones que el tamaño del producto todavía no necesita.
- Conservar contratos de accesibilidad, seguridad y UX inversa durante toda la
  transición.
- Permitir convivencia temporal entre la aplicación actual y módulos nuevos.
- Evitar una reescritura general sin equivalencia funcional y pruebas.

## 4. Arquitectura objetivo preliminar

```text
Presentación
  -> vistas, componentes y navegación
  -> foco, anuncios, estados y adaptación responsive

Aplicación
  -> casos de uso que coordinan el recorrido
  -> entrar a evento, abrir estación, consultar caso, publicar paquete

Dominio
  -> entidades, valores y reglas puras
  -> Evento, Estación, Caso, SesiónEvento, ModoAcceso, VistaSimulada

Infraestructura
  -> Firestore, localStorage, Google APIs, impresión y descargas
```

Las capas representan responsabilidades y dependencias, no necesariamente
carpetas, paquetes o clases individuales. Presentación puede depender de
aplicación; aplicación puede usar dominio y puertos; infraestructura implementa
los puertos requeridos. Dominio no debe depender del navegador, Firebase o
React.

## 5. Uso de funciones, objetos y clases

### Mantener como funciones puras

- Normalización de códigos e identificadores.
- Validación de formatos y relaciones.
- Selección de secciones visibles según contexto.
- Transformación de documentos de Firestore a modelos internos.
- Formateo de tiempos y valores.
- Construcción de propuestas no persistidas.

### Candidatos a objetos con estado

| Concepto | Responsabilidad posible |
| --- | --- |
| `EventSession` | Mantener evento, modo de acceso, vista activa, estación y contexto temporal. |
| `NavigationState` | Conservar origen, filtros, posición, foco y transición pendiente. |
| `DialogController` | Administrar foco inicial, captura, cierre y restauración. |
| `EventRepository` | Exponer lectura de eventos y estaciones sin filtrar detalles de Firebase a las vistas. |
| `CaseRepository` | Obtener metadata y secciones mediante un contrato estable. |
| `OfflineRepository` | Guardar únicamente respaldos permitidos, caducarlos y eliminar secretos. |

Repositorios y controladores pueden implementarse con funciones, objetos
literales o clases. La elección debe basarse en claridad, pruebas y ciclo de
vida, no en uniformidad artificial.

## 6. React como decisión independiente

React puede aportar valor cuando aumenten:

- el estado compartido entre vistas;
- los formularios de varios pasos;
- las vistas previas y validaciones interdependientes;
- los componentes interactivos reutilizables;
- el enrutamiento y la recuperación del estado;
- la necesidad de pruebas de componentes.

React no resuelve automáticamente accesibilidad, autorización, seguridad del
respaldo ni separación de responsabilidades. Migrar directamente el código
actual a JSX trasladaría los mismos acoplamientos a componentes nuevos.

La adopción solo debe aprobarse después de un piloto medible. No se presupone
el uso de una biblioteca global de estado; primero se evaluarán estado local,
contexto acotado y casos de uso independientes del framework.

## 7. Fases de migración

### Fase 0: estabilizar el PMV

**Objetivo:** cerrar los defectos que afectan privacidad, contenido esencial,
recuperación y operación por teclado.

Trabajo mínimo:

- Completar las fases bloqueante y alta de
  [Hallazgos y plan de acción de UX/UI y accesibilidad](hallazgos-plan-ux-ui-accesibilidad.md).
- Eliminar secretos del respaldo local.
- Corregir el renderizado de contenido estructurado.
- Completar navegación móvil, recuperación, pestañas y diálogos.
- Añadir pruebas de los recorridos críticos.

**Puerta de salida:** no existen hallazgos bloqueantes abiertos y los recorridos
de catálogo y evento disponen de pruebas de comportamiento.

### Fase 1: separar dominio e infraestructura

**Objetivo:** reducir el conocimiento de Firebase y `localStorage` dentro de las
vistas sin cambiar la experiencia visible.

Trabajo propuesto:

1. Definir modelos internos para caso, evento, estación y sesión.
2. Crear contratos para `CaseRepository`, `EventRepository` y
   `OfflineRepository`.
3. Mover normalización, validación y decisiones de contenido a funciones puras.
4. Introducir casos de uso como `enterEvent`, `loadCatalog`, `openStation` y
   `restoreEventSession`.
5. Mantener adaptadores Firebase detrás de esos contratos.

**Puerta de salida:** las reglas principales se prueban sin DOM, red ni
Firebase, y las vistas no leen directamente la estructura de documentos
remotos salvo mediante adaptadores delimitados.

### Fase 2: consolidar componentes accesibles

**Objetivo:** establecer contratos de interfaz independientes de una pantalla
concreta.

Componentes prioritarios:

- encabezado y navegación principal;
- barra de contexto del evento;
- aviso de estado;
- control Volver;
- pestañas;
- selector segmentado;
- diálogo;
- formulario con error asociado;
- lista de estaciones.

Cada componente debe documentar estructura, estados, eventos, foco, teclado y
atributos ARIA. Puede implementarse inicialmente en JavaScript actual. No es
necesario esperar a React para corregir o reutilizar estos patrones.

**Puerta de salida:** los componentes críticos tienen pruebas de teclado y un
contrato que pueda reproducirse en otra tecnología de presentación.

### Fase 3: piloto de React

**Objetivo:** comprobar con evidencia si React reduce complejidad y mejora la
capacidad de prueba del equipo.

El candidato preferido es el importador editorial porque:

- todavía no existe una implementación que haya que reemplazar;
- requiere formularios de varios pasos;
- necesita validaciones, vista previa y estados remotos complejos;
- tiene límites funcionales y criterios de publicación documentados;
- puede consumir los casos de uso y repositorios creados previamente.

El piloto debe incluir:

- configuración de compilación reproducible;
- montaje aislado dentro de la aplicación existente;
- enrutamiento o punto de entrada definido;
- componentes accesibles equivalentes a los contratos comunes;
- pruebas unitarias, de componentes y de recorrido;
- medición de tamaño, complejidad, tiempo de desarrollo y defectos.

**Puerta de decisión:** comparar el piloto con la implementación actual según la
matriz de evaluación de este documento. React se adopta para nuevos recorridos
solo si aporta una mejora demostrable.

### Fase 4: migración progresiva por recorridos

**Objetivo:** migrar únicamente cuando el piloto haya sido aprobado.

Orden sugerido:

1. Centro de recursos e importador editorial.
2. Catálogo y detalle público.
3. Evento, estaciones y detalle contextual.
4. Herramientas internas y calculadora.

Cada recorrido nuevo puede convivir temporalmente con vistas JavaScript
existentes. La migración no debe duplicar reglas de dominio; ambas
implementaciones deben consumir los mismos casos de uso y contratos.

**Puerta de salida por recorrido:** equivalencia funcional, accesibilidad,
seguridad, rendimiento y pruebas aprobadas antes de retirar la vista anterior.

### Fase 5: retirar infraestructura heredada

**Objetivo:** eliminar únicamente el código sustituido y consolidar el sistema
de construcción y despliegue.

Trabajo propuesto:

- Retirar vistas y manejadores globales sin consumidores.
- Eliminar dependencias CDN sustituidas por el proceso de construcción.
- Consolidar rutas, estilos, pruebas y telemetría.
- Actualizar documentación operativa y de despliegue.
- Verificar que no queden dos implementaciones activas de una misma regla.

## 8. Matriz para decidir la adopción de React

| Criterio | Pregunta de evaluación | Evidencia esperada |
| --- | --- | --- |
| Complejidad | ¿Disminuye la coordinación manual de estado y DOM? | Comparación de código y defectos del piloto. |
| Pruebas | ¿Los componentes y recorridos se prueban con menor acoplamiento? | Cobertura útil y tiempos de ejecución. |
| Accesibilidad | ¿Se mantienen o mejoran teclado, foco y semántica? | Pruebas automáticas y revisión manual. |
| Rendimiento | ¿Carga e interacción siguen dentro del presupuesto acordado? | Métricas de compilación y navegador. |
| Operación | ¿Build, emuladores y despliegue siguen siendo reproducibles? | Ejecución documentada en entorno limpio. |
| Equipo | ¿El mantenimiento resulta comprensible para quienes desarrollan Praxis? | Revisión técnica y tiempo de incorporación. |
| Interoperabilidad | ¿Puede convivir sin duplicar dominio ni interrumpir el PMV? | Integración del piloto y rutas compartidas. |

No se continuará con una migración general si el piloto mejora la apariencia
del código pero empeora accesibilidad, rendimiento, despliegue o capacidad de
mantenimiento.

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
| --- | --- |
| Reescritura prolongada sin valor visible | Migrar por recorridos y entregar mejoras en cada fase. |
| Duplicación de reglas entre JavaScript y React | Extraer dominio y casos de uso antes del piloto. |
| Exceso de clases y abstracciones | Exigir una responsabilidad y una prueba concreta para cada abstracción. |
| Regresiones de accesibilidad | Usar contratos compartidos y pruebas de teclado desde la Fase 0. |
| Dos sistemas visuales divergentes | Compartir variables, estados y criterios visuales durante la convivencia. |
| Aumento innecesario del paquete | Medir el piloto y establecer un presupuesto de carga. |
| Dependencia excesiva del framework | Mantener dominio y aplicación sin imports de React. |
| Migrar defectos existentes | Cerrar hallazgos críticos antes de trasladar un recorrido. |

## 10. Criterios de terminado

La evolución arquitectónica se considera completada cuando:

1. las reglas del dominio no dependen de Firebase, DOM o React;
2. la infraestructura se consume mediante contratos verificables;
3. cada recorrido tiene un propietario claro de estado y navegación;
4. los componentes interactivos cumplen sus contratos de teclado y foco;
5. no existen implementaciones duplicadas de reglas críticas;
6. el proceso de desarrollo, pruebas y despliegue está documentado;
7. cualquier vista heredada retirada tiene reemplazo con equivalencia funcional;
8. la decisión final sobre React queda registrada en un ADR específico.

## 11. Decisiones pendientes

Antes del piloto se deberán resolver mediante ADR o prueba técnica:

- herramienta de construcción y estrategia de despliegue en Firebase Hosting;
- enrutador y convivencia con rutas actuales;
- estrategia de estilos y eliminación progresiva de Tailwind por CDN;
- biblioteca de pruebas de componentes y accesibilidad;
- presupuesto de JavaScript y rendimiento;
- límites entre módulos de dominio y recorridos de presentación;
- política de compatibilidad de navegadores.

La elección concreta de React, enrutador o bibliotecas no debe incorporarse a
la arquitectura permanente hasta completar el piloto y registrar la decisión.
