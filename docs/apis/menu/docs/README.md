# Contrato OpenAPI de administración

Esta carpeta contiene la especificación modular de las operaciones que consume la vista de administración del frontend. La fuente canónica del contrato es [openapi.yaml](../openapi.yaml), versión 4.0.1; la fuente de requisitos y dominio es la [ERS del servicio Menu](../../../ers/README.md), versión 2.1.17.

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

Para asociar una imagen, primero se carga el archivo mediante `POST /api/v1/media/images`, con `multipart/form-data` y el campo `file`. El servicio valida JPEG, PNG o WebP, hasta 10 MiB y 4096 px de ancho y alto cada uno, incluido el contenido real y su decodificación. Tras validar la carga, el servidor genera el identificador y lo devuelve como `data.id`.

La creación de entradas y ofertas recibe JSON y requiere ese identificador como `imageId`. En los PATCH, `imageId` es opcional: enviarlo reemplaza la asociación y omitirlo conserva la imagen vigente. No se reenvía el archivo ni una URL. Una referencia inexistente, inválida o inaccesible se rechaza sin crear o modificar el recurso ni aplicar cambios parciales. La carga previa es una operación independiente y no se deshace si falla la asociación.

Por ejemplo, una carga exitosa devuelve:

```json
{
  "data": {
    "id": "55e62412-9249-4db6-8ccb-31f19ea2f501",
    "url": "https://cdn.example.com/menu/hamburguesa-hawaiana.jpg",
    "thumbnailUrl": "https://cdn.example.com/menu/hamburguesa-hawaiana-thumb.jpg"
  }
}
```

Después, `POST /api/v1/menu/entries` recibe:

```json
{
  "brandName": "Hamburguesa Hawaiana",
  "description": "Carne, jamón, queso y piña en pan artesanal.",
  "categoryIds": ["0ddba9d0-0f45-4abc-9e4a-3e3471a5ce01"],
  "imageId": "55e62412-9249-4db6-8ccb-31f19ea2f501"
}
```

El servidor asigna `INACTIVE` a la entrada creada.

## Actualización de ofertas

`PATCH /menu/offers/{offerId}` conserva recursivamente los campos omitidos. Cada colección enviada reemplaza completamente la vigente: los elementos no incluidos se eliminan. Los slots y opciones existentes se identifican por su ID y permiten actualizar solo algunos campos; los nuevos omiten el ID, que asigna el servidor, y requieren los campos definidos en sus esquemas. Las colecciones de slots y opciones deben contener al menos un elemento; las listas vacías y los IDs ajenos, desconocidos o duplicados se rechazan con `422`.

En una opción existente, reenviar el mismo `sourceType` conserva los campos omitidos del origen. Cambiarlo requiere la tupla completa del nuevo tipo; el servidor lo compara con el tipo almacenado y rechaza con `422` una tupla incompleta sin aplicar cambios.

La actualización valida todas las invariantes y se aplica de forma atómica. Requiere `If-Match` con el ETag fuerte vigente: su ausencia devuelve `428` y una versión desactualizada devuelve `412`.

La descripción de categoría es opcional.

## Límites de la fuente

- `pageSize` es un entero positivo y su valor predeterminado es `12`; no se limita a una lista cerrada de tamaños.
- El contrato existente define operaciones administrativas. Su alineación integral con la ERS y las operaciones y representaciones faltantes siguen pendientes bajo [OPEN-010](../../../ers/open.md#open-010--contrato-externo-de-la-api); el flujo de carga y asociación de imágenes ya está resuelto.
