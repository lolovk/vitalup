/*********************************************
 * views/registros.js
 * Vista de tabla de registros históricos
 * VERSIÓN 2.0 con columnas personalizables
 *********************************************/

window.renderRegistros = function() {
  const app = document.getElementById('app');
  const registros = Storage.getRegistros().sort((a, b) => b.fecha.localeCompare(a.fecha));
  const config = Storage.getConfig();
  
  app.innerHTML = `
    <!-- Modal selector de columnas -->
    <div id="columnSelector" class="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-600 to-gray-700 text-white">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <i class="fas fa-columns"></i>
            Configurar columnas
          </h3>
          <button onclick="toggleColumnSelector()" class="p-2 hover:bg-white/20 rounded-lg transition">
            <i class="fas fa-times text-xl"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6">
          <h4 class="font-semibold text-gray-900 mb-3">Selecciona las columnas que quieres ver:</h4>
          <div class="grid grid-cols-2 gap-3">
            ${getAvailableColumns().map(col => `
              <label class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input type="checkbox"
                       value="${col.id}"
                       ${config.preferencias.columnas_visibles.includes(col.id) ? 'checked' : ''}
                       onchange="toggleColumn(this)"
                       class="w-4 h-4 text-blue-600 rounded">
                <span class="text-sm font-medium">${col.nombre}</span>
              </label>
            `).join('')}
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
          <button onclick="aplicarColumnasYCerrar()" class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Aplicar
          </button>
          <button onclick="cancelarColumnas()" class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    </div>

    <div class="space-y-6">

      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Registros</h1>
          <p class="text-gray-500 mt-1">${registros.length} registros en total</p>
        </div>
        
        <div class="flex gap-2">
          <button onclick="Storage.exportarTodo()" 
                  class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
            <i class="fas fa-file-export mr-2"></i>Exportar
          </button>
          <label class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition cursor-pointer">
            <i class="fas fa-file-import mr-2"></i>Importar
            <input type="file" 
                   accept=".json" 
                   class="hidden" 
                   onchange="handleImport(this)">
          </label>
        </div>
      </div>
      
      <!-- Selector de columnas (oculto por defecto) -->
      <div id="columnSelector" class="hidden bg-white rounded-xl shadow p-4">
        <h3 class="font-bold text-gray-900 mb-3">Seleccionar columnas visibles</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          ${getAvailableColumns().map(col => `
            <label class="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input type="checkbox" 
                     value="${col.id}"
                     ${config.preferencias.columnas_visibles.includes(col.id) ? 'checked' : ''}
                     onchange="toggleColumn(this)"
                     class="w-4 h-4 text-blue-600 rounded">
              <span class="text-sm">${col.nombre}</span>
            </label>
          `).join('')}
        </div>
      </div>
      
      <!-- Filtros -->
      <div class="bg-white rounded-xl shadow p-4">
        <div class="space-y-4">
          <!-- Botones de filtro rápido (horizontal en móvil) -->
          <div>
            <h4 class="text-sm font-semibold text-gray-700 mb-2">Filtros rápidos</h4>
            <div class="overflow-x-auto">
              <div class="flex gap-2 pb-2" style="width: max-content;">
                <button onclick="filtrarPorDias(7)"
                        class="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm whitespace-nowrap">
                  Últimos 7 días
                </button>
                <button onclick="filtrarPorDias(30)"
                        class="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm whitespace-nowrap">
                  Últimos 30 días
                </button>
                <button onclick="filtrarPorDias(90)"
                        class="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm whitespace-nowrap">
                  Últimos 3 meses
                </button>
                <button onclick="limpiarFiltros()"
                        class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm whitespace-nowrap">
                  Todos los registros
                </button>
              </div>
            </div>
          </div>

          <!-- Filtros personalizados -->
          <div class="grid md:grid-cols-3 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rango de fechas</label>
              <input type="text"
                     id="filtroRangoFechas"
                     class="px-3 py-2 border border-gray-300 rounded-lg w-full"
                     placeholder="Seleccionar rango..."
                     readonly
                     onclick="abrirSelectorRango()">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Entrenamiento</label>
              <select id="filtroEntrenamiento"
                      onchange="aplicarFiltros()"
                      class="px-3 py-2 border border-gray-300 rounded-lg w-full">
                <option value="">Todos los días</option>
                <option value="con">Con entrenamiento</option>
                <option value="sin">Sin entrenamiento</option>
              </select>
            </div>
            <div class="flex items-end">
              <button onclick="aplicarFiltros()"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full">
                <i class="fas fa-filter mr-2"></i>Filtrar
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tabla -->
      <div class="bg-white rounded-xl shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-gray-100 border-b border-gray-200">
              <tr id="tableHeader" class="relative">
                ${renderTableHeader(config)}
                <!-- Botón de columnas en la esquina derecha del header -->
                <th class="px-2 py-3 text-center sticky right-0 bg-gray-100">
                  <button onclick="toggleColumnSelector()"
                          class="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition text-xs"
                          title="Configurar columnas">
                    <i class="fas fa-cog"></i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody id="tablaBody">
              ${renderTablaBody(registros, config)}
            </tbody>
          </table>
        </div>
      </div>
      
      ${registros.length === 0 ? `
        <div class="text-center py-12 bg-white rounded-xl shadow">
          <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-bold text-gray-700 mb-2">No hay registros todavía</h3>
          <p class="text-gray-500 mb-6">Empieza a registrar tus días para ver el historial aquí</p>
          <button onclick="openModal(null, 'rapido')" 
                  class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <i class="fas fa-plus mr-2"></i>Crear primer registro
          </button>
        </div>
      ` : ''}
      
    </div>
  `;

  setupDragAndDrop();
};

function getAvailableColumns() {
  return [
    { id: 'fecha', nombre: 'Fecha' },
    { id: 'calorias', nombre: 'Calorías' },
    { id: 'proteinas', nombre: 'Proteínas' },
    { id: 'entreno', nombre: 'Entrenamiento' },
    { id: 'consumos', nombre: 'Consumos negativos' },
    { id: 'sueno', nombre: 'Sueño' },
    { id: 'peso', nombre: 'Peso' },
    { id: 'perimetro', nombre: 'Perímetro abd.' },
    { id: 'animo', nombre: 'Ánimo' },
    { id: 'energia', nombre: 'Energía' },
    { id: 'acciones', nombre: 'Acciones' }
  ];
}

function renderTableHeader(config) {
  const columnas = getAvailableColumns();
  const visibles = config.preferencias.columnas_visibles;
  
  return columnas
    .filter(col => visibles.includes(col.id))
    .map(col => {
      const align = col.id === 'fecha' ? 'text-left' : 'text-center';
      return `<th class="px-4 py-3 ${align} font-semibold text-gray-700">${col.nombre}</th>`;
    })
    .join('');
}

function renderTablaBody(registros, config) {
  if (registros.length === 0) return '';
  
  const visibles = config.preferencias.columnas_visibles;
  
  return registros.map(r => {
    const cumpleCalorias = r.nutricion.calorias && 
                          Math.abs(r.nutricion.calorias - config.objetivos.calorias) <= config.objetivos.calorias * 0.1;
    const cumpleProteinas = r.nutricion.proteinas && 
                           r.nutricion.proteinas >= config.objetivos.proteinas * 0.9;
    
    const tieneConsumosNegativos = r.nutricion.consumos_negativos && 
                                    r.nutricion.consumos_negativos.length > 0;
    
    let html = '<tr class="border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer" onclick="openModal(\'' + r.fecha + '\', \'completo\')">';
    
    // Fecha
    if (visibles.includes('fecha')) {
      html += `
        <td class="px-4 py-3 font-medium text-gray-900">
          ${formatDate(r.fecha)}
          <div class="text-xs text-gray-500">
            ${new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short' })}
          </div>
        </td>
      `;
    }
    
    // Calorías
    if (visibles.includes('calorias')) {
      html += `
        <td class="px-4 py-3 text-center">
          ${r.nutricion.calorias !== null ? `
            <span class="font-semibold ${cumpleCalorias ? 'text-green-600' : 'text-gray-900'}">
              ${r.nutricion.calorias}
            </span>
            ${cumpleCalorias ? '<i class="fas fa-check text-green-500 ml-1 text-xs"></i>' : ''}
          ` : '<span class="text-gray-400">—</span>'}
        </td>
      `;
    }
    
    // Proteínas
    if (visibles.includes('proteinas')) {
      html += `
        <td class="px-4 py-3 text-center">
          ${r.nutricion.proteinas !== null ? `
            <span class="font-semibold ${cumpleProteinas ? 'text-green-600' : 'text-gray-900'}">
              ${r.nutricion.proteinas}g
            </span>
            ${cumpleProteinas ? '<i class="fas fa-check text-green-500 ml-1 text-xs"></i>' : ''}
          ` : '<span class="text-gray-400">—</span>'}
        </td>
      `;
    }
    
    // Entrenamiento
    if (visibles.includes('entreno')) {
      html += `
        <td class="px-4 py-3 text-center">
          ${r.entrenamiento.hecho ? 
            `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              <i class="fas fa-check mr-1"></i>${r.entrenamiento.tipo || 'Sí'}
            </span>` : 
            `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              <i class="fas fa-times mr-1"></i>No
            </span>`
          }
        </td>
      `;
    }
    
    // Consumos negativos
    if (visibles.includes('consumos')) {
      html += `
        <td class="px-4 py-3 text-center">
          ${tieneConsumosNegativos ? 
            `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              ${r.nutricion.consumos_negativos.join(', ')}
            </span>` : 
            '<i class="fas fa-check-circle text-green-500 text-lg"></i>'
          }
        </td>
      `;
    }
    
    // Sueño
    if (visibles.includes('sueno')) {
      html += `
        <td class="px-4 py-3 text-center">
          ${r.sueno.horas !== null ? `
            <span class="font-semibold ${r.sueno.horas >= 7 ? 'text-green-600' : 'text-yellow-600'}">
              ${r.sueno.horas.toFixed(1)}h
            </span>
          ` : '<span class="text-gray-400">—</span>'}
        </td>
      `;
    }
    
    // Peso
    if (visibles.includes('peso')) {
      html += `
        <td class="px-4 py-3 text-center">
          ${r.mediciones.peso !== null ? `
            <span class="font-semibold text-gray-900">${r.mediciones.peso} kg</span>
          ` : '<span class="text-gray-400">—</span>'}
        </td>
      `;
    }
    
    // Perímetro
    if (visibles.includes('perimetro')) {
      html += `
        <td class="px-4 py-3 text-center">
          ${r.mediciones.perimetro_abdominal !== null ? `
            <span class="font-semibold text-gray-900">${r.mediciones.perimetro_abdominal} cm</span>
          ` : '<span class="text-gray-400">—</span>'}
        </td>
      `;
    }
    
    // Ánimo
    if (visibles.includes('animo')) {
      html += `
        <td class="px-4 py-3 text-center">
          <span class="text-2xl">${['😔','😐','🙂','😀'][r.sentimiento.animo - 1] || '😐'}</span>
        </td>
      `;
    }
    
    // Energía
    if (visibles.includes('energia')) {
      html += `
        <td class="px-4 py-3 text-center">
          <span class="text-2xl">${['😩','😐','🙂','💪'][r.sentimiento.energia - 1] || '😐'}</span>
        </td>
      `;
    }
    
    // Acciones
    if (visibles.includes('acciones')) {
      html += `
        <td class="px-4 py-3 text-center" onclick="event.stopPropagation()">
          <div class="flex items-center justify-center gap-2">
            <button onclick="openModal('${r.fecha}', 'completo')" 
                    class="text-blue-600 hover:text-blue-800"
                    title="Editar">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="confirmarBorrar('${r.fecha}')" 
                    class="text-red-600 hover:text-red-800"
                    title="Borrar">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
    }

    // Celda extra para botón de configuración (mantener alineación con header)
    html += '<td class="px-2 py-3 sticky right-0 bg-white"></td>';

    html += '</tr>';
    return html;
  }).join('');
}

function toggleColumnSelector() {
  const selector = document.getElementById('columnSelector');
  const isOpening = selector.classList.contains('hidden');

  if (isOpening) {
    // Inicializar estado temporal cuando se abre el modal
    const config = Storage.getConfig();
    originalColumnasVisibles = [...config.preferencias.columnas_visibles];
    tempColumnasVisibles = [...config.preferencias.columnas_visibles];
  }

  selector.classList.toggle('hidden');
}

// Variables temporales para gestionar el estado del modal
let tempColumnasVisibles = [];
let originalColumnasVisibles = [];

function toggleColumn(checkbox) {
  // Solo actualizar el estado temporal, no guardar ni refrescar
  const columnId = checkbox.value;

  if (checkbox.checked) {
    if (!tempColumnasVisibles.includes(columnId)) {
      tempColumnasVisibles.push(columnId);
    }
  } else {
    tempColumnasVisibles = tempColumnasVisibles.filter(col => col !== columnId);
  }
}

function aplicarColumnasYCerrar() {
  const config = Storage.getConfig();
  config.preferencias.columnas_visibles = [...tempColumnasVisibles];
  Storage.saveConfig(config);
  toggleColumnSelector();
  renderRegistros();
}

function cancelarColumnas() {
  // Restaurar estado original y cerrar modal
  tempColumnasVisibles = [...originalColumnasVisibles];
  toggleColumnSelector();
}

function aplicarFiltros() {
  console.log('🔍 Aplicando filtros...');

  const rangoFechas = document.getElementById('filtroRangoFechas').dataset.range;
  const entrenamiento = document.getElementById('filtroEntrenamiento').value;

  console.log('Rango de fechas:', rangoFechas);
  console.log('Filtro entrenamiento:', entrenamiento);

  let registros = Storage.getRegistros();
  console.log('Registros totales:', registros.length);
  console.log('Fechas de los registros:', registros.map(r => r.fecha));

  // Filtro por rango de fechas
  if (rangoFechas) {
    const [desde, hasta] = rangoFechas.split(' - ');
    console.log('Filtrando desde:', desde, 'hasta:', hasta);
    const registrosAntes = registros.length;
    registros = registros.filter(r => r.fecha >= desde && r.fecha <= hasta);
    console.log('Registros después del filtro de fechas:', registros.length, 'de', registrosAntes);
  }

  // Filtro por entrenamiento
  if (entrenamiento === 'con') {
    const registrosAntes = registros.length;
    registros = registros.filter(r => r.entrenamiento.hecho);
    console.log('Registros con entrenamiento:', registros.length, 'de', registrosAntes);
  } else if (entrenamiento === 'sin') {
    const registrosAntes = registros.length;
    registros = registros.filter(r => !r.entrenamiento.hecho);
    console.log('Registros sin entrenamiento:', registros.length, 'de', registrosAntes);
  }

  console.log('Registros finales para mostrar:', registros.length);

  // Ordenar
  registros.sort((a, b) => b.fecha.localeCompare(a.fecha));

  // Re-renderizar tabla
  const config = Storage.getConfig();
  document.getElementById('tablaBody').innerHTML = renderTablaBody(registros, config);
}

function confirmarBorrar(fecha) {
  if (confirm(`¿Estás seguro de que quieres borrar el registro del ${formatDate(fecha)}?`)) {
    Storage.deleteRegistro(fecha);
    showToast('Registro eliminado', 'success');
    renderRegistros();
  }
}

async function handleImport(input) {
  const file = input.files[0];
  if (!file) return;
  
  try {
    await Storage.importarTodo(file);
    showToast('✓ Datos importados correctamente', 'success');
    renderRegistros();
  } catch (err) {
    showToast('✗ Error al importar: ' + err.message, 'error');
  }
  
  input.value = '';
}

function filtrarPorDias(dias) {
  // Obtener todos los registros para determinar el año más reciente
  const registros = Storage.getRegistros();
  let fechaReferencia = new Date();

  // Si hay registros, usar la fecha más reciente de los registros
  if (registros.length > 0) {
    const fechasRegistros = registros.map(r => new Date(r.fecha + 'T00:00:00'));
    fechaReferencia = new Date(Math.max(...fechasRegistros));
  }

  const hoy = new Date(fechaReferencia);
  const desde = new Date(fechaReferencia);
  desde.setDate(hoy.getDate() - dias);

  const desdeStr = desde.toISOString().split('T')[0];
  const hastaStr = hoy.toISOString().split('T')[0];

  console.log('🗓️ Filtro por días:', { dias, fechaReferencia: fechaReferencia.toISOString().split('T')[0], hoy: hastaStr, desde: desdeStr });

  // Actualizar el campo de rango
  const input = document.getElementById('filtroRangoFechas');
  input.value = `${formatDate(desdeStr)} - ${formatDate(hastaStr)}`;
  input.dataset.range = `${desdeStr} - ${hastaStr}`;

  aplicarFiltros();
}

function limpiarFiltros() {
  // Limpiar campos
  document.getElementById('filtroRangoFechas').value = '';
  document.getElementById('filtroRangoFechas').dataset.range = '';
  document.getElementById('filtroEntrenamiento').value = '';

  // Mostrar todos los registros
  renderRegistros();
}

function abrirSelectorRango() {
  // Crear un modal simple para selector de rango
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4';
  modal.id = 'modalRangoFechas';

  const modalContent = document.createElement('div');
  modalContent.className = 'bg-white rounded-2xl shadow-2xl w-full max-w-md';
  modalContent.innerHTML = `
    <div class="px-6 py-4 border-b border-gray-200">
      <h3 class="text-xl font-bold text-gray-900">Seleccionar rango de fechas</h3>
    </div>
    <div class="p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Desde</label>
        <input type="date" id="modalDesde" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
        <input type="date" id="modalHasta" class="w-full px-3 py-2 border border-gray-300 rounded-lg">
      </div>
    </div>
    <div class="px-6 py-4 border-t border-gray-200 flex gap-2">
      <button id="btnCancelarRango" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
        Cancelar
      </button>
      <button id="btnAplicarRango" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Aplicar
      </button>
    </div>
  `;

  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Agregar event listeners
  document.getElementById('btnCancelarRango').addEventListener('click', cerrarModalRango);
  document.getElementById('btnAplicarRango').addEventListener('click', aplicarRango);

  // Cerrar al hacer clic en el fondo
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      cerrarModalRango();
    }
  });

  // Rellenar valores actuales si existen
  const rangoActual = document.getElementById('filtroRangoFechas').dataset.range;
  if (rangoActual) {
    const [desde, hasta] = rangoActual.split(' - ');
    document.getElementById('modalDesde').value = desde;
    document.getElementById('modalHasta').value = hasta;
  }
}

function cerrarModalRango() {
  const modal = document.getElementById('modalRangoFechas');
  if (modal) modal.remove();
}

function aplicarRango() {
  const desde = document.getElementById('modalDesde').value;
  const hasta = document.getElementById('modalHasta').value;

  if (desde && hasta) {
    const input = document.getElementById('filtroRangoFechas');
    input.value = `${formatDate(desde)} - ${formatDate(hasta)}`;
    input.dataset.range = `${desde} - ${hasta}`;
    aplicarFiltros(); // Aplicar los filtros después de establecer el rango
  }

  cerrarModalRango();
}

// Nuevas funciones para drag-and-drop y selector mejorado

function renderSortableColumns(config) {
  const columnas = getAvailableColumns();
  const visibles = config.preferencias.columnas_visibles;

  return columnas
    .filter(col => visibles.includes(col.id))
    .map((col, index) => `
      <div class="sortable-column flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg cursor-move hover:bg-gray-50 transition"
           draggable="true"
           data-column-id="${col.id}"
           data-column-index="${index}">
        <i class="fas fa-grip-vertical text-gray-400"></i>
        <div class="flex items-center gap-2 flex-1">
          <input type="checkbox"
                 value="${col.id}"
                 checked
                 onchange="toggleColumnFromModal(this)"
                 class="w-4 h-4 text-blue-600 rounded">
          <span class="font-medium text-gray-900">${col.nombre}</span>
        </div>
        <span class="text-xs text-gray-500">Visible</span>
      </div>
    `)
    .join('');
}

function renderHiddenColumns(config) {
  const columnas = getAvailableColumns();
  const visibles = config.preferencias.columnas_visibles;

  return columnas
    .filter(col => !visibles.includes(col.id))
    .map(col => `
      <label class="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition">
        <input type="checkbox"
               value="${col.id}"
               onchange="toggleColumnFromModal(this)"
               class="w-4 h-4 text-blue-600 rounded">
        <span class="text-sm text-gray-700">${col.nombre}</span>
      </label>
    `)
    .join('');
}

function setupDragAndDrop() {
  let draggedElement = null;
  let draggedIndex = null;

  // Setup para columnas sortables en el modal
  const sortableContainer = document.getElementById('sortableColumns');
  if (sortableContainer) {
    sortableContainer.addEventListener('dragstart', (e) => {
      if (e.target.classList.contains('sortable-column')) {
        draggedElement = e.target;
        draggedIndex = parseInt(e.target.dataset.columnIndex);
        e.target.style.opacity = '0.5';
      }
    });

    sortableContainer.addEventListener('dragend', (e) => {
      if (e.target.classList.contains('sortable-column')) {
        e.target.style.opacity = '';
      }
    });

    sortableContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    sortableContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      const dropTarget = e.target.closest('.sortable-column');
      if (dropTarget && draggedElement && dropTarget !== draggedElement) {
        const dropIndex = parseInt(dropTarget.dataset.columnIndex);
        reorderColumns(draggedIndex, dropIndex);
      }
    });
  }

  // Setup para header de tabla (opción alternativa más visual)
  const tableHeader = document.getElementById('tableHeader');
  if (tableHeader) {
    tableHeader.addEventListener('dragstart', (e) => {
      if (e.target.closest('.draggable-header')) {
        const header = e.target.closest('.draggable-header');
        draggedElement = header;
        draggedIndex = parseInt(header.dataset.columnIndex);
        header.style.opacity = '0.5';
      }
    });

    tableHeader.addEventListener('dragend', (e) => {
      if (e.target.closest('.draggable-header')) {
        e.target.closest('.draggable-header').style.opacity = '';
      }
    });

    tableHeader.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    tableHeader.addEventListener('drop', (e) => {
      e.preventDefault();
      const dropTarget = e.target.closest('.draggable-header');
      if (dropTarget && draggedElement && dropTarget !== draggedElement) {
        const dropIndex = parseInt(dropTarget.dataset.columnIndex);
        reorderColumns(draggedIndex, dropIndex);
      }
    });
  }
}

function reorderColumns(fromIndex, toIndex) {
  const config = Storage.getConfig();
  const visibleColumns = [...config.preferencias.columnas_visibles];

  // Mover elemento
  const element = visibleColumns.splice(fromIndex, 1)[0];
  visibleColumns.splice(toIndex, 0, element);

  // Guardar nueva configuración
  config.preferencias.columnas_visibles = visibleColumns;
  Storage.saveConfig(config);

  // Recargar vista
  renderRegistros();
  showToast('✓ Orden de columnas actualizado', 'success');
}

function toggleColumnFromModal(checkbox) {
  const columnId = checkbox.value;
  const config = Storage.getConfig();

  if (checkbox.checked) {
    if (!config.preferencias.columnas_visibles.includes(columnId)) {
      config.preferencias.columnas_visibles.push(columnId);
    }
  } else {
    config.preferencias.columnas_visibles = config.preferencias.columnas_visibles.filter(
      col => col !== columnId
    );
  }

  Storage.saveConfig(config);

  // Recargar el modal y la tabla
  setTimeout(() => {
    renderRegistros();
    // Reabrir el modal
    document.getElementById('columnSelector').classList.remove('hidden');
  }, 100);
}

function resetColumnOrder() {
  if (confirm('¿Restaurar el orden por defecto de las columnas?')) {
    const config = Storage.getConfig();
    config.preferencias.columnas_visibles = ['fecha', 'calorias', 'proteinas', 'entreno', 'consumos', 'sueno', 'peso', 'acciones'];
    Storage.saveConfig(config);
    renderRegistros();
    document.getElementById('columnSelector').classList.remove('hidden');
    showToast('✓ Orden restaurado al por defecto', 'success');
  }
}

window.aplicarFiltros = aplicarFiltros;
window.confirmarBorrar = confirmarBorrar;
window.handleImport = handleImport;
window.toggleColumnSelector = toggleColumnSelector;
window.toggleColumn = toggleColumn;
window.toggleColumnFromModal = toggleColumnFromModal;
window.aplicarColumnasYCerrar = aplicarColumnasYCerrar;
window.cancelarColumnas = cancelarColumnas;
window.resetColumnOrder = resetColumnOrder;
window.reorderColumns = reorderColumns;
window.filtrarPorDias = filtrarPorDias;
window.limpiarFiltros = limpiarFiltros;
window.abrirSelectorRango = abrirSelectorRango;
window.cerrarModalRango = cerrarModalRango;
window.aplicarRango = aplicarRango;
