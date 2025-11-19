/*********************************************
 * views/estadisticas.js
 * Análisis y gráficos
 *********************************************/

let charts = {};

window.renderEstadisticas = function() {
  // Destruir charts existentes
  Object.values(charts).forEach(chart => chart.destroy());
  charts = {};
  
  const app = document.getElementById('app');
  const registros = Storage.getRegistros().sort((a, b) => a.fecha.localeCompare(b.fecha));
  const config = Storage.getConfig();
  
  app.innerHTML = `
    <div class="space-y-6">
      
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Estadísticas</h1>
        <p class="text-gray-500 mt-1">Análisis de tu progreso</p>
      </div>
      
      <!-- Selector de rango -->
      <div class="bg-white rounded-xl shadow p-4">
        <div class="flex flex-wrap gap-2">
          <button onclick="cargarRango(7)" 
                  data-dias="7"
                  class="rango-btn px-4 py-2 rounded-lg border-2 border-blue-600 bg-blue-600 text-white">
            7 días
          </button>
          <button onclick="cargarRango(14)" 
                  data-dias="14"
                  class="rango-btn px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-600">
            14 días
          </button>
          <button onclick="cargarRango(30)" 
                  data-dias="30"
                  class="rango-btn px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-600">
            30 días
          </button>
          <button onclick="cargarRango(90)" 
                  data-dias="90"
                  class="rango-btn px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-600">
            90 días
          </button>
          <button onclick="cargarRango(null)" 
                  data-dias="all"
                  class="rango-btn px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-blue-600">
            Todo
          </button>
        </div>
      </div>
      
      <!-- Resumen numérico -->
      <div id="resumenStats" class="grid md:grid-cols-4 gap-4">
        <!-- Se rellena dinámicamente -->
      </div>
      
      <!-- Gráficos -->
      <div class="grid md:grid-cols-2 gap-6">
        
        <!-- Calorías y proteínas -->
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-chart-line text-blue-600"></i>
            Calorías y Proteínas
          </h3>
          <div style="height: 250px;">
            <canvas id="chartNutricion"></canvas>
          </div>
        </div>
        
        <!-- Peso corporal -->
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-weight text-green-600"></i>
            Evolución del peso
          </h3>
          <div style="height: 250px;">
            <canvas id="chartPeso"></canvas>
          </div>
        </div>
        
        <!-- Adherencia -->
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-tasks text-purple-600"></i>
            Adherencia al protocolo
          </h3>
          <div style="height: 250px;">
            <canvas id="chartAdherencia"></canvas>
          </div>
        </div>
        
        <!-- Entrenamiento y sueño -->
        <div class="bg-white rounded-xl shadow p-6">
          <h3 class="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <i class="fas fa-heartbeat text-red-600"></i>
            Entrenamiento y Sueño
          </h3>
          <div style="height: 250px;">
            <canvas id="chartHabitos"></canvas>
          </div>
        </div>
        
      </div>
      
    </div>
  `;
  
  // Cargar gráficos iniciales (últimos 7 días)
  cargarRango(7);
};

function cargarRango(dias) {
  const registros = Storage.getRegistros().sort((a, b) => a.fecha.localeCompare(b.fecha));
  const config = Storage.getConfig();
  
  let data;
  if (dias === null) {
    data = registros;
  } else {
    const desde = addDays(getTodayISO(), -dias + 1);
    data = registros.filter(r => r.fecha >= desde);
  }
  
  // Actualizar botones activos
  document.querySelectorAll('.rango-btn').forEach((btn, idx) => {
    btn.classList.remove('bg-blue-600', 'text-white');
    btn.classList.add('border-gray-300');
    
    // Marcar el botón correcto como activo
    const btnDias = btn.getAttribute('data-dias');
    if ((dias === null && btnDias === 'all') || 
        (dias !== null && parseInt(btnDias) === dias)) {
      btn.classList.add('bg-blue-600', 'text-white');
      btn.classList.remove('border-gray-300');
    }
  });
  
  // Renderizar stats
  renderResumen(data, config);
  renderCharts(data, config);
}

function renderResumen(data, config) {
  const diasCompletos = data.filter(r => 
    r.nutricion.calorias !== null && r.nutricion.proteinas !== null
  ).length;
  
  const diasEntrenamiento = data.filter(r => r.entrenamiento.hecho).length;
  const diasSinAlcohol = data.filter(r =>
    !r.nutricion.consumos_negativos ||
    !r.nutricion.consumos_negativos.includes('Alcohol')
  ).length;
  
  const promedioCalorias = data
    .filter(r => r.nutricion.calorias !== null)
    .reduce((sum, r) => sum + r.nutricion.calorias, 0) / (diasCompletos || 1);
  
  const promedioProteinas = data
    .filter(r => r.nutricion.proteinas !== null)
    .reduce((sum, r) => sum + r.nutricion.proteinas, 0) / (diasCompletos || 1);
  
  const pesoInicial = data.find(r => r.mediciones.peso !== null)?.mediciones.peso;
  const pesoActual = [...data].reverse().find(r => r.mediciones.peso !== null)?.mediciones.peso;
  const diferenciaPeso = pesoActual && pesoInicial ? pesoActual - pesoInicial : null;
  
  document.getElementById('resumenStats').innerHTML = `
    <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
      <div class="text-sm text-gray-600 mb-1">Días registrados</div>
      <div class="text-3xl font-bold text-blue-600">${diasCompletos}</div>
      <div class="text-xs text-gray-500 mt-1">de ${data.length} días</div>
    </div>
    
    <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
      <div class="text-sm text-gray-600 mb-1">Kcal promedio</div>
      <div class="text-3xl font-bold text-orange-600">${Math.round(promedioCalorias)}</div>
      <div class="text-xs text-gray-500 mt-1">Objetivo: ${config.objetivos.calorias}</div>
    </div>
    
    <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
      <div class="text-sm text-gray-600 mb-1">Proteína promedio</div>
      <div class="text-3xl font-bold text-purple-600">${Math.round(promedioProteinas)}g</div>
      <div class="text-xs text-gray-500 mt-1">Objetivo: ${config.objetivos.proteinas}g</div>
    </div>
    
    <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
      <div class="text-sm text-gray-600 mb-1">Cambio de peso</div>
      <div class="text-3xl font-bold ${diferenciaPeso < 0 ? 'text-green-600' : 'text-orange-600'}">
        ${diferenciaPeso !== null ? 
          `${diferenciaPeso > 0 ? '+' : ''}${diferenciaPeso.toFixed(1)} kg` : 
          '—'
        }
      </div>
      <div class="text-xs text-gray-500 mt-1">
        ${pesoActual !== null ? `Actual: ${pesoActual} kg` : 'Sin datos'}
      </div>
    </div>
  `;
}

function renderCharts(data, config) {
  // Destruir charts anteriores
  Object.values(charts).forEach(chart => chart.destroy());
  charts = {};
  
  const labels = data.map(r => {
    const fecha = new Date(r.fecha + 'T00:00:00');
    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  });
  
  // ===== NUTRICIÓN =====
  const calorias = data.map(r => r.nutricion.calorias);
  const proteinas = data.map(r => r.nutricion.proteinas);
  
  charts.nutricion = new Chart('chartNutricion', {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Calorías',
          data: calorias,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Proteínas (g)',
          data: proteinas,
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: true, position: 'top' }
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          title: { display: true, text: 'Calorías' },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'Proteínas (g)' },
          grid: { display: false }
        }
      }
    }
  });
  
  // ===== PESO =====
  const pesos = data.map(r => r.mediciones.peso);
  
  charts.peso = new Chart('chartPeso', {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Peso (kg)',
        data: pesos,
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: { color: 'rgba(0,0,0,0.05)' }
        }
      }
    }
  });
  
  // ===== ADHERENCIA =====
  const diasCompletos = data.filter(r => 
    r.nutricion.calorias !== null && r.nutricion.proteinas !== null
  ).length;
  const diasIncompletos = data.length - diasCompletos;
  
  charts.adherencia = new Chart('chartAdherencia', {
    type: 'doughnut',
    data: {
      labels: ['Completos', 'Incompletos'],
      datasets: [{
        data: [diasCompletos, diasIncompletos],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(229, 231, 235)'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
  
  // ===== HÁBITOS =====
  const entrenos = data.map(r => r.entrenamiento.hecho ? 1 : 0);
  const sueno = data.map(r => r.sueno.horas);
  
  charts.habitos = new Chart('chartHabitos', {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Entrenamiento',
          data: entrenos,
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          yAxisID: 'y'
        },
        {
          label: 'Sueño (horas)',
          data: sueno,
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'top' }
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          max: 1,
          ticks: {
            callback: v => v === 1 ? 'Sí' : 'No'
          },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        y1: {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          max: 12,
          title: { display: true, text: 'Horas' },
          grid: { display: false }
        }
      }
    }
  });
}

window.cargarRango = cargarRango;
