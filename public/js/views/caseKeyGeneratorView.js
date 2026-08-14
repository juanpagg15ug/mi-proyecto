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
                <p class="text-gray-600 mt-2">Prepara identificadores para casos y candidatos de acceso. Nada de lo generado aquí se guarda ni queda activo automáticamente.</p>
            </div>
            <form id="case-key-access-form" class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
                <div>
                    <label for="case-key-code" class="block text-sm font-semibold text-gray-700 mb-2">Código de acceso</label>
                    <input id="case-key-code" type="password" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Código privado" autocomplete="off" required>
                </div>
                <button class="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-4 py-3 rounded-lg" type="submit"><i class="fas fa-unlock mr-2"></i>Continuar</button>
                <p id="case-key-generator-message" class="text-sm hidden" aria-live="polite"></p>
            </form>
            <form id="case-key-generator-form" class="hidden bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 mt-6">
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
            <form id="case-key-query-form" class="hidden bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4 mt-6">
                <div>
                    <label for="case-key-existing-id" class="block text-sm font-semibold text-gray-700 mb-2">Consultar caso existente</label>
                    <input id="case-key-existing-id" class="w-full p-3 border border-gray-300 rounded-lg font-mono" placeholder="Ej. SIM-AN-2026-01" autocomplete="off" required>
                </div>
                <button class="w-full bg-slate-700 hover:bg-slate-800 text-white font-semibold px-4 py-3 rounded-lg" type="submit"><i class="fas fa-magnifying-glass mr-2"></i>Consultar caso y relaciones</button>
                <p id="case-key-query-message" class="text-sm" aria-live="polite"></p>
            </form>
            <section id="case-access-key-form" class="hidden bg-white border border-gray-200 rounded-xl p-6 shadow-sm mt-6" aria-labelledby="case-access-key-title">
                <h2 id="case-access-key-title" class="text-lg font-bold text-indigo-900">Proponer clave de acceso</h2>
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
            container.querySelector('#case-key-generator-form').classList.remove('hidden');
            container.querySelector('#case-key-query-form').classList.remove('hidden');
            container.querySelector('#case-access-key-form').classList.remove('hidden');
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
}