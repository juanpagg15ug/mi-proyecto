export const CALCULATOR_TEMPLATE = `
        <header class="mb-8 flex items-center justify-between">
            <div>
                <h1 class="text-3xl font-bold text-indigo-900">Calculadora Praxis v2.5</h1>
                <p class="text-gray-600 mt-1">Estrategia + Urgencia + Esfuerzo (Con Fast Track)</p>
            </div>
            <button id="btn-print" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition hidden md:block">
                <i class="fas fa-print mr-2"></i> Imprimir Reporte
            </button>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-6">
                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Nombre del Caso / Producto</label>
                    <input type="text" id="caseName" placeholder="Ej. Reporte de Caso: Dengue (Guía Rápida)" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none">
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 class="text-xl font-bold text-indigo-800 mb-4 border-b pb-2">1. Cálculo de Valor (BV)</h2>
                    <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-600">
                            <div class="md:col-span-2">
                                <label class="font-bold text-indigo-900 flex items-center">
                                    <span class="bg-indigo-600 text-white text-xs px-2 py-1 rounded mr-2">x5</span> A1. Cobertura Curricular
                                </label>
                                <p class="text-xs text-indigo-700 mt-1">¿Llena un hueco crítico en la biblioteca?</p>
                            </div>
                            <select id="a1" class="calc-input w-full p-2 border rounded-md text-sm font-medium">
                                <option value="1">1 - Saturado (&gt;3 productos)</option>
                                <option value="3">3 - Refuerzo (Variante)</option>
                                <option value="5">5 - Hueco Crítico (Nuevo)</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-indigo-50 p-3 rounded-lg border-l-4 border-indigo-600">
                            <div class="md:col-span-2">
                                <label class="font-bold text-indigo-900 flex items-center">
                                    <span class="bg-indigo-600 text-white text-xs px-2 py-1 rounded mr-2">x5</span> A2. Oferta Académica
                                </label>
                                <p class="text-xs text-indigo-700 mt-1">¿Impacto en matrícula de posgrado?</p>
                            </div>
                            <select id="a2" class="calc-input w-full p-2 border rounded-md text-sm font-medium">
                                <option value="1">1 - Nicho (&lt; 10 alumnos)</option>
                                <option value="3">3 - Regular (10-20 alumnos)</option>
                                <option value="5">5 - Estratégica (&gt; 20 alumnos)</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-fuchsia-50 p-3 rounded-lg border-l-4 border-fuchsia-500">
                            <div class="md:col-span-2">
                                <label class="font-bold text-fuchsia-900 flex items-center"><span class="bg-fuchsia-500 text-white text-xs px-2 py-1 rounded mr-2">x4</span> E. Pertinencia del Formato</label>
                                <p class="text-xs text-fuchsia-700 mt-1">Nivel de simulación y pertinencia del formato.</p>
                            </div>
                            <select id="e" class="calc-input w-full p-2 border rounded-md text-sm font-medium">
                                <option value="1">1 - Reporte / Narrativa (Discusión)</option>
                                <option value="3">3 - Habilidades / Task Training</option>
                                <option value="5">5 - Simulación Inmersiva</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-red-50 p-3 rounded-lg border-l-4 border-red-400">
                            <div class="md:col-span-2">
                                <label class="font-bold text-red-900 flex items-center"><span class="bg-red-400 text-white text-xs px-2 py-1 rounded mr-2">x4</span> C. Urgencia Epidemiológica</label>
                                <p class="text-xs text-red-700 mt-1">¿Mortalidad o prioridad nacional?</p>
                            </div>
                            <select id="c" class="calc-input w-full p-2 border rounded-md text-sm font-medium">
                                <option value="1">1 - Rara/Bajo Impacto</option><option value="3">3 - Común</option><option value="5">5 - Prioridad Nacional</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                            <div class="md:col-span-2">
                                <label class="font-bold text-green-900 flex items-center"><span class="bg-green-500 text-white text-xs px-2 py-1 rounded mr-2">x4</span> D. Cobertura Transversal</label>
                                <p class="text-xs text-green-700 mt-1">¿Bioética, humanización e inclusión?</p>
                            </div>
                            <select id="d" class="calc-input w-full p-2 border rounded-md text-sm font-medium">
                                <option value="1">1 - Técnico</option><option value="3">3 - Híbrido</option><option value="5">5 - Humanista</option>
                            </select>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-gray-50 p-3 rounded-lg opacity-90">
                            <div class="md:col-span-2">
                                <label class="font-semibold text-gray-700 flex items-center"><span class="bg-gray-400 text-white text-xs px-2 py-1 rounded mr-2">x3</span> B. Impacto Interprofesional</label>
                                <p class="text-xs text-gray-500 mt-1">¿Colaboración real entre disciplinas?</p>
                            </div>
                            <select id="b" class="calc-input w-full p-2 border rounded-md text-sm">
                                <option value="1">1 - Silo</option><option value="3">3 - Multidisciplinar</option><option value="5">5 - Interprofesional Real</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 class="text-xl font-bold text-gray-800 mb-4 border-b pb-2">2. Estimación de Esfuerzo (SP)</h2>
                    <div class="flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div class="flex-1">
                            <p class="text-sm text-gray-600 mb-2">Seleccione los Puntos Fibonacci según el producto.</p>
                            <select id="sp" class="calc-input w-full p-3 border border-indigo-200 bg-indigo-50 rounded-lg font-bold text-indigo-900 text-sm">
                                <option value="1">1 - Trivial: Viñeta corta / ajuste menor</option>
                                <option value="2">2 - Simple: Reporte PBL / Task Trainer básico</option>
                                <option value="3">3 - Moderado: Reporte denso / simulación media</option>
                                <option value="5">5 - Complejo: Reporte multimedia / simulación de alta fidelidad</option>
                                <option value="8">8 - Muy complejo: Simulación híbrida / crisis</option>
                                <option value="13">13 - Épico: Simulación in situ / catástrofe</option>
                                <option value="21">21 - Bloqueante: Proyecto indefinido</option>
                            </select>
                        </div>
                        <div class="hidden md:block text-2xl text-gray-300" aria-hidden="true">
                            <i class="fas fa-arrow-right"></i>
                        </div>
                        <div class="w-full md:w-auto text-center p-4 bg-gray-100 rounded-lg">
                            <span class="block text-xs text-gray-500 uppercase">Esfuerzo</span>
                            <span id="spDisplay" class="text-3xl font-bold text-gray-800">1</span>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div id="wsjf-header" class="flex justify-between items-center cursor-pointer">
                        <h2 class="text-lg font-bold text-gray-500 flex items-center"><i class="fas fa-calculator mr-2"></i> Avanzado: Calculadora WSJF</h2>
                        <i id="wsjfIcon" class="fas fa-chevron-down text-gray-400"></i>
                    </div>
                    <div id="wsjfContent" class="hidden mt-4 pt-4 border-t border-gray-100">
                        <p class="text-sm text-gray-500 mb-4">Solo para casos críticos. Ingrese valores del 1 al 10.</p>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><label class="block text-xs font-bold text-gray-600">Valor Negocio (User Value)</label><input type="number" id="cod1" min="1" max="10" value="1" class="calc-input w-full p-2 border rounded"></div>
                            <div><label class="block text-xs font-bold text-gray-600">Criticidad Temporal</label><input type="number" id="cod2" min="1" max="10" value="1" class="calc-input w-full p-2 border rounded"></div>
                            <div><label class="block text-xs font-bold text-gray-600">Reducción Riesgo</label><input type="number" id="cod3" min="1" max="10" value="1" class="calc-input w-full p-2 border rounded"></div>
                        </div>
                        <div class="mt-4 p-3 bg-yellow-50 rounded flex justify-between items-center">
                            <span class="text-sm font-bold text-yellow-800">WSJF Score:</span>
                            <span id="wsjfResult" class="text-xl font-bold text-yellow-900">3.0</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-1 space-y-6">
                <div class="bg-indigo-900 text-white p-6 rounded-xl shadow-lg text-center">
                    <h3 class="text-indigo-200 text-sm uppercase font-semibold tracking-wider mb-2">Valor del Negocio (BV)</h3>
                    <div id="bvScore" class="text-6xl font-bold mb-2">21</div>
                    <div id="bvLabel" class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white">BAJO VALOR</div>
                </div>

                <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                    <h3 class="text-gray-800 font-bold mb-4 text-center">Matriz de Priorización</h3>
                    <div class="grid grid-cols-2 gap-2 h-64 text-xs text-center font-bold">
                        <div id="q2" class="quadrant bg-blue-50 border border-blue-200 rounded flex flex-col justify-center items-center p-2 text-blue-800 opacity-50"><span class="text-lg mb-1">📅</span>II. Estratégicos<span class="font-normal text-[10px] mt-1">BV ≥ 90 / esfuerzo alto</span></div>
                        <div id="q1" class="quadrant bg-green-50 border border-green-200 rounded flex flex-col justify-center items-center p-2 text-green-800 opacity-50"><span class="text-lg mb-1">💎</span>I. Quick Wins<span class="font-normal text-[10px] mt-1">BV ≥ 90 o Fast Track / esfuerzo bajo</span></div>
                        <div id="q4" class="quadrant bg-red-50 border border-red-200 rounded flex flex-col justify-center items-center p-2 text-red-800 opacity-50"><span class="text-lg mb-1">🗑️</span>IV. Sumideros<span class="font-normal text-[10px] mt-1">BV &lt; 55 / esfuerzo alto</span></div>
                        <div id="q3" class="quadrant bg-gray-50 border border-gray-200 rounded flex flex-col justify-center items-center p-2 text-gray-600 opacity-50"><span class="text-lg mb-1">📂</span>III. Rellenos<span class="font-normal text-[10px] mt-1">BV 55-89 / esfuerzo bajo</span></div>
                    </div>
                </div>

                <div id="recommendationCard" class="bg-gray-100 p-4 rounded-xl border border-gray-200">
                    <h4 class="font-bold text-gray-700 mb-2">Recomendación:</h4>
                    <p id="recommendationText" class="text-sm text-gray-600">Ingrese datos para ver la estrategia recomendada.</p>
                </div>
            </div>
        </div>
`;
