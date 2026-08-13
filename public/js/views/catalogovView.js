import { db } from '../firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

export async function renderCatalogoView(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="text-center py-12 text-gray-500"><i class="fas fa-spinner fa-spin mr-2"></i> Cargando banco general de casos...</div>`;

    try {
        const querySnapshot = await getDocs(collection(db, "casos"));
        if (querySnapshot.empty) {
            container.innerHTML = `<div class="bg-white p-6 rounded-xl border border-gray-200 text-gray-600">No hay casos publicados todavía.</div>`;
            return;
        }

        let html = `
            <div class="mb-6">
                <h1 class="text-3xl font-bold text-indigo-900">Banco General Praxis</h1>
                <p class="text-gray-600 mt-1">Explora los reportes y guiones de simulación disponibles.</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        `;

        querySnapshot.forEach((doc) => {
            const caso = doc.data();
            html += `
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between card hover:shadow-md">
                    <div>
                        <span class="inline-block px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded mb-2">${caso.especialidad || 'Sin especialidad'}</span>
                        <h3 class="text-lg font-bold text-indigo-900 mb-2">${caso.titulo || 'Caso sin título'}</h3>
                        <p class="text-sm text-gray-600 mb-4">${caso.resumen_publico || 'Sin resumen público disponible.'}</p>
                    </div>
                    <button class="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 rounded-lg transition" data-caso-id="${doc.id}">
                        Ver Caso
                    </button>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;

    } catch (error) {
        console.error("Error al cargar catálogo:", error);
        container.innerHTML = `<div class="bg-red-50 text-red-700 p-4 rounded-lg">Error al conectar con la base de datos de Firebase.</div>`;
    }
}