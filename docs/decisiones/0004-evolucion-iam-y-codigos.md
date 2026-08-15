# ADR 0004: Evolución de IAM y códigos

Fecha: 2026-08-14

Estado: aceptada como dirección de evolución

## Contexto

El PMV compara `codigo_staff`, `codigo_instructor` y el código global de
herramientas en el navegador. Las reglas permiten lectura pública del contenido.
Estos códigos habilitan una experiencia funcional, pero no protegen datos.

Además, la palabra `codigo` mezcla identificadores, entradas públicas, secretos
compartidos y candidatos todavía no activos.

## Decisión

La autenticación del importador será la primera entrega de una capa IAM común,
no un sistema aislado. La autorización efectiva se aplicará en reglas Firestore
y backend.

El catálogo y la lectura declarada pública pueden permanecer anónimos. Las
acciones y contenidos protegidos requieren identidad y permiso.

Se distinguen:

```text
Identificador
  -> estable y visible; se usa en relaciones.

Código público de entrada
  -> legible y revocable; no concede privilegios.

Invitación temporal
  -> expira y se canjea por una sesión o identidad.

Secreto de acceso
  -> se valida en backend y nunca es legible desde datos públicos.

Asignación IAM
  -> vincula una identidad con un recurso y un permiso.
```

Los roles globales y contextuales se modelan por separado. Claims pueden
representar privilegios globales estables como `admin` o `coordinador`. Las
asignaciones de autor, revisor, instructor, actor o SimTech viven en documentos
consultables y auditables.

## Consecuencias

- Ocultar un botón no constituye autorización.
- Los secretos salen de documentos con lectura pública.
- Los secretos activos usan hash, expiración, revocación, límite de intentos y
  auditoría.
- Las asignaciones variables no se concentran en custom claims.
- Los códigos de evento pueden conservarse como experiencia de entrada.
- El código público de evento puede desacoplarse gradualmente de `evento_id`.
- `codigo_staff` y `codigo_instructor` dejan de ser seguridad cuando existan
  asignaciones IAM equivalentes.

## Migración incremental

1. Autenticar y autorizar al coordinador del importador.
2. Auditar importación, custodia y publicación.
3. Proteger herramientas internas y operaciones administrativas.
4. Incorporar autores, borradores y revisores.
5. Persistir asignaciones de staff por evento y estación.
6. Cerrar la lectura pública del contenido operativo.
7. Retirar códigos compartidos como controles de seguridad.

Los nombres actuales del PMV no se cambian sin una migración planificada.
