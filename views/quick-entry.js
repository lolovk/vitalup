/*********************************************
 * views/quick-entry.js
 * Formulario de entrada rápida/completa
 * VERSIÓN 2.0 con comidas dinámicas
 *********************************************/

let currentFecha = null;
let currentRegistro = null;

window.renderQuickEntry = function(fecha = null) {
  console.log('renderQuickEntry called with:', { fecha });
  currentFecha = fecha || getTodayISO();

  // Cargar registro existente o crear uno nuevo
  currentRegistro = Storage.getRegistroByFecha(currentFecha) ||
                    Storage.createEmptyRegistro(currentFecha);

  // Debug: verificar datos de hidratación al cargar
  console.log('Registro cargado - hidratacion:', currentRegistro.hidratacion);

  // Migrar datos antiguos si existen
  if (currentRegistro.nutricion.comidas && !Array.isArray(currentRegistro.nutricion.comidas)) {
    currentRegistro = migrarRegistroAntiguo(currentRegistro);
  }

  // Migrar entrenamiento si es necesario
  currentRegistro = migrarEntrenamiento(currentRegistro);
  
  const config = Storage.getConfig();
  const content = document.getElementById('modalContent');

  console.log('modalContent element:', content);
  console.log('modalContent classList:', content?.classList?.toString());
  console.log('modalContent innerHTML before:', content?.innerHTML?.length);

  // Actualizar título del modal
  updateModalTitle(currentFecha);

  const modalHTML = `
    <form id="entryForm" class="space-y-6">

      <!-- Selector de fecha -->
      <div class="bg-blue-50 rounded-lg p-4 mb-6">
        <label class="block text-sm font-semibold text-gray-700 mb-2">
          <i class="fas fa-calendar mr-2"></i>Fecha
        </label>
        <input type="date"
               id="inputFecha"
               value="${currentFecha}"
               class="w-full px-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500"
               onchange="updateFecha(this.value)">
      </div>

      <!-- SECCIÓN: NUTRICIÓN -->
      ${renderSeccionNutricion(currentRegistro, config)}

      <!-- SECCIÓN: ENTRENAMIENTO -->
      ${renderSeccionEntrenamiento(currentRegistro, config)}

      <!-- SECCIÓN: HIDRATACIÓN -->
      ${renderSeccionHidratacion(currentRegistro, config)}

      <!-- SECCIÓN: BIENESTAR -->
      ${renderSeccionBienestar(currentRegistro, config)}

      <!-- SECCIÓN: INFORMACIÓN PERSONAL Y MEDICIONES (COLLAPSIBLE) -->
      ${renderSeccionInformacionPersonal(currentRegistro, config)}

      <!-- Botón de guardar -->
      <div class="pt-6 border-t border-gray-200">
        <button type="submit"
                class="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold text-lg transition shadow-lg">
          <i class="fas fa-save mr-2"></i>Guardar Registro
        </button>
      </div>

    </form>
  `;

  console.log('Generated modal HTML length:', modalHTML.length);
  console.log('Setting content innerHTML...');
  content.innerHTML = modalHTML;
  console.log('modalContent innerHTML after:', content?.innerHTML?.length);
  console.log('Form element found:', !!document.getElementById('entryForm'));
  console.log('Modal HTML set, calling setupFormListeners');
  setupFormListeners();

  // Actualizar totales al cargar el modal
  setTimeout(() => updateMacroTotals(), 100);

  console.log('renderQuickEntry completed successfully');
};

function migrarRegistroAntiguo(reg) {
  const comidas = [];
  const consumosNegativos = [];
  
  if (reg.nutricion.comidas.desayuno) {
    comidas.push({
      tipo: 'Desayuno',
      contenido: reg.nutricion.comidas.desayuno,
      hora: '08:00',
      calorias: null,
      proteinas: null
    });
  }
  if (reg.nutricion.comidas.comida) {
    comidas.push({
      tipo: 'Comida',
      contenido: reg.nutricion.comidas.comida,
      hora: '14:00',
      calorias: null,
      proteinas: null
    });
  }
  if (reg.nutricion.comidas.cena) {
    comidas.push({
      tipo: 'Cena',
      contenido: reg.nutricion.comidas.cena,
      hora: '21:00',
      calorias: null,
      proteinas: null
    });
  }
  if (reg.nutricion.comidas.snacks) {
    comidas.push({
      tipo: 'Extra',
      contenido: reg.nutricion.comidas.snacks,
      hora: '17:00',
      calorias: null,
      proteinas: null
    });
  }
  
  if (reg.nutricion.alcohol) consumosNegativos.push('Alcohol');
  if (reg.nutricion.dulces) consumosNegativos.push('Dulces');
  
  reg.nutricion.comidas = comidas;
  reg.nutricion.consumos_negativos = consumosNegativos;
  
  delete reg.nutricion.alcohol;
  delete reg.nutricion.dulces;
  
  return reg;
}

function updateModalTitle(fecha) {
  const fechaObj = new Date(fecha + 'T00:00:00');
  const fechaStr = fechaObj.toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  document.getElementById('modalTitle').textContent = `Registro del ${fechaStr}`;
}

function renderModoRapido(reg, config) {
  console.log('renderModoRapido called with:', { reg: reg?.fecha, config: !!config });
  const totalCaloriasComidas = reg.nutricion.comidas.reduce((sum, c) => sum + (c.calorias || 0), 0);
  const totalProteinasComidas = reg.nutricion.comidas.reduce((sum, c) => sum + (c.proteinas || 0), 0);
  console.log('Calculated totals:', { totalCaloriasComidas, totalProteinasComidas });

  // Verificar si hay registro previo para mediciones
  const registroAnterior = getRegistroAnterior(currentFecha);

  return `
    <!-- SECCIÓN: NUTRICIÓN -->
    <div class="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 space-y-4">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
        <i class="fas fa-utensils text-orange-600"></i>
        Nutrición
      </h3>

      <!-- Cálculo automático de calorías y proteínas -->
      <div class="bg-white/70 rounded-lg p-4 mb-4">
        <div class="grid md:grid-cols-3 gap-4">

          <!-- Calorías -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-fire text-orange-500 mr-1"></i>
              Calorías totales <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input type="number"
                     id="inputCalorias"
                     value="${reg.nutricion.calorias || (totalCaloriasComidas > 0 ? totalCaloriasComidas : '')}"
                     placeholder="${config.objetivos.calorias}"
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg font-semibold"
                     inputmode="numeric"
                     step="1"
                     onchange="updateMacroTotals()"
                 oninput="updateMacroTotals()"
              <span class="absolute right-4 top-3.5 text-gray-400 font-medium">kcal</span>
            </div>
            <div class="mt-1 text-xs text-gray-500">
              Objetivo: ${config.objetivos.calorias} kcal
              ${totalCaloriasComidas > 0 ? `<br><span class="text-blue-600 font-semibold">🧮 Auto-calculado de comidas: ${totalCaloriasComidas} kcal</span>` :
                '<br><span class="text-amber-600">💡 Se calculará automáticamente cuando añadas comidas detalladas</span>'}
            </div>
          </div>

          <!-- Proteínas -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-drumstick-bite text-red-500 mr-1"></i>
              Proteínas totales <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input type="number"
                     id="inputProteinas"
                     value="${reg.nutricion.proteinas || (totalProteinasComidas > 0 ? totalProteinasComidas : '')}"
                     placeholder="${config.objetivos.proteinas}"
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg font-semibold"
                     inputmode="numeric"
                     step="1"
                     onchange="updateMacroTotals()"
                 oninput="updateMacroTotals()"
              <span class="absolute right-4 top-3.5 text-gray-400 font-medium">g</span>
            </div>
            <div class="mt-1 text-xs text-gray-500">
              Objetivo: ${config.objetivos.proteinas} g
              ${totalProteinasComidas > 0 ? `<br><span class="text-blue-600 font-semibold">🧮 Auto-calculado de comidas: ${totalProteinasComidas}g</span>` :
                '<br><span class="text-amber-600">💡 Se calculará automáticamente cuando añadas comidas detalladas</span>'}
            </div>
          </div>

          <!-- Hidratación -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fas fa-tint text-blue-500 mr-1"></i>
              Hidratación
            </label>
            <div class="relative">
              <input type="number"
                     id="inputHidratacion"
                     value="${reg.hidratacion?.total || ''}"
                     placeholder="${config.objetivos.hidratacion}"
                     class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg font-semibold"
                     inputmode="numeric"
                     step="250"
                     min="0"
                     max="10000">
              <span class="absolute right-4 top-3.5 text-gray-400 font-medium">ml</span>
            </div>
            <div class="mt-1 text-xs text-gray-500">
              Objetivo: ${(config.objetivos.hidratacion / 1000).toFixed(1)}L (${config.objetivos.hidratacion}ml)
            </div>
          </div>

        </div>

        ${totalCaloriasComidas === 0 ? `
          <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p class="text-sm text-blue-800">
              <i class="fas fa-info-circle mr-2"></i>
              <strong>Primera vez registrando:</strong> Introduce los valores manualmente o añade comidas individuales abajo que calcularán estos totales automáticamente.
            </p>
          </div>
        ` : ''}
      </div>

      <!-- Consumos negativos -->
      <div class="space-y-3">
        <h4 class="font-semibold text-gray-700 flex items-center gap-2">
          <i class="fas fa-exclamation-triangle text-red-500"></i>
          Consumos a evitar
        </h4>
        <div class="grid grid-cols-2 gap-3">
          ${config.consumos_negativos.map(consumo => {
            const checked = reg.nutricion.consumos_negativos.includes(consumo);
            return `
              <label class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${checked ? 'border-red-500 bg-red-50' : 'border-gray-200'}">
                <input type="checkbox"
                       name="consumos_negativos"
                       value="${consumo}"
                       ${checked ? 'checked' : ''}
                       class="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500">
                <span class="text-sm font-medium text-gray-900">
                  ${consumo}
                </span>
              </label>
            `;
          }).join('')}
        </div>
      </div>
    </div>

    <!-- SECCIÓN: ENTRENAMIENTO -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 space-y-4">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
        <i class="fas fa-dumbbell text-green-600"></i>
        Entrenamiento
      </h3>

      <div class="space-y-4">

        <!-- Checkbox principal de entrenamiento -->
        <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white/50 transition ${reg.entrenamiento.hecho ? 'border-green-500 bg-white/70' : 'border-gray-300'}">
          <input type="checkbox"
                 id="checkEntrenamiento"
                 ${reg.entrenamiento.hecho ? 'checked' : ''}
                 onchange="toggleEntrenamientoDetails(this.checked)"
                 class="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500">
          <div class="flex-1">
            <div class="font-semibold text-gray-900">
              <i class="fas fa-running mr-2 text-green-600"></i>
              Entrené hoy
            </div>
            <div class="text-xs text-gray-500">Marca esta casilla si realizaste algún tipo de ejercicio</div>
          </div>
        </label>

        <!-- Lista de entrenamientos -->
        <div id="entrenamientoDetailsContainer" class="${reg.entrenamiento.hecho ? '' : 'hidden'} bg-white/70 rounded-lg p-4 space-y-4">
          <div class="mb-4">
            <h4 class="font-semibold text-gray-800 flex items-center gap-2">
              <i class="fas fa-dumbbell text-green-600"></i>
              Entrenamientos del día
            </h4>
          </div>

          <div id="listEntrenamientos" class="space-y-3">
            ${reg.entrenamiento.actividades ? reg.entrenamiento.actividades.map((actividad, idx) =>
              renderEntrenamientoRow(actividad, idx, config)).join('') : ''}
          </div>

          <!-- Bloque para añadir entrenamiento -->
          <div class="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mt-4">
            <i class="fas fa-dumbbell text-gray-300 text-3xl mb-2"></i>
            <p class="text-gray-500 text-sm mb-3">${!reg.entrenamiento.actividades || reg.entrenamiento.actividades.length === 0 ? 'No hay entrenamientos registrados' : 'Añadir más entrenamientos'}</p>
            <button type="button"
                    onclick="agregarEntrenamiento()"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
              <i class="fas fa-plus mr-1"></i>Añadir entrenamiento
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN: BIENESTAR -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 space-y-4">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
        <i class="fas fa-heart text-blue-600"></i>
        Bienestar
      </h3>

      <div class="space-y-4">

        <!-- Sueño -->
        <div class="bg-white/70 rounded-lg p-4">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            <i class="fas fa-bed text-indigo-500 mr-1"></i>
            Horas de sueño
          </label>
          <div class="relative">
            <input type="number"
                   id="inputSueno"
                   value="${reg.sueno.horas !== null ? reg.sueno.horas : ''}"
                   placeholder="7-8"
                   step="0.01"
                   min="0"
                   max="99"
                   class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500"
                   inputmode="decimal">
            <span class="absolute right-4 top-3.5 text-gray-400 font-medium">horas</span>
          </div>
          <div class="mt-1 text-xs text-gray-500">
            Recomendado: 7-9 horas por noche
          </div>
        </div>

        <!-- Estado de ánimo básico -->
        <div class="bg-white/70 rounded-lg p-4">
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            <i class="fas fa-smile text-yellow-500 mr-1"></i>
            ¿Cómo te sientes hoy?
          </label>
          <div class="animo-group flex flex-col gap-2">
            ${[1,2,3,4,5].map(n => {
              const emojis = ['😢', '😔', '😐', '🙂', '😄'];
              const labels = ['Muy triste', 'Triste', 'Neutro', 'Contento', 'Muy feliz'];
              return `
              <label class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-white transition ${reg.sentimiento.animo === n ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                <input type="radio"
                       name="animo"
                       value="${n}"
                       ${reg.sentimiento.animo === n ? 'checked' : ''}
                       class="sr-only">
                <span class="text-2xl">${emojis[n-1]}</span>
                <span class="text-sm font-medium flex-1">${labels[n-1]}</span>
              </label>
            `}).join('')}
          </div>
        </div>
      </div>
    </div>

    <!-- SECCIÓN: MEDICIONES (Solo si hay registro previo) -->
    ${registroAnterior ? `
      <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 space-y-4">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
          <i class="fas fa-weight text-purple-600"></i>
          Mediciones corporales
        </h3>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <p class="text-sm text-amber-800">
            <i class="fas fa-info-circle mr-2"></i>
            <strong>Valores anteriores:</strong> ${registroAnterior?.mediciones?.peso ? `Peso: ${registroAnterior.mediciones.peso} kg` : ''}
            ${registroAnterior?.mediciones?.peso && registroAnterior?.mediciones?.perimetro_abdominal ? ' • ' : ''}
            ${registroAnterior?.mediciones?.perimetro_abdominal ? `Perímetro: ${registroAnterior.mediciones.perimetro_abdominal} cm` : ''}
            ${(!registroAnterior?.mediciones?.peso && !registroAnterior?.mediciones?.perimetro_abdominal) ? 'Sin mediciones anteriores' : ''}
            <br>Solo actualiza si tienes mediciones nuevas.
          </p>
        </div>

        <div class="bg-white/70 rounded-lg p-4">
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Peso corporal</label>
              <div class="relative">
                <input type="number"
                       id="inputPeso"
                       value="${reg.mediciones.peso || config.info_personal.peso_inicial || ''}"
                       placeholder="${registroAnterior?.mediciones?.peso || config.info_personal.peso_inicial || 'Ej: 70'}"
                       step="0.1"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500"
                       inputmode="decimal">
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">kg</span>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Perímetro abdominal</label>
              <div class="relative">
                <input type="number"
                       id="inputPerimetro"
                       value="${reg.mediciones.perimetro_abdominal || config.info_personal.perimetro_inicial || ''}"
                       placeholder="${registroAnterior?.mediciones?.perimetro_abdominal || config.info_personal.perimetro_inicial || 'Ej: 85'}"
                       step="0.1"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500"
                       inputmode="decimal">
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">cm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Checkboxes rápidos -->
    <div class="hidden">
  `;
}

function renderModoCompleto(reg, config) {
  console.log('renderModoCompleto called with:', { reg: reg?.fecha, config: !!config, comidas: reg?.nutricion?.comidas?.length });
  return `
    <!-- COMIDAS DETALLADAS -->
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 space-y-4">
      <div class="mb-4">
        <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">
          <i class="fas fa-utensils text-green-600"></i>
          Detalle de comidas
        </h3>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <p class="text-sm text-blue-800">
          <i class="fas fa-calculator mr-2"></i>
          <strong>Cálculo automático:</strong> Los totales de calorías y proteínas se actualizarán automáticamente.
        </p>
      </div>
      
      <div id="listComidas" class="space-y-3">
        ${reg.nutricion.comidas.map((comida, idx) => renderComidaRow(comida, idx, config)).join('')}
      </div>
      
      <!-- Bloque para añadir comida -->
      <div class="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mt-4">
        <i class="fas fa-utensils text-gray-300 text-3xl mb-2"></i>
        <p class="text-gray-500 text-sm mb-3">${reg.nutricion.comidas.length === 0 ? 'No hay comidas registradas' : 'Añadir más comidas'}</p>
        <button type="button"
                onclick="agregarComida()"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
          <i class="fas fa-plus mr-1"></i>Añadir comida
        </button>
      </div>

    </div>
    
    <!-- Suplementos -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="fas fa-pills text-purple-500 mr-1"></i>
        Suplementos
      </label>
      <div class="grid grid-cols-2 gap-2">
        ${config.suplementos_habituales.map(sup => `
          <label class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input type="checkbox" 
                   name="suplementos"
                   value="${sup}"
                   ${reg.nutricion.suplementos.includes(sup) ? 'checked' : ''}
                   class="w-4 h-4 text-blue-600 rounded">
            <span class="text-sm">${sup}</span>
          </label>
        `).join('')}
      </div>
    </div>
    
    <!-- Mediciones corporales -->
    <div class="space-y-4">
      <h3 class="font-bold text-gray-900 flex items-center gap-2">
        <i class="fas fa-weight text-blue-600"></i>
        Mediciones corporales
      </h3>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Peso corporal</label>
          <div class="relative">
            <input type="number" 
                   id="inputPeso"
                   value="${reg.mediciones.peso || ''}"
                   step="0.1"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                   inputmode="decimal">
            <span class="absolute right-3 top-2.5 text-gray-400 text-sm">kg</span>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Perímetro abdominal</label>
          <div class="relative">
            <input type="number" 
                   id="inputPerimetro"
                   value="${reg.mediciones.perimetro_abdominal || ''}"
                   step="0.1"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                   inputmode="decimal">
            <span class="absolute right-3 top-2.5 text-gray-400 text-sm">cm</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Personal Data Section (Collapsible) -->
    <div class="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6 space-y-4">
      <button type="button"
              onclick="togglePersonalData()"
              class="w-full flex items-center justify-between p-3 bg-white/70 border border-purple-300 rounded-lg hover:bg-white/90 transition">
        <div class="flex items-center gap-3">
          <i class="fas fa-user-md text-purple-600"></i>
          <span class="font-bold text-gray-900">Datos personales del día</span>
        </div>
        <i id="personalDataChevron" class="fas fa-chevron-down text-purple-600 transition-transform"></i>
      </button>

      <div id="personalDataContent" class="hidden bg-white/70 rounded-lg p-4 space-y-4">

        <!-- Progress indicators based on personal info -->
        ${renderPersonalProgress(reg, config)}

        <!-- BMI Calculator if height exists -->
        ${config.info_personal.altura ? renderBMICalculator(reg, config) : ''}

        <!-- Weight trend -->
        ${renderWeightTrend(reg)}

        <!-- Perimeter progress -->
        ${renderPerimeterProgress(reg, config)}

      </div>
    </div>

    <!-- Entrenamiento detallado -->
    <div class="space-y-3">
      <h3 class="font-bold text-gray-900 flex items-center gap-2">
        <i class="fas fa-running text-green-600"></i>
        Detalles del entrenamiento
      </h3>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Intensidad (1-10)</label>
        <input type="range" 
               id="rangeIntensidad"
               min="1" 
               max="10" 
               value="${reg.entrenamiento.intensidad || 5}"
               class="w-full"
               oninput="document.getElementById('intensidadValue').textContent = this.value">
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>Suave</span>
          <span id="intensidadValue" class="font-semibold text-blue-600">${reg.entrenamiento.intensidad || 5}</span>
          <span>Máxima</span>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Notas del entrenamiento</label>
        <textarea id="textEntrenamientoNotas"
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 text-sm"
                  placeholder="Ejercicios realizados, sensaciones...">${reg.entrenamiento.notas || ''}</textarea>
      </div>
    </div>
    
    <!-- Sueño detallado -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        <i class="fas fa-moon text-indigo-500 mr-1"></i>
        Calidad del sueño
      </label>
      <div class="grid grid-cols-3 gap-2">
        ${['buena', 'regular', 'mala'].map(cal => `
          <label class="flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${reg.sueno.calidad === cal ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
            <input type="radio" 
                   name="calidadSueno"
                   value="${cal}"
                   ${reg.sueno.calidad === cal ? 'checked' : ''}
                   class="w-4 h-4 text-blue-600">
            <span class="text-sm font-medium capitalize">${cal}</span>
          </label>
        `).join('')}
      </div>
    </div>
    
    <!-- Sensaciones -->
    <div class="space-y-4">
      <h3 class="font-bold text-gray-900 flex items-center gap-2">
        <i class="fas fa-heart text-red-500"></i>
        Sensaciones
      </h3>
      
      <div class="grid md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nivel de energía</label>
          <div class="energia-group flex flex-col gap-2">
            ${[1,2,3,4,5].map(n => {
              const batteryIcons = ['fa-battery-empty', 'fa-battery-quarter', 'fa-battery-half', 'fa-battery-three-quarters', 'fa-battery-full'];
              const batteryColors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'];
              const labels = ['Muy bajo', 'Bajo', 'Normal', 'Bien', 'Excelente'];
              return `
              <label class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${reg.sentimiento.energia === n ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                <input type="radio"
                       name="energia"
                       value="${n}"
                       ${reg.sentimiento.energia === n ? 'checked' : ''}
                       class="sr-only">
                <i class="fas ${batteryIcons[n-1]} text-2xl ${batteryColors[n-1]}"></i>
                <span class="text-sm font-medium flex-1">${labels[n-1]}</span>
              </label>
            `}).join('')}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Estado de ánimo</label>
          <div class="animo-group flex flex-col gap-2">
            ${[1,2,3,4,5].map(n => {
              const emojis = ['😢', '😔', '😐', '🙂', '😄'];
              const labels = ['Muy triste', 'Triste', 'Neutro', 'Contento', 'Muy feliz'];
              return `
              <label class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${reg.sentimiento.animo === n ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                <input type="radio"
                       name="animo"
                       value="${n}"
                       ${reg.sentimiento.animo === n ? 'checked' : ''}
                       class="sr-only">
                <span class="text-2xl">${emojis[n-1]}</span>
                <span class="text-sm font-medium flex-1">${labels[n-1]}</span>
              </label>
            `}).join('')}
          </div>
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Digestión</label>
        <div class="grid grid-cols-3 gap-2">
          ${['normal', 'hinchado', 'pesado'].map(dig => `
            <label class="flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${reg.sentimiento.digestion === dig ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
              <input type="radio" 
                     name="digestion"
                     value="${dig}"
                     ${reg.sentimiento.digestion === dig ? 'checked' : ''}
                     class="w-4 h-4 text-blue-600">
              <span class="text-sm font-medium capitalize">${dig}</span>
            </label>
          `).join('')}
        </div>
      </div>
      
    </div>

    <!-- NOTAS GENERALES -->
    <div class="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6">
      <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
        <i class="fas fa-sticky-note text-yellow-600"></i>
        Notas del día
      </h3>
      <textarea id="textNotasGenerales"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-yellow-500 text-sm"
                placeholder="Cualquier observación relevante del día, sensaciones especiales, eventos importantes...">${reg.notas_generales || reg.sentimiento.notas || ''}</textarea>
      <p class="text-xs text-gray-500 mt-2">
        <i class="fas fa-lightbulb mr-1"></i>
        Espacio libre para anotar todo lo que consideres importante sobre este día
      </p>
    </div>
  `;
}

function renderComidaRow(comida, idx, config) {
  return `
    <div class="comida-row p-4 bg-white/80 rounded-lg border border-gray-200 shadow-sm" data-idx="${idx}">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">

        <div class="md:col-span-2 flex gap-2">
          <select class="comida-tipo flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500">
            ${config.tipos_comida.map(tipo =>
              `<option ${comida.tipo === tipo ? 'selected' : ''}>${tipo}</option>`
            ).join('')}
          </select>

          <input type="time"
                 class="comida-hora px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500"
                 value="${comida.hora || '12:00'}">

          <button type="button"
                  onclick="eliminarComida(${idx})"
                  class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
            <i class="fas fa-trash"></i>
          </button>
        </div>

        <div class="md:col-span-2">
          <textarea class="comida-contenido w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500"
                    rows="2"
                    placeholder="¿Qué comiste?">${comida.contenido || ''}</textarea>
        </div>

        <div class="relative">
          <input type="number"
                 class="comida-calorias w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500"
                 placeholder="Calorías"
                 value="${comida.calorias || ''}"
                 step="1"
                 inputmode="numeric"
                 onchange="updateMacroTotals()"
                 oninput="updateMacroTotals()">
          <span class="absolute right-3 top-2.5 text-gray-400 text-xs">kcal</span>
        </div>

        <div class="relative">
          <input type="number"
                 class="comida-proteinas w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500"
                 placeholder="Proteínas"
                 value="${comida.proteinas || ''}"
                 step="1"
                 inputmode="numeric"
                 onchange="updateMacroTotals()"
                 oninput="updateMacroTotals()">
          <span class="absolute right-3 top-2.5 text-gray-400 text-xs">g</span>
        </div>
        
      </div>
    </div>
  `;
}

function renderEntrenamientoRow(entrenamiento, idx, config) {
  return `
    <div class="entrenamiento-row p-4 bg-white/80 rounded-lg border border-gray-200 shadow-sm" data-entrenamiento-idx="${idx}">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">

        <div class="md:col-span-2 flex gap-2">
          <select class="entrenamiento-tipo flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500">
            ${config.tipos_ejercicio.map(tipo =>
              `<option ${entrenamiento.tipo === tipo ? 'selected' : ''}>${tipo}</option>`
            ).join('')}
          </select>

          <button type="button"
                  onclick="eliminarEntrenamiento(${idx})"
                  class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
            <i class="fas fa-trash"></i>
          </button>
        </div>

        <div class="relative">
          <input type="number"
                 class="entrenamiento-duracion w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500"
                 placeholder="Duración"
                 value="${entrenamiento.duracion || ''}"
                 min="5"
                 max="300"
                 inputmode="numeric">
          <span class="absolute right-3 top-2.5 text-gray-400 text-xs">min</span>
        </div>

        <div class="relative">
          <input type="range"
                 class="entrenamiento-intensidad w-full"
                 min="1"
                 max="5"
                 value="${entrenamiento.intensidad || 3}">
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Muy suave</span>
            <span>Moderado</span>
            <span>Intenso</span>
          </div>
        </div>

        <div class="md:col-span-2">
          <textarea class="entrenamiento-notas w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-green-500"
                    rows="2"
                    placeholder="Ejercicios realizados, observaciones...">${entrenamiento.notas || ''}</textarea>
        </div>
      </div>
    </div>
  `;
}

function renderDescansoRow(descanso, idx, config) {
  return `
    <div class="descanso-row p-4 bg-white/80 rounded-lg border border-blue-200 shadow-sm" data-descanso-idx="${idx}">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">

        <div class="md:col-span-2 flex gap-2">
          <select class="descanso-tipo flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500">
            ${config.tipos_ejercicio.map(tipo =>
              `<option ${descanso.tipo === tipo ? 'selected' : ''}>${tipo}</option>`
            ).join('')}
          </select>

          <button type="button"
                  onclick="eliminarDescansoActivo(${idx})"
                  class="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition">
            <i class="fas fa-trash"></i>
          </button>
        </div>

        <div class="relative">
          <input type="number"
                 class="descanso-duracion w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500"
                 placeholder="Duración"
                 value="${descanso.duracion || ''}"
                 min="5"
                 max="180"
                 inputmode="numeric">
          <span class="absolute right-3 top-2.5 text-gray-400 text-xs">min</span>
        </div>

        <div class="relative">
          <input type="range"
                 class="descanso-intensidad w-full"
                 min="1"
                 max="3"
                 value="${descanso.intensidad || 2}">
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>Suave</span>
            <span>Moderado</span>
            <span>Activo</span>
          </div>
        </div>

        <div class="md:col-span-2">
          <textarea class="descanso-notas w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-blue-500"
                    rows="2"
                    placeholder="Actividad realizada, cómo te sentiste...">${descanso.notas || ''}</textarea>
        </div>
      </div>
    </div>
  `;
}

// Migración automática de entrenamiento de objeto a array
function migrarEntrenamiento(reg) {
  if (reg.entrenamiento && typeof reg.entrenamiento.tipo === 'string') {
    // Es formato antiguo, migrar
    const entrenamientoAntiguo = reg.entrenamiento;
    reg.entrenamiento = {
      hecho: entrenamientoAntiguo.hecho,
      actividades: entrenamientoAntiguo.hecho ? [{
        tipo: entrenamientoAntiguo.tipo || '',
        duracion: entrenamientoAntiguo.duracion || null,
        intensidad: entrenamientoAntiguo.intensidad || null,
        notas: entrenamientoAntiguo.notas || ''
      }] : [],
      descanso_activo: {
        hecho: false,
        actividades: []
      }
    };
  }
  return reg;
}

function setupFormListeners() {
  const form = document.getElementById('entryForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    saveRegistro();
  });

  // Event listeners para actualizar visualización de radio buttons
  const energiaRadios = document.querySelectorAll('input[name="energia"]');
  energiaRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // Remover clases de selección de todos los labels hermanos
      const allLabels = this.closest('.energia-group').querySelectorAll('label');
      allLabels.forEach(label => {
        label.classList.remove('border-blue-500', 'bg-blue-50', 'border-purple-500', 'bg-purple-50');
        label.classList.add('border-gray-200');
      });

      // Añadir clases de selección al label actual
      const currentLabel = this.closest('label');
      currentLabel.classList.remove('border-gray-200');
      currentLabel.classList.add('border-blue-500', 'bg-blue-50');
    });
  });

  const animoRadios = document.querySelectorAll('input[name="animo"]');
  animoRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      // Remover clases de selección de todos los labels hermanos
      const allLabels = this.closest('.animo-group').querySelectorAll('label');
      allLabels.forEach(label => {
        label.classList.remove('border-blue-500', 'bg-blue-50', 'border-purple-500', 'bg-purple-50');
        label.classList.add('border-gray-200');
      });

      // Añadir clases de selección al label actual
      const currentLabel = this.closest('label');
      currentLabel.classList.remove('border-gray-200');
      currentLabel.classList.add('border-blue-500', 'bg-blue-50');
    });
  });

  // Event listeners para actualizar resumen nutricional en tiempo real
  setupNutricionalListeners();
}

function setupNutricionalListeners() {
  // Añadir listeners a inputs de calorías y proteínas en comidas
  document.querySelectorAll('.comida-calorias, .comida-proteinas').forEach(input => {
    input.addEventListener('input', actualizarResumenNutricional);
    input.addEventListener('change', actualizarResumenNutricional);
  });

  // Añadir listeners a inputs de excesos (buscar por ID que empiecen con exceso_)
  document.querySelectorAll('input[id^="exceso_calorias_"], input[id^="exceso_proteinas_"]').forEach(input => {
    input.addEventListener('input', actualizarResumenNutricional);
    input.addEventListener('change', actualizarResumenNutricional);
  });
}


function toggleEntrenamientoDetails(checked) {
  const container = document.getElementById('entrenamientoDetailsContainer');

  if (container) {
    if (checked) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  }
}

// Nueva función para obtener registro anterior
function getRegistroAnterior(fechaActual) {
  const registros = Storage.getRegistros();
  const fechaActualObj = new Date(fechaActual + 'T00:00:00');

  // Buscar registros anteriores ordenados por fecha desc
  const registrosAnteriores = registros
    .filter(r => new Date(r.fecha + 'T00:00:00') < fechaActualObj)
    .sort((a, b) => b.fecha.localeCompare(a.fecha));

  return registrosAnteriores.length > 0 ? registrosAnteriores[0] : null;
}

// Nueva función para actualizar totales automáticamente
function updateMacroTotals() {
  const comidas = Array.from(document.querySelectorAll('.comida-row')).map(row => ({
    calorias: parseFloat(row.querySelector('.comida-calorias').value) || 0,
    proteinas: parseFloat(row.querySelector('.comida-proteinas').value) || 0
  }));

  const totalCalorias = comidas.reduce((sum, c) => sum + c.calorias, 0);
  const totalProteinas = comidas.reduce((sum, c) => sum + c.proteinas, 0);

  // Debug: mostrar cálculos
  console.log('updateMacroTotals - Debug:', {
    comidasEncontradas: comidas.length,
    comidas,
    totalCalorias,
    totalProteinas
  });

  // Actualizar campos de entrada
  const inputCalorias = document.getElementById('inputCalorias');
  const inputProteinas = document.getElementById('inputProteinas');

  if (inputCalorias && totalCalorias > 0) {
    inputCalorias.value = totalCalorias;
  }
  if (inputProteinas && totalProteinas > 0) {
    inputProteinas.value = totalProteinas;
  }

  // Actualizar textos descriptivos si existen
  const numComidas = comidas.filter(c => c.calorias > 0 || c.proteinas > 0).length;
  const textosCalculados = document.querySelectorAll('.macro-calculation-text');
  textosCalculados.forEach(texto => {
    if (numComidas > 0) {
      texto.innerHTML = `<i class="fas fa-check-circle mr-1"></i>Calculado de ${numComidas} comida${numComidas !== 1 ? 's' : ''}`;
    }
  });
}

function updateFecha(nuevaFecha) {
  currentFecha = nuevaFecha;
  currentRegistro = Storage.getRegistroByFecha(currentFecha) || 
                    Storage.createEmptyRegistro(currentFecha);
  
  if (currentRegistro.nutricion.comidas && !Array.isArray(currentRegistro.nutricion.comidas)) {
    currentRegistro = migrarRegistroAntiguo(currentRegistro);
  }
  
  renderQuickEntry(currentFecha);
}

function agregarComida() {
  const config = Storage.getConfig();
  const listComidas = document.getElementById('listComidas');
  const idx = listComidas.children.length;

  const nuevaComida = {
    tipo: config.tipos_comida[0],
    contenido: '',
    hora: new Date().toTimeString().slice(0, 5),
    calorias: null,
    proteinas: null
  };

  listComidas.insertAdjacentHTML('beforeend', renderComidaRow(nuevaComida, idx, config));

  // Añadir event listeners a la nueva fila
  const nuevaFila = listComidas.lastElementChild;
  const caloriasInput = nuevaFila.querySelector('.comida-calorias');
  const proteinasInput = nuevaFila.querySelector('.comida-proteinas');

  if (caloriasInput) {
    caloriasInput.addEventListener('input', actualizarResumenNutricional);
    caloriasInput.addEventListener('change', actualizarResumenNutricional);
  }

  if (proteinasInput) {
    proteinasInput.addEventListener('input', actualizarResumenNutricional);
    proteinasInput.addEventListener('change', actualizarResumenNutricional);
  }

  // Actualizar totales después de agregar una nueva comida
  updateMacroTotals();
  actualizarResumenNutricional();
}

function agregarEntrenamiento() {
  const config = Storage.getConfig();
  const listEntrenamientos = document.getElementById('listEntrenamientos');
  const idx = listEntrenamientos ? listEntrenamientos.children.length : 0;

  const nuevoEntrenamiento = {
    tipo: config.tipos_ejercicio[0],
    duracion: null,
    intensidad: null,
    notas: ''
  };

  if (listEntrenamientos) {
    listEntrenamientos.insertAdjacentHTML('beforeend', renderEntrenamientoRow(nuevoEntrenamiento, idx, config));
  }
}

function eliminarEntrenamiento(idx) {
  const row = document.querySelector(`[data-entrenamiento-idx="${idx}"]`);
  if (row) row.remove();

  // Reindexar
  document.querySelectorAll('.entrenamiento-row').forEach((row, newIdx) => {
    row.setAttribute('data-entrenamiento-idx', newIdx);
  });
}

function agregarDescansoActivo() {
  const config = Storage.getConfig();
  const listDescanso = document.getElementById('listDescansoActivo');
  const idx = listDescanso ? listDescanso.children.length : 0;

  const nuevoDescanso = {
    tipo: config.tipos_ejercicio[0],
    duracion: null,
    intensidad: null,
    notas: ''
  };

  if (listDescanso) {
    listDescanso.insertAdjacentHTML('beforeend', renderDescansoRow(nuevoDescanso, idx, config));
  }
}

function eliminarDescansoActivo(idx) {
  const row = document.querySelector(`[data-descanso-idx="${idx}"]`);
  if (row) row.remove();

  // Reindexar
  document.querySelectorAll('.descanso-row').forEach((row, newIdx) => {
    row.setAttribute('data-descanso-idx', newIdx);
  });
}

function eliminarComida(idx) {
  document.querySelector(`[data-idx="${idx}"]`).remove();

  // Reindexar
  document.querySelectorAll('.comida-row').forEach((row, newIdx) => {
    row.setAttribute('data-idx', newIdx);
  });

  // Actualizar totales después de eliminar una comida
  updateMacroTotals();
}

function saveRegistro(silent = false) {
  // Forzar actualización de totales antes de guardar
  updateMacroTotals();

  // Actualizar objetivos si han cambiado
  const caloriasObjetivoInput = document.getElementById('inputCaloriasObjetivo');
  const proteinasObjetivoInput = document.getElementById('inputProteinasObjetivo');
  const pesoObjetivoInput = document.getElementById('inputPesoObjetivo');
  const perimetroObjetivoInput = document.getElementById('inputPerimetroObjetivo');

  if (caloriasObjetivoInput || proteinasObjetivoInput || pesoObjetivoInput || perimetroObjetivoInput) {
    const config = Storage.getConfig();
    let configChanged = false;

    if (caloriasObjetivoInput && caloriasObjetivoInput.value) {
      const nuevoValor = parseInt(caloriasObjetivoInput.value);
      if (nuevoValor !== config.objetivos.calorias) {
        config.objetivos.calorias = nuevoValor;
        configChanged = true;
      }
    }

    if (proteinasObjetivoInput && proteinasObjetivoInput.value) {
      const nuevoValor = parseInt(proteinasObjetivoInput.value);
      if (nuevoValor !== config.objetivos.proteinas) {
        config.objetivos.proteinas = nuevoValor;
        configChanged = true;
      }
    }

    if (pesoObjetivoInput && pesoObjetivoInput.value) {
      const nuevoValor = parseFloat(pesoObjetivoInput.value);
      if (nuevoValor !== config.objetivos.peso_objetivo) {
        config.objetivos.peso_objetivo = nuevoValor;
        configChanged = true;
      }
    }

    if (perimetroObjetivoInput && perimetroObjetivoInput.value) {
      const nuevoValor = parseFloat(perimetroObjetivoInput.value);
      if (nuevoValor !== config.objetivos.perimetro_objetivo) {
        config.objetivos.perimetro_objetivo = nuevoValor;
        configChanged = true;
      }
    }

    if (configChanged) {
      Storage.saveConfig(config);
    }
  }

  // Recoger comidas
  const comidas = Array.from(document.querySelectorAll('.comida-row')).map(row => ({
    tipo: row.querySelector('.comida-tipo').value,
    contenido: row.querySelector('.comida-contenido').value,
    hora: row.querySelector('.comida-hora').value,
    calorias: parseFloat(row.querySelector('.comida-calorias').value) || null,
    proteinas: parseFloat(row.querySelector('.comida-proteinas').value) || null
  }));

  // Recoger actividades de entrenamiento
  const actividades = Array.from(document.querySelectorAll('.entrenamiento-row')).map(row => ({
    tipo: row.querySelector('.entrenamiento-tipo').value,
    duracion: parseFloat(row.querySelector('.entrenamiento-duracion').value) || null,
    intensidad: parseInt(row.querySelector('.entrenamiento-intensidad').value) || null,
    notas: row.querySelector('.entrenamiento-notas').value || ''
  }));

  // Recoger actividades de descanso activo
  const actividadesDescanso = Array.from(document.querySelectorAll('.descanso-row')).map(row => ({
    tipo: row.querySelector('.descanso-tipo').value,
    duracion: parseFloat(row.querySelector('.descanso-duracion').value) || null,
    intensidad: parseInt(row.querySelector('.descanso-intensidad').value) || null,
    notas: row.querySelector('.descanso-notas').value || ''
  }));

  // Obtener registro existente de la misma fecha para preservar datos
  const registroExistente = Storage.getRegistroByFecha(currentFecha);
  const registroAnterior = getRegistroAnterior(currentFecha); // Para mediciones heredadas
  const config = Storage.getConfig();

  const pesoInput = document.getElementById('inputPeso');
  const perimetroInput = document.getElementById('inputPerimetro');

  const pesoActual = pesoInput ? parseFloat(pesoInput.value) : null;
  const perimetroActual = perimetroInput ? parseFloat(perimetroInput.value) : null;

  // Prioridad: valor actual > valor existente > valor configurado > valor anterior
  const pesoFinal = pesoActual !== null ? pesoActual :
                   (registroExistente?.mediciones?.peso ||
                   config.info_personal.peso_inicial ||
                   (registroAnterior?.mediciones?.peso || null));
  const perimetroFinal = perimetroActual !== null ? perimetroActual :
                        (registroExistente?.mediciones?.perimetro_abdominal ||
                        config.info_personal.perimetro_inicial ||
                        (registroAnterior?.mediciones?.perimetro_abdominal || null));
  
  // Calcular totales directamente desde las comidas
  const totalCaloriasComidas = comidas.reduce((sum, c) => sum + (c.calorias || 0), 0);
  const totalProteinasComidas = comidas.reduce((sum, c) => sum + (c.proteinas || 0), 0);

  // Obtener valores actuales del formulario, pero usar los calculados como fallback
  const inputCaloriasEl = document.getElementById('inputCalorias');
  const inputProteinasEl = document.getElementById('inputProteinas');

  // Prioridad: campo de entrada -> total calculado desde comidas -> registro existente
  const nuevoCalorias = inputCaloriasEl && inputCaloriasEl.value ?
                        parseFloat(inputCaloriasEl.value) :
                        (totalCaloriasComidas > 0 ? totalCaloriasComidas :
                        (registroExistente?.nutricion?.calorias || null));

  const nuevoProteinas = inputProteinasEl && inputProteinasEl.value ?
                         parseFloat(inputProteinasEl.value) :
                         (totalProteinasComidas > 0 ? totalProteinasComidas :
                         (registroExistente?.nutricion?.proteinas || null));

  // Debug: verificar valores que se van a guardar
  console.log('saveRegistro - Debug valores:', {
    nuevoCalorias,
    nuevoProteinas,
    totalCaloriasComidas,
    totalProteinasComidas,
    inputCaloriasElFound: !!inputCaloriasEl,
    inputProteinasElFound: !!inputProteinasEl,
    inputCaloriasElValue: inputCaloriasEl?.value,
    inputProteinasElValue: inputProteinasEl?.value,
    comidasCount: comidas.length,
    // Debug adicional para verificar qué elementos existen
    inputCaloriasExists: !!document.getElementById('inputCalorias'),
    inputProteinasExists: !!document.getElementById('inputProteinas')
  });
  const nuevaHidratacion = parseFloat(document.getElementById('inputHidratacion')?.value);
  const nuevoHorasSueno = parseFloat(document.getElementById('inputSueno')?.value || document.getElementById('inputHorasSueno')?.value);
  const nuevasNotasGenerales = document.getElementById('textNotasGenerales')?.value;

  // Recoger datos de excesos (calorías y proteínas de cada consumo negativo)
  const excesosData = {};
  const consumosNegativosMarcados = Array.from(document.querySelectorAll('input[name="consumos_negativos"]:checked'))
                                         .map(cb => cb.value);

  consumosNegativosMarcados.forEach(consumo => {
    const excesoKey = `exceso_${consumo.toLowerCase().replace(/\s+/g, '_')}`;
    const caloriasInput = document.getElementById(`exceso_calorias_${excesoKey}`);
    const proteinasInput = document.getElementById(`exceso_proteinas_${excesoKey}`);

    excesosData[excesoKey] = {
      calorias: caloriasInput ? (parseFloat(caloriasInput.value) || 0) : 0,
      proteinas: proteinasInput ? (parseFloat(proteinasInput.value) || 0) : 0
    };
  });

  // Crear objeto registro preservando datos existentes
  const registro = {
    fecha: currentFecha,

    nutricion: {
      calorias: !isNaN(nuevoCalorias) ? nuevoCalorias : registroExistente?.nutricion?.calorias || null,
      proteinas: !isNaN(nuevoProteinas) ? nuevoProteinas : registroExistente?.nutricion?.proteinas || null,
      comidas: comidas.length > 0 ? comidas : (registroExistente?.nutricion?.comidas || []),
      consumos_negativos: consumosNegativosMarcados,
      excesos_data: excesosData,
      suplementos: Array.from(document.querySelectorAll('input[name="suplementos"]:checked'))
                        .map(cb => cb.value)
    },

    mediciones: {
      peso: pesoFinal,
      perimetro_abdominal: perimetroFinal,
      otras: registroExistente?.mediciones?.otras || {}
    },

    hidratacion: {
      total: !isNaN(nuevaHidratacion) ? nuevaHidratacion : (registroExistente?.hidratacion?.total || currentRegistro?.hidratacion?.total || 0),
      bebidas: registroExistente?.hidratacion?.bebidas || currentRegistro?.hidratacion?.bebidas || []
    },

    entrenamiento: {
      hecho: document.getElementById('checkEntrenamiento')?.checked || actividades.length > 0,
      actividades: actividades.length > 0 ? actividades : (registroExistente?.entrenamiento?.actividades || []),
      descanso_activo: {
        hecho: document.getElementById('checkDescansoActivo')?.checked || actividadesDescanso.length > 0,
        actividades: actividadesDescanso.length > 0 ? actividadesDescanso : (registroExistente?.entrenamiento?.descanso_activo?.actividades || [])
      }
    },

    sueno: {
      horas: !isNaN(nuevoHorasSueno) ? nuevoHorasSueno : registroExistente?.sueno?.horas || null,
      calidad: document.querySelector('input[name="calidadSueno"]:checked')?.value || registroExistente?.sueno?.calidad || 'buena'
    },

    sentimiento: {
      energia: parseInt(document.querySelector('input[name="energia"]:checked')?.value) || registroExistente?.sentimiento?.energia || 2,
      animo: parseInt(document.querySelector('input[name="animo"]:checked')?.value) || registroExistente?.sentimiento?.animo || 2,
      digestion: document.querySelector('input[name="digestion"]:checked')?.value || registroExistente?.sentimiento?.digestion || 'normal',
      notas: registroExistente?.sentimiento?.notas || '' // Preservar notas antiguas de sentimiento
    },

    notas_generales: nuevasNotasGenerales !== undefined && nuevasNotasGenerales !== '' ? nuevasNotasGenerales : (registroExistente?.notas_generales || '')
  };
  
  // Validación
  const faltantes = [];
  
  if (config.preferencias.campos_obligatorios.includes('calorias') && !registro.nutricion.calorias) {
    faltantes.push('Calorías');
  }
  if (config.preferencias.campos_obligatorios.includes('proteinas') && !registro.nutricion.proteinas) {
    faltantes.push('Proteínas');
  }
  
  if (faltantes.length > 0 && !silent) {
    if (!confirm(`Faltan campos obligatorios: ${faltantes.join(', ')}. ¿Guardar de todos modos?`)) {
      return;
    }
  }
  
  // Guardar
  Storage.saveRegistro(registro);

  // Actualizar contadores después de guardar
  updateMacroTotals();

  if (!silent) {
    showToast('✓ Registro guardado correctamente', 'success');
    closeModal();
    
    // Recargar vista
    if (location.hash.includes('dashboard') && window.renderDashboard) {
      setTimeout(() => window.renderDashboard(), 100);
    } else if (location.hash.includes('registros') && window.renderRegistros) {
      setTimeout(() => window.renderRegistros(), 100);
    }
  }
}

// ============= SECCIONES ORGANIZADAS =============
function renderSeccionNutricion(reg, config) {
  return `
    <div class="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6 space-y-6">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6">
        <i class="fas fa-utensils text-orange-600 text-2xl"></i>
        <span>Nutrición</span>
      </h2>

      <!-- Comidas detalladas -->
      <div class="space-y-4">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-gray-800">Comidas del día</h3>
        </div>

        <div id="listComidas" class="space-y-3">
          ${reg.nutricion.comidas.map((comida, idx) => renderComidaRow(comida, idx, config)).join('')}
        </div>

        <!-- Bloque para añadir comida -->
        <div class="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mt-4">
          <i class="fas fa-utensils text-gray-300 text-3xl mb-2"></i>
          <p class="text-gray-500 text-sm mb-3">${reg.nutricion.comidas.length === 0 ? 'No hay comidas registradas' : 'Añadir más comidas'}</p>
          <button type="button"
                  onclick="agregarComida()"
                  class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
            <i class="fas fa-plus mr-1"></i>Añadir comida
          </button>
        </div>

      </div>

      <!-- Suplementos -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <i class="fas fa-pills text-purple-600"></i>
          Suplementos
        </h3>
        <div class="grid grid-cols-2 gap-2">
          ${config.suplementos_habituales.map(sup => `
            <label class="flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${reg.nutricion.suplementos.includes(sup) ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}">
              <input type="checkbox"
                     name="suplementos"
                     value="${sup}"
                     ${reg.nutricion.suplementos.includes(sup) ? 'checked' : ''}
                     class="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-500">
              <span class="text-sm font-medium">${sup}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Excesos -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <i class="fas fa-exclamation-triangle text-red-500"></i>
          Excesos
        </h3>
        <div class="space-y-3">
          ${config.consumos_negativos.map((consumo, idx) => {
            const checked = reg.nutricion.consumos_negativos.includes(consumo);
            const excesoKey = `exceso_${consumo.toLowerCase().replace(/\s+/g, '_')}`;
            const excesoData = reg.nutricion.excesos_data?.[excesoKey] || { calorias: 0, proteinas: 0 };
            return `
              <div class="border-2 rounded-lg ${checked ? 'border-red-500 bg-red-50' : 'border-gray-200'} overflow-hidden">
                <label class="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition">
                  <input type="checkbox"
                         name="consumos_negativos"
                         value="${consumo}"
                         ${checked ? 'checked' : ''}
                         class="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500"
                         onchange="toggleExcesoInputs('${excesoKey}', this.checked)">
                  <span class="text-sm font-medium text-gray-900 flex-1">${consumo}</span>
                  ${checked ? '<i class="fas fa-chevron-down text-red-500"></i>' : ''}
                </label>

                <div id="exceso_inputs_${excesoKey}" class="${checked ? '' : 'hidden'} border-t border-red-200 bg-white p-4">
                  <div class="grid grid-cols-2 gap-3">
                    <div class="relative">
                      <input type="number"
                             id="exceso_calorias_${excesoKey}"
                             value="${excesoData.calorias || ''}"
                             placeholder="0"
                             min="0" step="10"
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-red-500">
                      <span class="absolute right-3 top-2.5 text-gray-400 text-xs">kcal</span>
                    </div>
                    <div class="relative">
                      <input type="number"
                             id="exceso_proteinas_${excesoKey}"
                             value="${excesoData.proteinas || ''}"
                             placeholder="0"
                             min="0" step="1"
                             class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:border-red-500">
                      <span class="absolute right-3 top-2.5 text-gray-400 text-xs">g</span>
                    </div>
                  </div>
                  <p class="text-xs text-red-600 mt-2">Calorías y proteínas estimadas de este exceso</p>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Resumen total de nutrición -->
        <div class="bg-white/90 border-t-2 border-orange-300 rounded-lg p-4 mt-6">
          <h4 class="text-md font-bold text-gray-800 mb-3 flex items-center gap-2">
            <i class="fas fa-calculator text-orange-600"></i>
            Resumen nutricional del día
          </h4>
          <div id="resumenNutricional" class="grid grid-cols-2 gap-4">
            ${renderResumenNutricional(reg, config)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSeccionEntrenamiento(reg, config) {
  return `
    <div class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 space-y-4">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
        <i class="fas fa-dumbbell text-green-600 text-2xl"></i>
        <span>Entrenamiento</span>
      </h2>

      <!-- Opciones de actividad física -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white/50 transition ${reg.entrenamiento.hecho ? 'border-green-500 bg-white/70' : 'border-gray-300'}">
          <input type="checkbox"
                 id="checkEntrenamiento"
                 ${reg.entrenamiento.hecho ? 'checked' : ''}
                 onchange="toggleEntrenamientoDetails(this.checked)"
                 class="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500">
          <div class="flex-1">
            <div class="font-semibold text-gray-900">Entrenamiento</div>
            <div class="text-xs text-gray-500">Ejercicio estructurado o intenso</div>
          </div>
        </label>

        <label class="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-white/50 transition ${reg.entrenamiento.descanso_activo ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}">
          <input type="checkbox"
                 id="checkDescansoActivo"
                 ${reg.entrenamiento.descanso_activo?.hecho ? 'checked' : ''}
                 onchange="toggleDescansoActivoDetails(this.checked)"
                 class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500">
          <div class="flex-1">
            <div class="font-semibold text-gray-900">Descanso activo</div>
            <div class="text-xs text-gray-500">Actividad ligera o movilidad</div>
          </div>
        </label>
      </div>

      <!-- Lista de entrenamientos -->
      <div id="entrenamientoDetailsContainer" class="${reg.entrenamiento.hecho ? '' : 'hidden'} bg-white/70 rounded-lg p-4 space-y-4">
        <div class="mb-4">
          <h4 class="font-semibold text-gray-800 flex items-center gap-2">
            <i class="fas fa-dumbbell text-green-600"></i>
            Entrenamientos del día
          </h4>
        </div>

        <div id="listEntrenamientos" class="space-y-3">
          ${reg.entrenamiento.actividades ? reg.entrenamiento.actividades.map((actividad, idx) =>
            renderEntrenamientoRow(actividad, idx, config)).join('') : ''}
        </div>

        <div class="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 mt-4">
          <i class="fas fa-dumbbell text-gray-300 text-3xl mb-2"></i>
          <p class="text-gray-500 text-sm mb-3">${!reg.entrenamiento.actividades || reg.entrenamiento.actividades.length === 0 ? 'No hay entrenamientos registrados' : 'Añadir más entrenamientos'}</p>
          <button type="button"
                  onclick="agregarEntrenamiento()"
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
            <i class="fas fa-plus mr-1"></i>${!reg.entrenamiento.actividades || reg.entrenamiento.actividades.length === 0 ? 'Añadir primer entrenamiento' : 'Añadir entrenamiento'}
          </button>
        </div>
      </div>

      <!-- Lista de actividades de descanso activo -->
      <div id="descansoActivoDetailsContainer" class="${reg.entrenamiento.descanso_activo?.hecho ? '' : 'hidden'} bg-blue-50 rounded-lg p-4 space-y-4">
        <div class="mb-4">
          <h4 class="font-semibold text-gray-800 flex items-center gap-2">
            <i class="fas fa-leaf text-blue-600"></i>
            Actividades de descanso activo
          </h4>
        </div>

        <div id="listDescansoActivo" class="space-y-3">
          ${reg.entrenamiento.descanso_activo && reg.entrenamiento.descanso_activo.actividades ?
            reg.entrenamiento.descanso_activo.actividades.map((actividad, idx) =>
            renderDescansoRow(actividad, idx, config)).join('') : ''}
        </div>

        <div class="text-center py-6 bg-white/50 rounded-lg border-2 border-dashed border-blue-300 mt-4">
          <i class="fas fa-leaf text-blue-300 text-3xl mb-2"></i>
          <p class="text-gray-500 text-sm mb-3">${!reg.entrenamiento.descanso_activo || !reg.entrenamiento.descanso_activo.actividades || reg.entrenamiento.descanso_activo.actividades.length === 0 ? 'No hay actividades de descanso registradas' : 'Añadir más actividades de descanso'}</p>
          <button type="button"
                  onclick="agregarDescansoActivo()"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
            <i class="fas fa-plus mr-1"></i>${!reg.entrenamiento.descanso_activo || !reg.entrenamiento.descanso_activo.actividades || reg.entrenamiento.descanso_activo.actividades.length === 0 ? 'Añadir actividad' : 'Añadir actividad'}
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderSeccionHidratacion(reg, config) {
  // Asegurar que hidratacion existe
  if (!reg.hidratacion) {
    reg.hidratacion = { total: 0, bebidas: [] };
  }

  // Asegurar que el array de bebidas existe
  if (!reg.hidratacion.bebidas) {
    reg.hidratacion.bebidas = [];
  }

  // Debug: mostrar datos de hidratacion
  console.log('renderSeccionHidratacion - reg.hidratacion:', reg.hidratacion);
  console.log('renderSeccionHidratacion - reg.hidratacion.bebidas:', reg.hidratacion.bebidas);
  console.log('renderSeccionHidratacion - bebidas length:', reg.hidratacion.bebidas ? reg.hidratacion.bebidas.length : 'undefined');

  const totalHidratacion = reg.hidratacion.total || 0;
  const totalLitros = (totalHidratacion / 1000).toFixed(1);
  const objetivoLitros = (config.objetivos.hidratacion / 1000).toFixed(1);
  const porcentaje = Math.round((totalHidratacion / config.objetivos.hidratacion) * 100);
  const colorIndicador = porcentaje >= 100 ? 'text-green-600' : porcentaje >= 70 ? 'text-yellow-600' : 'text-red-600';

  return `
    <div class="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 space-y-4">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
        <i class="fas fa-tint text-blue-600 text-2xl"></i>
        <span>Hidratación</span>
      </h2>

      <!-- Resumen actual -->
      <div class="bg-white/60 rounded-lg p-4 mb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-600">Progreso del día</span>
          <span class="text-sm font-medium ${colorIndicador}">${porcentaje}%</span>
        </div>
        <div class="flex items-center gap-2">
          <i class="fas fa-tint ${colorIndicador}"></i>
          <span class="font-bold text-lg">${totalLitros}L</span>
          <span class="text-gray-600">/ ${objetivoLitros}L</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div class="bg-blue-500 h-2 rounded-full transition-all" style="width: ${Math.min(porcentaje, 100)}%"></div>
        </div>
      </div>

      <!-- Botones rápidos -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <button type="button" onclick="añadirHidratacion(250, 'Agua')"
                class="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-blue-500 transition">
          <i class="fas fa-glass-water text-blue-600"></i>
          <span class="text-sm font-medium">Vaso</span>
          <span class="text-xs text-gray-500">250ml</span>
        </button>

        <button type="button" onclick="añadirHidratacion(500, 'Agua')"
                class="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-blue-500 transition">
          <i class="fas fa-bottle-water text-blue-600"></i>
          <span class="text-sm font-medium">Botella</span>
          <span class="text-xs text-gray-500">500ml</span>
        </button>

        <button type="button" onclick="añadirHidratacion(1000, 'Agua')"
                class="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-blue-500 transition">
          <i class="fas fa-jug-detergent text-blue-600"></i>
          <span class="text-sm font-medium">Litro</span>
          <span class="text-xs text-gray-500">1000ml</span>
        </button>

        <button type="button" onclick="toggleHidratacionDetalle()"
                class="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-green-500 transition">
          <i class="fas fa-plus text-green-600"></i>
          <span class="text-sm font-medium">Manual</span>
          <span class="text-xs text-gray-500">Detalle</span>
        </button>
      </div>

      <!-- Detalle manual (oculto por defecto) -->
      <div id="hidratacionDetalle" class="hidden space-y-4">
        <div class="bg-white/60 rounded-lg p-4 space-y-3">
          <h3 class="font-semibold text-gray-800">Añadir bebida</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select id="tipoBebida" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                ${config.tipos_bebida.map(tipo => `<option value="${tipo}">${tipo}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Cantidad (ml)</label>
              <input type="number" id="cantidadBebida" min="0" max="2000" step="50"
                     placeholder="250" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input type="time" id="horaBebida" value="${new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}"
                     class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            </div>
          </div>
          <button type="button" onclick="añadirHidratacionManual()"
                  class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            <i class="fas fa-plus mr-2"></i>Añadir bebida
          </button>
        </div>
      </div>

      <!-- Lista de bebidas del día -->
      <div id="listaBebidas" class="space-y-2">
        ${(reg.hidratacion.bebidas || []).map((bebida, index) => `
          <div class="flex items-center justify-between bg-white/60 rounded-lg p-3">
            <div class="flex items-center gap-3">
              <i class="fas fa-tint text-blue-500"></i>
              <div>
                <span class="font-medium">${bebida.tipo}</span>
                <span class="text-sm text-gray-600 ml-2">${bebida.cantidad}ml</span>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">${bebida.hora}</span>
              <button onclick="eliminarBebida(${index})" class="text-red-500 hover:text-red-700 text-sm">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderSeccionBienestar(reg, config) {
  return `
    <div class="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6 space-y-4">
      <h2 class="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
        <i class="fas fa-heart text-purple-600 text-2xl"></i>
        <span>Bienestar</span>
      </h2>

      <!-- Sueño -->
      <div class="space-y-3">
        <h3 class="text-lg font-semibold text-gray-800">Sueño</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Horas de sueño</label>
            <input type="number"
                   id="inputHorasSueno"
                   value="${reg.sueno.horas || ''}"
                   step="0.01" min="0" max="99"
                   class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500"
                   inputmode="decimal"
                   placeholder="8">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Calidad del sueño</label>
            <div class="grid grid-cols-3 gap-2">
              ${['buena', 'regular', 'mala'].map(cal => `
                <label class="flex items-center justify-center gap-1 p-2 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition text-sm ${reg.sueno.calidad === cal ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}">
                  <input type="radio"
                         name="calidadSueno"
                         value="${cal}"
                         ${reg.sueno.calidad === cal ? 'checked' : ''}
                         class="w-3 h-3 text-purple-600">
                  <span class="capitalize">${cal}</span>
                </label>
              `).join('')}
            </div>
          </div>
        </div>
      </div>

      <!-- Estado de ánimo y energía -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Nivel de energía</label>
          <div class="energia-group flex flex-col gap-2">
            ${[1,2,3,4,5].map(n => {
              const batteryIcons = ['fa-battery-empty', 'fa-battery-quarter', 'fa-battery-half', 'fa-battery-three-quarters', 'fa-battery-full'];
              const batteryColors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-lime-500', 'text-green-500'];
              const labels = ['Muy bajo', 'Bajo', 'Normal', 'Bien', 'Excelente'];
              const isSelected = reg.sentimiento.energia ? reg.sentimiento.energia === n : n === 3;
              return `
              <label class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}">
                <input type="radio"
                       name="energia"
                       value="${n}"
                       ${isSelected ? 'checked' : ''}
                       class="sr-only">
                <i class="fas ${batteryIcons[n-1]} text-2xl ${batteryColors[n-1]}"></i>
                <span class="text-sm font-medium flex-1">${labels[n-1]}</span>
              </label>
            `}).join('')}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-3">Estado de ánimo</label>
          <div class="animo-group flex flex-col gap-2">
            ${[1,2,3,4,5].map(n => {
              const emojis = ['😢', '😔', '😐', '🙂', '😄'];
              const labels = ['Muy triste', 'Triste', 'Neutro', 'Contento', 'Muy feliz'];
              const isSelected = reg.sentimiento.animo ? reg.sentimiento.animo === n : n === 3;
              return `
              <label class="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}">
                <input type="radio"
                       name="animo"
                       value="${n}"
                       ${isSelected ? 'checked' : ''}
                       class="sr-only">
                <span class="text-2xl">${emojis[n-1]}</span>
                <span class="text-sm font-medium flex-1">${labels[n-1]}</span>
              </label>
            `}).join('')}
          </div>
        </div>
      </div>

      <!-- Digestión -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-3">Digestión</label>
        <div class="grid grid-cols-3 gap-2">
          ${['buena', 'normal', 'mala'].map(dig => `
            <label class="flex items-center justify-center gap-2 p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition ${reg.sentimiento.digestion === dig ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}">
              <input type="radio"
                     name="digestion"
                     value="${dig}"
                     ${reg.sentimiento.digestion === dig ? 'checked' : ''}
                     class="w-4 h-4 text-purple-600">
              <span class="text-sm font-medium capitalize">${dig}</span>
            </label>
          `).join('')}
        </div>
      </div>

      <!-- Notas generales -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Notas del día</label>
        <textarea id="textNotasGenerales"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500"
                  placeholder="Cómo te has sentido hoy, eventos importantes, observaciones...">${reg.notas_generales}</textarea>
      </div>
    </div>
  `;
}

function renderSeccionInformacionPersonal(reg, config) {
  return `
    <div class="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-6 space-y-4">
      <button type="button"
              onclick="toggleInformacionPersonal()"
              class="w-full flex items-center justify-between p-3 bg-white/70 border border-indigo-300 rounded-lg hover:bg-white/90 transition">
        <div class="flex items-center gap-3">
          <i class="fas fa-user-cog text-indigo-600"></i>
          <span class="font-bold text-gray-900">Actualizar mediciones, objetivos, información personal...</span>
        </div>
        <i id="informacionPersonalChevron" class="fas fa-chevron-down text-indigo-600 transition-transform"></i>
      </button>

      <div id="informacionPersonalContent" class="hidden bg-white/70 rounded-lg p-4 space-y-6">

        <!-- Objetivos nutricionales -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
            <i class="fas fa-bullseye text-orange-600"></i>
            Objetivos nutricionales
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Calorías objetivo diarias</label>
              <div class="relative">
                <input type="number"
                       id="inputCaloriasObjetivo"
                       value="${config.objetivos.calorias || ''}"
                       min="800" max="5000" step="50"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500"
                       placeholder="2000">
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">kcal</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Tu objetivo diario de calorías</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Proteínas objetivo diarias</label>
              <div class="relative">
                <input type="number"
                       id="inputProteinasObjetivo"
                       value="${config.objetivos.proteinas || ''}"
                       min="30" max="300" step="5"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500"
                       placeholder="120">
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">g</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">Tu objetivo diario de proteínas</p>
            </div>
          </div>
        </div>

        <!-- Mediciones corporales -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
            <i class="fas fa-weight text-blue-600"></i>
            Mediciones corporales
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Peso corporal</label>
              <div class="relative">
                <input type="number"
                       id="inputPeso"
                       value="${reg.mediciones.peso || ''}"
                       step="0.1" min="30" max="300"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                       placeholder="${config.info_personal.peso_inicial || '70.5'}">
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">kg</span>
              </div>
              ${config.info_personal.peso_inicial ? `<p class="text-xs text-gray-500 mt-1">Peso inicial: ${config.info_personal.peso_inicial} kg</p>` : ''}
              ${config.objetivos.peso_objetivo ? `<p class="text-xs text-green-600 mt-1">Objetivo: ${config.objetivos.peso_objetivo} kg</p>` : ''}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Perímetro abdominal</label>
              <div class="relative">
                <input type="number"
                       id="inputPerimetro"
                       value="${reg.mediciones.perimetro_abdominal || ''}"
                       step="0.1" min="50" max="200"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500"
                       placeholder="${config.info_personal.perimetro_inicial || '85.0'}">
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">cm</span>
              </div>
              ${config.info_personal.perimetro_inicial ? `<p class="text-xs text-gray-500 mt-1">Inicial: ${config.info_personal.perimetro_inicial} cm</p>` : ''}
              ${config.objetivos.perimetro_objetivo ? `<p class="text-xs text-green-600 mt-1">Objetivo: ${config.objetivos.perimetro_objetivo} cm</p>` : ''}
            </div>
          </div>
        </div>

        <!-- Objetivos corporales -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
            <i class="fas fa-target text-green-600"></i>
            Objetivos corporales
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Peso objetivo</label>
              <div class="relative">
                <input type="number"
                       id="inputPesoObjetivo"
                       value="${config.objetivos.peso_objetivo || ''}"
                       step="0.1" min="30" max="300"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500"
                       placeholder="${config.info_personal.peso_inicial ? (config.info_personal.peso_inicial - 5).toFixed(1) : '65.0'}">
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">kg</span>
              </div>
              ${config.info_personal.peso_inicial ? `<p class="text-xs text-gray-500 mt-1">Diferencia: ${config.info_personal.peso_inicial && config.objetivos.peso_objetivo ? ((config.info_personal.peso_inicial - config.objetivos.peso_objetivo) >= 0 ? '-' : '+') + Math.abs(config.info_personal.peso_inicial - config.objetivos.peso_objetivo).toFixed(1) + ' kg' : 'No definido'}</p>` : ''}
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Perímetro abdominal objetivo</label>
              <div class="relative">
                <input type="number"
                       id="inputPerimetroObjetivo"
                       value="${config.objetivos.perimetro_objetivo || ''}"
                       step="0.1" min="50" max="200"
                       class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500"
                       placeholder="${config.info_personal.perimetro_inicial ? (config.info_personal.perimetro_inicial - 5).toFixed(1) : '75.0'}">
                <span class="absolute right-3 top-2.5 text-gray-400 text-sm">cm</span>
              </div>
              ${config.info_personal.perimetro_inicial ? `<p class="text-xs text-gray-500 mt-1">Diferencia: ${config.info_personal.perimetro_inicial && config.objetivos.perimetro_objetivo ? ((config.info_personal.perimetro_inicial - config.objetivos.perimetro_objetivo) >= 0 ? '-' : '+') + Math.abs(config.info_personal.perimetro_inicial - config.objetivos.perimetro_objetivo).toFixed(1) + ' cm' : 'No definido'}</p>` : ''}
            </div>
          </div>
        </div>

        <!-- Progreso e información personal -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2 border-b pb-2">
            <i class="fas fa-chart-line text-indigo-600"></i>
            Progreso y análisis
          </h3>
          ${renderPersonalProgress(reg, config)}
          ${config.info_personal.altura ? renderBMICalculator(reg, config) : ''}
          ${renderWeightTrend(reg)}
          ${renderPerimeterProgress(reg, config)}
        </div>

      </div>
    </div>
  `;
}


// ============= PERSONAL DATA FUNCTIONS =============
function togglePersonalData() {
  const content = document.getElementById('personalDataContent');
  const chevron = document.getElementById('personalDataChevron');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    chevron.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    chevron.style.transform = 'rotate(0deg)';
  }
}

function toggleInformacionPersonal() {
  const content = document.getElementById('informacionPersonalContent');
  const chevron = document.getElementById('informacionPersonalChevron');

  if (content.classList.contains('hidden')) {
    content.classList.remove('hidden');
    chevron.style.transform = 'rotate(180deg)';
  } else {
    content.classList.add('hidden');
    chevron.style.transform = 'rotate(0deg)';
  }
}

function renderPersonalProgress(reg, config) {
  if (!config.info_personal.configurado) {
    return `
      <div class="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <i class="fas fa-info-circle text-yellow-600 text-2xl mb-2"></i>
        <p class="text-sm text-yellow-700">
          <strong>Información personal no configurada</strong><br>
          Ve a Configuración para completar tus datos personales
        </p>
        <a href="#/config" class="inline-block mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition">
          Ir a Configuración
        </a>
      </div>
    `;
  }

  const personalInfo = config.info_personal;
  const objectives = config.objetivos;

  return `
    <div class="grid grid-cols-2 gap-4">

      <!-- Género y altura -->
      <div class="space-y-2">
        <div class="text-xs font-semibold text-purple-600 uppercase tracking-wide">Información básica</div>
        <div class="bg-white rounded-lg p-3 space-y-1">
          ${personalInfo.genero ? `<div class="text-sm"><span class="text-gray-500">Género:</span> <span class="capitalize">${personalInfo.genero}</span></div>` : ''}
          ${personalInfo.altura ? `<div class="text-sm"><span class="text-gray-500">Altura:</span> ${personalInfo.altura} cm</div>` : ''}
        </div>
      </div>

      <!-- Peso inicial vs objetivo -->
      <div class="space-y-2">
        <div class="text-xs font-semibold text-purple-600 uppercase tracking-wide">Objetivos de peso</div>
        <div class="bg-white rounded-lg p-3 space-y-1">
          ${personalInfo.peso_inicial ? `<div class="text-sm"><span class="text-gray-500">Inicial:</span> ${personalInfo.peso_inicial} kg</div>` : ''}
          ${objectives.peso_objetivo ? `<div class="text-sm"><span class="text-gray-500">Objetivo:</span> ${objectives.peso_objetivo} kg</div>` : ''}
          ${reg.mediciones.peso ? `<div class="text-sm font-semibold"><span class="text-gray-500">Actual:</span> ${reg.mediciones.peso} kg</div>` : ''}
        </div>
      </div>

    </div>
  `;
}

function renderBMICalculator(reg, config) {
  const peso = reg.mediciones.peso;
  const altura = config.info_personal.altura;

  if (!peso || !altura) {
    return '';
  }

  const bmi = peso / ((altura / 100) ** 2);
  let categoria = '';
  let colorClass = '';

  if (bmi < 18.5) {
    categoria = 'Bajo peso';
    colorClass = 'text-blue-600 bg-blue-50';
  } else if (bmi < 25) {
    categoria = 'Peso normal';
    colorClass = 'text-green-600 bg-green-50';
  } else if (bmi < 30) {
    categoria = 'Sobrepeso';
    colorClass = 'text-yellow-600 bg-yellow-50';
  } else {
    categoria = 'Obesidad';
    colorClass = 'text-red-600 bg-red-50';
  }

  return `
    <div class="bg-white rounded-lg p-4">
      <div class="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">IMC (Índice de masa corporal)</div>
      <div class="flex items-center justify-between">
        <div>
          <div class="text-2xl font-bold text-gray-900">${bmi.toFixed(1)}</div>
          <div class="text-xs text-gray-500">kg/m²</div>
        </div>
        <div class="text-right">
          <div class="px-3 py-1 rounded-full text-sm font-medium ${colorClass}">
            ${categoria}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderWeightTrend(reg) {
  // Get previous weight measurements
  const registros = Storage.getUltimosRegistros(7);
  const pesos = registros
    .filter(r => r.mediciones.peso)
    .map(r => ({ fecha: r.fecha, peso: r.mediciones.peso }))
    .reverse();

  if (pesos.length < 2) {
    return '';
  }

  const pesoAnterior = pesos[pesos.length - 2].peso;
  const pesoActual = reg.mediciones.peso;

  if (!pesoActual) {
    return '';
  }

  const diferencia = pesoActual - pesoAnterior;
  const esPositivo = diferencia > 0;

  return `
    <div class="bg-white rounded-lg p-4">
      <div class="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">Tendencia de peso (7 días)</div>
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-600">
          Cambio desde ${formatDate(pesos[pesos.length - 2].fecha)}
        </div>
        <div class="flex items-center gap-2">
          <i class="fas fa-${esPositivo ? 'arrow-up' : 'arrow-down'} ${esPositivo ? 'text-red-500' : 'text-green-500'}"></i>
          <span class="font-semibold ${esPositivo ? 'text-red-600' : 'text-green-600'}">
            ${esPositivo ? '+' : ''}${diferencia.toFixed(1)} kg
          </span>
        </div>
      </div>
    </div>
  `;
}

function renderPerimeterProgress(reg, config) {
  if (!config.info_personal.perimetro_inicial && !config.objetivos.perimetro_objetivo && !reg.mediciones.perimetro_abdominal) {
    return '';
  }

  const inicial = config.info_personal.perimetro_inicial;
  const objetivo = config.objetivos.perimetro_objetivo;
  const actual = reg.mediciones.perimetro_abdominal;

  return `
    <div class="bg-white rounded-lg p-4">
      <div class="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2">Progreso perímetro abdominal</div>
      <div class="space-y-2">
        ${inicial ? `<div class="flex justify-between text-sm"><span class="text-gray-500">Inicial:</span><span>${inicial} cm</span></div>` : ''}
        ${actual ? `<div class="flex justify-between text-sm font-semibold"><span class="text-gray-500">Actual:</span><span>${actual} cm</span></div>` : ''}
        ${objetivo ? `<div class="flex justify-between text-sm"><span class="text-gray-500">Objetivo:</span><span>${objetivo} cm</span></div>` : ''}

        ${inicial && actual ? `
          <div class="mt-3 pt-3 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <span class="text-xs text-gray-500">Progreso total</span>
              <span class="font-semibold ${(inicial - actual) > 0 ? 'text-green-600' : 'text-red-600'}">
                ${(inicial - actual) > 0 ? '-' : '+'}${Math.abs(inicial - actual).toFixed(1)} cm
              </span>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ============= RESUMEN NUTRICIONAL =============
function renderResumenNutricional(reg, config) {
  // Calcular totales de comidas
  const totalCaloriasComidas = reg.nutricion.comidas.reduce((sum, c) => sum + (c.calorias || 0), 0);
  const totalProteinasComidas = reg.nutricion.comidas.reduce((sum, c) => sum + (c.proteinas || 0), 0);

  // Calcular totales de excesos
  let totalCaloriasExcesos = 0;
  let totalProteinasExcesos = 0;

  config.consumos_negativos.forEach(consumo => {
    if (reg.nutricion.consumos_negativos.includes(consumo)) {
      const excesoKey = `exceso_${consumo.toLowerCase().replace(/\s+/g, '_')}`;
      const excesoData = reg.nutricion.excesos_data?.[excesoKey] || {};
      totalCaloriasExcesos += excesoData.calorias || 0;
      totalProteinasExcesos += excesoData.proteinas || 0;
    }
  });

  // Totales finales
  const totalCalorias = totalCaloriasComidas + totalCaloriasExcesos;
  const totalProteinas = totalProteinasComidas + totalProteinasExcesos;

  // Porcentajes de objetivos
  const porcentajeCalorias = config.objetivos.calorias ? (totalCalorias / config.objetivos.calorias * 100).toFixed(1) : 0;
  const porcentajeProteinas = config.objetivos.proteinas ? (totalProteinas / config.objetivos.proteinas * 100).toFixed(1) : 0;

  return `
    <div class="text-center">
      <div class="text-2xl font-bold text-orange-600">${totalCalorias}</div>
      <div class="text-xs text-gray-500">kcal totales</div>
      <div class="text-xs text-gray-600 mt-1">
        Comidas: ${totalCaloriasComidas} | Excesos: ${totalCaloriasExcesos}
      </div>
      ${config.objetivos.calorias ? `
        <div class="mt-2 text-xs ${porcentajeCalorias > 110 ? 'text-red-600' : porcentajeCalorias < 90 ? 'text-yellow-600' : 'text-green-600'}">
          ${porcentajeCalorias}% del objetivo
        </div>
      ` : ''}
    </div>

    <div class="text-center">
      <div class="text-2xl font-bold text-red-600">${totalProteinas}</div>
      <div class="text-xs text-gray-500">g proteínas</div>
      <div class="text-xs text-gray-600 mt-1">
        Comidas: ${totalProteinasComidas}g | Excesos: ${totalProteinasExcesos}g
      </div>
      ${config.objetivos.proteinas ? `
        <div class="mt-2 text-xs ${porcentajeProteinas > 110 ? 'text-red-600' : porcentajeProteinas < 90 ? 'text-yellow-600' : 'text-green-600'}">
          ${porcentajeProteinas}% del objetivo
        </div>
      ` : ''}
    </div>
  `;
}

// Actualizar resumen nutricional en tiempo real
function actualizarResumenNutricional() {
  const resumenDiv = document.getElementById('resumenNutricional');
  if (!resumenDiv) return;

  const config = Storage.getConfig();

  // Calcular totales de comidas desde el DOM
  let totalCaloriasComidas = 0;
  let totalProteinasComidas = 0;

  document.querySelectorAll('.comida-row').forEach(row => {
    const calorias = parseFloat(row.querySelector('.comida-calorias')?.value) || 0;
    const proteinas = parseFloat(row.querySelector('.comida-proteinas')?.value) || 0;
    totalCaloriasComidas += calorias;
    totalProteinasComidas += proteinas;
  });

  // Calcular totales de excesos desde el DOM
  let totalCaloriasExcesos = 0;
  let totalProteinasExcesos = 0;

  config.consumos_negativos.forEach(consumo => {
    const excesoKey = `exceso_${consumo.toLowerCase().replace(/\s+/g, '_')}`;
    const caloriasInput = document.getElementById(`exceso_calorias_${excesoKey}`);
    const proteinasInput = document.getElementById(`exceso_proteinas_${excesoKey}`);

    if (caloriasInput) totalCaloriasExcesos += parseFloat(caloriasInput.value) || 0;
    if (proteinasInput) totalProteinasExcesos += parseFloat(proteinasInput.value) || 0;
  });

  // Totales finales
  const totalCalorias = totalCaloriasComidas + totalCaloriasExcesos;
  const totalProteinas = totalProteinasComidas + totalProteinasExcesos;

  // Porcentajes de objetivos
  const porcentajeCalorias = config.objetivos.calorias ? (totalCalorias / config.objetivos.calorias * 100).toFixed(1) : 0;
  const porcentajeProteinas = config.objetivos.proteinas ? (totalProteinas / config.objetivos.proteinas * 100).toFixed(1) : 0;

  // Actualizar el HTML
  resumenDiv.innerHTML = `
    <div class="text-center">
      <div class="text-2xl font-bold text-orange-600">${totalCalorias}</div>
      <div class="text-xs text-gray-500">kcal totales</div>
      <div class="text-xs text-gray-600 mt-1">
        Comidas: ${totalCaloriasComidas} | Excesos: ${totalCaloriasExcesos}
      </div>
      ${config.objetivos.calorias ? `
        <div class="mt-2 text-xs ${porcentajeCalorias > 110 ? 'text-red-600' : porcentajeCalorias < 90 ? 'text-yellow-600' : 'text-green-600'}">
          ${porcentajeCalorias}% del objetivo
        </div>
      ` : ''}
    </div>

    <div class="text-center">
      <div class="text-2xl font-bold text-red-600">${totalProteinas}</div>
      <div class="text-xs text-gray-500">g proteínas</div>
      <div class="text-xs text-gray-600 mt-1">
        Comidas: ${totalProteinasComidas}g | Excesos: ${totalProteinasExcesos}g
      </div>
      ${config.objetivos.proteinas ? `
        <div class="mt-2 text-xs ${porcentajeProteinas > 110 ? 'text-red-600' : porcentajeProteinas < 90 ? 'text-yellow-600' : 'text-green-600'}">
          ${porcentajeProteinas}% del objetivo
        </div>
      ` : ''}
  `;
}

// ============= UI FUNCTIONS =============
function updateIntensidadDisplay(value) {
  const display = document.getElementById('intensidadValue');
  display.textContent = value;

  // Cambiar color según intensidad
  if (value <= 3) {
    display.className = 'font-bold text-lg px-3 py-1 rounded-full bg-green-100 text-green-700';
  } else if (value <= 7) {
    display.className = 'font-bold text-lg px-3 py-1 rounded-full bg-yellow-100 text-yellow-700';
  } else {
    display.className = 'font-bold text-lg px-3 py-1 rounded-full bg-red-100 text-red-700';
  }
}

function updateIntensidadDescansoDisplay(value) {
  const display = document.getElementById('intensidadDescansoValue');
  display.textContent = value;
}

function toggleDescansoActivoDetails(checked) {
  const container = document.getElementById('descansoActivoDetailsContainer');
  if (container) {
    if (checked) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
  }
}

// ============= EXCESOS FUNCTIONS =============
function toggleExcesoInputs(excesoKey, isChecked) {
  const inputsDiv = document.getElementById(`exceso_inputs_${excesoKey}`);
  const chevronIcon = document.querySelector(`input[onchange*="${excesoKey}"]`)?.closest('label')?.querySelector('i');

  if (isChecked) {
    inputsDiv.classList.remove('hidden');
    if (chevronIcon) {
      chevronIcon.className = 'fas fa-chevron-down text-red-500';
    }

    // Añadir event listeners para actualizar resumen en tiempo real
    const caloriasInput = document.getElementById(`exceso_calorias_${excesoKey}`);
    const proteinasInput = document.getElementById(`exceso_proteinas_${excesoKey}`);

    if (caloriasInput) {
      caloriasInput.removeEventListener('input', actualizarResumenNutricional);
      caloriasInput.removeEventListener('change', actualizarResumenNutricional);
      caloriasInput.addEventListener('input', actualizarResumenNutricional);
      caloriasInput.addEventListener('change', actualizarResumenNutricional);
    }

    if (proteinasInput) {
      proteinasInput.removeEventListener('input', actualizarResumenNutricional);
      proteinasInput.removeEventListener('change', actualizarResumenNutricional);
      proteinasInput.addEventListener('input', actualizarResumenNutricional);
      proteinasInput.addEventListener('change', actualizarResumenNutricional);
    }

    // Actualizar resumen inmediatamente
    actualizarResumenNutricional();
  } else {
    inputsDiv.classList.add('hidden');
    if (chevronIcon) {
      chevronIcon.remove();
    }

    // Actualizar resumen al desmarcar
    actualizarResumenNutricional();
  }
}

// ============= HIDRATACIÓN FUNCTIONS =============
function añadirHidratacion(cantidad, tipo = 'Agua') {
  const hora = new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
  añadirBebidaInterna(tipo, cantidad, hora);
}

function toggleHidratacionDetalle() {
  const detalle = document.getElementById('hidratacionDetalle');
  if (detalle) {
    detalle.classList.toggle('hidden');

    // Si se está mostrando el detalle, establecer valores por defecto
    if (!detalle.classList.contains('hidden')) {
      const horaBebida = document.getElementById('horaBebida');
      if (horaBebida && !horaBebida.value) {
        horaBebida.value = new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
      }
    }
  }
}

function añadirHidratacionManual() {
  const tipo = document.getElementById('tipoBebida').value;
  const cantidad = parseInt(document.getElementById('cantidadBebida').value);
  const hora = document.getElementById('horaBebida').value;

  if (!cantidad || cantidad <= 0) {
    window.showToast('Por favor, introduce una cantidad válida', 'error');
    return;
  }

  añadirBebidaInterna(tipo, cantidad, hora);

  // Limpiar campos
  document.getElementById('cantidadBebida').value = '';
  document.getElementById('horaBebida').value = new Date().toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'});
}

function añadirBebidaInterna(tipo, cantidad, hora) {
  if (!currentRegistro.hidratacion) {
    currentRegistro.hidratacion = { total: 0, bebidas: [] };
  }

  const bebida = { tipo, cantidad, hora };
  currentRegistro.hidratacion.bebidas.push(bebida);
  currentRegistro.hidratacion.total += cantidad;

  // Debug: mostrar datos después de añadir
  console.log('Después de añadir bebida:', {
    bebida,
    totalBebidas: currentRegistro.hidratacion.bebidas.length,
    bebidas: currentRegistro.hidratacion.bebidas,
    total: currentRegistro.hidratacion.total
  });

  // Guardar inmediatamente el cambio en localStorage
  Storage.saveRegistro(currentRegistro);

  // Re-renderizar sección de hidratación
  actualizarSeccionHidratacion();

  window.showToast(`Añadido: ${cantidad}ml de ${tipo}`, 'success');
}

function eliminarBebida(index) {
  if (currentRegistro.hidratacion && currentRegistro.hidratacion.bebidas[index]) {
    const bebida = currentRegistro.hidratacion.bebidas[index];
    currentRegistro.hidratacion.total -= bebida.cantidad;
    currentRegistro.hidratacion.bebidas.splice(index, 1);

    // Guardar inmediatamente el cambio en localStorage
    Storage.saveRegistro(currentRegistro);

    actualizarSeccionHidratacion();
    window.showToast(`Eliminado: ${bebida.cantidad}ml de ${bebida.tipo}`, 'info');
  }
}

function actualizarSeccionHidratacion() {
  const container = document.querySelector('.bg-gradient-to-r.from-blue-50.to-cyan-50');
  if (container) {
    const config = Storage.getConfig();
    // Recordar si el detalle estaba expandido
    const detalleExpandido = document.getElementById('hidratacionDetalle') &&
                            !document.getElementById('hidratacionDetalle').classList.contains('hidden');

    // Debug: verificar estado del currentRegistro antes del render
    console.log('actualizarSeccionHidratacion - currentRegistro.hidratacion:', currentRegistro.hidratacion);

    container.outerHTML = renderSeccionHidratacion(currentRegistro, config);

    // Restaurar estado del detalle si estaba expandido
    if (detalleExpandido) {
      const nuevoDetalle = document.getElementById('hidratacionDetalle');
      if (nuevoDetalle) {
        nuevoDetalle.classList.remove('hidden');
      }
    }
  }
}

// Export functions to global scope
window.toggleEntrenamientoDetails = toggleEntrenamientoDetails;
window.toggleDescansoActivoDetails = toggleDescansoActivoDetails;
window.togglePersonalData = togglePersonalData;
window.toggleInformacionPersonal = toggleInformacionPersonal;
window.toggleExcesoInputs = toggleExcesoInputs;
window.updateIntensidadDisplay = updateIntensidadDisplay;
window.updateIntensidadDescansoDisplay = updateIntensidadDescansoDisplay;
window.updateFecha = updateFecha;
window.agregarComida = agregarComida;
window.eliminarComida = eliminarComida;
window.agregarEntrenamiento = agregarEntrenamiento;
window.eliminarEntrenamiento = eliminarEntrenamiento;
window.agregarDescansoActivo = agregarDescansoActivo;
window.eliminarDescansoActivo = eliminarDescansoActivo;
window.updateMacroTotals = updateMacroTotals;
window.getRegistroAnterior = getRegistroAnterior;
window.saveRegistro = saveRegistro;
window.añadirHidratacion = añadirHidratacion;
window.toggleHidratacionDetalle = toggleHidratacionDetalle;
window.añadirHidratacionManual = añadirHidratacionManual;
window.eliminarBebida = eliminarBebida;
