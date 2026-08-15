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
docs/                   contratos, planes y transferencia
firestore.rules         reglas vigentes del PMV
firebase.json           Hosting, Firestore y emuladores
```

## Documentación

- [Transferencia vigente](docs/transferencia-praxis.md): estado, defectos,
  siguiente alcance y checklist.
- [Contrato Firestore del PMV](docs/firestore-pmv.md): rutas, campos, seed y
  operación actual.
- [Plan del importador](docs/importador-praxis.md): selección, validación,
  custodia, transformación y publicación.
- [Memoria editorial para IA](docs/ia-generacion-casos-praxis.md): generación y
  revisión de contenido con las plantillas oficiales.
- [Decisiones arquitectónicas](docs/decisiones/): decisiones duraderas y sus
  consecuencias.

Los documentos técnicos internos no deben copiarse a `public/`.
