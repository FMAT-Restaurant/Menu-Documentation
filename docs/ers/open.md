# Cuestiones abiertas del modelo de catálogo

Esta sección registra decisiones de requisitos que no quedan determinadas por el modelo vigente. No asigna respuestas por inferencia.

| Identificador | Cuestión | Alcance establecido | Decisión pendiente |
| :--- | :--- | :--- | :--- |
| OPEN-001 | Importes de precios | Cada oferta tiene un precio base propio. El precio final de la orden se determina fuera del catálogo. | Moneda aplicable, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`. |
| OPEN-002 | Oferta predeterminada | Una entrada puede referenciar una oferta predeterminada mediante `defaultOfferId`. | Si la referencia determina una presentación inicial para consulta o selección, y cómo se resuelve cuando la oferta deja de estar activa. |
| OPEN-003 | Alcance de reutilización de recetas | Las recetas reutilizables se agrupan en una `RecipeLibrary` y pueden usarse desde distintas ofertas. | Si una biblioteca puede compartirse entre varios menús o si su alcance corresponde a un solo menú. |
| OPEN-006 | Cantidades y unidades | La cantidad de contenido directo de Inventario es positiva y compatible con la unidad del artículo. Los slots y las líneas de receta expresan cantidades, y las líneas identifican una unidad. | Rangos y precisión de cantidades en slots y recetas, reglas para valores fraccionarios y reglas de unidades de receta. |
| OPEN-007 | Valores del curso sugerido | Un slot puede expresar un curso como sugerencia de servicio; se contemplan entrada, plato fuerte, postre y bebida. | Si esos valores forman una lista cerrada o si se permiten otros cursos configurables. |
| OPEN-008 | Alternativas activas en composiciones activas | Las alternativas de contenido tienen estado activo o inactivo, y una oferta activa requiere una composición válida. | Si una composición válida exige que cada slot tenga al menos una alternativa activa o si basta con una alternativa estructuralmente definida. |
| OPEN-009 | Distribución de carga del perfil nominal | El perfil establece concurrencia, tasa sostenida, duración y clases de operación del catálogo y validación de selecciones. | Proporción de solicitudes entre las clases y la distribución representativa que se usará en la evaluación. |
| OPEN-010 | Contrato externo de la API | Las capacidades funcionales del catálogo ya están especificadas; los mockups orientarán cómo exponerlas. | Qué rutas y métodos exponen esas capacidades y qué datos de solicitud y respuesta deben exponerse, incluida su representación. |

## OPEN-001 — Importes de precios

Definir las reglas de moneda, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`.

## OPEN-002 — Oferta predeterminada

Precisar para qué consultas o procesos se utiliza la oferta predeterminada de una entrada y qué resultado se presenta si la oferta referenciada está inactiva o no está disponible como elección vigente.

## OPEN-003 — Alcance de reutilización de recetas

Determinar si `RecipeLibrary` es compartida por varios menús o pertenece a un único menú, incluidas las consecuencias administrativas de reutilizar y publicar una receta en ese alcance.

## OPEN-006 — Cantidades y unidades

Fijar los rangos y la precisión de `CompositionSlot.quantity` y de las cantidades de receta, así como las reglas para cantidades fraccionarias y las unidades usadas en líneas de receta.

## OPEN-007 — Valores del curso sugerido

Confirmar si el conjunto de cursos sugeridos se limita a entrada, plato fuerte, postre y bebida o si cada menú puede definir valores adicionales.

## OPEN-008 — Alternativas activas en composiciones activas

Precisar si para que una oferta pueda activarse cada slot debe disponer de al menos una alternativa activa, considerando por separado los slots siempre incluidos y los slots elegibles.

## OPEN-009 — Distribución de carga del perfil nominal

Definir la proporción de solicitudes entre consulta del catálogo y validación de selecciones, además de los datos representativos con los que se ejecutará la evaluación de carga nominal.

## OPEN-010 — Contrato externo de la API

Después de revisar los mockups, determinar qué rutas y métodos de API exponen las capacidades funcionales ya establecidas y qué datos deben recibirse y exponerse para los flujos. Hasta entonces, no se fijan rutas, métodos, parámetros, esquemas de solicitud o respuesta ni formatos de representación externa.
