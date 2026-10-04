# Contexto, alcance y lenguaje del dominio

## Responsabilidad del bounded context Menú/Catálogo

El bounded context Menú/Catálogo define la identidad comercial de las entradas de la carta, las ofertas agrupadas bajo cada entrada y la composición de cada oferta. También administra las categorías del menú y las recetas que el catálogo utiliza para describir elaboraciones.
El bounded context Menú/Catálogo define la identidad comercial de las entradas de la carta, las ofertas agrupadas bajo cada entrada y la composición de cada oferta. También administra las categorías del menú y las recetas que el catálogo utiliza para describir elaboraciones.

El modelo organiza esta responsabilidad en tres niveles:

1. **Identidad comercial:** `Menu` agrupa categorías y entradas. `CatalogEntry` conserva la identidad de un producto de la carta, sus categorías y agrupa sus ofertas.
2. **Oferta vendible:** cada `CatalogOffer` concreta pertenece a una `CatalogEntry` y se selecciona y vende individualmente. Cada oferta define su precio base y una `Composition`.
3. **Composición y contenido:** una composición conserva todos sus grupos (`CompositionSlot`) como miembros estructurales. Cada grupo se marca como requerido u opcional y reúne una o más variantes (`SlotOption`) que describen el contenido posible.
1. **Identidad comercial:** `Menu` agrupa categorías y entradas. `CatalogEntry` conserva la identidad de un producto de la carta, sus categorías y agrupa sus ofertas.
2. **Oferta vendible:** cada `CatalogOffer` concreta pertenece a una `CatalogEntry` y se selecciona y vende individualmente. Cada oferta define su precio base y una `Composition`.
3. **Composición y contenido:** una composición conserva todos sus grupos (`CompositionSlot`) como miembros estructurales. Cada grupo se marca como requerido u opcional y reúne una o más variantes (`SlotOption`) que describen el contenido posible.

El nombre visible combina el `brandName` de `CatalogEntry` con el `presentationTag` opcional de `CatalogOffer`. La etiqueta describe la oferta concreta. Una entrada solo se publica mientras está administrativamente `ACTIVE` y cuenta con al menos una `CatalogOffer` `ACTIVE` y válida; si no tiene una, permanece `ACTIVE` pero oculta. La inactivación automática de una oferta no cambia el estado administrativo de la entrada. `CatalogEntry` tiene los estados `ACTIVE`, `INACTIVE` y `ARCHIVED`; `CatalogOffer`, `CompositionSlot`, `SlotOption` y `RecipeDefinition` tienen `ACTIVE` e `INACTIVE`. El estado de `CompositionSlot` se deriva de sus opciones: es `ACTIVE` si al menos una está `ACTIVE`, y `INACTIVE` si ninguna lo está. Si ningún slot de `requiredSlots` queda `ACTIVE`, la oferta pasa automáticamente a `INACTIVE`; al recuperar opciones activas no vuelve a `ACTIVE` sin activación administrativa.

### Composición y selección

- Cada oferta contiene exactamente una composición con uno o más `CompositionSlot`. Cada slot tiene `required: boolean`; `requiredSlots` es el subconjunto derivado de los slots con `required=true`, y una composición válida contiene al menos un slot requerido. Todos los slots siguen perteneciendo estructuralmente a la composición.
- Cada `CompositionSlot` representa un grupo por su función y contiene una o más `SlotOption`. Un slot requerido `ACTIVE` participa en la selección; un slot opcional `ACTIVE` puede omitirse; un slot `INACTIVE` no se selecciona ni genera rondas.
- `CompositionSlot.quantity` indica cuántas rondas de selección tiene el grupo cuando participa. En cada ronda se resuelve exactamente una opción `ACTIVE` de ese grupo; si el grupo participante tiene una sola opción `ACTIVE`, se resuelve directamente en cada ronda. Por ejemplo, un grupo de acompañamientos con `quantity` 3 tiene tres rondas si participa, y en cada una se elige una opción `ACTIVE` entre papas, aros de cebolla y nuggets. Si ninguna opción del slot está `ACTIVE`, el slot queda `INACTIVE`. Si ningún elemento de `requiredSlots` queda `ACTIVE`, la oferta pasa a `INACTIVE` y no se reactiva automáticamente al restaurar opciones.
- `course` es opcional; cuando está presente, admite únicamente `entrada`, `plato fuerte`, `postre` o `bebida` y sugiere un tiempo de servicio.
- Durante la configuración, se puede elegir otra `CatalogOffer` como origen para copiar sus grupos y opciones a la composición destino. La copia conserva el atributo `required` de cada grupo y el estado de sus opciones; el estado de cada slot se deriva de las opciones copiadas. Las definiciones quedan locales, independientes y editables. La oferta destino no conserva el ID ni una referencia a la oferta origen, no sincroniza cambios con ella y no copia su precio.

### Contenido y recetas

Cada `SlotOption` es una aparición contextual con exactamente un `ComponentSource`: `INVENTORY_ITEM` o `RECIPE`. Varias opciones pueden referir el mismo artículo o la misma definición de receta en apariciones distintas.

Catálogo administra las `RecipeDefinition` en `RecipeLibrary` y sus líneas `ComponentIngredient`. Una receta define nombre, descripción, instrucciones en texto y uno o más ingredientes seleccionados de Inventario, cada uno con su cantidad. Todas las recetas se almacenan en la biblioteca; si esta se comparte entre varios menús o tiene alcance de un solo menú permanece pendiente en OPEN-003. Al configurar un `CompositionSlot`, se puede seleccionar una receta existente por ID y revisión o crear una receta desde ese flujo. Una receta nueva se guarda en `RecipeLibrary`; `RecipeSource` conserva el ID y la revisión de la definición asignada, que no se modifica desde la opción.

Cada línea `ComponentIngredient` referencia exactamente un `InventoryItem` e indica la cantidad física de ese ingrediente. Al seleccionar, consultar o editar la línea se muestra su unidad de medida autoritativa, suministrada por Inventario; la unidad de la cantidad debe ser compatible con la del artículo. Una receta requiere una cantidad de rendimiento y una unidad; editar una receta publicada crea una nueva revisión sin cambiar las referencias existentes. Las cantidades físicas de artículos e ingredientes son distintas de `CompositionSlot.quantity`, que expresa rondas de selección del grupo.

La definición vigente de una receta solo puede eliminarse cuando ninguna `SlotOption` de ninguna oferta vigente la referencia, incluso si la oferta o la opción está inactiva. Si existe una referencia, se rechaza la eliminación sin cambios. Las revisiones históricas publicadas se conservan y permanecen consultables.

`CompositionSnapshot` conserva de forma inmutable los slots publicados con su atributo `required` y los estados de sus opciones; el estado del slot se deriva de las opciones de esa revisión. Pertenece únicamente a `CatalogOfferRevision` y no representa una referencia a la oferta que pudo servir como origen durante la configuración.

Una oferta `INACTIVE` no se presenta como alternativa vigente. La entrada conserva su estado administrativo cuando cambia el estado de una oferta, aunque deje de publicarse al no tener una oferta `ACTIVE` válida. Archivar una entrada desde `ACTIVE` o `INACTIVE` la retira del flujo normal sin modificar los estados de sus ofertas; desarchivarla la deja en `INACTIVE`.
Catálogo administra las `RecipeDefinition` en `RecipeLibrary` y sus líneas `ComponentIngredient`. Una receta define nombre, descripción, instrucciones en texto y uno o más ingredientes seleccionados de Inventario, cada uno con su cantidad. Todas las recetas se almacenan en la biblioteca; si esta se comparte entre varios menús o tiene alcance de un solo menú permanece pendiente en OPEN-003. Al configurar un `CompositionSlot`, se puede seleccionar una receta existente por ID y revisión o crear una receta desde ese flujo. Una receta nueva se guarda en `RecipeLibrary`; `RecipeSource` conserva el ID y la revisión de la definición asignada, que no se modifica desde la opción.

Cada línea `ComponentIngredient` referencia exactamente un `InventoryItem` e indica la cantidad física de ese ingrediente. Al seleccionar, consultar o editar la línea se muestra su unidad de medida autoritativa, suministrada por Inventario; la unidad de la cantidad debe ser compatible con la del artículo. Una receta requiere una cantidad de rendimiento y una unidad; editar una receta publicada crea una nueva revisión sin cambiar las referencias existentes. Las cantidades físicas de artículos e ingredientes son distintas de `CompositionSlot.quantity`, que expresa rondas de selección del grupo.

La definición vigente de una receta solo puede eliminarse cuando ninguna `SlotOption` de ninguna oferta vigente la referencia, incluso si la oferta o la opción está inactiva. Si existe una referencia, se rechaza la eliminación sin cambios. Las revisiones históricas publicadas se conservan y permanecen consultables.

`CompositionSnapshot` conserva de forma inmutable los slots publicados con su atributo `required` y los estados de sus opciones; el estado del slot se deriva de las opciones de esa revisión. Pertenece únicamente a `CatalogOfferRevision` y no representa una referencia a la oferta que pudo servir como origen durante la configuración.

Una oferta `INACTIVE` no se presenta como alternativa vigente. La entrada conserva su estado administrativo cuando cambia el estado de una oferta, aunque deje de publicarse al no tener una oferta `ACTIVE` válida. Archivar una entrada desde `ACTIVE` o `INACTIVE` la retira del flujo normal sin modificar los estados de sus ofertas; desarchivarla la deja en `INACTIVE`.

Una `CatalogEntry` solo puede eliminarse cuando está `ARCHIVED`. Una `CatalogOffer` solo puede eliminarse individualmente cuando está `INACTIVE` y su eliminación no deja una entrada `ACTIVE` sin una oferta `ACTIVE` y válida. Usar otra oferta como origen de configuración no crea una referencia vigente entre ofertas ni añade una condición de eliminación. La operación se rechaza íntegramente cuando no se cumplen sus condiciones, sin modificar recursos dependientes ni crear revisiones. Las composiciones, grupos y opciones poseídos exclusivamente pueden eliminarse junto con su propietario. Las revisiones históricas publicadas y sus `CompositionSnapshot` permanecen inmutables y consultables por `offerId` y `revision` aunque se elimine la definición vigente.
Una `CatalogEntry` solo puede eliminarse cuando está `ARCHIVED`. Una `CatalogOffer` solo puede eliminarse individualmente cuando está `INACTIVE` y su eliminación no deja una entrada `ACTIVE` sin una oferta `ACTIVE` y válida. Usar otra oferta como origen de configuración no crea una referencia vigente entre ofertas ni añade una condición de eliminación. La operación se rechaza íntegramente cuando no se cumplen sus condiciones, sin modificar recursos dependientes ni crear revisiones. Las composiciones, grupos y opciones poseídos exclusivamente pueden eliminarse junto con su propietario. Las revisiones históricas publicadas y sus `CompositionSnapshot` permanecen inmutables y consultables por `offerId` y `revision` aunque se elimine la definición vigente.

### Precio declarado por Catálogo

`CatalogOffer.basePrice` es fijo para la oferta, independientemente de los grupos y opciones de su composición. Los grupos, sus opciones y la oferta seleccionada como origen de una copia no aportan cargos automáticos ni trasladan precios al precio base.
`CatalogOffer.basePrice` es fijo para la oferta, independientemente de los grupos y opciones de su composición. Los grupos, sus opciones y la oferta seleccionada como origen de una copia no aportan cargos automáticos ni trasladan precios al precio base.

El catálogo declara `basePrice`. La cantidad pedida, las opciones concretas resueltas en cada ronda según la cantidad de cada grupo y el cálculo del precio final pertenecen al modelo de órdenes.
El catálogo declara `basePrice`. La cantidad pedida, las opciones concretas resueltas en cada ronda según la cantidad de cada grupo y el cálculo del precio final pertenecen al modelo de órdenes.

## Ownership y límites de contexto

| Ámbito | Responsabilidad del dominio |
| :--- | :--- |
| Menú/Catálogo | Es propietario de `Menu`, `Category`, `CatalogEntry`, `CatalogOffer`, sus composiciones, grupos requeridos u opcionales, opciones y recetas; declara los precios base y publica solo entradas `ACTIVE` con alguna oferta `ACTIVE` válida. |
| Inventario | Es propietario de la identidad, unidad de medida y existencias de `InventoryItem`. Catálogo lo referencia como concepto externo en opciones y recetas. |
| Órdenes | Registra la cantidad pedida y la opción concreta elegida en cada ronda definida por la cantidad de cada grupo; determina el precio final de la orden según el modelo transaccional. |
| Menú/Catálogo | Es propietario de `Menu`, `Category`, `CatalogEntry`, `CatalogOffer`, sus composiciones, grupos requeridos u opcionales, opciones y recetas; declara los precios base y publica solo entradas `ACTIVE` con alguna oferta `ACTIVE` válida. |
| Inventario | Es propietario de la identidad, unidad de medida y existencias de `InventoryItem`. Catálogo lo referencia como concepto externo en opciones y recetas. |
| Órdenes | Registra la cantidad pedida y la opción concreta elegida en cada ronda definida por la cantidad de cada grupo; determina el precio final de la orden según el modelo transaccional. |

La validez estructural de una composición o receta corresponde a sus definiciones de catálogo. El stock de los artículos referenciados pertenece a Inventario y es independiente de esa validez.

```mermaid
flowchart LR
    subgraph Catalogo["Bounded context Menú/Catálogo"]
        Menu[Menu] --> Category[Category]
        Menu --> Entry[CatalogEntry]
        Entry -->|se publica con oferta elegible| Offer[CatalogOffer]
        Entry -->|se publica con oferta elegible| Offer[CatalogOffer]
        Offer -. "publica revisiones" .-> OfferRevision["CatalogOfferRevision<br/>offerId + revision"]
        OfferRevision --> CompositionSnapshot["CompositionSnapshot<br/>composición publicada inmutable"]
        Offer --> Composition[Composition]
        Composition -->|miembros estructurales| Slot["CompositionSlot<br/>required:boolean<br/>status derivado<br/>quantity del grupo"]
        Composition -.-> RequiredSlots["requiredSlots<br/>subconjunto required=true<br/>al menos uno"]
        Slot --> SlotOption["SlotOption<br/>variante ACTIVE o INACTIVE"]
        SlotOption --> Source["Un ComponentSource"]
        Composition -->|miembros estructurales| Slot["CompositionSlot<br/>required:boolean<br/>status derivado<br/>quantity del grupo"]
        Composition -.-> RequiredSlots["requiredSlots<br/>subconjunto required=true<br/>al menos uno"]
        Slot --> SlotOption["SlotOption<br/>variante ACTIVE o INACTIVE"]
        SlotOption --> Source["Un ComponentSource"]
        Source --> ItemSource[INVENTORY_ITEM]
        Source --> RecipeSource[RECIPE]
        RecipeLibrary[RecipeLibrary] --> RecipeDefinition[RecipeDefinition]
        RecipeSource -. "recipeId + revisión fijada" .-> RecipeDefinition
        RecipeDefinition --> Ingredient[ComponentIngredient]
        Source --> RecipeSource[RECIPE]
        RecipeLibrary[RecipeLibrary] --> RecipeDefinition[RecipeDefinition]
        RecipeSource -. "recipeId + revisión fijada" .-> RecipeDefinition
        RecipeDefinition --> Ingredient[ComponentIngredient]
    end

    subgraph Inventory["Inventario"]
        InventoryItem["InventoryItem<br/>identidad y existencias"]
    end

    subgraph Orders["Modelo de órdenes"]
        OrderSelection["Cantidad y opción elegida por ronda"]
        OrderSelection["Cantidad y opción elegida por ronda"]
        FinalPrice["Precio final de la orden"]
    end

    ItemSource -. "referencia de identidad" .-> InventoryItem
    Ingredient -. "referencia de identidad" .-> InventoryItem
    OrderSelection -. "resuelve required ACTIVE y optional ACTIVE seleccionados" .-> Composition

    subgraph Configuration["Operación durante la configuración"]
        SourceOffer["CatalogOffer origen"] --> Copy["Copiar required y estados de opciones<br/>como definiciones locales editables"]
        Copy --> Composition
    end
```

La conexión desde `CatalogOffer origen` representa una operación de configuración: al concluir la copia, la composición destino no mantiene una relación con esa oferta. El slot está `ACTIVE` si al menos una opción está `ACTIVE`; cuando ningún `requiredSlot` permanece `ACTIVE`, la oferta se inactiva y requiere una acción administrativa para reactivarse. La entrada conserva su estado administrativo y solo se publica si tiene una oferta `ACTIVE` válida. Las revisiones históricas y snapshots describen la oferta destino publicada, de forma independiente.
    OrderSelection -. "resuelve required ACTIVE y optional ACTIVE seleccionados" .-> Composition

    subgraph Configuration["Operación durante la configuración"]
        SourceOffer["CatalogOffer origen"] --> Copy["Copiar required y estados de opciones<br/>como definiciones locales editables"]
        Copy --> Composition
    end
```

La conexión desde `CatalogOffer origen` representa una operación de configuración: al concluir la copia, la composición destino no mantiene una relación con esa oferta. El slot está `ACTIVE` si al menos una opción está `ACTIVE`; cuando ningún `requiredSlot` permanece `ACTIVE`, la oferta se inactiva y requiere una acción administrativa para reactivarse. La entrada conserva su estado administrativo y solo se publica si tiene una oferta `ACTIVE` válida. Las revisiones históricas y snapshots describen la oferta destino publicada, de forma independiente.

## Lenguaje para describir una oferta

Una oferta se describe desde la identidad de la carta hasta las variantes que pueden ocupar cada grupo:
Una oferta se describe desde la identidad de la carta hasta las variantes que pueden ocupar cada grupo:

```mermaid
flowchart TD
    Offer["CatalogOffer<br/>estado, presentación y basePrice<br/>INACTIVE si cero requiredSlots ACTIVE"] --> Composition["Composition<br/>miembros estructurales"]
    Composition --> Slot["CompositionSlot<br/>required true/false<br/>ACTIVE iff alguna opción ACTIVE<br/>quantity de rondas al participar"]
    Composition -.-> RequiredSlots["requiredSlots<br/>subconjunto required=true<br/>al menos uno"]
    Slot --> SlotOption["SlotOption<br/>variante ACTIVE o INACTIVE"]
    SlotOption --> Source["Un origen de contenido"]
    TemplateOffer["Otra CatalogOffer<br/>origen de configuración"] -. "copia required y estados de opciones; no persiste referencia" .-> Composition
```

La composición conserva todos sus grupos; los requeridos `ACTIVE` participan, los opcionales `ACTIVE` pueden omitirse y los `INACTIVE` no generan rondas. Cada grupo participante establece su propia cantidad de rondas y ofrece sus opciones activas; en cada ronda se resuelve una opción, directamente cuando solo hay una activa o por elección cuando hay varias. Si ningún grupo requerido queda `ACTIVE`, la oferta se inactiva sin reactivación automática. La vista describe definiciones de catálogo; las elecciones concretas se registran en el modelo de órdenes.
    Offer["CatalogOffer<br/>estado, presentación y basePrice<br/>INACTIVE si cero requiredSlots ACTIVE"] --> Composition["Composition<br/>miembros estructurales"]
    Composition --> Slot["CompositionSlot<br/>required true/false<br/>ACTIVE iff alguna opción ACTIVE<br/>quantity de rondas al participar"]
    Composition -.-> RequiredSlots["requiredSlots<br/>subconjunto required=true<br/>al menos uno"]
    Slot --> SlotOption["SlotOption<br/>variante ACTIVE o INACTIVE"]
    SlotOption --> Source["Un origen de contenido"]
    TemplateOffer["Otra CatalogOffer<br/>origen de configuración"] -. "copia required y estados de opciones; no persiste referencia" .-> Composition
```

La composición conserva todos sus grupos; los requeridos `ACTIVE` participan, los opcionales `ACTIVE` pueden omitirse y los `INACTIVE` no generan rondas. Cada grupo participante establece su propia cantidad de rondas y ofrece sus opciones activas; en cada ronda se resuelve una opción, directamente cuando solo hay una activa o por elección cuando hay varias. Si ningún grupo requerido queda `ACTIVE`, la oferta se inactiva sin reactivación automática. La vista describe definiciones de catálogo; las elecciones concretas se registran en el modelo de órdenes.

## Glosario del dominio

- **`Menu`:** ámbito propietario de las categorías y entradas comerciales.
- **`Category`:** clasificación reutilizable del menú que puede relacionarse con varias entradas.
- **`CatalogEntry`:** identidad comercial de un producto de la carta; conserva `brandName`, categorías, estado administrativo y agrupa sus ofertas. Se publica solo si está `ACTIVE` y tiene al menos una oferta `ACTIVE` válida; si no, permanece `ACTIVE` pero oculta.
- **`CatalogOffer`:** oferta concreta de una entrada, seleccionable y vendible individualmente; tiene estado `ACTIVE` o `INACTIVE`, `presentationTag` opcional, `basePrice` y exactamente una composición; solo se publica bajo una entrada `ACTIVE`, y se inactiva si ningún `requiredSlot` está `ACTIVE`.
- **`CatalogEntry`:** identidad comercial de un producto de la carta; conserva `brandName`, categorías, estado administrativo y agrupa sus ofertas. Se publica solo si está `ACTIVE` y tiene al menos una oferta `ACTIVE` válida; si no, permanece `ACTIVE` pero oculta.
- **`CatalogOffer`:** oferta concreta de una entrada, seleccionable y vendible individualmente; tiene estado `ACTIVE` o `INACTIVE`, `presentationTag` opcional, `basePrice` y exactamente una composición; solo se publica bajo una entrada `ACTIVE`, y se inactiva si ningún `requiredSlot` está `ACTIVE`.
- **`CatalogOfferRevision`:** revisión publicada e inmutable de una oferta, consultable por `offerId` y `revision` aunque ya no exista la definición vigente.
- **`Composition`:** estructura de una oferta que conserva todos sus grupos requeridos y opcionales y las variantes de cada grupo; contiene al menos un grupo requerido.
- **`CompositionSnapshot`:** composición publicada e inmutable que pertenece únicamente a una `CatalogOfferRevision` histórica de la oferta.
- **`CompositionSlot`:** grupo requerido u opcional de una composición. `required: boolean` distingue ambos; su estado es `ACTIVE` si tiene al menos una opción `ACTIVE`, e `INACTIVE` si no. Los requeridos `ACTIVE` participan, los opcionales `ACTIVE` pueden omitirse y los `INACTIVE` no generan rondas. `quantity` es la cantidad de rondas del grupo participante.
- **`SlotOption`:** aparición contextual que representa una variante dentro de un grupo y contiene un origen único. Las opciones inactivas no se ofrecen; el estado del grupo depende de si hay al menos una opción activa.
- **`ComponentSource`:** tipo conceptual que identifica el origen único de una opción: `INVENTORY_ITEM` o `RECIPE`.
- **`InventoryItemSource`:** contenido que referencia un artículo externo de Inventario con su cantidad física y unidad.
- **`RecipeSource`:** referencia desde una `SlotOption` a una receta de `RecipeLibrary` mediante `recipeId` y una revisión fijada. Al configurar una opción `RECIPE`, se puede elegir una receta de la biblioteca o definir una nueva, que se guarda en la biblioteca y queda referenciada por ID y revisión.
- **`InventoryItem`:** artículo cuya identidad, unidad de medida y existencias pertenecen a Inventario.
- **`RecipeLibrary`:** biblioteca administrada por Catálogo que almacena las definiciones de receta; su alcance entre menús permanece pendiente en OPEN-003.
- **`RecipeDefinition`:** receta con nombre, descripción, instrucciones en texto, revisión, rendimiento y una o más líneas de ingredientes de Inventario.
- **`ComponentIngredient`:** línea de receta que referencia un `InventoryItem`, conserva la cantidad indicada y muestra la unidad autoritativa de Inventario.
