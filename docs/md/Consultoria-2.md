# Consultoria-2

## Página 1

User prompt: Se tuvieron dos auditorias sobre un modelo para un sistema de comandas para restaurantes y necesito tu opinion como consultor externo frente a las decisiones planteadas y problemas. Se tiene el modelo a auditar:

```mermaid
flowchart TD
    %% =====================================================
    %% MENU
    %% =====================================================
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

    %% =====================================================
    %% MODIFIERS
    %% =====================================================
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

    %% =====================================================
    %% VARIANTS
    %% =====================================================
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

    %% =====================================================
    %% FULFILLMENT
    %% =====================================================
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

    %% =====================================================
    %% PREPARED / RECIPE
    %% =====================================================
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

    %% =====================================================
    %% STOCKED
    %% =====================================================
    SKU["InventorySKU
    ─────────────
    id
    name
    unit"]
    STOCK -->|skuId| SKU

    %% =====================================================
    %% COMBO
    %% =====================================================
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
```

Donde se hizo un análisis y auditoria en dos ocasiones (los archivos adjuntos). La primera auditoria (auditoria-1.txt) se realizó con el fin de detectar agujeros, smells, problemas y ambiguedades del modelo a revisar. A La segunda auditoria (auditoria-2.txt) se le presentó el modelo en revisión, los hallazgos de la primera auditoria y se le pidió que decidiera las soluciones a los hallazgos encontrados. Tu rol en este caso es determinar como consultor externo que de lo presentado en la auditoria 2 es viable, ventajas, desventajas básicamente respecto a las soluciones planteadas y al modelo original en revisión.

Response: Las propuestas de la **Auditoría 2** corrigen con éxito la mayor falla estructural del modelo original —el desacoplamiento entre variantes e inventario—, transformando un diagrama conceptual en un modelo de dominio transaccional sólido. Sin embargo, para simplificar el motor de comandas, la Auditoría 2 traslada intencionalmente una alta carga operativa hacia la gestión del catálogo (backoffice).

### Matriz de Evaluación de Decisiones

| Decisión (Auditoría 2) | Viabilidad | Ventajas | Desventajas / Riesgos | Veredicto Consultor |
| :--- | :--- | :--- | :--- | :--- |
| **1. MenuItemVariant como unidad** | **Alta** | Elimina bifurcaciones `if (item.hasVariants)` en checkout, cocina y | Sobrecarga de registros en base de datos para ítems | **Aprobar.** Es el estándar en motores de punto de venta |

---

## Página 2

| Decisión (Auditoría 2) | Viabilidad | Ventajas | Desventajas / Riesgos | Veredicto Consultor |
| :--- | :--- | :--- | :--- | :--- |
| **vendible universal (Patrón Default Variant)** | | stock; simplifica la línea de comanda a una tupla `(item, variant)`. | unitarios simples (e.g., refresco de lata única). | modernos (Square, Shopify). |
| **2. Fulfillment en Variant (StockedVariant, PreparedVariant)** | **Alta** | Resuelve la inconsistencia del modelo original: cada tamaño o presentación consume su SKU o receta real. | Duplica recetas si el restaurante escala ingredientes linealmente por tamaño sin un motor de escalado. | **Aprobar.** Innegociable para un control de inventario confiable. |
| **3. Combo simplificado (ComboOption → MenuItemVariant)** | **Media** | Resolución directa en runtime ($O(1)$) sin resolver complejas matrices de validación cruzada. | Explosión combinatoria y fricción administrativa. Si un combo de 3 tamaños admite 10 bebidas, se deben configurar 30 opciones manualmente. | **Aprobar condicionado.** Excelente para el motor de pedidos, pero requiere herramientas de clonación/plantillas en el panel de administración. |
| **4. Modificadores con ownership exclusivo de MenuItem** | **Media-Alta** | Aislamiento perfecto del agregado DDD; evita sobreescrituras complejas de precios/ingredientes por ítem. | Imposibilidad de actualizar precios masivamente (cambiar el costo de "Extra Queso" requiere editar $N$ productos). | **Aprobar en v1.** Para un MVP o sistema mediano evita abstracciones prematuras; introducir modificadores globales solo si el catálogo supera ~500 ítems. |
| **5. Semántica de efectos (ADD, REMOVE, OMIT) y multiplicidad** | **Alta** | Reglas deterministas para inventario; `OMIT` desacopla la receta de la exclusión; `maxQuantity` modela pedidos reales (e.g., 2x queso). | Requiere validación en la capa de aplicación para evitar inconsistencias (e.g., `REMOVE` de un ingrediente que no existe en la receta). | **Aprobar.** Robustez inmediata en KDS (pantallas de cocina) y stock. |
| **6. Delta Pricing (basePrice + priceDelta)** | **Media** | Facilita promociones y cambios de precio a nivel de producto padre. | Incoherencia conceptual con la Decisión 1. Si la variante es la unidad vendible concreta, el precio debería ser absoluto en la variante (`variant.price`) y el `basePrice` del ítem solo un valor informativo ("desde $X"). | **Modificar.** Asignar el precio unitario base a `MenuItemVariant` reduce ambigüedades matemáticas en combos y variantes. |
| **7. Bounded Contexts y límites de Agregados** | **Alta** | Evita contención de base de datos y deadlocks | Requiere consistencia eventual y sincronización vía | **Aprobar.** Fundamental para |

---

## Página 3

| Decisión (Auditoría 2) | Viabilidad | Ventajas | Desventajas / Riesgos | Veredicto Consultor |
| :--- | :--- | :--- | :--- | :--- |
| **(Menu, MenuItem, Recipe)** | | transaccionales; desacopla Inventory mediante referencias por ID (`inventoryItemId`). | eventos de dominio o consultas orquestadas. | escalabilidad y mantenibilidad. |

### Análisis Crítico de Trade-offs Clave

**La dicotomía de los Combos:** El modelo original tenía un diseño donde `AllowedVariant` era una entidad anémica sin capacidad de mapeo real. Auditoría 1 sugería un sistema relacional de reglas por tamaño (`ComboSlotVariantRule`), mientras Auditoría 2 optó por aplanar todo a `ComboOption -> MenuItemVariant`.
- *Criterio:* La solución de Auditoría 2 es superior para el motor transaccional de comandas (el POS solo valida si la opción existe en el slot). Sin embargo, el costo oculto está en el panel de administración. Se debe mitigar a nivel de UI/Application Layer con funciones como "aplicar variante a todos los slots equivalentes", evitando que el modelo de datos pague el costo de esa complejidad.

**Pricing: La grieta en la propuesta:** Auditoría 2 defiende que `MenuItemVariant` es la verdadera unidad vendible, pero en el punto 9 propone calcular el precio como:

$$\text{unitPrice} = \text{MenuItem.basePrice} + \text{Variant.priceDelta} + \sum \text{Modifier.priceDelta}$$

Esto reintroduce un acoplamiento innecesario. Si un producto como una Pizza se vende en Grande ($200) y Familiar ($280), obligar al usuario a definir un `basePrice` de $200 con deltas de $0 y +$80 es forzado y propenso a errores en promociones.
- *Ajuste recomendado:* Declarar `MenuItemVariant.unitPrice` como un valor absoluto. Las personalizaciones opcionales (`ModifierOption` y mejoras de `ComboOption`) sí deben permanecer como deltas (`priceDelta`).

**Invariante de Modificadores en Combos:** La regla propuesta en Auditoría 2 que prohíbe a un modificador de combo mutar recetas hijas (Combo -> Modificador no puede tocar Hamburguesa -> Receta) es una de las decisiones más acertadas del documento. Traspasar esa frontera generaría grafos de mutación profundos difíciles de reconciliar en cocina y auditorías de inventario.

### Hoja de Ruta para Implementación

- **Adoptar de inmediato:** El concepto de variante por defecto, el traslado de Fulfillment a nivel de variante, la partición de agregados DDD (`MenuItem` independiente de `Menu`), y la semántica formal de `IngredientEffect`.
- **Refinar antes de persistir:** Cambiar la fórmula de delta pricing por precio unitario directo en `MenuItemVariant`.
- **Vigilar en desarrollo:** Asegurar que el equipo de frontend/UI diseñe herramientas de carga masiva para los combos y grupos de modificadores, compensando la duplicación estructural deliberada que adoptó el modelo en favor de la simplicidad de ejecución.

---

User prompt: Que opinas de la respuesta del que realizó la auditoria-2? La opinión del consultor externo me parece bastante buena y, en general, mejora la Auditoría 2. Hay un punto donde sí cambiaría mi propuesta anterior: el pricing. En los demás, mantendría casi todo, aunque haría un par de matices importantes. Mi conclusión después de incorporar esa revisión sería: Mantener la variante como unidad vendible universal, pero hacer que `MenuItemVariant` tenga `unitPrice` absoluto. MenuItem queda como definición comercial/conceptual;

---

## Página 4

`MenuItemVariant` concentra identidad vendible, precio y fulfillment concreto. Ese cambio hace al modelo más coherente. Sobre el pricing: el consultor tiene razón. Mi propuesta anterior: `MenuItem.basePrice + MenuItemVariant.priceDelta` funciona técnicamente, pero entra en tensión con la decisión arquitectónica principal. Si afirmamos: `MenuItemVariant` = unidad concreta que puede venderse, entonces es natural que tenga:

```
MenuItemVariant
---------------
id
menuItemId
unitPrice
```

Ejemplo:
```
Pizza Pepperoni
CHICA unitPrice = 150
GRANDE unitPrice = 200
FAMILIAR unitPrice = 280
```
Esto es muchísimo más directo que:
```
MenuItem.basePrice = 150
CHICA +0
GRANDE +50
FAMILIAR +130
```
Especialmente cuando aparecen: cambios de precios; promociones; precios importados; integración con otros sistemas; auditoría histórica; variantes con precios completamente diferentes. Por tanto, aquí aceptaría la corrección. De hecho, daría un paso adicional: probablemente eliminaría `basePrice` de `MenuItem` como dato autoritativo. Si la UI necesita mostrar: "Desde $150" puede obtener: `MIN(variant.unitPrice)` o mantener una proyección denormalizada para lectura. No tendría dos fuentes de verdad: `MenuItem.basePrice` y `MenuItemVariant.unitPrice` porque tarde o temprano divergen.

Los deltas siguen siendo correctos para modificadores y upgrades. Aquí no cambiaría. `ModifierOption.priceDelta` y `ComboOption.priceDelta` siguen teniendo mucho sentido porque representan una modificación sobre una unidad ya seleccionada. Por ejemplo:
```
Pizza Grande = $200
+ Extra queso = +$25
+ Champiñón = +$15
Total: 200 + 25 + 15 = 240
```
Lo mismo con un combo:
```
Combo Grande = $190
Bebida incluida:
Coca 600ml +0
Agua +0
Malteada +25
```
Aquí +25 es semánticamente un upgrade, no el precio absoluto de la malteada. Así que el modelo queda mucho más limpio:
- `MenuItemVariant.unitPrice` $\leftarrow$ absoluto
- `ModifierOption.priceDelta` $\leftarrow$ relativo
- `ComboOption.priceDelta` $\leftarrow$ relativo

Sobre los combos: estoy de acuerdo con el consultor, pero el problema es deliberado. Ésta es probablemente la decisión con mayor trade-off. Si tenemos:
```
Combo Mediano
Slot Bebida
├── Coca 600ml
├── Sprite 600ml
└── Fanta 600ml ...
```
y:
```
Combo Grande
Slot Bebida
├── Coca 1L
├── Sprite 1L
└── Fanta 1L ...
```
la persistencia queda extremadamente sencilla. El runtime básicamente recibe: `comboVariantId`, `slotId`, `selectedMenuItemVariantId` y pregunta: ¿esa variante está dentro de las `ComboOptions` del slot? Sí $\rightarrow$ válida. No necesita deducir: `COMBO_SIZE=MEDIUM -> map SIZE dimension -> encontrar MEDIUM del child -> validar excepciones -> aplicar restricciones`. Eso me sigue pareciendo una muy buena decisión para Orders, que es donde quieres determinismo. El consultor identifica correctamente el precio: desplazas complejidad del runtime hacia el backoffice. Y eso no necesariamente es malo. En sistemas transaccionales muchas veces prefiero:
Escritura/configuración más costosa $\downarrow$ Lectura/ejecución trivial antes que: Configuración elegante $\downarrow$ motor de resolución complejo en cada orden. Especialmente para un restaurante.

Pero NO resolvería la duplicación metiéndola nuevamente al dominio. Éste es el matiz importante. No introduciría sólo por ergonomía: `ComboVariantRule`, `ComboSizeMapping`, `VariantDimensionMapping`, `SlotInheritance`. El consultor acierta al decir que la solución debería vivir principalmente en Application/UI. Por ejemplo el administrador podría hacer: Crear Combo Grande y seleccionar: "Copiar configuración de Combo Mediano". El backend duplica: slots, options y después el administrador sustituye: `Papas medianas -> Papas grandes`, `Coca 600ml -> Coca 1L`. Otro mecanismo: Seleccionar 10 bebidas `[ Aplicar a: ☑ Combo chico ☑ Combo mediano ☑ Combo grande ]`. La UI genera las asociaciones necesarias. Eso conserva un modelo persistido simple.

Sólo haría una pequeña mejora en `ComboOption`. Ahora había propuesto:
```
ComboOption
-----------
menuItemVariantId
quantity
priceDelta
```
Lo dejaría así, pero probablemente le daría identidad:
```
ComboOption
-----------
id
slotId
menuItemVariantId
quantity
priceDelta
```
porque empieza a tener comportamiento/configuración propia. Por ejemplo: `Coca 600 ml priceDelta = 0`, `Malteada chocolate priceDelta = +25`. Dos apariciones del mismo `MenuItemVariant` en combos diferentes pueden tener precios distintos. Perfecto.

Modificadores exclusivos por `MenuItem`: mantendría la decisión. Aquí el consultor también señala correctamente el costo. Supongamos:
```
Hamburguesa
└── Extra queso $15
Hot Dog
└── Extra queso $12
Pizza
└── Extra queso $30
```
Aunque comercialmente las tres opciones se llamen "Extra queso", realmente son comportamientos distintos. Pueden cambiar: precio, cantidad, ingrediente, máximo seleccionable. Por eso duplicarlos no me parece realmente una anomalía del modelo. Incluso si tienes 100 items con "Extra queso": `ModifierOption` no necesariamente representa el concepto global Queso Extra. Representa: una personalización permitida sobre este producto. Eso es distinto. El consultor habla de introducir global modifiers quizá con catálogos muy grandes. Yo sería incluso más conservador: no usaría el número de items como único disparador. Aunque haya 1000 productos, sólo introduciría reutilización si aparece una regla de negocio como: "El restaurante administra catálogos globales de modificadores y asigna los mismos a distintos productos". Entonces sí aparece un concepto nuevo del dominio. No antes.

`IngredientEffect`: añadiría una pequeña corrección a ambas auditorías. La propuesta: `ADD`, `REMOVE`, `OMIT` es razonable, pero yo revisaría muy bien si realmente necesitamos `REMOVE`. Porque existen dos conceptos distintos: `OMIT cebolla` significa: no utilizar la cebolla definida por la receta. Mientras: `REMOVE cebolla 10g` puede significar: disminuir en 10 g la cantidad definida por receta. Pero en restaurantes normalmente las operaciones más naturales serán: `ADD`, `OMIT` y quizá: `SET_QUANTITY`. Ejemplo:
```
Normal: Queso = 30g
Sin queso: SET 0g
Poco queso: SET 15g
Extra queso: ADD 30g
```
Hay varias semánticas posibles. Para su proyecto probablemente mantendría inicialmente: `ADD`, `OMIT` y sólo agregaría `REMOVE` si existe un requisito real como: "poca cebolla". No diseñaría el álgebra completa de recetas sin necesitarla. Hay otro punto que sí reforzaría: Recipe no tiene por qué duplicarse

---

## Página 5

necesariamente. El consultor dice correctamente: Fulfillment por variante puede duplicar recetas cuando sólo cambia la escala. Pero no necesariamente necesitas: `Papas chica -> Recipe A`, `Papas mediana -> Recipe B`, `Papas grande -> Recipe C`. Podrías extender más adelante:
```
PreparedVariantDefinition
-------------------------
recipeId
scaleFactor
```
Así:
```
Recipe Papas
------------
Papa = 120 g
Sal = 2 g
CHICA scaleFactor = 1
MEDIANA scaleFactor = 1.5
GRANDE scaleFactor = 2
```
Sin embargo, no lo pondría todavía salvo que el negocio realmente maneje escalado proporcional. Porque puede resultar falso: `Pizza mediana -> 200g masa`, `Pizza grande -> 300g masa`, pero quizá: `queso: 80g -> 110g`, `salsa: 50ml -> 65ml` no escala uniformemente. Entonces: `recipeId` diferente por variante es más verboso pero universal. De nuevo, optimizaría después de observar patrones reales.

Mi modelo final después de las tres revisiones ahora lo dejaría conceptualmente así:
```
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
├── VariantDimension
│   └── VariantValue
│
├── MenuItemVariant
│   id
│   unitPrice
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

Y:
MenuItemVariant
│
├── STOCKED
│   inventoryItemId
│   quantity
│
├── PREPARED
│   recipeId
│
└── COMBO
      │
      └── ComboSlot
            │
            └── ComboOption
                  menuItemVariantId
                  quantity
                  priceDelta

Con:
Recipe [Aggregate Root]
-----------------------
id
name
version
RecipeComponent
---------------
inventoryItemId
quantity
unit
```
Y Inventory no forma parte del agregado.

Una corrección terminológica pequeña: En mi propuesta anterior puse: `ModifierOption.priceDelta` y seguiría usando ese nombre. No pondría: `unitPriceDelta` porque puede confundirlo con el precio unitario de la variante. Mantendría: `MenuItemVariant.unitPrice`, `ModifierOption.priceDelta`, `ComboOption.priceDelta`. Eso hace evidente la semántica.

El resultado importante: Después de incorporar la crítica del consultor, creo que aparece una separación bastante elegante:
```
           MenuItem
              │
    definición comercial
              │
              ▼
       MenuItemVariant
              │
     unidad vendible real
       ┌──────┴───────┐
       │              │
   unitPrice     fulfillment
                      │
            ┌─────────┼─────────┐
            │         │         │
         STOCKED   PREPARED   COMBO
```
Mientras que las personalizaciones son otra dimensión:
```
MenuItem
   │
   └── ModifierGroup
          │
          └── ModifierOption
                 │
                 ├── priceDelta
                 └── IngredientEffect
```
Eso me parece mucho más consistente que el modelo inicial. Así que, incorporando al consultor externo, sí modificaría mi Auditoría 2 en el punto de pricing y conservaría prácticamente todo lo demás. La principal decisión arquitectónica final sería que `MenuItem` describe qué producto es, mientras que `MenuItemVariant` describe qué unidad concreta puede comprarse, cuánto cuesta y cómo se cumple operacionalmente. Esa separación ya es suficientemente fuerte como para empezar a derivar agregados, invariantes y persistencia sin tener que rediseñar el dominio a mitad de implementación.

Response: La respuesta del autor de la Auditoría 2 es **arquitectónicamente madura y pragmática**. Logra salir de la trampa habitual de la sobre-ingeniería teórica para aterrizar en un diseño que prioriza el rendimiento y la consistencia en el punto de venta (POS) y cocina (KDS).

### Aciertos Críticos de la Réplica

- **Eliminación de la doble fuente de verdad en Pricing:** Eliminar `basePrice` como dato autoritativo en `MenuItem` y dejarlo como una proyección (`MIN(variant.unitPrice)`) resuelve de raíz posibles desincronizaciones. `MenuItemVariant.unitPrice` como valor absoluto fija una frontera transaccional limpia.
- **Defensa del Trade-off en Combos ($O(1)$ en Runtime):** La decisión de absorber la redundancia en la configuración (backoffice) para tener un motor de pedidos instantáneo y determinista es impecable. En pleno servicio de restaurante, resolver un combo verificando si `selectedVariantId` pertenece a la lista del slot es exponencialmente más seguro que evaluar árboles de inferencia dinámicos.
- **Semántica culinaria real (OMIT vs REMOVE):** Sustituir la deducción matemática (`REMOVE 10g`) por la directiva culinaria (`OMIT`) refleja el flujo real de cocina: "sin cebolla" es una exclusión en comanda, no una operación de resta sobre el gramaje estándar.
- **Rechazo al scaleFactor lineal en Recetas:** Reconocer que los insumos no escalan proporcionalmente (la masa de una pizza escala por área $\pi r^2$, mientras que la salsa o el horneado tienen curvas distintas) previene bugs graves en el costeo e inventario.

### El Punto Ciego que Emerge: Modificadores dependientes del Tamaño

Al mover la variante a unidad vendible pero dejar `ModifierGroup` anclado estrictamente a `MenuItem`, aparece una limitación clásica de la restauración que debe quedar documentada:

---

## Página 6

```
Pizza Pepperoni (MenuItem)
├── Variant Chica    ($150)
└── Variant Familiar ($280)

Modifier: "Extra Queso"
└── priceDelta = $25
└── IngredientEffect = ADD 40g queso
```

Si el modificador pertenece a `MenuItem`:
- **El costo y la porción son fijos:** El sistema cobrará $25 y descargará 40g de queso tanto si el cliente pide una pizza Chica como si pide una Familiar.
- En la práctica de restaurantes, el "Extra Queso" de una pizza familiar suele costar más ($45) y consumir más insumo (90g) que en una individual.

#### Cómo abordarlo sin destruir la simplicidad alcanzada:

1. **Asumir el compromiso (Recomendado para MVP):** Si el negocio tolera precios promedio para agregados ("cualquier extra cuesta $X sin importar el tamaño"), el modelo actual es suficiente.
2. **Separación por producto:** Si las porciones y precios varían radicalmente, el catálogo comercial suele crear `Pizza Pepperoni Chica` y `Pizza Pepperoni Familiar` como dos `MenuItems` independientes con sus propios modificadores.
3. **Extensión futura (solo si el negocio lo exige):** Permitir una tabla intermedia `VariantModifierOverride(variantId, modifierOptionId, priceDelta, ingredientEffect)` que sobreescriba los valores por defecto del ítem padre. No la implementaría ahora, pero conviene tenerla mapeada.

### Veredicto del Consultor

El modelo presentado en esta última respuesta **está listo para pasar a la fase de diseño relacional (DDL) y contratos de API**. Resuelve con éxito las ambigüedades de fulfillment, pricing, límites de agregados e inventario sin caer en abstracciones innecesarias.

La premisa de que **MenuItem describe qué producto es y MenuItemVariant define qué se vende, cuánto cuesta y cómo se produce** es la base canónica que sostendrá el sistema a largo plazo.

---

User prompt: El consultor detectó un punto ciego real. Y después de incorporarlo, sí haría una modificación adicional antes de pasar al DDL. No usaría exactamente `VariantModifierOverride`, porque podemos resolverlo de una forma más coherente con la arquitectura que ya construimos. La premisa que venimos defendiendo es: `MenuItem` define qué producto es. `MenuItemVariant` define qué unidad concreta se vende, cuánto cuesta y cómo se produce. Si aceptamos eso, entonces un modifier que altera precio o consumo tampoco debería asumir que esos valores son iguales para todas las variantes. El problema es real Con:
```
Pizza Pepperoni
├── Chica $150
└── Familiar $280
Extra queso
├── +$25
└── ADD queso 40g
```
el modelo actual está diciendo implícitamente: `Extra queso(Pizza Chica) = Extra queso(Pizza Familiar)` y ésa es una afirmación de dominio bastante fuerte. Para cosas como: Sin cebolla, Bien cocida, Salsa aparte puede funcionar perfectamente. Pero para: Extra queso, Extra pepperoni, Doble carne, Extra salsa es muy probable que tamaño $\rightarrow$ precio y consumo cambien.

No elegiría `VariantModifierOverride`. La solución del consultor:
```
VariantModifierOverride
-----------------------
variantId
modifierOptionId
priceDelta
ingredientEffect
```
es viable, pero introduce semántica de: valor default en `ModifierOption` + override opcional. Entonces empiezas a tener que resolver: ¿Existe override? sí $\rightarrow$ úsalo, no $\rightarrow$ usa el padre. No es terrible, pero justamente venimos eliminando ambigüedades de ese estilo.

Yo haría algo ligeramente diferente. Separaría definición y configuración:
```
ModifierOption
--------------
id
name
```
y:
```
VariantModifierConfig
---------------------
variantId
modifierOptionId
priceDelta
maxQuantity
```
Sus `IngredientEffect` pertenecerían a esta configuración:
```
VariantModifierConfig
        │
        └── 0..N IngredientEffect
```
Entonces: Extra queso es el concepto de personalización, mientras que: `Extra queso + Pizza chica -> +$25 -> ADD queso 40g` es su

---

## Página 7

comportamiento concreto. Y: `Extra queso + Pizza familiar -> +$45 -> ADD queso 90g` es otro. Esto encaja mucho mejor con el resto del modelo.

Ejemplo completo:
```
MenuItem: Pizza Pepperoni
Variants
├── CHICA │ unitPrice = $150
└── FAMILIAR unitPrice = $280
ModifierGroup: Extras
ModifierOption:
└── EXTRA_QUESO
```
Configuración:
```
VariantModifierConfig
variant = CHICA
modifier = EXTRA_QUESO
priceDelta = $25
maxQuantity = 2
IngredientEffect: ADD queso 40g
```
y:
```
VariantModifierConfig
variant = FAMILIAR
modifier = EXTRA_QUESO
priceDelta = $45
maxQuantity = 2
IngredientEffect: ADD queso 90g
```
Ahora todo es determinista. Esto cambia ligeramente el significado de `ModifierOption`. Antes teníamos:
```
ModifierOption
--------------
name
priceDelta
maxQuantity
IngredientEffect[]
```
Yo ahora lo reduciría a algo como:
```
ModifierOption
--------------
id
name
```
Quizá otros metadatos puramente descriptivos. Y movería aquello que afecta la ejecución: `priceDelta`, `maxQuantity`, `IngredientEffect` a: `VariantModifierConfig`. Porque son propiedades de cómo ese modifier se comporta sobre una unidad vendible concreta. Conceptualmente queda muy bonito:
- `ModifierOption` = qué personalización existe
- `VariantModifierConfig` = qué significa aplicar esa personalización a esta variante

¿Eso no aumenta muchísimo los registros? Sí. Supongamos: 3 tamaños $\times$ 10 modifiers = 30 `VariantModifierConfig`. Pero es exactamente el mismo trade-off que aceptamos para combos. Preferimos: más configuración explícita a cambio de: menos inferencia durante la venta. Y además se puede solucionar desde el backoffice: `[Copiar modifiers de variante Chica] ☑ Extra queso ☑ Extra pepperoni ☑ Sin cebolla ☑ Salsa aparte Aplicar a: Familiar`. Después el administrador sólo modifica: `Extra queso: $25 -> $45`, `40g -> 90g`. La persistencia sigue siendo explícita.

Pero hay un detalle importante: no todos los modifiers necesitan cambiar. No diseñaría un sistema de herencia automáticamente. Simplemente la UI puede clonar configuraciones. Por ejemplo:
```
Sin cebolla
CHICA: priceDelta = 0, OMIT cebolla
FAMILIAR: priceDelta = 0, OMIT cebolla
```
Hay duplicación. Eso está bien. Son dos hechos explícitos: En la variante chica se permite sin cebolla. En la familiar también. En un catálogo de restaurante, unas decenas o cientos de filas adicionales son irrelevantes comparadas con introducir reglas implícitas difíciles de auditar.

Y obtenemos otra capacidad gratis: **applicability**. Imagínate:
```
Hamburguesa
├── Sencilla
└── Doble
Modifier: Agregar segunda carne
```
Quizá sólo tenga sentido en la sencilla. Con el modelo anterior necesitábamos: `ModifierOption.applicableVariants?`. Con este modelo simplemente:
```
SENCILLA └── VariantModifierConfig(Agregar carne)
DOBLE    └── no existe configuración
```
Por tanto: **existencia de VariantModifierConfig = modifier permitido en esa variante**. Muy limpio.

`maxQuantity` también puede variar. Esto además resuelve otro caso:
```
Pizza chica: Extra queso máximo ×1
Pizza familiar: Extra queso máximo ×3
```
Así que movería `maxQuantity` también aquí:
```
VariantModifierConfig
---------------------
variantId
modifierOptionId
priceDelta
maxQuantity
```
Mientras: `ModifierGroup.minSelections`, `ModifierGroup.maxSelections` pueden seguir siendo comunes al `MenuItem` inicialmente. Sólo si aparece un requisito real del estilo: `Pizza chica: elige máximo 2 toppings`, `Pizza familiar: elige máximo 4 toppings` tendríamos que hacer también variant-aware al grupo. No lo haría ahora.

No recomiendo la alternativa de convertir tamaños en `MenuItem` separados. Aquí sí discrepo bastante del consultor. Hacer: `Pizza Pepperoni Chica <- MenuItem`, `Pizza Pepperoni Familiar <- MenuItem` para resolver modifiers sería una salida funcional, pero conceptualmente supone abandonar precisamente la abstracción que acabamos de construir. Terminas duplicando: nombre, descripción, imagen, categoría, modifier groups, estatus, combo associations, reporting, etc. Y además: `Pizza Pepperoni` deja de existir como concepto agrupador natural. Usaría dos `MenuItem` sólo si comercialmente son realmente dos productos diferentes, no porque técnicamente necesitemos precios de modifiers diferentes. Por ejemplo: `Hamburguesa clásica` y `Hamburguesa doble` pueden ser productos distintos si así los administra el restaurante. Pero: `Coca 355ml / 600ml`, `Pizza chica / mediana / grande` son precisamente casos donde Variant aporta valor.

Hay una corrección pequeña al comentario sobre complejidad de combos: El consultor dice que la solución aplanada es "$O(1)$" y contrasta eso con resolución potencialmente exponencial. La intuición es correcta —la configuración explícita hace el runtime mucho más determinista— pero no usaría literalmente "exponencial" como argumento arquitectónico. Con índices adecuados: `(comboVariantId, slotId, menuItemVariantId)` la validación puede ser prácticamente una búsqueda indexada. Pero una solución basada en reglas tampoco tiene por qué ser exponencial necesariamente. La ventaja verdadera es otra: **No hay inferencia de negocio en el momento crítico de tomar la orden.** Eso es mucho más importante que la notación asintótica.

Entonces actualizaría el modelo una última vez. La zona de modifiers quedaría:

```mermaid
flowchart TD
    ITEM["MenuItem"]
    VAR["MenuItemVariant
    ─────────────
    id
    unitPrice"]
    GROUP["ModifierGroup
    ─────────────
    id
    name
    minSelections
    maxSelections"]
    MOD["ModifierOption
    ─────────────
    id
    name"]
    CFG["VariantModifierConfig
    ─────────────
    variantId
    modifierOptionId
    priceDelta
    maxQuantity"]
    EFFECT["IngredientEffect
    ─────────────
    inventoryItemId
    type
    quantity?
    unit?"]

    ITEM --> VAR
    ITEM --> GROUP
    GROUP --> MOD
    VAR --> CFG
    MOD --> CFG
    CFG -.->|0..N| EFFECT
```

Hay una distinción importante: `MenuItem` owns `ModifierGroup / ModifierOption`, pero: `MenuItemVariant` configura cómo se ejecuta cada `ModifierOption`. No son ideas contradictorias.

La arquitectura empieza a mostrar un patrón muy consistente. Ahora tenemos:
```
           MenuItem
              │
    definición comercial
              │
 ┌────────────┴────────────┐
 │                         │
 ▼                         ▼
MenuItemVariant     ModifierOption
unidad vendible     personalización
 │                         │
 └────────────┬────────────┘
              ▼
    VariantModifierConfig
              │
    comportamiento concreto
```
Y debajo de `MenuItemVariant`:
```
MenuItemVariant
│
├── unitPrice
│
└── Fulfillment
      ├── STOCKED
      ├── PREPARED
      └── COMBO
```
Esto me parece más coherente que la versión anterior.

Mi

---

## Página 8

decisión final: El punto detectado por el consultor sí merece modificar el modelo antes del DDL si el sistema contempla productos con tamaños y extras que consumen cantidades diferentes —algo bastante natural en un restaurante. No implementaría un sistema genérico de Override, ni convertiría tamaños artificialmente en `MenuItem` independientes. Haría explícita una asociación: `VariantModifierConfig` y trasladaría ahí: `priceDelta`, `maxQuantity`, `IngredientEffect[]`. Con eso llegamos a una regla muy fuerte y simple: **Todo dato que afecte concretamente cuánto se cobra o cuánto se consume pertenece, directa o indirectamente, a MenuItemVariant, porque ésa es la unidad que realmente se vende.** Ese principio empieza a convertirse en el verdadero eje del modelo, y creo que con esta corrección ya sí cerraría el modelo conceptual antes de bajar a tablas y contratos.

Response: La contrapropuesta del autor de la Auditoría 2 no solo es correcta, sino que supera técnicamente la sugerencia del consultor. Al descartar `VariantModifierOverride` y optar por `VariantModifierConfig`, eliminó de un plumazo la lógica de fallback («si existe override úsalo, si no toma el default») en favor de una relación asociativa explícita y normalizada.

El modelo alcanzó una coherencia conceptual impecable: **MenuItem define la intención comercial; MenuItemVariant gobierna la realidad transaccional, operativa y de costeo.**

### Aciertos de la Propuesta

- **Determinismo puro sobre fallbacks:** `VariantModifierConfig` erradica los `COALESCE` en base de datos y los condicionales ternarios en el código del POS. Una consulta directa por `(variantId, modifierOptionId)` devuelve de inmediato el precio, la cantidad máxima y los efectos de inventario.
- **Aplicabilidad implícita y limpia:** Al condicionar la existencia del modificador a la presencia de un registro en `VariantModifierConfig`, resuelve de forma nativa la compatibilidad (por ejemplo, permitir "Extra Carne" en la hamburguesa simple pero no en la triple) sin añadir flags como `isApplicable` ni listas de exclusión.
- **Rechazo certero al despiece de ítems:** Dividir `Pizza Pepperoni` en `Pizza Pepperoni Chica` y `Pizza Pepperoni Grande` como distintos `MenuItem` para esquivar una limitación técnica es un antipatrón clásico en restauración: contamina la analítica de ventas, arruina los reportes agregados y satura el catálogo visual.
- **Alineación con el trade-off de combos:** Mantener la misma filosofía de diseño (trasladar el costo de configuración al backoffice para garantizar lecturas instantáneas y sin inferencia en la comanda) aporta uniformidad a todo el sistema.

### Tres Trampas Operativas antes de pasar al DDL

Aunque el modelo conceptual está cerrado, esta decisión introduce tres detalles críticos que deben resolverse al redactar el esquema de base de datos y la capa de servicios:

**1. El riesgo de contradicción con ModifierGroup:** Si `ModifierGroup` define `minSelections = 2`, pero para la variante Chica solo se configuran 1 `VariantModifierConfig` (porque los demás no aplican a ese tamaño), el cliente quedará atrapado en un flujo de compra imposible de completar.
- *Solución:* Añadir un validador en el servicio de catálogo (Backoffice) que imponga la regla:

$$\text{COUNT}(\text{VariantModifierConfig de la variante en el grupo}) \ge \text{ModifierGroup.minSelections}$$

**2. Snapshotting en la Comanda (OrderLineItemModifier):** En un punto de venta, los precios y gramajes cambian. La comanda nunca debe consultar en vivo `VariantModifierConfig` para calcular un corte de caja o reimprimir un ticket del día anterior.
- *Diseño relacional:* La tabla `OrderLineItemModifier` debe guardar una copia inmutable del `priceDelta` cobrado y el nombre del modificador al momento exacto de la orden, guardando `variantModifierConfigId` únicamente como referencia de auditoría.

---

## Página 9

**3. Huérfanos de inventario con eliminaciones lógicas:** Si un modificador se elimina de una variante (se borra su fila en `VariantModifierConfig`), pero hay órdenes abiertas en cocina pendientes de descuento de stock, la relación no debe romperse por un `CASCADE DELETE`. Se requiere borrado lógico (*soft delete*) o versionado por vigencia.

### Veredicto

**Aprobado para pasar a DDL.** La arquitectura final es robusta, determinista y no deja cabos sueltos ni en cocina ni en caja. Con las debidas herramientas de clonación/plantillas en la API del backoffice para amortiguar la carga de filas, este modelo sostendrá el sistema sin requerir refactorizaciones estructurales a futuro.

---

User prompt: SObre Huerfanos en inventario, que recomiendas de forma objetiva para tratar el caso en el que se elimine una variante y hay ordenes abiertas?

Response: Para resolver este problema de manera limpia y sin corromper el inventario ni la cocina, la solución estándar en sistemas transaccionales se basa en una regla cardinal: **las órdenes en curso nunca deben depender de la lectura en vivo del catálogo para operar.**

La estrategia recomendada combina tres mecanismos complementarios:

### 1. Sustituir el borrado físico por Ciclo de Vida (ARCHIVED)

En catálogos de retail y restauración, el borrado físico (`DELETE FROM`) de entidades comerciales que ya tienen historial es un antipatrón.
- **Estado de la variante:** Cambiar el estatus de la variante de `ACTIVE` a `ARCHIVED` o `DEPRECATED`.
- **Comportamiento en UI (Backoffice y POS):** La variante deja de listarse en el punto de venta para nuevas comandas y desaparece del listado principal del menú administrativo, pero permanece accesible en reportes históricos.
- **Integridad en BD:** Mantener claves foráneas con restricción dura (`ON DELETE RESTRICT` / `NO ACTION`). Si un administrador intenta forzar un borrado físico vía API, el sistema debe rechazar la operación informando que existen transacciones asociadas.

### 2. Snapshot de Fulfillment en la Comanda (Desacoplamiento Temporal)

El error raíz consiste en hacer que el motor de inventario consulte `MenuItemVariant -> PreparedVariantDefinition -> Recipe` al momento de cerrar o despachar la orden. Si la receta o la variante cambiaron o fueron archivadas entre la toma del pedido y el cierre de la comanda, el inventario se descontará con datos erróneos.
- **Captura al emitir el pedido:** En el momento en que la comanda pasa a estado `CONFIRMED`, el servicio de pedidos genera un snapshot inmutable de las operaciones de inventario a ejecutar:

```json
"inventoryMovements": [
  { "inventoryItemId": "CARNE-150G", "operation": "DEDUCT", "quantity": 1 },
  { "inventoryItemId": "QUESO-CHEDDAR", "operation": "DEDUCT", "quantity": 0.04 }
]
```

- **Ejecución aislada:** Cuando la cocina finaliza el plato o la caja cobra la comanda, el servicio de inventario procesa este payload congelado. A Inventory no le importa si la variante aún existe, cómo se llamaba o si fue archivada hace cinco minutos; solo procesa movimientos contra insumos.

### 3. Política de Descuento: Deducción Inmediata vs. Cierre

---

## Página 10

| Enfoque | Mecánica | Impacto ante variantes eliminadas/archivadas |
| :--- | :--- | :--- |
| **Deducción/Reserva Inmediata (Recomendado)** | Al enviar la orden a cocina (`CONFIRMED`), se descuenta o reserva el stock de inmediato. | **Cero impacto.** Si el administrador archiva la variante segundos después, el inventario ya fue debitado contablemente. |
| **Deducción al Cierre / Facturación** | El stock se descuenta hasta que la cuenta se paga o se entrega el ticket. | **Requiere Snapshot.** Si no se capturaron los `inventoryItemId` al inicio, la eliminación de la variante bloqueará el cobro o dejará huérfana la deducción. |

Una comanda abierta es un contrato legal y operativo cerrado en el tiempo. Si el cliente pidió una variante y cocina la está preparando, esa transacción ya ocurrió independientemente de las decisiones comerciales que el administrador tome en el backoffice segundos después. Tratar el catálogo como un sistema append-only (con banderas de vigencia o archivado) y congelar los requerimientos de insumo en la orden blinda al sistema contra excepciones de clave foránea y desajustes de stock.

---

User prompt: El dos no entiendo, se supone que agrega lo de la snapshot y que diferencia hay entre eso y simplemente al ordenar, se lanza una snapshot con toda la info en una cola?

Response: No son conceptos opuestos; en realidad describen dos partes del mismo flujo, pero confiar únicamente en «mandar un snapshot a una cola al ordenar» sin persistirlo en la base de datos de la orden deja un agujero operativo crítico cuando la comanda está viva.

La diferencia radica entre **dónde vive la verdad histórica (persistencia)** y **cómo viaja el trabajo (transporte/asincronía)**.

### 1. El ciclo de vida de la orden (Cancelaciones y Devoluciones)

En un restaurante, una comanda no es una compra de e-commerce donde pagas y se acabó. La mesa se queda 2 horas abierta:

**Escenario sin snapshot persistido (solo cola):**
1. El cliente pide *Pizza Familiar*.
2. Mandas el mensaje a la cola: `{ deducciones: [queso 90g, masa 300g] }`.
3. La cola lo descuenta de inmediato en inventario.
4. 10 minutos después, el cliente cancela la pizza porque se tiene que ir de urgencia.
5. El sistema de órdenes tiene que reintegrar el stock. Va a la base de datos a ver qué llevaba la *Pizza Familiar*, pero el administrador acaba de archivar la variante o cambiar la receta.
6. **Fallo:** El sistema no tiene registro de cuánto inventario devolver porque el contenido de la receta no quedó guardado en la orden, solo existió efímeramente en un mensaje de la cola que ya se consumió.

**Con snapshot persistido en la comanda:** La comanda guarda en su propia tabla: *"A esta comanda le corresponden [90g queso, 300g masa]"*. Si se cancela la línea, el sistema sabe exactamente qué revertir sin consultar jamás el catálogo actual.

### 2. El problema del doble guardado (Dual-Write)

---

## Página 11

Si al presionar "Confirmar orden" en el POS haces dos cosas por separado:
1. Guardar la orden en PostgreSQL.
2. Enviar el JSON con los ingredientes a una cola (RabbitMQ, SQS, etc.).

Te expones a fallos de red: si la orden se guarda pero la cola se cae, cobraste comida sin descontar inventario. Si la cola recibe el mensaje pero la BD de la orden rechaza la transacción por un deadlock, descontaste stock de una orden fantasma.

La arquitectura correcta resuelve esto guardando el snapshot de los movimientos en la misma transacción que guarda la comanda (patrón **Transactional Outbox**). De ahí, un worker lee ese snapshot y lo manda a la cola de inventario de forma 100% garantizada.

### 3. Comparativa directa

| Dimensión | Solo lanzar snapshot a una cola | Snapshot persistido en la Comanda |
| :--- | :--- | :--- |
| **Rol en el sistema** | Mecanismo de transporte asíncrono. | Registro legal y contable inmutable. |
| **Cálculo de COGS (Costo de venta)** | Imposible a mes vencido si el mensaje de la cola se purgó y las recetas cambiaron. | **Directo:** la orden sabe exactamente cuántos gramos consumió para reportes contables. |
| **Modificaciones en comanda** | Difícil de reconciliar (requiere eventos complejos de compensación a ciegas). | **Trivial:** recalculas la diferencia entre el snapshot viejo y el nuevo. |
| **Modo Offline del POS** | Si el POS pierde conexión con el broker de mensajería, la operación se traba. | El POS guarda la orden localmente con su snapshot y la sincroniza al volver la red. |

Lanzar el snapshot a una cola es **la forma correcta de procesarlo** para no ralentizar al camarero ni a la pantalla de cocina; pero ese mensaje en la cola debe ser el reflejo de un dato que quedó escrito en la base de datos de la orden.

La orden no debe guardar solo *"pidió variante X"*, sino *"pidió variante X, que en este instante representó consumir Y insumos"*. Con eso, la cola puede procesar, fallar, reintentar o cancelar sin importar qué pase con el menú o las recetas vivas.

---

User prompt: Yo estaba pensando en que el servicio de menú resuelve todo a el lenguaje del servicio de inventario (ingredientes/stock). Entonces pensaba en que el servicio menu, cada que se crea o modifica un itemMenu, se notifica a traves de eventos el cual inventario está escuchando y este tiene la resolución directa de la lista de ingredientes para poder combrobar si se puede realizar o no ese itemMenu y en caso de que no, se mande un aviso de disponibilidad. Es decir, inventario tiene mapeado el id del item con su "receta" que es más bien la lista de ingredientes. Así cuando Order service orquesta mandar actualizar inventario (al seleccionar un item), entonces el inventario busca su id, obtiene sus ingredientes (guardado en su interno) y descuenta, pero justamente creo que tiene el problema de que si cambia se muere la recuperación de la orden. Entonces que propones, lo que propones es correcto (con tal de conservar availability y el flatten para inventario)?

Response: Tu planteamiento toca el dilema clásico de sincronización entre Catálogo, Órdenes e Inventario: **separar el cálculo de disponibilidad (lectura) de la deducción de la orden (escritura).**

La idea de que Inventario tenga mapeados los ingredientes para saber si un producto está disponible es excelente para la **vista del menú**, pero usar ese mismo mecanismo para descontar la comanda rompe por dos motivos críticos:

---

## Página 12

1. **El problema de las recetas cambiantes / cancelaciones:** Como bien detectaste, si la receta cambia o se archiva mientras la orden está abierta, el reintegro o la deducción consultan datos desfasados.
2. **El problema de las personalizaciones (Modificadores):** Si el cliente pide *Pizza Chica + Extra Queso + Sin Cebolla*, Inventario no puede tener precalculadas en una tabla estática todas las permutaciones combinatorias de modificadores posibles ($2^N$).

La solución arquitectónica correcta es aplicar un patrón de separación de responsabilidades (**CQRS**):

### 1. Ruta de Lectura: Disponibilidad (Availability Projection)

Inventario sí puede tener un mapa plano de requerimientos base, pero exclusivamente como modelo de lectura para calcular el semáforo de disponibilidad.

- **Evento de Menú:** Cuando se crea o edita una variante, Menu Service emite:

```json
VariantRecipeUpdated {
  "variantId": "PIZZA-CHICA",
  "baseRequirements": [
    { "inventoryItemId": "MASA-150G", "quantity": 1 },
    { "inventoryItemId": "QUESO-MOZZ", "quantity": 0.05 },
    { "inventoryItemId": "SALSA-TOM", "quantity": 0.03 }
  ]
}
```

- **Proyección en Inventario:** Inventario guarda este mapa ligero. Su único propósito es evaluar:
  *¿Hay stock suficiente de MASA-150G, QUESO-MOZZ y SALSA-TOM?*
  - Si alguno llega a cero (o rebasa el stock mínimo de seguridad), Inventario emite un evento:
    `VariantAvailabilityChanged(variantId: "PIZZA-CHICA", status: OUT_OF_STOCK)`.
  - El POS y Menú escuchan esto y desactivan el botón de la variante en tiempo real.

### 2. Ruta de Escritura: La Comanda y su BOM Neto (Bill of Materials)

Cuando el cliente efectivamente ordena, no le pides a Inventario que infiera la receta. El encargado de resolver la receta final es quien conoce el contexto de la comanda y sus modificadores.

```
       +---------------------------------------------+
       |             Menu / Order Service            |
       |                                             |
       | Receta Base (Pizza Chica)                   |
       | + Modifier (ADD Extra Queso: +40g)          |
       | - Modifier (OMIT Cebolla)                   |
       +---------------------------------------------+
                              │
                              ▼
                 Calcula "BOM Neto" (Snapshot)
                 [1x Masa, 90g Queso, 30g Salsa]
                              │
       ┌──────────────────────┴──────────────────────┐
       ▼                                             ▼
Persistido inmutable en Order        Enviado a Inventario para descontar
(BD Comanda)                         "Descuenta este BOM en base a Order #456"
```

1. **Resolución en caliente:** Al presionar "Ordenar", el servicio valida la variante y suma/resta los `IngredientEffect` de los modificadores seleccionados.

---

## Página 13

2. **Persistencia del Snapshot:** La orden guarda en su tabla interna ese resultado plano (el *BOM Neto*).
3. **Comando a Inventario:** La orden no envía *"se vendió la variante X"*, sino un comando transaccional directo con clave de idempotencia:

```json
DeductStockCommand {
  "orderId": "ORD-1234",
  "reason": "ORDER_CONFIRMED",
  "items": [
    { "inventoryItemId": "MASA-150G", "quantity": 1 },
    { "inventoryItemId": "QUESO-MOZZ", "quantity": 0.09 },
    { "inventoryItemId": "SALSA-TOM", "quantity": 0.03 }
  ]
}
```

4. **Inventario solo resta números:** Inventario no necesita saber qué es una pizza ni qué receta tenía; solo ejecuta la resta matemática de las existencias para esa orden.

### ¿Cómo resuelve esto las cancelaciones y devoluciones?

Si a los 20 minutos el cliente cancela la *Pizza Chica*, no hay ambigüedad ni riesgo de recetas borradas:
1. Order Service lee su propio snapshot persistido de la orden `ORD-1234`.
2. Emite el comando inverso a Inventario con la misma lista:

```json
RevertStockCommand {
  "orderId": "ORD-1234",
  "reason": "LINE_ITEM_CANCELLED",
  "items": [
    { "inventoryItemId": "MASA-150G", "quantity": 1 },
    { "inventoryItemId": "QUESO-MOZZ", "quantity": 0.09 },
    { "inventoryItemId": "SALSA-TOM", "quantity": 0.03 }
  ]
}
```

3. Aunque el administrador haya eliminado la variante o cambiado la receta de la pizza hace cinco minutos, el inventario se reintegra con los insumos exactos que se comprometieron al ordenar.

### Comparativa de Responsabilidades

| Responsabilidad | Dónde vive | Mecanismo |
| :--- | :--- | :--- |
| **Conocimiento de Recetas y Efectos** | Menu Service | `PreparedVariantDefinition` + `IngredientEffect`. |
| **Monitoreo de Disponibilidad (Semáforo)** | Inventory Service (Proyección) | Escucha eventos de catálogo y proyecta si los insumos base alcanzan. |
| **Resolución del Plato Real (con Extras/Omisiones)** | Order / Menu Resolution | Aplica modificadores sobre la receta al crear la línea de comanda. |
| **Registro Histórico / Snapshot** | Order Service | Guarda los insumos netos consumidos por cada línea de pedido. |
| **Control de Existencias Físicas (Kardex/Stock)** | Inventory Service | Ejecuta sumas y restas atómicas contra identificadores de inventario. |

---

## Página 14

Este enfoque mantiene la ventaja de tu idea (cálculo de disponibilidad eficiente y desacoplado vía proyecciones planas), sin caer en la trampa de hacer que la deducción y reversión de inventario dependan del estado volátil del catálogo.

---

User prompt: <a id="open-005"></a> ### OPEN-005 — Conteo de selecciones y fase de validación
**Evidencia:** `docs/md/Auditoria-3.md` pp. 8 **Información conocida:** La fuente exige `COUNT(opciones configuradas) >= minSelections`. Existe multiplicidad por separado (Modelo-Final págs. 15–16, 47–48); no se decide la regla exacta de conteo ni la fase de guardado/publicación. **Información faltante / decisión requerida:** ¿Los límites de grupo y espacio cuentan opciones distintas, repeticiones seleccionadas o cantidades suministradas? ¿Una opción repetida dos veces satisface mínimo dos? ¿Cuándo debe una configuración insuficiente bloquear uso o guardado?

Response: El conteo de selecciones debe medir **decisiones acumuladas del cliente ($\sum \text{quantity elegida}$)**, no opciones distintas ni unidades físicas suministradas.

A continuación se definen las reglas formales para resolver la semántica de conteo, la multiplicidad y las fases de bloqueo.

### 1. Regla de Conteo en Grupos y Espacios

Para evitar ambigüedades entre identificadores únicos, repeticiones y paquetes de producto, el motor transaccional debe distinguir entre:

- **Unidades de selección (lo que cuenta):** La suma de las cantidades elegidas por el usuario para cada opción dentro del grupo o slot:

$$\text{selections\_count} = \sum_{i \in \text{selected}} \text{quantity}_i$$

- **Cantidad suministrada (paquete/bundle):** En `ComboOption`, el atributo `quantity` representa el multiplicador entregado al cliente (por ejemplo, "6 piezas de Nuggets" o "2 Tacos"), no las decisiones consumidas del slot. Elegir esa opción cuenta como 1 selección contra el slot, pero entrega $N$ unidades operativas.

| Contexto | Atributo | Qué cuenta contra `minSelections` y `maxSelections` |
| :--- | :--- | :--- |
| **ModifierGroup** | `VariantModifierConfig.maxQuantity` | Cada unidad de modificador añadida incrementa el conteo en 1. (Ejemplo: *Extra Queso $\times 2$* suma 2 al grupo). |
| **ComboSlot** | `ComboOption.quantity` | Cada opción elegida suma 1 selección al slot, independientemente de cuántos ítems físicos incluya el bundle internamente. |

### 2. Multiplicidad y Cumplimiento de Mínimos

**Sí, una opción repetida $N$ veces satisface $N$ selecciones mínimas**, siempre que $N \le \text{maxQuantity}$.

- **Razón operativa:** Si un grupo "Elige 2 Salsas" tiene `minSelections = 2`, `maxSelections = 2` y la salsa BBQ tiene `maxQuantity = 2`, forzar al cliente a elegir dos salsas distintas cuando desea "Doble BBQ" genera fricción y bloquea pedidos válidos en caja.

---

## Página 15

- **Invariante de validación por ítem:**

$$0 \le \text{quantity}_i \le \text{maxQuantity}_i$$

- **Invariante de validación por grupo:**

$$\text{minSelections} \le \sum_{i} \text{quantity}_i \le \text{maxSelections}$$

Si un negocio requiere explícitamente "opciones distintas" (sin repetición), no se altera el álgebra del grupo: simplemente se configura `maxQuantity = 1` en cada una de sus opciones asociadas.

### 3. Capacidad Teórica de Configuración

La regla preliminar $\text{COUNT}(\text{opciones}) \ge \text{minSelections}$ es matemáticamente insuficiente porque ignora la multiplicidad.

La condición real para que una variante no quede en un estado imposible de ordenar es que **la suma de las capacidades máximas configuradas cubra el mínimo exigido:**

$$\sum_{k \in \text{Configs}(\text{variant}, \text{group})} \text{maxQuantity}_k \ge \text{group.minSelections}$$

- Si un grupo exige `minSelections = 2` y solo existe una opción configurada, pero esa opción tiene `maxQuantity = 2`, la configuración **es válida**.
- Si un grupo exige `minSelections = 2` y tiene 5 opciones configuradas, pero todas tienen `maxQuantity = 0` (o están deshabilitadas), la configuración **es inválida**.

### 4. Fases de Validación y Bloqueo

Para no arruinar la experiencia del usuario administrador durante la carga de datos, la validación debe desacoplarse según el estado del ciclo de vida:

#### Fase 1: Guardado en Backoffice (Draft / In-Progress)
- **Comportamiento:** No bloquea el guardado.
- **Acción:** Permite persistir cambios parciales (crear un grupo antes de asociarle modificadores a las variantes). El sistema devuelve una advertencia (*warning*) en la respuesta de la API: `"INSUFFICIENT_SELECTION_CAPACITY"`.

#### Fase 2: Publicación / Activación (status = ACTIVE)
- **Comportamiento:** Bloqueo estricto (*Hard validation*).
- **Acción:** El sistema rechaza la transición a `ACTIVE` de un `MenuItem` o `MenuItemVariant` si:
  1. Para alguna variante, $\sum \text{maxQuantity} < \text{minSelections}$ en sus grupos obligatorios.
  2. Un `ComboSlot` no tiene suficientes `ComboOption` activas para cubrir su `minSelections`.
- El ítem permanece forzosamente en estado `DRAFT` o `INACTIVE` hasta que se complete la configuración.

#### Fase 3: Runtime en Punto de Venta / Kiosco (Order Service)
- **Comportamiento:** Invariante transaccional estricto.

---

## Página 16

- **Acción:** Al enviar una línea de comanda, el servicio valida la sumatoria de selecciones contra los límites del grupo. Si la comanda no alcanza `minSelections` o supera `maxSelections`, la API responde con error de cliente (`422 Unprocessable Entity`) con el detalle del grupo insatisfecho.
