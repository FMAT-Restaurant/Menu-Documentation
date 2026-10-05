# Arquitectura de Dominio del Servicio Menu

## Modelo de Dominio

El modelo de Menú/Catálogo describe categorías, entradas comerciales, ofertas, composiciones, slots, opciones de contenido y recetas. Menu contiene categorías y entradas; Category clasifica CatalogEntry; y CatalogEntry administra el nombre comercial y sus categorías, y contiene sus CatalogOffer. Cada CatalogOffer concreta es seleccionable y vendible de forma individual. Una entrada se publica solo mientras está administrativamente ACTIVE y tiene al menos una oferta ACTIVE válida; si no tiene una, conserva su estado ACTIVE pero queda oculta. La inactivación automática de una oferta no cambia el estado administrativo de su entrada.

Toda oferta vendible posee una Composition con uno o más CompositionSlot; la composición es el conjunto de slots y todos son miembros estructurales. El estado del slot se deriva de sus opciones: es ACTIVE si al menos una SlotOption está ACTIVE e INACTIVE si ninguna lo está. Todos los slots ACTIVE participan; un slot INACTIVE no se selecciona ni genera rondas. `CompositionSlot.quantity` determina las rondas de cada slot ACTIVE. Si ningún slot está ACTIVE, CatalogOffer pasa automáticamente a INACTIVE. Cuando vuelve a haber un slot ACTIVE, la oferta se reactiva automáticamente si su estado INACTIVE se debía a la ausencia de slots activos y seguía habilitada administrativamente. Una inactivación administrativa explícita permanece hasta una nueva activación administrativa. El modelo distingue la habilitación administrativa del estado efectivo de la oferta sin prescribir cómo se representa. En cada ronda se elige exactamente una opción ACTIVE; cuando hay una sola opción ACTIVE, se selecciona automáticamente.

Una oferta del catálogo puede usarse como plantilla durante la configuración de otra oferta. Sus slots y opciones se copian a la composición destino como definiciones locales editables, conservando los estados de las opciones; el estado de cada slot se deriva de las opciones copiadas. La copia conserva los orígenes de Inventario y las referencias a recetas y sus revisiones, pero no conserva la identidad, el precio ni una referencia persistente a la oferta plantilla; los cambios posteriores no se sincronizan.

RecipeLibrary reúne las RecipeDefinition vigentes y sus revisiones históricas publicadas. Cada receta contiene instrucciones textuales y líneas ComponentIngredient que refieren a InventoryItem; Inventario conserva la identidad, la unidad de medida y el stock de esos artículos. RecipeSource fija el ID y la revisión de la receta asignada a una SlotOption.

## Agregados y Límites de Consistencia

Las relaciones siguientes expresan propiedad y composición conceptual del modelo. No prescriben agregados transaccionales, persistencia ni claves físicas.

### Menú y catálogo comercial

Menu contiene categorías y entradas comerciales. Category clasifica cero o más CatalogEntry y una entrada puede clasificarse en varias categorías del mismo menú. CatalogEntry es la identidad comercial con nombre autoritativo, descripción, estado, imagen y sus CatalogOffer, cada una vendible y seleccionable individualmente. Una entrada puede administrarse incompleta o inactiva; si está ACTIVE sin una CatalogOffer ACTIVE y válida permanece ACTIVE pero no se publica. Archivar una entrada puede hacerse desde ACTIVE o INACTIVE; desarchivarla siempre la deja INACTIVE. La inactivación de una oferta no modifica el estado administrativo de la entrada.

### Oferta y composición

CatalogEntry contiene CatalogOffer; cada oferta concreta puede seleccionarse individualmente. Una CatalogEntry solo se publica mientras está ACTIVE y tiene al menos una CatalogOffer ACTIVE y válida, pero su estado administrativo no depende de sus ofertas. Una oferta solo puede publicarse mientras su entrada esté ACTIVE y su Composition sea válida. CatalogOffer posee exactamente una Composition y su basePrice describe el precio fijo de esa oferta. Su nombre visible combina el nombre comercial de la entrada con la presentación opcional; presentationTag es descriptiva y no determina cantidades físicas.

Composition es el conjunto de uno o más CompositionSlot y todos permanecen como miembros estructurales de la oferta. Cada slot contiene una o más SlotOption, opciones de contenido que poseen un origen único. Todos los slots ACTIVE participan; los INACTIVE no se seleccionan ni generan rondas. Si ningún slot queda ACTIVE, CatalogOffer pasa automáticamente a INACTIVE; cuando vuelve a haber un slot ACTIVE, la oferta se reactiva automáticamente si su inactividad se originó por esa ausencia y seguía habilitada administrativamente. Una inactivación administrativa explícita permanece hasta una nueva activación administrativa. Usar una oferta como plantilla copia los slots y los estados de sus opciones a otra composición sin conservar relación con la oferta de origen. La habilitación administrativa se distingue del estado efectivo de CatalogOffer sin prescribir su representación.

RecipeLibrary contiene las definiciones vigentes y revisiones históricas de receta. Cada RecipeSource referencia una receta publicada por ID y revisión. CompositionSnapshot pertenece exclusivamente a CatalogOfferRevision y conserva una definición histórica. InventoryItem, su unidad de medida y su stock siguen bajo Inventario.

Una receta vigente solo puede eliminarse cuando ninguna SlotOption de ninguna oferta vigente la referencia, incluso si la oferta o la opción está inactiva. Si existe una referencia, se rechaza la eliminación sin cambios; las revisiones históricas publicadas permanecen consultables.

Una CatalogEntry solo puede eliminarse desde ARCHIVED. Una CatalogOffer solo puede eliminarse individualmente desde INACTIVE si su eliminación no deja una CatalogEntry ACTIVE sin una oferta ACTIVE y válida. No hay referencias vigentes de una oferta a otra que restrinjan estas eliminaciones. Al eliminar una entrada, las ofertas y estructuras vigentes poseídas se retiran con ella. En ambas rutas, las revisiones históricas publicadas permanecen inmutables y consultables mediante offerId y revision.

## Entidades y Atributos Principales

La siguiente tabla resume los 16 conceptos del modelo, sus responsabilidades, atributos y relaciones. CatalogEntry declara ACTIVE, INACTIVE o ARCHIVED; CatalogOffer, CompositionSlot, SlotOption y RecipeDefinition declaran ACTIVE o INACTIVE. El estado de CompositionSlot es derivado de las opciones. Los identificadores son conceptuales: no prescriben claves de base de datos ni un esquema de almacenamiento.

| Entidad o concepto | Responsabilidad | Atributos y relaciones principales |
| :--- | :--- | :--- |
| Menu | Propietario del conjunto de categorías y entradas comerciales. | id, name, currency; contiene Category y CatalogEntry. |
| Category | Categoría reutilizable que clasifica entradas. | id, menuId, name, description; pertenece a Menu y clasifica cero o más CatalogEntry. |
| CatalogEntry | Identidad comercial que contiene las ofertas de un producto de la carta. | id, menuId, brandName, description, imageRef, status, categoryIds[]; pertenece a Menu, contiene CatalogOffer y usa categorías del mismo menú. Se publica solo si está ACTIVE y tiene al menos una oferta ACTIVE válida; si no, permanece ACTIVE pero oculta. La oferta no cambia el estado administrativo de la entrada. |
| CatalogOffer | Oferta concreta, individualmente vendible y seleccionable, con precio base y composición propia. | id, entryId, presentationTag?, basePrice, status efectivo (ACTIVE/INACTIVE), offerImageRef; pertenece a CatalogEntry y contiene exactamente una Composition. Pasa a INACTIVE si ningún CompositionSlot está ACTIVE; al volver a haber un slot ACTIVE, se reactiva automáticamente si la inactivación fue causada por la ausencia de slots activos y la oferta seguía habilitada administrativamente. Una inactivación administrativa explícita permanece hasta una nueva activación administrativa. La eliminación individual requiere INACTIVE y no invalidar una entrada ACTIVE; las revisiones publicadas se conservan como historia consultable. |
| CatalogOfferRevision | Instantánea inmutable de una revisión publicada de oferta. | entryId, offerId, revision, brandNameSnapshot, basePrice, offerImageRef, compositionSnapshot; conserva la composición histórica consultable aunque se elimine la oferta vigente. |
| Composition | Conjunto de slots que define el contenido configurable de una oferta. | id, offerId, slots[]; pertenece a CatalogOffer, contiene uno o más CompositionSlot y conserva todos como miembros estructurales. |
| CompositionSnapshot | Copia histórica completa de la composición de una revisión publicada. | slots[]; pertenece exclusivamente a CatalogOfferRevision y conserva los slots y estados de opciones de esa revisión. |
| CompositionSlot | Slot de una composición que determina sus rondas. | id, compositionId, name, status (ACTIVE/INACTIVE, derivado), quantity, course? (entrada, plato fuerte, postre o bebida), options[]; el curso es una sugerencia de tiempo de servicio; pertenece a Composition y contiene una o más SlotOption. Todo slot ACTIVE participa; uno INACTIVE no genera rondas. |
| SlotOption | Opción de contenido dentro de un slot. | id, slotId, displayName, status, source; pertenece a CompositionSlot y posee un ComponentSource. Un slot es ACTIVE si al menos una opción está ACTIVE. |
| ComponentSource | Tipo conceptual del origen único de una opción. | type: INVENTORY_ITEM o RECIPE; especialización exclusiva en InventoryItemSource o RecipeSource. |
| InventoryItemSource | Referencia directa a un artículo externo de Inventario. | inventoryItemId, quantity, unit, displayNameSnapshot?; referencia exactamente un InventoryItem. |
| RecipeSource | Referencia a una receta de RecipeLibrary desde una SlotOption. | recipeId, recipeRevision; fija una RecipeDefinition publicada. |
| InventoryItem | Artículo o ingrediente cuya identidad, unidad de medida y stock son de Inventario. | id, name, baseUnit; concepto externo referenciado por InventoryItemSource y ComponentIngredient. |
| RecipeLibrary | Colección de recetas administradas por Catálogo. | id, name, recipes[]; contiene definiciones vigentes e historial de revisiones publicadas. |
| RecipeDefinition | Receta versionada con datos textuales, rendimiento y líneas de ingredientes. | id, name, description, instructions (texto), revision, yieldQuantity, yieldUnit, ingredients[], status; pertenece a RecipeLibrary. |
| ComponentIngredient | Ingrediente de Inventario incluido en una receta. | id, recipeId, inventoryItemId, quantity, unit; referencia exactamente un InventoryItem. La unidad de Inventario se muestra al seleccionar, consultar o editar. |

### Selección de composición y contenido

Todos los slots pertenecen estructuralmente a la composición; cada slot ACTIVE participa en la selección:

- Una Composition es el conjunto de uno o más CompositionSlot.
- Cada CompositionSlot contiene una o más SlotOption. Su estado derivado es ACTIVE si al menos una opción está ACTIVE, e INACTIVE si ninguna lo está.
- Todos los slots ACTIVE participan; un slot INACTIVE no puede seleccionarse ni genera rondas.
- CompositionSlot.quantity determina cuántas rondas tiene cada slot ACTIVE; la cantidad pertenece al slot, no a cada opción. En cada ronda se elige exactamente una de sus opciones ACTIVE. Por ejemplo, un slot de acompañamientos con quantity 3 tiene tres rondas, eligiendo en cada una entre papas, aros de cebolla o nuggets ACTIVE.
- Si un slot ACTIVE tiene una sola opción ACTIVE, se selecciona automáticamente en cada ronda. Si tiene varias opciones ACTIVE, no se configura una opción predeterminada en el catálogo.
- Si ningún slot está ACTIVE, CatalogOffer pasa automáticamente a INACTIVE. Cuando vuelve a haber un slot ACTIVE, la oferta se reactiva automáticamente si quedó INACTIVE por la ausencia de slots activos y seguía habilitada administrativamente. Una inactivación administrativa explícita permanece hasta una nueva activación administrativa; el modelo distingue esta habilitación del estado efectivo sin prescribir cómo se representa.
- La cantidad de InventoryItemSource expresa la cantidad y unidad física del artículo; no sustituye las rondas definidas por CompositionSlot.quantity.
- course es opcional; cuando se informa, acepta exactamente entrada, plato fuerte, postre o bebida y sugiere un tiempo de servicio.
- Una SlotOption INACTIVE no se presenta como opción para una nueva selección.

### Recetas y precios

Inventory posee la identidad, unidad de medida y stock de InventoryItem. Catálogo administra RecipeLibrary, las definiciones de receta y las cantidades de sus ComponentIngredient. Cada receta se crea con nombre, descripción, instrucciones en texto y una o más líneas de ingredientes seleccionados de Inventario. Cada línea contiene una referencia a InventoryItem y una cantidad; la unidad administrada por Inventario se muestra al seleccionar, consultar o editar el ingrediente. Su precisión, rangos y conversiones se remiten a OPEN-006.

Una SlotOption de tipo RECIPE se configura seleccionando una receta existente de RecipeLibrary por ID y revisión o definiendo una nueva desde el flujo de configuración. La nueva definición se guarda en RecipeLibrary y RecipeSource conserva su ID y revisión. La opción no modifica la receta asignada. Editar una receta publicada crea una revisión nueva; sus referencias previas permanecen fijadas a la revisión anterior.

La definición vigente de una receta solo puede eliminarse cuando ninguna SlotOption de ninguna oferta vigente la referencia, aunque la oferta o la opción esté inactiva. Si hay una referencia, se rechaza la operación sin cambios; se conservan las revisiones históricas publicadas. INVENTORY_ITEM referencia directamente un artículo externo.

CatalogOffer.basePrice es fijo para la oferta, independientemente de los slots y contenidos elegidos. Ni CompositionSlot, SlotOption ni las definiciones copiadas de otra oferta aportan cargos automáticos a ese precio. El modelo no calcula el precio final de una orden.

### Diagramas Estructurales y de Comportamiento

#### Vista conceptual del catálogo (para Front)

Cada opción tiene un único origen de contenido: un artículo de Inventario o una receta de la biblioteca. La vista conceptual resume cómo se organiza el catálogo:

```mermaid
flowchart TB
    Menu["Menú / catálogo"] -->|contiene| Entries["Entradas comerciales"]
    Categories["Categorías"] -->|clasifican| Entries
    Entries -->|publicables si ACTIVE y tienen oferta elegible| Offers["Presentaciones"]
    Offers -->|declara| BasePrice["Precio base"]
    Offers -->|contiene| Composition["Composición"]
    Composition -->|conjunto de slots| Slots["CompositionSlot"]
    Slots -->|status derivado| Options["SlotOption ACTIVE o INACTIVE"]
    Options -->|toma contenido directamente de| InventoryItem["Artículo de Inventario"]
    Options -->|puede usar| Recipe["Receta de la biblioteca"]
    Recipe -->|se compone de| Ingredients["Ingredientes de Inventario"]
```

Inventario conserva la identidad de los artículos, sus unidades y existencias. Menú/Catálogo administra las ofertas comerciales y la biblioteca de recetas; cada opción de tipo RECIPE referencia la receta seleccionada por ID y revisión. Todos los slots ACTIVE participan en la selección; los INACTIVE no generan rondas. Menú declara el precio base de cada presentación; no calcula el precio final de la orden.

#### Vista técnica: diagrama de clases del dominio comercial (para Back)

La vista técnica detalla el mismo modelo comercial representado en la vista conceptual. La composición representa pertenencia conceptual; las asociaciones y dependencias representan referencias y no prescriben claves foráneas.

```mermaid
classDiagram
    direction TB
    class Menu {
        +id
        +name
        +currency
    }
    class Category {
        +id
        +name
        +description
    }
    class CatalogEntry {
        +id
        +brandName
        +status
    }
    class CatalogOffer {
        +id
        +presentationTag?
        +basePrice
        +status
    }
    class CatalogOfferRevision {
        +entryId
        +offerId
        +revision
        +brandNameSnapshot
        +basePrice
    }
    class Composition {
        +offerId
        +slots[]
    }
    class CompositionSnapshot {
        +slots[]
    }
    class CompositionSlot {
        +status (derived)
        +name
        +quantity
        +course?
    }
    class SlotOption {
        +displayName
        +status
    }
    class ComponentSource {
        <<abstract>>
        +type
    }
    class InventoryItemSource {
        +inventoryItemId
        +quantity
        +unit
    }
    class RecipeSource {
        +recipeId
        +recipeRevision
    }
    class InventoryItem {
        <<external>>
        +id
        +name
        +baseUnit
    }
    class RecipeLibrary {
        +id
        +name
    }
    class RecipeDefinition {
        +id
        +name
        +description
        +instructions
        +revision
        +yieldQuantity
        +yieldUnit
    }
    class ComponentIngredient {
        +inventoryItemId
        +quantity
        +unit
    }
    Menu "1" *-- "0..*" Category : categorías
    Menu "1" *-- "0..*" CatalogEntry : entradas
    Category "0..*" -- "0..*" CatalogEntry : clasifica
    CatalogEntry "1" *-- "0..*" CatalogOffer : ofertas
    CatalogOffer "1" *-- "1" Composition : define
    CatalogOfferRevision "1" *-- "1" CompositionSnapshot : definición histórica
    Composition "1" *-- "1..*" CompositionSlot : miembros estructurales
    CompositionSnapshot "1" *-- "1..*" CompositionSlot : slots históricos
    CompositionSlot "1" *-- "1..*" SlotOption : opciones
    SlotOption "1" *-- "1" ComponentSource : origen único
    ComponentSource <|-- InventoryItemSource
    ComponentSource <|-- RecipeSource
    InventoryItemSource "0..*" --> "1" InventoryItem : referencia externa
    RecipeLibrary "1" *-- "0..*" RecipeDefinition : definiciones e historial
    RecipeSource "0..*" --> "1" RecipeDefinition : receta y revisión fijada
    RecipeDefinition "1" *-- "1..*" ComponentIngredient : líneas
    ComponentIngredient "0..*" --> "1" InventoryItem : ingrediente
```

Todas las RecipeDefinition vigentes pertenecen a RecipeLibrary y sus revisiones publicadas conservan su historial. CompositionSnapshot pertenece únicamente a CatalogOfferRevision y conserva inmutables los slots y el estado de sus opciones; el estado de cada slot se deriva de ellas. Cada ComponentIngredient referencia exactamente un InventoryItem, conserva su cantidad y muestra la unidad que administra Inventario. RecipeSource fija ID y revisión.
#### Estados comerciales

CatalogEntry declara status ACTIVE, INACTIVE o ARCHIVED. El archivado es reversible: una entrada puede archivarse desde ACTIVE o INACTIVE y al desarchivarse queda INACTIVE. Su estado administrativo es independiente: permanece ACTIVE aunque quede sin ofertas elegibles, pero no se publica hasta tener una oferta ACTIVE válida. CatalogOffer tiene un estado efectivo ACTIVE o INACTIVE y una habilitación administrativa distinguible de ese estado efectivo. SlotOption también declara ACTIVE o INACTIVE, mientras que el estado de CompositionSlot se deriva: ACTIVE si al menos una SlotOption está ACTIVE e INACTIVE si ninguna lo está. Si ningún slot está ACTIVE, CatalogOffer pasa automáticamente a INACTIVE sin cambiar su habilitación administrativa. Cuando vuelve a haber un slot ACTIVE, la oferta se reactiva automáticamente si quedó INACTIVE por la ausencia de slots activos y seguía habilitada administrativamente. Si hubo una inactivación administrativa explícita, permanece INACTIVE hasta una nueva activación administrativa. Una oferta solo se publica bajo una entrada ACTIVE y con composición válida. course es opcional y, cuando se informa, acepta exactamente entrada, plato fuerte, postre o bebida como sugerencia de tiempo de servicio; no es un estado de marcha.

Una CatalogEntry solo puede eliminarse desde ARCHIVED. Una CatalogOffer solo puede eliminarse individualmente desde INACTIVE si su eliminación no deja una CatalogEntry ACTIVE sin una oferta ACTIVE y válida. Las ofertas no mantienen referencias vigentes entre sí. Si una condición falla, la operación se rechaza íntegramente. Cuando procede, se retiran la definición vigente y sus estructuras poseídas. CatalogOfferRevision y su CompositionSnapshot permanecen inmutables y consultables por offerId y revision.

```mermaid
flowchart TB
    Start["Solicitud de eliminación"] --> Kind{"¿Qué definición se elimina?"}

    Kind -->|CatalogEntry| EntryState{"¿CatalogEntry ARCHIVED?"}
    EntryState -->|No| RejectEntry["Rechazar sin cambios"]
    EntryState -->|Sí| DeleteEntry["Eliminar CatalogEntry,<br/>ofertas vigentes y estructuras poseídas"]
    DeleteEntry --> EntryHistory["Conservar CatalogOfferRevision<br/>y CompositionSnapshot históricos"]

    Kind -->|CatalogOffer| OfferState{"¿CatalogOffer INACTIVE?"}
    OfferState -->|No| RejectOffer["Rechazar sin cambios"]
    OfferState -->|Sí| OfferConstraints{"¿Su eliminación invalidaría<br/>una CatalogEntry ACTIVE?"}
    OfferConstraints -->|Sí| RejectOffer
    OfferConstraints -->|No| DeleteOffer["Eliminar CatalogOffer<br/>y estructuras poseídas"]
    DeleteOffer --> OfferHistory["Conservar CatalogOfferRevision<br/>y CompositionSnapshot históricos"]
```

#### Selección de una oferta y copia de una composición

El diagrama separa la pertenencia estructural de la participación en la selección. No define una interfaz ni el contrato de una orden.

```mermaid
flowchart TB
    Offer["CatalogOffer"] --> Composition["Composition"]
    Composition --> AllSlots["Conservar todos los CompositionSlot<br/>como miembros estructurales"]
    AllSlots --> SlotStatus{"¿Hay alguna SlotOption ACTIVE?"}
    SlotStatus -->|No| InactiveSlot["CompositionSlot INACTIVE<br/>sin selección ni rondas"]
    SlotStatus -->|Sí| Rounds["CompositionSlot.quantity<br/>determina las rondas"]
    Rounds --> Count{"¿Cuántas opciones ACTIVE tiene?"}
    Count -->|Una| Default["Usar la única opción ACTIVE<br/>en cada ronda"]
    Count -->|Varias| Choice["En cada ronda,<br/>elegir exactamente una opción ACTIVE"]
    Composition --> ActiveSlots{"¿Hay algún CompositionSlot ACTIVE?"}
    ActiveSlots -->|No| DeactivateOffer["CatalogOffer pasa a INACTIVE<br/>sin cambiar habilitación administrativa"]
    ActiveSlots -->|Sí, recuperado tras INACTIVE automático| AdminEnabled{"¿Sigue habilitada administrativamente?"}
    AdminEnabled -->|Sí| ReactivateOffer["CatalogOffer vuelve automáticamente a ACTIVE"]
    AdminEnabled -->|No, inactivación administrativa explícita| KeepInactive["Permanece INACTIVE<br/>hasta activación administrativa"]

    Template["CatalogOffer usada como plantilla"] --> Copy["Copiar slots y estados de opciones"]
    Copy --> Destination["Agregar definiciones editables<br/>a la Composition destino"]
    Destination --> Independent["Sin referencia persistente,<br/>precio ni sincronización de la plantilla"]
```

La configuración de una oferta concluye al definir su Composition, sus slots y las opciones de contenido. La cantidad pedida y la resolución concreta de elecciones corresponden al modelo de una orden.

## Arquitectura y Límites del Sistema

### Diagrama de Contexto de Bounded Contexts

El límite de Menú/Catálogo contiene las definiciones comerciales y culinarias descritas aquí. Inventario mantiene la identidad de sus artículos y el stock; el catálogo conserva referencias externas a InventoryItem.

```mermaid
flowchart LR
    Catalog["Bounded Context: Menú/Catálogo<br/>Catálogo comercial y recetas"] -.->|referencias externas a InventoryItem| Inventory["Bounded Context: Inventario<br/>identidad y stock de InventoryItem"]
```

La relación expresa que Catálogo referencia identidades cuyo origen y stock pertenecen a Inventario.

### Patrones de Interacción y Comunicación

El modelo establece datos de catálogo y reglas para describir ofertas, composición y recetas. La cantidad pedida, las elecciones concretas de una orden, asientos, tiempos operacionales de marcha, disponibilidad en tiempo real, facturación y cálculo del precio final pertenecen a otros modelos. El documento no selecciona patrones de lectura/escritura, mecanismos de comunicación, APIs, eventos ni tecnologías de transporte.

### Aislamiento Lógico y Reglas de Integración

1. Menu es propietario de sus Category y CatalogEntry. CatalogEntry contiene CatalogOffer; CatalogOffer posee Composition; cada composición es el conjunto de sus CompositionSlot y estos contienen sus opciones SlotOption.
2. Catálogo administra RecipeLibrary, define sus recetas con datos textuales y cantidades de ingredientes, y asigna una receta a SlotOption mediante ID y revisión.
3. Inventario posee la identidad, unidad de medida y stock de InventoryItem. Catálogo referencia InventoryItem mediante identidades explícitas; igualdad numérica entre identificadores de contextos diferentes no establece identidad compartida.
4. La validez estructural de una receta no depende de existencias de Inventario. Catálogo no administra el stock externo.
5. CatalogOffer.basePrice es un dato declarado por el catálogo. El dominio no calcula precios finales de pedidos ni suma cargos por slots, opciones o definiciones copiadas.
6. Las recetas publicadas se identifican por revisión; editarlas no cambia referencias existentes. La definición vigente solo se elimina si ninguna SlotOption de una oferta vigente la referencia, y las revisiones históricas permanecen inmutables y consultables.
7. La eliminación de una CatalogEntry archivada y la eliminación individual de una CatalogOffer inactiva siguen las condiciones de estado y validez de la entrada descritas arriba. Las ofertas no se referencian entre sí; CatalogOfferRevision y CompositionSnapshot históricos permanecen inmutables y consultables.
8. Las relaciones descritas son conceptuales. No prescriben tablas, claves foráneas, APIs, eventos, motor de resolución ni arquitectura de persistencia.
