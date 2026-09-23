# Síntesis consolidada del modelo

## 1. Separación general de responsabilidades

La solución queda dividida principalmente en tres servicios:

```text
MENU
¿Qué se vende?
¿Cómo puede configurarlo el cliente?
¿Cuánto cuesta?

ORDERS + KITCHEN
¿Qué pidió el cliente?
¿Cómo se prepara o satisface físicamente?

INVENTORY
¿Qué recursos físicos existen?
¿Cuánto hay disponible?
````

La separación no implica duplicar las mismas entidades entre servicios.

Cada servicio mantiene únicamente la información necesaria para su propio dominio y se relaciona con los demás mediante identificadores, contratos y eventos.

---

## 2. Modelo comercial de Menu

Menu es propietario de la definición comercial del catálogo.

Conceptualmente existen tres tipos:

```text
MenuItem
├── PREPARED
├── STOCKED
└── COMBO
```

`PREPARED` y `STOCKED` representan productos hoja.

`COMBO` representa una composición comercial de productos hoja.

Aunque puedan implementarse mediante una entidad común `MenuItem`, cada tipo puede tener reglas y estructuras diferentes.

Menu no es propietario de recetas, ingredientes, gramajes, cantidades físicas de preparación ni existencias.

---

## 3. MenuItemVariant

Los productos `PREPARED` y `STOCKED` utilizan `MenuItemVariant`.

Una variante representa una presentación vendible concreta del mismo producto:

```text
Pizza Italiana
├── Individual
├── Pareja
└── Familiar
```

o:

```text
Coca-Cola
├── 355 ml
├── 600 ml
└── 1 L
```

Una variante no constituye otro `MenuItem`.

### Default Variant

Todo producto hoja tiene al menos una variante:

```text
MenuItem hoja
└── MenuItemVariant [1..N]
```

Cuando comercialmente no existen variantes visibles se utiliza una variante técnica:

```text
DEFAULT
```

Esto permite mantener siempre:

```text
variantId != null
```

La variante técnica `DEFAULT` no debe confundirse con una variante real preseleccionada por UX mediante un posible `defaultVariantId`.

---

## 4. Dimensiones de variante

Se conservan:

```text
VariantDimension
VariantValue
```

Por ejemplo:

```text
Tamaño
├── Individual
├── Pareja
└── Familiar
```

Cada `MenuItemVariant` representa una combinación válida de valores de las dimensiones definidas para el Item.

La misma oferta comercial no debe representarse simultáneamente como variante y como `MenuItem` independiente.

---

## 5. Pricing de productos hoja

El precio autoritativo pertenece a:

```text
MenuItemVariant.unitPrice
```

y es absoluto.

No se utiliza `MenuItem.basePrice` como fuente autoritativa.

Ejemplo:

```text
Pizza Italiana

Individual = $140
Pareja     = $210
Familiar   = $290
```

El precio mostrado en catálogo es una proyección:

```text
una unidad elegible
→ "$140"

varias con mismo precio
→ "$140"

varias con precios diferentes
→ "Desde $140"
```

La disponibilidad operacional no elimina el precio comercial de una variante.

---

# 6. PREPARED

`PREPARED` continúa siendo un concepto comercial de Menu:

```text
MenuItem.type = PREPARED
```

pero Menu ya no conoce la receta utilizada para producirlo.

Menu conoce:

```text
MenuItem
MenuItemVariant
nombre
precio
clasificación
categoría
modificadores comerciales
estado
```

Orders + Kitchen conoce cómo se prepara esa variante.

Conceptualmente:

```text
MENU

Pizza Familiar
variantId = V123
unitPrice = $290

        ↓ mismo variantId

ORDERS + KITCHEN

PreparationDefinition
variantId = V123
→ RecipeRevision
→ ingredientes
→ cantidades
→ instrucciones
```

Por tanto, se elimina del modelo comercial de Menu cualquier asociación autoritativa como:

```text
MenuItemVariant.recipeRevisionId
```

La relación con la preparación es propiedad de Orders + Kitchen.

---

# 7. Recetas y preparación

`Recipe`, `RecipeRevision`, ingredientes, gramajes y demás conocimiento culinario pertenecen a Orders + Kitchen.

Kitchen puede asociar una definición de preparación a una `MenuItemVariant` comercial mediante su ID.

Las revisiones culinarias son independientes de las revisiones comerciales.

Por ejemplo:

```text
Pizza Familiar

PreparationRevision 7
queso = 180 g

        ↓

PreparationRevision 8
queso = 210 g
```

no modifica automáticamente:

```text
MenuItemVariant.unitPrice
```

ni crea por sí mismo una nueva revisión comercial de Menu.

---

# 8. STOCKED

`STOCKED` también continúa siendo una clasificación comercial de un producto hoja.

Menu necesita saber que la variante corresponde a un producto de tipo `STOCKED`, pero no debe apropiarse innecesariamente de información física de inventario.

La resolución física de una variante hacia artículos y cantidades de Inventory pertenece al flujo operacional entre Orders + Kitchen e Inventory.

Conceptualmente:

```text
MENU
Coca-Cola 600 ml
variantId = V600
type = STOCKED

        ↓

ORDERS + KITCHEN / INVENTORY
V600
→ artículo físico correspondiente
→ cantidad requerida
```

Menu mantiene la identidad y semántica comercial.

Inventory mantiene la identidad y cantidad física.

---

# 9. Modificadores comerciales

Los modifiers continúan perteneciendo al `MenuItem`.

```text
MenuItem
└── ModifierGroup [0..N]
    └── ModifierOption [1..N]
```

Ejemplo:

```text
Hamburguesa

Extras
├── Extra queso
└── Extra tocino

Preparación
├── Término medio
└── Bien cocida
```

Menu define su significado comercial.

Por ejemplo:

```text
ModifierOption
--------------
id
name
priceDelta
maxQuantity
```

Los límites del grupo se conservan cuando expresan una regla real:

```text
ModifierGroup
-------------
minSelections
maxSelections
```

Ejemplo:

```text
Término de cocción
minSelections = 1
maxSelections = 1
```

Los límites del grupo y `ModifierOption.maxQuantity` representan restricciones distintas.

---

# 10. Especialización comercial de modifiers por variante

Se conserva la estrategia:

```text
configuración general
+
excepción específica por variante
```

pero exclusivamente para información comercial.

Por ejemplo:

```text
ModifierOption.generalConfig
----------------------------
priceDelta
maxQuantity
```

y opcionalmente:

```text
VariantModifierConfig
---------------------
variantId
modifierOptionId
enabled
priceDelta
maxQuantity
```

Resolución:

```text
si existe VariantModifierConfig
→ usar configuración específica

si no
→ usar generalConfig
```

Esto evita duplicar el mismo modifier para todas las variantes.

---

# 11. Efectos físicos de los modifiers

`IngredientEffect` deja de formar parte del modelo comercial de Menu.

Menu puede saber:

```text
Extra queso
+$25
máximo 2
```

pero no:

```text
ADD queso 70 g
```

Ese significado pertenece a Kitchen.

Kitchen puede mantener una definición como:

```text
variantId + modifierOptionId
→ efecto de preparación
```

Ejemplo:

```text
Pizza Individual + Extra queso
→ ADD 30 g queso

Pizza Familiar + Extra queso
→ ADD 70 g queso
```

De esta forma el mismo `ModifierOption` conserva una identidad comercial única, aunque su ejecución física cambie según la variante.

También puede existir un modifier sin efecto sobre ingredientes:

```text
Bien cocida
Salsa aparte
Cortar a la mitad
```

Kitchen determina cómo debe ejecutarse esa instrucción.

---

# 12. Proyección comercial de modifiers

Menu puede seguir materializando:

```text
ResolvedVariantModifier
```

para evitar que POS tenga que resolver herencia comercial en runtime.

La proyección contiene únicamente información comercial efectiva:

```text
variantId
modifierOptionId
enabled
priceDelta
maxQuantity
```

Los efectos culinarios ya no forman parte de esta proyección.

La disponibilidad operacional del modifier se incorpora mediante una proyección separada.

---

# 13. Combo

Un Combo continúa siendo una composición exclusivamente comercial y pertenece a Menu.

```text
Combo
└── ComboConfiguration
    └── ComboSlot
        └── ComboOption
```

No es `PREPARED` ni `STOCKED`.

---

## 13.1 ComboConfiguration

Un Combo puede tener una o varias configuraciones:

```text
Combo Familiar
├── Individual
├── Pareja
└── Familiar
```

Cada una posee:

```text
ComboConfiguration
------------------
unitPrice
slots[]
```

Cuando no hay configuraciones visibles puede utilizarse internamente una configuración técnica `DEFAULT`.

---

## 13.2 ComboSlot y ComboOption

Cada slot representa una elección comercial:

```text
Principal [1]
├── Hamburguesa chica
└── Hamburguesa grande

Bebida [1]
├── Coca 600 ml
└── Sprite 600 ml
```

`ComboOption` referencia directamente una variante hoja:

```text
ComboOption
-----------
itemVariantId
quantity
priceDelta
```

No se requiere `AllowedVariant`.

Menu no necesita conocer cómo se prepara físicamente la variante seleccionada.

---

# 14. Combo y modifiers

Un Combo no tiene modifiers globales propios.

Cambiar:

```text
Coca → Sprite
```

es una selección de `ComboOption`.

Si el cliente selecciona:

```text
Hamburguesa Grande
```

puede aplicar los modifiers propios de esa hamburguesa:

```text
Sin cebolla
Extra queso
```

Orders + Kitchen recibe finalmente las variantes y modifiers seleccionados y resuelve su ejecución física.

---

# 15. Pricing del Combo

Cada `ComboConfiguration` tiene un precio absoluto:

```text
ComboConfiguration.unitPrice
```

Las opciones pueden introducir:

```text
ComboOption.priceDelta
```

y los modifiers de los componentes seleccionados mantienen sus propios ajustes.

El precio final es:

```text
ComboConfiguration.unitPrice
+
Σ ComboOption.priceDelta
+
Σ modifiers seleccionados en los componentes
```

No se vuelven a sumar los `MenuItemVariant.unitPrice` normales de los productos contenidos.

Los modifiers repetidos en componentes diferentes se cobran de manera independiente.

No existe deduplicación o bonificación implícita.

---

# 16. Porciones en Combo

`ComboOption.quantity` representa unidades físicas completas y debe mantenerse como entero positivo.

No se introducen factores fraccionarios genéricos como:

```text
quantity = 0.5
```

Cuando el negocio necesite una presentación diferenciada, por ejemplo media porción, deberá representarse mediante una unidad hoja concreta capaz de ser referenciada por el Combo.

Esto evita que Combo tenga que inferir recetas, cantidades o costos físicos.

---

# 17. Clasificación y categorías

Para productos hoja se mantiene una clasificación comercial como:

```text
PLATILLO
BEBIDA
POSTRE
COMPLEMENTO
```

aplicable a:

```text
PREPARED
STOCKED
```

`COMBO` no necesita una clasificación `COMBO`, porque su tipo ya expresa esa información.

Prepared y Stocked comparten `ItemCategory`.

Combo utiliza un catálogo separado:

```text
ComboCategory
```

y no hereda categorías de sus componentes.

---

# 18. Orders + Kitchen

Orders y Kitchen forman un mismo servicio.

Este servicio tiene dos responsabilidades relacionadas pero diferenciables:

```text
Orders
→ qué pidió el cliente

Kitchen
→ cómo se ejecuta físicamente
```

Es responsable de:

* crear y gestionar órdenes;
* conservar las selecciones realizadas;
* mantener snapshots comerciales necesarios;
* gestionar estados de preparación;
* mantener definiciones culinarias;
* mantener recetas y revisiones;
* interpretar modifiers físicamente;
* traducir variantes y modifiers a requerimientos de Inventory;
* interactuar con Inventory para disponibilidad, reservas y consumo.

---

# 19. OrderLine

Una línea de orden referencia la identidad comercial utilizada al realizar la venta:

```text
OrderLine
---------
itemId
variantId
quantity
unitPriceSnapshot
modifiers seleccionados
```

Para combos también conserva:

```text
comboConfigurationId
ComboOptions seleccionadas
modifiers de cada componente
```

Una orden histórica no cambia cuando posteriormente se modifica Menu o Kitchen.

Dos configuraciones diferentes del mismo producto producen líneas conceptualmente distintas.

Al cambiar la variante de una línea deben revalidarse precio, modifiers y disponibilidad actuales.

---

# 20. Inventory

Inventory es propietario exclusivamente del estado físico de los recursos.

Gestiona:

```text
InventoryItem
stock
reserved
available
movimientos
entradas
salidas
ajustes
```

No necesita conocer:

```text
MenuItem
Combo
ModifierGroup
precio
semántica culinaria
```

Orders + Kitchen traduce los conceptos comerciales y culinarios a requerimientos de Inventory.

Inventory responde sobre recursos físicos.

---

# 21. Estado administrativo

Estado administrativo responde:

> ¿El administrador desea ofrecer comercialmente esta definición?

Menu mantiene estados como:

```text
ACTIVE
INACTIVE
ARCHIVED
```

según la entidad correspondiente.

No debe llamarse disponibilidad administrativa.

El estado administrativo es independiente de la elegibilidad y de la disponibilidad operacional.

---

# 22. Elegibilidad estructural

La elegibilidad responde:

> ¿Esta definición comercial es estructuralmente válida para participar en una nueva venta?

Permanece responsabilidad de Menu.

Ejemplos:

* variante archivada → no elegible;
* opción de Combo hacia una variante no elegible → opción no elegible;
* `ComboSlot` que ya no puede cumplir `minSelections` → configuración no elegible.

La elegibilidad no depende del stock actual.

Por tanto puede existir:

```text
eligible = true
available = false
```

---

# 23. Readiness de preparación

Como Menu ya no conoce las recetas, necesita saber únicamente si Kitchen posee una definición operacional válida para una variante cuando ésta lo requiera.

Kitchen puede publicar una proyección como:

```text
PreparationStatusChanged
variantId
status = READY | INCOMPLETE
```

Menu no necesita conocer la receta asociada.

`PreparationStatus` se mantiene separado de la elegibilidad estructural.

Una definición comercial puede ser estructuralmente válida y todavía no estar operacionalmente preparada para venderse.

---

# 24. Disponibilidad operacional

La disponibilidad responde:

> ¿Puede esta unidad venderse, prepararse o entregarse en este momento?

Menu ya no calcula físicamente esta información a partir de recetas.

El flujo conceptual es:

```text
Menu
identidad comercial
        ↓
Orders + Kitchen
resuelve preparación/requerimientos
        ↓
Inventory
existencias físicas
        ↓
Orders + Kitchen
determina disponibilidad operacional
        ↓ eventos
Menu
materializa/proyecta disponibilidad comercial
```

Menu puede mantener un espejo local de disponibilidad para responder rápidamente al POS.

Ese espejo no convierte a Menu en propietario del estado físico.

---

# 25. Disponibilidad granular

La disponibilidad continúa siendo granular.

Para productos hoja:

```text
MenuItemVariant
└── ModifierOption por variante
```

Kitchen puede publicar:

```text
VariantAvailabilityChanged
variantId
available
```

y:

```text
ModifierAvailabilityChanged
variantId
modifierOptionId
available
availableMaxQuantity
```

Un modifier opcional sin disponibilidad:

```text
NO bloquea la variante
```

Un grupo obligatorio que ya no puede satisfacer `minSelections`:

```text
SÍ bloquea operacionalmente la variante
```

Esto evita bloquear un producto completo sólo porque una personalización opcional se agotó.

---

# 26. Disponibilidad de Combo

Menu propaga la disponibilidad de las variantes hacia sus composiciones comerciales.

```text
MenuItemVariant availability
        ↓
ComboOption availability
        ↓
ComboSlot available capacity
        ↓
ComboConfiguration availability
```

Una `ComboOption` indisponible no bloquea automáticamente el Combo.

Mientras:

```text
availableCapacity >= minSelections
```

el slot puede satisfacerse.

Una `ComboConfiguration` queda operacionalmente indisponible cuando alguno de sus slots obligatorios ya no puede satisfacer sus restricciones.

La disponibilidad agregada:

```text
MenuItem hoja AVAILABLE
↔ existe alguna MenuItemVariant AVAILABLE

Combo AVAILABLE
↔ existe alguna ComboConfiguration AVAILABLE
```

es una proyección utilizada para catálogo.

No es la fuente autoritativa de la disponibilidad de cada unidad inferior.

---

# 27. Eventos entre Inventory y Orders + Kitchen

Inventory puede publicar cambios de existencias:

```text
InventoryChanged
```

Orders + Kitchen consume estos cambios o consulta Inventory según el mecanismo definido y recalcula únicamente aquello afectado.

Asimismo Orders + Kitchen realiza operaciones como:

```text
reserve
release
consume
```

cuando el ciclo de la orden lo requiera.

Estas operaciones deben ser idempotentes para evitar reservas o consumos duplicados.

---

# 28. Eventos entre Menu y Orders + Kitchen

Kitchen necesita conocer las identidades comerciales sobre las que debe definir preparación.

Por ello Menu debe exponer o publicar los cambios estructurales relevantes del catálogo.

Conceptualmente:

```text
Menu
→ VariantCreated / VariantChanged
→ ModifierChanged
→ VariantArchived
```

Los nombres exactos de eventos pueden consolidarse posteriormente, pero debe existir un mecanismo que permita a Kitchen conocer las variantes y modifiers comerciales vigentes sin compartir la base de datos de Menu.

Kitchen utiliza:

```text
itemVariantId
modifierOptionId
```

como referencias externas.

---

# 29. Eventos de Kitchen hacia Menu

Menu está interesado principalmente en tres familias de cambios operacionales:

```text
RecipeChanged
IngredientEffectChanged
OperationalAvailabilityChanged
```

o eventos equivalentes consolidados.

Un evento culinario debe incluir suficiente correlación para identificar:

```text
variantId
preparationRevision
changeKind
modifierOptionId?   // cuando corresponda
```

Menu no necesita recibir la lista completa de ingredientes para ejercer ownership sobre ella.

---

# 30. Revisiones culinarias

Kitchen versiona independientemente:

```text
PreparationRevision
```

Cuando cambia:

```text
Recipe
gramaje
composición
IngredientEffect
```

se produce un cambio culinario.

Ese cambio genera dos consecuencias independientes.

### Consecuencia operacional

```text
PreparationChanged
        ↓
recalcular requerimientos
        ↓
recalcular disponibilidad
        ↓
OperationalAvailabilityChanged
```

Esto ocurre automáticamente.

### Consecuencia administrativa

Menu registra que la definición culinaria asociada a una variante cambió y debe ser revisada.

La revisión culinaria aplica inicialmente a la variante afectada.

Si esa variante participa en combos:

```text
Variant culinary review
        ↓
propagar aviso
        ↓
ComboConfiguration dependiente
```

La revisión pendiente no bloquea automáticamente la disponibilidad.

---

# 31. Revisiones comerciales

Los precios pertenecen exclusivamente a Menu.

Cambios como:

```text
MenuItemVariant.unitPrice
ModifierOption.priceDelta
```

son cambios comerciales.

La revisión comercial se utiliza principalmente para combos dependientes.

Ejemplo:

```text
precio de Hamburguesa Grande cambia
        ↓
ComboOption referencia esa variante
        ↓
ComboConfiguration REVIEW_REQUIRED
```

Esto permite al administrador decidir si debe modificar:

```text
ComboConfiguration.unitPrice
ComboOption.priceDelta
```

o conservarlos.

Kitchen no determina ni modifica precios.

---

# 32. Relación entre cambios culinarios y precio

Un cambio culinario puede tener consecuencias económicas, pero Kitchen no decide esas consecuencias.

Ejemplo:

```text
queso
180 g → 220 g
```

Kitchen publica el cambio culinario.

Menu puede informar al administrador de que la variante requiere revisión.

El administrador puede decidir:

```text
mantener precio
```

o:

```text
modificar precio
```

Si modifica el precio, ese nuevo cambio se procesa como un cambio comercial normal y puede generar revisión adicional en los combos dependientes.

No es necesario que chef y administrador trabajen simultáneamente.

El flujo es asincrónico.

---

# 33. Seguimiento y acknowledgement de revisiones

Las revisiones no deben reducirse únicamente a un booleano.

Debe ser posible identificar qué cambio fue observado y cuál fue reconocido.

Conceptualmente:

```text
observedRevision = 8
acknowledgedRevision = 7

→ REVIEW_REQUIRED
```

Después de revisar:

```text
acknowledgedRevision = 8
```

Si aparece posteriormente:

```text
observedRevision = 9
```

la revisión vuelve a quedar pendiente.

Esto evita que el reconocimiento de un cambio anterior elimine accidentalmente revisiones más recientes.

También permite procesar eventos fuera de orden de manera segura.

---

# 34. Tipos de revisión resultantes

Quedan conceptualmente dos causas principales de revisión.

```text
REVISIÓN COMERCIAL
────────────────────────
Origen:
Menu

Causa:
precio/configuración comercial

Target principal:
ComboConfiguration
```

y:

```text
REVISIÓN CULINARIA
────────────────────────
Origen:
Orders + Kitchen

Causa:
receta / composición / efectos físicos

Target inicial:
MenuItemVariant

Propagación:
ComboConfiguration dependiente
```

Pueden compartir infraestructura administrativa de revisión, pero sus razones no deben confundirse.

---

# 35. Cambios que NO generan revisión

Los cambios puramente operacionales de disponibilidad no generan revisión comercial ni culinaria.

Por ejemplo:

```text
queso disponible:
20 kg → 3 kg
```

puede cambiar:

```text
availableMaxQuantity
VariantAvailability
ComboConfigurationAvailability
```

pero no significa que haya cambiado:

```text
la receta
el precio
la definición comercial
```

Por tanto:

```text
AvailabilityChanged
≠ REVIEW_REQUIRED
```

---

# 36. Archivo de variantes

Archivar una variante continúa estando permitido.

La secuencia estructural es:

```text
MenuItemVariant → ARCHIVED
        ↓
deja de ser elegible
        ↓
ComboOption que la referencia deja de ser elegible
        ↓
reevaluar ComboConfiguration
```

Si una configuración deja de poder satisfacer un slot:

```text
ComboConfiguration
→ no elegible
→ revisión administrativa correspondiente
```

No se cambia automáticamente:

```text
Combo.MenuItem.status
```

El estado administrativo permanece bajo control explícito del administrador.

---

# 37. Copia de ComboSlot

No se realiza matching automático por:

```text
nombre
posición
semántica inferida
```

Cuando se clona una `ComboConfiguration` completa, sus slots se crean con nuevas identidades.

Cuando se copia hacia una configuración existente debe proporcionarse explícitamente:

```text
sourceSlotId → targetSlotId
```

Cada configuración destino constituye una unidad atómica.

Puede existir éxito parcial entre distintos destinos de un lote, pero nunca una `ComboConfiguration` parcialmente modificada.

---

# 38. Comunicación y consistencia

Los servicios no comparten tablas ni asociaciones ORM entre bases de datos.

Las referencias entre bounded contexts utilizan IDs.

Ejemplos:

```text
itemVariantId
modifierOptionId
inventoryItemId
```

Los datos replicados en otro servicio deben considerarse:

```text
proyección
snapshot
cache
```

y nunca una segunda fuente autoritativa.

Especialmente:

```text
availability dentro de Menu
→ proyección operacional

recipe dentro de Kitchen
→ fuente autoritativa culinaria

stock dentro de Inventory
→ fuente autoritativa física
```

---

# 39. Flujo completo de alto nivel

```text
ADMIN
  │
  │ administra catálogo / precios / combos
  ▼
MENU
  │
  │ publica identidades comerciales
  ▼
ORDERS + KITCHEN
  │
  │ chef define preparación
  │
  │ resuelve requerimientos físicos
  ▼
INVENTORY
  │
  │ informa existencias
  ▲
  │
ORDERS + KITCHEN
  │
  │ calcula disponibilidad operacional
  │
  ├── VariantAvailabilityChanged
  ├── ModifierAvailabilityChanged
  ├── PreparationStatusChanged
  ├── RecipeChanged
  └── IngredientEffectChanged
  ▼
MENU
  │
  │ materializa disponibilidad
  │ propaga hacia combos
  │ registra revisiones
  ▼
SALA / POS
```

Para una venta:

```text
SALA / POS
    ↓
selección comercial
    ↓
ORDERS + KITCHEN
    ↓
orden + preparación
    ↓
INVENTORY
reserva / consumo
```

---

# 40. Principio final

El modelo queda organizado alrededor de tres responsabilidades claramente separadas:

```text
MENU
────────────────────────
Identidad comercial
Variantes
Modifiers comerciales
Precios
Combos
Categorías
Estado administrativo
Elegibilidad
Proyecciones de disponibilidad
Revisiones administrativas

ORDERS + KITCHEN
────────────────────────
Órdenes
Preparación
Recipes
PreparationRevision
Gramajes
Efectos físicos de modifiers
Readiness
Resolución física
Disponibilidad operacional

INVENTORY
────────────────────────
Artículos físicos
Stock
Reservas
Consumo
Movimientos
```

La regla arquitectónica principal es:

> Menu sabe qué puede ofrecerse comercialmente, Orders + Kitchen sabe qué se
> pidió y cómo debe satisfacerse físicamente, e Inventory sabe qué recursos
> existen y cuánto queda.

Los servicios colaboran mediante IDs, contratos y eventos, pero ninguno debe
absorber el conocimiento de dominio que pertenece a los demás.

```

Los cambios realmente importantes respecto a la síntesis que adjuntaste están en las antiguas secciones de `Prepared/Recipe` y modifiers: antes la variante de Menu apuntaba directamente a una revisión de receta :contentReference[oaicite:2]{index=2} y la configuración comercial del modifier incluía `ingredientEffects` tanto en la configuración general como en la excepción por variante. :contentReference[oaicite:3]{index=3} Eso queda sustituido por **identidad y pricing en Menu + interpretación física en Orders/Kitchen**.

También conservaría intacta la separación ya acordada entre estado administrativo, elegibilidad y disponibilidad, pero actualizando quién calcula esta última: la síntesis anterior todavía decía que dependía de Inventory de forma general. :contentReference[oaicite:4]{index=4} Ahora queda explícito que **Orders/Kitchen realiza la traducción semántica/física y publica el resultado operacional; Menu sólo lo proyecta y propaga sobre su catálogo y combos**.
```
