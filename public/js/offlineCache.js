const CACHE_PREFIX = 'praxis-event-cache:';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function cacheKey(scope, id) {
    return `${CACHE_PREFIX}${scope}:${id}`;
}

export function saveOffline(scope, id, value) {
    try {
        localStorage.setItem(cacheKey(scope, id), JSON.stringify({
            savedAt: Date.now(),
            value
        }));
    } catch (error) {
        console.warn('No fue posible guardar el respaldo local:', error);
    }
}

export function readOffline(scope, id) {
    try {
        const raw = localStorage.getItem(cacheKey(scope, id));
        if (!raw) return null;

        const cached = JSON.parse(raw);
        if (!cached.savedAt || Date.now() - cached.savedAt > CACHE_TTL_MS) {
            localStorage.removeItem(cacheKey(scope, id));
            return null;
        }
        return cached.value;
    } catch (error) {
        console.warn('No fue posible leer el respaldo local:', error);
        return null;
    }
}

export function offlineNotice() {
    return `<div class="offline-notice bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-lg mb-6" role="status"><i class="fas fa-wifi-slash mr-2"></i>Modo respaldo: conexión no disponible. Se muestra la última información cargada.</div>`;
}
