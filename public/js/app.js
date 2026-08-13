import { renderHeader } from './components/header.js';
import { renderCatalogoView } from './views/catalogovView.js';
import { renderCalculatorView } from './views/calculatorView.js';
import { renderCaseDetailView } from './views/caseDetailView.js';
import { renderEventEntry, renderEventView } from './views/eventView.js';

let navigationToken = 0;

function startView() {
    const container = document.getElementById('app-container');
    const token = String(++navigationToken);
    container.dataset.viewToken = token;
    return token;
}

function renderModuleSelector() {
    const container = document.getElementById('app-container');
    startView();
    container.innerHTML = `
        <section class="max-w-3xl mx-auto py-12">
            <div class="mb-8">
                <span class="text-xs font-bold uppercase tracking-wide text-indigo-600">Plataforma de simulación</span>
                <h1 class="text-3xl font-bold text-indigo-900 mt-2">¿Qué necesitas hacer?</h1>
                <p class="text-gray-600 mt-2">Explora casos o entra directamente a un evento.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button id="btn-open-catalog" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left hover:border-indigo-400 hover:shadow-md transition">
                    <i class="fas fa-book-open text-indigo-600 text-2xl mb-4"></i>
                    <h2 class="text-xl font-bold text-indigo-900">Catálogo de casos</h2>
                    <p class="text-sm text-gray-600 mt-2">Explora los reportes y guiones disponibles en Firestore.</p>
                </button>
                <button id="btn-open-event" class="bg-indigo-900 p-6 rounded-xl shadow-sm text-left text-white hover:bg-indigo-800 transition">
                    <i class="fas fa-qrcode text-indigo-200 text-2xl mb-4"></i>
                    <h2 class="text-xl font-bold">Ingresar a evento</h2>
                    <p class="text-sm text-indigo-200 mt-2">Usa el código del evento para cargar estaciones y rol.</p>
                </button>
            </div>
            <button id="btn-open-calculator" type="button" class="mt-6 text-sm font-semibold text-gray-500 hover:text-indigo-700">Abrir herramienta de priorización</button>
        </section>
    `;
}

function focusApp() {
    document.getElementById('app-container')?.focus();
}

function renderCatalog() {
    const token = startView();
    renderHeader(1);
    renderCatalogoView('app-container', { token });
    focusApp();
}

function renderCalculator() {
    startView();
    renderHeader(1);
    renderCalculatorView('app-container');
    focusApp();
}

function renderCaseDetail(casoId) {
    const token = startView();
    renderHeader(1);
    renderCaseDetailView('app-container', casoId, { token, context: 'catalog', onBack: () => renderCatalog() });
    focusApp();
}

function renderEventEntryView() {
    startView();
    renderHeader(1);
    renderEventEntry('app-container', (access) => renderEvent(access));
    focusApp();
}

function renderEvent(access) {
    const eventCode = access.eventCode;
    const eventToken = startView();
    renderHeader(3, { eventoId: eventCode, accessMode: access.accessMode });
    renderEventView('app-container', eventCode, access, (casoId, role, code, stationId, stationName, accessMode, timerMinutes) => {
        const caseToken = startView();
        renderHeader(3, { eventoId: code, role, stationName, accessMode });
        renderCaseDetailView('app-container', casoId, {
            role,
            context: 'event',
            backLabel: 'Volver a estaciones',
            stationId,
            stationName,
            timerMinutes: accessMode === 'participant' ? timerMinutes : null,
            token: caseToken,
            onBack: () => renderEvent(access)
        });
        focusApp();
    }, { token: eventToken });
    focusApp();
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader(1);
    renderModuleSelector();

    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[id], [data-caso-id]');
        if (!target) return;

        if (target.dataset.casoId && target.dataset.source === 'catalog') {
            renderCaseDetail(target.dataset.casoId);
        } else if (target.id === 'btn-open-catalog') {
            renderCatalog();
        } else if (target.id === 'btn-open-calculator') {
            renderCalculator();
        } else if (target.id === 'btn-open-event') {
            renderEventEntryView();
        } else if (target.id === 'btn-home' || target.id === 'btn-back-home') {
            renderHeader(1);
            renderModuleSelector();
            focusApp();
        } else if (target.id === 'btn-catalog') {
            renderCatalog();
        } else if (target.id === 'btn-ingresar-evento') {
            e.preventDefault();
            renderEventEntryView();
        } else if (target.id === 'btn-salir-evento') {
            e.preventDefault();
            renderHeader(1);
            renderModuleSelector();
        }
    });
});