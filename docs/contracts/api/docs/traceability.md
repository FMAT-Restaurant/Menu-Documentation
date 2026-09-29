# Trazabilidad del contrato OpenAPI

Autoridad: [ERS 2.1.1](../../../ers/README.md), [contrato de API](../../api-contract.md) y [modelo de dominio](../../../other/md/domain-model.md). La ERS es la autoridad normativa para requisitos y reglas; las rutas y los detalles de transporte están establecidos en el contrato. Los identificadores normativos remiten a la ERS. Los nombres de la segunda columna son `operationId` del [documento OpenAPI](../openapi.yaml).

## Requisitos funcionales

| Requisito | Operaciones | Representación o validación decisiva |
| :--- | :--- | :--- |
| REQ-MENU-CAT-001 | listMenuCategories, createMenuCategory, patchMenuCategory | `Category`, `CategoryInput`, pertenencia a `menuId`. |
| REQ-MENU-CAT-002 | listPublishedCatalog, getPublishedCatalogEntry | `PublishedEntry` conserva la identidad comercial activa y al menos una `PublishedOffer` activa válida. |
| REQ-MENU-ENTRY-001 | createMenuEntry | `EntryCreateMultipart` requiere `entry` JSON e `image`; `CreatedEntry` responde `INACTIVE`, con `offers: []` e `imageRef`. |
| REQ-MENU-ENTRY-002 | patchMenuEntry | `EntryPatch` actualiza metadatos y `EntryPatchMultipart` permite reemplazar `image`; omitir la parte conserva `imageRef`. |
| REQ-MENU-ENTRY-003 | patchMenuEntry | `EntryStatus`; activación válida y salida de `ARCHIVED` a `INACTIVE`. |
| REQ-MENU-ENTRY-004 | deleteArchivedMenuEntry | `DELETE` síncrono y atómico sobre una entrada `ARCHIVED`: `EntryDeletionResult` confirma las ofertas eliminadas, nuevas revisiones contenedoras y opciones desactivadas. Convierte referencias vigentes `CatalogOfferSource` y `AddOption` de tipo `CATALOG_OFFER` a `INLINE` con `CompositionSnapshot` de la revisión fijada; `sourceOfferId` y `sourceOfferRevision` conservan la procedencia histórica, sin constituir una referencia vigente. Las revisiones históricas siguen consultables. |
| REQ-MENU-OFFER-001 | createEntryOffer, listEntryOffers | `OfferCreateMultipart` requiere `offer` JSON e `image`; la oferta responde `INACTIVE` con `offerImageRef`. |
| REQ-MENU-OFFER-002 | listPublishedCatalog, getEntryOffer | `Entry.brandName` y `Offer.presentationTag` separados. |
| REQ-MENU-OFFER-003 | createEntryOffer, createEntryOfferRevision | `Offer.basePrice` fijo de la oferta completa. |
| REQ-MENU-OFFER-004 | setEntryOfferStatus | Composición válida al activar; OPEN-008. |
| REQ-MENU-OFFER-005 | createEntryOfferRevision, getCatalogOfferRevision, deleteArchivedMenuEntry | `CatalogOfferSource.offerRevision` y `CatalogOfferAddOption.offerRevision` fijan la composición copiada; la revisión admite `image` multipart opcional y conserva `offerImageRef` si se omite. `OfferRevision` permanece inmutable y consultable tras eliminar la entrada vigente. |
| REQ-MENU-COMP-001 | getOfferComposition, replaceOfferComposition | `Composition.slots` no vacío. |
| REQ-MENU-COMP-002 | replaceOfferComposition | `AutomaticComposition` y `SelectableComposition`; límites sobre elegibles. |
| REQ-MENU-COMP-003 | replaceOfferComposition | `CompositionSlot.options` no vacío; una opción por slot incluido. |
| REQ-MENU-COMP-004 | replaceOfferComposition | `CompositionSlot.quantity`; unidades independientes requieren slots distintos. |
| REQ-MENU-COMP-005 | replaceOfferComposition | `CompositionSlot.course` descriptivo; OPEN-007. |
| REQ-MENU-COMP-006 | replaceOfferComposition | `PlacementRegion` y `CompositionSlot.positionRef`. |
| REQ-MENU-CONT-001 | replaceOfferComposition | `ComponentOption` y `ComponentSource.oneOf` con cuatro orígenes. |
| REQ-MENU-CONT-002 | replaceOfferComposition | `InventoryItemSource` con ID externo, cantidad positiva y unidad compatible. |
| REQ-MENU-CONT-003 | replaceOfferComposition | `InlineRecipeContent.recipe` local con `ComponentIngredient`. |
| REQ-MENU-CONT-004 | replaceOfferComposition, getCatalogOfferRevision, deleteArchivedMenuEntry | `CatalogOfferSource` fija oferta y revisión sin sumar su `basePrice`; `InlineCompositionContent.compositionSnapshot` usa `CompositionSnapshot` para conservar slots, alternativas y personalizaciones de la revisión fijada al eliminar la oferta referenciada. |
| REQ-MENU-REC-001 | listRecipeLibraries, createRecipeLibrary, patchRecipeLibrary, listLibraryRecipes, createLibraryRecipe | `Recipe`, rendimiento, líneas `ComponentIngredient.oneOf`. |
| REQ-MENU-REC-002 | replaceOfferComposition | `PreparationSource` fija receta/revisión y `RecipeAdjustment` local. |
| REQ-MENU-REC-003 | getLibraryRecipe, createLibraryRecipeRevision | Revisión inmutable; consulta opcional `revision`; actualización explícita de referencias. |
| REQ-MENU-PERS-001 | replaceOfferComposition | `ComponentOption.personalizations` propio de la aparición. |
| REQ-MENU-PERS-002 | replaceOfferComposition | `RecipeModifierGroup` y línea directa de InventoryItem. |
| REQ-MENU-PERS-003 | replaceOfferComposition, deleteArchivedMenuEntry | `AddOptionGroup` admite cuatro destinos exclusivos. `CatalogOfferAddOption` fija revisión; su conversión a `InlineCompositionAddOption` conserva `priceDelta` y embebe `CompositionSnapshot` mientras desactiva la `ComponentOption` contenedora. |
| REQ-MENU-PERS-004 | replaceOfferComposition | `ReplaceOptionGroup` y `ReplaceOption.inventoryItemId`. |
| REQ-MENU-PERS-005 | replaceOfferComposition | `PreparationInstructionGroup`, sin efectos físicos automáticos. |
| REQ-MENU-PERS-006 | replaceOfferComposition | `priceDelta` ligado a personalización, independiente de `basePrice`. |

## Reglas e invariantes

| Identificadores | Evidencia en el contrato |
| :--- | :--- |
| BR-MENU-001, BR-MENU-002 | `Category`, `Entry` y `EntryInput`: pertenencia, clasificación y nombre comercial autoritativo. |
| BR-MENU-003, BR-MENU-004 | `createMenuEntry`, `patchMenuEntry`, `deleteArchivedMenuEntry`, `listPublishedCatalog`: estados, activación y publicación. |
| BR-MENU-005, BR-MENU-006, BR-MENU-007 | `OfferInput`, `Offer`, `Composition`: presentación, composición íntegra y precio base fijo. |
| BR-MENU-008, BR-MENU-009, BR-MENU-010 | `AutomaticComposition`/`SelectableComposition`: inclusión, obligatoriedad y límites sobre elegibles. |
| BR-MENU-011, BR-MENU-012 | `CompositionSlot`: una opción por slot incluido, cantidad propia e identidad de slot. |
| BR-MENU-013, BR-MENU-014 | `course`, `positionRef`, `PlacementRegion`: sugerencia y ubicación descriptiva. |
| BR-MENU-015, BR-MENU-016, BR-MENU-017 | `ComponentOption`: identidad contextual, estado y `ComponentSource.oneOf`; `InlineContent.oneOf` distingue receta local de composición copiada. |
| BR-MENU-018, BR-MENU-019 | `InventoryItemSource` y `ComponentIngredient.oneOf`: referencia externa, cantidad/unidad y línea inequívoca. |
| BR-MENU-020, BR-MENU-021 | `Recipe`, `InlineRecipe`, `PreparationSource`, `RecipeAdjustment`: alcance y revisión; ajuste local. |
| BR-MENU-022, BR-MENU-023 | `Personalizations` y `RecipeModifierGroup`: propiedad de opción y modificación de línea directa. |
| BR-MENU-024, BR-MENU-025 | `AddOptionGroup` con cuatro destinos exclusivos, incluido `InlineCompositionAddOption`; `ReplaceOptionGroup` restringido a Inventario. |
| BR-MENU-026, BR-MENU-027 | `PreparationInstruction` descriptiva; `priceDelta` propio e independiente de `basePrice`. |
| BR-MENU-028, BR-MENU-029 | Validación acíclica en escrituras; `offerRevision` y `recipeRevision` fijan el contenido y `getCatalogOfferRevision` conserva la consulta histórica tras la eliminación. |
| BR-MENU-030 | `deleteArchivedMenuEntry` desactiva en lote las `ComponentOption` contenedoras, convierte ambas vías de referencia a `INLINE` con composición íntegra de la revisión fijada, materializa recursivamente las referencias a ofertas de la entrada eliminada, crea nuevas revisiones de las ofertas contenedoras y elimina entrada y ofertas vigentes en una sola operación atómica. |
| INV-MENU-001, INV-MENU-002 | Pertenencia de categorías/entradas; consulta y activación solo con definición válida. |
| INV-MENU-003, INV-MENU-004 | Selección de slots elegibles y opción única por slot incluido; origen exclusivo. |
| INV-MENU-005, INV-MENU-006 | Referencias de Inventario/receta íntegras; personalizaciones validadas contra receta efectiva de su opción. |
| INV-MENU-007, INV-MENU-008 | Precio base separado de deltas; referencias acíclicas y revisiones históricas inmutables y consultables. |
| INV-MENU-009 | `EntryDeletionResult`, `InlineCompositionContent`, `InlineCompositionAddOption` y `getCatalogOfferRevision`: ninguna referencia vigente a una oferta eliminada, opciones contenedoras inactivas e historial recuperable. |

Las restricciones entre arrays y recursos, como `requiredSlots` propio y único, `minSelections <= maxSelections <= slots elegibles`, pertenencia de categorías, compatibilidad de unidad y ausencia de ciclos, se comprueban en las operaciones de escritura. `oneOf`, `const`, límites simples y campos requeridos expresan directamente las condiciones estructurales que admite JSON Schema 2020-12.

## Cuestiones abiertas, decisión resuelta y rendimiento

| Cuestión | Tratamiento en el contrato |
| :--- | :--- |
| OPEN-001 | `Amount` admite importes con signo; moneda, precisión, redondeo y rangos no se fijan. |
| OPEN-002 | `defaultOfferId` es una referencia opcional; no prescribe selección inicial ni resolución de inactividad. |
| OPEN-003 | La URI global `/recipe-libraries` está aceptada; permanece sin resolver si el alcance de RecipeLibrary es global/compartido o por menú. |
| OPEN-006 | Cantidades de slots y recetas mantienen rango/precisión sin decidir; cantidad directa de Inventario exige valor positivo. |
| OPEN-007 | `course` es cadena descriptiva sin enum cerrado. |
| OPEN-008 | Activación requiere composición válida; exigencia de una opción activa por slot pendiente. |
| OPEN-009 | NFR-MENU-PERF-01..03 se evalúan E2E; mezcla y dataset representativo pendientes. |

OPEN-005 está resuelto: las operaciones de escritura admitidas para carga reciben `image` como parte binaria multipart; se aceptan JPEG, PNG y WebP hasta 10 MiB y 4096 × 4096 px. Formato no admitido devuelve 415; imagen inválida, dimensiones o tamaño excedidos devuelven 422. Las respuestas y consultas conservan `imageRef` y `offerImageRef` sin cambio.

NFR-MENU-PERF-01..03 corresponden a evaluación del flujo POS/aceptación de orden, con perfiles nominal y de ráfaga descritos en la ERS. Ningún objetivo de latencia se asigna aquí a un endpoint individual de Menu.
