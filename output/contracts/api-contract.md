# Contrato de API del servicio Menu/Catálogo

**Estado:** contrato aceptado para la interfaz HTTP, basado en la ERS 2.1.0.

**Fuente conceptual:** [Modelo de dominio del catálogo](../../docs/md/domain-model.md).

**Autoridad de requisitos:** [Configuración de la ERS](../ers/configuration.md).

La ERS 2.1.0 define las capacidades y reglas del dominio. Este contrato define la interfaz HTTP para exponerlas, incluidas sus rutas, métodos, representaciones y códigos de respuesta. La semántica de negocio procede de la ERS y del modelo conceptual.

## Alcance y límites

Este contrato ofrece consulta del catálogo publicable y administración de datos que pertenecen a Menu: categorías, entradas, ofertas, composiciones, recetas y personalizaciones.

| Contexto | Responsabilidad reflejada en el contrato |
| :--- | :--- |
| Menu/Catálogo | Mantiene la identidad comercial, las ofertas, composiciones, recetas, personalizaciones y los importes declarados. |
| Inventario | Es propietario de la identidad y las existencias de InventoryItem. El catálogo transmite referencias de identidad y datos de cantidad/unidad que le corresponden. |
| Órdenes | Registra cantidades y elecciones de una orden y determina el precio final con las definiciones del catálogo. |

El contrato entrega definiciones de ofertas, reglas de composición, alternativas, recetas referenciadas y personalizaciones declaradas.

## Convenciones del contrato

- Raíz del API: /api/v1.
- Representaciones: JSON.
- Los URI usan menuId para delimitar categorías, entradas y ofertas pertenecientes a un menú. “Administración” y “consulta de catálogo” identifican el propósito del consumidor; autenticación, autorización e identidad aún no están definidas y permanecen abiertas. Esta ausencia no determina que la API sea anónima o pública.
- Las consultas administrativas pueden leer definiciones inactivas. La consulta del catálogo publicable presenta entradas y ofertas activas que satisfacen las condiciones de publicación.
- La respuesta conserva la diferencia entre CatalogEntry y CatalogOffer: el nombre comercial corresponde a la entrada y la etiqueta opcional de presentación a la oferta.
- Las referencias a imágenes se representan con los atributos de referencia del modelo. El formato, carga y restricciones de archivos quedan pendientes.

## Operaciones del contrato

| Uso | Método | URI | Comportamiento |
| :--- | :--- | :--- | :--- |
| Consultar catálogo | GET | /api/v1/menus/{menuId}/catalog | Devuelve entradas y ofertas publicables. Puede aceptar búsqueda y filtro por categoría; la respuesta conserva identidad de entrada, ofertas vendibles, precio base y composición. |
| Consultar detalle publicable | GET | /api/v1/menus/{menuId}/catalog/entries/{entryId} | Devuelve el detalle de una entrada publicable y sus ofertas vigentes. |
| Consultar categorías | GET | /api/v1/menus/{menuId}/categories | Devuelve las categorías del menú con nombre y descripción. |
| Crear categoría | POST | /api/v1/menus/{menuId}/categories | Crea una categoría con nombre y descripción. |
| Editar categoría | PATCH | /api/v1/menus/{menuId}/categories/{categoryId} | Actualiza nombre o descripción y conserva su pertenencia al menú. |
| Listar entradas para administración | GET | /api/v1/menus/{menuId}/entries | Devuelve las entradas del menú para su administración, incluidas las no publicables. |
| Consultar entrada para administración | GET | /api/v1/menus/{menuId}/entries/{entryId} | Devuelve una entrada, su estado, categorías y ofertas, incluidas definiciones no publicables. |
| Crear entrada | POST | /api/v1/menus/{menuId}/entries | Crea una CatalogEntry con brandName, descripción, referencia de imagen y categorías del mismo menú. La entrada inicia INACTIVE. |
| Editar o cambiar estado de entrada | PATCH | /api/v1/menus/{menuId}/entries/{entryId} | Actualiza datos comerciales, categorías o estado. Archivar es reversible; al desarchivar el estado resultante es INACTIVE. Activar exige al menos una oferta válida. |
| Eliminar entrada archivada | DELETE | /api/v1/menus/{menuId}/entries/{entryId} | Completa de forma atómica la conversión de referencias vigentes y la eliminación definitiva de la entrada y sus ofertas vigentes. Solo admite una entrada ARCHIVED y responde 200 con el resultado. |
| Listar ofertas de una entrada | GET | /api/v1/menus/{menuId}/entries/{entryId}/offers | Devuelve las CatalogOffer asociadas a la entrada. |
| Crear oferta | POST | /api/v1/menus/{menuId}/entries/{entryId}/offers | Crea una CatalogOffer inactiva con presentación, precio base, imagen y Composition iniciales. |
| Consultar oferta | GET | /api/v1/menus/{menuId}/entries/{entryId}/offers/{offerId} | Devuelve la definición vigente de la oferta. |
| Cambiar estado de oferta | PATCH | /api/v1/menus/{menuId}/entries/{entryId}/offers/{offerId} | Activa o inactiva la oferta. Activarla requiere una composición válida. |
| Crear una revisión de oferta | POST | /api/v1/menus/{menuId}/entries/{entryId}/offers/{offerId}/revisions | Crea una revisión identificable de la definición comercial completa, incluida Composition. Las revisiones referenciadas existentes se conservan; la nueva definición queda vigente para futuras referencias. |
| Consultar revisión de oferta | GET | /api/v1/catalog-offers/{offerId}/revisions/{offerRevision} | Devuelve la fotografía de una revisión específica, incluso cuando ya se eliminó la oferta vigente de su entrada. |
| Consultar composición | GET | /api/v1/menus/{menuId}/entries/{entryId}/offers/{offerId}/composition | Devuelve la Composition vigente, incluidos slots, regiones, alternativas de contenido, fuentes, ajustes locales y personalizaciones. |
| Reemplazar composición | PUT | /api/v1/menus/{menuId}/entries/{entryId}/offers/{offerId}/composition | Reemplaza la Composition completa. Un contenido distinto crea una revisión nueva de CatalogOffer; reenviar el mismo contenido conserva la revisión vigente. |
| Listar bibliotecas de recetas | GET | /api/v1/recipe-libraries | Devuelve las RecipeLibrary disponibles. La ruta global queda aceptada; su alcance entre menús sigue pendiente según OPEN-003. |
| Crear biblioteca de recetas | POST | /api/v1/recipe-libraries | Crea una RecipeLibrary. Su alcance entre menús sigue pendiente según OPEN-003. |
| Editar biblioteca de recetas | PATCH | /api/v1/recipe-libraries/{libraryId} | Actualiza el nombre de la RecipeLibrary. |
| Listar recetas de una biblioteca | GET | /api/v1/recipe-libraries/{libraryId}/recipes | Devuelve las RecipeDefinition reutilizables de la biblioteca. |
| Crear receta | POST | /api/v1/recipe-libraries/{libraryId}/recipes | Crea una RecipeDefinition con rendimiento, unidad, líneas, estado y revisión identificable. La solicitud especifica el estado; no hay un valor inicial implícito. |
| Consultar receta | GET | /api/v1/recipe-libraries/{libraryId}/recipes/{recipeId} | Devuelve la receta y las revisiones identificables disponibles para su uso. |
| Crear revisión de receta | POST | /api/v1/recipe-libraries/{libraryId}/recipes/{recipeId}/revisions | Crea una nueva definición con revisión identificable; las ofertas que referencian una revisión anterior la conservan hasta que se actualice su referencia. |

## Paginación del contrato

La paginación forma parte de esta interfaz; la ERS no fija su transporte ni su representación. Cada operación de listado tiene el mecanismo definido en el contrato:

| Operación | URI | Mecanismo y respuesta |
| :--- | :--- | :--- |
| `listPublishedCatalog` | `/api/v1/menus/{menuId}/catalog` | Cursor con `limit` (predeterminado 20; rango 1–100) y `cursor` opaco. La primera solicitud omite `cursor`; se continúa enviando `pagination.nextCursor` junto con los mismos filtros y límite. `nextCursor: null` indica el fin. No calcula totales. |
| `listMenuCategories` | `/api/v1/menus/{menuId}/categories` | Páginas numeradas con `page` (base 1; predeterminado 1) y `pageSize` (predeterminado 20; rango 1–100). La respuesta incluye `items` y `pagination` con `page`, `pageSize`, `totalItems` y `totalPages`. |
| `listMenuEntries` | `/api/v1/menus/{menuId}/entries` | Páginas numeradas con `page` y `pageSize`; `items` incluye entradas de cualquier estado para administración. |
| `listEntryOffers` | `/api/v1/menus/{menuId}/entries/{entryId}/offers` | Páginas numeradas con `page` y `pageSize`; `items` incluye ofertas activas e inactivas de la entrada. |
| `listRecipeLibraries` | `/api/v1/recipe-libraries` | Páginas numeradas con `page` y `pageSize`; la ruta global está aceptada y el alcance entre menús permanece pendiente (OPEN-003). |
| `listLibraryRecipes` | `/api/v1/recipe-libraries/{libraryId}/recipes` | Páginas numeradas con `page` y `pageSize`; `items` incluye las recetas de la biblioteca con su estado y revisión vigente. |

Los cinco listados administrativos devuelven `items` y los cuatro campos de paginación en cada respuesta. Si no hay resultados, `items` es `[]` y `totalPages` es 0. En estas consultas, `page` fuera del total devuelve una página vacía con el número solicitado y los totales vigentes. Los valores, límites y cuerpos anteriores son decisiones técnicas de este contrato y no agregan reglas al dominio.

La composición se representa como un recurso completo para que su estructura anidada pueda expresarse en una sola representación. Cada actualización identifica las entidades por sus propios identificadores; PUT crea una revisión identificable de CatalogOffer solo cuando cambia el contenido y conserva la revisión vigente si se reenvía el mismo contenido. Las revisiones publicadas que ya referencian otra revisión se conservan. Las reglas de concurrencia permanecen abiertas; los errores de validación están definidos por el contrato sin agregar reglas al dominio.

Al eliminar una entrada archivada, Menu identifica las referencias vigentes a cualquiera de sus ofertas tanto en `CatalogOfferSource` como en `AddOption` con destino `CATALOG_OFFER`. Desactiva en lote cada `ComponentOption` contenedora y convierte cada referencia en una copia local `INLINE` de la composición completa de la revisión fijada, con sus slots, alternativas y personalizaciones. La copia materializa recursivamente las referencias a otras ofertas de la entrada eliminada, sin ciclos. Crea nuevas revisiones de las ofertas contenedoras y elimina la entrada y sus ofertas vigentes solo cuando todas las conversiones concluyen; si alguna falla, no aplica cambios. Las revisiones históricas publicadas permanecen inmutables y sus fotografías necesarias siguen consultables.

## Representación conceptual

Las representaciones de los payloads están especificadas en este contrato. Los campos siguen los conceptos y atributos de [architechture.md](../ers/architechture.md) y [domain-model.md](../../docs/md/domain-model.md).

- **Category:** id, menuId, name y description.
- **CatalogEntry:** id, menuId, brandName, description, imageRef, status, categoryIds y defaultOfferId opcional. Las categorías pertenecen al mismo menú. La referencia defaultOfferId no impone un comportamiento de selección predeterminada.
- **CatalogOffer:** id, entryId, presentationTag opcional, basePrice, offerImageRef y status. La respuesta incluye la revisión vigente; cada CatalogOfferSource conserva la revisión publicada que referencia. El nombre visible deriva de la identidad comercial de la entrada junto con su presentación.
- **CatalogOfferRevision:** fotografía histórica inmutable que conserva `brandNameSnapshot` del nombre comercial publicado para consultarlo incluso después de eliminar la entrada vigente.
- **Composition:** selectable, requiredSlots, minSelections y maxSelections cuando aplican, slots y placementRegions.
- **CompositionSnapshot:** cuando `INLINE` contiene la composición completa de una oferta, `sourceOfferId` y `sourceOfferRevision` identifican la oferta y la revisión fijada de la que procede la copia local.
- **CompositionSlot:** id, name, quantity, course sugerido, positionRef y una o más ComponentOption. Los slots obligatorios se distinguen de los elegibles; sus límites de selección se aplican solo a los elegibles.
- **ComponentOption:** id, displayName, status, un único origen entre INLINE, INVENTORY_ITEM, PREPARATION y CATALOG_OFFER, y personalizaciones propias opcionales.
- **Fuentes de contenido:** INLINE contiene exactamente una receta local o una copia local de una Composition completa, con sus slots, alternativas y personalizaciones; INVENTORY_ITEM conserva inventoryItemId, quantity y unit; PREPARATION conserva la referencia y revisión de RecipeDefinition, además de RecipeAdjustment local; CATALOG_OFFER conserva la referencia de CatalogOffer y la revisión publicada utilizada.
- **RecipeDefinition:** name, descripción opcional, revision, scope, yieldQuantity, yieldUnit, status e ingredients. Cada ComponentIngredient identifica una aparición mediante partKey, cantidad y unidad y apunta a un InventoryItem o a una receta reutilizable, de forma excluyente.
- **Personalizations:** grupos RecipeModifierGroup, AddOptionGroup, ReplaceOptionGroup y PreparationInstructionGroup, con sus alternativas y límites declarados. `AddOption` puede conservar una referencia a InventoryItem, RecipeDefinition o CatalogOffer, o contener una copia local `INLINE` de la Composition de una oferta; en la conversión conserva su `priceDelta`. Los grupos que dependen de una receta identifican líneas de la receta efectiva de esa ComponentOption.

## Reglas de dominio que gobiernan las operaciones

- Las categorías y entradas pertenecen al mismo menú; una entrada nueva inicia INACTIVE y solo una entrada archivada puede eliminarse definitivamente. Una entrada activa requiere al menos una oferta válida. **[BR-MENU-001, BR-MENU-002, BR-MENU-003, BR-MENU-004; INV-MENU-001, INV-MENU-002]**
- Toda oferta vendible posee una composición con uno o más slots; un slot tiene al menos una alternativa. La presentación describe la oferta, y el precio base corresponde a la oferta completa. **[BR-MENU-005, BR-MENU-006, BR-MENU-007; INV-MENU-007]**
- La inclusión automática o elegible de slots, los límites de selección y la elección de una alternativa de contenido son reglas distintas. Cantidad, curso y ubicación conservan su ámbito descriptivo. **[BR-MENU-008, BR-MENU-009, BR-MENU-010, BR-MENU-011, BR-MENU-012, BR-MENU-013, BR-MENU-014; INV-MENU-003, INV-MENU-004]**
- Cada ComponentOption tiene exactamente un origen. Una opción inactiva no se ofrece como nueva elección. InventoryItemSource conserva un artículo externo, cantidad positiva y unidad compatible con ese artículo. **[BR-MENU-015, BR-MENU-016, BR-MENU-017, BR-MENU-018, BR-MENU-019; INV-MENU-004, INV-MENU-005]**
- Los ajustes de PreparationSource son locales al uso de la receta: ADD requiere ingrediente y cantidad; las operaciones sobre una línea identifican una línea de origen compatible. Las revisiones de recetas y ofertas referenciadas se identifican y no se alteran retroactivamente; las referencias no forman ciclos. **[BR-MENU-020, BR-MENU-021, BR-MENU-028, BR-MENU-029; INV-MENU-008]**
- La eliminación de una entrada archivada convierte íntegramente las referencias vigentes a sus ofertas en ambos modos de uso, desactiva las `ComponentOption` contenedoras y conserva las revisiones históricas sin reescribirlas. **[BR-MENU-003, BR-MENU-017, BR-MENU-024, BR-MENU-029, BR-MENU-030; INV-MENU-008, INV-MENU-009]**
- Las personalizaciones son propias de cada ComponentOption y se validan contra su receta efectiva. RecipeModifier y ReplaceOptionGroup se restringen a líneas directas de InventoryItem; ReplaceOption refiere solo a InventoryItem, AddOption refiere exactamente a uno de los destinos permitidos e instrucciones no alteran cantidades físicas. **[BR-MENU-022, BR-MENU-023, BR-MENU-024, BR-MENU-025, BR-MENU-026; INV-MENU-005, INV-MENU-006]**
- priceDelta permanece asociado a la personalización que lo declara y no incrementa basePrice. Menu no calcula el precio final de una orden. Las referencias a InventoryItem preservan su identidad externa y no transfieren stock a Menu. **[BR-MENU-018, BR-MENU-027; INV-MENU-005, INV-MENU-007]**

Estas reglas se detallan en [business-rules.md](../ers/business-rules.md) y [traceability.md](../ers/traceability.md).

## Trazabilidad funcional del contrato

Cada fila enlaza una capacidad de la ERS con una operación o recurso del contrato. Las rutas y métodos están definidos por el contrato, no prescritos por la ERS. Los identificadores y criterios completos se encuentran en [functional-requirements.md](../ers/functional-requirements.md).

| Requisito | Capacidad y operación o recurso del contrato |
| :--- | :--- |
| REQ-MENU-CAT-001 | Crear y editar Category en /menus/{menuId}/categories. |
| REQ-MENU-CAT-002 | Consultar el catálogo publicable mediante /menus/{menuId}/catalog. |
| REQ-MENU-ENTRY-001 | Crear CatalogEntry en /menus/{menuId}/entries. |
| REQ-MENU-ENTRY-002 | Editar identidad comercial y categorías mediante /entries/{entryId}. |
| REQ-MENU-ENTRY-003 | Activar, inactivar, archivar y desarchivar mediante el estado de /entries/{entryId}. |
| REQ-MENU-ENTRY-004 | Eliminar atómicamente CatalogEntry archivada mediante DELETE /entries/{entryId}, tras desactivar las ComponentOption contenedoras y convertir sus referencias vigentes a las ofertas de la entrada. |
| REQ-MENU-OFFER-001 | Crear CatalogOffer perteneciente a una entrada mediante /entries/{entryId}/offers. |
| REQ-MENU-OFFER-002 | Representar separadas la identidad de CatalogEntry y la presentationTag de CatalogOffer. |
| REQ-MENU-OFFER-003 | Declarar y consultar basePrice de la oferta en /offers/{offerId}. |
| REQ-MENU-OFFER-004 | Activar o inactivar CatalogOffer; al activarla se comprueba que Composition sea válida. |
| REQ-MENU-OFFER-005 | Consultar revisiones identificables y conservar las fotografías requeridas por referencias históricas tras eliminar la oferta vigente. |
| REQ-MENU-COMP-001 | Administrar Composition y uno o más CompositionSlot en la representación de cada revisión de CatalogOffer. |
| REQ-MENU-COMP-002 | Representar selectable, requiredSlots, minSelections y maxSelections en Composition. |
| REQ-MENU-COMP-003 | Administrar ComponentOption por CompositionSlot, separando inclusión del slot y elección de contenido. |
| REQ-MENU-COMP-004 | Declarar quantity por CompositionSlot e identidad separada para unidades personalizables aparte. |
| REQ-MENU-COMP-005 | Declarar course sugerido por CompositionSlot. |
| REQ-MENU-COMP-006 | Administrar PlacementRegion y la referencia positionRef descriptiva del slot. |
| REQ-MENU-CONT-001 | Definir una ComponentOption con un único origen y su estado y etiqueta contextual. |
| REQ-MENU-CONT-002 | Representar InventoryItemSource con inventoryItemId, quantity y unit. |
| REQ-MENU-CONT-003 | Representar InlineContent y su RecipeDefinition local dentro de la ComponentOption. |
| REQ-MENU-CONT-004 | Referenciar CatalogOffer como origen de contenido y convertir sus usos vigentes en copias locales `INLINE` de la composición completa de la revisión fijada al eliminar la entrada propietaria. |
| REQ-MENU-REC-001 | Administrar RecipeLibrary, RecipeDefinition y ComponentIngredient con rendimiento, cantidad y unidad. |
| REQ-MENU-REC-002 | Representar PreparationSource y RecipeAdjustment local dentro de la ComponentOption. |
| REQ-MENU-REC-003 | Crear revisiones identificables de RecipeDefinition sin modificar las versiones ya referenciadas. |
| REQ-MENU-PERS-001 | Asociar Personalizations a una sola aparición de ComponentOption. |
| REQ-MENU-PERS-002 | Representar RecipeModifierGroup y RecipeModifier sobre líneas directas de la receta efectiva. |
| REQ-MENU-PERS-003 | Representar AddOptionGroup, AddOption, sus límites, `priceDelta` y los modos de destino, incluida la copia local `INLINE` de una oferta materializada. |
| REQ-MENU-PERS-004 | Representar ReplaceOptionGroup y ReplaceOption, con destino InventoryItem. |
| REQ-MENU-PERS-005 | Representar PreparationInstructionGroup e instrucciones asociadas a la preparación. |
| REQ-MENU-PERS-006 | Conservar priceDelta con cada personalización sin modificar basePrice ni calcular un precio final. |

## Cuestiones abiertas conservadas

Las decisiones de [open.md](../ers/open.md) permanecen pendientes. Sus efectos sobre la API son:

| Cuestión | Decisión que permanece pendiente |
| :--- | :--- |
| OPEN-001 | Moneda, precisión, redondeo y rangos de basePrice y priceDelta. |
| OPEN-002 | Uso de defaultOfferId y respuesta cuando la oferta referida no está activa. |
| OPEN-003 | Alcance de RecipeLibrary entre menús; condiciona permisos y administración de sus rutas. |
| OPEN-005 | Formatos, dimensiones, tamaño y manejo de imágenes no admitidas. |
| OPEN-006 | Rangos, precisión, fracciones y unidades de CompositionSlot y recetas. |
| OPEN-007 | Si los cursos son un conjunto cerrado o admiten otros valores configurables. |
| OPEN-008 | Si una Composition válida exige alternativas activas en cada slot. |
| OPEN-009 | Proporción de operaciones y dataset representativo para el perfil nominal de carga. |

## Criterios de rendimiento relacionados

Los criterios de [non-functional-requirements.md](../ers/non-functional-requirements.md) se conservan en el alcance que define la ERS:

| Identificador | Aplicación |
| :--- | :--- |
| NFR-MENU-PERF-01 | La evaluación automatizada usa datasets representativos del catálogo e incluye navegación y validación E2E de selecciones en el flujo de aceptación de una orden. |
| NFR-MENU-PERF-02 | Perfil nominal por sucursal: hasta 40 sesiones, 30 req/s durante 30 minutos y error interno menor a 0.1% de las solicitudes ofrecidas; las selecciones deliberadamente inválidas se contabilizan aparte. La consulta se mide desde POS hasta el resultado visible (p95 ≤ 200 ms, p99 ≤ 1.0 s; crítico > 500 ms). La validación al aceptar una orden se mide E2E (p95 ≤ 300 ms, p99 ≤ 1.0 s; crítico > 500 ms). |
| NFR-MENU-PERF-03 | Perfil de ráfaga: 100 req/s durante 60 segundos, hasta 40 sesiones y la mezcla nominal. Los servicios participantes no colapsan ni reinician procesos; el informe contabiliza solicitudes completadas, fallidas o pendientes. No se exige mantener latencias nominales durante la ráfaga ni se establece recuperación. |

OPEN-009 mantiene pendiente la distribución de solicitudes entre las clases. Estos perfiles no establecen latencias objetivo para endpoints individuales de Menu.
