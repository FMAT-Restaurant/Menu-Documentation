# Cuestiones abiertas del modelo de catálogo

Esta sección registra decisiones de requisitos que no quedan determinadas por el modelo vigente. No asigna respuestas por inferencia.

| Identificador | Cuestión | Alcance establecido | Decisión pendiente |
| :--- | :--- | :--- | :--- |
| OPEN-001 | Importes de precios | Cada oferta tiene un precio base propio. El precio final de la orden se determina fuera del catálogo. | Moneda aplicable, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`. |
| OPEN-003 | Alcance de la biblioteca de recetas | Toda receta se almacena en una `RecipeLibrary`; puede seleccionarse por el ID de una receta existente o crearse durante la configuración de una `SlotOption`. | Si una biblioteca puede compartirse entre varios menús o si su alcance corresponde a un solo menú. |
| OPEN-006 | Cantidades y unidades | Todos los `CompositionSlot` en estado `ACTIVE` participan en la selección y cada uno genera el número de rondas expresado por su `quantity`; los slots `INACTIVE` no generan rondas. En cada ronda se elige una opción `ACTIVE`. Si el slot tiene una sola opción `ACTIVE`, esta se toma por defecto. Cada ingrediente de receta referencia un artículo de Inventario, conserva su cantidad y muestra la unidad de medida autoritativa de ese artículo. | Rangos, precisión y valor predeterminado de `CompositionSlot.quantity`; rangos, precisión y valores fraccionarios de cantidades de contenido directo de Inventario y de ingredientes de receta; y si se admiten unidades compatibles distintas de la unidad base de Inventario y sus conversiones. |
| OPEN-009 | Distribución de carga del perfil nominal | El perfil establece concurrencia, tasa sostenida, duración y clases de operación del catálogo y validación de selecciones. | Proporción de solicitudes entre las clases y la distribución representativa que se usará en la evaluación. |
| OPEN-010 | Contrato externo de la API | El [contrato modular existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) expone operaciones administrativas. El flujo de imágenes está decidido: carga validada con identificador generado por el servidor y asociación mediante `imageId` en JSON. | Alineación integral del contrato con la ERS y operaciones y representaciones faltantes para catálogo publicable, historial, revisiones, copia de composición y actualización de ingredientes de recetas. |

## OPEN-001 — Importes de precios

Definir las reglas de moneda, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`.

## OPEN-003 — Alcance de la biblioteca de recetas

Determinar si `RecipeLibrary` es compartida por varios menús o tiene alcance de un solo menú.

## OPEN-006 — Cantidades y unidades

Fijar los rangos, la precisión y el valor predeterminado de `CompositionSlot.quantity`, que expresa el número de rondas de selección del slot, y los rangos, la precisión y los valores fraccionarios de las cantidades de contenido directo de Inventario y de ingredientes de receta. También determinar si se admiten unidades compatibles distintas de la unidad base de Inventario y, en tal caso, cómo se convierten. La unidad de medida del artículo seleccionado se muestra y no constituye una decisión pendiente.

## OPEN-009 — Distribución de carga del perfil nominal

Definir la proporción de solicitudes entre consulta del catálogo y validación de selecciones, además de los datos representativos con los que se ejecutará la evaluación de carga nominal.

## OPEN-010 — Contrato externo de la API

El [contrato modular existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) ya define rutas, métodos y representaciones para operaciones administrativas. Sigue pendiente su alineación integral con la ERS y la definición de las operaciones y representaciones faltantes para el catálogo publicable, el historial, las revisiones, la copia de composición y la actualización de ingredientes de recetas. La revisión de los mockups orientará esas decisiones.

El transporte de imágenes está decidido: `POST /api/v1/media/images` valida el archivo y devuelve `data.id` con un UUID generado por el servidor. Después, las solicitudes JSON de creación o actualización de entradas y ofertas utilizan ese identificador como `imageId`. La carga y la asociación son operaciones separadas; este flujo no constituye una decisión pendiente de OPEN-010.
