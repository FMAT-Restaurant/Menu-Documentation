# Modelo-Final

## Página 1

Eres un experto en arquitectura de software y diseño. Sea
una auditoria y revisión respecto a el siguiente modelo de
un servicio de menú para un sistema de comandas:
mermaid
flowchart TD
    %% ==============================================
    %% MENU
    %% ==============================================
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
    MENU -->|contiene| ITEM
    %% ==============================================
Markdown(1).md pegado
Archivo

## Página 2

%% MODIFIERS
    %% ==============================================
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
    %% ==============================================
    %% VARIANTS
    %% ==============================================
    DIMENSION["VariantDimension
    ─────────────
    id
    name"]
    VARVAL["VariantValue

## Página 3

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
    %% ==============================================
    %% FULFILLMENT
    %% ==============================================
    STOCK["StockedDefinition
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

## Página 4

%% ==============================================
    %% PREPARED / RECIPE
    %% ==============================================
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
    id
    name
    baseUnit"]
    PREP -->|recipeId| RECIPE
    RECIPE -->|contiene| RECIPECOMP
    RECIPECOMP -->|ingredientId| ING
    %% ==============================================
    %% STOCKED
    %% ==============================================
    SKU["InventorySKU
    ─────────────
    id
    name
    unit"]
    STOCK -->|skuId| SKU

## Página 5

%% ==============================================
    %% COMBO
    %% ==============================================
    SLOT["ComboSlot
    ─────────────
    id
    name
    minSelections
    maxSelections"]
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
Donde se analizó y se indicó lo adjuntado (el archivo). Tu
que decidirias y cambiarias.
Mostrar menos
Procesó durante 29s
Sí cambiaría varias cosas, pero no tiraría el modelo. La taxonomía principal está bien:
MenuItem , variantes, modificadores, fulfillment, recetas y combos representan conceptos

## Página 6

reales del dominio. Coincido con la auditoría adjunta en que el problema principal está en
que Variant y Fulfillment quedaron como ramas demasiado independientes.
Mi versión buscaría además reducir complejidad accidental y fijar límites de agregado más
claros.
Mi decisión arquitectónica
La idea central sería esta:
Es decir:
pero no permitiría algo como:
Para su sistema eso introduce una flexibilidad que probablemente nunca necesitan.
Así que mantendría:
pero movería la configuración del fulfillment al nivel de variante.
Markdown.md pegado
MenuItem = concepto comercial
MenuItemVariant = unidad vendible concreta
FulfillmentType = propiedad/invariante del MenuItem
FulfillmentConfig = resolución concreta por Variant
Coca-Cola
  fulfillmentType = STOCKED
  ├── Variant 355 ml
  │      └── skuId = COCA-355
  │
  ├── Variant 600 ml
  │      └── skuId = COCA-600
  │
  └── Variant 1 L
         └── skuId = COCA-1L
MenuItem X
├── Variant A = PREPARED
└── Variant B = STOCKED
MenuItem.fulfillmentType

## Página 7

Esto resuelve directamente uno de los agujeros principales detectados en la auditoría: hoy
un item STOCKED sólo tiene un skuId , aunque cada tamaño pueda corresponder a un
SKU diferente. 
1. Haría que toda unidad vendible sea una
MenuItemVariant
Aquí haría un cambio conceptual importante.
Incluso si el usuario ve:
sin seleccionar ninguna variante, internamente tendría:
Eso elimina muchísimos if variant != null .
Tendrías:
Markdown.md pegado
Hamburguesa clásica
$120
MenuItem
  Hamburguesa clásica
Variant
  DEFAULT
MenuItem
    id
    menuId
    name
    description
    image
    categoryId
    basePrice
    status
    fulfillmentType
MenuItemVariant
    id
    menuItemId
    priceDelta

## Página 8

Entonces siempre puedes decir:
y el fulfillment siempre parte de una unidad concreta.
Para mí éste es el cambio que más limpiaría el modelo.
2. fulfillmentType sigue en MenuItem , pero la definición
baja a Variant
En vez de:
usaría:
Y según el tipo:
OrderLine
    menuItemId
    variantId
MenuItem
├── STOCKED → StockedDefinition
├── PREPARED → PreparedDefinition
└── COMBO → ComboDefinition
MenuItem
│
├── fulfillmentType
│
└── Variants
       │
       └── FulfillmentDefinition
StockedVariantDefinition
------------------------
variantId
inventoryItemId
quantity
PreparedVariantDefinition
-------------------------

## Página 9

Eso permite naturalmente:
sin inventar excepciones.
3. Simplificaría radicalmente los combos
Aquí cambiaría bastante tu diseño actual.
Ahora tienes:
El problema identificado en el documento es correcto: eso permite decir qué variantes
están permitidas, pero no expresa bien qué ocurre cuando la propia variante del combo
condiciona las variantes de sus componentes. 
Yo directamente eliminaría:
y haría que una ComboOption apunte a una variante vendible, no sólo a un MenuItem .
variantId
recipeId
ComboVariantDefinition
----------------------
variantId
slots[]
Papas
├── Chica
│   └── recipeId = PAPAS_CHICA
├── Mediana
│   └── recipeId = PAPAS_MEDIANA
└── Grande
    └── recipeId = PAPAS_GRANDE
ComboOption
    menuItemId
AllowedVariant
    variantId
Markdown.md pegado
AllowedVariant

## Página 10

Entonces:
Y:
Sí, puede producir cierta duplicación entre configuraciones de combo.
La prefiero antes que introducir:
ComboSlot
---------
id
name
minSelections
maxSelections
ComboOption
-----------
menuItemVariantId
quantity
priceDelta
Combo Mediano
│
├── Slot Hamburguesa
│     └── Hamburguesa DEFAULT
│
├── Slot Papas
│     └── Papas MEDIANA
│
└── Slot Bebida
      ├── Coca 600 ml
      └── Sprite 600 ml
Combo Grande
│
├── Slot Hamburguesa
│     └── Hamburguesa DEFAULT
│
├── Slot Papas
│     └── Papas GRANDE
│
└── Slot Bebida
      ├── Coca 1 L
      └── Sprite 1 L

## Página 11

Para el alcance que tienen ustedes, eso sería sobre-modelar.
4. Prohibiría combos dentro de combos
Para este proyecto definiría explícitamente:
No COMBO .
Eso elimina:
y evita tener que implementar:
detección de ciclos;
profundidad máxima;
resolución recursiva;
pricing recursivo;
disponibilidad recursiva;
cálculo recursivo de inventario.
La auditoría también identifica esta recursión como un riesgo real del modelo actual.
AllowedVariant
ComboVariantRule
ComboSlotVariantRule
VariantMapping
...
ComboOption.menuItemVariant
    ↓
el MenuItem asociado sólo puede ser:
PREPARED
o
STOCKED
Combo A
  → Combo B
       → Combo C
            → Combo A
Markdown.md pegado

## Página 12

Si algún requisito futuro exige nested combos, entonces sí cambiaría el invariant.
Ahora mismo no pagaría esa complejidad.
5. Los modifiers serían propiedad exclusiva del MenuItem
Aquí escogería deliberadamente el camino simple que menciona la auditoría.
Es decir:
y:
son dos configuraciones diferentes, aunque visualmente tengan el mismo nombre.
No intentaría hacer ahora:
Porque enseguida aparecen problemas:
contra:
Markdown.md pegado
Hamburguesa
└── Extras
    ├── Extra queso
    ├── Extra tocino
    └── Sin cebolla
Pizza
└── Extras
    └── Extra queso
GlobalModifierGroup
GlobalModifierDefinition
MenuItemModifierAssignment
MenuItemModifierOverride
...
Extra queso en hamburguesa
+30g cheddar
+$15

## Página 13

Para un proyecto de esta escala:
Mucho más sencillo.
6. Mantendría IngredientEffect , pero endurecería su
semántica
Coincido con el documento en que:
no es un smell. 
Por ejemplo:
es perfectamente válido.
Mientras:
sí tiene efecto de inventario.
Pero evitaría dejar:
completamente abierto.
Extra queso en pizza
+80g mozzarella
+$30
ModifierGroup y ModifierOption son parte del agregado MenuItem .
ModifierOption
ingredientEffects = 0..N
Markdown.md pegado
Término de cocción
└── Bien cocida
    ingredientEffects = []
Extra queso
└── ADD queso 30 g
operation
quantity

## Página 14

Definiría algo concreto como:
con invariantes:
Así:
no depende de que la receta actualmente tenga exactamente 30 g.
7. Un modifier de un combo NO puede modificar recetas
de sus hijos
Este punto del documento me parece particularmente importante. 
No permitiría:
IngredientEffect
----------------
ingredientId
type
quantity?
unit?
type:
- ADD
- REMOVE
- OMIT
ADD
→ quantity obligatorio
REMOVE
→ quantity obligatorio
OMIT
→ quantity no aplica
Sin cebolla
→ OMIT cebolla
Markdown.md pegado
Combo
└── Sin cebolla
    → busca cebolla dentro de Hamburguesa

## Página 15

Eso rompe los límites.
Si alguien pide:
la personalización pertenece a:
no al combo.
Un modifier propio del combo sólo podría representar algo agregado directamente al
combo, por ejemplo:
Pero nunca navegaría hacia abajo para mutar sus hijos.
8. Añadiría cantidad por modifier
Aquí también coincido con la auditoría. 
Actualmente:
no dice necesariamente si puedo seleccionar:
Yo usaría:
Combo
├── Hamburguesa
│   └── Sin cebolla
└── Papas
Hamburguesa
Combo
└── Salsa extra
    → ADD salsa 30 ml
Markdown.md pegado
ModifierGroup.maxSelections
Extra queso ×3
ModifierOption
--------------
id

## Página 16

Ejemplo:
Entonces:
e inventario:
Muy limpio.
9. Resolvería definitivamente Pricing
Éste sí es un smell del modelo actual porque tienes simultáneamente:
sin semántica explícita. 
Yo escogería delta pricing:
y eliminaría:
name
priceDelta
maxQuantity
ingredientEffects[]
Extra queso
maxQuantity = 3
quantity seleccionada = 2
price effect =
2 × priceDelta
2 × IngredientEffect
basePrice
variant.price
modifier.priceDelta
comboOption.priceDelta
Markdown.md pegado
MenuItem.basePrice
MenuItemVariant.priceDelta
ModifierOption.priceDelta
ComboOption.priceDelta

## Página 17

La fórmula:
Importante:
NO significa:
Los precios independientes de los componentes no participan.
Sólo:
Por ejemplo:
10. Quitaría availability
MenuItemVariant.price
unitPrice =
    MenuItem.basePrice
    + Variant.priceDelta
    + Σ selectedModifier.priceDelta
    + Σ selectedComboOption.priceDelta
    + Σ childModifier.priceDelta
Combo $170
├── Hamburguesa $120
├── Papas $50
└── Coca $35
170 + 120 + 50 + 35
Combo.basePrice
+ upgrades
+ modifiers
Combo = $170
Cambiar:
Papas medianas → grandes
priceDelta = +$15
Total = $185

## Página 18

Cambiaría:
por:
por ejemplo:
Porque son conceptos completamente distintos:
mientras:
La auditoría señala precisamente esta ambigüedad. 
La disponibilidad real debería derivarse de:
Así puedes tener:
MenuItem.availability
MenuItem.status
ACTIVE
INACTIVE
ACTIVE
= el restaurante decidió venderlo
AVAILABLE
= operacionalmente puede venderse ahora
Markdown.md pegado
Menu configuration
+
Inventory state
+
Variant fulfillment
+
Combo components
Coca-Cola       ACTIVE
355 ml   AVAILABLE
600 ml   OUT_OF_STOCK
1 L      AVAILABLE

## Página 19

El MenuItem no está deshabilitado; una variante concreta está agotada.
11. Inventory no aparecería como entidades internas de
Menu
Esto:
en un diagrama del modelo de dominio de Menu puede inducir a pensar que Menu
posee esos objetos.
Yo pondría algo conceptualmente así:
y:
Con una nota:
No:
Ni asociaciones ORM entre servicios.
La propia auditoría ya advierte del riesgo de interpretar esas relaciones como asociaciones
persistentes cross-service. 
InventoryIngredient
InventorySKU
RecipeComponent
---------------
inventoryItemId
quantity
unit
StockedVariantDefinition
------------------------
inventoryItemId
quantity
inventoryItemId
→ referencia lógica al bounded context Inventory
Menu DB FK → Inventory DB
Markdown.md pegado

## Página 20

Además probablemente unificaría conceptualmente:
bajo algo como:
y dejaría que Inventory clasifique qué representa.
Menu no necesita conocer tanto.
12. Mantendría Recipe en Menu, no en Inventory
Para el diseño que llevan ustedes, mi decisión seguiría siendo:
porque:
es conocimiento de cómo está definido el producto.
Mientras Inventory conoce:
Inventory no debería saber qué es una hamburguesa.
Por tanto:
InventoryIngredient
InventorySKU
InventoryItem
MENU
owns
Recipe
"La hamburguesa usa:
150 g carne
30 g cebolla
20 g queso"
Carne:
stock = 12.4 kg
Cebolla:
stock = 8.1 kg

## Página 21

me parece correcto.
13. Corregiría los invariantes de Variant
El documento también señala correctamente que el diagrama actual permite
combinaciones inválidas. 
Ejemplo:
jamás debería existir:
Definiría:
14. Cambiaría también los límites de agregados
Aquí me separo un poco del análisis adjunto, porque hay otro riesgo importante.
Menu
Recipe
RecipeComponent
    inventoryItemId
Markdown.md pegado
Tamaño:
- Chico
- Grande
Variant:
[Chico, Grande]
1. Una variante tiene como máximo un VariantValue
   por VariantDimension.
2. Todos los VariantValues pertenecen
   al mismo MenuItem.
3. No existen dos MenuItemVariants
   con exactamente la misma combinación.
4. Una VariantDimension pertenece
   exclusivamente a un MenuItem.

## Página 22

Este dibujo:
no debería interpretarse como:
Yo tendría probablemente:
y separado:
Porque de lo contrario editar un modifier de una hamburguesa conceptualmente
requeriría cargar/modificar:
Eso sería horrible.
Menu --> contiene MenuItem puede seguir siendo cierto conceptualmente, pero no
significa una frontera transaccional.
También consideraría Recipe como agregado separado porque:
Menu
  └── MenuItem
       └── Variant
            └── ...
Todo Menu es un único agregado DDD gigante.
Aggregate Root: Menu
--------------------
id
restaurantId
name
description
Aggregate Root: MenuItem
------------------------
id
menuId
...
Menu
→ cientos de items
→ variantes
→ modifiers
→ recetas
→ combos

## Página 23

tiene identidad;
tiene versión;
puede evolucionar independientemente;
una variante la referencia por recipeId .
El modelo que yo dejaría
Reduciéndolo a lo esencial:
Qué desapareció
Del original eliminaría:
Cargando diagrama…
MenuItemVariant.price
→ reemplazado por priceDelta
MenuItemVariant.skuCode?
→ SKU/inventory mapping pertenece a StockedVariantDefinition
MenuItem.availability
→ reemplazado por status + disponibilidad derivada
StockedDefinition a nivel Item
→ StockedVariantDefinition
PreparedDefinition a nivel Item
→ PreparedVariantDefinition
ComboDefinition a nivel Item
→ ComboVariantDefinition

## Página 24

Y agregaría:
más invariantes explícitos.
Veredicto final
Yo no consideraría que el modelo original esté mal diseñado; diría que está una iteración
antes de quedar correctamente normalizado alrededor de la unidad vendible.
La transformación fundamental sería:
hacia:
AllowedVariant
→ innecesario porque ComboOption apunta a una variante concreta
InventoryIngredient
InventorySKU
→ no son entidades del dominio Menu
ModifierOption.maxQuantity
ANTES
MenuItem
├── Variant
├── Modifier
└── Fulfillment
DESPUÉS
MenuItem
│
├── Modifier configuration
│
└── MenuItemVariant       ← unidad vendible
        │
        └── fulfillment concreto
                │
                ├── inventoryItem
                ├── recipe
                └── combo slots

## Página 25

Y para mí el punto especialmente importante es que no introduciría todas las entidades
intermedias propuestas en la auditoría. Por ejemplo, no metería AllowedVariant ,
ComboSlotVariantRule , ComboOptionVariant , etc. simultáneamente. Aunque el archivo
identifica correctamente que esa relación falta, 
 apuntar directamente
desde una opción del combo a un MenuItemVariant concreto resuelve buena parte del
problema con un modelo bastante más pequeño.
En resumen: Variant pasa de ser una característica comercial opcional a ser la
representación de la unidad vendible concreta. Esa sería la decisión que usaría como eje
del rediseño.
Markdown.md pegado
Fuentes
Ver más
Opinion de consultor externo:
Las propuestas de la Auditoría 2 corrigen con éxito la
mayor falla estructural del modelo original —el
desacoplamiento entre variantes e inventario—,
transformando un diagrama conceptual en un modelo de
dominio transaccional sólido. Sin embargo, para simplificar
el motor de comandas, la Auditoría 2 traslada
intencionalmente una alta carga operativa hacia la gestión
del catálogo (backoffice).
Matriz de Evaluación de Decisiones
Opinion de consultor externo:
Las propuestas de la Auditoría 2 corrigen con éxito la
mayor falla estructural del modelo original —el
desacoplamiento entre variantes e inventario—,
transformando un diagrama conceptual en un modelo de
dominio transaccional sólido. Sin embargo, para simplificar
el motor de comandas, la Auditoría 2 traslada
intencionalmente una alta carga operativa hacia la gestión
del catálogo (backoffice).
Matriz de Evaluación de Decisiones
La opinión del consultor externo me parece bastante buena y, en general, mejora la
Auditoría 2. Hay un punto donde sí cambiaría mi propuesta anterior: el pricing. En los
demás, mantendría casi todo, aunque haría un par de matices importantes.
Mi conclusión después de incorporar esa revisión sería:
Mantener la variante como unidad vendible universal, pero hacer que
MenuItemVariant tenga unitPrice absoluto.

## Página 26

Ese cambio hace al modelo más coherente.
Sobre el pricing: el consultor tiene razón
Mi propuesta anterior:
funciona técnicamente, pero entra en tensión con la decisión arquitectónica principal.
Si afirmamos:
entonces es natural que tenga:
Ejemplo:
Esto es muchísimo más directo que:
MenuItem queda como definición comercial/conceptual; MenuItemVariant concentra
identidad vendible, precio y fulfillment concreto.
MenuItem.basePrice
+
MenuItemVariant.priceDelta
MenuItemVariant = unidad concreta que puede venderse
MenuItemVariant
---------------
id
menuItemId
unitPrice
Pizza Pepperoni
CHICA
unitPrice = 150
GRANDE
unitPrice = 200
FAMILIAR
unitPrice = 280
MenuItem.basePrice = 150

## Página 27

Especialmente cuando aparecen:
cambios de precios;
promociones;
precios importados;
integración con otros sistemas;
auditoría histórica;
variantes con precios completamente diferentes.
Por tanto, aquí aceptaría la corrección.
De hecho, daría un paso adicional: probablemente eliminaría basePrice de MenuItem
como dato autoritativo.
Si la UI necesita mostrar:
puede obtener:
o mantener una proyección denormalizada para lectura.
No tendría dos fuentes de verdad:
porque tarde o temprano divergen.
Los deltas siguen siendo correctos para modificadores y upgrades
Aquí no cambiaría.
CHICA    +0
GRANDE   +50
FAMILIAR +130
"Desde $150"
MIN(variant.unitPrice)
MenuItem.basePrice
MenuItemVariant.unitPrice
ModifierOption.priceDelta
ComboOption.priceDelta

## Página 28

siguen teniendo mucho sentido porque representan una modificación sobre una unidad
ya seleccionada.
Por ejemplo:
Total:
Lo mismo con un combo:
Aquí +25 es semánticamente un upgrade, no el precio absoluto de la malteada.
Así que el modelo queda mucho más limpio:
Sobre los combos: estoy de acuerdo con el consultor, pero el problema es
deliberado
Ésta es probablemente la decisión con mayor trade-off.
Si tenemos:
Pizza Grande = $200
+ Extra queso = +$25
+ Champiñón   = +$15
200 + 25 + 15 = 240
Combo Grande = $190
Bebida incluida:
Coca 600ml          +0
Agua                +0
Malteada            +25
MenuItemVariant.unitPrice       ← absoluto
ModifierOption.priceDelta       ← relativo
ComboOption.priceDelta          ← relativo
Combo Mediano

## Página 29

y:
la persistencia queda extremadamente sencilla.
El runtime básicamente recibe:
y pregunta:
Sí → válida.
No necesita deducir:
Eso me sigue pareciendo una muy buena decisión para Orders, que es donde quieres
determinismo.
El consultor identifica correctamente el precio:
Slot Bebida
├── Coca 600ml
├── Sprite 600ml
├── Fanta 600ml
...
Combo Grande
Slot Bebida
├── Coca 1L
├── Sprite 1L
├── Fanta 1L
...
comboVariantId
slotId
selectedMenuItemVariantId
¿esa variante está dentro de las ComboOptions del slot?
COMBO_SIZE=MEDIUM
→ map SIZE dimension
→ encontrar MEDIUM del child
→ validar excepciones
→ aplicar restricciones

## Página 30

Y eso no necesariamente es malo.
En sistemas transaccionales muchas veces prefiero:
antes que:
Especialmente para un restaurante.
Pero NO resolvería la duplicación metiéndola nuevamente al dominio
Éste es el matiz importante.
No introduciría sólo por ergonomía:
El consultor acierta al decir que la solución debería vivir principalmente en Application/UI.
Por ejemplo el administrador podría hacer:
y seleccionar:
El backend duplica:
desplazas complejidad del runtime hacia el backoffice.
Escritura/configuración más costosa
            ↓
Lectura/ejecución trivial
Configuración elegante
            ↓
motor de resolución complejo en cada orden
ComboVariantRule
ComboSizeMapping
VariantDimensionMapping
SlotInheritance
Crear Combo Grande
"Copiar configuración de Combo Mediano"

## Página 31

y después el administrador sustituye:
Otro mecanismo:
La UI genera las asociaciones necesarias.
Eso conserva un modelo persistido simple.
Sólo haría una pequeña mejora en ComboOption
Ahora había propuesto:
Lo dejaría así, pero probablemente le daría identidad:
porque empieza a tener comportamiento/configuración propia.
slots
options
Papas medianas → Papas grandes
Coca 600ml     → Coca 1L
Seleccionar 10 bebidas
[ Aplicar a:
  ☑ Combo chico
  ☑ Combo mediano
  ☑ Combo grande ]
ComboOption
-----------
menuItemVariantId
quantity
priceDelta
ComboOption
-----------
id
slotId
menuItemVariantId
quantity
priceDelta

## Página 32

Por ejemplo:
Dos apariciones del mismo MenuItemVariant en combos diferentes pueden tener precios
distintos.
Perfecto.
Modificadores exclusivos por MenuItem : mantendría la decisión
Aquí el consultor también señala correctamente el costo.
Supongamos:
Aunque comercialmente las tres opciones se llamen "Extra queso" , realmente son
comportamientos distintos.
Pueden cambiar:
Por eso duplicarlos no me parece realmente una anomalía del modelo.
Incluso si tienes 100 items con "Extra queso" :
Coca 600 ml
priceDelta = 0
Malteada chocolate
priceDelta = +25
Hamburguesa
└── Extra queso $15
Hot Dog
└── Extra queso $12
Pizza
└── Extra queso $30
precio
cantidad
ingrediente
máximo seleccionable

## Página 33

no necesariamente representa el concepto global Queso Extra.
Representa:
Eso es distinto.
El consultor habla de introducir global modifiers quizá con catálogos muy grandes. Yo
sería incluso más conservador: no usaría el número de items como único disparador.
Aunque haya 1000 productos, sólo introduciría reutilización si aparece una regla de
negocio como:
Entonces sí aparece un concepto nuevo del dominio.
No antes.
IngredientEffect : añadiría una pequeña corrección a ambas auditorías
La propuesta:
es razonable, pero yo revisaría muy bien si realmente necesitamos REMOVE .
Porque existen dos conceptos distintos:
significa:
ModifierOption
una personalización permitida sobre este producto.
"El restaurante administra catálogos globales de modificadores y asigna los mismos a
distintos productos".
ADD
REMOVE
OMIT
OMIT cebolla
no utilizar la cebolla definida por la receta.

## Página 34

Mientras:
puede significar:
Pero en restaurantes normalmente las operaciones más naturales serán:
y quizá:
Ejemplo:
Hay varias semánticas posibles.
Para su proyecto probablemente mantendría inicialmente:
y sólo agregaría REMOVE si existe un requisito real como:
No diseñaría el álgebra completa de recetas sin necesitarla.
REMOVE cebolla 10g
disminuir en 10 g la cantidad definida por receta.
ADD
OMIT
SET_QUANTITY
Normal:
Queso = 30g
Sin queso:
SET 0g
Poco queso:
SET 15g
Extra queso:
ADD 30g
ADD
OMIT
"poca cebolla".

## Página 35

Hay otro punto que sí reforzaría: Recipe no tiene por qué duplicarse
necesariamente
El consultor dice correctamente:
Pero no necesariamente necesitas:
Podrías extender más adelante:
Así:
Sin embargo, no lo pondría todavía salvo que el negocio realmente maneje escalado
proporcional.
Porque puede resultar falso:
Fulfillment por variante puede duplicar recetas cuando sólo cambia la escala.
Papas chica
→ Recipe A
Papas mediana
→ Recipe B
Papas grande
→ Recipe C
PreparedVariantDefinition
-------------------------
recipeId
scaleFactor
Recipe Papas
------------
Papa = 120 g
Sal  = 2 g
CHICA
scaleFactor = 1
MEDIANA
scaleFactor = 1.5
GRANDE
scaleFactor = 2

## Página 36

pero quizá:
no escala uniformemente.
Entonces:
es más verboso pero universal.
De nuevo, optimizaría después de observar patrones reales.
Mi modelo final después de las tres revisiones
Ahora lo dejaría conceptualmente así:
Pizza mediana
→ 200g masa
Pizza grande
→ 300g masa
queso:
80g → 110g
salsa:
50ml → 65ml
recipeId diferente por variante
Menu
│
└── agrupa MenuItems
MenuItem [Aggregate Root]
-------------------------
id
menuId
name
description
image
categoryId
status
fulfillmentType
│

## Página 37

Y:
Con:
├── VariantDimension
│     └── VariantValue
│
├── MenuItemVariant
│     id
│     unitPrice
│
└── ModifierGroup
      minSelections
      maxSelections
      │
      └── ModifierOption
            unitPriceDelta
            maxQuantity
            │
            └── IngredientEffect
MenuItemVariant
       │
       ├── STOCKED
       │      inventoryItemId
       │      quantity
       │
       ├── PREPARED
       │      recipeId
       │
       └── COMBO
              │
              └── ComboSlot
                    │
                    └── ComboOption
                          menuItemVariantId
                          quantity
                          priceDelta
Recipe [Aggregate Root]
-----------------------
id
name
version
RecipeComponent
---------------

## Página 38

Y Inventory no forma parte del agregado.
Una corrección terminológica pequeña
En mi propuesta anterior puse:
y seguiría usando ese nombre.
No pondría:
porque puede confundirlo con el precio unitario de la variante.
Mantendría:
Eso hace evidente la semántica.
El resultado importante
Después de incorporar la crítica del consultor, creo que aparece una separación bastante
elegante:
inventoryItemId
quantity
unit
ModifierOption.priceDelta
unitPriceDelta
MenuItemVariant.unitPrice
ModifierOption.priceDelta
ComboOption.priceDelta
                    MenuItem
                       │
             definición comercial
                       │
                       ▼
               MenuItemVariant
                       │
              unidad vendible real

## Página 39

Mientras que las personalizaciones son otra dimensión:
Eso me parece mucho más consistente que el modelo inicial.
Así que, incorporando al consultor externo, sí modificaría mi Auditoría 2 en el punto de
pricing y conservaría prácticamente todo lo demás. La principal decisión arquitectónica
final sería que MenuItem describe qué producto es, mientras que MenuItemVariant
describe qué unidad concreta puede comprarse, cuánto cuesta y cómo se cumple
operacionalmente. Esa separación ya es suficientemente fuerte como para empezar a
derivar agregados, invariantes y persistencia sin tener que rediseñar el dominio a mitad de
implementación.
                ┌──────┴───────┐
                │              │
             unitPrice    fulfillment
                               │
                     ┌─────────┼─────────┐
                     │         │         │
                  STOCKED   PREPARED   COMBO
MenuItem
   │
   └── ModifierGroup
          │
          └── ModifierOption
                 │
                 ├── priceDelta
                 └── IngredientEffect
La respuesta del autor de la Auditoría 2 es
arquitectónicamente madura y pragmática. Logra salir de
la trampa habitual de la sobre-ingeniería teórica para
aterrizar en un diseño que prioriza el rendimiento y la
consistencia en el punto de venta (POS) y cocina (KDS).
Aciertos Críticos de la Réplica
Eliminación de la doble fuente de verdad en Pricing:
Eliminar basePrice como dato autoritativo en
MenuItem y dejarlo como una proyección
(
)
l
d
í
ibl
La respuesta del autor de la Auditoría 2 es
arquitectónicamente madura y pragmática. Logra salir de
la trampa habitual de la sobre-ingeniería teórica para
aterrizar en un diseño que prioriza el rendimiento y la
consistencia en el punto de venta (POS) y cocina (KDS).
Aciertos Críticos de la Réplica
Eliminación de la doble fuente de verdad en Pricing:
Eliminar basePrice como dato autoritativo en
MenuItem y dejarlo como una proyección
(
)
l
d
í
ibl

## Página 40

Ver más
Procesó durante 24s
El consultor detectó un punto ciego real. Y después de incorporarlo, sí haría una
modificación adicional antes de pasar al DDL. No usaría exactamente
VariantModifierOverride , porque podemos resolverlo de una forma más coherente con
la arquitectura que ya construimos.
La premisa que venimos defendiendo es:
Si aceptamos eso, entonces un modifier que altera precio o consumo tampoco debería
asumir que esos valores son iguales para todas las variantes.
El problema es real
Con:
el modelo actual está diciendo implícitamente:
y ésa es una afirmación de dominio bastante fuerte.
Para cosas como:
MenuItem define qué producto es.
MenuItemVariant define qué unidad concreta se vende, cuánto cuesta y cómo se
produce.
Pizza Pepperoni
├── Chica     $150
└── Familiar  $280
Extra queso
├── +$25
└── ADD queso 40g
Extra queso(Pizza Chica)
=
Extra queso(Pizza Familiar)
Sin cebolla
Bien cocida

## Página 41

puede funcionar perfectamente.
Pero para:
es muy probable que tamaño → precio y consumo cambien.
No elegiría VariantModifierOverride
La solución del consultor:
es viable, pero introduce semántica de:
Entonces empiezas a tener que resolver:
No es terrible, pero justamente venimos eliminando ambigüedades de ese estilo.
Yo haría algo ligeramente diferente.
Separaría definición y configuración
Salsa aparte
Extra queso
Extra pepperoni
Doble carne
Extra salsa
VariantModifierOverride
-----------------------
variantId
modifierOptionId
priceDelta
ingredientEffect
valor default en ModifierOption
+
override opcional
¿Existe override?
  sí → úsalo
  no → usa el padre

## Página 42

y:
Sus IngredientEffect pertenecerían a esta configuración:
Entonces:
es el concepto de personalización, mientras que:
es su comportamiento concreto.
Y:
es otro.
Esto encaja mucho mejor con el resto del modelo.
ModifierOption
--------------
id
name
VariantModifierConfig
---------------------
variantId
modifierOptionId
priceDelta
maxQuantity
VariantModifierConfig
        │
        └── 0..N IngredientEffect
Extra queso
Extra queso + Pizza chica
→ +$25
→ ADD queso 40g
Extra queso + Pizza familiar
→ +$45
→ ADD queso 90g

## Página 43

Ejemplo completo
Configuración:
y:
Ahora todo es determinista.
Esto cambia ligeramente el significado de ModifierOption
Antes teníamos:
MenuItem: Pizza Pepperoni
Variants
├── CHICA
│   unitPrice = $150
│
└── FAMILIAR
    unitPrice = $280
ModifierGroup: Extras
ModifierOption:
└── EXTRA_QUESO
VariantModifierConfig
variant = CHICA
modifier = EXTRA_QUESO
priceDelta = $25
maxQuantity = 2
IngredientEffect
ADD queso 40g
VariantModifierConfig
variant = FAMILIAR
modifier = EXTRA_QUESO
priceDelta = $45
maxQuantity = 2
IngredientEffect
ADD queso 90g

## Página 44

Yo ahora lo reduciría a algo como:
Quizá otros metadatos puramente descriptivos.
Y movería aquello que afecta la ejecución:
a:
Porque son propiedades de cómo ese modifier se comporta sobre una unidad vendible
concreta.
Conceptualmente queda muy bonito:
¿Eso no aumenta muchísimo los registros?
ModifierOption
--------------
name
priceDelta
maxQuantity
IngredientEffect[]
ModifierOption
--------------
id
name
priceDelta
maxQuantity
IngredientEffect
VariantModifierConfig
ModifierOption
= qué personalización existe
VariantModifierConfig
= qué significa aplicar esa personalización
  a esta variante

## Página 45

Sí.
Supongamos:
Pero es exactamente el mismo trade-off que aceptamos para combos.
Preferimos:
a cambio de:
Y además se puede solucionar desde el backoffice:
Después el administrador sólo modifica:
La persistencia sigue siendo explícita.
Pero hay un detalle importante: no todos los modifiers
necesitan cambiar
3 tamaños
×
10 modifiers
=
30 VariantModifierConfig
más configuración explícita
menos inferencia durante la venta.
[Copiar modifiers de variante Chica]
☑ Extra queso
☑ Extra pepperoni
☑ Sin cebolla
☑ Salsa aparte
Aplicar a: Familiar
Extra queso:
$25 → $45
40g → 90g

## Página 46

No diseñaría un sistema de herencia automáticamente.
Simplemente la UI puede clonar configuraciones.
Por ejemplo:
Hay duplicación.
Eso está bien.
Son dos hechos explícitos:
En un catálogo de restaurante, unas decenas o cientos de filas adicionales son irrelevantes
comparadas con introducir reglas implícitas difíciles de auditar.
Y obtenemos otra capacidad gratis: applicability
Imagínate:
Modifier:
Quizá sólo tenga sentido en la sencilla.
Sin cebolla
CHICA:
priceDelta = 0
OMIT cebolla
FAMILIAR:
priceDelta = 0
OMIT cebolla
En la variante chica se permite sin cebolla.
En la familiar también.
Hamburguesa
├── Sencilla
└── Doble
Agregar segunda carne

## Página 47

Con el modelo anterior necesitábamos:
Con este modelo simplemente:
Por tanto:
Muy limpio.
maxQuantity también puede variar
Esto además resuelve otro caso:
Así que movería:
también aquí:
ModifierOption
applicableVariants?
SENCILLA
└── VariantModifierConfig(Agregar carne)
DOBLE
└── no existe configuración
existencia de VariantModifierConfig
=
modifier permitido en esa variante
Pizza chica
Extra queso máximo ×1
Pizza familiar
Extra queso máximo ×3
maxQuantity
VariantModifierConfig
---------------------
variantId
modifierOptionId

## Página 48

Mientras:
pueden seguir siendo comunes al MenuItem inicialmente.
Sólo si aparece un requisito real del estilo:
tendríamos que hacer también variant-aware al grupo.
No lo haría ahora.
No recomiendo la alternativa de convertir tamaños en
MenuItem separados
Aquí sí discrepo bastante del consultor.
Hacer:
para resolver modifiers sería una salida funcional, pero conceptualmente supone
abandonar precisamente la abstracción que acabamos de construir.
Terminas duplicando:
priceDelta
maxQuantity
ModifierGroup.minSelections
ModifierGroup.maxSelections
Pizza chica:
elige máximo 2 toppings
Pizza familiar:
elige máximo 4 toppings
Pizza Pepperoni Chica       ← MenuItem
Pizza Pepperoni Familiar    ← MenuItem
nombre
descripción
imagen
categoría
modifier groups

## Página 49

Y además:
deja de existir como concepto agrupador natural.
Usaría dos MenuItem sólo si comercialmente son realmente dos productos diferentes, no
porque técnicamente necesitemos precios de modifiers diferentes.
Por ejemplo:
pueden ser productos distintos si así los administra el restaurante.
Pero:
son precisamente casos donde Variant aporta valor.
Hay una corrección pequeña al comentario sobre
complejidad de combos
El consultor dice que la solución aplanada es "$O(1)$" y contrasta eso con resolución
potencialmente exponencial.
La intuición es correcta —la configuración explícita hace el runtime mucho más
determinista— pero no usaría literalmente "exponencial" como argumento arquitectónico.
Con índices adecuados:
estatus
combo associations
reporting
etc.
Pizza Pepperoni
Hamburguesa clásica
Hamburguesa doble
Coca 355ml / 600ml
Pizza chica / mediana / grande
(comboVariantId, slotId, menuItemVariantId)

## Página 50

la validación puede ser prácticamente una búsqueda indexada.
Pero una solución basada en reglas tampoco tiene por qué ser exponencial
necesariamente.
La ventaja verdadera es otra:
Eso es mucho más importante que la notación asintótica.
Entonces actualizaría el modelo una última vez
La zona de modifiers quedaría:
Hay una distinción importante:
pero:
No son ideas contradictorias.
No hay inferencia de negocio en el momento crítico de tomar la orden.
Cargando diagrama…
MenuItem
owns
ModifierGroup / ModifierOption
MenuItemVariant
configura
cómo se ejecuta cada ModifierOption

## Página 51

La arquitectura empieza a mostrar un patrón muy
consistente
Ahora tenemos:
Y debajo de MenuItemVariant :
Esto me parece más coherente que la versión anterior.
Mi decisión final
El punto detectado por el consultor sí merece modificar el modelo antes del DDL si el
sistema contempla productos con tamaños y extras que consumen cantidades diferentes
—algo bastante natural en un restaurante.
No implementaría un sistema genérico de Override , ni convertiría tamaños artificialmente
en MenuItem independientes.
                     MenuItem
                        │
             definición comercial
                        │
          ┌─────────────┴────────────┐
          │                          │
          ▼                          ▼
 MenuItemVariant              ModifierOption
 unidad vendible              personalización
          │                          │
          └────────────┬─────────────┘
                       ▼
            VariantModifierConfig
                       │
               comportamiento
                  concreto
MenuItemVariant
│
├── unitPrice
│
└── Fulfillment
      ├── STOCKED
      ├── PREPARED
      └── COMBO

## Página 52

Haría explícita una asociación:
y trasladaría ahí:
Con eso llegamos a una regla muy fuerte y simple:
Ese principio empieza a convertirse en el verdadero eje del modelo, y creo que con esta
corrección ya sí cerraría el modelo conceptual antes de bajar a tablas y contratos.
VariantModifierConfig
priceDelta
maxQuantity
IngredientEffect[]
Todo dato que afecte concretamente cuánto se cobra o cuánto se consume
pertenece, directa o indirectamente, a MenuItemVariant , porque ésa es la unidad
que realmente se vende.
ChatGPT puede cometer errores. Se debe comprobar la información importante

## Página 53

*(Página sin contenido sustancial)*

