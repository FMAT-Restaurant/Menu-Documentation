# Problema-Inicial

## Páginas 1 a 102

*(Páginas sin contenido sustancial en el PDF original)*

## Página 103

Sí, el caso WELL_DONE revela justo el problema: si Effect.target “es un ingrediente”,
entonces no debemos intentar meter instrucciones de preparación dentro del mismo
contrato. Ahí conviene dejar de llamarlo Effect genérico y hacerlo explícitamente
IngredientEffect .
Y el precio tampoco lo pondría dentro del efecto. Lo dejaría en ModifierOption , porque el
cliente compra la opción "Extra queso" , no cada efecto técnico que ésta produzca. Una
opción podría afectar varios ingredientes y seguir costando una sola cantidad.
Por ejemplo:
Si priceDelta estuviera en cada efecto, el contrato se vuelve ambiguo.
Sobre WELL_DONE
Yo lo sacaría completamente de IngredientEffect .
Tendríamos dos mecanismos separados:
Ejemplo:
ModifierOption: Doble carne especial
priceDelta = +$45
IngredientEffects:
- Carne ADD 180 g
- Salsa ADD 10 ml
ModifierOption
→ personalización estructurada que puede afectar ingredientes
PreparationInstruction
→ instrucción sobre cómo preparar/servir

## Página 104

mientras:
Así ya no tenemos:
Ese diseño sí olía a type + payload polimórfico débil.
Yo corregiría el diagrama así
Incluí los atributos principales directamente dentro de cada entidad para que no queden
nodos cuyo contenido no está definido:
Hay un par de decisiones intencionales ahí.
IngredientEffect
Ahora su contrato es siempre estable:
Extra queso
→ ModifierOption
→ IngredientEffect
→ Queso ADD 30 g
Bien cocida
→ PreparationInstruction
Effect
target = ¿ingrediente? ¿carne? ¿orden? ¿cocina?
config = depende mágicamente del type
Cargando diagrama…

## Página 105

Por ejemplo:
o:
No necesitas type , porque el nombre de la entidad ya establece el tipo de efecto.
Y tampoco necesitas:
porque:
es bastante más explícito.
IngredientEffect
----------------
ingredientId
operation
quantity
unit
Extra cebolla
ModifierOption
name = "Extra cebolla"
priceDelta = 0
IngredientEffect
ingredientId = CEBOLLA
operation = ADD
quantity = 15
unit = g
Sin cebolla
IngredientEffect
ingredientId = CEBOLLA
operation = SET
quantity = 0
unit = g
target
ingredientId

## Página 106

priceDelta pertenece a ModifierOption
Yo usaría priceDelta en vez de additionalPrice .
Porque también puedes representar:
si eventualmente una sustitución reduce precio.
Por tanto:
y:
Separación muy limpia:
¿Y "Bien cocida"?
Ahí tienes razón: no debería tener este aspecto:
+$15
$0
-$10
ModifierOption
--------------
id
name
priceDelta
IngredientEffect
----------------
ingredientId
operation
quantity
unit
ModifierOption = consecuencia comercial.
IngredientEffect = consecuencia sobre preparación/inventario.

## Página 107

porque WELL_DONE no cambia la cantidad de carne.
Yo lo representaría como:
Ejemplos:
Ahora bien, probablemente vamos a necesitar agruparlas, igual que los modifiers:
Por ejemplo:
IngredientEffect
ingredientId = CARNE
operation = WELL_DONE   ❌
PreparationInstruction
----------------------
id
name
Bien cocida
Término medio
Poco cocida
Salsa aparte
Sin hielo
Cortar por la mitad
PreparationInstructionGroup
---------------------------
id
name
minSelections
maxSelections
PreparationInstruction
----------------------
id
name
Grupo: Término de la carne
min = 1
max = 1
├── Poco cocida
├── Término medio

## Página 108

Y ahí aparece una pregunta legítima:
Podemos. De hecho, comercialmente "Bien cocida" sí podría seguir siendo una
ModifierOption sin ningún IngredientEffect :
La orden conserva:
y cocina la interpreta.
Eso podría ser todavía más simple que introducir PreparationInstruction como otro
sistema completo.
La estructura sería:
Entonces:
pero:
├── Tres cuartos
└── Bien cocida
¿Por qué no hacer simplemente todo ModifierOption ?
ModifierOption
name = "Bien cocida"
priceDelta = 0
ingredientEffects = []
selectedModifier = "Bien cocida"
ModifierOption
├── name
├── priceDelta
└── ingredientEffects[]   ← 0..N
Extra queso
├── priceDelta = +12
└── IngredientEffect: queso ADD 30g
Bien cocida
├── priceDelta = 0
└── IngredientEffects = []

## Página 109

y:
Esto me convence más que mi diagrama de arriba si queremos mantener el dominio
pequeño.
La regla sería:
Así desaparece completamente el contrato raro de Effect .
En ese caso incluso eliminaría PreparationInstruction del modelo principal y reservaría
una note libre para instrucciones no preconfiguradas.
Creo que ésta es la versión más limpia para ustedes: ModifierOption es semántico y
general; IngredientEffect es opcional y específico. WELL_DONE sigue siendo un modifier,
simplemente no afecta ingredientes.
Salsa aparte
├── priceDelta = 0
└── IngredientEffects = []
Un ModifierOption expresa una personalización seleccionable. Opcionalmente, esa
personalización puede declarar uno o más IngredientEffect .
Dame la versión corregida ya considerando lo del 
preparationInstruction
Sí. Considerando lo que acabamos de cerrar, eliminaría PreparationInstruction como
concepto separado configurable. Casos como Bien cocida , Salsa aparte o Sin hielo
siguen siendo ModifierOption , sólo que no necesariamente tienen IngredientEffect .
La versión corregida quedaría así:

## Página 110

La decisión importante queda así:
Por ejemplo:
Mientras que:
y también:
Es decir, ModifierOption representa la decisión semántica que ve mesero/cocina, y
IngredientEffect sólo existe cuando esa decisión además tiene una consecuencia
cuantificable sobre ingredientes.
Para instrucciones completamente libres —por ejemplo, "por favor cortar en 4" — no
las modelaría en MenuItem ; las dejaría como una note o specialInstructions en el
Cargando diagrama…
ModifierOption
├── name
├── priceDelta
└── IngredientEffect[]  ← opcional
Extra queso
├── priceDelta = +12
└── IngredientEffect
     ├── ingredientId = queso
     ├── operation = ADD
     ├── quantity = 30
     └── unit = g
Bien cocida
├── priceDelta = 0
└── IngredientEffect[] = []
Salsa aparte
├── priceDelta = 0
└── IngredientEffect[] = []

## Página 111

OrderItem . Así no mezclamos una configuración predefinida del menú con texto
específico de una orden.
Vale, dale una revisada a este diagrama, siendo imparcial 
respecto a lo discutido e indaga por posibles problemas o 
smells.
mermaid
flowchart TD
   %% 
===============================================
======
   %% MENU
   %% 
===============================================
======
   MENU["Menu
   ─────────────
   id
   restaurantId
   name
   description"]
   ITEM["MenuItem
   ─────────────
   id
   menuId
   name
   description
   image
   categoryId
   basePrice
   availability
   fulfillmentType"]

## Página 112

MENU -->|contiene| ITEM
   %% 
===============================================
======
   %% MODIFIERS
   %% 
===============================================
======
   GROUP["ModifierGroup
   ─────────────
   id
   name
   minSelections
   maxSelections"]
   MOD["ModifierOption
   ─────────────
   id
   name
   priceDelta"]
   EFFECT["IngredientEffect
   ─────────────
   ingredientId
   operation
   quantity
   unit"]
   ITEM -.->|puede tener| GROUP
   GROUP -->|contiene| MOD
   MOD -.->|puede declarar 0..N| EFFECT
   EFFECT -->|ingredientId| ING
   %% 
===============================================

## Página 113

======
   %% VARIANTS
   %% 
===============================================
======
   DIMENSION["VariantDimension
   ─────────────
   id
   name"]
   VARVAL["VariantValue
   ─────────────
   id
   name"]
   VARIANT["MenuItemVariant
   ─────────────
   id
   menuItemId
   price
   skuCode?"]
   ITEM -.->|puede definir| DIMENSION
   DIMENSION -->|contiene| VARVAL
   ITEM -.->|puede ofrecer| VARIANT
   VARIANT -->|selecciona 1..N| VARVAL
   VARIANT -->|pertenece a| ITEM
   %% 
===============================================
======
   %% FULFILLMENT
   %% 
===============================================
======
   STOCK["StockedDefinition

## Página 114

─────────────
   skuId
   quantity"]
   PREP["PreparedDefinition
   ─────────────
   recipeId"]
   COMBO["ComboDefinition
   ─────────────
   id
   menuItemId"]
   ITEM -->|STOCKED| STOCK
   ITEM -->|PREPARED| PREP
   ITEM -->|COMBO| COMBO
   %% 
===============================================
======
   %% PREPARED / RECIPE
   %% 
===============================================
======
   RECIPE["Recipe
   ─────────────
   id
   name
   version"]
   RECIPECOMP["RecipeComponent
   ─────────────
   ingredientId
   quantity
   unit"]
   ING["InventoryIngredient
   ─────────────

## Página 115

id
   name
   baseUnit"]
   PREP -->|recipeId| RECIPE
   RECIPE -->|contiene| RECIPECOMP
   RECIPECOMP -->|ingredientId| ING
   %% 
===============================================
======
   %% STOCKED
   %% 
===============================================
======
   SKU["InventorySKU
   ─────────────
   id
   name
   unit"]
   STOCK -->|skuId| SKU
   %% 
===============================================
======
   %% COMBO
   %% 
===============================================
======
   SLOT["ComboSlot
   ─────────────
   id
   name
   minSelections
   maxSelections"]

## Página 116

OPTION["ComboOption
   ─────────────
   menuItemId
   quantity
   priceDelta"]
   ALLOWED["AllowedVariant
   ─────────────
   variantId"]
   COMBO -->|contiene| SLOT
   SLOT -->|ofrece| OPTION
   OPTION -->|menuItemId| ITEM
   OPTION -.->|puede restringir a| ALLOWED
   ALLOWED -->|variantId| VARIANT
Mostrar menos
Procesó durante 2m 1s
Sí hay varios puntos buenos, pero revisándolo desde cero no lo cerraría todavía. El núcleo
MenuItem + Variant + Modifier + Fulfillment + ComboSlot es razonable; los problemas
están sobre todo en cómo se cruzan esas dimensiones.
El smell más serio es que las variantes están modeladas como algo casi visual/comercial
( price , skuCode? ), mientras el fulfillment permanece en el MenuItem . En un
restaurante, una variante frecuentemente cambia precisamente el fulfillment. Square
también trata la variación como una unidad vendible concreta con precio, SKU y
comportamiento de inventario propios. 
Severidad
Punto
Problema
🔴 Alta
Variant ↔
Fulfillment
Una Coca 355/600 necesita SKUs distintos; papas chica/grande
consumen cantidades distintas; un combo mediano/grande
cambia componentes. El modelo actual no sabe expresarlo bien.
🔴 Alta
Variantes de
COMBO
Combo.MEDIANO no tiene actualmente ninguna relación con
Papas.MEDIANA o Bebida.MEDIANA . allowedVariants solamente
developer.squar… +1

## Página 117

Severidad
Punto
Problema
dice qué está permitido globalmente.
🔴 Alta
Alcance de
ModifierOption
No está definido si un modifier pertenece exclusivamente a un
MenuItem o se reutiliza. Esto cambia completamente dónde
deben vivir priceDelta e IngredientEffect .
🟠 Media
AllowedVariant
Como entidad que sólo contiene variantId , aporta muy poco.
Además no permite precio/default/reglas según variante del
combo.
🟠 Media
Pricing
basePrice , variant.price , modifier.priceDelta ,
comboOption.priceDelta existen, pero no está definida la
fórmula ni si variant.price reemplaza o suma.
🟠 Media
availability
Mezcla potencialmente "el restaurante lo vende" con "puede
producirse ahora". Tampoco contempla variantes agotadas
individualmente.
🟠 Media
Multiplicidad de
modifiers
minSelections/maxSelections no explica si puedo pedir Extra
queso ×2 . POS reales contemplan repetir un modifier.
🟠 Media
Ciclos de combos
ComboOption → MenuItem permite Combo A → Combo B → Combo
A . Necesitas prohibición o reglas de profundidad.
🟡 Baja
InventorySKU
SKU normalmente es un identificador, no el nombre ideal de una
entidad. StockItem / InventoryItem con atributo sku es más
natural.
🟡 Baja
Cruce Menu–
Inventory
Las flechas pueden hacer pensar en referencias de
objetos/foreign keys entre microservicios. En implementación
deberían ser IDs/contratos, no asociaciones persistentes cross-
DB.
1. El principal problema: las variantes necesitan participar en
fulfillment
Ahora tienes:
Square

## Página 118

Considera:
Tu StockedDefinition solamente admite:
No existe una respuesta correcta.
Lo mismo ocurre con:
y:
Por eso yo cambiaría conceptualmente a:
MenuItem
├── fulfillmentType
│
├── STOCKED → skuId
├── PREPARED → recipeId
└── COMBO → slots
MenuItemVariant
├── price
└── skuCode?
Coca-Cola
├── 355 ml → SKU A
├── 600 ml → SKU B
└── 1 L    → SKU C
skuId = ?
Papas
├── Chicas   → 120 g papa
├── Medianas → 180 g papa
└── Grandes  → 250 g papa
Combo
├── Chico
│   ├── Papas chicas
│   └── Coca chica
│
└── Grande
    ├── Papas grandes
    └── Coca grande

## Página 119

No significa necesariamente duplicar todo el fulfillment por variante. Significa que el
resultado debe ser variant-aware.
Por ejemplo:
Para preparados podrías tener:
o una estrategia de ajustes sobre una receta base.
Y para combo:
Esto es particularmente importante porque Square también coloca SKU/inventory al nivel
de la variación, no sólo del item abstracto. 
2. Combo.MEDIANO actualmente no significa realmente "mediano"
Este me parece el segundo agujero importante.
Actualmente puedes decir:
MenuItem
├── fulfillmentType
├── VariantDimensions
└── MenuItemVariants
          │
          └── FulfillmentConfiguration
StockedVariantDefinition
variantId
skuId
quantity
PreparedVariantDefinition
variantId
recipeId
ComboVariantConfiguration
variantId
...
Square +1
ComboOption: Papas

## Página 120

pero si el usuario selecciona:
¿cuál corresponde?
El modelo no lo sabe.
Necesitas poder expresar algo equivalente a:
Oracle Simphony tiene precisamente configuración explícita de sustituciones por tamaño
dentro de los grupos del combo: sus objetos contemplan ítems específicos para Size 1,
Size 2, Size 3, etc. 
Así que probablemente necesitas algo similar conceptualmente a:
y:
No necesariamente esos nombres exactos, pero falta esa relación.
allowedVariants:
- Chicas
- Medianas
- Grandes
ComboVariant = MEDIANO
Combo.MEDIANO
Slot Papas
→ Papas.MEDIANA
Slot Bebida
→ Coca.MEDIANA | Sprite.MEDIANA
Oracle Docs +1
ComboVariantConfiguration
-------------------------
comboVariantId
slotRules[]
ComboSlotVariantRule
--------------------
slotId
optionId
allowedVariantIds
defaultVariantId?

## Página 121

3. AllowedVariant ahora mismo está medio anémico
Esto:
realmente podría ser:
y listo.
Sólo justificaría convertir la asociación en una entidad si necesita guardar información.
Y probablemente sí la va a necesitar:
Ejemplo:
Porque actualmente tienes:
pero eso sólo te permite:
AllowedVariant
--------------
variantId
ComboOption
allowedVariantIds[]
ComboOptionVariant
------------------
variantId
priceDelta
isDefault
ComboOption: Papas
Medianas
priceDelta = $0
Grandes
priceDelta = +$15
ComboOption
priceDelta

## Página 122

independientemente de si son chicas, medianas o grandes.
Eso no alcanza.
4. Hay que decidir definitivamente si los modifiers son reutilizables
Actualmente:
Esto es perfecto si todo ese árbol pertenece exclusivamente al MenuItem.
Por ejemplo:
y otro:
Son dos ModifierOption diferentes aunque ambos se llamen "Extra queso" .
Entonces no hay problema.
Pero si quieres:
Papas = +$10
MenuItem
  ↓
ModifierGroup
  ↓
ModifierOption
  ↓
IngredientEffect
Hamburguesa
└── Extras
     └── Extra queso
          └── cheddar ADD 30 g
Pizza
└── Extras
     └── Extra queso
          └── mozzarella ADD 80 g
ModifierGroup: Extras

## Página 123

reutilizable por muchos productos, entonces esto:
empieza a estar mal ubicado.
Porque "Extra queso" podría significar:
Square permite asignar listas de modifiers a items y Oracle permite asociar grupos de
condimentos con distintos menu items, por lo que esta distinción entre definición y
aplicación existe también en productos reales. 
Tienes dos caminos válidos.
Camino simple para su proyecto: los modifier groups son propiedad del MenuItem . No se
reutilizan.
Yo probablemente escogería éste inicialmente.
La otra posibilidad sería introducir:
y poner ahí efectos/precio específicos, pero agrega bastante complejidad.
5. Los modifiers de un COMBO todavía necesitan una regla
Hay una consecuencia sutil de tu modelo:
ModifierOption
priceDelta
IngredientEffects
Hamburguesa:
+30 g cheddar
+$12
Pizza:
+80 g mozzarella
+$25
Square +1
MenuItemModifierConfiguration
MenuItem
→ ModifierGroup

## Página 124

aplica igualmente a:
Entonces técnicamente podrías declarar:
¿qué cebolla?
Podría haber:
SET cebolla = 0 ahora tiene una semántica peligrosa.
Yo impondría:
Si quieres:
debe ser:
Un modifier del combo podría seguir teniendo un efecto propio como:
→ ModifierOption
→ IngredientEffect
PREPARED
STOCKED
COMBO
Combo
└── Sin cebolla
     └── SET cebolla = 0
Combo
├── Hamburguesa → 30g cebolla
└── Ensalada    → 40g cebolla
Modifier de Combo
NO puede alterar internamente
los ingredientes de sus hijos.
Sin cebolla de la hamburguesa
Combo
→ Slot
→ Hamburguesa
→ Modifier "Sin cebolla"

## Página 125

si esa salsa pertenece al combo como agregado adicional, pero no debería navegar y
mutar recetas descendientes.
Ese invariant no aparece en el diagrama y es importante.
6. ModifierOption con 0 efectos me parece correcto
Después de revisarlo contra Oracle, esta parte de nuestra decisión anterior aguanta bien.
Oracle usa sus condiments/modifiers tanto para ingredientes como cebolla/tomate como
para cosas como rare , medium , well done y "sauce on the side" . 
Por tanto:
no me parece smell.
El modifier representa:
IngredientEffect simplemente dice:
Eso está bien.
7. Pero falta multiplicidad por ModifierOption
Supón:
Agregar salsa adicional
→ ADD salsa 30 ml
Oracle Docs
ModifierOption
--------------
Bien cocida
priceDelta = 0
ingredientEffects = []
una personalización estructurada de la orden.
esta personalización además modifica el consumo calculable de ingredientes.
Extra queso

## Página 126

¿puedo hacer:
Tu modelo tiene:
pero eso normalmente controla cuántas opciones del grupo selecciono, no
necesariamente cuántas veces selecciono la misma.
Square distingue esto y permite configurar repetición de un modifier. 
Consideraría:
o:
Entonces:
puede resolver:
sin tener que crear:
Extra queso × 1
Extra queso × 2
Extra queso × 3
ModifierGroup
minSelections
maxSelections
Square
ModifierOption
--------------
id
name
priceDelta
maxQuantity
allowMultiple
maxQuantity
Extra queso ×2
2 × IngredientEffect
2 × priceDelta

## Página 127

8. Pricing necesita una regla matemática explícita
Actualmente tienes:
La pregunta inmediata es:
¿significa?
o:
Yo evitaría price ahí.
Tienes dos modelos limpios:
y:
Extra queso
Doble extra queso
Triple extra queso
MenuItem.basePrice
MenuItemVariant.price
ModifierOption.priceDelta
ComboOption.priceDelta
MenuItem = $100
Variant Grande.price = $30
$130
$30
MenuItem.basePrice
MenuItemVariant.priceDelta
effectivePrice =
basePrice
+ variantDelta
+ modifierDeltas
+ comboOptionDeltas

## Página 128

O:
que reemplaza al basePrice .
Ambos son válidos; lo malo es dejarlo ambiguo.
Además, en un combo:
no deberías calcular:
Las opciones aportan sólo su priceDelta , salvo que definas explícitamente otro algoritmo
de pricing. Oracle, de hecho, expone configuración/algoritmos específicos de precios para
combos, señal de que esto merece una regla explícita. 
9. Availability casi seguro está haciendo dos trabajos
Esto:
es ambiguo.
Podría significar:
o:
Son cosas diferentes.
MenuItemVariant.unitPrice
Combo $170
├── Hamburguesa $120
├── Papas $50
└── Coca $35
170 + 120 + 50 + 35
Oracle Docs
MenuItem.availability
"El administrador lo habilitó"
"Hay inventario para producirlo"

## Página 129

Yo preferiría en Menu:
y tratar:
como una proyección operacional calculada usando Inventory.
Además:
demuestra que disponibilidad puede existir al nivel de variante.
Este problema se vuelve mucho más sencillo una vez arregles el punto #1 y las variantes
tengan identidad operacional.
10. InventorySKU probablemente debería cambiar de nombre
Esto:
realmente parece una entidad InventoryItem o StockItem .
SKU normalmente sería:
status / active / enabled
AVAILABLE
OUT_OF_STOCK
PARTIALLY_AVAILABLE
Coca-Cola
├── 355 ml AVAILABLE
├── 600 ml OUT_OF_STOCK
└── 1 L AVAILABLE
InventorySKU
------------
id
name
unit
StockItem
---------
id
sku

## Página 130

Además conviene revisar si realmente necesitas:
como conceptos paralelos.
Quizás Inventory debería tener:
o simplemente:
y Recipe utiliza determinados stock items como ingredientes.
No afirmaría que tu diseño actual sea incorrecto sin ver Inventory, pero sí lo marcaría
como algo que hay que revisar.
11. ComboOption → MenuItem crea recursión ilimitada
Ahora mismo:
es válido estructuralmente.
O incluso:
Necesitas un invariant.
name
baseUnit
InventoryIngredient
InventorySKU
InventoryItem
├── Ingredient
└── StockedGood
StockItem
Combo A
→ Option: Combo B
Combo B
→ Option: Combo A
A → B → C → D → E...

## Página 131

Para su alcance yo usaría el más sencillo:
Si algún día aparece un requisito real de combos dentro de combos, puedes abrirlo y
pasar a DAG + detección de ciclos + profundidad máxima.
Es normal que sistemas con personalizaciones jerárquicas impongan este tipo de límites:
por ejemplo, Square limita modifiers anidados a tres niveles y prohíbe ciclos. 
12. A MenuItemVariant le faltan invariantes
Esto:
permite teóricamente:
o:
Deberías definir:
Y además:
ComboOption.menuItem
debe ser PREPARED o STOCKED
COMBO no permitido como hijo
Square
VARIANT --> selecciona 1..N VariantValue
Tamaño:
- Chico
- Grande
Variant:
[Chico, Grande] ❌
MenuItem Pizza
VariantValue perteneciente a:
Color de Camiseta ❌
Una variante selecciona como máximo
un valor por dimensión.

## Página 132

Y:
Square genera precisamente las variaciones como combinaciones de valores de
opciones/dimensiones. 
Evaluación global
No veo un God Object, una jerarquía de herencia problemática ni un uso artificial de
Composite. Eso es bueno.
Tampoco veo como smell que ModifierOption pueda tener 0..N IngredientEffect ;
después de contrastarlo con POS reales, me parece una decisión defendible. Oracle
demuestra que una misma abstracción de personalización puede representar tanto
ingredientes como instrucciones sin precio ni cambio de inventario. 
El problema fundamental es otro:
los modelaste como tres ramas independientes, cuando en realidad Variant y Fulfillment
interactúan, y en COMBO interactúan todavía más:
todos sus VariantValues pertenecen
a dimensiones del mismo MenuItem.
no existen dos variantes del mismo MenuItem
con exactamente la misma combinación.
Square
Oracle Docs
                 MenuItem
          ┌────────┼─────────┐
          │        │         │
       Variant  Modifier  Fulfillment
MenuItemVariant
       │
       ▼
Fulfillment concreto
       │
       ▼
si COMBO:
ComboSlot
       │
       ▼

## Página 133

Ese es el cambio estructural que sí haría antes de avanzar hacia agregados o
implementación.
Mi veredicto sería: la taxonomía del dominio está bien encaminada; la resolución de
variantes todavía no lo está. Arreglando Variant ↔ Fulfillment , definiendo ownership
de modifiers y formalizando las reglas de combo/precio, el modelo pasa de ser un buen
modelo conceptual a uno bastante implementable.
ComboOption
       │
       ▼
MenuItem + Variant permitida/concreta
ChatGPT puede cometer errores. Se debe comprobar la información importante

## Página 134

*(Página sin contenido sustancial)*

