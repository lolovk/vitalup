# Changelog

## v2.1.0 - 19 Noviembre 2024

**Mejoras mayores en UX, calidad de código y cálculos nutricionales**

### ✨ Nuevas funcionalidades

#### Sistema de hidratación manual
- Tracking detallado de bebidas consumidas
- Contador de hidratación total del día
- Persistencia correcta al editar registros existentes

#### Sistema de excesos mejorado
- Calorías y proteínas independientes por tipo de exceso
- Los totales nutricionales ahora incluyen excesos en dashboard y registros
- Cálculo automático de progreso considerando excesos
- Promedios de 7 días incluyen excesos correctamente

#### Resumen nutricional en tiempo real
- Actualización instantánea de totales al agregar/editar comidas
- Indicadores visuales de progreso mejorados
- Badges con estado de cumplimiento de objetivos

### 🎨 Mejoras de UX

- **Interfaz simplificada**: Eliminado sistema de modos rápido/completo
- **Indicadores de energía**: Iconos de batería con 5 niveles visuales
- **Indicadores de ánimo**: Sistema emoji mejorado con 5 niveles
- **Layout vertical**: Selectores de energía/ánimo más intuitivos
- **Actualización visual**: Bordes en tiempo real para radio buttons
- **Nomenclatura clara**: "Excesos" en lugar de "Consumos"
- **Iconografía genérica**: Icono de advertencia para excesos

### 🐛 Correcciones críticas

- **Modal duplicado**: Eliminado selector duplicado en registros.js
- **Estadística alcohol**: Actualizado para usar `consumos_negativos` array en lugar de campo obsoleto
- **Código legacy**: Eliminadas 558 líneas sin usar (funciones `renderModoRapido` y `renderModoCompleto`)
- **Persistencia de excesos**: Guardado correcto en localStorage
- **Totales nutricionales**: Calculados correctamente desde comidas + excesos
- **Hidratación**: Persistente al editar registros existentes

### 🧹 Mejoras técnicas

- Reducción de código: quick-entry.js de 2483 → 1925 líneas
- Funciones helper reutilizables: `calcularTotalesConExcesos()`
- Mejor separación de responsabilidades
- Código más mantenible y legible

---

## v2.0.0 - Noviembre 2024

**VitalUp.me - Aplicación completa de seguimiento de salud**

### ✨ Nueva aplicación desde cero

- **Aplicación web completa** para seguimiento integral de salud y fitness
- **Sistema de comidas dinámico** con macros calculados automáticamente
- **Dashboard inteligente** con racha de días y estadísticas semanales
- **Gestión avanzada de registros** con filtros y columnas personalizables
- **Gráficos interactivos** para visualizar progreso y tendencias
- **Configuración personalizable** para adaptar la app a cada usuario

### 🏗️ Características principales

#### Nutrición
- Sistema de comidas flexible (ilimitadas por día)
- Cada comida: tipo, hora, contenido, calorías, proteínas
- Contadores automáticos de macros en tiempo real
- Suplementos y consumos negativos configurables

#### Entrenamiento
- Registro de múltiples tipos de ejercicio
- Actividades de descanso activo
- Duración, intensidad y notas detalladas

#### Mediciones y bienestar
- Peso y perímetro abdominal con objetivos
- Seguimiento de sueño (horas y calidad)
- Niveles de energía y ánimo (escala 1-5)
- Notas generales diarias

#### Gestión de datos
- Tabla de registros con columnas personalizables
- Filtros por fecha, entrenamientos, períodos
- Export/import completo en JSON
- Almacenamiento 100% local (LocalStorage)

### 🛠️ Tecnología

- **Frontend**: Vanilla JavaScript, Tailwind CSS, Chart.js
- **Storage**: LocalStorage (sin servidores)
- **Privacidad**: Sin tracking, sin cookies, sin cuentas
- **Responsive**: Funciona perfectamente en móvil y desktop

### 🎯 Modos de uso

- **Minimalista**: Registro rápido de macros básicos (~30 seg/día)
- **Detallado**: Seguimiento completo y exhaustivo (~3-5 min/día)

### 🚀 Lanzamiento

- Aplicación desplegada en [vitalup.me](https://vitalup.me)
- Documentación completa en README.md
- Modal de onboarding para nuevos usuarios
- Configuración inicial guiada

---

*Versión inicial desarrollada con Claude Code*