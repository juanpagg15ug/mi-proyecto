import { CALCULATOR_TEMPLATE } from './calculatorTemplate.js';

export function renderCalculatorView(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = CALCULATOR_TEMPLATE;
    bindCalculatorEvents();
    calculate();
}

function bindCalculatorEvents() {
    const inputs = document.querySelectorAll('.calc-input');
    inputs.forEach(input => {
        input.addEventListener('change', calculate);
        if (input.type === 'number') {
            input.addEventListener('input', calculate);
        }
    });

    document.getElementById('wsjf-header').addEventListener('click', toggleWsjf);
    document.getElementById('btn-print').addEventListener('click', () => window.print());
}

function calculate() {
    const a1 = getValue('a1');
    const a2 = getValue('a2');
    const b = getValue('b');
    const c = getValue('c');
    const d = getValue('d');
    const e = getValue('e');
    const sp = getValue('sp');
    const bv = (a1 * 5) + (a2 * 5) + (b * 3) + (c * 4) + (d * 4) + (e * 4);

    const bvScoreEl = document.getElementById('bvScore');
    const bvLabelEl = document.getElementById('bvLabel');
    let labelText = 'BAJO VALOR';
    let labelClass = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white';
    let activeQuad = 'q4';
    let recText = '🛑 DESCARTAR: Valor bajo. Probablemente no requiera simulación o no sea estratégico.';
    let recColor = 'bg-red-100 border-red-300 text-red-800';

    if (bv >= 80 && bv < 90 && sp === 1) {
        labelText = 'ALTO VALOR (FAST TRACK)';
        labelClass = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-600 text-white';
        activeQuad = 'q1';
        recText = '🚀 APROBADO (FAST TRACK): Reporte de alto valor (80-89) y esfuerzo trivial. ¡Hacer ya!';
        recColor = 'bg-green-100 border-green-300 text-green-800';
    } else if (bv >= 90 && sp <= 3) {
        labelText = 'ALTO VALOR (PRIORIDAD)';
        labelClass = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white';
        activeQuad = 'q1';
        recText = '✅ APROBADO: "Quick Win". Alta prioridad y bajo esfuerzo. Producir de inmediato.';
        recColor = 'bg-green-100 border-green-300 text-green-800';
    } else if (bv >= 90) {
        labelText = 'ALTO VALOR (PRIORIDAD)';
        labelClass = 'inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white';
        activeQuad = 'q2';
        recText = '🗓️ PLANIFICAR: "Proyecto Estratégico". Alta prioridad institucional pero requiere muchos recursos.';
        recColor = 'bg-blue-100 border-blue-300 text-blue-800';
    } else if (sp <= 3) {
        activeQuad = 'q3';
        recText = '📂 BANCO DE TAREAS: Valor medio. Producto válido. Útil para relleno de agenda.';
        recColor = 'bg-gray-100 border-gray-300 text-gray-800';
    }

    bvScoreEl.innerText = bv;
    bvLabelEl.innerText = labelText;
    bvLabelEl.className = labelClass;
    document.getElementById('spDisplay').innerText = sp;

    document.querySelectorAll('.quadrant').forEach(el => {
        el.classList.remove('active-quadrant', 'opacity-100', 'border-2', 'border-indigo-600');
        el.classList.add('opacity-50');
    });

    const activeEl = document.getElementById(activeQuad);
    activeEl.classList.remove('opacity-50');
    activeEl.classList.add('active-quadrant', 'opacity-100', 'border-indigo-600');

    document.getElementById('recommendationCard').className = `p-4 rounded-xl border ${recColor}`;
    document.getElementById('recommendationText').innerText = recText;

    const cod1 = getValue('cod1') || 0;
    const cod2 = getValue('cod2') || 0;
    const cod3 = getValue('cod3') || 0;
    document.getElementById('wsjfResult').innerText = (((cod1 + cod2 + cod3) / sp)).toFixed(1);
}

function getValue(id) {
    return parseInt(document.getElementById(id).value, 10);
}

function toggleWsjf() {
    const content = document.getElementById('wsjfContent');
    const icon = document.getElementById('wsjfIcon');
    content.classList.toggle('hidden');
    icon.classList.toggle('fa-chevron-down');
    icon.classList.toggle('fa-chevron-up');
}
