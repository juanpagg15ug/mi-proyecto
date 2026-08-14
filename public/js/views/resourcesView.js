const resources = [
    {
        group: 'Plantillas oficiales',
        title: 'Plantilla 1: Reporte de Caso Clínico Académico',
        description: 'Documento Word oficial para redactar y revisar reportes de casos clínicos académicos.',
        file: './docs/oficiales/plantilla-1-reporte-caso-clinico-academico.docx',
        download: true
    },
    {
        group: 'Plantillas oficiales',
        title: 'Plantilla 2: Guion de Caso de Simulación Clínica',
        description: 'Documento Word oficial para preparar briefing, escenario, roles, evaluación y debriefing.',
        file: './docs/oficiales/plantilla-2-guion-caso-simulacion-clinica.docx',
        download: true
    },
    {
        group: 'Plantillas oficiales',
        title: 'Guía Editorial de Casos',
        description: 'Documento Word oficial con normas de estilo, citación, inclusión, anonimización y revisión pedagógica.',
        file: './docs/oficiales/guia-editorial-casos.docx',
        download: true
    }
];

const tools = [
    {
        title: 'Calculadora de priorización',
        description: 'Evalúa valor, urgencia y esfuerzo para decidir qué caso o producto debe avanzar.',
        icon: 'fa-calculator',
        action: 'onOpenCalculator'
    },
    {
        title: 'Proponer IDs y claves de acceso',
        description: 'Prepara un caso_id, nombres de carpeta y candidatos de acceso, sin crear documentos ni activar claves.',
        icon: 'fa-key',
        action: 'onOpenKeyGenerator'
    }
];

export function renderResourcesView(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const groups = [...new Set(resources.map((resource) => resource.group))];
    container.innerHTML = `
        <section class="max-w-5xl mx-auto py-6">
            <button id="btn-back-resources" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button">
                <i class="fas fa-arrow-left mr-2"></i>Volver al inicio
            </button>
            <div class="mb-8">
                <span class="text-xs font-bold uppercase tracking-wide text-emerald-700">Centro de recursos</span>
                <h1 class="text-3xl font-bold text-indigo-900 mt-2">Centro de recursos Praxis</h1>
                <p class="text-gray-600 mt-2 max-w-3xl">Material editorial y herramientas de trabajo para diseñar, revisar y preparar casos clínicos y guiones de simulación.</p>
            </div>
            <div class="space-y-8">
                <section aria-labelledby="resource-tools-title">
                    <div class="mb-3">
                        <h2 id="resource-tools-title" class="text-xl font-bold text-indigo-900">Herramientas de trabajo</h2>
                        <p class="text-sm text-gray-600 mt-1">La calculadora ayuda a priorizar. La herramienta de IDs prepara nombres y claves para una configuración posterior; ninguna de las dos guarda cambios automáticamente.</p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        ${tools.map((tool) => `
                            <article class="bg-slate-50 border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                                <div>
                                    <span class="text-xs font-bold uppercase tracking-wide text-slate-600">Herramienta interna PMV</span>
                                    <h3 class="text-lg font-bold text-indigo-900 mt-2"><i class="fas ${tool.icon} text-slate-600 mr-2"></i>${tool.title}</h3>
                                    <p class="text-sm leading-6 text-gray-600 mt-2">${tool.description}</p>
                                </div>
                                <button data-resource-action="${tool.action}" class="inline-flex items-center justify-center gap-2 mt-6 bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 py-2 rounded-lg transition" type="button">
                                    <i class="fas fa-arrow-right"></i> Abrir herramienta
                                </button>
                            </article>
                        `).join('')}
                    </div>
                </section>
                ${groups.map((group) => `
                    <section aria-labelledby="resource-group-${group.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}">
                        <h2 id="resource-group-${group.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}" class="text-xl font-bold text-indigo-900 mb-3">${group}</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${resources.filter((resource) => resource.group === group).map((resource) => `
                                <article class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <span class="text-xs font-bold uppercase tracking-wide text-emerald-700">Referencia editorial</span>
                                        <h3 class="text-lg font-bold text-indigo-900 mt-2">${resource.title}</h3>
                                        <p class="text-sm leading-6 text-gray-600 mt-2">${resource.description}</p>
                                    </div>
                                    <a class="inline-flex items-center justify-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition" href="${resource.file}" ${resource.download ? 'download' : 'target="_blank" rel="noopener"'}>
                                        <i class="fas fa-file-word"></i> Descargar Word
                                    </a>
                                </article>
                            `).join('')}
                        </div>
                    </section>
                `).join('')}
            </div>
        </section>
    `;

    container.querySelector('#btn-back-resources').addEventListener('click', () => options.onBack?.());
    container.querySelectorAll('[data-resource-action]').forEach((button) => {
        button.addEventListener('click', () => options[button.dataset.resourceAction]?.());
    });
}
