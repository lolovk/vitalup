/*********************************************
 * storage.js - Sistema de almacenamiento
 *********************************************/

const STORAGE_KEYS = {
  REGISTROS: 'vitalup_registros',
  CONFIG: 'vitalup_config'
};

// ============= CONFIG =============
function getConfig() {
  const defaultConfig = {
    info_personal: {
      genero: null,
      altura: null,
      peso_inicial: null,
      perimetro_inicial: null,
      configurado: false
    },
    objetivos: {
      calorias: 1800,
      proteinas: 145,
      peso_objetivo: null,
      perimetro_objetivo: null
    },
    preferencias: {
      campos_obligatorios: ['calorias', 'proteinas'],
      mostrar_detalles_comida: true,
      recordar_suplementos: true,
      columnas_visibles: ['fecha', 'calorias', 'proteinas', 'entreno', 'alcohol', 'sueno', 'peso', 'acciones']
    },
    suplementos_habituales: ['Proteína', 'Magnesio', 'Vitamina D', 'Omega-3'],
    consumos_negativos: ['Alcohol', 'Dulces', 'Snacks procesados', 'Refrescos'],
    tipos_comida: ['Desayuno', 'Comida', 'Merienda', 'Cena', 'Extra'],
    tipos_ejercicio: ['Fuerza', 'Cardio', 'HIIT', 'Yoga', 'Natación', 'Ciclismo', 'Running', 'Movilidad', 'Otro']
  };
  
  const stored = localStorage.getItem(STORAGE_KEYS.CONFIG);
  return stored ? { ...defaultConfig, ...JSON.parse(stored) } : defaultConfig;
}

function saveConfig(config) {
  localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(config));
}

function updateConfig(updates) {
  const config = getConfig();
  const updated = { ...config, ...updates };
  saveConfig(updated);
  return updated;
}

// ============= REGISTROS =============
function getRegistros() {
  const stored = localStorage.getItem(STORAGE_KEYS.REGISTROS);
  return stored ? JSON.parse(stored) : [];
}

function saveRegistros(registros) {
  localStorage.setItem(STORAGE_KEYS.REGISTROS, JSON.stringify(registros));
}

function getRegistroByFecha(fecha) {
  const registros = getRegistros();
  return registros.find(r => r.fecha === fecha);
}

function saveRegistro(registro) {
  const registros = getRegistros();
  const index = registros.findIndex(r => r.fecha === registro.fecha);
  
  if (index >= 0) {
    registros[index] = registro;
  } else {
    registros.push(registro);
  }
  
  saveRegistros(registros);
  return registro;
}

function deleteRegistro(fecha) {
  const registros = getRegistros();
  const filtered = registros.filter(r => r.fecha !== fecha);
  saveRegistros(filtered);
}

// ============= TEMPLATES =============
function createEmptyRegistro(fecha = null) {
  const today = fecha || new Date().toISOString().split('T')[0];
  const config = getConfig();

  return {
    fecha: today,

    nutricion: {
      calorias: null,
      proteinas: null,
      comidas: [],  // Array de {tipo, contenido, hora, calorias, proteinas}
      consumos_negativos: [],  // Array de strings configurables
      suplementos: []
    },

    mediciones: {
      peso: config.info_personal.peso_inicial || null,
      perimetro_abdominal: config.info_personal.perimetro_inicial || null,
      otras: {}
    },
    
    entrenamiento: {
      hecho: false,
      actividades: [], // Array de {tipo, duracion, intensidad, notas}
      descanso_activo: {
        hecho: false,
        actividades: [] // Array de {tipo, duracion, intensidad, notas}
      }
    },
    
    sueno: {
      horas: null,
      calidad: 'buena'
    },
    
    sentimiento: {
      energia: 3,
      animo: 3,
      digestion: 'normal',
      notas: ''
    },
    
    notas_generales: ''
  };
}

// ============= UTILIDADES =============
function getRegistrosRango(desde, hasta) {
  const registros = getRegistros();
  return registros.filter(r => r.fecha >= desde && r.fecha <= hasta)
                  .sort((a, b) => b.fecha.localeCompare(a.fecha));
}

function getUltimosRegistros(n = 7) {
  const registros = getRegistros();
  return registros.sort((a, b) => b.fecha.localeCompare(a.fecha))
                  .slice(0, n);
}

function exportarTodo() {
  const data = {
    registros: getRegistros(),
    config: getConfig(),
    version: '2.0',
    exportado: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const ahora = new Date();
  const fecha = ahora.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  const hora = ahora.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '-');
  a.download = `VitalUp-backup-${fecha}_${hora}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importarTodo(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validación básica
        if (!data.registros || !Array.isArray(data.registros)) {
          throw new Error('Formato de archivo inválido');
        }
        
        // Guardar
        saveRegistros(data.registros);
        if (data.config) saveConfig(data.config);
        
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
}

function resetTodo() {
  if (confirm('⚠️ ¿Estás seguro? Se borrarán TODOS los datos de forma permanente.')) {
    if (confirm('Última confirmación: ¿Realmente quieres borrar todo?')) {
      localStorage.removeItem(STORAGE_KEYS.REGISTROS);
      localStorage.removeItem(STORAGE_KEYS.CONFIG);
      location.reload();
    }
  }
}

// ============= ESTADÍSTICAS RÁPIDAS =============
function getEstadisticasHoy() {
  const hoy = new Date().toISOString().split('T')[0];
  const registro = getRegistroByFecha(hoy);
  const config = getConfig();
  
  if (!registro) {
    return {
      registrado: false,
      cumple_calorias: false,
      cumple_proteinas: false,
      cumple_entrenamiento: false
    };
  }
  
  return {
    registrado: true,
    cumple_calorias: registro.nutricion.calorias !== null,
    cumple_proteinas: registro.nutricion.proteinas !== null,
    cumple_entrenamiento: registro.entrenamiento.hecho,
    calorias_objetivo: config.objetivos.calorias,
    proteinas_objetivo: config.objetivos.proteinas,
    calorias_actual: registro.nutricion.calorias,
    proteinas_actual: registro.nutricion.proteinas
  };
}

function getRachaDias() {
  const registros = getRegistros().sort((a, b) => b.fecha.localeCompare(a.fecha));

  if (registros.length === 0) return 0;

  // Función helper para verificar si un registro está "completo"
  const esRegistroCompleto = (reg) => {
    return reg.nutricion.calorias !== null && reg.nutricion.calorias > 0 &&
           reg.nutricion.proteinas !== null && reg.nutricion.proteinas > 0;
  };

  let racha = 0;
  let fechaActual = new Date();

  // Si hoy no hay registro, empezar desde el registro más reciente
  const hoyStr = fechaActual.toISOString().split('T')[0];
  const registroHoy = registros.find(r => r.fecha === hoyStr);

  if (!registroHoy || !esRegistroCompleto(registroHoy)) {
    // No hay registro de hoy o no está completo, empezar desde el más reciente
    const registroMasReciente = registros.find(r => esRegistroCompleto(r));
    if (!registroMasReciente) return 0;

    fechaActual = new Date(registroMasReciente.fecha + 'T00:00:00');
  }

  // Contar hacia atrás desde la fecha actual/más reciente
  for (let i = 0; i < 90; i++) { // Aumentar el límite a 90 días
    const fechaStr = fechaActual.toISOString().split('T')[0];
    const reg = registros.find(r => r.fecha === fechaStr);

    if (!reg) {
      // Si es el primer día que revisamos y no hay registro, continuar
      if (racha === 0) {
        fechaActual.setDate(fechaActual.getDate() - 1);
        continue;
      }
      // Si ya llevamos racha y no hay registro, romper la racha
      break;
    }

    if (esRegistroCompleto(reg)) {
      racha++;
    } else {
      // Si hay registro pero no está completo, romper la racha
      if (racha > 0) break;
    }

    fechaActual.setDate(fechaActual.getDate() - 1);
  }

  return racha;
}

// ============= EXPORTS =============
window.Storage = {
  // Config
  getConfig,
  saveConfig,
  updateConfig,
  
  // Registros
  getRegistros,
  saveRegistros,
  getRegistroByFecha,
  saveRegistro,
  deleteRegistro,
  createEmptyRegistro,
  
  // Consultas
  getRegistrosRango,
  getUltimosRegistros,
  
  // Import/Export
  exportarTodo,
  importarTodo,
  resetTodo,
  
  // Estadísticas
  getEstadisticasHoy,
  getRachaDias
};
