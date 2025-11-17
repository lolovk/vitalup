/*********************************************
 * app.js - Router y controlador principal
 *********************************************/

// ============= ROUTING =============
const routes = {
  '/dashboard': 'renderDashboard',
  '/registros': 'renderRegistros',
  '/estadisticas': 'renderEstadisticas',
  '/config': 'renderConfig'
};

function router() {
  const hash = location.hash.slice(1) || '/dashboard';
  const route = routes[hash];
  
  // Update nav links
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    link.classList.remove('bg-blue-100', 'text-blue-700', 'font-semibold');
    if (link.getAttribute('href') === `#${hash}`) {
      link.classList.add('bg-blue-100', 'text-blue-700', 'font-semibold');
    }
  });
  
  // Close mobile menu
  document.getElementById('mobileMenu').classList.add('hidden');
  
  // Render view
  if (route && window[route]) {
    window[route]();
  } else {
    render404();
  }
}

function render404() {
  document.getElementById('app').innerHTML = `
    <div class="text-center py-20">
      <i class="fas fa-exclamation-triangle text-6xl text-gray-300 mb-4"></i>
      <h1 class="text-3xl font-bold text-gray-700 mb-2">404</h1>
      <p class="text-gray-500 mb-6">Página no encontrada</p>
      <a href="#/dashboard" class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Volver al Dashboard
      </a>
    </div>
  `;
}

// ============= MODAL MANAGEMENT =============
function openModal(fecha = null, modo = 'rapido') {
  // Cerrar cualquier modal de rango que pueda estar abierto
  const modalRango = document.getElementById('modalRangoFechas');
  if (modalRango) modalRango.remove();

  const modal = document.getElementById('modalEntry');
  const title = document.getElementById('modalTitle');

  if (!modal || !title) {
    console.error('Modal elements not found:', { modal: !!modal, title: !!title });
    return;
  }

  const fechaObj = fecha ? new Date(fecha + 'T00:00:00') : new Date();
  const fechaStr = fechaObj.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  title.textContent = `Registro del ${fechaStr}`;
  modal.classList.remove('hidden');
  
  // Render form
  if (window.renderQuickEntry) {
    window.renderQuickEntry(fecha, modo);
  }
  
  // Evitar scroll del body
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modalEntry').classList.add('hidden');
  document.body.style.overflow = '';
}

// ============= PERSONAL INFO MODAL =============
function openPersonalInfoModal() {
  const modal = document.getElementById('modalPersonalInfo');
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closePersonalInfoModal() {
  document.getElementById('modalPersonalInfo').classList.add('hidden');
  document.body.style.overflow = '';
}

function savePersonalInfo() {
  const form = document.getElementById('personalInfoForm');
  const formData = new FormData(form);

  const personalInfo = {
    genero: formData.get('genero'),
    altura: parseFloat(formData.get('altura')) || null,
    peso_inicial: parseFloat(formData.get('peso_inicial')) || null,
    perimetro_inicial: parseFloat(formData.get('perimetro_inicial')) || null,
    configurado: true
  };

  const objetivos = {
    peso_objetivo: parseFloat(formData.get('peso_objetivo')) || null,
    perimetro_objetivo: parseFloat(formData.get('perimetro_objetivo')) || null
  };

  // Update config
  const config = Storage.getConfig();
  config.info_personal = personalInfo;
  config.objetivos = { ...config.objetivos, ...objetivos };
  Storage.saveConfig(config);

  closePersonalInfoModal();
  showToast('¡Información personal guardada! Bienvenido a VitalUp.me');

  // Refresh current view
  router();
}

function checkFirstTimeUser() {
  const config = Storage.getConfig();
  if (!config.info_personal.configurado) {
    setTimeout(() => openPersonalInfoModal(), 500);
  }
}

// ============= EVENT LISTENERS =============
document.addEventListener('DOMContentLoaded', () => {
  // Check if new user needs to configure personal info
  checkFirstTimeUser();

  // Router
  window.addEventListener('hashchange', router);
  window.addEventListener('load', router);
  
  // Mobile menu toggle
  document.getElementById('mobileMenuBtn').addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.toggle('hidden');
  });
  
  // FAB: Quick entry
  document.getElementById('fabQuickEntry').addEventListener('click', () => {
    openModal(null, 'rapido');
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // ESC para cerrar modal
    if (e.key === 'Escape') {
      closeModal();
    }
    
    // Ctrl/Cmd + N para nuevo registro
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
      e.preventDefault();
      openModal(null, 'rapido');
    }
  });
});

// ============= GLOBAL HELPERS =============
window.formatDate = function(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

window.formatDateLong = function(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('es-ES', { 
    weekday: 'long',
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

window.getTodayISO = function() {
  return new Date().toISOString().split('T')[0];
};

window.addDays = function(dateStr, days) {
  const date = new Date(dateStr + 'T00:00:00');
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
};

window.openModal = openModal;
window.closeModal = closeModal;

// Toast notifications
window.showToast = function(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-20 right-6 px-6 py-3 rounded-lg shadow-lg text-white z-50 fade-in ${
    type === 'success' ? 'bg-green-600' : 
    type === 'error' ? 'bg-red-600' : 
    'bg-blue-600'
  }`;
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 200);
  }, 3000);
};
