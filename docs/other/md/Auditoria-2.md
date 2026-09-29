## Decisiones consolidadas del modelo

1. **`PREPARED`, `STOCKED` y `COMBO` son tipos conceptualmente diferentes de entrada del menú.** `Prepared` y `Stocked` son productos hoja; `Combo` es una composición comercial de otros productos. Pueden compartir metadata común, pero no toda su estructura.

```text
MenuEntry
├── PreparedItem
├── StockedItem
└── Combo
```

2. **Prepared y Stocked comparten el concepto de variante.** Una variante representa una **presentación/unidad vendible concreta** del producto, no otro Item.

```text
Pizza Italiana
├── Individual
├── Pareja
└── Familiar
```

sigue siendo una sola `Pizza Italiana`.

3. **Se conserva el patrón Default Variant.** Todo `PreparedItem` y `StockedItem` tiene siempre al menos una variante:

```text
variants.count >= 1
```

Si comercialmente no existen variantes:

```text
Hamburguesa Clásica
└── DEFAULT
```

La variante `DEFAULT` es técnica y no necesita aparecer en la UI.

4. **`variantId` nunca será nullable en Orders.** Incluso un producto sin variantes visibles termina resolviéndose a una unidad vendible concreta.

```text
OrderLine
---------
itemId
variantId     // obligatorio
quantity
unitPrice
...
```

5. **La variante técnica `DEFAULT` no es lo mismo que una variante real predeterminada.** Para:

```text
Pizza Italiana
├── Individual
├── Pareja
└── Familiar
```

puede existir opcionalmente:

```text
defaultVariantId = Individual
```

pero sólo como comportamiento UX.

No es obligatorio y no determina el precio conceptual del producto.

6. **Una misma presentación no debe existir simultáneamente como Item independiente y como variante.**

Es válido:

```text
Coca-Cola
├── 600 ml
└── 1 L
```

o:

```text
Coca-Cola 600 ml
└── DEFAULT

Coca-Cola 1 L
└── DEFAULT
```

si comercialmente son productos independientes.

Pero no ambas representaciones para la misma oferta.

7. **La decisión Item vs Variant depende de identidad comercial.**

Si el restaurante piensa:

> Es el mismo producto en otra presentación.

→ Variante.

Si piensa:

> Son productos administrados independientemente.

→ Items separados.

Por ejemplo, normalmente:

```text
Pizza Italiana
├── Individual
├── Pareja
└── Familiar
```

son variantes.

Mientras:

```text
Hamburguesa Clásica
Hamburguesa BBQ
```

son Items diferentes.

---

## Pricing

8. **El precio autoritativo pertenece a la variante.**

```text
ItemVariant.unitPrice
```

es absoluto.

Ejemplo:

```text
Pizza Italiana

Individual = $140
Pareja     = $210
Familiar   = $290
```

No:

```text
basePrice = $140
Pareja = +$70
Familiar = +$150
```

9. **`MenuItem.basePrice` desaparece como fuente de verdad.**

El producto conceptual no necesita un precio propio si existen diferentes unidades vendibles.

10. **El precio del catálogo es una proyección de presentación.**

```text
1 variante
→ "$140"

varias variantes, mismo precio
→ "$140"

varias variantes, precios distintos
→ "Desde $140"
```

Por ejemplo:

```text
displayPrice = MIN(activeVariants.unitPrice)
```

No se almacena otro precio autoritativo sólo para resolver la tarjeta de catálogo.

---

## Prepared y Stocked

11. **Prepared y Stocked se diferencian por cómo resuelven la variante.**

Conceptualmente:

```text
PreparedItem
└── ItemVariant
    └── PreparedDefinition
        └── recipeId
```

mientras:

```text
StockedItem
└── ItemVariant
    └── StockedDefinition
        ├── inventoryItemId
        └── quantity
```

La variante sigue siendo la unidad vendible común.

12. **Una receta diferente no convierte una variante en otro Item.**

Es perfectamente válido:

```text
Pizza Italiana

Individual
→ RecipeIndividual

Pareja
→ RecipePareja

Familiar
→ RecipeFamiliar
```

Continúan siendo presentaciones del mismo producto.

13. **No se introduce `scaleFactor` automáticamente para recetas.** Los ingredientes no tienen por qué escalar proporcionalmente. Cada variante puede referenciar su receta concreta.

---

# Modificadores: diseño definitivo

Aquí es donde cambia la síntesis anterior.

14. **Los modifiers pertenecen al Item, no a cada variante.**

```text
PreparedItem / StockedItem
└── ModifierGroup
    └── ModifierOption
```

Por ejemplo:

```text
Pizza Italiana
├── Variants
│   ├── Individual
│   ├── Pareja
│   └── Familiar
│
└── Extras
    ├── Extra queso
    ├── Sin cebolla
    └── Bien cocida
```

No se crean árboles independientes:

```text
❌ Extra queso Individual
❌ Extra queso Pareja
❌ Extra queso Familiar
```

como definiciones distintas.

15. **`ModifierOption` contiene una configuración general/default.**

Conceptualmente:

```text
ModifierOption
--------------
id
name

defaultConfig:
    priceDelta
    maxQuantity
    ingredientEffects[]
```

Por ejemplo:

```text
Extra queso

default:
priceDelta = +$25
maxQuantity = 2
ADD queso 40g
```

16. **La variante sólo especializa el modifier cuando su comportamiento cambia.**

Se introduce:

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

Pero esta entidad **no debe existir obligatoriamente para cada combinación Variant × Modifier**.

Sólo representa una excepción/especialización.

Ejemplo:

```text
Extra queso

default:
+$25
ADD queso 40g
```

Individual puede usar directamente ese comportamiento.

Pero:

```text
VariantModifierConfig
variant = FAMILIAR
modifier = EXTRA_QUESO

priceDelta = +$45
maxQuantity = 3
ADD queso 90g
```

17. **La regla de resolución es explícita y sencilla.**

```text
si existe VariantModifierConfig
    usar configuración de variante
else
    usar ModifierOption.defaultConfig
```

No es un sistema genérico de herencia ni inferencia compleja.

18. **La aplicabilidad de un modifier también puede especializarse por variante.**

Por ejemplo:

```text
Hamburguesa
├── Sencilla
└── Doble

Modifier:
Agregar segunda carne
```

Si no debe estar disponible en `Doble`:

```text
VariantModifierConfig
variant = DOBLE
modifier = ADD_MEAT
enabled = false
```

19. **`ModifierGroup.minSelections/maxSelections` permanece general al Item.**

No lo haría variant-aware todavía.

Sólo se ampliaría si aparece un requisito real como:

```text
Pizza Individual
→ máximo 2 toppings

Pizza Familiar
→ máximo 5 toppings
```

20. **Los efectos sobre ingredientes siguen perteneciendo al comportamiento del modifier.**

Para v1:

```text
ADD
OMIT
```

cubren los casos importantes:

```text
Extra queso
→ ADD queso 40g

Sin cebolla
→ OMIT cebolla
```

No introduciría `REMOVE`, `SET`, escalado matemático, etc. sin un requisito real.

---

## Proyección resuelta para POS/KDS

21. **El modelo de administración puede usar default + especializaciones sin obligar al POS a resolverlas durante una orden.**

Cuando el menú se publica, se genera una proyección efectiva:

```text
ResolvedVariantModifier
-----------------------
variantId
modifierOptionId
enabled
priceDelta
maxQuantity
ingredientEffects[]
```

Entonces el write model puede ser:

```text
BACKOFFICE

Item
└── Modifier general
      +
   Override/especialización por Variant
```

pero el POS recibe:

```text
POS / READ MODEL

Pizza Individual
├── Extra queso +$25 / 40g
├── Sin cebolla
└── Bien cocida

Pizza Familiar
├── Extra queso +$45 / 90g
├── Sin cebolla
└── Bien cocida
```

22. **La complejidad administrativa no se traslada al momento crítico de toma de órdenes.**

El POS no necesita hacer:

```text
buscar default
→ buscar override
→ combinar
```

si la publicación del menú ya generó la configuración efectiva.

Esto conserva el objetivo anterior de runtime determinista.

---

# Combos

23. **Combo es una composición, no un producto hoja.**

```text
Combo
└── ComboConfiguration
    └── ComboSlot
        └── ComboOption
```

24. **Un Combo puede tener varios slots configurables.**

No existe la obligación de que haya un único producto base especial.

```text
Combo Sábado

Principal [1]
├── Hamburguesa
└── Hot Dog

Acompañamiento [1]
├── Papas francesas
└── Papas gajo

Bebida [1]
├── Coca
└── Sprite
```

`Principal` es simplemente otro `ComboSlot`.

25. **Elegir entre opciones del combo NO es un modifier.**

Esto:

```text
Coca → Sprite
Papas francesas → Papas gajo
Hamburguesa chica → grande
```

es selección de `ComboOption`.

No modificación del Combo.

26. **`ComboOption` referencia una variante concreta de un producto hoja.**

Se elimina:

```text
ComboOption.menuItemId
+
AllowedVariant
```

y se reemplaza por:

```text
ComboOption
-----------
itemVariantId
quantity
priceDelta
```

Así:

```text
Slot Bebida
├── Coca 600ml
├── Sprite 600ml
└── Fanta 600ml
```

y:

```text
Slot Principal
├── Hamburguesa Chica
├── Hamburguesa Mediana
└── Hamburguesa Grande
```

son exactamente el mismo tipo de selección desde la perspectiva del Combo.

27. **`AllowedVariant` desaparece.**

La propia `ComboOption` ya referencia la unidad permitida.

28. **Combo no tendrá ModifierGroups propios en v1.**

Los modifiers corresponden a los productos seleccionados:

```text
Combo
└── Principal
    └── Hamburguesa Grande
        ├── Sin cebolla
        └── Extra queso
```

No:

```text
Combo
└── Sin cebolla
```

mutando internamente la receta de un hijo.

29. **Las variantes/configuraciones propias del Combo no reutilizan `ItemVariant`.**

Si existe:

```text
Combo Sábado
├── Individual
├── Pareja
└── Familiar
```

se modela como:

```text
ComboConfiguration
```

porque no tiene exactamente la misma semántica que:

```text
Coca-Cola
└── 600 ml
```

30. **ComboConfiguration aplica un patrón análogo al Default Variant.**

Todo Combo tiene:

```text
1..N ComboConfiguration
```

Si no existen configuraciones comerciales visibles:

```text
Combo Sábado
└── DEFAULT
```

internamente.

Si existen varias:

```text
Individual
Pareja
Familiar
```

`defaultConfigurationId?` puede existir opcionalmente para UX.

31. **Cada `ComboConfiguration` posee un precio absoluto.**

```text
ComboConfiguration.unitPrice
```

Por ejemplo:

```text
Individual $180
Pareja     $290
Familiar   $430
```

32. **El precio final de un Combo es:**

```text
ComboConfiguration.unitPrice
+
Σ ComboOption.priceDelta
+
Σ modifiers aplicados a los productos seleccionados
```

No se suman nuevamente los precios normales de todos los componentes.

---

# Clasificación y categorías

33. **La clasificación comercial sólo aplica a productos hoja.**

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

No a `Combo`.

34. **`COMBO` no vuelve a introducirse como clasificación comercial.**

Sería redundante:

```text
type = COMBO
classification = COMBO
```

El tipo ya expresa ese hecho.

35. **Las categorías de productos hoja son compartidas entre Prepared y Stocked.**

```text
ItemCategory
├── Hamburguesas
├── Pizzas
├── Refrescos
├── Té
└── Papas
```

No importa si el producto se prepara o viene de inventario.

36. **Los Combos tienen un repositorio separado de categorías.**

```text
ComboCategory
├── Individual
├── Familiar
├── Infantil
├── Desayuno
└── Temporada
```

No heredan las categorías de sus componentes.

37. **Un Combo tiene una única `ComboCategory` en v1.**

Sus componentes conservan individualmente sus propias categorías.

38. **Clasificación e ItemCategory forman una taxonomía de productos hoja.**

Por ejemplo:

```text
PLATILLO
├── Hamburguesas
├── Pizzas
└── Ensaladas

BEBIDA
├── Refrescos
├── Té
└── Café

POSTRE
├── Pasteles
└── Helados

COMPLEMENTO
├── Papas
└── Salsas
```

Idealmente la asociación:

```text
ItemCategory → CommercialClassification
```

es la fuente canónica, evitando combinaciones incoherentes.

---

# Backoffice

39. **La primera decisión del wizard es `Tipo de producto`, no “Tipo de suministro”.**

```text
PREPARED
STOCKED
COMBO
```

Porque `COMBO` no es realmente una modalidad de suministro.

40. **Para Prepared y Stocked aparece la clasificación comercial.**

```text
Platillo
Bebida
Postre
Complemento
```

Para Combo, el bloque de clasificación no existe.

41. **La categoría concreta continúa seleccionándose posteriormente en Datos y suministros.**

Para Prepared/Stocked:

```text
ItemCategory
```

Para Combo:

```text
ComboCategory
```

42. **El backoffice debe facilitar especializaciones de modifiers por variante sin exigir duplicación manual.**

Por ejemplo:

```text
Extra queso
default = +$25 / 40g

[Personalizar para Familiar]
→ +$45 / 90g
```

No obliga al administrador a recrear `"Extra queso"` tres veces.

---

# Orders

43. **Una OrderLine de producto hoja siempre referencia una variante concreta.**

```text
OrderLine
---------
itemId
variantId
quantity
unitPriceSnapshot
...
```

No existe:

```text
variantId = null
```

44. **Al editar una línea se abre con la variante que ya fue seleccionada.**

Ejemplo:

```text
Pizza Italiana
● Familiar

☑ Extra queso
☑ Sin cebolla
```

45. **Puede permitirse cambiar la variante durante edición**, pero obliga a revalidar:

* precio;
* disponibilidad;
* modifiers disponibles;
* configuración efectiva de los modifiers;
* efectos de inventario.

46. **Dos personalizaciones distintas producen líneas distintas aunque tengan el mismo Item y Variant.**

```text
Pizza Familiar
+ Extra queso
```

y:

```text
Pizza Familiar
+ Sin queso
```

son dos `OrderLine`.

---

# Modelo conceptual actualizado

La estructura general quedaría:

```text
Menu
│
└── MenuEntry
    │
    ├── PreparedItem
    │   │
    │   ├── itemCategoryId
    │   │
    │   ├── ItemVariant [1..N]
    │   │   ├── unitPrice
    │   │   ├── variantValues[]
    │   │   └── PreparedDefinition
    │   │       └── recipeId
    │   │
    │   └── ModifierGroup[]
    │       └── ModifierOption[]
    │           └── defaultConfig
    │               ├── priceDelta
    │               ├── maxQuantity
    │               └── ingredientEffects[]
    │
    ├── StockedItem
    │   │
    │   ├── itemCategoryId
    │   │
    │   ├── ItemVariant [1..N]
    │   │   ├── unitPrice
    │   │   ├── variantValues[]
    │   │   └── StockedDefinition
    │   │       ├── inventoryItemId
    │   │       └── quantity
    │   │
    │   └── ModifierGroup[]?
    │       └── ModifierOption[]
    │           └── defaultConfig
    │
    └── Combo
        │
        ├── comboCategoryId
        │
        └── ComboConfiguration [1..N]
            ├── unitPrice
            │
            └── ComboSlot[]
                ├── minSelections
                ├── maxSelections
                │
                └── ComboOption[]
                    ├── itemVariantId
                    ├── quantity
                    └── priceDelta
```

La especialización de modifiers queda transversal:

```text
ItemVariant
     │
     │ 0..N
     ▼
VariantModifierConfig
     ▲
     │
ModifierOption
```

donde:

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

y **sólo existe cuando la variante difiere de la configuración general**.

Finalmente, para el runtime:

```text
ModifierOption.defaultConfig
          +
VariantModifierConfig?
          ↓
     publicación
          ↓
ResolvedVariantModifier
```

Por lo tanto, la decisión que reemplaza la anterior es:

> **Los modifiers se definen una sola vez a nivel de Item. Cada variante hereda esa configuración por defecto y sólo declara excepciones cuando cambian precio, cantidad, efectos o aplicabilidad. Al publicar el menú, esas reglas se materializan en una configuración resuelta por variante para que POS/KDS no tengan que inferirlas durante la operación.**

Ese sería el diseño que tomaría ya como base para actualizar el diagrama anterior y posteriormente bajar a agregados, persistencia y APIs.
