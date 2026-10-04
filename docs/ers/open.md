# Cuestiones abiertas del modelo de catálogo

Esta sección registra decisiones de requisitos que no quedan determinadas por el modelo vigente. No asigna respuestas por inferencia.

| Identificador | Cuestión | Alcance establecido | Decisión pendiente |
| :--- | :--- | :--- | :--- |
| OPEN-001 | Importes de precios | Cada oferta tiene un precio base propio. El precio final de la orden se determina fuera del catálogo. | Moneda aplicable, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`. |
| OPEN-003 | Alcance de la biblioteca de recetas | Toda receta se almacena en una `RecipeLibrary`; puede seleccionarse por el ID de una receta existente o crearse durante la configuración de una `SlotOption`. | Si una biblioteca puede compartirse entre varios menús o si su alcance corresponde a un solo menú. |
| OPEN-006 | Cantidades y unidades | Cada `CompositionSlot` pertenece estructuralmente a la oferta, pero participa en la selección solo si está `ACTIVE` y es requerido, o si está `ACTIVE` y opcional y el cliente decide incluirlo. Un slot `INACTIVE` o un slot opcional omitido no genera rondas; en cada ronda se elige una opción `ACTIVE`. Si el grupo participante tiene una sola opción `ACTIVE`, esta se toma por defecto. `CompositionSlot.quantity` expresa el número de rondas del grupo cuando participa. Cada ingrediente de receta referencia un artículo de Inventario, conserva su cantidad y muestra la unidad de medida autoritativa de ese artículo. | Rangos, precisión y valor predeterminado de `CompositionSlot.quantity`; rangos, precisión y valores fraccionarios de cantidades de contenido directo de Inventario y de ingredientes de receta; y si se admiten unidades compatibles distintas de la unidad base de Inventario y sus conversiones. |
| OPEN-009 | Distribución de carga del perfil nominal | El perfil establece concurrencia, tasa sostenida, duración y clases de operación del catálogo y validación de selecciones. | Proporción de solicitudes entre las clases y la distribución representativa que se usará en la evaluación. |
| OPEN-010 | Contrato externo de la API | Las capacidades funcionales del catálogo ya están especificadas; los mockups orientarán cómo exponerlas. | Qué rutas y métodos exponen esas capacidades y qué datos de solicitud y respuesta deben exponerse, incluida su representación. |

## OPEN-001 — Importes de precios

Definir las reglas de moneda, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`.

## OPEN-003 — Alcance de la biblioteca de recetas

Determinar si `RecipeLibrary` es compartida por varios menús o tiene alcance de un solo menú.

## OPEN-006 — Cantidades y unidades

Fijar los rangos, la precisión y el valor predeterminado de `CompositionSlot.quantity`, que expresa el número de rondas de selección del grupo, y los rangos, la precisión y los valores fraccionarios de las cantidades de contenido directo de Inventario y de ingredientes de receta. También determinar si se admiten unidades compatibles distintas de la unidad base de Inventario y, en tal caso, cómo se convierten. La unidad de medida del artículo seleccionado se muestra y no constituye una decisión pendiente.

## OPEN-009 — Distribución de carga del perfil nominal

Definir la proporción de solicitudes entre consulta del catálogo y validación de selecciones, además de los datos representativos con los que se ejecutará la evaluación de carga nominal.

## OPEN-010 — Contrato externo de la API

Después de revisar los mockups, determinar qué rutas y métodos de API exponen las capacidades funcionales ya establecidas y qué datos deben recibirse y exponerse para los flujos. Hasta entonces, no se fijan rutas, métodos, parámetros, esquemas de solicitud o respuesta ni formatos de representación externa.
