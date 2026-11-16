# Librería Entre Líneas

Tienda de libros desarrollada en React donde los usuarios exploran el catálogo por categorías. Las categorías y los libros se obtienen desde una **API REST mock** implementada con **MSW (Mock Service Worker)**, con manejo de errores, indicadores de carga y consultas optimizadas.

**Sitio publicado:** https://m-vargas-h.github.io/libreria-miguel-vargas-pfy2202/


## Tecnologías
- React 19 + Vite
- React Router v7 (`react-router`): rutas centralizadas, anidadas con Layout, parámetros dinámicos y lazy loading
- MSW 2 (Mock Service Worker): backend REST simulado en el navegador
- Tailwind CSS v4: tema con `@theme` y clases reutilizables con `@apply`
- gh-pages para el despliegue en GitHub Pages

## Funcionalidades
- **Inicio:** presentación de la tienda y accesos rápidos a cada categoría.
- **Categorías:** listado de categorías obtenido desde la API, con la cantidad de libros de cada una.
- **Libros por categoría:** libros de la categoría seleccionada; si no tiene libros se muestra un mensaje (categoría Drama).
- **Detalle de libro:** autor, descripción, año, páginas, precio y enlace de regreso a su categoría.
- **Simulador del servidor:** selector en el pie de página para probar cómo responde la aplicación ante distintas fallas del backend.

## Páginas y rutas
| Ruta | Página | Descripción |
|------|--------|-------------|
| `/` | Inicio | Presentación y accesos rápidos a las categorías |
| `/categorias` | Categorías | Listado de categorías desde la API |
| `/categorias/:categoriaId` | Libros por categoría | Libros de una categoría (ruta dinámica con `useParams`) |
| `/libros/:libroId` | Detalle de libro | Información completa de un libro |
| `*` | No encontrada | Página para rutas inexistentes |

Las rutas se definen en `src/routes/AppRoutes.jsx` como rutas anidadas de `Layout` (Header + `Outlet` + Footer). Las páginas se cargan con `React.lazy` y `Suspense`.

## API REST mock (MSW)
Los handlers están en `src/mocks/handlers.js` y los datos en `src/mocks/datos/`. Cada respuesta tiene un retraso simulado de 800 ms.

| Método | Endpoint | Respuesta | Errores |
|--------|----------|-----------|---------|
| GET | `/api/categorias` | Lista de categorías con `cantidadLibros` | — |
| GET | `/api/categorias/:id` | Una categoría | 404 si no existe |
| GET | `/api/categorias/:id/libros` | Libros de la categoría | 404 si la categoría no existe |
| GET | `/api/libros/:id` | Detalle del libro con su categoría | 404 si no existe |

`src/main.jsx` inicia el worker (`enableMocking`) antes de renderizar la aplicación. El mock se mantiene activo también en producción porque el sitio publicado no tiene un backend real; el worker se registra bajo la base del sitio (`BASE_URL`).

### Simulador del servidor
El selector del pie de página (`src/mocks/escenario.js`) cambia la respuesta de todos los endpoints. La opción elegida se guarda en `sessionStorage`.

| Escenario | Respuesta del mock |
|-----------|--------------------|
| Normal | Datos correctos |
| Error 500 del servidor | Estado 500 con mensaje de error |
| Sin conexión | Falla de red (`HttpResponse.error()`) |
| Respuesta lenta | Retraso de 8 s, supera el tiempo de espera del cliente (5 s) |
| Respuesta con formato inválido | Estado 200 con una estructura distinta a la esperada |

## Manejo de errores
El cliente (`src/api/clienteApi.js`) traduce cada falla a un `ErrorApi` (`src/api/errores.js`) con título, detalle y sugerencia para el usuario:

| Tipo | Causa | Acción disponible |
|------|-------|-------------------|
| No encontrado | Respuesta 404 | Volver al catálogo (no se ofrece reintentar) |
| Error del servidor | Respuesta 5xx | Reintentar |
| Sin conexión | Falla de red | Reintentar |
| Tiempo agotado | Sin respuesta en 5 s | Reintentar |
| Formato inválido | JSON inválido o estructura inesperada | Reintentar |

**Alternativas ante una falla:**
- Botón **Reintentar** y enlaces de regreso en cada mensaje de error.
- **Datos de respaldo:** si una actualización falla, se siguen mostrando los últimos datos obtenidos con un aviso que indica la hora en que se obtuvieron.
- **Validación de respuestas** (`src/utils/validaciones.js`): cada respuesta se valida según su ruta antes de usarla; los datos con formato inválido nunca se guardan ni se muestran.

## Indicadores de carga
- **Tarjetas esqueleto** (`EsqueletoTarjetas`) con la forma del contenido final mientras cargan las listas.
- **Actualizando…** (`IndicadorActualizando`) cuando se recargan datos que ya están en pantalla, sin vaciar la página.
- **Indicador simple** (`Cargando`) en el detalle del libro.
- **Barra de progreso** (`CargandoPagina`) mientras se descarga el código de una página (fallback de `Suspense`).

Cada indicador corresponde a una petición y se retira al recibir la respuesta o el error.

## Optimización de consultas
Las páginas consultan la API con el hook `useConsulta(ruta)` (`src/hooks/useConsulta.js`), que usa la caché de `src/api/cache.js`:

- **Caché en memoria** de 5 minutos por ruta: al volver a una página ya visitada no se repite la petición.
- **Peticiones compartidas:** si varios componentes piden la misma ruta a la vez se hace una sola petición (incluye el doble montaje de `StrictMode`).
- **Datos sembrados:** al recibir la lista de categorías se guarda cada categoría por separado, por lo que la página de una categoría no vuelve a pedir su información.
- **Precarga:** al pasar el mouse o enfocar una categoría se piden sus libros por adelantado.
- **Cancelación:** si el usuario sale de la página antes de recibir la respuesta, la petición se cancela con `AbortController`.
- **Consultas en paralelo:** la página de una categoría pide la categoría y sus libros al mismo tiempo.
- **Actualizar:** botón para pedir datos nuevos ignorando la caché.

Los valores de configuración (URL base, tiempo de espera y vigencia de la caché) están en `src/constants/api.js`.

## Estilos
- **Tema** (`src/index.css`, `@theme`): colores de marca `marca-50` a `marca-900` y animación de la barra de carga.
- **Clases reutilizables** (`@layer components` + `@apply`): `contenedor`, `titulo-pagina`, `tarjeta`, `grilla`, `btn` y variantes, `alerta-*`, `enlace` y `spinner`.
- **Componente `Boton`**: variantes `primario` y `secundario`; se renderiza como `Link` cuando recibe `to`.

## Instalación y ejecución
```bash
git clone https://github.com/m-vargas-h/libreria-miguel-vargas-pfy2202.git
cd libreria-miguel-vargas-pfy2202
npm install
npm run dev
```
Luego abrir `http://localhost:5173/libreria-miguel-vargas-pfy2202/` en el navegador.

## Despliegue
El sitio se publica en GitHub Pages desde la rama `gh-pages` con `npm run deploy`. Para que funcione en la subruta del repositorio:
- `vite.config.js` define `base: '/libreria-miguel-vargas-pfy2202/'`.
- `BrowserRouter` usa `basename={import.meta.env.BASE_URL}`.
- El worker de MSW (`public/mockServiceWorker.js`) se registra con la misma base.
- El script `postbuild` copia `index.html` como `404.html`, para que al recargar una ruta interna (por ejemplo `/categorias/fantasia`) GitHub Pages cargue la aplicación.

## Estructura del proyecto
```
public/
└── mockServiceWorker.js          # Worker generado con "npx msw init ./public"
src/
├── App.jsx                       # BrowserRouter + AppRoutes
├── main.jsx                      # Inicia MSW y luego renderiza la aplicación
├── index.css                     # Tailwind: @theme y clases con @apply
├── routes/
│   └── AppRoutes.jsx             # Rutas centralizadas, anidadas y con lazy loading
├── api/
│   ├── clienteApi.js             # fetch con tiempo de espera y traducción de errores
│   ├── errores.js                # ErrorApi y tipos de error
│   ├── cache.js                  # Caché, peticiones compartidas y cancelación
│   └── libreriaApi.js            # Rutas de la API, validación, datos sembrados y precarga
├── hooks/
│   └── useConsulta.js            # Estado de una consulta: datos, carga, error y respaldo
├── constants/
│   └── api.js                    # URL base, tiempo de espera y vigencia de la caché
├── utils/
│   ├── validaciones.js           # Validación del formato de las respuestas
│   └── formato.js                # Formato de precios
├── mocks/
│   ├── browser.js                # setupWorker con los handlers
│   ├── handlers.js               # Endpoints REST simulados
│   ├── escenario.js              # Escenario del simulador del servidor
│   └── datos/
│       ├── categorias.js
│       └── libros.js
└── components/
    ├── Layout.jsx                # Header + Outlet + Footer
    ├── Header.jsx
    ├── MenuPrincipal.jsx
    ├── Footer.jsx
    ├── SimuladorBackend.jsx      # Selector de escenario del mock
    ├── Boton.jsx                 # Botón reutilizable con variantes
    ├── TarjetaCategoria.jsx      # Con precarga de libros
    ├── TarjetaLibro.jsx
    ├── MensajeError.jsx          # Error con sugerencia, Reintentar y acciones
    ├── AvisoRespaldo.jsx         # Aviso de datos de respaldo
    ├── BarraConsulta.jsx         # Botón Actualizar + indicador + aviso de respaldo
    ├── Cargando.jsx
    ├── CargandoPagina.jsx        # Fallback de Suspense
    ├── EsqueletoTarjetas.jsx
    ├── IndicadorActualizando.jsx
    └── pages/
        ├── Home.jsx
        ├── Categorias.jsx
        ├── LibrosCategoria.jsx
        ├── DetalleLibro.jsx
        └── NoEncontrada.jsx
```
