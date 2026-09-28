# Flujos comerciales representados

Este documento complementa las descripciones de operaciones y esquemas del [contrato OpenAPI](../openapi.yaml). Los URI, códigos y formas de intercambio aquí descritos forman parte del contrato aceptado.

## Publicar una oferta

1. Crear una categoría y una entrada mediante `POST /menus/{menuId}/categories` y `POST /menus/{menuId}/entries`. La entrada nace `INACTIVE` y sus categorías son del mismo menú.
2. Crear una oferta con `POST /menus/{menuId}/entries/{entryId}/offers`. La solicitud declara `basePrice`, imagen y una `Composition` completa; la oferta nace `INACTIVE`.
3. Completar la composición con al menos un slot y una opción por slot. Con `selectable: false` se incluyen todos los slots. Con `selectable: true`, `requiredSlots` se incluyen siempre y los límites `minSelections`/`maxSelections` cuentan solo los restantes. Una opción incluida concreta el contenido del slot.
4. Solicitar `ACTIVE` para la oferta mediante `PATCH /menus/{menuId}/entries/{entryId}/offers/{offerId}`. La composición debe ser válida. OPEN-008 mantiene pendiente si cada slot necesita una opción activa o basta con una opción estructuralmente definida.
5. Solicitar `ACTIVE` para la entrada mediante `PATCH /menus/{menuId}/entries/{entryId}`. Debe tener al menos una oferta válida. Las consultas `/catalog` exponen solo entradas y ofertas publicables.

Archivar una entrada es reversible. Desde `ARCHIVED`, la transición permitida es a `INACTIVE`; activar requiere una solicitud posterior.

## Eliminar una entrada archivada

1. `DELETE /menus/{menuId}/entries/{entryId}` exige que la entrada esté `ARCHIVED`. La operación localiza las referencias vigentes a cualquiera de sus ofertas, incluidas las opciones ya inactivas, tanto en `CatalogOfferSource` como en `AddOption` con destino `CATALOG_OFFER`.
2. En un solo lote, desactiva cada `ComponentOption` que contiene alguna referencia afectada. Sustituye cada referencia por contenido local `INLINE` con una copia de la composición completa de la revisión de oferta fijada por esa referencia. La copia conserva slots, alternativas y personalizaciones. Si contiene referencias a otras ofertas de la entrada que se elimina, también las materializa recursivamente, sin ciclos. Una `AddOption` convertida conserva sus demás atributos, incluido `priceDelta`.
3. Cada oferta que contiene opciones afectadas obtiene una nueva revisión vigente. Después de convertir todas las referencias, se eliminan la entrada y sus ofertas vigentes. La operación responde `200` con las ofertas eliminadas, las ofertas revisadas y las opciones desactivadas. Si alguna conversión falla o no se preservan las invariantes, no se aplica ningún cambio.

Las revisiones históricas publicadas permanecen inmutables. `GET /catalog-offers/{offerId}/revisions/{offerRevision}` permite consultar las fotografías históricas necesarias incluso después de eliminar la entrada y sus ofertas vigentes. La desactivación de una `ComponentOption` no desactiva automáticamente la oferta que la contiene.

## Orígenes y personalizaciones

Cada `ComponentOption` tiene identidad contextual, estado propio y exactamente un `source`: `INLINE`, `INVENTORY_ITEM`, `PREPARATION` o `CATALOG_OFFER`. Una opción `INACTIVE` no se ofrece como nueva elección. `INLINE` contiene una receta local o una copia local de la composición completa de una oferta. `PREPARATION` referencia una revisión de receta reutilizable; sus `adjustments` son locales a esa aparición. `CATALOG_OFFER` fija la revisión de la oferta hija. Las referencias entre ofertas y recetas no pueden formar ciclos.

`Personalizations` pertenece a esa aparición concreta. Los modificadores y reemplazos señalan líneas directas de InventoryItem de su receta efectiva; no alcanzan subrecetas ni ofertas hijas. Las adiciones pueden apuntar a un artículo de Inventario, una receta reutilizable, una oferta o una composición local `INLINE` conservada tras convertir una referencia. Las instrucciones son descriptivas y no alteran cantidades físicas. La validez estructural de la receta no depende del stock externo.

`basePrice` es el importe fijo de la oferta completa. Los `priceDelta` permanecen junto a las personalizaciones que los declaran y pueden ser negativos, cero o positivos; no cambian `basePrice`. El contrato no calcula precio final de una orden ni añade automáticamente el precio base de una oferta hija.

## Cambios y revisiones

`POST /menus/{menuId}/entries/{entryId}/offers/{offerId}/revisions` crea una nueva definición comercial completa; `PUT .../composition` crea otra revisión cuando cambia el contenido de la composición y conserva la revisión si se reenvía la misma representación. `GET /catalog-offers/{offerId}/revisions/{offerRevision}` recupera una fotografía histórica, también cuando su oferta vigente pertenecía a una entrada eliminada. El estado administrativo actual de una oferta se consulta en su recurso vigente, separado de la fotografía comercial de una revisión.

`POST /recipe-libraries/{libraryId}/recipes/{recipeId}/revisions` crea una revisión de receta. `GET /recipe-libraries/{libraryId}/recipes/{recipeId}?revision=...` permite recuperar una revisión concreta. Las composiciones que conservan una revisión anterior siguen apuntando a ella hasta que una acción administrativa actualice expresamente su referencia y cree una nueva revisión de oferta. Las referencias históricas no se reescriben retroactivamente.

## Alcance del rendimiento

NFR-MENU-PERF-01..03 definen evaluación E2E con POS y aceptación de orden, perfil nominal y ráfaga. No fijan latencias para cada operación de Menu. OPEN-009 conserva pendiente la mezcla de solicitudes y el dataset representativo de la evaluación.
