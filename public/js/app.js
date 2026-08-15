import { renderHeader } from './components/header.js';
import { renderCatalogoView } from './views/catalogovView.js';
import { renderCalculatorView } from './views/calculatorView.js';
import { renderCaseDetailView } from './views/caseDetailView.js';
import { renderEventEntry, renderEventView } from './views/eventView.js';
import { renderResourcesView } from './views/resourcesView.js';
import { renderCaseKeyGeneratorView } from './views/caseKeyGeneratorView.js';

let navigationToken = 0;
let eventSessionActive = false;

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
                <button id="btn-open-resources" class="bg-emerald-50 p-6 rounded-xl shadow-sm border border-emerald-200 text-left hover:border-emerald-400 hover:shadow-md transition">
                    <i class="fas fa-compass text-emerald-700 text-2xl mb-4"></i>
                    <h2 class="text-xl font-bold text-emerald-950">Centro de recursos</h2>
                    <p class="text-sm text-emerald-800 mt-2">Blueprints, guías y herramientas para preparar casos y accesos.</p>
                </button>
            </div>
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

function renderResources() {
    const token = startView();
    renderHeader(1);
    renderResourcesView('app-container', {
        token,
        onBack: () => renderModuleSelector(),
        onOpenCalculator: () => renderCalculator(),
        onOpenKeyGenerator: () => renderCaseKeyGenerator()
    });
    focusApp();
}

function renderCaseKeyGenerator() {
    startView();
    renderHeader(1);
    renderCaseKeyGeneratorView('app-container', { onBack: () => renderModuleSelector() });
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

function confirmEventExit() {
    if (!eventSessionActive) return Promise.resolve(true);

    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.id = 'event-exit-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'event-exit-title');
        modal.innerHTML = `
            <div class="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <h2 id="event-exit-title" class="text-xl font-bold text-indigo-900">¿Salir del evento?</h2>
                <p class="mt-2 text-sm leading-6 text-gray-600">Perderás el contexto actual de la estación y, si hay un cronómetro activo, su tiempo. Podrás volver a entrar con el código del evento.</p>
                <div class="mt-6 flex justify-end gap-3">
                    <button id="cancel-event-exit" type="button" class="rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">Continuar en el evento</button>
                    <button id="confirm-event-exit" type="button" class="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700">Salir del evento</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const close = (shouldExit) => {
            modal.remove();
            resolve(shouldExit);
        };
        modal.querySelector('#cancel-event-exit').addEventListener('click', () => close(false));
        modal.querySelector('#confirm-event-exit').addEventListener('click', () => close(true));
        modal.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') close(false);
        });
        modal.querySelector('#cancel-event-exit').focus();
    });
}

async function exitEvent() {
    if (!await confirmEventExit()) return;
    eventSessionActive = false;
    renderHeader(1);
    renderModuleSelector();
    focusApp();
}

function renderEvent(access) {
    const eventCode = access.eventCode;
    eventSessionActive = true;
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

    window.addEventListener('beforeunload', (event) => {
        if (!eventSessionActive) return;
        event.preventDefault();
        event.returnValue = '';
    });

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
        } else if (target.id === 'btn-open-resources') {
            renderResources();
        } else if (target.id === 'btn-home' || target.id === 'btn-back-home') {
            if (target.id === 'btn-home' && eventSessionActive) {
                exitEvent();
                return;
            }
            renderHeader(1);
            renderModuleSelector();
            focusApp();
        } else if (target.id === 'btn-catalog') {
            renderCatalog();
        } else if (target.id === 'btn-resources') {
            renderResources();
        } else if (target.id === 'btn-ingresar-evento') {
            e.preventDefault();
            renderEventEntryView();
        } else if (target.id === 'btn-salir-evento') {
            e.preventDefault();
            exitEvent();
        }
    });
});