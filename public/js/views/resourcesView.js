const resources = [
    {
        group: 'Plantillas de casos',
        title: 'Blueprint A: Reportes de caso',
        description: 'Estructura de trabajo para metadata pública, lectura clínica, objetivos y revisión previa a publicación.',
        file: './docs/blueprint-a-casos.md'
    },
    {
        group: 'Plantillas de casos',
        title: 'Blueprint B: Guion de simulación',
        description: 'Ejemplo de lectura, guion de actor, operación SimTech y guía de debriefing para una estación.',
        file: './docs/blueprint-b-via-aerea-dificil.md'
    },
    {
        group: 'Guías editoriales',
        title: 'Guía Editorial de Casos',
        description: 'Criterios públicos de estructura, estilo, citación, inclusión, anonimización y revisión pedagógica.',
        file: './docs/guia-editorial-casos.md'
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
                <h1 class="text-3xl font-bold text-indigo-900 mt-2">Blueprints y guías Praxis</h1>
                <p class="text-gray-600 mt-2 max-w-3xl">Material de referencia para diseñar, revisar y preparar casos clínicos y guiones de simulación. La documentación técnica interna no se publica aquí.</p>
            </div>
            <div class="space-y-8">
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
                                    <a class="inline-flex items-center justify-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg transition" href="${resource.file}" target="_blank" rel="noopener">
                                        <i class="fas fa-book-open"></i> Abrir documento
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
}
