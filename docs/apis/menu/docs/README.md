# Contrato OpenAPI de administración

Esta carpeta contiene la especificación modular de las operaciones de Menu y las referencias `GET /api/v1/inventory/items` y `GET /api/v1/inventory/item/{id}`, incluidas para que los trabajadores frontend puedan consultar artículos. Estas operaciones pertenecen al servicio externo de Inventario: el frontend las llama directamente en el host propio de ese servicio y el backend de Menu no las implementa. La fuente canónica del contrato es [openapi.yaml](../openapi.yaml), versión 6.0.0; la fuente de requisitos y dominio es la [ERS del servicio Menu](../../../ers/README.md), versión 2.1.19.

## Índice

- [Especificación principal](../openapi.yaml): servidor, seguridad, rutas y registro de componentes.
- [Bundle compilado](../dist/openapi.yaml): documento autocontenido para herramientas que no resuelven referencias a archivos externos.
- [Rutas](../paths/): operaciones agrupadas por categorías, entradas, ofertas, recetas, inventario e imágenes.
- [Esquemas](../components/schemas/): modelos, solicitudes y respuestas JSON.
- [Parámetros](../components/parameters.yaml): paginación, búsqueda, filtros, ETags e Idempotency-Key.
- [Respuestas HTTP](../components/responses.yaml): errores reutilizables y respuesta condicional 304.
- [Headers](../components/headers.yaml): ETag.

Para regenerar el bundle desde la raíz del repositorio:

    pnpm api:bundle

El comando escribe el bundle en `docs/apis/menu/dist/openapi.yaml`.

## Convenciones

API_BASE_URL identifica el host de las rutas de Menu y termina en /api/v1. `GET /api/v1/inventory/items` y `GET /api/v1/inventory/item/{id}` se incluyen como referencias para consulta de los trabajadores frontend, pero pertenecen al servicio externo de Inventario y el frontend las llama directamente en el host propio de Inventario. Ese host se configura para cada despliegue; no forma parte de API_BASE_URL. Menu no implementa esas rutas y solo conserva referencias a artículos. Las respuestas JSON exitosas usan el campo data; las listas agregan meta. Las solicitudes requieren Bearer; PATCH y DELETE requieren If-Match. Las consultas aceptan If-None-Match.

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

```http
POST /api/v1/menu/entries
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: 83f34a6a-5611-41dd-b437-a9cb96d932c2
```

```json
{
  "brandName": "Hamburguesa Hawaiana",
  "description": "Carne, jamón, queso y piña en pan artesanal.",
  "categoryIds": ["0ddba9d0-0f45-4abc-9e4a-3e3471a5ce01"],
  "imageId": "55e62412-9249-4db6-8ccb-31f19ea2f501"
}
```

El servidor asigna `INACTIVE` a la entrada creada.

En `POST /menu/entries/{entryId}/offers`, el servidor asigna `INACTIVE` a la oferta creada y `ACTIVE` a cada opción nueva; la solicitud no admite `status` en las opciones. `presentationTag` es un string requerido en POST y PATCH de ofertas y está siempre presente en sus representaciones de respuesta.

## Idempotencia de creación

`POST /menu/entries` y `POST /menu/entries/{entryId}/offers` requieren el encabezado `Idempotency-Key` con un UUID generado por el cliente, sin comillas, para cada creación lógica. La clave se delimita por el sujeto autenticado, el menú provisionado, el método `POST` y la ruta concreta, incluido `entryId`. Una creación distinta usa una clave nueva.

Durante las 24 horas posteriores a la confirmación inicial exitosa, reenviar la misma clave y el mismo cuerpo JSON devuelve el `201`, el cuerpo y el `ETag` originales. Los reintentos no extienden ese plazo, no crean otro recurso ni repiten la asociación de imagen o la selección de revisión de receta. La comparación de JSON ignora espacios y el orden de las propiedades de objetos, conserva el orden de los arrays y distingue un campo omitido de `null`.

El cliente conserva la clave, el cuerpo y el `imageId` para los reintentos, incluso si pierde la respuesta o recibe un error de conexión. No vuelve a cargar la imagen para reintentar la creación. Estas claves no cubren `POST /media/images`: la carga previa conserva su interfaz y es una operación independiente.

| Situación | Respuesta | Acción del cliente |
| --- | --- | --- |
| Encabezado ausente o UUID inválido | `400`, `error.details.code: INVALID_IDEMPOTENCY_KEY` | Enviar una clave válida. |
| Misma clave vigente con otro JSON | `409`, `error.details.code: IDEMPOTENCY_KEY_REUSED` | Reenviar los datos originales; usar una clave nueva solo para otra creación. |
| Misma clave y JSON todavía en proceso | `409`, `error.details.code: IDEMPOTENCY_IN_PROGRESS`, `Retry-After` en segundos | Esperar ese plazo y reenviar la misma clave y los mismos datos. |
| Misma clave y JSON ya confirmados | `201` con el cuerpo y `ETag` originales | Usar los mismos identificadores del resultado original. |

Cada reintento verifica autenticación y autorización. Un resultado exitoso vigente se recupera antes de volver a validar las referencias actuales; se devuelve aunque después se haya editado o eliminado el recurso. Para conocer su estado y su `ETag` actuales antes de un `PATCH`, consulte el recurso mediante `GET`.

Los fallos anteriores a la confirmación, incluido `502` al validar con Inventario, no conservan un resultado exitoso ni aplican cambios parciales; puede reintentarse con la misma clave y los mismos datos. Tras las 24 horas, una clave expirada se trata como nueva y podría crear un duplicado. Si una creación sigue sin confirmarse al vencer ese plazo, no la reenvíe automáticamente: primero determine si el recurso ya existe.

## Selección de recetas

Una opción `RECIPE` se configura únicamente con `recipeId`, además de los campos propios de la opción. Al asignarla, el servidor selecciona y fija atómicamente la revisión publicada válida más reciente. Una receta inexistente o sin revisión válida devuelve `422` sin cambios parciales. La revisión propia de la receta y su historial se conservan; `recipeRevision` no se envía ni se expone en las opciones de ofertas.

En un `PATCH` de una opción existente que conserva `sourceType: RECIPE`, omitir `recipeId` conserva la asignación vigente. Enviar `recipeId`, incluso si es el mismo, selecciona de nuevo la revisión válida más reciente. Editar la receta en la biblioteca no cambia retroactivamente las asignaciones previas ni las revisiones históricas.

## Actualización de ofertas

`PATCH /menu/offers/{offerId}` conserva recursivamente los campos omitidos, excepto `presentationTag`, que debe enviarse siempre; para conservarlo, reenvíe su valor vigente. Cada colección enviada reemplaza completamente la vigente: los elementos no incluidos se eliminan. Los slots y opciones existentes se identifican por su ID y permiten actualizar solo algunos campos; los nuevos omiten el ID, que asigna el servidor, y requieren los campos definidos en sus esquemas. Las colecciones de slots y opciones deben contener al menos un elemento; las listas vacías y los IDs ajenos, desconocidos o duplicados se rechazan con `422`.

En una opción existente, reenviar el mismo `sourceType` conserva los campos omitidos del origen. Cambiarlo requiere la tupla completa del nuevo tipo; el servidor lo compara con el tipo almacenado y rechaza con `422` una tupla incompleta sin aplicar cambios.

La actualización valida todas las invariantes y se aplica de forma atómica. Requiere `If-Match` con el ETag fuerte vigente: su ausencia devuelve `428` y una versión desactualizada devuelve `412`.

La descripción de categoría es opcional.

## Validación con Inventario

`InventoryItem.id` e `inventoryItemId` son strings opacos sin requisito de formato UUID, por ejemplo `CARNE-150G`. Se mantiene la validación de existencia del artículo en Inventario.

`GET /api/v1/inventory/item/{id}` consulta el detalle mediante un `id` de tipo string genérico y devuelve `data` con `id`, `name` y `unit`. Si el artículo no existe, devuelve `404`.

En POST y PATCH de ofertas y recetas, si falla una consulta a Inventario necesaria para validar artículos o insumos, Menu devuelve `502` sin crear o modificar el recurso ni aplicar cambios parciales. Una referencia a un artículo inexistente o inválido devuelve `422`.

## Eliminación de entradas y ofertas

`DELETE /menu/entries/{entryId}` requiere que la entrada esté `ARCHIVED` y elimina también sus ofertas asociadas. `DELETE /menu/offers/{offerId}` requiere que la oferta esté `INACTIVE` y que su eliminación no deje una entrada `ACTIVE` sin al menos una oferta `ACTIVE` válida. Incumplir estas condiciones devuelve `409` sin aplicar cambios.

Ambas operaciones requieren `If-Match`: su ausencia devuelve `428` y un valor obsoleto devuelve `412`, sin modificaciones. Una eliminación exitosa devuelve `204` sin cuerpo ni encabezado `ETag`, porque no queda una representación vigente del recurso eliminado; el historial se conserva según las reglas del dominio.

## Límites de la fuente

- `pageSize` es un entero positivo y su valor predeterminado es `12`; no se limita a una lista cerrada de tamaños.
- El contrato existente define operaciones administrativas. Su alineación integral con la ERS y las operaciones y representaciones faltantes siguen pendientes bajo [OPEN-010](../../../ers/open.md#open-010--contrato-externo-de-la-api); el flujo de carga y asociación de imágenes ya está resuelto.
