# Aurelia Joyería

Prototipo visual de una joyería contemporánea de lujo accesible, creado con Next.js App Router, React, TypeScript y Tailwind CSS. No incluye API, base de datos, autenticación ni persistencia: las piezas y cifras son datos locales de demostración.

## Ejecutar

Desde la carpeta del proyecto:

```powershell
npm install
npm run dev
```

Abre la dirección que Next.js muestre en la terminal, normalmente http://localhost:3000. Si ese puerto está ocupado, Next.js selecciona otro disponible. Para compilar el sitio: `npm run build`.

## Vistas

- `/`: portada editorial, selección destacada y valores de la marca.
- `/joyas`: catálogo con búsqueda, orden y filtros visuales.
- `/joyas/[slug]`: detalle de producto con ficha y disponibilidad de demostración.
- `/admin`: resumen visual de inventario, exportación CSV de muestra y acceso a crear pieza.
- `/admin/productos/nuevo`: formulario con carga de hasta cinco fotos JPG, PNG o WebP por pieza (8 MB por archivo), previsualización, validación y destacado en portada.

Las piezas nuevas y sus fotos se guardan en IndexedDB del navegador. Aparecen en el catálogo, los destacados de portada, el panel y la ficha para clientes; al abrir la ficha se puede recorrer la galería de fotos. Este prototipo no sube imágenes a un servidor: solo se verán en el mismo navegador y dispositivo donde se cargaron. Para compartirlas con otros clientes/dispositivos se necesitaría conectar almacenamiento y un backend.

Las imágenes ilustrativas SVG están en `apps/web/public/seed`. El catálogo de demostración editable está en `apps/web/src/lib/products.ts`.

## Calidad

- `npm run build`: compilación de producción.
- `npm test`: pruebas de componentes.
- `npm run lint`: ESLint.
- `npm run format:check`: revisión de formato con Prettier.
