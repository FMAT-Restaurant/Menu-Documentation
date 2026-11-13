# Contrato OpenAPI del servicio Menu

Esta carpeta contiene la especificación modular de las operaciones de Menu y las referencias `GET /items` y `GET /items/{id}` del servicio externo de Inventario. Estas dos operaciones pertenecen a Inventario: el frontend las llama directamente en el host propio de ese servicio y el backend de Menu no las implementa, aunque Menu consulta Inventario de forma síncrona para validar los artículos que se referencian. La fuente canónica del contrato es [openapi.yaml](../openapi.yaml), versión 8.0.1; la fuente de requisitos y dominio es la [ERS del servicio Menu](../../../ers/README.md), versión 3.3.0, con la que el contrato está alineado. Los eventos asíncronos con Inventario se definen en [asyncapi.yaml](../asyncapi.yaml) y se resumen en [events.md](events.md).

## Índice

- [Especificación principal](../openapi.yaml): servidor, seguridad, rutas y registro de componentes.
- [Contrato de eventos](../asyncapi.yaml): AsyncAPI 3.1.0, versión 1.0.0, con los eventos que Menu publica y consume.
- [Resumen de eventos](events.md): cuándo se emite cada evento y sus payloads.
- [Vista renderizada de eventos](https://fmat-restaurant.github.io/Menu-Documentation/events/): el contrato AsyncAPI presentado en el sitio de documentación.
- [Bundle compilado](../dist/openapi.yaml): documento autocontenido para herramientas que no resuelven referencias a archivos externos.
- [Rutas](../paths/): operaciones agrupadas por catálogo, categorías, entradas, ofertas, recetas, inventario e imágenes.
- [Esquemas](../components/schemas/): modelos, solicitudes y respuestas JSON.
- [Parámetros](../components/parameters.yaml): paginación, búsqueda, filtros, ETags e Idempotency-Key.
- [Respuestas HTTP](../components/responses.yaml): errores reutilizables, respuesta condicional 304, respuestas 428, 409 de dominio, 406 y la carta en PDF.
- [Headers](../components/headers.yaml): ETag, Content-Disposition y Cache-Control.

Para regenerar el bundle desde la raíz del repositorio:

    pnpm api:bundle

El comando escribe el bundle en `docs/apis/menu/dist/openapi.yaml`.

## Convenciones

API_BASE_URL identifica el host de las rutas de Menu y termina en `/api/v1`. Todas las rutas de Menu están bajo el prefijo `/menu`, incluidas las imágenes en `/menu/media/images`; en este documento las rutas se escriben relativas a esa URL base, salvo en los ejemplos HTTP completos.

`GET /items` y `GET /items/{id}` se incluyen como referencias para consulta de los trabajadores frontend, pero pertenecen al servicio externo de Inventario y el frontend las llama directamente en el host propio de Inventario. Ese host se configura para cada despliegue; no forma parte de API_BASE_URL. Las rutas de Inventario son relativas al host de Inventario; su URL base y su prefijo de ruta reales no están definidos y pueden cambiar. Menu no implementa esas rutas y solo conserva referencias a artículos.

Las respuestas JSON exitosas usan el campo `data`; las listas agregan `meta`. Como excepción, la búsqueda `GET /items` del servicio externo de Inventario devuelve una lista plana sin `data` ni `meta`.

Las solicitudes requieren una credencial Bearer. Toda modificación, cambio de estado, eliminación o reemplazo del archivo de una imagen (`PATCH`, `DELETE` y `PUT`) exige `If-Match` con el ETag fuerte vigente: su ausencia devuelve `428` y un valor obsoleto devuelve `412`, sin cambios. Las consultas aceptan `If-None-Match` y responden `304` si el recurso no cambió. Los ETag de los ejemplos tienen la forma `"v3"`.

## Permisos

La credencial Bearer es un JWT emitido por un servicio externo con la lista `permissions`; cada permiso tiene el formato `modulo:recurso:accion`. Cada operación declara en `x-required-permission` los permisos que exige y, sin ellos, se responde `403` sin cambios. Un PATCH que mezcla cambios de estado con otros cambios exige los dos permisos.

| Permiso | Etiqueta UI | Descripción | Protege (operación → elemento UI) |
|---|---|---|---|
| `menu:catalog:read` | Ver catálogo | Consultar el catálogo visible y buscar | `GET /menu/catalog` y `GET /menu/catalog/categories` → vista del catálogo en el punto de venta |
| `menu:catalog:print` | Imprimir carta | Generar la carta en PDF | `GET /menu/catalog/printable` → botón «Imprimir carta» |
| `menu:categories:read` | Ver categorías | Consultar categorías (administración) | `GET /menu/categories[/{id}]` → lista de categorías |
| `menu:categories:write` | Gestionar categorías | Crear, editar y eliminar categorías | `POST`, `PATCH` y `DELETE /menu/categories…` → botones «Nueva», «Editar» y «Eliminar categoría» |
| `menu:entries:read` | Ver entradas | Consultar entradas en cualquier estado | `GET /menu/entries[/{id}]` → lista de entradas |
| `menu:entries:write` | Gestionar entradas | Crear, editar datos y eliminar entradas | `POST /menu/entries`, `PATCH` (sin `status`), `DELETE` → «Nueva», «Editar» y «Eliminar entrada» |
| `menu:entries:status` | Cambiar estado de entradas | Activar, inactivar, archivar y desarchivar | `PATCH /menu/entries/{id}` con `status` → interruptor de estado y «Archivar» |
| `menu:offers:read` | Ver ofertas | Consultar ofertas y composición (administración) | `GET /menu/offers[/{id}]` → lista y detalle de ofertas |
| `menu:offers:write` | Gestionar ofertas | Crear y editar ofertas y su composición (incluida la copia armada en el front) y eliminarlas | `POST /menu/entries/{id}/offers`, `PATCH /menu/offers/{id}` (sin cambios de estado), `DELETE` → «Nueva oferta», «Editar», «Copiar composición», «Eliminar» |
| `menu:offers:status` | Cambiar estado de ofertas | Activar e inactivar ofertas y opciones | `PATCH /menu/offers/{id}` con `status` de la oferta o de las opciones → interruptores de estado |
| `menu:recipes:read` | Ver recetas | Consultar recetas y su historial | `GET /menu/recipes[/{id}]`, `GET …/revisions[/{rev}]` → biblioteca e historial |
| `menu:recipes:write` | Gestionar recetas | Crear, editar y eliminar recetas | `POST`, `PATCH` y `DELETE /menu/recipes…` → «Nueva», «Editar» y «Eliminar receta» |
| `menu:images:write` | Gestionar imágenes | Cargar imágenes y reemplazar su archivo | `POST /menu/media/images`, `PUT /menu/media/images/{id}` (y `GET /menu/media/images/{id}` para obtener el ETag) → selector y «Cambiar imagen» |

Reglas condicionales de los dos PATCH que declaran dos permisos:

- `PATCH /menu/entries/{entryId}`: un cuerpo sin `status` exige `menu:entries:write`; un cuerpo con solo `status` exige `menu:entries:status`; un cuerpo que mezcla `status` con otros campos exige ambos permisos.
- `PATCH /menu/offers/{offerId}`: cuenta como cambio de estado el `status` de la oferta o el `status` de una opción existente (con `optionId`); el `status` de una opción nueva forma parte de su alta. Un cuerpo sin cambios de estado exige `menu:offers:write`; un cuerpo con solo cambios de estado exige `menu:offers:status`; un cuerpo que los mezcla con otros cambios exige ambos permisos.

Las rutas de Inventario se autorizan según el contrato de Inventario (`x-required-permission: []`). Menu no autentica a quien solicita ni asigna permisos (RF-GEN-01).

## Estados y disponibilidad

`status` es el estado administrativo y solo lo cambia el administrador: `ACTIVE`, `INACTIVE` o `ARCHIVED` en entradas, y `ACTIVE` o `INACTIVE` en ofertas y opciones; los grupos de selección no tienen estado. `isAvailable` es la disponibilidad derivada, de solo lectura, que el servidor recalcula en entradas, ofertas, grupos de selección y opciones a partir de los eventos de disponibilidad de orígenes de Inventario (`inventory.source.availability.updated`) y de la composición:

- una opción está disponible según el último estado comunicado por Inventario sobre su origen de contenido: la receta que usa o, en una opción `INVENTORY_ITEM`, la propia opción;
- un grupo de selección está disponible si y solo si al menos una de sus opciones `ACTIVE` está disponible;
- una oferta está disponible si y solo si todos sus grupos de selección están disponibles;
- una entrada está disponible si y solo si al menos una de sus ofertas `ACTIVE` está disponible.

Una oferta es ordenable si ella y su entrada están `ACTIVE` y ambas tienen `isAvailable: true`. Ningún cambio de disponibilidad modifica `status`, y ningún proceso reactiva una oferta inactivada (RF-GEN-04, RF-DISP-01..06).

Las entradas y las ofertas nuevas inician `INACTIVE`. Las transiciones de `status` de una entrada son `ACTIVE` ↔ `INACTIVE`, `ACTIVE` o `INACTIVE` → `ARCHIVED`, y `ARCHIVED` → `INACTIVE` (desarchivar). Una entrada `ARCHIVED` es de solo lectura: `PATCH /menu/entries/{entryId}` solo acepta el cuerpo exacto `{"status": "INACTIVE"}` y cualquier otro cuerpo devuelve `409 ENTRY_ARCHIVED` sin cambios; sus ofertas tampoco admiten creación, modificación ni eliminación. Cambiar el estado de la entrada no cambia el de sus ofertas (RF-ENT-03..06).

## Imágenes

Para asociar una imagen, primero se carga el archivo mediante `POST /menu/media/images`, con `multipart/form-data` y el campo `file`. El servicio valida JPEG, PNG o WebP, hasta 10 MiB (10485760 bytes) y 4096 px de ancho y alto cada uno, incluido el contenido real y su decodificación. Tras validar la carga, el servidor genera el identificador y lo devuelve como `data.id`. Una imagen inválida devuelve `422` sin crear una imagen utilizable ni modificar ningún recurso ni imagen existentes.

La creación de entradas y ofertas recibe JSON y requiere ese identificador como `imageId`. `imageId` es inmutable: queda ligado al recurso y los PATCH no lo aceptan. No se reenvía el archivo ni una URL. Una imagen pertenece a un solo recurso: asociar una imagen ya asociada devuelve `409 IMAGE_ALREADY_ASSOCIATED`, y una referencia inexistente, inválida o inaccesible devuelve `422`, en ambos casos sin crear el recurso. La carga previa es una operación independiente y no se deshace si falla la asociación.

Para cambiar la imagen se reemplaza su archivo conservando el identificador: el cliente obtiene el ETag vigente con `GET /menu/media/images/{imageId}` y envía el archivo nuevo con `PUT /menu/media/images/{imageId}` (`multipart/form-data`, campo `file`, mismas validaciones que la carga) e `If-Match`. Un reemplazo aceptado devuelve `200` con el mismo `data.id`, las URLs del archivo nuevo y un ETag nuevo; el archivo anterior se elimina. Un archivo inválido devuelve `422` y conserva el archivo vigente. Si la imagen pertenece a una entrada archivada o a una oferta de una entrada archivada, devuelve `409 IMAGE_OWNER_ARCHIVED` sin cambios. El `PUT` no requiere `Idempotency-Key`: `If-Match` impide aplicar dos veces el mismo reemplazo (RF-IMG-01..05).

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

`categoryIds` es opcional; sin categorías, la entrada pertenece a la agrupación «sin categoría». El servidor asigna `INACTIVE` a la entrada creada.

## Entradas, ofertas y composición

Las entradas y las ofertas se crean `INACTIVE` y se activan después con PATCH. En `POST /menu/entries/{entryId}/offers`, cada opción nueva admite `status` opcional y, si se omite, inicia `ACTIVE`. Una entrada archivada devuelve `409 ENTRY_ARCHIVED`. `presentationTag` es obligatorio al crear la oferta, opcional en su PATCH y siempre presente en sus representaciones de respuesta. Las ofertas de una misma entrada se ordenan alfabéticamente por etiqueta de presentación (RF-ENT-*, RF-OFE-*).

La oferta es la raíz del agregado: `PATCH /menu/offers/{offerId}` actualiza la oferta y su composición en una sola operación atómica y su ETag protege también la composición. Todos los campos son opcionales; los omitidos se conservan. Enviar `composition.slots` reemplaza la lista completa de grupos: los grupos vigentes que no aparecen se eliminan con sus opciones. Enviar `options` en un grupo reemplaza la lista completa de opciones de ese grupo: las opciones vigentes que no aparecen se eliminan. Omitir `slots` u `options` conserva la lista vigente; dentro de un grupo u opción existente, identificado por `slotId` u `optionId`, los campos omitidos se conservan. Los grupos y opciones nuevos se envían sin identificador y el servidor lo genera.

Se rechazan con `422` las listas vacías, los identificadores desconocidos, ajenos o duplicados, un `sourceType` distinto del almacenado en una opción existente (`SOURCE_TYPE_IMMUTABLE`) y el contenido repetido en un grupo, es decir, el mismo artículo de Inventario o la misma receta en dos opciones (`DUPLICATE_OPTION_CONTENT`). El tipo de contenido de una opción no cambia: para usar el otro tipo se crea una opción nueva.

El orden de los arrays es el orden de presentación de los grupos de selección y de sus opciones, y también el orden de sucesión de las rondas. `quantity` de un grupo de selección es su número de rondas: en cada ronda se elige una opción. `quantity` de una opción `INVENTORY_ITEM` es la cantidad en la unidad que Inventario establece para el artículo, sin unidad propia, y es distinta del número de rondas del grupo.

Activar la oferta (`status: ACTIVE`) exige una composición válida, que toda oferta mantiene, y no exige disponibilidad. Cualquier PATCH sobre una oferta de una entrada archivada devuelve `409 ENTRY_ARCHIVED` (RF-COMP-*, RF-OPC-*).

`DELETE /menu/entries/{entryId}` elimina definitivamente una entrada `ARCHIVED`; cualquier otro estado devuelve `409 ENTRY_NOT_ARCHIVED` sin cambios. La eliminación es en cascada: elimina todas sus ofertas, también las activas, con su composición, grupos de selección y opciones, y elimina la imagen de la entrada y las de sus ofertas. `DELETE /menu/offers/{offerId}` elimina una oferta `INACTIVE` con su composición y su imagen; una oferta `ACTIVE` devuelve `409 OFFER_NOT_INACTIVE` y una oferta de una entrada archivada `409 ENTRY_ARCHIVED`, sin cambios. Haber servido como origen de una copia no impide eliminarla, y su eliminación recalcula la disponibilidad de la entrada sin cambiar su estado administrativo.

Toda eliminación exige `If-Match`: su ausencia devuelve `428` y un valor obsoleto devuelve `412`, sin cambios. Una eliminación exitosa devuelve `204` sin cuerpo ni encabezado `ETag`, porque no queda una representación vigente del recurso eliminado.

### Copia de composición

No existe un endpoint de copia: la oferta es la raíz del agregado y un solo ETag cubre la oferta y su composición. Para copiar, el front 1) consulta la oferta origen con `GET /menu/offers/{offerId}` (para elegirla, `GET /menu/offers?excludeOfferId={destino}&excludeArchivedEntries=true`); 2) arma sus grupos y opciones sin `slotId` ni `optionId`, conservando el `status` de cada opción; 3) los envía en el `POST /menu/entries/{entryId}/offers` de la oferta nueva o los agrega, junto con los grupos vigentes que conserva (con su `slotId`), en el `PATCH /menu/offers/{offerId}` de la oferta destino. No se copian el precio base, la etiqueta de presentación ni la imagen, y no se guarda ninguna referencia al origen (RF-COMP-12).

Por ejemplo, este cuerpo de `PATCH /menu/offers/{offerId}` conserva el grupo vigente y agrega la composición copiada de otra oferta:

```json
{
  "composition": {
    "slots": [
      {
        "slotId": "b37c1bd7-17b2-47a2-a3a4-802559445301"
      },
      {
        "name": "Bebida",
        "quantity": 1,
        "course": "bebida",
        "options": [
          {
            "sourceType": "INVENTORY_ITEM",
            "inventoryItemId": "REFRESCO-355ML",
            "quantity": 1,
            "displayName": "Refresco",
            "status": "ACTIVE"
          },
          {
            "sourceType": "INVENTORY_ITEM",
            "inventoryItemId": "AGUA-500ML",
            "quantity": 1,
            "displayName": "Agua",
            "status": "INACTIVE"
          }
        ]
      }
    ]
  }
}
```

## Recetas

Una opción `RECIPE` se configura únicamente con `recipeId`, además de los campos propios de la opción, y usa siempre la revisión vigente de la receta. Una receta inexistente devuelve `422` sin cambios. En un PATCH de una opción `RECIPE` existente, omitir `recipeId` conserva la receta asignada (RF-OPC-09).

Cada receta expone `revision`, de solo lectura: la creación produce la revisión 1 y cada edición con cambios la incrementa en 1. `ingredients` contiene una o más líneas de ingrediente, cada una con un artículo de Inventario y una cantidad positiva expresada en la unidad que Inventario establece para el artículo, sin unidad propia; las líneas se conservan en el orden indicado y un artículo repetido devuelve `422 DUPLICATE_INVENTORY_ITEM`.

`PATCH /menu/recipes/{recipeId}` crea una revisión nueva con el número siguiente, que pasa a ser la vigente; todas las opciones que referencian la receta usan esa revisión de inmediato. Una edición sin cambios no crea revisión y devuelve la vigente. `ingredients` reemplaza la lista completa y exige al menos una línea.

`DELETE /menu/recipes/{recipeId}` elimina la definición vigente solo si ninguna opción de ninguna oferta la referencia, en cualquier estado administrativo; si alguna la referencia devuelve `409 RECIPE_IN_USE` con `details.offerIds`, sin cambios. El historial de revisiones se conserva: `GET /menu/recipes/{recipeId}/revisions` devuelve las revisiones paginadas en orden ascendente de número y `GET /menu/recipes/{recipeId}/revisions/{revision}` devuelve una revisión, también después de eliminar la definición vigente.

Los datos de `inventoryItem` incluidos en las líneas de ingrediente se leen de Inventario al responder y Menu no los guarda; si Inventario no responde, la consulta devuelve `502` (RF-REC-01..07).

## Inventario

`InventoryItem.id` e `inventoryItemId` son strings opacos sin requisito de formato UUID, por ejemplo `CARNE-150G`.

`GET /items` busca artículos mediante `q` y devuelve una lista JSON plana, sin paginación; cada artículo documenta `id`, `name` y `unit`, y los demás campos se rigen según el contrato de Inventario.

`GET /items/{id}` consulta el detalle mediante un `id` de tipo string genérico y devuelve `data` con `id`, `name` y `unit`. Lo no documentado aquí se rige según el contrato de Inventario.

Menu valida de forma síncrona con Inventario los artículos de las opciones `INVENTORY_ITEM` y de las recetas al crearlas o modificarlas: un artículo inexistente devuelve `422` y, si Inventario no responde, Menu devuelve `502` sin crear o modificar el recurso ni aplicar cambios parciales (RF-INTG-01, RF-INTG-02).

## Catálogo y carta imprimible

`GET /menu/catalog` (`menu:catalog:read`) devuelve una página de las entradas `ACTIVE` visibles para quien consulta, con `data` y `meta` y los parámetros `page` y `pageSize`, en orden alfabético por nombre comercial y sin secciones. Cada entrada incluye sus `categoryIds`, que pueden estar vacíos (agrupación «sin categoría»), y sus ofertas `ACTIVE` en orden alfabético por etiqueta de presentación; cada oferta incluye su composición con los grupos de selección en el orden de presentación, su tiempo de servicio y solo las opciones `ACTIVE`. Las entradas, ofertas, grupos y opciones incluyen `isAvailable`: lo no disponible se presenta deshabilitado y no se puede ordenar ni elegir; una entrada `ACTIVE` sin ofertas `ACTIVE` aparece con `offers` vacío e `isAvailable: false`. Lo `INACTIVE` o `ARCHIVED` no se incluye.

`q` limita las entradas a las que coinciden en nombre comercial, descripción o nombres de categoría. `categoryId` limita la página a las entradas de esa categoría; con `__uncategorized__`, a las entradas sin categorías; un `categoryId` inexistente devuelve una página vacía. La respuesta incluye `ETag` y admite `If-None-Match`.

`GET /menu/catalog/categories` (`menu:catalog:read`) devuelve, sin paginar, todas las categorías del menú en orden alfabético, también las que no clasifican entradas. En el catálogo, `entryCount` de cada categoría es el número de entradas `ACTIVE` que clasifica, las que ve quien consulta, y `uncategorized.entryCount` es el número de entradas `ACTIVE` sin categorías. En administración, `entryCount` de `GET /menu/categories[/{categoryId}]` cuenta todas las entradas que clasifica la categoría, en cualquier estado (`ACTIVE`, `INACTIVE` o `ARCHIVED`). La respuesta incluye `ETag` y admite `If-None-Match` (RF-CONS-01, RF-CONS-03).

`GET /menu/catalog/printable` (`menu:catalog:print`) genera bajo demanda la carta imprimible en PDF con el estado del catálogo en el momento de la solicitud; Menu no la guarda y cada solicitud genera una carta nueva, sin modificar ningún recurso. La respuesta es `application/pdf` con `Content-Disposition` y `Cache-Control: no-store`, sin `ETag`; si `Accept` no admite `application/pdf` devuelve `406`.

La carta incluye solo las entradas `ACTIVE` con al menos una oferta `ACTIVE` y, de cada una, solo sus ofertas `ACTIVE`; la disponibilidad no interviene ni se muestra. Cada entrada muestra su nombre comercial, descripción e imagen; cada oferta, bajo su entrada, su etiqueta de presentación, que forma su nombre visible, su precio base y su imagen; no se muestra la composición. El encabezado muestra el nombre del menú, la fecha de generación y la moneda, cuyo origen queda pendiente en OPEN-001. La carta tiene una sección por categoría en orden alfabético; se omiten las secciones sin entradas incluidas; las entradas sin categorías figuran en la sección «sin categoría», después de las demás; dentro de cada sección, las entradas van en orden alfabético por nombre comercial y una entrada con varias categorías figura en cada una; las ofertas van en orden alfabético por etiqueta de presentación (RF-CONS-01, RF-CONS-03, RF-CONS-06..08).

## Idempotencia de operaciones

Las siguientes operaciones requieren el encabezado `Idempotency-Key` con un UUID generado por el cliente, sin comillas:

| Operación | Respuesta exitosa original y de reintento |
| --- | --- |
| `POST /menu/categories` | `201` con la misma categoría. |
| `POST /menu/entries` | `201` con la misma entrada y asociación de imagen. |
| `POST /menu/entries/{entryId}/offers` | `201` con la misma oferta y composición. |
| `POST /menu/recipes` | `201` con la misma receta. |
| `POST /menu/media/images` | `201` con el mismo `imageId`, URLs y `ETag`. |
| `PATCH /menu/offers/{offerId}` | `200` con el resultado del mismo guardado. |

La copia de composición viaja en el POST o PATCH de la oferta y usa su clave. `PUT /menu/media/images/{imageId}` no requiere `Idempotency-Key`.

El cliente genera una clave por operación lógica y conserva esa clave para doble clic, timeout o reintentos del mismo envío. Cada paso independiente utiliza su propia clave: cargar una imagen, crear una receta y guardar una oferta son operaciones distintas. La clave se delimita por el sujeto autenticado, el menú provisionado, el método HTTP y la ruta concreta, incluidos `entryId` u `offerId` cuando correspondan.

Durante las 24 horas posteriores a la confirmación inicial exitosa, reenviar la misma clave y la misma solicitud devuelve el estado HTTP, cuerpo y `ETag` originales. Los reintentos no extienden ese plazo, no crean otro recurso ni repiten una actualización o una asociación de imagen. En JSON, la comparación ignora espacios y orden de propiedades de objetos; conserva el orden de los arrays y distingue un campo omitido de `null`. El cliente conserva el cuerpo y el `imageId` originales; no vuelve a cargar una imagen ya confirmada para reintentar la creación que la referencia.

En `POST /menu/media/images`, la solicitud equivalente conserva exactamente los bytes del campo `file` y su tipo de medio declarado. El boundary de `multipart/form-data`, el orden de las partes y el nombre del archivo no cambian su identidad para idempotencia. Si se pierde la respuesta de la carga, se reenvía el mismo archivo y tipo con la clave de esa carga para recuperar el mismo `data.id`; la asociación posterior continúa siendo una operación independiente. Por ejemplo:

```http
POST /api/v1/menu/media/images
Authorization: Bearer <token>
Idempotency-Key: a04bfdc0-7506-4708-bf49-01b1aa278794
Content-Type: multipart/form-data; boundary=menu-image

--menu-image
Content-Disposition: form-data; name="file"; filename="hamburguesa.jpg"
Content-Type: image/jpeg

<bytes del archivo JPEG>
--menu-image--
```

En `PATCH /menu/offers/{offerId}`, la comparación incluye el JSON y el valor de `If-Match` original. Ambos encabezados son obligatorios y se conservan sin cambios durante los reintentos. Tras autenticar y autorizar, se recupera un éxito de la misma solicitud antes de volver a evaluar `If-Match`, la oferta o sus referencias actuales. Así se devuelve el `200`, cuerpo y `ETag` originales, incluidos los identificadores generados de grupos de selección y opciones, aunque el ETag original ya sea obsoleto o la oferta se haya editado o eliminado después. Por ejemplo, este guardado y su reintento utilizan los mismos encabezados y cuerpo:

```http
PATCH /api/v1/menu/offers/b57f7e2a-02a4-4fb7-bb41-55f2d974b101
Authorization: Bearer <token>
Content-Type: application/json
Idempotency-Key: 23f11eec-15a8-4292-bf0d-31200da7cb88
If-Match: "v3"

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

Los demás PATCH, DELETE, PUT y GET no requieren `Idempotency-Key`. Los PATCH restantes, los DELETE y el PUT de imágenes conservan su control mediante `If-Match`; ante un resultado incierto, consulte el recurso para recuperar su estado. No obtenga un ETag nuevo para reenviar automáticamente un guardado anterior incierto.

## Errores de dominio

Los rechazos por reglas de dominio incluyen `error.code` en `409` y `error.details.violations[].code` en `422`, con los valores de `DomainErrorCode`. Ninguno aplica cambios.

| Código | HTTP | Cuándo |
| --- | --- | --- |
| `CATEGORY_NAME_TAKEN` | `409` | `POST` o `PATCH` de una categoría con un nombre ya usado, comparado sin mayúsculas, acentos ni espacios extremos. |
| `ENTRY_ARCHIVED` | `409` | Operación no admitida sobre una entrada archivada o sobre sus ofertas: PATCH de la entrada distinto de exactamente `{"status": "INACTIVE"}`, o `POST`, `PATCH` o `DELETE` de sus ofertas. |
| `ENTRY_NOT_ARCHIVED` | `409` | `DELETE` de una entrada no archivada. |
| `OFFER_NOT_INACTIVE` | `409` | `DELETE` de una oferta `ACTIVE`. |
| `IMAGE_ALREADY_ASSOCIATED` | `409` | `POST` de una entrada u oferta con una imagen ya asociada. |
| `IMAGE_OWNER_ARCHIVED` | `409` | `PUT` del archivo de la imagen de una entrada archivada o de una oferta de una entrada archivada. |
| `RECIPE_IN_USE` | `409` | `DELETE` de una receta referenciada por alguna opción, con `details.offerIds`. |
| `SOURCE_TYPE_IMMUTABLE` | `422` | `sourceType` de una opción existente distinto del almacenado. |
| `DUPLICATE_OPTION_CONTENT` | `422` | Dos opciones con el mismo artículo de Inventario o la misma receta en un grupo de selección. |
| `DUPLICATE_INVENTORY_ITEM` | `422` | Artículo de Inventario repetido en las líneas de ingrediente de una receta. |

Los códigos de idempotencia (`INVALID_IDEMPOTENCY_KEY`, `IDEMPOTENCY_KEY_REUSED` e `IDEMPOTENCY_IN_PROGRESS`) se mantienen en `error.details.code`.

## Límites de la fuente

- `pageSize` es un entero positivo y su valor predeterminado es `12`; no se limita a una lista cerrada de tamaños.
- Las longitudes máximas de los textos, la idempotencia y la paginación pertenecen a este contrato. Los eventos con Inventario se definen en [asyncapi.yaml](../asyncapi.yaml) y se resumen en [events.md](events.md); sus garantías de entrega quedan pendientes en [OPEN-011](../../../ers/open.md#open-011--garantías-de-entrega-de-los-eventos-con-inventario).
