# 🚀 Guía de Despliegue - VitalUp.me

## Preparación de Archivos

Ya tienes todo listo en el ZIP `vitalup-v2.0.zip`. Al descomprimirlo obtendrás:

```
vitalup/
├── index.html              # Página principal
├── app.js                  # Router
├── storage.js              # Sistema de datos
├── demo-data.js           # Datos de ejemplo (puedes borrarlo)
├── views/
│   ├── dashboard.js
│   ├── quick-entry.js
│   ├── registros.js
│   ├── estadisticas.js
│   └── config.js
├── README.md
├── INICIO-RAPIDO.md
└── CHANGELOG.md
```

## Opción 1: Hosting Estático Simple

### Requisitos
- Hosting con soporte para archivos estáticos (HTML/JS/CSS)
- No necesitas PHP, Node.js, ni base de datos
- Solo HTML + JavaScript vanilla

### Pasos

1. **Descomprimir** el ZIP
2. **Subir archivos** vía FTP/SFTP o panel de control
3. Estructura en el servidor:
   ```
   /public_html/  (o /www/ o /htdocs/)
   ├── index.html
   ├── app.js
   ├── storage.js
   ├── views/
   │   └── ...
   ```
4. **Acceder**: https://vitalup.me
5. ¡Listo!

### Notas Importantes
- El archivo `demo-data.js` es OPCIONAL
  - Si lo subes: La primera vez que alguien entre verá datos de ejemplo
  - Si lo borras: La app empezará vacía
  - Recomendación: **Bórralo** para producción, o déjalo comentado en index.html

## Opción 2: Netlify (Recomendado)

### Por qué Netlify
- ✅ Gratis
- ✅ HTTPS automático
- ✅ Deploy en segundos
- ✅ Dominio personalizado fácil
- ✅ CDN global

### Pasos

1. Ve a https://netlify.com
2. Crea cuenta (gratis)
3. Click en "Add new site" → "Deploy manually"
4. Arrastra la carpeta `vitalup` completa
5. Espera 30 segundos
6. ¡Deployed! Te da una URL tipo: `random-name.netlify.app`

### Conectar tu dominio VitalUp.me

1. En Netlify → Site settings → Domain management
2. Click "Add custom domain"
3. Ingresa: `vitalup.me`
4. Netlify te dará instrucciones de DNS
5. En tu proveedor de dominio (donde compraste vitalup.me):
   - Añade registro A o CNAME según instrucciones
   - Ejemplo típico:
     ```
     A    @    104.198.14.52
     CNAME www  your-site.netlify.app
     ```
6. Espera propagación DNS (15 minutos - 24 horas)
7. Netlify configura HTTPS automáticamente

## Opción 3: GitHub Pages

### Pasos

1. Crea repositorio en GitHub: `vitalup`
2. Sube todos los archivos
3. Settings → Pages
4. Source: Deploy from branch → `main` → `/ (root)`
5. Save
6. Tu sitio estará en: `tuusuario.github.io/vitalup`

### Dominio personalizado

1. En Settings → Pages → Custom domain
2. Ingresa: `vitalup.me`
3. En tu proveedor DNS:
   ```
   A    @    185.199.108.153
   A    @    185.199.109.153
   A    @    185.199.110.153
   A    @    185.199.111.153
   CNAME www  tuusuario.github.io
   ```
4. Marca "Enforce HTTPS"

## Opción 4: Vercel

Similar a Netlify:
1. https://vercel.com
2. Import project
3. Deploy
4. Añadir dominio personalizado

## Configuración Opcional: Service Worker (PWA)

Si quieres que funcione offline completamente, puedes añadir un service worker básico.

Crea `sw.js` en la raíz:

```javascript
const CACHE_NAME = 'vitalup-v2.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/app.js',
  '/storage.js',
  '/views/dashboard.js',
  '/views/quick-entry.js',
  '/views/registros.js',
  '/views/estadisticas.js',
  '/views/config.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

Y en `index.html`, antes de cerrar `</body>`:

```html
<script>
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('Service Worker registrado'))
    .catch(err => console.log('Error SW:', err));
}
</script>
```

## Verificación Post-Despliegue

Una vez desplegado, verifica:

1. ✅ https://vitalup.me carga correctamente
2. ✅ Click en botón + abre el modal
3. ✅ Puedes crear un registro de prueba
4. ✅ Dashboard muestra el registro
5. ✅ Estadísticas carga sin errores
6. ✅ Config se puede editar y guardar
7. ✅ Export/Import funciona
8. ✅ Funciona en móvil (responsive)
9. ✅ Console del navegador sin errores críticos

## Tailwind CSS Warning

Verás este warning en consola:
```
cdn.tailwindcss.com should not be used in production
```

**Es NORMAL y no afecta funcionamiento**. 

Si quieres quitarlo (opcional):
1. Instala Tailwind localmente
2. Genera CSS estático
3. Reemplaza el CDN

Pero para tu caso, el CDN funciona perfectamente.

## Analytics (Opcional)

Si quieres saber cuánta gente usa la app:

**Opción simple**: Netlify Analytics (de pago pero básico)
**Opción gratis**: Google Analytics, Plausible, etc.

Añadir antes de `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Actualizaciones Futuras

Cuando hagas cambios:

**Netlify/Vercel**: 
- Arrastra nueva carpeta → Deploy automático

**FTP**: 
- Sube archivos modificados

**GitHub Pages**: 
- Push a repositorio → Deploy automático

## Problemas Comunes

### "No carga la página"
- Verifica que index.html esté en la raíz
- Revisa configuración DNS si usas dominio personalizado

### "Gráficos no aparecen"
- Verifica que Chart.js cargue (CDN en index.html)
- Revisa consola del navegador

### "Los datos no se guardan"
- Esto es normal, todo es LocalStorage (navegador del usuario)
- No hay backend, cada usuario tiene sus datos localmente

### "Quiero que los datos se sincronicen entre dispositivos"
- Eso requiere backend (fuera del scope de esta versión)
- Para ahora: usa Export/Import manualmente

## Backup

**MUY IMPORTANTE**: 
- Los usuarios deben hacer backup con el botón "Exportar"
- Si limpian su navegador, pierden datos
- No hay backup automático (es una app 100% frontend)

## Mantenimiento

La app es estática, no requiere mantenimiento activo:
- No hay base de datos que mantener
- No hay servidor que actualizar
- No hay dependencias backend
- Solo actualizas cuando quieras nuevas features

---

## ✅ Checklist Final

Antes de considerarlo "en producción":

- [ ] Archivos subidos al hosting
- [ ] DNS configurado (si usas dominio personalizado)
- [ ] HTTPS funcionando
- [ ] Probado en Chrome, Firefox, Safari
- [ ] Probado en móvil
- [ ] demo-data.js eliminado o comentado
- [ ] README.md y guías accesibles para referencia
- [ ] Backup del código guardado en lugar seguro

---

**¿Listo para desplegar?** 🚀

1. Descomprime `vitalup-v2.0.zip`
2. Sigue una de las opciones de arriba
3. ¡Disfruta de VitalUp.me!
