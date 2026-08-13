import { renderHeader } from './components/header.js';
import { renderCatalogoView } from './views/catalogovView.js';
import { renderCalculatorView } from './views/calculatorView.js';

function renderModuleSelector() {
    const container = document.getElementById('app-container');
    container.innerHTML = `
        <section class="max-w-3xl mx-auto py-12">
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-indigo-900">Selecciona un módulo</h1>
                <p class="text-gray-600 mt-2">Accede al catálogo de casos o a la calculadora de priorización.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button id="btn-open-catalog" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left hover:border-indigo-400 hover:shadow-md transition">
                    <i class="fas fa-book-open text-indigo-600 text-2xl mb-4"></i>
                    <h2 class="text-xl font-bold text-indigo-900">Catálogo de casos</h2>
                    <p class="text-sm text-gray-600 mt-2">Explora los reportes y guiones disponibles en Firestore.</p>
                </button>
                <button id="btn-open-calculator" class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-left hover:border-fuchsia-400 hover:shadow-md transition">
                    <i class="fas fa-calculator text-fuchsia-600 text-2xl mb-4"></i>
                    <h2 class="text-xl font-bold text-indigo-900">Calculadora Praxis</h2>
                    <p class="text-sm text-gray-600 mt-2">Calcula valor, esfuerzo y recomendación de priorización.</p>
                </button>
            </div>
        </section>
    `;
}

function renderCatalog() {
    renderHeader(1);
    renderCatalogoView('app-container');
}

function renderCalculator() {
    renderHeader(1);
    renderCalculatorView('app-container');
}

document.addEventListener('DOMContentLoaded', () => {
    renderHeader(1);
    renderModuleSelector();

    document.body.addEventListener('click', (e) => {
        const target = e.target.closest('[id]');
        if (!target) return;

        if (target.id === 'btn-open-catalog') {
            renderCatalog();
        } else if (target.id === 'btn-open-calculator') {
            renderCalculator();
        } else if (target.id === 'btn-ingresar-evento') {
            e.preventDefault();
            renderHeader(3, { eventoId: 'SIM-CONG-2026' });
            document.getElementById('app-container').innerHTML = `
                <div class="bg-white p-8 rounded-xl shadow-sm border text-center max-w-md mx-auto mt-12">
                    <h2 class="text-xl font-bold text-indigo-900 mb-4">Modo Evento Activo</h2>
                    <p class="text-sm text-gray-600 mb-6">Selecciona una estación en la barra superior para desplegar la vista adaptativa por rol.</p>
                </div>
            `;
        } else if (target.id === 'btn-salir-evento') {
            e.preventDefault();
            renderHeader(1);
            renderModuleSelector();
        }
    });
});