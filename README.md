# VitalUp.me 🏃‍♂️

Aplicación web de seguimiento de salud y fitness personal, completamente del lado del cliente.

## 📋 Descripción

VitalUp.me es una aplicación progresiva (PWA-ready) para el seguimiento diario de:
- 🍽️ Nutrición (calorías, proteínas, comidas detalladas)
- 💧 Hidratación
- 🏋️ Entrenamiento y actividad física
- 😴 Sueño y calidad de descanso
- 😊 Estado de ánimo y energía
- 📏 Mediciones corporales (peso, perímetro abdominal)
- ⚠️ Excesos y consumos a evitar

## 🚀 Características

- **100% Cliente**: Sin servidor, todos los datos se almacenan en localStorage
- **Privacidad total**: Tus datos nunca salen de tu navegador
- **Diseño responsive**: Optimizado para móvil y escritorio
- **Sin dependencias**: Vanilla JavaScript puro
- **Visualización de datos**: Gráficos con Chart.js
- **Exportación/Importación**: Backup de datos en JSON

## 🛠️ Tecnologías

- HTML5
- Vanilla JavaScript (ES6+)
- Tailwind CSS (vía CDN)
- Chart.js para visualización de datos
- Font Awesome para iconografía
- localStorage API para persistencia

## 📁 Estructura del Proyecto

```
public_html/
├── index.html              # Punto de entrada, layout y navegación
├── app.js                  # Router y utilidades globales
├── storage.js              # Capa de persistencia (localStorage)
├── demo-data.js            # Datos de ejemplo (opcional)
└── views/
    ├── dashboard.js        # Vista principal con resumen del día
    ├── quick-entry.js      # Formulario de registro diario
    ├── registros.js        # Tabla histórica de registros
    ├── estadisticas.js     # Gráficos y análisis
    └── config.js           # Configuración de la aplicación
```

## 🚀 Instalación y Uso

### Desarrollo Local

1. Clona el repositorio:
```bash
git clone https://github.com/lolovk/vitalup.git
cd vitalup
```

2. Sirve los archivos con cualquier servidor HTTP:
```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# Node.js (http-server)
npx http-server
```

3. Abre en el navegador: `http://localhost:8000/public_html/`

### Producción

Simplemente sube la carpeta `public_html/` a cualquier hosting estático:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- O cualquier servidor web tradicional

## 📊 Modelo de Datos

Los datos se estructuran en registros diarios con la siguiente forma:

```javascript
{
  fecha: "2024-11-19",
  nutricion: {
    calorias: 2100,
    proteinas: 150,
    comidas: [...],
    consumos_negativos: ["Alcohol", "Dulces"],
    excesos_data: {
      exceso_alcohol: { calorias: 200, proteinas: 0 }
    }
  },
  hidratacion: {
    total: 2500,
    bebidas: [...]
  },
  entrenamiento: {...},
  sueno: {...},
  sentimiento: {...},
  mediciones: {...}
}
```

## 🎨 Personalización

La aplicación es completamente configurable desde la sección "Config":
- Objetivos nutricionales personalizados
- Tipos de comidas configurables
- Tipos de ejercicio personalizables
- Suplementos habituales
- Consumos negativos a evitar
- Columnas visibles en tablas

## 📝 Versión

**Versión actual**: 2.1.0

### Cambios recientes (2024-11-19):

#### Nuevas Funcionalidades
- ✅ Sistema de hidratación manual con tracking de bebidas
- ✅ Resumen nutricional con actualización en tiempo real
- ✅ Sistema de excesos con calorías y proteínas independientes
- ✅ Cálculo de totales nutricionales incluyendo excesos en dashboard y registros
- ✅ Promedios de 7 días que consideran excesos correctamente
- ✅ Indicadores de energía con iconos de batería (5 niveles)
- ✅ Indicadores de ánimo mejorados (5 niveles emoji)
- ✅ Layout vertical para selectores de energía/ánimo

#### Mejoras de UX
- ✅ Interfaz simplificada (eliminado sistema de modos rápido/completo)
- ✅ Actualización visual en tiempo real de bordes en radio buttons
- ✅ Nombre "Excesos" más claro (antes "Consumos")
- ✅ Icono de advertencia genérico para excesos

#### Correcciones y Limpieza de Código
- ✅ Eliminado modal duplicado en registros.js
- ✅ Estadística "días sin alcohol" actualizada a nuevo formato de datos
- ✅ Eliminadas 558 líneas de código legacy sin usar (renderModoRapido y renderModoCompleto)
- ✅ Persistencia correcta de datos de excesos en localStorage
- ✅ Totales nutricionales calculados correctamente desde comidas + excesos
- ✅ Hidratación persistente al editar registros existentes

## 🐛 Problemas Conocidos

Ver [issues en GitHub](https://github.com/lolovk/vitalup/issues) para lista actualizada.

Todos los problemas críticos han sido resueltos en v2.1.0.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

VitalUp.me - Aplicación de seguimiento de salud personal

## 🙏 Agradecimientos

- Chart.js por la visualización de datos
- Tailwind CSS por el sistema de diseño
- Font Awesome por los iconos
- Claude Code por asistencia en desarrollo
