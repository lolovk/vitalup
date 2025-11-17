# CHANGELOG - VitalUp.me

## Versión 2.0 - Noviembre 2024

### 🎉 CAMBIOS MAYORES

#### Renombrado de Aplicación
- **Workout Tracker** → **VitalUp.me**
- Actualización completa de branding
- Nuevas keys de localStorage: `vitalup_registros` y `vitalup_config`
- Migración automática desde keys antiguas

#### Sistema de Comidas Dinámico
- ✨ **NUEVO**: Añade ilimitadas comidas por día
- Cada comida tiene:
  - Tipo seleccionable (Desayuno, Comida, Merienda, Cena, Extra)
  - Hora específica
  - Descripción del contenido
  - Calorías individuales
  - Proteínas individuales
- Suma automática de calorías y proteínas al total del día
- Botón "Añadir comida" en modo completo
- Visual mejorado con cards individuales por comida

#### Consumos Negativos Configurables
- ✨ **NUEVO**: Sistema completamente personalizable
- Ya no son checkboxes fijos de "Alcohol" y "Dulces"
- El usuario define sus propios consumos a evitar
- Por defecto incluye: Alcohol, Dulces, Snacks procesados, Refrescos
- Se pueden añadir/quitar desde Configuración
- Array dinámico en lugar de booleanos

#### Columnas Personalizables en Registros
- ✨ **NUEVO**: Selector de columnas visibles
- Botón "Columnas" en vista de Registros
- Opciones disponibles:
  - Fecha
  - Calorías
  - Proteínas
  - Entrenamiento
  - Consumos negativos
  - Sueño
  - Peso
  - Perímetro abdominal
  - Ánimo
  - Energía
  - Acciones
- Configuración se guarda automáticamente
- Cada usuario puede personalizar su vista

#### Tipos de Comida Editables
- ✨ **NUEVO**: Sección en Config para editar tipos
- Ya no limitado a "Desayuno, Comida, Cena, Snacks"
- Añade tipos personalizados: "Pre-entreno", "Post-entreno", etc.
- Se reflejan en el selector al añadir comidas
- Flexibilidad total para adaptarse a cada usuario

### 🐛 CORRECCIONES DE ERRORES

#### Estadísticas
- ✅ **FIXED**: Error en consola al entrar sin datos
  - Problema: `Cannot read properties of undefined (reading 'add')`
  - Solución: Manejo correcto de event undefined en cargarRango()
  - Añadido data-dias a botones para identificación correcta

- ✅ **FIXED**: Altura infinita de gráficos
  - Problema: Charts crecían continuamente al cambiar de rango
  - Solución: Wrapping de canvas en div con altura fija (250px)
  - Charts ahora mantienen dimensiones consistentes

#### Input de Sueño
- ✅ **FIXED**: Decimales excesivos
  - Problema: Input permitía muchos decimales (7.123456789)
  - Solución: 
    - step="0.5" en input
    - toFixed(1) al mostrar valores guardados
    - min="0" max="12" para límites razonables
  - Ahora solo permite incrementos de 0.5

#### Título del Modal
- ✅ **FIXED**: No se actualizaba al cambiar fecha
  - Problema: Título estático al seleccionar otra fecha en el selector
  - Solución: Función updateModalTitle() que se llama en updateFecha()
  - Ahora muestra dinámicamente: "Registro del [fecha formateada]"

### 🔄 MEJORAS DE ESTRUCTURA

#### Migración Automática de Datos
- Sistema de migración de estructura antigua a nueva
- Función migrarRegistroAntiguo() en quick-entry.js
- Convierte:
  - comidas.desayuno → comidas[0] tipo Desayuno
  - comidas.comida → comidas[1] tipo Comida
  - comidas.cena → comidas[2] tipo Cena
  - comidas.snacks → comidas[3] tipo Extra
  - alcohol (boolean) → consumos_negativos array
  - dulces (boolean) → consumos_negativos array
- Se ejecuta automáticamente al abrir registros antiguos

#### Configuración Expandida
- Nuevas secciones en Storage.getConfig():
  - `consumos_negativos`: Array de strings
  - `tipos_comida`: Array de strings
  - `columnas_visibles`: Array de IDs de columnas
- Config más flexible y extensible

#### Dashboard Actualizado
- Soporte para nueva estructura de datos
- Indicador de "Consumos negativos" en lugar de checkboxes individuales
- Muestra cantidad de consumos negativos del día
- "Días limpios" en resumen semanal (sin consumos negativos)

#### Registros Actualizado
- Renderizado dinámico basado en columnas visibles
- Mejor manejo de consumos negativos (lista en lugar de iconos)
- Formato mejorado de datos numéricos (horas de sueño con 1 decimal)

### 📚 DOCUMENTACIÓN

#### README.md Actualizado
- Información completa sobre nuevas características
- Sección detallada sobre sistema de comidas
- Guía de personalización expandida
- Casos de uso actualizados
- Novedades v2.0 documentadas

#### INICIO-RAPIDO.md Actualizado
- Instrucciones para sistema de comidas
- Guía de personalización de consumos negativos
- Cómo configurar tipos de comida
- Cómo personalizar columnas
- Sección "Dos formas de usar" (minimalista vs detallado)

#### CHANGELOG.md Creado
- Este archivo
- Documentación completa de cambios

### 🎨 MEJORAS DE UX

#### Formulario de Entrada
- Mejor organización visual de comidas
- Cards individuales por comida con border
- Botones de eliminar comida más accesibles
- Suma automática visible de calorías/proteínas de comidas
- Indicadores de totales vs comidas individuales

#### Config
- Separación visual clara entre:
  - Suplementos (positivos) → Verde
  - Consumos negativos → Rojo
  - Tipos de comida → Verde
- Iconos contextuales para cada sección
- Botones de acción con colores semánticos

#### Registros
- Botón "Columnas" prominente
- Selector de columnas con checkboxes claros
- Tabla más limpia y adaptable
- Mejor uso del espacio horizontal

### 🔧 CAMBIOS TÉCNICOS

#### LocalStorage Keys
- `wt_registros` → `vitalup_registros`
- `wt_config` → `vitalup_config`

#### Estructura de Datos
```javascript
// ANTES:
nutricion: {
  comidas: {
    desayuno: "string",
    comida: "string",
    cena: "string",
    snacks: "string"
  },
  alcohol: boolean,
  dulces: boolean
}

// AHORA:
nutricion: {
  comidas: [
    {
      tipo: "string",
      contenido: "string",
      hora: "HH:mm",
      calorias: number,
      proteinas: number
    }
  ],
  consumos_negativos: ["string"]
}
```

#### Preferencias Expandidas
```javascript
// ANTES:
preferencias: {
  campos_obligatorios: [],
  mostrar_detalles_comida: boolean,
  recordar_suplementos: boolean
}

// AHORA:
preferencias: {
  campos_obligatorios: [],
  mostrar_detalles_comida: boolean,
  recordar_suplementos: boolean,
  columnas_visibles: []  // NUEVO
}
```

### 📦 DEMO DATA

#### demo-data.js Actualizado
- Genera datos con nueva estructura
- Comidas individuales con horarios realistas
- Consumos negativos variados
- Distribución realista de macros por comidas
- Compatible con migración automática

### ⚠️ BREAKING CHANGES

Ninguno. La app mantiene **retrocompatibilidad total**:
- Datos antiguos se migran automáticamente
- No se pierden registros existentes
- Conversión transparente para el usuario
- Config antiguo se complementa con valores por defecto

### 🚀 PRÓXIMOS PASOS SUGERIDOS

Ideas para futuras versiones:
- [ ] Calculadora de macros integrada
- [ ] Plantillas de comidas frecuentes
- [ ] Fotos de progreso
- [ ] Recordatorios/notificaciones
- [ ] Gráfico de distribución horaria de comidas
- [ ] Análisis de patterns: qué comidas te hacen sentir mejor
- [ ] Export a PDF con informe completo
- [ ] Sincronización entre dispositivos (opcional)

---

**Desarrollador**: Claude + Lolo  
**Fecha**: Noviembre 2024  
**Versión**: 2.0  
**Sitio**: VitalUp.me
