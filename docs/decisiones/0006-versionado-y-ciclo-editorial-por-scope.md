# ADR 0006: Versionado y ciclo editorial por scope

Fecha: 2026-08-14

Estado: aceptada para el Centro de recursos; candidata para evaluación
transversal

## Contexto

Un recurso puede tener una versión publicada y, al mismo tiempo, otra versión
en desarrollo. Tratar el estado como una propiedad única del recurso impide
representar ambos ciclos y puede provocar que un borrador reemplace o se
confunda con la publicación vigente.

Praxis también contiene scopes con contratos diferentes: recursos descargables,
casos clínicos, eventos, estaciones e importación editorial. Compartir nombres
sin revisar esas diferencias produciría acoplamiento y migraciones implícitas.

El Centro de recursos necesita una convención operativa simple que permita
identificar la publicación vigente por ubicación, mover una versión completa al
histórico y preparar la siguiente sin modificar la publicada.

## Decisión aplicada

El Centro de recursos usa tres ubicaciones por recurso:

```text
current/            versión publicada vigente
working/            versión en desarrollo o revisión
archive/<version>/  versiones publicadas reemplazadas
```

`current/` y `working/` pueden existir simultáneamente. La interfaz pública
prioriza `current/`. Solo muestra `working/` cuando el recurso todavía no tiene
una publicación vigente y debe presentarlo explícitamente como borrador o
material en revisión.

La metadata del scope vive en:

```text
public/docs/centro-recursos/metadata.json
```

Cada recurso registra canales independientes:

```json
{
  "channels": {
    "current": {
      "version": "v1",
      "editorialStatus": "aprobada",
      "publicationStatus": "publicada"
    },
    "working": {
      "version": "v2",
      "editorialStatus": "en_revision",
      "publicationStatus": "no_publicada"
    }
  },
  "archive": []
}
```

Los archivos, validaciones y estados pertenecen a una versión concreta. No son
propiedades globales del recurso.

## Invariantes

- `current/` contiene como máximo una versión y siempre está publicada.
- `working/` contiene como máximo una versión activa y nunca está publicada.
- Una versión publicada no se sobrescribe para iniciar una revisión.
- Una ruta declarada en metadata debe existir físicamente.
- La interfaz pública elige `current` antes que `working`.
- Un recurso sin `current` puede mostrar `working` solo con estado no oficial
  visible.
- `archive/<version>/` es inmutable salvo correcciones administrativas
  documentadas.
- La promoción actualiza archivos y metadata como una sola operación editorial
  controlada.

## Transición de publicación

Para publicar una versión de `working/`:

1. comprobar validaciones y aprobación;
2. mover la carpeta `current/` completa a `archive/<version-anterior>/`, si
   existe;
3. mover el contenido aprobado de `working/` a `current/`;
4. registrar la versión anterior en `archive`;
5. actualizar `channels.current` y limpiar `channels.working`;
6. desplegar y comprobar archivos, metadata y redirecciones históricas;
7. registrar la operación cuando exista auditoría editorial.

Una implementación automatizada debe evitar estados parciales. Si el medio de
almacenamiento no permite una operación atómica, debe preparar una nueva
versión, validar sus rutas y cambiar el puntero público al final.

## Separación de estados

El modelo distingue dos dimensiones:

```text
editorialStatus
  -> borrador | en_revision | aprobada | rechazada

publicationStatus
  -> no_publicada | publicada | reemplazada | retirada | archivada
```

Esta separación evita inferir publicación a partir de una aprobación. Los
vocabularios son locales al Centro de recursos mientras no exista una decisión
de dominio transversal.

## Límites del scope

Esta decisión no modifica:

- `casos/{casoId}` ni sus estados Firestore;
- `00_Metadata/metadata.json` de paquetes de casos;
- eventos, estaciones, roles o códigos;
- estados y transiciones del importador;
- reglas de seguridad o autorización.

Otros scopes no deben copiar el esquema literalmente. Pueden usar esta decisión
como referencia y conservar las invariantes que resulten compatibles con su
propio contrato.

## Benchmarking para otros scopes

Antes de adoptar el patrón se debe comparar:

| Criterio | Pregunta de evaluación | Evidencia esperada |
| --- | --- | --- |
| Versiones paralelas | ¿Debe coexistir una publicación con una revisión? | Casos de uso y frecuencia |
| Unidad de promoción | ¿Qué archivos o documentos forman una versión indivisible? | Contrato del paquete |
| Lectura pública | ¿Quién puede consultar `current` y `working`? | Reglas y matriz de permisos |
| Atomicidad | ¿Cómo se evita una publicación parcial? | Transacción, puntero o estrategia de despliegue |
| Trazabilidad | ¿Debe conservarse quién aprobó y publicó? | Campos y registro de auditoría |
| Retiro | ¿Una versión puede retirarse sin publicar otra? | Política operativa |
| Compatibilidad | ¿Qué enlaces o IDs deben permanecer estables? | Inventario de consumidores |
| Retención | ¿Cuánto tiempo se conserva el histórico? | Política legal y editorial |
| Offline | ¿Qué versión puede permanecer en caché? | Caducidad y recuperación |
| Migración | ¿Los estados actuales se mapean sin ambigüedad? | Tabla de equivalencias |

Una evaluación favorable debe producir una decisión específica para el scope o
una ADR transversal posterior. La coincidencia de nombres no cuenta como
evidencia de compatibilidad.

## Indicadores comparables

Para evaluar el patrón en una prueba futura pueden medirse:

- publicaciones parciales o inconsistentes por ciclo;
- tiempo necesario para promover y revertir una versión;
- enlaces rotos después de una promoción;
- diferencias entre metadata y archivos físicos;
- cantidad de intervenciones manuales por publicación;
- tiempo para identificar la versión pública vigente;
- recuperaciones exitosas desde una versión archivada;
- incidentes por exposición accidental de borradores.

## Consecuencias

- La versión publicada se identifica tanto por metadata como por `current/`.
- Preparar una versión no altera la publicación vigente.
- Archivar puede realizarse moviendo la carpeta publicada completa.
- La metadata aumenta de complejidad porque registra canales independientes.
- Las promociones manuales requieren una lista de comprobación hasta que exista
  automatización.
- La interfaz pública no funciona como panel de revisión cuando existen ambos
  canales; los revisores necesitarán un recorrido autorizado separado.
- Extender el modelo exige revisar autorización, atomicidad y auditoría del
  scope objetivo.

## Decisiones futuras

Quedan fuera de esta ADR:

- una máquina de estados común para toda Praxis;
- el esquema de versionado de casos en Firestore;
- permisos para consultar `working` cuando también existe `current`;
- automatización de promoción, reversión y retención;
- versionado semántico obligatorio;
- firma, hash o integridad criptográfica de documentos.

Esas decisiones deben basarse en el benchmarking anterior y en los contratos de
cada scope.
