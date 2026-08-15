# Visión de producto Praxis

Fecha: 2026-08-14

Estado: hipótesis estratégica para validación operativa

## Propósito

Este documento conserva la tesis de producto que orienta Praxis más allá de
sus módulos actuales. No es un ADR, un contrato técnico ni una afirmación de
que todas las capacidades descritas estén implementadas.

Las decisiones vinculantes continúan en `docs/decisiones/`; el estado real y el
siguiente alcance continúan en `docs/transferencia-praxis.md`.

## Tesis

Praxis es una plataforma operativa para diseñar, preparar y ejecutar
experiencias de simulación clínica y educativa. Conecta contenido, logística y
ejecución en un flujo reproducible para reducir fragmentación, incertidumbre y
dependencia del papel.

Su promesa no consiste en reunir muchas funcionalidades ni en sustituir todas
las herramientas especializadas. Consiste en conservar la continuidad del
contexto a lo largo de una experiencia:

```text
preparar
  -> validar
  -> publicar
  -> seleccionar y asignar
  -> ejecutar
  -> recuperar ante incidencias
  -> revisar resultados
  -> aprender
  -> preparar una nueva versión
```

La aplicación es el mecanismo. El producto es la experiencia de simulación
funcionando con la menor fricción operativa razonable.

## Problema

La preparación y ejecución suelen repartirse entre documentos, hojas de
cálculo, almacenamiento, mensajería, presentaciones, correo y copias impresas.
Cada herramienta puede resolver bien su tarea, pero el conjunto no conserva de
forma natural:

- cuál es la versión correcta de un caso;
- qué caso y material corresponden a cada estación;
- quién necesita cada sección y en qué momento;
- qué cambio fue comunicado y a quién;
- cuánto falta y qué estación sigue;
- cómo continuar después de una interrupción;
- con qué versión se ejecutó y qué se aprendió.

El costo principal es de coordinación: búsquedas, verificaciones, duplicación,
reimpresiones, mensajes paralelos y decisiones tomadas con contexto incompleto.

## Momento de valor

El momento de valor no es una pantalla atractiva. Es que una persona pueda
decir:

> Organicé y ejecuté una experiencia que normalmente habría requerido
> coordinar varias herramientas, sin perder la versión, el contexto ni la
> capacidad de continuar.

Praxis debe reducir preguntas operativas como:

- ¿Cuál es la versión vigente?
- ¿Qué caso corresponde a esta estación?
- ¿Dónde está el material correcto para este rol?
- ¿Qué cambió desde la preparación?
- ¿Cuánto falta y qué ocurre después?
- ¿Cómo recuperamos el flujo sin reiniciar la experiencia?

## Unidad de producto

La unidad de producto es una experiencia ejecutable de principio a fin, no una
funcionalidad aislada.

```text
Coordinación
  -> prepara evento, casos, estaciones, materiales y asignaciones

Participación
  -> entra, recibe contexto, ejecuta y cambia de estación

Facilitación
  -> consulta material, controla el flujo y resuelve incidencias

Sistema
  -> conserva contexto, identifica versiones y registra el resultado posible
```

La pregunta de alcance no es cuántas funciones tiene el PMV, sino si una
simulación real puede mantener su continuidad operativa de preparación a
ejecución y revisión.

## Frontera del producto

Praxis no necesita recrear Word, Drive, calendarios, mensajería o analítica para
cumplir su promesa. Puede integrarlos o mantenerlos como fuentes especializadas
si preserva:

- identidad estable del contenido;
- versión utilizada;
- relación entre evento, estación, caso y rol;
- estado operativo y siguiente acción;
- trazabilidad de cambios relevantes;
- retorno seguro desde herramientas externas.

El objetivo no es que una persona nunca salga técnicamente de Praxis. Es que al
hacerlo no se rompa el contexto ni reaparezca la incertidumbre que el producto
pretende reducir.

## Criterio de pertenencia

Una capacidad probablemente pertenece a Praxis cuando:

1. reduce una fricción relevante entre preparación, ejecución y aprendizaje;
2. preserva o mejora la continuidad del contexto;
3. reduce riesgo operativo durante una experiencia;
4. evita duplicar una herramienta especializada sin una ventaja clara.

Una capacidad probablemente no pertenece cuando añade administración sin
mejorar ese flujo, replica una herramienta madura o no puede vincularse con un
resultado observable de la experiencia.

## Versionado y continuidad

Una experiencia real no debe cambiar silenciosamente cuando se publica una
nueva versión de su contenido.

```text
Evento preparado  -> caso v3
Nueva revisión    -> caso v4 en desarrollo
Evento ejecutado  -> continúa con caso v3
```

El ADR 0006 prueba `current/working/archive` dentro del Centro de recursos. Para
casos y eventos aparece una hipótesis adicional: un evento debería poder fijar
la publicación o snapshot que utilizará, en lugar de resolver siempre la
versión vigente al abrirse.

Esa fijación no está implementada ni decidida transversalmente. Requiere
evaluar identidad de releases, migración, permisos, almacenamiento, caché,
auditoría y comportamiento ante correcciones urgentes.

## Recuperación

La recuperación es parte del producto porque el software no debe convertirse
en otra incidencia logística. La experiencia debe contemplar pérdida de
conexión, navegación accidental, códigos incorrectos, estación equivocada,
datos incompletos y retorno al flujo.

Esto conecta la tesis de producto con el ADR 0005: conservar contexto, explicar
qué ocurrió y ofrecer una continuación segura es más importante que limitarse
al recorrido exitoso.

## Reducción de papel

Praxis busca reducir la dependencia operativa del papel, no imponer papel cero.
La impresión puede seguir siendo necesaria por contingencia, accesibilidad,
conectividad o requisitos institucionales.

La oportunidad no es convertir cada hoja en un PDF. Es eliminar las razones por
las que el equipo imprime:

- asegurar que todos reciban la misma versión;
- conservar horarios y asignaciones fuera del sistema;
- llevar listas de cotejo sin estado compartido;
- disponer de materiales por rol y estación;
- preparar copias de respaldo ante una recuperación deficiente;
- reimprimir después de un cambio.

La promesa asociada es:

> Praxis reduce la dependencia de documentos impresos al mantener contenido,
> versiones y contexto operativo disponibles durante la experiencia.

## Experimento PMV

La validación más útil es una simulación pequeña pero real:

- una persona coordinadora;
- uno o dos casos;
- dos estaciones;
- participantes y facilitación;
- contenido distinto por rol;
- una versión publicada y una revisión paralela;
- una interrupción deliberada para probar recuperación;
- cierre y reconstrucción de lo ocurrido.

La evaluación debe observar dónde se pierde continuidad y qué herramientas
externas siguen siendo necesarias. Salir de Praxis no es por sí mismo un fallo;
perder versión, relación, responsabilidad o siguiente acción sí lo es.

## Hipótesis de métricas

Posible indicador principal:

> Porcentaje de simulaciones ejecutadas de principio a fin con contexto íntegro
> y sin incidencias críticas de coordinación.

`Contexto íntegro` debe definirse antes de medirlo. Como punto de partida puede
incluir versión identificable, estación correcta, responsabilidades visibles,
material disponible, recuperación y trazabilidad mínima.

Indicadores de apoyo:

- tiempo de preparación por evento y estación;
- intervenciones manuales de coordinación durante la ejecución;
- dudas o incidentes por versión incorrecta;
- tiempo perdido buscando documentos;
- cambios comunicados fuera del flujo principal;
- tiempo y tasa de recuperación de una estación;
- estaciones ejecutadas sin material impreso;
- páginas y reimpresiones por evento;
- posibilidad de reconstruir qué versión y material se utilizaron.

Estas métricas son hipótesis. Necesitan línea base y observación en eventos
reales antes de convertirse en objetivos.

## Riesgos de interpretación

- `Plataforma operativa` no significa reemplazar cada herramienta del equipo.
- `De principio a fin` no significa que toda interacción deba ocurrir dentro de
  una sola interfaz.
- `Reducir papel` no significa eliminar respaldos necesarios.
- `Continuidad` no sustituye seguridad, autorización ni validación clínica.
- `Versión fijada por evento` es una hipótesis pendiente, no comportamiento
  actual.
- El Centro de recursos es una pieza del flujo, no el producto completo.

## Preguntas abiertas

- ¿Cuál es la unidad mínima que un evento debe fijar: caso, release o snapshot?
- ¿Qué cambios urgentes pueden aplicarse a una experiencia ya preparada?
- ¿Qué parte del estado debe sobrevivir offline y durante cuánto tiempo?
- ¿Cuál es la mínima trazabilidad útil después de una simulación?
- ¿Qué tareas externas rompen hoy el contexto y cuáles pueden permanecer como
  integraciones?
- ¿Qué materiales deben seguir teniendo respaldo imprimible?
- ¿En qué tareas abrir documentos fuera de Praxis rompe el contexto y cuándo un
  visor integrado aporta más valor que una pestaña externa o descarga?
- ¿Qué reducción de coordinación y papel justifica el costo de cada módulo?

## Referencias relacionadas

- [Ciclo de vida del producto](ciclo-vida-producto-praxis.md)
- [Transferencia vigente](transferencia-praxis.md)
- [ADR 0002: eventos referencian casos](decisiones/0002-eventos-referencian-casos.md)
- [ADR 0005: experiencia, interfaz y accesibilidad](decisiones/0005-experiencia-interfaz-y-accesibilidad.md)
- [ADR 0006: versionado y ciclo editorial por scope](decisiones/0006-versionado-y-ciclo-editorial-por-scope.md)
- [Plan del importador editorial](importador-praxis.md)
- [Plan futuro de orquestación e interoperabilidad](plan-evolucion-orquestacion-interoperabilidad.md)
