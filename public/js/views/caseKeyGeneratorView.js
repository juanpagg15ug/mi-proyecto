import { db } from '../firebase-config.js';
import { collection, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const ACCESS_CONFIG_PATH = ['configuracion', 'accesos'];

function slugifyKey(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'SIN-VALOR';
}

function randomAccessKey(prefix) {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    const suffix = Array.from(bytes, (byte) => byte.toString(36).padStart(2, '0')).join('').slice(0, 8).toUpperCase();
    return `${prefix}-${suffix}`;
}

function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}

function renderOutput(caseId, caso, drivePath = '') {
    const productKey = slugifyKey(caso.producto || caso.tipo || 'caso');
    const specialtyKey = slugifyKey(caso.especialidad || 'general');
    const categoryKey = slugifyKey(caso.subcategoria_catalogo || caso.eje_transversal || 'sin-clasificar');
    const driveFolder = `${caseId}__${productKey}__${specialtyKey}__${categoryKey}`;

    return `
        <section class="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5" aria-labelledby="case-key-output-title">
            <span class="text-xs font-bold uppercase tracking-wide text-emerald-700">Clave generada</span>
            <h2 id="case-key-output-title" class="text-lg font-bold text-emerald-950 mt-1">Valores canónicos del caso</h2>
            <dl class="grid gap-3 mt-4 text-sm">
                <div><dt class="font-semibold text-emerald-900">ID Firestore / caso_id</dt><dd class="font-mono text-emerald-950 break-all">${caseId}</dd></div>
                <div><dt class="font-semibold text-emerald-900">Carpeta Google Drive</dt><dd class="font-mono text-emerald-950 break-all">${driveFolder}</dd></div>
                <div><dt class="font-semibold text-emerald-900">Ruta sugerida en Google Drive</dt><dd class="font-mono text-emerald-950 break-all">${drivePath || 'No disponible para este caso'}</dd></div>
                <div><dt class="font-semibold text-emerald-900">Secciones</dt><dd class="font-mono text-emerald-950">lectura · escenario · debriefing</dd></div>
            </dl>
        </section>
    `;
}

function buildDrivePath(caseId, caso) {
    const productFolder = caso.producto === 'guion_simulacion' ? '02_Guiones_de_Simulacion_Clinica' : '01_Reportes_y_Articulos_Academicos';
    const specialtyFolder = slugifyKey(caso.especialidad || 'general');
    const categoryFolder = slugifyKey(caso.subcategoria_catalogo || caso.eje_transversal || 'sin-clasificar');
    const folderName = `${caseId}__${slugifyKey(caso.producto || caso.tipo || 'caso')}__${specialtyFolder}__${categoryFolder}`;
    return `SIM-POCUS/01_Banco_General/${productFolder}/${specialtyFolder}/${categoryFolder}/${folderName}`;
}

function buildEventId(prefix, type, year, edition) {
    return `${prefix}-${type}-${year}-${edition}`;
}

function renderEventProposal(eventId, data) {
    const driveFolder = `${eventId}__${slugifyKey(data.nombre || 'evento')}`;
    return `
        <section class="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5" aria-labelledby="event-proposal-title">
            <span class="text-xs font-bold uppercase tracking-wide text-amber-700">Propuesta no persistida</span>
            <h3 id="event-proposal-title" class="text-lg font-bold text-amber-950 mt-1">Ficha preliminar del evento</h3>
            <p class="text-sm text-amber-900 mt-2">Esta propuesta no crea el evento. Úsala para revisar la planificación antes de registrarla en Firestore.</p>
            <dl class="grid gap-3 mt-4 text-sm">
                <div><dt class="font-semibold text-amber-900">Evento ID</dt><dd class="font-mono text-amber-950">${eventId}</dd></div>
                <div><dt class="font-semibold text-amber-900">Nombre</dt><dd class="text-amber-950">${data.nombre || 'Sin nombre'}</dd></div>
                <div><dt class="font-semibold text-amber-900">Alcance</dt><dd class="text-amber-950">${data.alcance || 'General'}</dd></div>
                <div><dt class="font-semibold text-amber-900">Fecha y sede</dt><dd class="text-amber-950">${data.fecha || 'Pendiente'} · ${data.sede || 'Pendiente'}</dd></div>
                <div><dt class="font-semibold text-amber-900">Estaciones previstas</dt><dd class="text-amber-950">${data.estaciones || 'Pendiente de planificación'}</dd></div>
                <div><dt class="font-semibold text-amber-900">Casos seleccionados</dt><dd class="text-amber-950">${data.casos?.length ? data.casos.join(' · ') : 'Ninguno seleccionado'}</dd></div>
                <div><dt class="font-semibold text-amber-900">Equipo previsto</dt><dd class="text-amber-950 whitespace-pre-line">${data.equipo || 'Pendiente de asignación'}</dd></div>
                <div><dt class="font-semibold text-amber-900">Carpeta Google Drive</dt><dd class="font-mono text-amber-950 break-all">SIM-POCUS/02_Eventos/${data.year}/${driveFolder}</dd></div>
            </dl>
            <button id="btn-download-event-metadata" class="mt-5 bg-white border border-amber-300 text-amber-900 font-semibold px-4 py-2 rounded-lg hover:bg-amber-100" type="button"><i class="fas fa-download mr-2"></i>Descargar metadata del evento</button>
        </section>
    `;
}

async function renderRelations(output, caseId) {
    output.textContent = 'Consultando eventos y estaciones...';
    try {
        const eventsSnapshot = await getDocs(collection(db, 'eventos'));
        const relations = [];
        await Promise.all(eventsSnapshot.docs.map(async (eventSnapshot) => {
            const stationsSnapshot = await getDocs(collection(db, 'eventos', eventSnapshot.id, 'estaciones'));
            stationsSnapshot.docs.forEach((stationSnapshot) => {
                const station = stationSnapshot.data();
                if (String(station.caso_id || '').trim() === caseId) {
                    relations.push({ eventId: eventSnapshot.id, stationId: stationSnapshot.id, name: station.nombre || stationSnapshot.id });
                }
            });
        }));
        output.innerHTML = relations.length
            ? `<ul class="space-y-2">${relations.map((relation) => `<li class="bg-white border border-emerald-200 rounded-lg p-3"><strong>${relation.name}</strong><br><span class="font-mono">eventos/${relation.eventId}/estaciones/${relation.stationId}</span></li>`).join('')}</ul>`
            : '<p class="text-emerald-800">Este caso todavía no está vinculado a ninguna estación.</p>';
    } catch (error) {
        output.innerHTML = '<p class="text-red-700">No fue posible consultar las relaciones del caso.</p>';
    }
}

export function renderCaseKeyGeneratorView(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <section class="max-w-3xl mx-auto py-6">
            <button id="btn-back-key-generator" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button">
                <i class="fas fa-arrow-left mr-2"></i>Volver al inicio
            </button>
            <div class="mb-8">
                <span class="text-xs font-bold uppercase tracking-wide text-emerald-700">Herramienta interna PMV</span>
                <h1 class="text-3xl font-bold text-indigo-900 mt-2">Proponer IDs y claves de acceso</h1>
                <p class="text-gray-600 mt-2">Herramienta interna para coordinadores y administradores: prepara identificadores, relaciones y candidatos de acceso. Nada de lo generado aquí se guarda ni queda activo automáticamente.</p>
            </div>
            <aside class="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-950" aria-label="Información para autores">
                <p class="font-semibold">Para entregar un caso</p>
                <p class="mt-1 leading-6">Acompaña las plantillas Word con <span class="font-mono">00_Metadata/metadata.json</span>. El generador está protegido porque expone procesos internos de IDs, relaciones y planificación; solicita el código al coordinador o administrador. Las plantillas y la estructura del paquete no requieren código.</p>
            </aside>
            <ol class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6 text-sm" aria-label="Pasos de la herramienta">
                <li class="bg-emerald-50 border border-emerald-200 rounded-lg p-3"><strong>1. Acceso</strong><span class="block text-emerald-800 mt-1">Valida el código.</span></li>
                <li class="bg-slate-50 border border-slate-200 rounded-lg p-3"><strong>2. Propuesta</strong><span class="block text-slate-700 mt-1">Prepara un ID sin guardar.</span></li>
                <li class="bg-slate-50 border border-slate-200 rounded-lg p-3"><strong>3. Consulta</strong><span class="block text-slate-700 mt-1">Busca un caso real.</span></li>
                <li class="bg-slate-50 border border-slate-200 rounded-lg p-3"><strong>4. Acceso</strong><span class="block text-slate-700 mt-1">Propone una clave.</span></li>
            </ol>
            <form id="case-key-access-form" class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div>
                    <h2 class="text-lg font-bold text-indigo-900">Paso 1: validar acceso</h2>
                    <p class="text-sm text-gray-600 mt-1">Este código solo abre las herramientas internas del PMV. No es una cuenta de usuario ni activa permisos nuevos.</p>
                </div>
                <div>
                    <label for="case-key-code" class="block text-sm font-semibold text-gray-700 mb-2">Código de acceso</label>
                    <input id="case-key-code" type="password" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Código privado" autocomplete="off" required>
                </div>
                <button class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-3 rounded-lg" type="submit"><i class="fas fa-unlock mr-2"></i>Continuar</button>
                <p id="case-key-generator-message" class="text-sm hidden" aria-live="polite"></p>
            </form>
            <div id="case-key-workspace" class="hidden grid grid-cols-1 md:grid-cols-[190px_minmax(0,1fr)] gap-6 mt-6">
                <aside class="bg-slate-50 border border-slate-200 rounded-xl p-3 h-fit" aria-label="Acciones de la herramienta">
                    <p class="text-xs font-bold uppercase tracking-wide text-slate-500 px-3 py-2">Acciones</p>
                    <nav class="space-y-1" role="tablist" aria-label="Acciones de IDs y accesos">
                        <button type="button" data-key-panel="proposal" class="key-panel-button w-full text-left px-3 py-2 rounded-lg bg-indigo-100 text-indigo-900 font-semibold" role="tab" aria-selected="true"><i class="fas fa-wand-magic-sparkles w-5"></i>Proponer ID</button>
                        <button type="button" data-key-panel="event" class="key-panel-button w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-white" role="tab" aria-selected="false"><i class="fas fa-calendar-days w-5"></i>Planificar evento</button>
                        <button type="button" data-key-panel="query" class="key-panel-button w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-white" role="tab" aria-selected="false"><i class="fas fa-magnifying-glass w-5"></i>Consultar caso</button>
                        <button type="button" data-key-panel="access" class="key-panel-button w-full text-left px-3 py-2 rounded-lg text-slate-700 hover:bg-white" role="tab" aria-selected="false"><i class="fas fa-key w-5"></i>Proponer acceso</button>
                    </nav>
                    <p class="text-xs leading-5 text-slate-500 px-3 mt-4">Elige una acción. Solo se muestra un formulario a la vez.</p>
                </aside>
                <main id="key-panel-content">
            <form id="case-key-generator-form" class="hidden bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4" data-key-panel-content="proposal">
                <div><h2 class="text-lg font-bold text-indigo-900">Paso 2: proponer ID de caso</h2><p class="text-sm text-gray-600 mt-1">Elige los componentes del identificador. Firestore solo verifica si ya existe; no reserva ni crea el caso.</p></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label for="case-key-prefix" class="block text-sm font-semibold text-gray-700 mb-2">Prefijo institucional</label><select id="case-key-prefix" class="w-full p-3 border border-gray-300 rounded-lg"><option value="SIM">SIM — Caso Praxis / SIM-POCUS</option><option value="URL">URL — Universidad Rafael Landívar</option><option value="REP">REP — Reporte académico futuro</option></select></div>
                    <div><label for="case-key-year" class="block text-sm font-semibold text-gray-700 mb-2">Año</label><select id="case-key-year" class="w-full p-3 border border-gray-300 rounded-lg"><option>2026</option><option>2027</option><option>2028</option></select></div>
                    <div><label for="case-key-product" class="block text-sm font-semibold text-gray-700 mb-2">Producto</label><select id="case-key-product" class="w-full p-3 border border-gray-300 rounded-lg"><option value="reporte_articulo">Reporte / artículo</option><option value="guion_simulacion">Guion de simulación</option></select></div>
                    <div><label for="case-key-specialty" class="block text-sm font-semibold text-gray-700 mb-2">Área</label><select id="case-key-specialty" class="w-full p-3 border border-gray-300 rounded-lg"><option value="AN">Anestesiología</option><option value="MED">Medicina interna</option><option value="URG">Urgencias</option><option value="OF">Oftalmología</option><option value="INT">Interprofesional</option></select></div>
                    <div><label for="case-key-category" class="block text-sm font-semibold text-gray-700 mb-2">Eje / categoría</label><select id="case-key-category" class="w-full p-3 border border-gray-300 rounded-lg"><option value="CRM">Manejo de crisis (CRM)</option><option value="INCLUSION">Inclusión y vulnerabilidad</option><option value="BIOETICA">Bioética y seguridad</option><option value="INTERCULTURALIDAD">Interculturalidad</option><option value="IDENTIDAD">Equidad e identidad</option></select></div>
                    <div><label for="case-key-sequence" class="block text-sm font-semibold text-gray-700 mb-2">Número secuencial</label><select id="case-key-sequence" class="w-full p-3 border border-gray-300 rounded-lg">${Array.from({ length: 99 }, (_, index) => `<option value="${String(index + 1).padStart(2, '0')}">${String(index + 1).padStart(2, '0')}</option>`).join('')}</select><p class="text-xs text-gray-500 mt-1">Se verifica contra los casos existentes; la propuesta no se reserva.</p></div>
                </div>
                <button class="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-4 py-3 rounded-lg" type="submit"><i class="fas fa-wand-magic-sparkles mr-2"></i>Proponer ID de caso</button>
            </form>
            <form id="event-planning-form" class="hidden bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4" data-key-panel-content="event">
                <div><h2 class="text-lg font-bold text-indigo-900">Planificar evento</h2><p class="text-sm text-gray-600 mt-1">Define la ficha básica y genera un ID para revisar. El evento y sus estaciones se registrarán después, cuando la planificación esté aprobada.</p></div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label for="event-key-prefix" class="block text-sm font-semibold text-gray-700 mb-2">Prefijo institucional</label><select id="event-key-prefix" class="w-full p-3 border border-gray-300 rounded-lg"><option value="SIM">SIM — Praxis / SIM-POCUS</option><option value="URL">URL — Universidad Rafael Landívar</option></select></div>
                    <div><label for="event-key-type" class="block text-sm font-semibold text-gray-700 mb-2">Tipo de evento</label><select id="event-key-type" class="w-full p-3 border border-gray-300 rounded-lg"><option value="CONG">Congreso</option><option value="TALLER">Taller</option><option value="CURSO">Curso</option><option value="ROTACION">Rotación</option></select></div>
                    <div><label for="event-key-year" class="block text-sm font-semibold text-gray-700 mb-2">Año</label><select id="event-key-year" class="w-full p-3 border border-gray-300 rounded-lg"><option>2026</option><option>2027</option><option>2028</option></select></div>
                    <div><label for="event-key-edition" class="block text-sm font-semibold text-gray-700 mb-2">Edición</label><select id="event-key-edition" class="w-full p-3 border border-gray-300 rounded-lg">${Array.from({ length: 20 }, (_, index) => `<option value="${String(index + 1).padStart(2, '0')}">${String(index + 1).padStart(2, '0')}</option>`).join('')}</select></div>
                    <div><label for="event-key-name" class="block text-sm font-semibold text-gray-700 mb-2">Nombre del evento</label><input id="event-key-name" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ej. Taller Internacional de Crisis Anestésicas" required></div>
                    <div><label for="event-key-scope" class="block text-sm font-semibold text-gray-700 mb-2">Alcance o área</label><select id="event-key-scope" class="w-full p-3 border border-gray-300 rounded-lg"><option>General</option><option>Anestesiología</option><option>Medicina interna</option><option>Interprofesional</option></select></div>
                    <div><label for="event-key-date" class="block text-sm font-semibold text-gray-700 mb-2">Fecha</label><input id="event-key-date" type="date" class="w-full p-3 border border-gray-300 rounded-lg"></div>
                    <div><label for="event-key-venue" class="block text-sm font-semibold text-gray-700 mb-2">Sede</label><input id="event-key-venue" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ej. Centro de simulación"></div>
                    <div><label for="event-key-stations" class="block text-sm font-semibold text-gray-700 mb-2">Estaciones previstas</label><input id="event-key-stations" type="number" min="0" max="99" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ej. 3"></div>
                    <div><label for="event-key-owner" class="block text-sm font-semibold text-gray-700 mb-2">Responsable</label><input id="event-key-owner" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ej. Coordinación académica"></div>
                </div>
                <div class="border-t border-gray-100 pt-4">
                    <h3 class="font-bold text-indigo-900">Relaciones preliminares</h3>
                    <p class="text-sm text-gray-600 mt-1">Selecciona casos que podrían formar parte del evento. Esto no crea estaciones ni cambia los casos.</p>
                    <label for="event-key-cases" class="block text-sm font-semibold text-gray-700 mt-3 mb-2">Casos del evento</label>
                    <select id="event-key-cases" class="w-full p-3 border border-gray-300 rounded-lg" multiple size="5"><option value="">Cargando casos publicados...</option></select>
                    <label for="event-key-lead" class="block text-sm font-semibold text-gray-700 mt-4 mb-2">Instructor líder</label>
                    <input id="event-key-lead" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ej. Sandra" required>
                    <label for="event-key-assistants" class="block text-sm font-semibold text-gray-700 mt-4 mb-2">Instructores asistentes</label>
                    <textarea id="event-key-assistants" rows="3" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Un nombre por línea\nEj. Juan\nMaría"></textarea>
                    <label for="event-key-team" class="block text-sm font-semibold text-gray-700 mt-4 mb-2">Equipo operativo adicional</label>
                    <textarea id="event-key-team" rows="3" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="SimTech: Juan\nActor: Pendiente"></textarea>
                </div>
                <button class="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold px-4 py-3 rounded-lg" type="submit"><i class="fas fa-calendar-check mr-2"></i>Proponer planificación</button>
                <div id="event-key-output"></div>
            </form>
            <form id="case-key-query-form" class="hidden bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4" data-key-panel-content="query">
                <div><h2 class="text-lg font-bold text-indigo-900">Paso 3: consultar caso existente</h2><p class="text-sm text-gray-600 mt-1">Introduce un ID ya creado para ver su metadata y las estaciones de eventos que lo utilizan.</p></div>
                <div>
                    <label for="case-key-existing-id" class="block text-sm font-semibold text-gray-700 mb-2">Consultar caso existente</label>
                    <input id="case-key-existing-id" class="w-full p-3 border border-gray-300 rounded-lg font-mono" placeholder="Ej. SIM-AN-2026-01" autocomplete="off" required>
                </div>
                <button class="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 py-3 rounded-lg" type="submit"><i class="fas fa-magnifying-glass mr-2"></i>Consultar caso y relaciones</button>
                <p id="case-key-query-message" class="text-sm" aria-live="polite"></p>
            </form>
            <section id="case-access-key-form" class="hidden bg-white border border-gray-200 rounded-xl p-6 shadow-sm" data-key-panel-content="access" aria-labelledby="case-access-key-title">
                <h2 id="case-access-key-title" class="text-lg font-bold text-indigo-900">Paso 4: proponer clave de acceso</h2>
                <p class="text-sm text-gray-600 mt-1">Genera un candidato para configurarlo después en el flujo correspondiente. No se guarda ni se activa.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div><label for="case-access-key-type" class="block text-sm font-semibold text-gray-700 mb-2">Tipo de acceso</label><select id="case-access-key-type" class="w-full p-3 border border-gray-300 rounded-lg"><option value="INSTRUCTOR">Instructor</option><option value="STAFF">Staff de evento</option><option value="PARTICIPANTE">Participante de evento</option></select></div>
                    <div><label for="case-access-key-context" class="block text-sm font-semibold text-gray-700 mb-2">Contexto opcional</label><input id="case-access-key-context" class="w-full p-3 border border-gray-300 rounded-lg font-mono" placeholder="Ej. SIM-CONG-2026" autocomplete="off"></div>
                </div>
                <button id="btn-propose-access-key" class="w-full mt-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 py-3 rounded-lg" type="button"><i class="fas fa-key mr-2"></i>Proponer clave</button>
                <p id="case-access-key-output" class="mt-4 font-mono text-emerald-800 break-all" aria-live="polite"></p>
            </section>
            <div id="case-key-generator-output"></div>
            <div id="case-key-query-output"></div>
                </main>
            </div>
        </section>
    `;

    container.querySelector('#btn-back-key-generator').addEventListener('click', () => options.onBack?.());
    container.querySelector('#case-key-access-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const message = container.querySelector('#case-key-generator-message');
        const code = container.querySelector('#case-key-code').value.trim();
        message.className = 'text-sm text-gray-600';
        message.textContent = 'Validando acceso...';

        try {
            const snapshot = await getDoc(doc(db, ...ACCESS_CONFIG_PATH));
            if (!snapshot.exists() || String(code) !== String(snapshot.data().codigo_instructor || '')) throw new Error('El código instructor no coincide.');
            message.className = 'text-sm text-emerald-700';
            message.textContent = 'Acceso concedido.';
            container.querySelector('#case-key-workspace').classList.remove('hidden');
            showKeyPanel('proposal');
            loadEventCases(container);
        } catch (error) {
            message.className = 'text-sm text-red-700';
            message.textContent = error.message || 'No fue posible validar el acceso.';
        }
    });

    container.querySelector('#case-key-generator-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const output = container.querySelector('#case-key-generator-output');
        const prefix = container.querySelector('#case-key-prefix').value;
        const year = container.querySelector('#case-key-year').value;
        const specialtyKey = container.querySelector('#case-key-specialty').value;
        const category = container.querySelector('#case-key-category').value;
        const product = container.querySelector('#case-key-product').value;
        const sequence = container.querySelector('#case-key-sequence').value;
        const caseId = `${prefix}-${specialtyKey}-${year}-${sequence}`;
        const caseData = { producto: product, especialidad: specialtyKey, subcategoria_catalogo: category };
        const existingSnapshot = await getDoc(doc(db, 'casos', caseId));
        if (existingSnapshot.exists()) {
            output.innerHTML = `<div class="mt-6 bg-red-50 border border-red-200 rounded-xl p-5 text-red-800">La clave <span class="font-mono font-bold">${caseId}</span> ya existe en Firestore. Elige otro número o consulta el caso existente.</div>`;
            return;
        }
        output.innerHTML = `<div class="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900">Propuesta disponible. No se ha creado ningún documento en Firestore.</div>${renderOutput(caseId, caseData, buildDrivePath(caseId, caseData))}`;
            output.innerHTML = `<div class="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-900">Propuesta disponible. No se ha creado ningún documento en Firestore.</div>${renderOutput(caseId, caseData, buildDrivePath(caseId, caseData))}<button id="btn-download-case-proposal" class="mt-4 bg-white border border-indigo-300 text-indigo-800 font-semibold px-4 py-2 rounded-lg hover:bg-indigo-50" type="button"><i class="fas fa-download mr-2"></i>Descargar metadata del caso</button>`;
            container.querySelector('#btn-download-case-proposal').addEventListener('click', () => downloadJson(`metadata-${caseId}.json`, {
                schema_version: 'praxis.case.v1',
                caso_id: caseId,
                producto: product,
                especialidad: specialtyKey,
                subcategoria_catalogo: category,
                estado: 'borrador',
                importacion: {
                    requiere_autorizacion: true,
                    metodo: 'codigo_del_sistema_o_autenticacion',
                    contacto_si_no_hay_acceso: 'Coordinador o administrador de Praxis',
                    notas_plantilla: 'detectar_y_revisar_antes_de_publicar'
                },
                fuente: 'Propuesta local; no persistida'
            }));
    });

    container.querySelector('#event-planning-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const output = container.querySelector('#event-key-output');
        const prefix = container.querySelector('#event-key-prefix').value;
        const type = container.querySelector('#event-key-type').value;
        const year = container.querySelector('#event-key-year').value;
        const edition = container.querySelector('#event-key-edition').value;
        const data = {
            nombre: container.querySelector('#event-key-name').value.trim(),
            alcance: container.querySelector('#event-key-scope').value,
            fecha: container.querySelector('#event-key-date').value,
            sede: container.querySelector('#event-key-venue').value.trim(),
            estaciones: container.querySelector('#event-key-stations').value || 'Pendiente de planificación',
            responsable: container.querySelector('#event-key-owner').value.trim(),
            casos: Array.from(container.querySelector('#event-key-cases').selectedOptions).map((option) => option.value).filter(Boolean),
            equipo: `Instructor líder: ${container.querySelector('#event-key-lead').value.trim()}\nInstructores asistentes: ${container.querySelector('#event-key-assistants').value.trim() || 'Ninguno asignado'}\n${container.querySelector('#event-key-team').value.trim() || 'Equipo operativo pendiente'}`,
            year
        };
        const eventId = buildEventId(prefix, type, year, edition);
        const existingSnapshot = await getDoc(doc(db, 'eventos', eventId));
        if (existingSnapshot.exists()) {
            output.innerHTML = `<div class="mt-6 bg-red-50 border border-red-200 rounded-xl p-5 text-red-800">El evento <span class="font-mono font-bold">${eventId}</span> ya existe en Firestore. Elige otra edición o consulta la configuración existente.</div>`;
            return;
        }
        output.innerHTML = renderEventProposal(eventId, data);
    });

    container.querySelector('#case-key-query-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const caseId = container.querySelector('#case-key-existing-id').value.trim();
        const message = container.querySelector('#case-key-query-message');
        const output = container.querySelector('#case-key-query-output');
        message.className = 'text-sm text-gray-600';
        message.textContent = 'Consultando caso...';
        output.innerHTML = '';

        try {
            const snapshot = await getDoc(doc(db, 'casos', caseId));
            if (!snapshot.exists()) throw new Error('No existe un caso con ese ID.');
            message.className = 'text-sm text-emerald-700';
            message.textContent = 'Caso encontrado. Consultando relaciones...';
            output.innerHTML = renderOutput(caseId, snapshot.data(), buildDrivePath(caseId, snapshot.data()));
                        output.innerHTML = renderOutput(caseId, snapshot.data(), buildDrivePath(caseId, snapshot.data())) + '<button id="btn-download-case-report" class="mt-4 bg-white border border-emerald-300 text-emerald-800 font-semibold px-4 py-2 rounded-lg hover:bg-emerald-50" type="button"><i class="fas fa-download mr-2"></i>Descargar informe de consulta</button>';
                        container.querySelector('#btn-download-case-report').addEventListener('click', () => downloadJson(`informe-${caseId}.json`, {
                            schema_version: 'praxis.case.report.v1',
                            caso_id: caseId,
                            metadata: snapshot.data(),
                            relaciones: 'Consultar relaciones en la interfaz para obtener el estado actual',
                            generado_en: new Date().toISOString()
                        }));
                    container.querySelector('#btn-download-event-metadata').addEventListener('click', () => downloadJson(`metadata-evento-${eventId}.json`, {
                        schema_version: 'praxis.event.v1',
                        evento_id: eventId,
                        ...data,
                        estado: 'borrador',
                        importacion: {
                            requiere_autorizacion: true,
                            metodo: 'codigo_del_sistema_o_autenticacion',
                            contacto_si_no_hay_acceso: 'Coordinador o administrador de Praxis',
                            notas_plantilla: 'detectar_y_revisar_antes_de_publicar'
                        },
                        fuente: 'Propuesta local; no persistida'
                    }));
            const relationsOutput = document.createElement('div');
            relationsOutput.className = 'mt-4 text-sm';
            output.querySelector('section').appendChild(relationsOutput);
            await renderRelations(relationsOutput, caseId);
        } catch (error) {
            message.className = 'text-sm text-red-700';
            message.textContent = error.message || 'No fue posible consultar el caso.';
        }
    });

    container.querySelector('#btn-propose-access-key').addEventListener('click', () => {
        const type = container.querySelector('#case-access-key-type').value;
        const context = slugifyKey(container.querySelector('#case-access-key-context').value);
        const prefix = type === 'INSTRUCTOR' ? 'INS' : type === 'STAFF' ? 'STF' : 'PAR';
        const candidate = randomAccessKey(prefix);
        container.querySelector('#case-access-key-output').textContent = context ? `${candidate} · contexto: ${context}` : candidate;
    });

    const showKeyPanel = (panel) => {
        container.querySelectorAll('[data-key-panel-content]').forEach((element) => {
            element.classList.toggle('hidden', element.dataset.keyPanelContent !== panel);
        });
        container.querySelectorAll('.key-panel-button').forEach((button) => {
            const selected = button.dataset.keyPanel === panel;
            button.classList.toggle('bg-indigo-100', selected);
            button.classList.toggle('text-indigo-900', selected);
            button.classList.toggle('font-semibold', selected);
            button.classList.toggle('text-slate-700', !selected);
            button.setAttribute('aria-selected', String(selected));
        });
    };

    container.querySelectorAll('.key-panel-button').forEach((button) => {
        button.addEventListener('click', () => showKeyPanel(button.dataset.keyPanel));
    });
}

async function loadEventCases(container) {
    const select = container.querySelector('#event-key-cases');
    try {
        const snapshot = await getDocs(collection(db, 'casos'));
        const cases = snapshot.docs
            .map((caseSnapshot) => ({ id: caseSnapshot.id, ...caseSnapshot.data() }))
            .filter((caso) => caso.estado === 'publicado')
            .sort((left, right) => String(left.titulo || left.id).localeCompare(String(right.titulo || right.id)));
        select.innerHTML = cases.length
            ? cases.map((caso) => `<option value="${caso.id}">${caso.id} — ${caso.titulo || 'Caso sin título'}</option>`).join('')
            : '<option value="">No hay casos publicados disponibles</option>';
    } catch (error) {
        select.innerHTML = '<option value="">No fue posible cargar los casos</option>';
    }
}