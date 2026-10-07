# Contrato OpenAPI de administración

Esta carpeta contiene la especificación modular de las operaciones que consume la vista de administración del frontend. La fuente canónica es [api.md de Menu-Documentation](https://github.com/FMAT-Restaurant/Menu-Documentation/blob/main/docs/api.md); el archivo api.md de la raíz de este repositorio tenía el mismo contenido al generar el contrato.

## Índice

- [Especificación principal](../openapi.yaml): servidor, seguridad, rutas y registro de componentes.
- [Bundle compilado](../dist/openapi.yaml): documento autocontenido para herramientas que no resuelven referencias a archivos externos.
- [Rutas](../paths/): operaciones agrupadas por categorías, entradas, ofertas, recetas, inventario e imágenes.
- [Esquemas](../components/schemas/): modelos, solicitudes y respuestas JSON.
- [Parámetros](../components/parameters.yaml): paginación, búsqueda, filtros y ETags.
- [Respuestas HTTP](../components/responses.yaml): errores reutilizables y respuesta condicional 304.
- [Headers](../components/headers.yaml): ETag.

Para regenerar el bundle desde la raíz del repositorio:

    pnpm api:bundle

El comando escribe el bundle en `docs/apis/menu/dist/openapi.yaml`.

## Convenciones

La URL base de cada entorno se configura con API_BASE_URL y termina en /api/v1. Las respuestas JSON exitosas usan el campo data; las listas agregan meta. Las solicitudes requieren Bearer; PATCH y DELETE requieren If-Match. Las consultas aceptan If-None-Match.

## Límites de la fuente

- `pageSize` es un entero positivo y su valor predeterminado es `12`; no se limita a una lista cerrada de tamaños.
- La fuente no define si composition.slots en un PATCH se fusiona o reemplaza. La especificación conserva la forma del objeto y deja esa semántica sin fijar.
- docs/arch.md de Menu-Frontend identifica Menu-Documentation como fuente de operaciones y advierte que autenticación, concurrencia e integraciones de inventario e imágenes requieren acuerdos. Esta carpeta refleja las convenciones explícitas del api.md; el registro OPEN-010 y el OpenAPI canónico de Menu-Documentation aún requieren sincronización antes de declarar cerrada allí la decisión.
