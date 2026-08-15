# Praxis

Praxis es una aplicación web para consultar un banco de casos y ejecutar
experiencias de simulación mediante eventos, estaciones y vistas adaptadas al
rol. El proyecto Firebase activo es `praxis-prio` y el sitio publicado es
<https://praxis-prio.web.app/>.

## Estado actual

El PMV incluye:

- catálogo de casos publicados con filtros locales;
- detalle público de casos y acceso instructor temporal;
- entrada a eventos mediante código público y código adicional de staff;
- estaciones vinculadas a casos mediante `caso_id`;
- vistas de estudiante, instructor, actor y SimTech;
- temporizador, impresión o respaldo PDF y caché local de 24 horas;
- Centro de recursos con plantillas oficiales y herramientas internas;
- calculadora de priorización y propuestas no persistidas de IDs, eventos y
  claves de acceso.

El pipeline editorial automatizado todavía no está implementado. La preparación
de contenido ocurre en Google Docs y el snapshot de Firestore se carga
manualmente. El siguiente módulo planificado es el importador editorial descrito
en [docs/importador-praxis.md](docs/importador-praxis.md).

## Límite de seguridad del PMV

Los códigos actuales controlan la experiencia de la interfaz, pero no
constituyen autenticación o autorización real. Las reglas permiten lectura
pública de `casos`, `casos_contenido` y `eventos`, y bloquean toda escritura
desde el cliente.

No se debe tratar `codigo_instructor` o `codigo_staff` como protección de
contenido sensible. La evolución de identidad y códigos está documentada en:

- [ADR 0004: evolución de IAM y códigos](docs/decisiones/0004-evolucion-iam-y-codigos.md)
- [firestore.rules](firestore.rules)

## Arquitectura resumida

```text
Google Docs  -> fuente editorial maestra
Firestore    -> metadata y snapshot que consume la aplicación
Navegador    -> caché temporal para continuidad offline
PDF local    -> respaldo manual por estación
```

Rutas principales:

```text
casos/{casoId}
casos_contenido/{casoId}/secciones/lectura
casos_contenido/{casoId}/secciones/escenario
casos_contenido/{casoId}/secciones/debriefing
eventos/{eventoId}
eventos/{eventoId}/estaciones/{estacionId}
```

Los eventos referencian casos existentes; no duplican su contenido.

## Desarrollo local

Requisitos:

- Node.js y npm;
- acceso al proyecto Firebase únicamente para operaciones de despliegue.

Instalar dependencias:

```powershell
npm install
```

Iniciar Hosting y Firestore Emulator:

```powershell
npm run dev
```

Puertos configurados:

- aplicación: <http://localhost:5000>
- Firestore Emulator: `localhost:8080`
- Emulator UI: <http://localhost:4000>

Validar sintaxis JavaScript:

```powershell
npm run validate
```

La validación actual no sustituye pruebas unitarias, de reglas o end-to-end.

## Despliegue

Desplegar reglas:

```powershell
npm run deploy:rules
```

Desplegar frontend:

```powershell
npm run deploy:hosting
```

No desplegar contenido clínico de borrador ni documentos con placeholders sin
validación clínica, pedagógica y editorial.

## Estructura relevante

```text
public/                 aplicación estática publicada
public/js/views/        vistas de catálogo, eventos, casos y recursos
public/docs/oficiales/  plantillas Word disponibles para autores
public/docs/guias/      guías versionadas y su estado editorial
public/docs/centro-recursos/metadata.json  metadata del Centro de recursos
docs/                   contratos, planes y transferencia
firestore.rules         reglas vigentes del PMV
firebase.json           Hosting, Firestore y emuladores
```

Las guías versionadas usan `current/` para la versión publicada vigente,
`working/` para la versión en desarrollo y `archive/<version>/` para versiones
publicadas reemplazadas. En este contexto, `current/` significa exclusivamente
la publicación vigente; nunca debe contener borradores. El archivo
`public/docs/centro-recursos/metadata.json` es la fuente única de versión,
estado, audiencia, validaciones y rutas únicamente para el Centro de recursos;
no describe la aplicación, los casos ni Firestore. Un documento `en_revision`
puede mostrarse para recibir comentarios, pero no debe etiquetarse como oficial
hasta completar sus validaciones.

La metadata registra por recurso los canales `channels.current` y
`channels.working`. Ambos pueden existir al mismo tiempo: la interfaz pública
prioriza `current`, mientras la nueva versión continúa su revisión en
`working`. Para publicar una nueva versión:

1. Mover la carpeta publicada `current/` completa a `archive/<version>/`.
2. Mover el contenido aprobado de `working/` a `current/`.
3. Actualizar ambos canales y el inventario `archive` en la metadata.
4. Desplegar y comprobar las rutas antes de retirar redirecciones históricas.

## Documentación

- [Visión de producto](docs/vision-producto-praxis.md): tesis estratégica,
  frontera del producto, experiencia PMV, métricas y reducción de papel.
- [Transferencia vigente](docs/transferencia-praxis.md): estado, defectos,
  siguiente alcance y checklist.
- [Contrato Firestore del PMV](docs/firestore-pmv.md): rutas, campos, seed y
  operación actual.
- [Plan del importador](docs/importador-praxis.md): selección, validación,
  custodia, transformación y publicación.
- [Hallazgos y plan de acción UX/UI](docs/hallazgos-plan-ux-ui-accesibilidad.md):
  evaluación, prioridades, criterios de aceptación y fases de mejora.
- [Plan futuro de evolución arquitectónica](docs/plan-migracion-arquitectura-react.md):
  dominio ligero, separación por capas y evaluación progresiva de React.
- [Memoria editorial para IA](docs/ia-generacion-casos-praxis.md): generación y
  revisión de contenido con las plantillas oficiales.
- [ADR 0006: versionado y ciclo editorial por scope](docs/decisiones/0006-versionado-y-ciclo-editorial-por-scope.md):
  convención del Centro de recursos y criterios de benchmarking transversal.
- [Decisiones arquitectónicas](docs/decisiones/): decisiones duraderas y sus
  consecuencias.

Los documentos técnicos internos no deben copiarse a `public/`.
