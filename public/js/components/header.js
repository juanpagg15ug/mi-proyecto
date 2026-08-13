export function renderHeader(estado = 1, datosContexto = {}) {
    const container = document.getElementById('header-container');
    if (!container) return;
    
    if (estado === 1) {
        // Estado 1: Catálogo General + Visiones futuras deshabilitadas
        container.innerHTML = `
            <header class="bg-white border-b border-gray-200 py-4 px-6 mb-8 shadow-sm">
                <div class="max-w-6xl mx-auto flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <span class="text-xl font-extrabold text-indigo-900">Praxis / SIM-POCUS</span>
                    </div>
                    <nav class="hidden md:flex items-center space-x-6 text-sm font-semibold">
                        <span class="text-indigo-600 border-b-2 border-indigo-600 pb-1 cursor-pointer">Catálogo</span>
                        <a href="#evento" id="btn-ingresar-evento" class="text-gray-600 hover:text-indigo-900 transition">Ingresar a evento</a>
                        <span class="text-gray-300 cursor-not-allowed" title="Próximamente">Panel admin · Analítica</span>
                    </nav>
                </div>
            </header>
        `;
    } else if (estado === 3) {
        // Estado 3: Evento Activo (Modo Dashboard Simplificado)
        container.innerHTML = `
            <header class="bg-indigo-900 text-white py-3 px-6 mb-8 shadow-md">
                <div class="max-w-6xl mx-auto flex items-center justify-between">
                    <div class="flex items-center space-x-4">
                        <span class="font-bold text-sm tracking-wide">SIM-POCUS</span>
                        <span class="bg-indigo-800 px-3 py-1 rounded text-xs text-indigo-200">Evento: ${datosContexto.eventoId || 'SIM-CONG-2026'}</span>
                    </div>
                    <div class="flex items-center space-x-3">
                        <select id="station-selector" class="bg-indigo-800 text-white text-xs p-2 rounded border border-indigo-700 outline-none">
                            <option value="">[Estación ▾]</option>
                        </select>
                        <button id="btn-salir-evento" class="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition">
                            Salir del evento
                        </button>
                    </div>
                </div>
            </header>
        `;
    }
}