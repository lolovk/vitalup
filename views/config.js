/*********************************************
 * views/config.js
 * Configuración de objetivos y preferencias
 * VERSIÓN 2.0 con consumos negativos editables
 *********************************************/

window.renderConfig = function() {
  const app = document.getElementById('app');
  const config = Storage.getConfig();

  app.innerHTML = `
    <div class="max-w-7xl space-y-6">

      <!-- Navegación rápida (móvil arriba, desktop lateral) -->
      <div class="lg:hidden">
        <div class="bg-white rounded-xl shadow-lg p-4">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-map text-blue-600"></i>
            Navegación rápida
          </h3>
          <nav class="overflow-x-auto scrollbar-hide">
            <div class="flex gap-2 pb-2" style="width: max-content;">
              <a href="#objetivos" class="nav-anchor flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition text-sm whitespace-nowrap">
                <i class="fas fa-bullseye text-blue-600 w-4"></i>
                Objetivos nutricionales
              </a>
              <a href="#personal" class="nav-anchor flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition text-sm whitespace-nowrap">
                <i class="fas fa-user text-indigo-600 w-4"></i>
                Información personal
              </a>
              <a href="#listas" class="nav-anchor flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition text-sm whitespace-nowrap">
                <i class="fas fa-list text-green-600 w-4"></i>
                Listas personalizables
              </a>
              <a href="#datos" class="nav-anchor flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition text-sm whitespace-nowrap">
                <i class="fas fa-database text-purple-600 w-4"></i>
                Gestión de datos
              </a>
              <a href="#peligro" class="nav-anchor flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition text-sm whitespace-nowrap">
                <i class="fas fa-exclamation-triangle text-red-600 w-4"></i>
                Zona de peligro
              </a>
            </div>
          </nav>
        </div>
      </div>

      <!-- Layout principal -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">

        <!-- Contenido principal -->
        <div class="lg:col-span-3 space-y-6">

        <!-- Header -->
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Configuración</h1>
          <p class="text-gray-500 mt-1">Personaliza tu experiencia en VitalUp.me</p>
        </div>

        <!-- Objetivos nutricionales -->
        <div id="objetivos" class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fas fa-bullseye text-blue-600"></i>
            Objetivos nutricionales
          </h2>

          <form id="formObjetivos" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fas fa-fire text-orange-500 mr-1"></i>
                  Calorías diarias objetivo
                </label>
                <div class="relative">
                  <input type="number"
                         name="calorias"
                         value="${config.objetivos.calorias}"
                         class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg font-semibold"
                         required>
                  <span class="absolute right-4 top-3.5 text-gray-400 font-medium">kcal</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Tu objetivo diario de calorías</p>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  <i class="fas fa-drumstick-bite text-red-500 mr-1"></i>
                  Proteínas diarias objetivo
                </label>
                <div class="relative">
                  <input type="number"
                         name="proteinas"
                         value="${config.objetivos.proteinas}"
                         class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 text-lg font-semibold"
                         required>
                  <span class="absolute right-4 top-3.5 text-gray-400 font-medium">g</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">Tu objetivo diario de proteínas</p>
              </div>

            </div>

            <div class="flex justify-end">
              <button type="submit" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                <i class="fas fa-save mr-2"></i>Guardar objetivos
              </button>
            </div>
          </form>
        </div>

        <!-- Información personal -->
        <div id="personal" class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fas fa-user text-indigo-600"></i>
            Información personal
          </h2>

          <form id="formPersonal" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">

              <!-- Información básica -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 border-b pb-2">Datos básicos</h3>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Género</label>
                  <select name="genero" class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500">
                    <option value="">Sin especificar</option>
                    <option value="masculino" ${config.info_personal.genero === 'masculino' ? 'selected' : ''}>Masculino</option>
                    <option value="femenino" ${config.info_personal.genero === 'femenino' ? 'selected' : ''}>Femenino</option>
                    <option value="otro" ${config.info_personal.genero === 'otro' ? 'selected' : ''}>Otro</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Altura</label>
                  <div class="relative">
                    <input type="number"
                           name="altura"
                           value="${config.info_personal.altura || ''}"
                           min="120"
                           max="250"
                           step="0.1"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500"
                           placeholder="175.0">
                    <span class="absolute right-4 top-3.5 text-gray-400 font-medium">cm</span>
                  </div>
                </div>

              </div>

              <!-- Mediciones -->
              <div class="space-y-4">
                <h3 class="text-lg font-semibold text-gray-800 border-b pb-2">Mediciones iniciales</h3>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Peso inicial</label>
                  <div class="relative">
                    <input type="number"
                           name="peso_inicial"
                           value="${config.info_personal.peso_inicial || ''}"
                           min="30"
                           max="300"
                           step="0.1"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500"
                           placeholder="70.0">
                    <span class="absolute right-4 top-3.5 text-gray-400 font-medium">kg</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Perímetro abdominal inicial</label>
                  <div class="relative">
                    <input type="number"
                           name="perimetro_inicial"
                           value="${config.info_personal.perimetro_inicial || ''}"
                           min="50"
                           max="200"
                           step="0.1"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500"
                           placeholder="85.0">
                    <span class="absolute right-4 top-3.5 text-gray-400 font-medium">cm</span>
                  </div>
                </div>

              </div>

            </div>

            <!-- Objetivos físicos -->
            <div class="border-t pt-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Objetivos físicos</h3>
              <div class="grid md:grid-cols-2 gap-6">

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Peso objetivo</label>
                  <div class="relative">
                    <input type="number"
                           name="peso_objetivo"
                           value="${config.objetivos.peso_objetivo || ''}"
                           min="30"
                           max="300"
                           step="0.1"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500"
                           placeholder="65.0">
                    <span class="absolute right-4 top-3.5 text-gray-400 font-medium">kg</span>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Perímetro abdominal objetivo</label>
                  <div class="relative">
                    <input type="number"
                           name="perimetro_objetivo"
                           value="${config.objetivos.perimetro_objetivo || ''}"
                           min="50"
                           max="200"
                           step="0.1"
                           class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500"
                           placeholder="75.0">
                    <span class="absolute right-4 top-3.5 text-gray-400 font-medium">cm</span>
                  </div>
                </div>

              </div>
            </div>

            <div class="flex justify-end">
              <button type="submit" class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold">
                <i class="fas fa-save mr-2"></i>Guardar información personal
              </button>
            </div>
          </form>
        </div>

        <!-- Listas personalizables -->
        <div id="listas" class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fas fa-list text-green-600"></i>
            Listas personalizables
          </h2>

          <div class="space-y-8">

            <!-- Suplementos -->
            <div class="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-pills text-green-600"></i>
                Suplementos habituales
              </h3>
              <div id="listSupplementos" class="space-y-2 mb-4">
                ${config.suplementos_habituales.map((sup, idx) => `
                  <div class="flex items-center gap-2 p-2 bg-white rounded-lg cursor-move sortable-item"
                       draggable="true"
                       data-list="suplementos_habituales"
                       data-index="${idx}"
                       ondragstart="handleDragStart(event)"
                       ondragover="handleDragOver(event)"
                       ondrop="handleDrop(event)"
                       ondragend="handleDragEnd(event)">
                    <i class="fas fa-grip-vertical text-gray-400 mr-2"></i>
                    <span class="flex-1 text-sm font-medium">${sup}</span>
                    <button onclick="eliminarSuplemento(${idx})" class="text-red-600 hover:text-red-800 px-2">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
              <div class="flex gap-2">
                <input type="text" id="nuevoSuplemento" placeholder="Nuevo suplemento..." class="flex-1 px-3 py-2 border rounded-lg text-sm">
                <button onclick="agregarSuplemento()" class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">
                  <i class="fas fa-plus mr-1"></i>Añadir
                </button>
              </div>
            </div>

            <!-- Consumos negativos -->
            <div class="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-exclamation-triangle text-red-600"></i>
                Consumos a evitar
              </h3>
              <div id="listConsumos" class="space-y-2 mb-4">
                ${config.consumos_negativos.map((con, idx) => `
                  <div class="flex items-center gap-2 p-2 bg-white rounded-lg cursor-move sortable-item"
                       draggable="true"
                       data-list="consumos_negativos"
                       data-index="${idx}"
                       ondragstart="handleDragStart(event)"
                       ondragover="handleDragOver(event)"
                       ondrop="handleDrop(event)"
                       ondragend="handleDragEnd(event)">
                    <i class="fas fa-grip-vertical text-gray-400 mr-2"></i>
                    <span class="flex-1 text-sm font-medium">${con}</span>
                    <button onclick="eliminarConsumo(${idx})" class="text-red-600 hover:text-red-800 px-2">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
              <div class="flex gap-2">
                <input type="text" id="nuevoConsumo" placeholder="Nuevo consumo a evitar..." class="flex-1 px-3 py-2 border rounded-lg text-sm">
                <button onclick="agregarConsumo()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                  <i class="fas fa-plus mr-1"></i>Añadir
                </button>
              </div>
            </div>

            <!-- Tipos de comida -->
            <div class="bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-utensils text-orange-600"></i>
                Tipos de comida
              </h3>
              <div id="listTiposComida" class="space-y-2 mb-4">
                ${config.tipos_comida.map((tipo, idx) => `
                  <div class="flex items-center gap-2 p-2 bg-white rounded-lg cursor-move sortable-item"
                       draggable="true"
                       data-list="tipos_comida"
                       data-index="${idx}"
                       ondragstart="handleDragStart(event)"
                       ondragover="handleDragOver(event)"
                       ondrop="handleDrop(event)"
                       ondragend="handleDragEnd(event)">
                    <i class="fas fa-grip-vertical text-gray-400 mr-2"></i>
                    <span class="flex-1 text-sm font-medium">${tipo}</span>
                    <button onclick="eliminarTipoComida(${idx})" class="text-red-600 hover:text-red-800 px-2">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
              <div class="flex gap-2">
                <input type="text" id="nuevoTipoComida" placeholder="Nuevo tipo de comida..." class="flex-1 px-3 py-2 border rounded-lg text-sm">
                <button onclick="agregarTipoComida()" class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm">
                  <i class="fas fa-plus mr-1"></i>Añadir
                </button>
              </div>
            </div>

            <!-- Tipos de ejercicio -->
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-dumbbell text-blue-600"></i>
                Tipos de ejercicio
              </h3>
              <div id="listTiposEjercicio" class="space-y-2 mb-4">
                ${config.tipos_ejercicio.map((tipo, idx) => `
                  <div class="flex items-center gap-2 p-2 bg-white rounded-lg cursor-move sortable-item"
                       draggable="true"
                       data-list="tipos_ejercicio"
                       data-index="${idx}"
                       ondragstart="handleDragStart(event)"
                       ondragover="handleDragOver(event)"
                       ondrop="handleDrop(event)"
                       ondragend="handleDragEnd(event)">
                    <i class="fas fa-grip-vertical text-gray-400 mr-2"></i>
                    <span class="flex-1 text-sm font-medium">${tipo}</span>
                    <button onclick="eliminarTipoEjercicio(${idx})" class="text-red-600 hover:text-red-800 px-2">
                      <i class="fas fa-trash text-sm"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
              <div class="flex gap-2">
                <input type="text" id="nuevoTipoEjercicio" placeholder="Nuevo tipo de ejercicio..." class="flex-1 px-3 py-2 border rounded-lg text-sm">
                <button onclick="agregarTipoEjercicio()" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                  <i class="fas fa-plus mr-1"></i>Añadir
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Respaldo de datos -->
        <div id="datos" class="bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <i class="fas fa-database text-purple-600"></i>
            Gestión de datos
          </h2>

          <div class="grid md:grid-cols-2 gap-6">

            <!-- Exportar datos -->
            <div class="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i class="fas fa-file-export text-green-600"></i>
                Exportar datos
              </h3>
              <p class="text-sm text-gray-600 mb-4">
                Descarga una copia de seguridad con todos tus registros y configuración.
              </p>
              <button onclick="Storage.exportarTodo()"
                      class="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                <i class="fas fa-download mr-2"></i>
                Exportar backup completo
              </button>
            </div>

            <!-- Importar datos -->
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 class="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <i class="fas fa-file-import text-blue-600"></i>
                Importar datos
              </h3>
              <p class="text-sm text-gray-600 mb-4">
                Restaura datos desde un archivo de respaldo anterior.
              </p>
              <label class="w-full inline-block">
                <input type="file"
                       accept=".json"
                       class="hidden"
                       onchange="handleImportConfig(this)">
                <div class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold text-center cursor-pointer">
                  <i class="fas fa-upload mr-2"></i>
                  Seleccionar archivo
                </div>
              </label>
            </div>

          </div>
        </div>

        <!-- Zona de peligro -->
        <div id="peligro" class="bg-white rounded-xl shadow-lg border border-red-300 p-6">
          <h2 class="text-xl font-bold text-red-600 mb-6 flex items-center gap-2">
            <i class="fas fa-exclamation-triangle text-red-600"></i>
            Zona de peligro
          </h2>

          <div class="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 class="font-bold text-red-900 mb-3">Borrar todos los datos</h3>
            <p class="text-sm text-red-700 mb-4">
              <strong>⚠️ Acción irreversible:</strong> Esto eliminará permanentemente todos tus registros, configuración y preferencias. No se puede deshacer.
            </p>
            <button onclick="Storage.resetTodo()"
                    class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold">
              <i class="fas fa-trash-alt mr-2"></i>
              Borrar todo permanentemente
            </button>
          </div>
        </div>

      </div>

        <!-- Menú de navegación lateral (solo desktop) -->
        <div class="lg:col-span-1 hidden lg:block">
          <div class="sticky top-24">
            <div class="bg-white rounded-xl shadow-lg p-4">
              <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i class="fas fa-map text-blue-600"></i>
                Navegación rápida
              </h3>
              <nav class="space-y-2">
                <a href="#objetivos" class="nav-anchor flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 transition text-sm">
                  <i class="fas fa-bullseye text-blue-600 w-4"></i>
                  Objetivos nutricionales
                </a>
                <a href="#personal" class="nav-anchor flex items-center gap-2 p-2 rounded-lg hover:bg-indigo-50 transition text-sm">
                  <i class="fas fa-user text-indigo-600 w-4"></i>
                  Información personal
                </a>
                <a href="#listas" class="nav-anchor flex items-center gap-2 p-2 rounded-lg hover:bg-green-50 transition text-sm">
                  <i class="fas fa-list text-green-600 w-4"></i>
                  Listas personalizables
                </a>
                <a href="#datos" class="nav-anchor flex items-center gap-2 p-2 rounded-lg hover:bg-purple-50 transition text-sm">
                  <i class="fas fa-database text-purple-600 w-4"></i>
                  Gestión de datos
                </a>
                <a href="#peligro" class="nav-anchor flex items-center gap-2 p-2 rounded-lg hover:bg-red-50 transition text-sm">
                  <i class="fas fa-exclamation-triangle text-red-600 w-4"></i>
                  Zona de peligro
                </a>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  setupConfigListeners();
};

function setupConfigListeners() {
  // Formulario de objetivos
  document.getElementById('formObjetivos').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const config = Storage.getConfig();
    config.objetivos.calorias = parseInt(formData.get('calorias'));
    config.objetivos.proteinas = parseInt(formData.get('proteinas'));

    Storage.saveConfig(config);
    showToast('✓ Objetivos actualizados', 'success');
  });

  // Formulario de información personal
  document.getElementById('formPersonal').addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const config = Storage.getConfig();

    // Actualizar información personal
    config.info_personal.genero = formData.get('genero') || null;
    config.info_personal.altura = parseFloat(formData.get('altura')) || null;
    config.info_personal.peso_inicial = parseFloat(formData.get('peso_inicial')) || null;
    config.info_personal.perimetro_inicial = parseFloat(formData.get('perimetro_inicial')) || null;
    config.info_personal.configurado = true;

    // Actualizar objetivos físicos
    config.objetivos.peso_objetivo = parseFloat(formData.get('peso_objetivo')) || null;
    config.objetivos.perimetro_objetivo = parseFloat(formData.get('perimetro_objetivo')) || null;

    Storage.saveConfig(config);
    showToast('✓ Información personal actualizada', 'success');
  });

  // Navegación suave
  document.querySelectorAll('.nav-anchor').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Efecto visual
        target.style.transform = 'scale(1.02)';
        target.style.transition = 'transform 0.2s';
        setTimeout(() => {
          target.style.transform = 'scale(1)';
        }, 200);
      }
    });
  });
}

// Funciones para gestionar listas
function agregarSuplemento() {
  const input = document.getElementById('nuevoSuplemento');
  const valor = input.value.trim();

  if (!valor) return;

  const config = Storage.getConfig();
  if (!config.suplementos_habituales.includes(valor)) {
    config.suplementos_habituales.push(valor);
    Storage.saveConfig(config);
    input.value = '';
    renderConfig();
    showToast('✓ Suplemento añadido', 'success');
  } else {
    showToast('✗ Ya existe ese suplemento', 'error');
  }
}

function eliminarSuplemento(idx) {
  const config = Storage.getConfig();
  const eliminado = config.suplementos_habituales.splice(idx, 1)[0];
  Storage.saveConfig(config);
  renderConfig();
  showToast(`✓ "${eliminado}" eliminado`, 'success');
}

function agregarConsumo() {
  const input = document.getElementById('nuevoConsumo');
  const valor = input.value.trim();

  if (!valor) return;

  const config = Storage.getConfig();
  if (!config.consumos_negativos.includes(valor)) {
    config.consumos_negativos.push(valor);
    Storage.saveConfig(config);
    input.value = '';
    renderConfig();
    showToast('✓ Consumo añadido', 'success');
  } else {
    showToast('✗ Ya existe ese consumo', 'error');
  }
}

function eliminarConsumo(idx) {
  const config = Storage.getConfig();
  const eliminado = config.consumos_negativos.splice(idx, 1)[0];
  Storage.saveConfig(config);
  renderConfig();
  showToast(`✓ "${eliminado}" eliminado`, 'success');
}

function agregarTipoComida() {
  const input = document.getElementById('nuevoTipoComida');
  const valor = input.value.trim();

  if (!valor) return;

  const config = Storage.getConfig();
  if (!config.tipos_comida.includes(valor)) {
    config.tipos_comida.push(valor);
    Storage.saveConfig(config);
    input.value = '';
    renderConfig();
    showToast('✓ Tipo de comida añadido', 'success');
  } else {
    showToast('✗ Ya existe ese tipo de comida', 'error');
  }
}

function eliminarTipoComida(idx) {
  const config = Storage.getConfig();

  if (config.tipos_comida.length <= 1) {
    showToast('✗ Debe haber al menos un tipo de comida', 'error');
    return;
  }

  const eliminado = config.tipos_comida.splice(idx, 1)[0];
  Storage.saveConfig(config);
  renderConfig();
  showToast(`✓ "${eliminado}" eliminado`, 'success');
}

function agregarTipoEjercicio() {
  const input = document.getElementById('nuevoTipoEjercicio');
  const valor = input.value.trim();

  if (!valor) return;

  const config = Storage.getConfig();
  if (!config.tipos_ejercicio.includes(valor)) {
    config.tipos_ejercicio.push(valor);
    Storage.saveConfig(config);
    input.value = '';
    renderConfig();
    showToast('✓ Tipo de ejercicio añadido', 'success');
  } else {
    showToast('✗ Ya existe ese tipo de ejercicio', 'error');
  }
}

function eliminarTipoEjercicio(idx) {
  const config = Storage.getConfig();

  if (config.tipos_ejercicio.length <= 1) {
    showToast('✗ Debe haber al menos un tipo de ejercicio', 'error');
    return;
  }

  const eliminado = config.tipos_ejercicio.splice(idx, 1)[0];
  Storage.saveConfig(config);
  renderConfig();
  showToast(`✓ "${eliminado}" eliminado`, 'success');
}

async function handleImportConfig(input) {
  const file = input.files[0];
  if (!file) return;

  try {
    await Storage.importarTodo(file);
    showToast('✓ Datos importados correctamente', 'success');
    setTimeout(() => {
      renderConfig(); // Recargar la vista con los nuevos datos
    }, 1000);
  } catch (err) {
    showToast('✗ Error al importar: ' + err.message, 'error');
  }

  input.value = '';
}

// ============= DRAG AND DROP =============
let draggedElement = null;
let draggedIndex = null;
let draggedList = null;

function handleDragStart(event) {
  draggedElement = event.target;
  draggedIndex = parseInt(event.target.dataset.index);
  draggedList = event.target.dataset.list;
  event.target.style.opacity = '0.5';
}

function handleDragOver(event) {
  event.preventDefault();
  const target = event.target.closest('.sortable-item');
  if (target && target !== draggedElement && target.dataset.list === draggedList) {
    target.style.borderTop = '2px solid #3b82f6';
  }
}

function handleDrop(event) {
  event.preventDefault();
  const target = event.target.closest('.sortable-item');

  if (target && target !== draggedElement && target.dataset.list === draggedList) {
    const targetIndex = parseInt(target.dataset.index);
    reorderList(draggedList, draggedIndex, targetIndex);
    target.style.borderTop = '';
  }
}

function handleDragEnd(event) {
  event.target.style.opacity = '';
  document.querySelectorAll('.sortable-item').forEach(item => {
    item.style.borderTop = '';
  });
  draggedElement = null;
  draggedIndex = null;
  draggedList = null;
}

function reorderList(listName, fromIndex, toIndex) {
  const config = Storage.getConfig();
  const list = config[listName];
  const item = list.splice(fromIndex, 1)[0];
  list.splice(toIndex, 0, item);

  Storage.saveConfig(config);
  renderConfig();
  showToast('✓ Orden actualizado', 'success');
}

// Exportar funciones globales
window.agregarSuplemento = agregarSuplemento;
window.eliminarSuplemento = eliminarSuplemento;
window.agregarConsumo = agregarConsumo;
window.eliminarConsumo = eliminarConsumo;
window.agregarTipoComida = agregarTipoComida;
window.eliminarTipoComida = eliminarTipoComida;
window.agregarTipoEjercicio = agregarTipoEjercicio;
window.eliminarTipoEjercicio = eliminarTipoEjercicio;
window.handleImportConfig = handleImportConfig;
window.handleDragStart = handleDragStart;
window.handleDragOver = handleDragOver;
window.handleDrop = handleDrop;
window.handleDragEnd = handleDragEnd;