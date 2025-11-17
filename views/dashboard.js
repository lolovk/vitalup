/*********************************************
 * views/dashboard.js
 * Vista principal con resumen y quick stats
 * VERSIÓN 2.0 compatible con nueva estructura
 *********************************************/

window.renderDashboard = function() {
  const app = document.getElementById('app');
  const config = Storage.getConfig();
  const hoy = getTodayISO();
  const registroHoy = Storage.getRegistroByFecha(hoy);
  const stats = Storage.getEstadisticasHoy();
  const racha = Storage.getRachaDias();
  const ultimos7 = Storage.getUltimosRegistros(7);
  
  app.innerHTML = `
    <div class="space-y-6">
      
      <!-- Header con fecha y racha -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div class="flex flex-col md:flex-row md:items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p class="text-sm text-gray-500 mt-1">Panel de control personal</p>
          </div>
          <!-- Fecha con estilo especial -->
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg">
            <div class="text-center">
              <div class="text-xs font-medium opacity-90 uppercase tracking-wider">Hoy</div>
              <div class="text-2xl font-bold">${new Date(hoy + 'T00:00:00').getDate()}</div>
              <div class="text-xs opacity-90">${new Date(hoy + 'T00:00:00').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Racha -->
          <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl shadow-lg">
            <div class="text-sm font-medium opacity-90">Racha actual</div>
            <div class="text-3xl font-bold">${racha} ${racha === 1 ? 'día' : 'días'}</div>
          </div>
        </div>
      </div>
      
      <!-- Registro de hoy -->
      ${renderRegistroHoy(registroHoy, stats, config)}
      
      <!-- Progreso semanal -->
      ${renderProgresoSemanal(ultimos7, config)}
      
      <!-- Acceso rápido -->
      <div class="grid md:grid-cols-3 gap-4">
        <a href="#/registros" class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-2 border-transparent hover:border-blue-500">
          <i class="fas fa-table text-3xl text-blue-600 mb-3"></i>
          <h3 class="font-bold text-gray-900 mb-1">Ver registros</h3>
          <p class="text-sm text-gray-500">Historial completo</p>
        </a>
        
        <a href="#/estadisticas" class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-2 border-transparent hover:border-blue-500">
          <i class="fas fa-chart-line text-3xl text-green-600 mb-3"></i>
          <h3 class="font-bold text-gray-900 mb-1">Estadísticas</h3>
          <p class="text-sm text-gray-500">Análisis y gráficos</p>
        </a>
        
        <a href="#/config" class="bg-white p-6 rounded-xl shadow hover:shadow-lg transition border-2 border-transparent hover:border-blue-500">
          <i class="fas fa-cog text-3xl text-gray-600 mb-3"></i>
          <h3 class="font-bold text-gray-900 mb-1">Configuración</h3>
          <p class="text-sm text-gray-500">Objetivos y preferencias</p>
        </a>
      </div>
      
    </div>
  `;
};

function renderRegistroHoy(registro, stats, config) {
  if (!registro) {
    return `
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow-xl p-8 text-center">
        <i class="fas fa-clipboard-list text-6xl mb-4 opacity-80"></i>
        <h2 class="text-2xl font-bold mb-2">Aún no has registrado el día de hoy</h2>
        <p class="text-blue-100 mb-6">Empieza tu registro diario para hacer seguimiento de tu progreso</p>
        <button onclick="openModal(null, 'rapido')" 
                class="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg">
          <i class="fas fa-plus-circle mr-2"></i>
          Registrar ahora
        </button>
      </div>
    `;
  }
  
  // Calcular progreso
  const progresoCalorias = registro.nutricion.calorias 
    ? (registro.nutricion.calorias / config.objetivos.calorias * 100).toFixed(0)
    : 0;
  const progresoProteinas = registro.nutricion.proteinas 
    ? (registro.nutricion.proteinas / config.objetivos.proteinas * 100).toFixed(0)
    : 0;
  
  const caloriasStatus = progresoCalorias >= 95 && progresoCalorias <= 105 ? 'success' : 
                         progresoCalorias < 95 ? 'warning' : 'danger';
  const proteinasStatus = progresoProteinas >= 90 ? 'success' : 
                          progresoProteinas >= 70 ? 'warning' : 'danger';
  
  // Verificar consumos negativos
  const tieneConsumosNegativos = registro.nutricion.consumos_negativos && 
                                  registro.nutricion.consumos_negativos.length > 0;
  
  return `
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold">Registro de hoy</h2>
          <p class="text-green-100 text-sm">Completado</p>
        </div>
        <button onclick="openModal('${getTodayISO()}', 'completo')" 
                class="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
          <i class="fas fa-edit mr-2"></i>Editar
        </button>
      </div>
      
      <!-- Métricas principales -->
      <div class="p-6">
        <div class="grid md:grid-cols-2 gap-6 mb-6">
          
          <!-- Calorías -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-700">
                <i class="fas fa-fire text-orange-500 mr-2"></i>Calorías
              </span>
              <span class="text-2xl font-bold ${
                caloriasStatus === 'success' ? 'text-green-600' :
                caloriasStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }">
                ${registro.nutricion.calorias || 0}
              </span>
            </div>
            <div class="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div class="absolute inset-y-0 left-0 ${
                caloriasStatus === 'success' ? 'bg-green-500' :
                caloriasStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              } rounded-full transition-all duration-500"
                   style="width: ${Math.min(progresoCalorias, 100)}%"></div>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>Objetivo: ${config.objetivos.calorias} kcal</span>
              <span>${progresoCalorias}%</span>
            </div>
          </div>
          
          <!-- Proteínas -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="font-semibold text-gray-700">
                <i class="fas fa-drumstick-bite text-red-500 mr-2"></i>Proteínas
              </span>
              <span class="text-2xl font-bold ${
                proteinasStatus === 'success' ? 'text-green-600' :
                proteinasStatus === 'warning' ? 'text-yellow-600' : 'text-red-600'
              }">
                ${registro.nutricion.proteinas || 0}g
              </span>
            </div>
            <div class="relative h-3 bg-gray-200 rounded-full overflow-hidden">
              <div class="absolute inset-y-0 left-0 ${
                proteinasStatus === 'success' ? 'bg-green-500' :
                proteinasStatus === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
              } rounded-full transition-all duration-500"
                   style="width: ${Math.min(progresoProteinas, 100)}%"></div>
            </div>
            <div class="flex justify-between text-sm text-gray-500">
              <span>Objetivo: ${config.objetivos.proteinas}g</span>
              <span>${progresoProteinas}%</span>
            </div>
          </div>
          
        </div>
        
        <!-- Indicadores adicionales -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <!-- Entrenamiento -->
          <div class="text-center p-4 rounded-lg ${registro.entrenamiento.hecho ? 'bg-green-100' : 'bg-gray-100'}">
            <i class="fas fa-dumbbell text-2xl ${registro.entrenamiento.hecho ? 'text-green-600' : 'text-gray-400'} mb-2"></i>
            <div class="text-sm font-medium text-gray-700">Entrenamiento</div>
            <div class="text-xs ${registro.entrenamiento.hecho ? 'text-green-600' : 'text-gray-500'} font-semibold mt-1">
              ${registro.entrenamiento.hecho ? '✓ Realizado' : '✗ No'}
            </div>
          </div>
          
          <!-- Consumos negativos -->
          <div class="text-center p-4 rounded-lg ${!tieneConsumosNegativos ? 'bg-green-100' : 'bg-red-100'}">
            <i class="fas fa-wine-bottle text-2xl ${!tieneConsumosNegativos ? 'text-green-600' : 'text-red-600'} mb-2"></i>
            <div class="text-sm font-medium text-gray-700">Consumos</div>
            <div class="text-xs ${!tieneConsumosNegativos ? 'text-green-600' : 'text-red-600'} font-semibold mt-1">
              ${!tieneConsumosNegativos ? '✓ Ninguno' : `✗ ${registro.nutricion.consumos_negativos.length}`}
            </div>
          </div>
          
          <!-- Sueño -->
          <div class="text-center p-4 rounded-lg ${registro.sueno.horas >= 7 ? 'bg-green-100' : 'bg-yellow-100'}">
            <i class="fas fa-bed text-2xl ${registro.sueno.horas >= 7 ? 'text-green-600' : 'text-yellow-600'} mb-2"></i>
            <div class="text-sm font-medium text-gray-700">Sueño</div>
            <div class="text-xs ${registro.sueno.horas >= 7 ? 'text-green-600' : 'text-yellow-600'} font-semibold mt-1">
              ${registro.sueno.horas ? registro.sueno.horas.toFixed(1) : 0}h
            </div>
          </div>
          
          <!-- Sensación -->
          <div class="text-center p-4 rounded-lg bg-blue-100">
            <div class="text-3xl mb-2">
              ${['😔','😐','🙂','😀'][registro.sentimiento.animo - 1] || '😐'}
            </div>
            <div class="text-sm font-medium text-gray-700">Ánimo</div>
            <div class="text-xs text-blue-600 font-semibold mt-1">
              ${['Bajo','Neutro','Bien','Genial'][registro.sentimiento.animo - 1] || 'Neutro'}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  `;
}

function renderProgresoSemanal(ultimos7, config) {
  if (ultimos7.length === 0) {
    return '';
  }
  
  const diasCompletos = ultimos7.filter(r => 
    r.nutricion.calorias !== null && r.nutricion.proteinas !== null
  ).length;
  
  const diasEntrenamiento = ultimos7.filter(r => r.entrenamiento.hecho).length;
  
  const diasSinConsumosNegativos = ultimos7.filter(r => 
    !r.nutricion.consumos_negativos || r.nutricion.consumos_negativos.length === 0
  ).length;
  
  const promedioCalorias = ultimos7
    .filter(r => r.nutricion.calorias !== null)
    .reduce((sum, r) => sum + r.nutricion.calorias, 0) / (ultimos7.length || 1);
  
  const promedioProteinas = ultimos7
    .filter(r => r.nutricion.proteinas !== null)
    .reduce((sum, r) => sum + r.nutricion.proteinas, 0) / (ultimos7.length || 1);
  
  return `
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i class="fas fa-chart-line text-blue-600"></i>
        Resumen últimos 7 días
      </h2>
      
      <div class="grid md:grid-cols-4 gap-4">
        
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
          <div class="text-sm text-gray-600 mb-1">Días registrados</div>
          <div class="text-3xl font-bold text-blue-600">${diasCompletos}/7</div>
        </div>
        
        <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
          <div class="text-sm text-gray-600 mb-1">Días de entreno</div>
          <div class="text-3xl font-bold text-green-600">${diasEntrenamiento}/7</div>
        </div>
        
        <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
          <div class="text-sm text-gray-600 mb-1">Días limpios</div>
          <div class="text-3xl font-bold text-purple-600">${diasSinConsumosNegativos}/7</div>
        </div>
        
        <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
          <div class="text-sm text-gray-600 mb-1">Kcal promedio</div>
          <div class="text-3xl font-bold text-orange-600">${Math.round(promedioCalorias)}</div>
        </div>
        
      </div>
      
      <!-- Timeline de la semana -->
      <div class="mt-6">
        <div class="text-sm font-semibold text-gray-700 mb-3">Registro semanal</div>
        <div class="flex gap-2">
          ${ultimos7.slice().reverse().map(r => {
            const completo = r.nutricion.calorias !== null && r.nutricion.proteinas !== null;
            const fecha = new Date(r.fecha + 'T00:00:00');
            const diaSemana = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][fecha.getDay()];
            
            return `
              <div class="flex-1 text-center">
                <div class="text-xs text-gray-500 mb-1">${diaSemana}</div>
                <div class="h-20 rounded-lg ${
                  completo ? 'bg-green-500' : 'bg-gray-200'
                } flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                     onclick="openModal('${r.fecha}', 'completo')">
                  ${completo ? 
                    `<i class="fas fa-check text-white text-xl"></i>` : 
                    `<i class="fas fa-times text-gray-400"></i>`
                  }
                </div>
                <div class="text-xs text-gray-500 mt-1">${fecha.getDate()}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
