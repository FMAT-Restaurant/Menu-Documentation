## Modelo general

El servicio de menú termina diferenciando tres tipos conceptuales de entrada:

```text
MenuEntry
├── PreparedItem
├── StockedItem
└── Combo
```

`PreparedItem` y `StockedItem` son **productos hoja**: representan productos que pueden venderse directamente.

`Combo` es distinto: representa una **composición comercial de otros productos vendibles** mediante slots y opciones.

Aunque en implementación pueda seguir existiendo una entidad común `MenuItem` con un discriminador:

```text
type = PREPARED | STOCKED | COMBO
```

no debe asumirse que los tres tipos comparten exactamente la misma estructura o comportamiento.

---

## Variantes

Prepared y Stocked sí comparten el concepto de variante.

Una variante representa una **presentación vendible concreta** del mismo producto, no otro `MenuItem`.

Ejemplo:

```text
Pizza Italiana
├── Individual
├── Pareja
└── Familiar
```

sigue siendo un solo producto.

Lo mismo:

```text
Coca-Cola
├── 355 ml
├── 600 ml
└── 1 L
```

Las variantes no “se convierten” en Items independientes.

### Default Variant

Se mantiene el patrón **Default Variant**:

```text
todo PreparedItem / StockedItem
tiene 1..N variantes
```

Si comercialmente no existen variantes:

```text
Hamburguesa clásica
└── DEFAULT
```

La variante `DEFAULT` es técnica y normalmente no se muestra en UI.

Esto evita:

```text
variantId == null
```

en Orders.

Una variante técnica `DEFAULT` no debe confundirse con una variante real preseleccionada.

Por ejemplo:

```text
Pizza Italiana
├── Individual
├── Pareja
└── Familiar
```

puede tener opcionalmente:

```text
defaultVariantId = Individual
```

pero sólo como preferencia de UX.

---

## Cuándo usar variante y cuándo Item separado

La regla conceptual es:

> Si el restaurante entiende que sigue siendo el mismo producto pero en otra presentación, es una variante.

Ejemplos claros:

```text
Pizza Italiana
→ Individual / Pareja / Familiar
```

```text
Coca-Cola
→ 355 ml / 600 ml / 1 L
```

Si se administran comercialmente como productos distintos, pueden ser Items independientes.

Lo que debe evitarse es representar la misma oferta simultáneamente de ambas formas:

```text
Coca-Cola
└── 600 ml
```

y además:

```text
Coca-Cola 600 ml
└── DEFAULT
```

para representar exactamente lo mismo.

---

# Dimensiones de variante

Se mantiene el concepto anteriormente llamado `VariantDimension`.

Por ejemplo:

```text
Dimensión: Tamaño
Valores:
- Individual
- Pareja
- Familiar
```

Una variante selecciona valores de esas dimensiones:

```text
Pizza Italiana Familiar
→ Tamaño = Familiar
```

Conviene utilizar consistentemente nombres como:

```text
VariantDimension
VariantValue
```

o en documentación:

```text
Dimensión de variante
Valor de variante
```

en lugar de nombres ambiguos como “característica de presentación”.

---

# Precio

El precio autoritativo pertenece a la variante:

```text
MenuItemVariant.unitPrice
```

y es absoluto.

Ejemplo:

```text
Pizza Italiana

Individual = $140
Pareja     = $210
Familiar   = $290
```

No se utilizaría:

```text
basePrice = 140
Pareja     = +70
Familiar   = +150
```

`MenuItem.basePrice` deja de ser fuente de verdad.

### Precio mostrado en catálogo

Es una proyección:

```text
una única variante
→ "$140"

varias variantes con el mismo precio
→ "$140"

varias variantes con precios diferentes
→ "Desde $140"
```

No se necesita seleccionar una variante default para calcularlo.

---

# Prepared

Un `PreparedItem` es un producto elaborado mediante receta.

Cada variante vendible resuelve su preparación:

```text
PreparedItem
└── MenuItemVariant
    └── recipeRevisionId
```

Por ejemplo:

```text
Pizza Italiana
├── Individual → Recipe revision A
├── Pareja     → Recipe revision B
└── Familiar   → Recipe revision C
```

Que las recetas sean distintas no convierte esas variantes en productos diferentes.

---

# Recipe

Se mantiene `Recipe` como concepto separado del `MenuItemVariant`.

No metería directamente:

```text
Variant.ingredients[]
```

como fuente principal.

La principal razón no es la reutilización, sino separar:

```text
identidad comercial / presentación
```

de:

```text
definición culinaria
```

y permitir versionado de receta.

Una variante referencia una **revisión concreta de receta**.

La reutilización de una misma receta entre variantes o Items es permitida si tiene sentido, pero no es el objetivo central ni algo que deba forzarse.

No se introduce `scaleFactor` automáticamente porque los ingredientes de tamaños distintos no necesariamente escalan proporcionalmente.

---

# Stocked

Un `StockedItem` representa un producto terminado que se abastece directamente desde Inventory.

Cada variante resuelve a un artículo concreto:

```text
StockedItem
└── MenuItemVariant
    ├── inventoryItemId
    └── quantity
```

Ejemplo:

```text
Coca-Cola

355 ml
→ COCA-355

600 ml
→ COCA-600

1 L
→ COCA-1L
```

Prepared y Stocked comparten el concepto de variante, pero difieren en cómo se satisface esa variante:

```text
Prepared
→ Recipe

Stocked
→ InventoryItem
```

---

# Modificadores

La decisión final cambió respecto a una versión intermedia.

Los modifiers **pertenecen al Item**, no a cada variante.

```text
MenuItem
└── ModifierGroup
    └── ModifierOption
```

Ejemplo:

```text
Pizza Italiana
└── Extras
    ├── Extra queso
    ├── Extra pepperoni
    └── Sin cebolla
```

No queremos:

```text
Extra queso Individual
Extra queso Pareja
Extra queso Familiar
```

como tres modifiers conceptualmente distintos.

---

## Configuración general + especialización por variante

Cada `ModifierOption` posee una configuración general:

```text
ModifierOption
└── generalConfig
    ├── priceDelta
    ├── maxQuantity
    └── ingredientEffects[]
```

Ejemplo:

```text
Extra queso

generalConfig:
priceDelta = +$25
maxQuantity = 2
ADD queso 40 g
```

Si una variante necesita comportarse distinto:

```text
Pizza Familiar:
Extra queso
+$45
ADD queso 90 g
```

se crea:

```text
VariantModifierConfig
---------------------
variantId
modifierOptionId
enabled
priceDelta
maxQuantity
ingredientEffects[]
```

La resolución es:

```text
si existe VariantModifierConfig
→ usar configuración específica

si no
→ usar generalConfig
```

Esto evita duplicar todos los modifiers en cada variante.

---

# Proyección para POS/KDS

Aunque el modelo administrativo use:

```text
generalConfig
+
VariantModifierConfig?
```

el POS/KDS no tiene por qué resolver esa herencia en runtime.

Al publicar el menú se puede materializar:

```text
ResolvedVariantModifier
```

con:

```text
variantId
modifierOptionId
enabled
priceDelta
maxQuantity
ingredientEffects
```

Así el runtime recibe directamente el comportamiento efectivo de cada modifier sobre cada variante.

---

# IngredientEffect

Para v1 se mantiene una semántica sencilla:

```text
ADD
OMIT
```

Ejemplos:

```text
Extra queso
→ ADD queso 40 g
```

```text
Sin cebolla
→ OMIT cebolla
```

No se introduce de inicio una álgebra más compleja con `REMOVE`, `SET`, escalados, etc., salvo que aparezca un requisito real.

También se acepta que un modifier tenga:

```text
ingredientEffects = []
```

por ejemplo:

```text
Bien cocida
Salsa aparte
Cortar a la mitad
```

Eso no crea otro concepto de dominio; sigue siendo simplemente una `ModifierOption`.

---

# ModifierGroup y límites

Se cuestionó si realmente necesitamos siempre:

```text
minSelections
maxSelections
```

en `ModifierGroup`.

Si todos los modifiers de tu negocio son opcionales y no existe una restricción transversal como:

```text
elige exactamente 1 término
```

o:

```text
máximo 3 toppings entre todos
```

entonces esos límites pueden ser innecesarios.

En ese caso sería suficiente:

```text
ModifierGroup
└── ModifierOption[]
```

y controlar cantidad por:

```text
ModifierOption.maxQuantity
```

Mantendría `minSelections/maxSelections` sólo si aparece un requisito real de grupo.

También conviene unificar el vocabulario en toda la documentación:

```text
Grupo de modificadores
Opción de modificador
```

y no alternar entre “personalización”, “grupo de personalización”, “modifier”, etc. cuando significan lo mismo.

---

# Combo

Un Combo no es Prepared ni Stocked.

Es una composición comercial:

```text
Combo
└── ComboConfiguration
    └── ComboSlot
        └── ComboOption
```

---

## ComboConfiguration

Si un Combo tiene:

```text
Individual
Pareja
Familiar
```

no se reutiliza necesariamente `MenuItemVariant`.

Es mejor representarlo como:

```text
ComboConfiguration
```

porque describe una configuración coordinada del bundle.

Ejemplo:

```text
Combo Sábado
├── Individual
├── Pareja
└── Familiar
```

Cada configuración puede tener:

```text
unitPrice
slots[]
```

Si el combo no tiene configuraciones visibles, puede usarse conceptualmente:

```text
DEFAULT ComboConfiguration
```

de manera análoga al Default Variant.

---

# ComboSlot y ComboOption

El modelo de slots se mantiene.

Ejemplo:

```text
Combo Sábado

Principal [1]
├── Hamburguesa chica
├── Hamburguesa mediana
└── Hamburguesa grande

Acompañamiento [1]
├── Papas francesas
└── Papas gajo

Bebida [1]
├── Coca 600ml
└── Sprite 600ml
```

No existe obligación de tener un “producto principal” especial en el dominio.

`Principal` puede ser simplemente otro `ComboSlot`.

---

## ComboOption apunta a una variante concreta

Se abandona:

```text
ComboOption.menuItemId
+
AllowedVariant
```

en favor de:

```text
ComboOption
-----------
itemVariantId
quantity
priceDelta
```

Esto permite representar directamente tanto:

```text
Coca 600ml
vs
Sprite 600ml
```

como:

```text
Hamburguesa chica
vs
Hamburguesa grande
```

sin que Combo tenga que entender internamente las dimensiones de variante.

---

# Combo y Modifiers

Un Combo **no tiene modifiers propios en v1**.

Cambiar:

```text
Coca → Sprite
```

o:

```text
Papas francesas → Papas gajo
```

es selección de `ComboOption`, no un modifier.

Si dentro del combo se selecciona:

```text
Hamburguesa Grande
```

esa hamburguesa puede conservar sus propios modifiers:

```text
Sin cebolla
Extra queso
```

Esos modifiers pertenecen al producto hijo.

No se permite:

```text
Combo
└── Sin cebolla
```

como una operación que navega y muta arbitrariamente recetas de componentes internos.

---

# Pricing del Combo

Cada `ComboConfiguration` posee:

```text
unitPrice
```

absoluto.

Las opciones pueden aportar:

```text
priceDelta
```

Ejemplo:

```text
Combo = $180

Papas francesas +$0
Papas gajo      +$15

Coca            +$0
Malteada        +$30
```

Precio final:

```text
ComboConfiguration.unitPrice
+
Σ ComboOption.priceDelta
+
Σ modifiers de los productos seleccionados
```

No se suman nuevamente los `unitPrice` normales de todos los productos hijos.

---

# Clasificación comercial

La clasificación comercial se mantiene para productos hoja:

```text
PLATILLO
BEBIDA
POSTRE
COMPLEMENTO
```

aplica a:

```text
PreparedItem
StockedItem
```

No aplica a `Combo`.

No se usaría:

```text
type = COMBO
classification = COMBO
```

porque duplicaría el mismo hecho.

---

# Categorías

Prepared y Stocked comparten categorías de producto:

```text
ItemCategory
├── Hamburguesas
├── Pizzas
├── Té
├── Refrescos
└── Papas
```

Y pueden relacionarse con la clasificación superior:

```text
PLATILLO
├── Hamburguesas
└── Pizzas

BEBIDA
├── Té
└── Refrescos
```

Combo utiliza un catálogo separado:

```text
ComboCategory
├── Individual
├── Familiar
├── Infantil
├── Desayuno
└── Temporada
```

El Combo no hereda categorías de sus componentes.

---

# Edición de una OrderLine

Al agregar un producto a la orden, la línea queda asociada a una variante concreta:

```text
OrderLine
├── itemId
├── variantId
├── quantity
├── unitPriceSnapshot
└── modifiers seleccionados
```

Al editar, se abre la variante ya seleccionada.

Puede permitirse cambiarla, pero entonces deben revalidarse:

```text
precio
modifiers disponibles
configuración efectiva de modifiers
disponibilidad
efectos de inventario
```

Dos personalizaciones diferentes producen líneas distintas aunque tengan mismo Item y misma Variant.

---

# Estado, elegibilidad y disponibilidad

Ésta fue otra decisión importante de hoy: **no mezclar estos conceptos**.

### Estado administrativo

Responde:

> ¿El administrador quiere ofrecerlo?

Ejemplo:

```text
ACTIVE
INACTIVE
ARCHIVED
```

según la entidad.

### Elegibilidad

Responde:

> ¿Esta unidad está correctamente configurada para participar en una nueva venta?

Depende de estructura/configuración.

Por ejemplo una variante archivada deja de ser elegible.

Un `ComboConfiguration` puede dejar de ser elegible si alguno de sus slots obligatorios ya no puede satisfacer sus selecciones mínimas con opciones elegibles.

### Disponibilidad operacional

Responde:

> ¿Puede prepararse o entregarse ahora?

Depende de Inventory.

Ejemplo:

```text
Pizza Familiar

eligible = true
available = false
```

porque falta queso.

La falta de stock **no elimina la definición comercial ni el precio de catálogo**.

---

# Archivo de variantes y combos dependientes

Archivar una variante debe estar permitido.

No se recomienda:

```text
rechazar el archivo
```

ni:

```text
desactivar automáticamente el Combo
```

porque eso mezcla ciclo de vida administrativo con consecuencias estructurales.

La secuencia preferida es:

```text
archivar variante
        ↓
deja de ser elegible
        ↓
ComboOption que la referencia deja de ser elegible
        ↓
reevaluar ComboConfiguration
        ↓
si ya no puede satisfacer un slot:
    ComboConfiguration = no elegible
    Combo = REVIEW_REQUIRED
```

El `MenuItem.status` del Combo no cambia automáticamente.

---

## Principio final del modelo

La arquitectura queda organizada alrededor de dos cadenas distintas.

Para productos hoja:

```text
Producto
¿Qué es?
    ↓
Variante
¿Qué presentación concreta se vende?
    ↓
Fulfillment
¿Cómo se satisface?
    ↓
Prepared → Recipe
Stocked  → InventoryItem
```

Y para Combo:

```text
Combo
¿Qué oferta comercial es?
    ↓
ComboConfiguration
¿Qué versión/configuración se vende?
    ↓
ComboSlot
¿Qué debe elegir el cliente?
    ↓
ComboOption
¿Qué variante concreta puede ocupar ese slot?
```

Mientras que los modifiers se mantienen ortogonales:

```text
Item
└── ModifierOption
    ├── generalConfig
    └── VariantModifierConfig?   ← sólo especialización
```

Con eso queda cerrada la dirección del modelo discutida hoy sin introducir todavía detalles de requisitos ni persistencia.