const resources = [
    {
        id: 'report',
        group: 'Guías y plantillas',
        title: 'Reporte de caso clínico académico',
        description: 'Guía y plantilla oficial para preparar un reporte clínico académico.',
        icon: 'fa-file-medical',
        files: [{ title: 'Plantilla 1: Reporte de Caso Clínico Académico', description: 'Documento Word oficial para redactar y revisar reportes académicos.', file: './docs/oficiales/plantilla-1-reporte-caso-clinico-academico.docx' }],
        package: ['00_Metadata/metadata.json', '01_Reporte/reporte.docx', '02_Referencias/']
    },
    {
        id: 'simulation',
        group: 'Guías y plantillas',
        title: 'Guion de caso de simulación clínica',
        description: 'Paquete de tres secciones para preparar lectura, escenario y facilitación.',
        icon: 'fa-person-chalkboard',
        files: [
            { title: '01_Lectura: Viñeta y lectura pública', description: 'Documento Word oficial para la información que verá el participante.', file: './docs/oficiales/01-lectura-v1-plantilla-vineta-lectura-publica.docx', pending: true },
            { title: '02_Escenario: Guion y script del instructor', description: 'Documento Word oficial para escenario, acciones, respuestas y operación.', file: './docs/oficiales/02-escenario-v1-plantilla-guion-script-instructor.docx', pending: true },
            { title: '03_Debriefing: Facilitación y listas de cotejo', description: 'Documento Word oficial para debriefing, preguntas y evaluación.', file: './docs/oficiales/03-debriefing-v1-plantilla-facilitacion-listas-cotejo.docx', pending: true }
        ],
        package: ['00_Metadata/metadata.json', '01_Lectura/lectura.docx', '02_Escenario/escenario.docx', '03_Debriefing/debriefing.docx']
    },
    {
        id: 'editorial',
        group: 'Guías y plantillas',
        title: 'Guía editorial de casos',
        description: 'Normas oficiales de estilo, citación, inclusión, anonimización y revisión.',
        icon: 'fa-pen-ruler',
        files: [{ title: 'Guía Editorial de Casos', description: 'Documento Word oficial de referencia editorial.', file: './docs/oficiales/guia-editorial-casos.docx' }],
        package: ['Plantilla oficial', 'metadata.json cuando se prepare un caso', 'Paquete de entrega para revisión']
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
                <aside class="bg-amber-50 border border-amber-200 rounded-xl p-5" aria-labelledby="resource-import-notice-title">
                    <span class="text-xs font-bold uppercase tracking-wide text-amber-700">Antes de descargar</span>
                    <h2 id="resource-import-notice-title" class="text-lg font-bold text-amber-950 mt-1">Cómo entregar un caso</h2>
                    <p class="text-sm leading-6 text-amber-900 mt-2">Las plantillas Word son partes de un paquete de caso. Para entregar un caso necesitarás completar los documentos correspondientes y acompañarlos con un archivo <span class="font-mono">metadata.json</span>.</p>
                    <ul class="text-sm leading-6 text-amber-900 list-disc pl-5 mt-3">
                        <li>Descarga y completa las plantillas sin código de acceso.</li>
                        <li>Guarda todo en una carpeta del caso con <span class="font-mono">00_Metadata/metadata.json</span>.</li>
                        <li>Puedes preparar la metadata con el formato indicado o solicitar el archivo al coordinador/administrador.</li>
                        <li>Entrega el paquete para revisión clínica, pedagógica y editorial.</li>
                        <li>La importación futura validará el paquete antes de escribir en el sistema.</li>
                        <li>No compartas códigos dentro de los archivos de metadata ni de contenido.</li>
                        <li>Las notas de llenado de las plantillas deben retirarse; el importador las detectará y advertirá si siguen presentes.</li>
                    </ul>
                    <div class="mt-4 rounded-lg bg-white/70 border border-amber-200 p-3 text-sm text-amber-950">
                        <p class="font-semibold">Paquete esperado</p>
                        <code class="block whitespace-pre-wrap mt-1">Caso/
├── 00_Metadata/metadata.json
├── 01_Lectura/lectura.docx
├── 02_Escenario/escenario.docx
└── 03_Debriefing/debriefing.docx</code>
                    </div>
                </aside>
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
                <section class="bg-slate-50 border border-slate-200 rounded-xl p-5" aria-labelledby="resource-package-title">
                    <span class="text-xs font-bold uppercase tracking-wide text-slate-600">Paquete de entrega</span>
                    <h2 id="resource-package-title" class="text-xl font-bold text-indigo-900 mt-1">Cómo se organiza un caso</h2>
                    <p class="text-sm text-gray-600 mt-2">La metadata acompaña a las carpetas de contenido. No es una sección clínica: identifica el caso, sus documentos, versión, fuentes y estado de revisión.</p>
                    <code class="block whitespace-pre-wrap bg-white border border-slate-200 rounded-lg p-4 mt-4 text-sm text-slate-800">Caso/
├── 00_Metadata/metadata.json
├── 01_Lectura/lectura.docx
├── 02_Escenario/escenario.docx
└── 03_Debriefing/debriefing.docx</code>
                    <p class="text-xs text-slate-600 mt-3">Las plantillas y la estructura se pueden descargar sin código. El generador de IDs y relaciones es una herramienta interna para coordinadores y administradores.</p>
                </section>
            </div>
        </section>
    `;

    container.querySelector('#btn-back-resources').addEventListener('click', () => options.onBack?.());
    container.querySelectorAll('[data-resource-action]').forEach((button) => {
        button.addEventListener('click', () => options[button.dataset.resourceAction]?.());
    });
}
