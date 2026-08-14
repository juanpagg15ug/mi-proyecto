const resources = [
    {
        id: 'report',
        title: 'Reporte de caso clínico académico',
        description: 'Guía y plantilla oficial para preparar un reporte clínico académico.',
        icon: 'fa-file-medical',
        files: [
            {
                title: 'Plantilla 1: Reporte de Caso Clínico Académico',
                description: 'Documento Word oficial para redactar y revisar reportes académicos.',
                file: './docs/oficiales/plantilla-1-reporte-caso-clinico-academico.docx'
            }
        ],
        package: ['00_Metadata/metadata.json', '01_Reporte/reporte.docx', '02_Referencias/']
    },
    {
        id: 'simulation',
        title: 'Guion de caso de simulación clínica',
        description: 'Paquete de tres secciones para preparar lectura, escenario y facilitación.',
        icon: 'fa-person-chalkboard',
        files: [
            { title: '01_Lectura: Viñeta y lectura pública', description: 'Documento Word oficial para la información que verá el participante.', file: './docs/oficiales/simulacion/current/01_Lectura%20-%20v1Plantilla%20de%20Viñeta%20y%20Lectura%20Pública.docx' },
            { title: '02_Escenario: Guion y script del instructor', description: 'Documento Word oficial para escenario, acciones, respuestas y operación.', file: './docs/oficiales/simulacion/current/02_Escenario%20-%20v1Plantilla%20de%20Guion%20y%20Script%20del%20Instructor.docx' },
            { title: '03_Debriefing: Facilitación y listas de cotejo', description: 'Documento Word oficial para debriefing, preguntas y evaluación.', file: './docs/oficiales/simulacion/current/03_Debriefing%20-%20v1Plantilla%20de%20Facilitación%20y%20Listas%20de%20Cotejo.docx' }
        ],
        package: ['00_Metadata/metadata.json', '01_Lectura/lectura.docx', '02_Escenario/escenario.docx', '03_Debriefing/debriefing.docx']
    },
    {
        id: 'editorial',
        title: 'Guía editorial de casos',
        description: 'Normas oficiales de estilo, citación, inclusión, anonimización y revisión.',
        icon: 'fa-pen-ruler',
        files: [
            { title: 'Guía Editorial de Casos', description: 'Documento Word oficial de referencia editorial.', file: './docs/oficiales/guia-editorial-casos.docx' }
        ],
        package: ['Plantilla oficial', 'metadata.json cuando se prepare un caso', 'Paquete de entrega para revisión']
    }
];

const tools = [
    { title: 'Calculadora de priorización', description: 'Evalúa valor, urgencia y esfuerzo para decidir qué caso o producto debe avanzar.', icon: 'fa-calculator', action: 'onOpenCalculator' },
    { title: 'IDs y claves de acceso', description: 'Herramienta interna para coordinadores y administradores. Prepara IDs, relaciones y metadata.', icon: 'fa-key', action: 'onOpenKeyGenerator' }
];

function packageMarkup(items) {
    return `<code class="block whitespace-pre-wrap bg-white border border-slate-200 rounded-lg p-4 mt-3 text-sm text-slate-800">${items.join('\n')}</code>`;
}

function renderResourceDetail(container, resource, options) {
    container.innerHTML = `
        <section class="max-w-5xl mx-auto py-6">
            <button id="btn-back-resource-list" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button"><i class="fas fa-arrow-left mr-2"></i>Volver al Centro de recursos</button>
            <div class="mb-8"><span class="text-xs font-bold uppercase tracking-wide text-emerald-700">Guía oficial</span><h1 class="text-3xl font-bold text-indigo-900 mt-2">${resource.title}</h1><p class="text-gray-600 mt-2 max-w-3xl">${resource.description}</p></div>
            <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6">
                <section class="space-y-4" aria-labelledby="resource-files-title"><div><h2 id="resource-files-title" class="text-xl font-bold text-indigo-900">Secciones y documentos</h2><p class="text-sm text-gray-600 mt-1">Descarga los documentos que forman parte de esta guía.</p></div>
                    ${resource.files.map((file, index) => `<article class="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between gap-4"><div><span class="text-xs font-bold uppercase tracking-wide text-emerald-700">Sección ${String(index + 1).padStart(2, '0')}</span><h3 class="text-lg font-bold text-indigo-900 mt-1">${file.title}</h3><p class="text-sm text-gray-600 mt-1">${file.description}</p></div><a class="shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg" href="${file.file}" download><i class="fas fa-file-word"></i>Descargar Word</a></article>`).join('')}
                </section>
                <aside class="space-y-4"><section class="bg-amber-50 border border-amber-200 rounded-xl p-5" aria-labelledby="resource-expectations-title"><span class="text-xs font-bold uppercase tracking-wide text-amber-700">Expectativas de entrega</span><h2 id="resource-expectations-title" class="text-lg font-bold text-amber-950 mt-1">Antes de completar</h2><p class="text-sm leading-6 text-amber-900 mt-2">Las notas de llenado y diseño instruccional ayudan a completar la plantilla, pero no son contenido publicable.</p><ul class="text-sm leading-6 text-amber-900 list-disc pl-5 mt-3"><li>Completa las secciones del paquete.</li><li>Acompaña los Word con <span class="font-mono">00_Metadata/metadata.json</span>.</li><li>Retira las notas antes de entregar.</li><li>La importación futura validará el paquete.</li></ul></section><section class="bg-slate-50 border border-slate-200 rounded-xl p-5" aria-labelledby="resource-package-title"><span class="text-xs font-bold uppercase tracking-wide text-slate-600">Paquete esperado</span><h2 id="resource-package-title" class="text-lg font-bold text-indigo-900 mt-1">Archivos del caso</h2>${packageMarkup(resource.package)}</section></aside>
            </div>
        </section>`;
    container.querySelector('#btn-back-resource-list').addEventListener('click', () => renderResourcesView(container.id, options));
}

export function renderResourcesView(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = `
        <section class="max-w-5xl mx-auto py-6"><button id="btn-back-resources" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button"><i class="fas fa-arrow-left mr-2"></i>Volver al inicio</button><div class="mb-8"><span class="text-xs font-bold uppercase tracking-wide text-emerald-700">Centro de recursos</span><h1 class="text-3xl font-bold text-indigo-900 mt-2">Centro de recursos Praxis</h1><p class="text-gray-600 mt-2 max-w-3xl">Elige el tipo de recurso que vas a utilizar. Después podrás revisar sus secciones, descargar los archivos y conocer qué debes entregar.</p></div>
            <div class="space-y-8"><section aria-labelledby="resource-guides-title"><div class="mb-3"><h2 id="resource-guides-title" class="text-xl font-bold text-indigo-900">Guías y plantillas</h2><p class="text-sm text-gray-600 mt-1">Selecciona una guía para ver sus secciones y documentos asociados.</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${resources.map((resource) => `<article class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between"><div><span class="text-xs font-bold uppercase tracking-wide text-emerald-700"><i class="fas ${resource.icon} mr-1"></i>Guía oficial</span><h3 class="text-lg font-bold text-indigo-900 mt-2">${resource.title}</h3><p class="text-sm leading-6 text-gray-600 mt-2">${resource.description}</p></div><button data-resource-id="${resource.id}" class="inline-flex items-center justify-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg" type="button"><i class="fas fa-folder-open"></i>Entrar a la guía</button></article>`).join('')}</div></section>
                <section aria-labelledby="resource-tools-title"><div class="mb-3"><h2 id="resource-tools-title" class="text-xl font-bold text-indigo-900">Herramientas de trabajo</h2><p class="text-sm text-gray-600 mt-1">Estas herramientas son internas. El generador de IDs y relaciones requiere código.</p></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4">${tools.map((tool) => `<article class="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between"><div><span class="text-xs font-bold uppercase tracking-wide text-slate-600">Herramienta interna PMV</span><h3 class="text-lg font-bold text-indigo-900 mt-2"><i class="fas ${tool.icon} text-slate-600 mr-2"></i>${tool.title}</h3><p class="text-sm leading-6 text-gray-600 mt-2">${tool.description}</p></div><button data-resource-action="${tool.action}" class="inline-flex items-center justify-center gap-2 mt-6 bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg" type="button"><i class="fas fa-arrow-right"></i>Abrir herramienta</button></article>`).join('')}</div></section>
            </div></div>
        </section>`;
    container.querySelector('#btn-back-resources').addEventListener('click', () => options.onBack?.());
    container.querySelectorAll('[data-resource-id]').forEach((button) => button.addEventListener('click', () => renderResourceDetail(container, resources.find((resource) => resource.id === button.dataset.resourceId), options)));
    container.querySelectorAll('[data-resource-action]').forEach((button) => button.addEventListener('click', () => options[button.dataset.resourceAction]?.()));
}
