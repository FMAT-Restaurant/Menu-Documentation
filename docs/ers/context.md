# Contexto, alcance y lenguaje del dominio

## Responsabilidad del bounded context Menú/Catálogo

El bounded context Menú/Catálogo define la identidad comercial de las entradas de la carta, sus presentaciones vendibles y la composición de cada presentación. También administra las categorías del menú y las recetas que el catálogo utiliza para describir elaboraciones.

El modelo organiza esta responsabilidad en tres niveles:

1. **Identidad comercial:** `Menu` agrupa categorías y entradas. `CatalogEntry` conserva la identidad de un producto de la carta y sus categorías.
2. **Presentación vendible:** cada `CatalogEntry` puede ofrecer una o más `CatalogOffer`. Cada oferta define su precio base y una `Composition`.
3. **Composición y contenido:** la composición define slots y reglas de inclusión. Cada slot contiene alternativas de contenido; cada alternativa identifica una aparición concreta.

El nombre visible combina el `brandName` de `CatalogEntry` con el `presentationTag` opcional de `CatalogOffer`. La presentación describe la oferta; las cantidades se expresan en los slots de su composición. Una entrada `ACTIVE` requiere al menos una `CatalogOffer` `ACTIVE` y válida; una oferta solo se publica bajo una entrada `ACTIVE`. `CatalogEntry` tiene los estados `ACTIVE`, `INACTIVE` y `ARCHIVED`; `CatalogOffer`, `ComponentOption` y `RecipeDefinition` tienen `ACTIVE` e `INACTIVE`. Los estados de la entrada y de sus ofertas son independientes: cambiar uno no modifica automáticamente el otro.

### Reglas de composición

La inclusión de slots y la elección de contenido son decisiones distintas:

- Si `selectable = false`, se incluyen todos los slots; `requiredSlots`, `minSelections` y `maxSelections` no aplican.
- Si `selectable = true`, `requiredSlots` identifica los slots propios, distintos y siempre incluidos. Los demás slots son elegibles y `minSelections` y `maxSelections` limitan cuántos de ellos se incluyen.
- Los límites cumplen `0 ≤ minSelections ≤ maxSelections ≤ cantidad de slots elegibles`. Si la composición requiere elegir alguno, `minSelections ≥ 1`; una composición seleccionable tiene al menos un slot elegible.
- Cada slot incluido se concreta con una `ComponentOption`. Si hay varias opciones, elegir su contenido es independiente de incluir el slot.
- `CompositionSlot.quantity` indica las unidades incorporadas al incluir esa posición.
- `course` sugiere un tiempo de servicio. `positionRef` señala una ubicación; la obligatoriedad del slot se establece en `Composition`. `PlacementRegion.name` es descriptivo; `surface` y `coverage` son atributos opcionales reservados para el futuro.

### Contenido y recetas

Cada `ComponentOption` es una aparición contextual con exactamente un `ComponentSource`. Las tres clases de contenido son `INVENTORY_ITEM`, `RECIPE` y `CATALOG_OFFER`. Varias apariciones pueden referir la misma definición de receta, artículo u oferta en apariciones distintas.

Catálogo administra todas las `RecipeDefinition` en `RecipeLibrary` y sus líneas `ComponentIngredient`. Al configurar un `ComponentOption` de tipo `RECIPE`, se puede seleccionar una receta existente por ID o definir una receta desde el flujo de configuración de la opción. Una receta nueva se guarda en `RecipeLibrary`; la opción referencia su ID y la revisión fijada. `RecipeSource` identifica esa aparición mediante `recipeSourceId`, referencia la `RecipeDefinition` de la biblioteca mediante `recipeId` y su revisión fijada, y puede declarar ajustes administrativos locales mediante `RecipeAdjustment`. Los ajustes describen diferencias para esa aparición y conservan la definición de biblioteca como fuente común. `CompositionSnapshot` conserva la composición publicada de una revisión y pertenece únicamente a `CatalogOfferRevision`.

Una línea `ComponentIngredient` identifica una aparición de un `InventoryItem` o de una receta de `RecipeLibrary` y expresa su cantidad y unidad. Una receta requiere una cantidad de rendimiento y una unidad; sus revisiones identifican la definición utilizada. Las referencias recursivas entre recetas se mantienen sin ciclos.

Desactivar una oferta impide nuevos usos o su publicación sin eliminar las referencias existentes ni cambiar automáticamente otros recursos. Archivar una entrada desde `ACTIVE` o `INACTIVE` la retira del flujo normal sin modificar los estados de sus ofertas; desarchivarla la deja en `INACTIVE`.

Una `CatalogEntry` solo puede eliminarse cuando está `ARCHIVED` y ninguna de sus ofertas mantiene referencias vigentes externas. Una `CatalogOffer` solo puede eliminarse individualmente cuando está `INACTIVE`, no está referenciada por una definición vigente mediante `CatalogOfferSource`, no es el `defaultOfferId` de su entrada y su eliminación no deja una entrada `ACTIVE` sin una oferta `ACTIVE` y válida. Una referencia vigente bloquea también la eliminación de la entrada propietaria de la oferta afectada. `defaultOfferId` impide eliminar individualmente la oferta indicada, pero el vínculo, que pertenece a la entrada, se retira con ella al eliminar la entrada completa. La operación se rechaza sin modificar los recursos referenciantes o crear revisiones nuevas. Las relaciones y estructuras poseídas exclusivamente pueden eliminarse junto con su propietario cuando no hay referencias impeditivas. Las revisiones históricas publicadas, incluida su `CompositionSnapshot`, permanecen inmutables y consultables por `offerId` y `revision`; las referencias que solo permanecen en revisiones históricas no bloquean la eliminación de la definición vigente.

### Precio declarado por Catálogo

`CatalogOffer.basePrice` es fijo para la oferta, independientemente de los slots y contenidos elegidos. La composición, sus slots, sus opciones y las ofertas hijas referenciadas no aportan cargos automáticos al precio base.

El catálogo declara `basePrice`. La cantidad pedida, las elecciones concretas de una orden y el cálculo de su precio final pertenecen al modelo de órdenes.

## Ownership y límites de contexto

| Ámbito | Responsabilidad del dominio |
| :--- | :--- |
| Menú/Catálogo | Es propietario de `Menu`, `Category`, `CatalogEntry`, `CatalogOffer`, composición, opciones de contenido y recetas; declara los precios base. |
| Inventario | Es propietario de la identidad de `InventoryItem` y de sus existencias. Catálogo lo referencia como concepto externo en opciones y recetas. |
| Órdenes | Registra la cantidad pedida y las elecciones concretas de slots y contenido; determina el precio final de la orden según el modelo transaccional. |

La validez estructural de una composición o receta corresponde a sus definiciones de catálogo. El stock de los artículos referenciados pertenece a Inventario y es independiente de esa validez.

```mermaid
flowchart LR
    subgraph Catalogo["Bounded context Menú/Catálogo"]
        Menu[Menu] --> Category[Category]
        Menu --> Entry[CatalogEntry]
        Entry --> Offer[CatalogOffer]
        Offer -. "publica revisiones" .-> OfferRevision["CatalogOfferRevision<br/>offerId + revision"]
        OfferRevision --> CompositionSnapshot["CompositionSnapshot<br/>composición publicada inmutable"]
        Offer --> Composition[Composition]
        Composition --> Slot[CompositionSlot]
        Slot --> Option[ComponentOption]
        Option --> Source["Un ComponentSource"]
        Source --> ItemSource[INVENTORY_ITEM]
        Source --> RecipeSource[RECIPE]
        Source --> OfferSource[CATALOG_OFFER]
        RecipeLibrary[RecipeLibrary] --> RecipeDefinition[RecipeDefinition]
        RecipeSource -. "recipeId + revisión fijada" .-> RecipeDefinition
        RecipeDefinition --> Ingredient[ComponentIngredient]
    end

    subgraph Inventory["Inventario"]
        InventoryItem["InventoryItem<br/>identidad y existencias"]
    end

    subgraph Orders["Modelo de órdenes"]
        OrderSelection["Cantidad y elecciones concretas"]
        FinalPrice["Precio final de la orden"]
    end

    ItemSource -. "referencia de identidad" .-> InventoryItem
    Ingredient -. "referencia de identidad" .-> InventoryItem
    OfferSource -. "referencia otra oferta" .-> Offer
    OfferSource -. "revisión fijada" .-> OfferRevision
    OrderSelection -. "se rige por composición y alternativas" .-> Composition
```

Una referencia vigente desde `CatalogOfferSource` impide eliminar la oferta afectada o la entrada que la contiene. El rechazo no desactiva opciones, no modifica los recursos referenciantes y no crea revisiones; `CatalogOfferRevision` y su `CompositionSnapshot` histórica se conservan.

## Lenguaje para describir una oferta

Una oferta se describe desde la identidad de la carta hasta las alternativas que pueden ocupar cada posición:

```mermaid
flowchart TD
    Offer["CatalogOffer<br/>estado, presentación y basePrice"] --> Composition["Composition<br/>reglas de inclusión"]
    Composition --> Slot["CompositionSlot<br/>posición y cantidad incluida"]
    Slot --> Option["ComponentOption<br/>aparición de contenido"]
    Option --> Source["Un origen de contenido"]
    Composition -. "regula si se incluye" .-> Slot
    Slot -. "si se incluye, se concreta con" .-> Option
```

La vista distingue la regla que incluye una posición de la alternativa de contenido que la concreta. Describe definiciones de catálogo; las elecciones concretas se registran en el modelo de órdenes.

## Glosario del dominio

- **`Menu`:** ámbito propietario de las categorías y entradas comerciales.
- **`Category`:** clasificación reutilizable del menú que puede relacionarse con varias entradas.
- **`CatalogEntry`:** identidad comercial de un producto de la carta; conserva `brandName`, categorías, estado y ofertas. Una entrada `ACTIVE` requiere al menos una oferta `ACTIVE` y válida.
- **`CatalogOffer`:** presentación vendible de una entrada, con estado `ACTIVE` o `INACTIVE`, `presentationTag` opcional, `basePrice` y exactamente una composición; solo se publica bajo una entrada `ACTIVE`.
- **`CatalogOfferRevision`:** revisión publicada e inmutable de una oferta, consultable por `offerId` y `revision` aunque ya no exista la definición vigente.
- **`Composition`:** estructura de una oferta que define slots, slots obligatorios y límites para incluir slots elegibles.
- **`CompositionSnapshot`:** composición publicada e inmutable que pertenece únicamente a una `CatalogOfferRevision` histórica.
- **`CompositionSlot`:** posición funcional o espacial de una composición, con cantidad incluida y alternativas de contenido.
- **`PlacementRegion`:** región semántica descriptiva de una composición que puede ser referida por un slot.
- **`ComponentOption`:** aparición contextual de contenido admitida en un slot, con un origen único.
- **`ComponentSource`:** tipo conceptual que identifica el origen único de una opción: `INVENTORY_ITEM`, `RECIPE` o `CATALOG_OFFER`.
- **`InventoryItemSource`:** contenido que referencia un artículo externo de Inventario con cantidad y unidad.
- **`RecipeSource`:** aparición de una receta de `RecipeLibrary`, identificada por `recipeSourceId`, que referencia `recipeId` y una revisión fijada, y puede tener ajustes administrativos locales. Al configurar una opción `RECIPE`, se puede elegir una receta de la biblioteca o definir una nueva, que se guarda en la biblioteca y queda referenciada por ID y revisión.
- **`CatalogOfferSource`:** contenido que referencia otra oferta vendible y fija la revisión publicada utilizada; una referencia vigente bloquea la eliminación de la oferta o su entrada.
- **`InventoryItem`:** artículo cuya identidad y existencias pertenecen a Inventario.
- **`RecipeLibrary`:** colección administrada por Catálogo que almacena todas las recetas.
- **`RecipeDefinition`:** definición de una elaboración con revisión, rendimiento y líneas de ingredientes.
- **`ComponentIngredient`:** línea identificable de receta que referencia un artículo de Inventario o una receta de `RecipeLibrary`, con cantidad y unidad.
- **`RecipeAdjustment`:** diferencia administrativa local aplicada a una aparición de receta mediante `RecipeSource`.
