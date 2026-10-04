# Cuestiones abiertas del modelo de catálogo

Esta sección registra decisiones de requisitos que no quedan determinadas por el modelo vigente. No asigna respuestas por inferencia.

| Identificador | Cuestión | Alcance establecido | Decisión pendiente |
| :--- | :--- | :--- | :--- |
| OPEN-001 | Importes de precios | Cada oferta tiene un precio base propio. El precio final de la orden se determina fuera del catálogo. | Moneda aplicable, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`. |
| OPEN-002 | Oferta predeterminada | Una entrada puede referenciar una oferta predeterminada mediante `defaultOfferId`. | Si la referencia determina una presentación inicial para consulta o selección, y cómo se resuelve cuando la oferta deja de estar activa. |
| OPEN-003 | Alcance de la biblioteca de recetas | Toda receta se almacena en una `RecipeLibrary`; puede seleccionarse por el ID de una receta existente o crearse durante la configuración de una `SlotOption`. | Si una biblioteca puede compartirse entre varios menús o si su alcance corresponde a un solo menú. |
| OPEN-006 | Cantidades y unidades | Cada `CompositionSlot` se incluye en la oferta y agrupa opciones; si tiene una sola opción, esta se toma por defecto y, si tiene varias, se selecciona una por ronda. `SlotOption.quantity` expresa cuántas rondas de selección corresponden a esa opción. La cantidad de contenido directo de Inventario es positiva y compatible con la unidad del artículo. | Rangos, precisión y valor predeterminado de `SlotOption.quantity`; cómo resolver cantidades distintas entre opciones del mismo grupo; rangos, precisión y unidades de cantidades de contenido directo de Inventario; y rangos, precisión, valores fraccionarios y unidades de cantidades de receta. |
| OPEN-007 | Valores del curso sugerido | Un slot puede expresar un curso como sugerencia de servicio; se contemplan entrada, plato fuerte, postre y bebida. | Si esos valores forman una lista cerrada o si se permiten otros cursos configurables. |
| OPEN-008 | Opciones activas en ofertas válidas | Las opciones de contenido tienen estado activo o inactivo, y todos los slots configurados se incluyen en la oferta. | Si una oferta válida requiere que cada slot siempre incluido tenga al menos una opción activa o si basta con que tenga una opción definida estructuralmente. |
| OPEN-009 | Distribución de carga del perfil nominal | El perfil establece concurrencia, tasa sostenida, duración y clases de operación del catálogo y validación de selecciones. | Proporción de solicitudes entre las clases y la distribución representativa que se usará en la evaluación. |
| OPEN-010 | Contrato externo de la API | Las capacidades funcionales del catálogo ya están especificadas; los mockups orientarán cómo exponerlas. | Qué rutas y métodos exponen esas capacidades y qué datos de solicitud y respuesta deben exponerse, incluida su representación. |

## OPEN-001 — Importes de precios

Definir las reglas de moneda, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`.

## OPEN-002 — Oferta predeterminada

Precisar para qué consultas o procesos se utiliza la oferta predeterminada de una entrada y qué resultado se presenta si la oferta referenciada está inactiva o no está disponible como elección vigente.

## OPEN-003 — Alcance de la biblioteca de recetas

Determinar si `RecipeLibrary` es compartida por varios menús o tiene alcance de un solo menú.

## OPEN-006 — Cantidades y unidades

Fijar los rangos, la precisión y el valor predeterminado de `SlotOption.quantity`, que expresa cuántas rondas de selección corresponden a una opción; cómo resolver cantidades distintas declaradas por opciones del mismo grupo; y los rangos, la precisión y las unidades de las cantidades de contenido directo de Inventario y de receta, incluidas las reglas para cantidades fraccionarias.

## OPEN-007 — Valores del curso sugerido

Confirmar si el conjunto de cursos sugeridos se limita a entrada, plato fuerte, postre y bebida o si cada menú puede definir valores adicionales.

## OPEN-008 — Opciones activas en ofertas válidas

Precisar si una oferta válida requiere que cada slot siempre incluido tenga al menos una opción activa o si basta con que tenga una opción definida estructuralmente.

## OPEN-009 — Distribución de carga del perfil nominal

Definir la proporción de solicitudes entre consulta del catálogo y validación de selecciones, además de los datos representativos con los que se ejecutará la evaluación de carga nominal.

## OPEN-010 — Contrato externo de la API

Después de revisar los mockups, determinar qué rutas y métodos de API exponen las capacidades funcionales ya establecidas y qué datos deben recibirse y exponerse para los flujos. Hasta entonces, no se fijan rutas, métodos, parámetros, esquemas de solicitud o respuesta ni formatos de representación externa.
