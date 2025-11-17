# VitalUp.me

**Tu aplicación personal de seguimiento de salud y fitness**

Una herramienta web completa para monitorear tu progreso diario en nutrición, entrenamiento, mediciones corporales, sueño y bienestar general. Todo almacenado localmente en tu navegador.

🌐 **Demo live**: [vitalup.me](https://vitalup.me)

---

## 🚀 Inicio rápido

### Primer uso (5 minutos)

1. **👤 Información personal inicial**: Al abrir la app, completa el modal de bienvenida con género, altura, peso inicial y objetivos
2. **📱 Tu primer registro**: Haz clic en el botón flotante azul (+) y llena lo que quieras trackear
3. **🎯 Elige tu enfoque**: Modo minimalista (30 seg/día) o detallado (3-5 min/día)

### 🎯 Dos formas de usar VitalUp.me

#### **Modo Minimalista** ⚡
*Para usuarios que quieren simplicidad*

**Llena solo:**
- ✅ Calorías totales del día
- ✅ Proteínas totales del día
- ✅ Checkbox "Hice entrenamiento"
- ✅ Horas de sueño

**Tiempo**: ~30 segundos por día

#### **Modo Detallado** 🔬
*Para usuarios que quieren control total*

**Completa:**
- 🍽️ **Comidas individuales** (tipo, hora, contenido, macros)
- 🏋️ **Entrenamientos detallados** (tipo, duración, intensidad)
- 📏 **Mediciones corporales** (peso, perímetro)
- 😴 **Bienestar completo** (sueño, energía, ánimo)
- 💊 **Suplementos y consumos negativos**

**Tiempo**: 3-5 minutos por día

---

## ✨ Características principales

### 📊 **Dashboard inteligente**
- Resumen del día actual con indicadores de progreso
- Racha de días con registros completos
- Estadísticas de la semana actual vs anterior
- Alertas visuales para objetivos pendientes

### 🍎 **Nutrición avanzada**
- **Sistema de comidas flexible**: Añade todas las comidas que quieras
- Cada comida incluye: tipo, hora, contenido, calorías y proteínas
- **Contadores automáticos** de macros en tiempo real
- Configuración personalizable de:
  - Tipos de comida (Desayuno, Pre-entreno, Post-entreno, etc.)
  - Suplementos habituales
  - Consumos negativos a evitar

### 🏋️ **Entrenamiento completo**
- Registro de entrenamientos principales
- Actividades de descanso activo
- Múltiples tipos: Fuerza, Cardio, HIIT, Yoga, etc.
- Duración, intensidad y notas personalizadas

### 📏 **Mediciones corporales**
- Peso y perímetro abdominal
- Objetivos personalizables
- Tracking de progreso visual
- Comparativas históricas

### 😴 **Sueño y bienestar**
- Horas y calidad del sueño
- Niveles de energía y ánimo (1-5)
- Estado digestivo
- Notas generales del día

### 📋 **Gestión de registros**
- **Tabla personalizable**: Elige qué columnas ver
- Filtros inteligentes: rango de fechas, últimos días, solo entrenamientos
- Búsqueda y ordenación
- Edición y eliminación de registros

### 📈 **Estadísticas visuales**
- Gráficos interactivos con Chart.js
- Trends de peso y perímetro abdominal
- Evolución de calorías y proteínas
- Patrones de sueño y energía
- Análisis de períodos personalizables

### ⚙️ **Configuración avanzada**
- Objetivos personalizables (calorías, proteínas, peso)
- Listas editables (suplementos, tipos de comida)
- Preferencias de visualización
- Export/Import completo de datos
- Reset selectivo o total

---

## 📊 Navegación y flujo de trabajo

### **Dashboard** 🏠
Tu punto de partida diario con resumen de progreso y acceso rápido a nuevo registro.

### **Registros** 📋
Tabla personalizable con todos tus datos. Usa el botón "Columnas" para mostrar solo lo relevante.

**Filtros útiles:**
- 📅 **Rango de fechas**: Período específico
- ⚡ **Filtros rápidos**: 7/30/90 días
- 💪 **Solo entrenamientos**: Días con actividad física

### **Estadísticas** 📈
Gráficos interactivos para identificar patrones y progreso en diferentes períodos.

### **Configuración** ⚙️
Personaliza objetivos, tipos de comida, suplementos y preferencias.

---

## 🎯 Casos de uso

### **Pérdida de peso**
- **Focus**: Calorías diarias, peso, perímetro abdominal
- **Tracking esencial**: Comidas principales + consumos negativos
- **Métricas clave**: Déficit calórico, trends de peso

### **Ganancia muscular**
- **Focus**: Proteínas, entrenamientos de fuerza, suplementación
- **Tracking esencial**: Comidas detalladas + sesiones de gym
- **Métricas clave**: Proteína/kg peso, progresión cargas

### **Bienestar general**
- **Focus**: Balance nutrición-ejercicio-descanso
- **Tracking esencial**: Energía, ánimo, calidad de sueño
- **Métricas clave**: Consistencia, correlaciones lifestyle

---

## 🔧 Personalización avanzada

### **Tipos de comida personalizados**
```
Desayuno, Pre-entreno, Post-entreno, Comida,
Merienda, Cena, Snack nocturno
```

### **Consumos negativos configurables**
```
Alcohol, Dulces, Snacks procesados, Refrescos,
Fast food, Frituras, Bollería
```

### **Columnas visibles en registros**
```
Fecha, Calorías, Proteínas, Entrenamiento,
Consumos negativos, Sueño, Peso, Perímetro,
Ánimo, Energía, Acciones
```

---

## ⚡ Tips de productividad

### **Atajos de teclado**
- `Ctrl/Cmd + N`: Nuevo registro
- `Esc`: Cerrar modal

### **Flujo recomendado**
1. **Mañana**: Registro del día anterior (más preciso)
2. **Noche**: Ajustes finales del día actual
3. **Domingo**: Revisar estadísticas semanales

### **Configuración inicial sugerida**

#### Tipos de comida útiles:
```
✅ Desayuno        ✅ Pre-entreno      ✅ Post-entreno
✅ Comida          ✅ Merienda         ✅ Cena
```

#### Consumos negativos comunes:
```
❌ Alcohol         ❌ Dulces           ❌ Fast food
❌ Refrescos       ❌ Snacks procesados ❌ Frituras
```

---

## 🛠️ Tecnología y privacidad

### **Stack técnico**
- **Frontend**: Vanilla JavaScript (sin frameworks pesados)
- **Styling**: Tailwind CSS + Font Awesome
- **Charts**: Chart.js para visualizaciones
- **Storage**: LocalStorage (100% local)
- **PWA Ready**: Responsive, funciona offline

### **Privacidad y seguridad**
- ✅ **Sin servidores**: Todos los datos en tu navegador
- ✅ **Sin tracking**: Cero analíticas, cero cookies
- ✅ **Sin cuentas**: No hay registros ni logins
- ✅ **Offline first**: Funciona sin conexión
- ✅ **Control total**: Tú decides cuándo exportar/borrar datos

### **Backup y portabilidad**
- **Export completo**: JSON con todos los datos y configuración
- **Naming automático**: `VitalUp-backup-DD-MM-YYYY_HH-MM-SS.json`
- **Import selectivo**: Mantiene datos existentes o reemplaza

---

## 📄 Estructura de datos

```javascript
// Registro diario completo
{
  fecha: "2024-11-17",
  nutricion: {
    calorias: 1800,
    proteinas: 120,
    comidas: [
      {
        tipo: "Desayuno",
        contenido: "Avena con plátano y proteína",
        hora: "08:30",
        calorias: 450,
        proteinas: 35
      }
    ],
    consumos_negativos: ["Alcohol"],
    suplementos: ["Proteína", "Omega-3"]
  },
  entrenamiento: {
    hecho: true,
    actividades: [{
      tipo: "Fuerza",
      duracion: 60,
      intensidad: "alta",
      notas: "Tren superior"
    }]
  },
  mediciones: {
    peso: 75.2,
    perimetro_abdominal: 82.5
  },
  sueno: {
    horas: 7.5,
    calidad: "buena"
  },
  sentimiento: {
    energia: 4,
    animo: 4,
    digestion: "normal",
    notas: "Día productivo"
  }
}
```

---

## ❓ Preguntas frecuentes

### "¿Puedo usar solo algunas secciones?"
✅ **Sí**. Deja en blanco lo que no te interese. VitalUp.me se adapta a tu estilo.

### "¿Qué pasa si me olvido un día?"
✅ **Sin problema**. Puedes registrar días pasados desde el selector de fecha en el modal.

### "¿Cómo cambio mis objetivos?"
✅ **Configuración** → Editar objetivos → Guardar.

### "¿Se borran mis datos al cerrar el navegador?"
❌ **No**. Todo se guarda en LocalStorage. Solo se borran si limpias datos del navegador.

### "¿Puedo hacer backup?"
✅ **Sí**. Configuración → Exportar datos → Descarga JSON con todo.

---

## 🔄 Ejemplo de flujo completo

**Registrando el lunes por la noche:**

1. Clic en (+) → Modal se abre
2. **Comidas**:
   - Añadir: Desayuno, 08:30, "Avena + plátano", 400 kcal, 15g
   - Añadir: Pre-entreno, 17:00, "Café + tostada", 200 kcal, 5g
   - Añadir: Post-entreno, 19:30, "Batido proteína", 150 kcal, 25g
   - Añadir: Cena, 21:00, "Salmón + verduras", 500 kcal, 40g
3. **Suplementos**: Proteína ✅, Omega-3 ✅
4. **Entrenamiento**: Fuerza, 75 min, alta intensidad, "Push day"
5. **Mediciones**: Peso 75.1 kg
6. **Sueño**: 7.5h, calidad buena
7. **Sentimiento**: Energía 4/5, Ánimo 4/5
8. **Guardar** → ¡Listo!

**Resultado**: 1250 kcal, 85g proteína calculados automáticamente

---

**Desarrollado con ❤️ por Lolo + Claude**
**Versión**: 2.0
**Sitio web**: [vitalup.me](https://vitalup.me)
**Última actualización**: Noviembre 2024