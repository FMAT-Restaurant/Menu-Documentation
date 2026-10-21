# Contrato OpenAPI de administración

Esta carpeta contiene la especificación modular de las operaciones de Menu y las referencias `GET /api/v1/inventory/items` y `GET /api/v1/inventory/item/{id}`, incluidas para que los trabajadores frontend puedan consultar artículos. Estas operaciones pertenecen al servicio externo de Inventario: el frontend las llama directamente en el host propio de ese servicio y el backend de Menu no las implementa. La fuente canónica del contrato es [openapi.yaml](../openapi.yaml), versión 7.0.0; la fuente de requisitos y dominio es la [ERS del servicio Menu](../../../ers/README.md), versión 2.1.19.

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

## Idempotencia de operaciones

Las siguientes operaciones requieren el encabezado `Idempotency-Key` con un UUID generado por el cliente, sin comillas:

| Operación | Respuesta exitosa original y de reintento |
| --- | --- |
| `POST /menu/categories` | `201` con la misma categoría. |
| `POST /menu/entries` | `201` con la misma entrada y asociación de imagen. |
| `POST /menu/entries/{entryId}/offers` | `201` con la misma oferta y composición. |
| `POST /menu/recipes` | `201` con la misma receta. |
| `POST /media/images` | `201` con el mismo `imageId`, URLs y `ETag`. |
| `PATCH /menu/offers/{offerId}` | `200` con el resultado del mismo guardado. |

El cliente genera una clave por operación lógica y conserva esa clave para doble clic, timeout o reintentos del mismo envío. Cada paso independiente utiliza su propia clave: cargar una imagen, crear una receta y guardar una oferta son operaciones distintas. La clave se delimita por el sujeto autenticado, el menú provisionado, el método HTTP y la ruta concreta, incluidos `entryId` u `offerId` cuando correspondan.

Durante las 24 horas posteriores a la confirmación inicial exitosa, reenviar la misma clave y la misma solicitud devuelve el estado HTTP, cuerpo y `ETag` originales. Los reintentos no extienden ese plazo, no crean otro recurso ni repiten una actualización, una asociación de imagen o una selección de revisión de receta. En JSON, la comparación ignora espacios y orden de propiedades de objetos; conserva el orden de los arrays y distingue un campo omitido de `null`. El cliente conserva el cuerpo y el `imageId` originales; no vuelve a cargar una imagen ya confirmada para reintentar la creación o actualización que la referencia.

En `POST /media/images`, la solicitud equivalente conserva exactamente los bytes del campo `file` y su tipo de medio declarado. El boundary de `multipart/form-data`, el orden de las partes y el nombre del archivo no cambian su identidad para idempotencia. Si se pierde la respuesta de la carga, se reenvía el mismo archivo y tipo con la clave de esa carga para recuperar el mismo `data.id`; la asociación posterior continúa siendo una operación independiente. Por ejemplo:

```http
POST /api/v1/media/images
Authorization: Bearer <token>
Idempotency-Key: a04bfdc0-7506-4708-bf49-01b1aa278794
Content-Type: multipart/form-data; boundary=menu-image

--menu-image
Content-Disposition: form-data; name="file"; filename="hamburguesa.jpg"
Content-Type: image/jpeg

<bytes del archivo JPEG>
--menu-image--
```

En `PATCH /menu/offers/{offerId}`, la comparación incluye el JSON y el valor de `If-Match` original. Ambos encabezados son obligatorios y se conservan sin cambios durante los reintentos. Tras autenticar y autorizar, se recupera un éxito de la misma solicitud antes de volver a evaluar `If-Match`, la oferta o sus referencias actuales. Así se devuelve el `200`, cuerpo y `ETag` originales, incluidos los IDs generados de slots y opciones y las asignaciones de receta, aunque el ETag original ya sea obsoleto o la oferta se haya editado o eliminado después. No se resuelve otra revisión de receta. Por ejemplo, este guardado y su reintento utilizan los mismos encabezados y cuerpo:

```http
PATCH /api/v1/menu/offers/b57f7e2a-02a4-4fb7-bb41-55f2d974b101
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: 23f11eec-15a8-4292-bf0d-31200da7cb88
If-Match: "rev-3"

{
  "presentationTag": "Individual",
  "basePrice": 195
}
```

Una ejecución nueva del PATCH valida el ETag vigente: la ausencia de `If-Match` devuelve `428` y, sin un éxito recuperable de la misma solicitud, un ETag obsoleto devuelve `412`. Cambiar `If-Match` bajo una clave ya vinculada a otra solicitud devuelve `409 IDEMPOTENCY_KEY_REUSED`, no `412`. La obligación de enviar `If-Match` también se mantiene en los reintentos.

| Situación | Respuesta | Acción del cliente |
| --- | --- | --- |
| `Idempotency-Key` ausente o UUID inválido | `400`, `error.details.code: INVALID_IDEMPOTENCY_KEY` | Enviar una clave válida. |
| Misma clave vigente con otros datos, tipo de medio o `If-Match` | `409`, `error.details.code: IDEMPOTENCY_KEY_REUSED` | Reenviar la solicitud original; usar otra clave solo para una operación nueva. |
| Misma solicitud en proceso o con resultado todavía incierto | `409`, `error.details.code: IDEMPOTENCY_IN_PROGRESS`, `Retry-After` en segundos | Esperar ese plazo y reenviar la misma solicitud y clave; no iniciar otra operación hasta confirmar el resultado anterior. |
| Misma solicitud ya confirmada | `201` en creaciones o `200` en PATCH, con cuerpo y `ETag` originales | Usar los identificadores del resultado original. |

Cada reintento verifica autenticación y autorización. Un éxito se recupera antes de volver a validar las referencias actuales y se devuelve aunque el recurso se haya editado o eliminado después. La respuesta recuperada describe la operación original; antes de una nueva modificación, consulte mediante `GET` el estado y el `ETag` actuales del recurso.

Un fallo confirmado antes de guardar, incluido `502` al validar con Inventario, no aplica cambios ni conserva un resultado exitoso y permite reintentar con la misma clave y solicitud. Un error de conexión o timeout no demuestra que no se haya guardado: mientras el resultado anterior siga incierto, se mantiene la respuesta en proceso y no se ejecuta otra operación. Tras las 24 horas, una clave expirada se trata como nueva y podría duplicar una creación o repetir una actualización. Antes de reenviar automáticamente una operación incierta con una clave expirada, determine su resultado y reconcilie el estado actual.

Los demás PATCH, DELETE y GET no requieren `Idempotency-Key`. Los PATCH restantes y DELETE conservan su control mediante `If-Match`; ante un resultado incierto, consulte el recurso para recuperar su estado. No obtenga un ETag nuevo para reenviar automáticamente un guardado anterior incierto, especialmente si puede crear una revisión de receta.

## Selección de recetas

Una opción `RECIPE` se configura únicamente con `recipeId`, además de los campos propios de la opción. Al asignarla, el servidor selecciona y fija atómicamente la revisión publicada válida más reciente. Una receta inexistente o sin revisión válida devuelve `422` sin cambios parciales. La revisión propia de la receta y su historial se conservan; `recipeRevision` no se envía ni se expone en las opciones de ofertas.

En un `PATCH` de una opción existente que conserva `sourceType: RECIPE`, omitir `recipeId` conserva la asignación vigente. Enviar `recipeId`, incluso si es el mismo, selecciona de nuevo la revisión válida más reciente. Editar la receta en la biblioteca no cambia retroactivamente las asignaciones previas ni las revisiones históricas.

## Actualización de ofertas

`PATCH /menu/offers/{offerId}` conserva recursivamente los campos omitidos, excepto `presentationTag`, que debe enviarse siempre; para conservarlo, reenvíe su valor vigente. Cada colección enviada reemplaza completamente la vigente: los elementos no incluidos se eliminan. Los slots y opciones existentes se identifican por su ID y permiten actualizar solo algunos campos; los nuevos omiten el ID, que asigna el servidor, y requieren los campos definidos en sus esquemas. Las colecciones de slots y opciones deben contener al menos un elemento; las listas vacías y los IDs ajenos, desconocidos o duplicados se rechazan con `422`.

En una opción existente, reenviar el mismo `sourceType` conserva los campos omitidos del origen. Cambiarlo requiere la tupla completa del nuevo tipo; el servidor lo compara con el tipo almacenado y rechaza con `422` una tupla incompleta sin aplicar cambios.

La actualización valida todas las invariantes y se aplica de forma atómica. Requiere `Idempotency-Key` e `If-Match`. Una ejecución nueva exige el ETag fuerte vigente: su ausencia devuelve `428` y una versión desactualizada devuelve `412`. Un reintento exacto con éxito recuperable devuelve la respuesta original antes de volver a evaluar ese ETag, conforme a las reglas de idempotencia anteriores.

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
