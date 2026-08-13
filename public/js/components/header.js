export function renderHeader(estado = 1, datosContexto = {}) {
    const container = document.getElementById('header-container');
    if (!container) return;
    
    if (estado === 1) {
        // Estado 1: Catálogo General + Visiones futuras deshabilitadas
        container.innerHTML = `
            <header class="bg-white border-b border-gray-200 py-4 px-6 mb-8 shadow-sm">
                <div class="max-w-6xl mx-auto flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <button id="btn-home" type="button" class="text-xl font-extrabold text-indigo-900 hover:text-indigo-700 transition" aria-label="Ir al inicio">Praxis / SIM-POCUS</button>
                    </div>
                    <nav class="hidden md:flex items-center space-x-6 text-sm font-semibold">
                        <button id="btn-catalog" type="button" class="text-indigo-600 border-b-2 border-indigo-600 pb-1 cursor-pointer" aria-label="Abrir catálogo">Catálogo</button>
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
                        <button id="btn-home" type="button" class="font-bold text-sm tracking-wide hover:text-indigo-200 transition" aria-label="Salir al inicio">SIM-POCUS</button>
                        <span class="bg-indigo-800 px-3 py-1 rounded text-xs text-indigo-200">Evento: ${datosContexto.eventoId || 'SIM-CONG-2026'}</span>
                        ${datosContexto.accessMode ? `<span class="bg-indigo-800 px-3 py-1 rounded text-xs text-indigo-200">Acceso: ${datosContexto.accessMode === 'staff' ? 'Staff' : 'Participante'}</span>` : ''}
                        ${datosContexto.stationName ? `<span class="bg-indigo-800 px-3 py-1 rounded text-xs text-indigo-200">${datosContexto.stationName}</span>` : ''}
                        ${datosContexto.role ? `<span class="bg-indigo-800 px-3 py-1 rounded text-xs text-indigo-200">Rol: ${datosContexto.role}</span>` : ''}
                    </div>
                    <div class="flex items-center space-x-3">
                        <button id="btn-salir-evento" class="text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition">
                            Salir del evento
                        </button>
                    </div>
                </div>
            </header>
        `;
    }
}