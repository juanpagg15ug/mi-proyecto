import { db } from '../firebase-config.js';
import { offlineNotice, readOffline, saveOffline } from '../offlineCache.js';
import { collection, doc, getDoc, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

function normalizeCode(value) {
    return String(value || '').trim().replace(/\s+/g, '').toUpperCase();
}

function getCaseId(station) {
    const relation = station.caso_id;
    if (typeof relation === 'string') return relation.trim();
    if (relation && typeof relation === 'object' && relation.id) return relation.id;
    return '';
}

export function renderEventEntry(containerId, onSubmit) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
        <section class="max-w-xl mx-auto py-12">
            <button id="btn-back-home" class="text-sm font-semibold text-indigo-700 hover:text-indigo-900 mb-6" type="button">
                <i class="fas fa-arrow-left mr-2"></i>Volver al inicio
            </button>
            <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h1 class="text-2xl font-bold text-indigo-900">Entrar a un evento</h1>
                <p class="text-gray-600 mt-2 mb-6">Elige tu tipo de acceso. El staff necesita además su código privado.</p>
                <div class="flex gap-2 mb-6" role="tablist" aria-label="Tipo de acceso">
                    <button id="access-participant" type="button" class="access-mode flex-1 p-3 rounded-lg border border-indigo-600 bg-indigo-50 text-indigo-800 font-semibold" aria-selected="true">Participante</button>
                    <button id="access-staff" type="button" class="access-mode flex-1 p-3 rounded-lg border border-gray-300 text-gray-600 font-semibold" aria-selected="false">Staff</button>
                </div>
                <form id="event-code-form" class="space-y-4">
                    <label for="event-code" class="block text-sm font-semibold text-gray-700">Código del evento</label>
                    <input id="event-code" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Ej. SIM-CONG-2026" autocomplete="off" required>
                    <div id="staff-code-field" class="hidden">
                        <label for="staff-code" class="block text-sm font-semibold text-gray-700 mb-2">Código privado del staff</label>
                        <input id="staff-code" class="w-full p-3 border border-gray-300 rounded-lg" placeholder="Código privado" autocomplete="off">
                    </div>
                    <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-lg" type="submit">Entrar</button>
                </form>
                <p id="event-entry-error" class="text-red-700 text-sm mt-4 hidden" aria-live="polite"></p>
            </div>
        </section>
    `;

    let accessMode = 'participant';
    const setAccessMode = (mode) => {
        accessMode = mode;
        const isStaff = mode === 'staff';
        container.querySelector('#staff-code-field').classList.toggle('hidden', !isStaff);
        container.querySelector('#staff-code').required = isStaff;
        container.querySelectorAll('.access-mode').forEach((button) => {
            const selected = button.id === `access-${mode}`;
            button.classList.toggle('border-indigo-600', selected);
            button.classList.toggle('bg-indigo-50', selected);
            button.classList.toggle('text-indigo-800', selected);
            button.classList.toggle('border-gray-300', !selected);
            button.classList.toggle('text-gray-600', !selected);
            button.setAttribute('aria-selected', String(selected));
        });
    };

    container.querySelector('#access-participant').addEventListener('click', () => setAccessMode('participant'));
    container.querySelector('#access-staff').addEventListener('click', () => setAccessMode('staff'));
    container.querySelector('#event-code-form').addEventListener('submit', (event) => {
        event.preventDefault();
        onSubmit({
            eventCode: container.querySelector('#event-code').value.trim(),
            accessMode,
            staffCode: container.querySelector('#staff-code').value.trim()
        });
    });
}

export async function renderEventView(containerId, eventCode, access = {}, onOpenStation, options = {}) {
    const container = document.getElementById(containerId);
    if (!container || !eventCode) return;

    container.innerHTML = `<div class="text-center py-12 text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Cargando evento...</div>`;

    try {
        const requestedEventCode = String(eventCode).trim();
        let resolvedEventCode = requestedEventCode;
        let offlineMode = false;
        let event;
        let stations;
        try {
            let eventSnapshot = await getDoc(doc(db, 'eventos', requestedEventCode));
            if (!eventSnapshot.exists() && requestedEventCode !== normalizeCode(requestedEventCode)) {
                resolvedEventCode = normalizeCode(requestedEventCode);
                eventSnapshot = await getDoc(doc(db, 'eventos', resolvedEventCode));
            }
            if (!eventSnapshot.exists()) {
                container.innerHTML = `<div class="bg-red-50 text-red-700 p-6 rounded-lg">No existe un evento con ese código.</div>`;
                return;
            }
            event = eventSnapshot.data();
            const stationSnapshot = await getDocs(collection(db, 'eventos', resolvedEventCode, 'estaciones'));
            stations = stationSnapshot.docs
                .map((station) => {
                    const data = station.data();
                    return { id: station.id, ...data, casoId: getCaseId(data) };
                })
                .sort((left, right) => (left.orden || 0) - (right.orden || 0));
            saveOffline('event', resolvedEventCode, { event, stations });
        } catch (error) {
            const cached = readOffline('event', normalizeCode(requestedEventCode));
            if (!cached) throw error;
            resolvedEventCode = normalizeCode(requestedEventCode);
            event = cached.event;
            stations = cached.stations || [];
            offlineMode = true;
        }
        if (options.token && container.dataset.viewToken !== options.token) return;

        const accessMode = access.accessMode || 'participant';
        const isStaff = accessMode === 'staff';
        const staffCode = event.codigo_staff || '';
        if (isStaff && !staffCode) {
            container.innerHTML = `<div class="bg-red-50 text-red-700 p-6 rounded-lg">Este evento no tiene un código staff configurado.</div>`;
            return;
        }
        if (isStaff && normalizeCode(access.staffCode) !== normalizeCode(staffCode)) {
            container.innerHTML = `<div class="bg-red-50 text-red-700 p-6 rounded-lg">El código privado del staff no coincide con este evento.</div>`;
            return;
        }
        container.innerHTML = `
            <section class="max-w-3xl mx-auto py-8">
                ${offlineMode ? offlineNotice() : ''}
                <div class="mb-8">
                    <span class="text-xs font-bold uppercase tracking-wide text-indigo-600">Evento</span>
                    <h1 class="text-3xl font-bold text-indigo-900 mt-1">${event.nombre || eventCode}</h1>
                    <p class="text-gray-600 mt-2">Código de evento: ${resolvedEventCode}</p>
                    <div class="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-800 text-sm font-semibold"><i class="fas fa-key"></i> Acceso: ${accessMode === 'staff' ? 'Staff' : 'Participante'}</div>
                </div>
                <div class="bg-white p-6 rounded-xl border border-gray-200">
                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-gray-700 mb-2" for="event-role">Vista por rol</label>
                        ${isStaff ? `<select id="event-role" class="w-full p-3 border border-gray-300 rounded-lg" aria-describedby="event-role-help">
                            <option value="instructor">Instructor</option>
                            <option value="actor">Actor</option>
                            <option value="simtech">SimTech</option>
                        </select>` : `<div class="p-3 rounded-lg bg-gray-50 border border-gray-200 text-sm font-semibold text-gray-700">Estudiante</div>`}
                        <p id="event-role-help" class="text-sm text-gray-500 mt-2">${isStaff ? 'Código privado validado: selecciona una vista interna.' : 'Acceso de participante: vista de estudiante.'}</p>
                    </div>
                    <h2 class="text-lg font-bold text-indigo-900 mb-4">Estaciones</h2>
                    <div class="grid gap-3">
                        ${stations.length ? stations.map((station) => `
                            <button type="button" class="event-station text-left p-4 border border-gray-200 rounded-lg hover:border-indigo-400 hover:shadow-sm transition ${station.casoId ? '' : 'opacity-60'}" data-station-id="${station.id}" data-caso-id="${station.casoId}" data-duration-minutes="${station.duracion_minutos || event.duracion_minutos || 10}" ${station.casoId ? '' : 'disabled'}>
                                <span class="font-semibold text-indigo-900">${station.nombre || station.id}</span>
                                <span class="block text-sm text-gray-500 mt-1">${station.casoId ? `Estación ${station.orden || ''}` : 'Sin caso vinculado'}</span>
                            </button>
                        `).join('') : '<p class="text-gray-600">Este evento todavía no tiene estaciones.</p>'}
                    </div>
                </div>
            </section>
        `;

        container.querySelectorAll('.event-station').forEach((button) => {
            button.addEventListener('click', () => {
                const role = isStaff ? container.querySelector('#event-role').value : 'estudiante';
                onOpenStation(button.dataset.casoId, role, resolvedEventCode, button.dataset.stationId, button.querySelector('span')?.textContent || button.dataset.stationId, accessMode, Number(button.dataset.durationMinutes));
            });
        });
    } catch (error) {
        console.error('Error al cargar el evento:', error);
        container.innerHTML = `<div class="bg-red-50 text-red-700 p-6 rounded-lg">No fue posible cargar el evento.</div>`;
    }
}
