/*********************************************
 * demo-data.js
 * Datos de ejemplo para testing rápido
 * VERSIÓN 2.0 - Nueva estructura
 * OPCIONAL: Elimina este archivo si no quieres datos demo
 *********************************************/

(function() {
  // Solo cargar si no hay datos existentes
  if (localStorage.getItem('vitalup_registros')) {
    console.log('Ya hay datos guardados, omitiendo demo data');
    return;
  }
  
  console.log('Cargando datos de demostración...');
  
  // Datos de ejemplo de los últimos 14 días
  const hoy = new Date();
  const registrosDemo = [];
  
  const tiposComida = ['Desayuno', 'Comida', 'Merienda', 'Cena', 'Extra'];
  const consumosNegativosOpciones = ['Alcohol', 'Dulces', 'Snacks procesados', 'Refrescos'];
  
  for (let i = 13; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(fecha.getDate() - i);
    const fechaStr = fecha.toISOString().split('T')[0];
    
    // Variación aleatoria pero realista
    const calorias = 1750 + Math.floor(Math.random() * 200 - 100);
    const proteinas = 140 + Math.floor(Math.random() * 20 - 10);
    const peso = 78.5 - (i * 0.2) + (Math.random() * 0.3);
    const entreno = Math.random() > 0.3; // 70% de días con entreno
    
    // Consumos negativos (15% probabilidad)
    const consumosNegativos = [];
    if (Math.random() > 0.85) {
      const num = Math.floor(Math.random() * 2) + 1; // 1-2 consumos
      for (let j = 0; j < num; j++) {
        const consumo = consumosNegativosOpciones[Math.floor(Math.random() * consumosNegativosOpciones.length)];
        if (!consumosNegativos.includes(consumo)) {
          consumosNegativos.push(consumo);
        }
      }
    }
    
    // Generar 3-4 comidas por día
    const numComidas = 3 + Math.floor(Math.random() * 2);
    const comidas = [];
    const tiposUsados = [];
    
    for (let j = 0; j < numComidas; j++) {
      let tipo;
      do {
        tipo = tiposComida[Math.floor(Math.random() * tiposComida.length)];
      } while (tiposUsados.includes(tipo) && tiposUsados.length < tiposComida.length);
      tiposUsados.push(tipo);
      
      const caloriasComida = Math.floor(calorias / numComidas) + Math.floor(Math.random() * 100 - 50);
      const proteinasComida = Math.floor(proteinas / numComidas) + Math.floor(Math.random() * 20 - 10);
      
      const ejemplosComida = [
        'Huevos revueltos, pan integral, aguacate',
        'Pechuga de pollo, arroz integral, brócoli',
        'Salmón al horno, patata asada, ensalada',
        'Batido de proteína con plátano',
        'Yogur griego con frutos secos',
        'Pasta integral con atún',
        'Tortilla de claras con espinacas'
      ];
      
      comidas.push({
        tipo: tipo,
        contenido: ejemplosComida[Math.floor(Math.random() * ejemplosComida.length)],
        hora: tipo === 'Desayuno' ? '08:00' :
              tipo === 'Comida' ? '14:00' :
              tipo === 'Merienda' ? '17:00' :
              tipo === 'Cena' ? '21:00' : '12:00',
        calorias: caloriasComida,
        proteinas: proteinasComida
      });
    }
    
    registrosDemo.push({
      fecha: fechaStr,
      
      nutricion: {
        calorias: calorias,
        proteinas: proteinas,
        comidas: comidas,
        consumos_negativos: consumosNegativos,
        suplementos: consumosNegativos.length === 0 ? ["Proteína", "Magnesio", "Vitamina D"] : []
      },
      
      mediciones: {
        peso: parseFloat(peso.toFixed(1)),
        perimetro_abdominal: i % 3 === 0 ? parseFloat((94 - (i * 0.15)).toFixed(1)) : null,
        otras: {}
      },
      
      entrenamiento: {
        hecho: entreno,
        tipo: entreno ? ['Fuerza', 'Cardio', 'HIIT'][Math.floor(Math.random() * 3)] : '',
        duracion: entreno ? 40 + Math.floor(Math.random() * 30) : null,
        intensidad: entreno ? 6 + Math.floor(Math.random() * 3) : null,
        notas: entreno ? "Buen entrenamiento, me sentí con energía" : ""
      },
      
      sueno: {
        horas: parseFloat((6 + Math.random() * 2).toFixed(1)),
        calidad: ['buena', 'regular', 'mala'][Math.floor(Math.random() * 3)]
      },
      
      sentimiento: {
        energia: Math.floor(Math.random() * 3) + 2,
        animo: Math.floor(Math.random() * 3) + 2,
        digestion: consumosNegativos.length > 0 ? 'pesado' : ['normal', 'normal', 'hinchado'][Math.floor(Math.random() * 3)],
        notas: ""
      },
      
      notas_generales: ""
    });
  }
  
  // Guardar
  localStorage.setItem('vitalup_registros', JSON.stringify(registrosDemo));
  
  // Config de ejemplo
  const configDemo = {
    objetivos: {
      calorias: 1800,
      proteinas: 145,
      peso_objetivo: 75,
      perimetro_objetivo: 90
    },
    preferencias: {
      campos_obligatorios: ['calorias', 'proteinas'],
      mostrar_detalles_comida: true,
      recordar_suplementos: true,
      columnas_visibles: ['fecha', 'calorias', 'proteinas', 'entreno', 'consumos', 'sueno', 'peso', 'acciones']
    },
    suplementos_habituales: ['Proteína', 'Magnesio', 'Vitamina D', 'Omega-3'],
    consumos_negativos: ['Alcohol', 'Dulces', 'Snacks procesados', 'Refrescos'],
    tipos_comida: ['Desayuno', 'Comida', 'Merienda', 'Cena', 'Extra']
  };
  
  localStorage.setItem('vitalup_config', JSON.stringify(configDemo));
  
  console.log('✓ Datos de demostración cargados (14 días de ejemplo)');
  console.log('Para eliminarlos: localStorage.clear() en la consola');
  
})();
