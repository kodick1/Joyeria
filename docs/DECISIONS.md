# Decisiones de diseño visual

## Alcance

Aurelia es un prototipo frontend. No llama a servicios externos y no tiene API, base de datos ni inicio de sesión. El catálogo de demostración y las métricas base son locales. Las piezas creadas por el panel, incluyendo sus imágenes optimizadas, se guardan en IndexedDB para que el cliente las vea desde el mismo navegador/dispositivo. No se sincronizan con otros dispositivos.

## Identidad

Marfil, carbón y oro champagne definen una interfaz serena donde la fotografía y las piezas llevan el protagonismo. Cormorant Garamond aporta carácter editorial a los títulos; Inter mantiene legible la información funcional. Los SVG de `/public/seed` son ilustraciones originales locales, no fotos de producto.

## Experiencia

El catálogo filtra el conjunto local y mantiene los criterios de búsqueda en la URL. El administrador puede seleccionar hasta cinco fotos por producto; se reducen a WebP y 1600 px antes de guardarse. La vista previa, la portada, las tarjetas y la galería de detalle presentan las imágenes que cargó el administrador. Las acciones de exportación descargan CSV local.

## Evolución

El contenido de demostración está aislado en `apps/web/src/lib/products.ts`; los productos creados se aíslan en `apps/web/src/lib/product-storage.ts`. Para publicar las mismas fotos a otros usuarios habrá que sustituir el almacenamiento del navegador por un servicio backend y almacenamiento de objetos. Hasta entonces no deben tratarse el inventario ni las estadísticas como datos comerciales reales.
