import { db } from '../firebase-config.js';
import { offlineNotice, readOffline, saveOffline } from '../offlineCache.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

const tabs = [
    { id: 'clinica', label: 'Clínica', source: 'lectura', fields: ['contenido', 'ficha_tecnica', 'vignette_estudiante'] },
    { id: 'simtech', label: 'SimTech', source: 'escenario', fields: ['contenido', 'script_desarrollo', 'guion_actor'] },
    { id: 'debriefing', label: 'Debriefing', source: 'debriefing', fields: ['contenido', 'debriefing', 'checklist'] }
];

const roleTabs = {
    actor: [{ id: 'actor', label: 'Actor', source: 'escenario', fields: ['guion_actor'] }],
    simtech: [{ id: 'simtech', label: 'SimTech', source: 'escenario', fields: ['script_desarrollo'] }]
};

let activeTimer = null;

function getTabValue(content, tab, role) {
    const source = content[tab.source] || {};
    let fields = tab.fields;

    if (tab.id === 'clinica' && role === 'estudiante') {
        fields = ['vignette_estudiante', 'contenido', 'ficha_tecnica'];
    }

    return fields.map((field) => source[field]).find(Boolean);
}

function renderTabContent(content, activeTab, role) {
    const availableTabs = [...tabs, ...Object.values(roleTabs).flat()];
    const tab = availableTabs.find((item) => item.id === activeTab) || tabs[0];
    const value = getTabValue(content, tab, role);

    if (!value) {
        return `<div class="bg-gray-50 border border-gray-200 rounded-lg p-6 text-gray-600">Contenido no disponible para esta pestaña.</div>`;
    }

    return `<div class="bg-white border border-gray-200 rounded-lg p-6 whitespace-pre-wrap leading-7 text-gray-700">${value}</div>`;
}

function tabsForRole(role, isEvent, privateAccess) {
    if (!isEvent && privateAccess) return tabs;
    if (!isEvent || role === 'estudiante') return tabs.slice(0, 1);
    if (role === 'actor' || role === 'simtech') return roleTabs[role];
    return tabs;
}

function sectionIdsForRole(role, isEvent, privateAccess) {
    if (!isEvent && privateAccess) return ['lectura', 'escenario', 'debriefing'];
    if (!isEvent) return ['lectura'];
    if (role === 'estudiante') return ['lectura'];
    if (role === 'actor') return ['lectura', 'escenario'];
    if (role === 'simtech') return ['escenario'];
    return ['lectura', 'escenario', 'debriefing'];
}

function hasOperationalContent(content) {
    return Object.values(content).some((section) => Object.entries(section).some(([key, value]) => {
        return !['fuente_google_doc_id', 'fuente_google_doc_url', 'version', 'actualizado_en'].includes(key) && Boolean(value);
    }));
}

function missingContentSections(content, sectionIds) {
    return sectionIds.filter((sectionId) => {
        const section = content[sectionId] || {};
        return !Object.entries(section).some(([key, value]) => {
            return !['fuente_google_doc_id', 'fuente_google_doc_url', 'version', 'actualizado_en'].includes(key) && Boolean(value);
        });
    });
}

function renderSourceLinks(content, role, isEvent) {
    const labels = {
        lectura: 'Documento maestro de lectura',
        escenario: 'Documento maestro de escenario',
        debriefing: 'Documento maestro de debriefing'
    };
    const allowedSections = !isEvent || role === 'instructor'
        ? Object.keys(content)
        : role === 'estudiante'
            ? ['lectura']
            : role === 'actor'
                ? ['lectura', 'escenario']
                : role === 'simtech'
                    ? ['escenario']
                    : ['lectura'];
    const links = Object.entries(content).filter(([sectionId]) => allowedSections.includes(sectionId)).map(([sectionId, section]) => {
        const url = section.fuente_google_doc_url || section.fuente_google_drive_url;
        if (!url) return '';
        return `<a href="${url}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50"><i class="fab fa-google-drive text-green-700"></i>${labels[sectionId] || `Fuente de ${sectionId}`}</a>`;
    }).filter(Boolean);
    if (!links.length) return '';
    return `<div class="mt-5"><p class="text-xs font-bold uppercase tracking-wide text-gray-500 mb-2">Fuente editorial</p><div class="flex flex-wrap gap-2">${links.join('')}</div><p class="text-xs text-gray-500 mt-2">El contenido mostrado en la plataforma corresponde al snapshot publicado en Firestore.</p></div>`;
}

export async function renderCaseDetailView(containerId, casoId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || !casoId) return;

    if (activeTimer) {
        clearInterval(activeTimer);
        activeTimer = null;
    }

    container.innerHTML = `<div class="text-center py-12 text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Cargando caso...</div>`;

    try {
        const isEvent = options.context === 'event';
        const sectionIds = sectionIdsForRole(options.role, isEvent, options.privateAccess);
        let caso;
        let offlineMode = false;
        try {
            const casoSnapshot = await getDoc(doc(db, 'casos', casoId));
            if (!casoSnapshot.exists()) {
                container.innerHTML = `<div class="bg-red-50 text-red-700 p-6 rounded-lg">El caso solicitado no existe.</div>`;
                return;
            }
            caso = casoSnapshot.data();
            caso.id = casoId;
            saveOffline('case-meta', casoId, caso);
        } catch (error) {
            caso = readOffline('case-meta', casoId);
            if (!caso) throw error;
            caso.id = casoId;
            offlineMode = true;
        }
        if (options.token && container.dataset.viewToken !== options.token) return;
        let content;
        try {
            const sectionSnapshots = await Promise.all(sectionIds.map((sectionId) => getDoc(doc(db, 'casos_contenido', casoId, 'secciones', sectionId))));
            content = Object.fromEntries(sectionIds.map((sectionId, index) => [sectionId, sectionSnapshots[index].exists() ? sectionSnapshots[index].data() : {}]));
            saveOffline('case-content', `${casoId}:${options.role || 'public'}`, content);
        } catch (error) {
            content = readOffline('case-content', `${casoId}:${options.role || 'public'}`);
            if (!content) throw error;
            offlineMode = true;
        }
        if (options.token && container.dataset.viewToken !== options.token) return;
        if (!hasOperationalContent(content)) {
            const missingSections = missingContentSections(content, sectionIds);
            const expectedPaths = missingSections.map((sectionId) => `casos_contenido/${casoId}/secciones/${sectionId}`);
            container.innerHTML = `
                <section class="max-w-4xl mx-auto py-6">
                    ${offlineMode ? offlineNotice() : ''}
                    <button id="btn-back-catalog" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button">
                        <i class="fas fa-arrow-left mr-2"></i>${options.backLabel || 'Volver al catálogo'}
                    </button>
                    <div class="bg-amber-50 border border-amber-200 rounded-lg p-6 text-amber-900">
                        <h1 class="text-xl font-bold">Contenido del caso pendiente</h1>
                        <p class="mt-2">La metadata de <span class="font-mono">casos/${casoId}</span> existe, pero las secciones que necesita esta vista todavía no tienen contenido utilizable.</p>
                        <div class="mt-4 text-sm">
                            <p class="font-semibold">Rutas que debes completar:</p>
                            <ul class="list-disc pl-5 mt-2 space-y-1">${expectedPaths.map((path) => `<li class="font-mono break-all">${path}</li>`).join('')}</ul>
                        </div>
                        <p class="mt-4 text-sm">Las plantillas Word del Centro de recursos no se copian automáticamente a Firestore. Debes transcribir o revisar el contenido del caso y guardarlo con los nombres de campo del contrato.</p>
                    </div>
                </section>
            `;
            container.querySelector('#btn-back-catalog').addEventListener('click', () => options.onBack?.());
            return;
        }
        const visibleTabs = tabsForRole(options.role, isEvent, options.privateAccess);
        const activeTab = visibleTabs[0].id;
        const backLabel = options.backLabel || 'Volver al catálogo';

        container.innerHTML = `
            <section class="max-w-4xl mx-auto py-6">
                ${offlineMode ? offlineNotice() : ''}
                <button id="btn-back-catalog" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button">
                    <i class="fas fa-arrow-left mr-2"></i>${backLabel}
                </button>
                <div class="mb-8">
                    <div class="flex flex-wrap gap-2 mb-3">
                        <span class="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded">${caso.especialidad || 'Sin especialidad'}</span>
                        ${caso.tipo ? `<span class="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded">${caso.tipo}</span>` : ''}
                        ${caso.eje_transversal ? `<span class="inline-block px-2 py-1 bg-fuchsia-50 text-fuchsia-700 text-xs font-bold rounded">${caso.eje_transversal}</span>` : ''}
                    </div>
                    <h1 class="text-3xl font-bold text-indigo-900">${caso.titulo || 'Caso sin título'}</h1>
                    <p class="text-gray-600 mt-2">${caso.resumen_publico || 'Sin resumen público disponible.'}</p>
                    ${renderSourceLinks(content, options.role, isEvent)}
                    ${options.role ? `<div class="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-800 text-sm font-semibold"><i class="fas fa-user-tag"></i> Vista activa: ${options.role}</div>` : ''}
                    ${!isEvent && options.privateAccess ? '<div class="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-800 text-sm font-semibold"><i class="fas fa-lock-open"></i> Acceso instructor activo</div>' : ''}
                    ${options.role === 'estudiante' && options.timerMinutes ? `<div class="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 text-amber-800 text-sm font-semibold"><i class="fas fa-clock"></i> Tiempo restante: <span id="student-timer">${formatTime(options.timerMinutes * 60)}</span></div>` : ''}
                    ${isEvent ? '<button id="btn-print-station" class="no-print mt-4 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50" type="button"><i class="fas fa-print mr-2"></i>Guardar respaldo PDF</button>' : ''}
                    ${!isEvent && !options.privateAccess ? '<button id="btn-instructor-access" class="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg" type="button"><i class="fas fa-key mr-2"></i>Acceso instructor</button>' : ''}
                </div>
                <div class="border-b border-gray-200 mb-6 flex gap-6" role="tablist" aria-label="Contenido del caso">
                    ${visibleTabs.map((tab, index) => `<button type="button" class="case-tab py-3 text-sm font-semibold ${index === 0 ? 'text-indigo-700 border-b-2 border-indigo-600' : 'text-gray-500'}" data-tab="${tab.id}" role="tab" aria-selected="${index === 0}">${tab.label}</button>`).join('')}
                </div>
                <div id="case-tab-content" aria-live="polite">${renderTabContent(content, activeTab, options.role)}</div>
            </section>
        `;

        container.querySelectorAll('.case-tab').forEach((button) => {
            button.addEventListener('click', () => {
                const selectedTab = button.dataset.tab;
                container.querySelectorAll('.case-tab').forEach((tabButton) => {
                    const selected = tabButton === button;
                    tabButton.classList.toggle('text-indigo-700', selected);
                    tabButton.classList.toggle('border-b-2', selected);
                    tabButton.classList.toggle('border-indigo-600', selected);
                    tabButton.classList.toggle('text-gray-500', !selected);
                    tabButton.setAttribute('aria-selected', String(selected));
                });
                container.querySelector('#case-tab-content').innerHTML = renderTabContent(content, selectedTab, options.role);
            });
        });

        container.querySelector('#btn-back-catalog').addEventListener('click', () => {
            if (options.onBack) options.onBack();
        });
        container.querySelector('#btn-print-station')?.addEventListener('click', () => window.print());
        container.querySelector('#btn-instructor-access')?.addEventListener('click', () => {
            const dialog = document.createElement('div');
            dialog.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4';
            dialog.setAttribute('role', 'dialog');
            dialog.setAttribute('aria-modal', 'true');
            dialog.setAttribute('aria-labelledby', 'instructor-access-title');
            dialog.innerHTML = `
                <form id="instructor-access-form" class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                    <h2 id="instructor-access-title" class="text-xl font-bold text-indigo-900">Acceso instructor</h2>
                    <p class="mt-2 text-sm leading-6 text-gray-600">Este acceso permite revisar las secciones operativas de este caso fuera de un evento. En este PMV el código controla la interfaz; no sustituye autenticación.</p>
                    <label for="instructor-access-code" class="block text-sm font-semibold text-gray-700 mt-5 mb-2">Código de acceso</label>
                    <input id="instructor-access-code" type="password" class="w-full p-3 border border-gray-300 rounded-lg" autocomplete="off" required>
                    <p id="instructor-access-error" class="text-sm text-red-700 mt-3 hidden" aria-live="polite"></p>
                    <div class="flex justify-end gap-3 mt-6">
                        <button id="cancel-instructor-access" type="button" class="border border-gray-300 px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-gray-50">Cancelar</button>
                        <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold">Continuar</button>
                    </div>
                </form>
            `;
            document.body.appendChild(dialog);
            const close = () => dialog.remove();
            dialog.querySelector('#cancel-instructor-access').addEventListener('click', close);
            dialog.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') close();
            });
            dialog.querySelector('#instructor-access-form').addEventListener('submit', (event) => {
                event.preventDefault();
                const code = dialog.querySelector('#instructor-access-code').value.trim();
                const error = dialog.querySelector('#instructor-access-error');
                if (code !== String(caso.codigo_instructor || '').trim()) {
                    error.textContent = 'El código de acceso no coincide.';
                    error.classList.remove('hidden');
                    return;
                }
                close();
                renderCaseDetailView(containerId, casoId, {
                    ...options,
                    privateAccess: true
                });
            });
            dialog.querySelector('#instructor-access-code').focus();
        });

        if (options.role === 'estudiante' && options.timerMinutes) {
            let secondsLeft = Math.max(0, Math.round(options.timerMinutes * 60));
            activeTimer = setInterval(() => {
                secondsLeft -= 1;
                const timer = container.querySelector('#student-timer');
                if (!timer) return;
                timer.textContent = formatTime(Math.max(0, secondsLeft));
                if (secondsLeft <= 0) {
                    clearInterval(activeTimer);
                    activeTimer = null;
                    timer.parentElement.classList.remove('bg-amber-50', 'text-amber-800');
                    timer.parentElement.classList.add('bg-red-50', 'text-red-800');
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Error al cargar el caso:', error);
        container.innerHTML = `<div class="bg-red-50 text-red-700 p-6 rounded-lg">No fue posible cargar el caso.</div>`;
    }
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}
