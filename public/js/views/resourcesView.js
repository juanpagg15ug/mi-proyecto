const resourcesManifestUrl = './docs/centro-recursos/metadata.json';
let resourcesPromise;

function loadResources() {
    if (!resourcesPromise) {
        resourcesPromise = fetch(resourcesManifestUrl, { cache: 'no-cache' })
            .then((response) => {
                if (!response.ok) throw new Error(`No se pudo cargar el manifiesto (${response.status}).`);
                return response.json();
            })
            .then((manifest) => {
                if (manifest.schemaVersion !== 2 || !Array.isArray(manifest.resources)) {
                    throw new Error('El manifiesto de recursos no tiene un formato compatible.');
                }
                manifest.resources.forEach((resource) => resourceRelease(resource));
                return manifest.resources;
            });
    }
    return resourcesPromise;
}

const tools = [
    { title: 'Calculadora de priorización', description: 'Evalúa valor, urgencia y esfuerzo para decidir qué caso o producto debe avanzar.', icon: 'fa-calculator', action: 'onOpenCalculator' },
    { title: 'IDs y claves de acceso', description: 'Herramienta interna para coordinadores y administradores. Prepara IDs, relaciones y metadata.', icon: 'fa-key', action: 'onOpenKeyGenerator' }
];

function packageMarkup(items) {
    return `<code class="block whitespace-pre-wrap bg-white border border-slate-200 rounded-lg p-4 mt-3 text-sm text-slate-800">${items.join('\n')}</code>`;
}

function resourceRelease(resource) {
    const release = resource.channels?.current ?? resource.channels?.working;
    if (!release || !Array.isArray(release.files)) {
        throw new Error(`El recurso ${resource.id ?? 'desconocido'} no tiene una versión visible.`);
    }
    return release;
}

function resourceBadge(resource) {
    const release = resourceRelease(resource);
    if (release.publicationStatus === 'publicada') {
        return { label: 'Guía oficial', className: 'text-emerald-700' };
    }
    const badges = {
        en_revision: { label: 'Borrador en revisión', className: 'text-amber-700' },
        borrador: { label: 'Borrador', className: 'text-slate-600' },
        archivado: { label: 'Archivado', className: 'text-slate-600' }
    };
    return badges[release.editorialStatus] ?? badges.borrador;
}

function fileAction(file) {
    if (file.format === 'pdf') {
        return { icon: 'fa-file-pdf', label: 'Abrir PDF', attributes: 'target="_blank" rel="noopener"' };
    }
    return { icon: 'fa-file-word', label: 'Descargar Word', attributes: 'download' };
}

function noticeMarkup(resource) {
    const notice = resource.notice ?? {
        label: 'Expectativas de entrega',
        title: 'Antes de completar',
        description: 'Las notas de llenado y diseño instruccional ayudan a completar la plantilla, pero no son contenido publicable.',
        items: ['Completa las secciones del paquete.', 'Acompaña los Word con 00_Metadata/metadata.json.', 'Retira las notas antes de entregar.', 'La importación futura validará el paquete.']
    };
    return `<section class="bg-amber-50 border border-amber-200 rounded-xl p-5" aria-labelledby="resource-expectations-title"><span class="text-xs font-bold uppercase tracking-wide text-amber-700">${notice.label}</span><h2 id="resource-expectations-title" class="text-lg font-bold text-amber-950 mt-1">${notice.title}</h2><p class="text-sm leading-6 text-amber-900 mt-2">${notice.description}</p><ul class="text-sm leading-6 text-amber-900 list-disc pl-5 mt-3">${notice.items.map((item) => `<li>${item}</li>`).join('')}</ul></section>`;
}

function renderResourceDetail(container, resource, options) {
    const badge = resourceBadge(resource);
    const release = resourceRelease(resource);
    container.innerHTML = `
        <section class="max-w-5xl mx-auto py-6">
            <button id="btn-back-resource-list" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button"><i class="fas fa-arrow-left mr-2"></i>Volver al Centro de recursos</button>
            <div class="mb-8"><span class="text-xs font-bold uppercase tracking-wide ${badge.className}">${badge.label}</span><h1 class="text-3xl font-bold text-indigo-900 mt-2">${resource.title}</h1><p class="text-gray-600 mt-2 max-w-3xl">${resource.description}</p></div>
            <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
                <section class="space-y-4" aria-labelledby="resource-files-title"><div><h2 id="resource-files-title" class="text-xl font-bold text-indigo-900">Secciones y documentos</h2><p class="text-sm text-gray-600 mt-1">${resource.sectionDescription ?? 'Descarga los documentos que forman parte de esta guía.'}</p></div>
                    ${release.files.map((file, index) => { const action = fileAction(file); return `<article class="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4"><div><span class="text-xs font-bold uppercase tracking-wide ${badge.className}">Documento ${String(index + 1).padStart(2, '0')}</span><h3 class="text-lg font-bold text-indigo-900 mt-1">${file.title}</h3><p class="text-sm text-gray-600 mt-1">${file.description}</p></div><a class="shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg" href="${file.file}" ${action.attributes}><i class="fas ${action.icon}"></i>${action.label}</a></article>`; }).join('')}
                </section>
                <aside class="space-y-4">${noticeMarkup(resource)}<section class="bg-slate-50 border border-slate-200 rounded-xl p-5" aria-labelledby="resource-package-title"><span class="text-xs font-bold uppercase tracking-wide text-slate-600">${resource.packageLabel ?? 'Paquete esperado'}</span><h2 id="resource-package-title" class="text-lg font-bold text-indigo-900 mt-1">${resource.packageTitle ?? 'Archivos del caso'}</h2>${packageMarkup(resource.package)}</section></aside>
            </div>
        </section>`;
    container.querySelector('#btn-back-resource-list').addEventListener('click', () => renderResourcesView(container.id, options));
}

export async function renderResourcesView(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<p class="py-12 text-center text-sm text-gray-600" role="status">Cargando recursos...</p>';

    let resources;
    try {
        resources = await loadResources();
    } catch (error) {
        console.error('Error loading resources manifest:', error);
        container.innerHTML = `<section class="max-w-xl mx-auto py-12 text-center"><h1 class="text-2xl font-bold text-indigo-900">No se pudieron cargar los recursos</h1><p class="text-gray-600 mt-2">Revisa tu conexión e inténtalo nuevamente.</p><button id="btn-retry-resources" class="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg" type="button"><i class="fas fa-rotate-right mr-2"></i>Reintentar</button></section>`;
        container.querySelector('#btn-retry-resources').addEventListener('click', () => {
            resourcesPromise = null;
            renderResourcesView(containerId, options);
        });
        return;
    }

    if (options.token && container.dataset.viewToken !== options.token) return;
    container.innerHTML = `
        <section class="max-w-5xl mx-auto py-6"><button id="btn-back-resources" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button"><i class="fas fa-arrow-left mr-2"></i>Volver al inicio</button><div class="mb-8"><span class="text-xs font-bold uppercase tracking-wide text-emerald-700">Centro de recursos</span><h1 class="text-3xl font-bold text-indigo-900 mt-2">Centro de recursos Praxis</h1><p class="text-gray-600 mt-2 max-w-3xl">Elige el tipo de recurso que vas a utilizar. Después podrás revisar sus secciones, descargar los archivos y conocer qué debes entregar.</p></div>
            <div class="space-y-8"><section aria-labelledby="resource-guides-title"><div class="mb-3"><h2 id="resource-guides-title" class="text-xl font-bold text-indigo-900">Guías y plantillas</h2><p class="text-sm text-gray-600 mt-1">Selecciona una guía para ver sus secciones y documentos asociados.</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${resources.map((resource) => { const badge = resourceBadge(resource); return `<article class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between"><div><span class="text-xs font-bold uppercase tracking-wide ${badge.className}"><i class="fas ${resource.icon} mr-1"></i>${badge.label}</span><h3 class="text-lg font-bold text-indigo-900 mt-2">${resource.title}</h3><p class="text-sm leading-6 text-gray-600 mt-2">${resource.description}</p></div><button data-resource-id="${resource.id}" class="inline-flex items-center justify-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg" type="button"><i class="fas fa-folder-open"></i>Entrar a la guía</button></article>`; }).join('')}</div></section>
                <section aria-labelledby="resource-tools-title"><div class="mb-3"><h2 id="resource-tools-title" class="text-xl font-bold text-indigo-900">Herramientas de trabajo</h2><p class="text-sm text-gray-600 mt-1">Estas herramientas son internas. El generador de IDs y relaciones requiere código.</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${tools.map((tool) => `<article class="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between"><div><span class="text-xs font-bold uppercase tracking-wide text-slate-600">Herramienta interna PMV</span><h3 class="text-lg font-bold text-indigo-900 mt-2"><i class="fas ${tool.icon} text-slate-600 mr-2"></i>${tool.title}</h3><p class="text-sm leading-6 text-gray-600 mt-2">${tool.description}</p></div><button data-resource-action="${tool.action}" class="inline-flex items-center justify-center gap-2 mt-6 bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg" type="button"><i class="fas fa-arrow-right"></i>Abrir herramienta</button></article>`).join('')}</div></section>
            </div></div>
        </section>`;
    container.querySelector('#btn-back-resources').addEventListener('click', () => options.onBack?.());
    container.querySelectorAll('[data-resource-id]').forEach((button) => button.addEventListener('click', () => renderResourceDetail(container, resources.find((resource) => resource.id === button.dataset.resourceId), options)));
    container.querySelectorAll('[data-resource-action]').forEach((button) => button.addEventListener('click', () => options[button.dataset.resourceAction]?.()));
}
