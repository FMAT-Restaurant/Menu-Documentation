# Cuestiones abiertas del modelo de catálogo

Esta sección registra decisiones de requisitos que no quedan determinadas por el modelo vigente. No asigna respuestas por inferencia.

| Identificador | Cuestión | Alcance establecido | Decisión pendiente |
| :--- | :--- | :--- | :--- |
| OPEN-001 | Importes de precios | Cada oferta tiene un precio base propio. El precio final de la orden se determina fuera del catálogo. | Moneda aplicable, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`. |
| OPEN-003 | Alcance de la biblioteca de recetas | Toda receta se almacena en una `RecipeLibrary`; puede seleccionarse por el ID de una receta existente o crearse durante la configuración de una `SlotOption`. | Si una biblioteca puede compartirse entre varios menús o si su alcance corresponde a un solo menú. |
| OPEN-006 | Cantidades y unidades | Todos los `CompositionSlot` participan en la selección y cada uno genera el número de rondas expresado por su `quantity`. En cada ronda se elige una opción `ACTIVE` con `isAvailable`; si el slot tiene una sola, esta se toma por defecto. Cada ingrediente de receta referencia un artículo de Inventario, conserva su cantidad y muestra la unidad de medida autoritativa de ese artículo. | Rangos, precisión y valor predeterminado de `CompositionSlot.quantity`; rangos, precisión y valores fraccionarios de cantidades de contenido directo de Inventario y de ingredientes de receta; y si se admiten unidades compatibles distintas de la unidad base de Inventario y sus conversiones. |
| OPEN-009 | Distribución de carga del perfil nominal | El perfil establece concurrencia, tasa sostenida, duración y clases de operación del catálogo y validación de selecciones. | Proporción de solicitudes entre las clases y la distribución representativa que se usará en la evaluación. |
| OPEN-010 | Contrato externo de la API | El [contrato modular existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) expone operaciones administrativas. El flujo de imágenes está decidido: carga validada con identificador generado por el servidor y asociación mediante `imageId` en JSON. | Alineación integral del contrato con la ERS y operaciones y representaciones faltantes para la consulta no administrativa del catálogo, historial de revisiones de recetas, copia de composición y actualización de ingredientes de recetas, y la representación de `status` administrativo e `isAvailable`, y la visibilidad según capacidad administrativa. |
| OPEN-011 | Contrato de eventos con Inventario | Menu emite eventos al crear, revisar o eliminar recetas, e Inventario emite eventos de factibilidad de recetas y de disponibilidad de artículos, que Menu usa para recalcular `isAvailable` (BR-MENU-034). | Envelope y payload de cada evento, datos de receta que recibe Inventario, identificación de receta y revisión, idempotencia y duplicados, orden y consistencia eventual, y valor de `isAvailable` antes del primer evento. |
| OPEN-012 | Notificación y revisión ante cambios de disponibilidad | Los cambios de `isAvailable` no modifican el `status`; el administrador decide el `status`. | Si se notifica al administrador cuando cambia la disponibilidad y cómo; y si esos cambios generan revisiones o un flujo para revisar las ofertas afectadas y decidir su `status`. |

## OPEN-001 — Importes de precios

Definir las reglas de moneda, precisión, redondeo y rangos admisibles de `CatalogOffer.basePrice`.

## OPEN-003 — Alcance de la biblioteca de recetas

Determinar si `RecipeLibrary` es compartida por varios menús o tiene alcance de un solo menú.

## OPEN-006 — Cantidades y unidades

Fijar los rangos, la precisión y el valor predeterminado de `CompositionSlot.quantity`, que expresa el número de rondas de selección del slot, y los rangos, la precisión y los valores fraccionarios de las cantidades de contenido directo de Inventario y de ingredientes de receta. También determinar si se admiten unidades compatibles distintas de la unidad base de Inventario y, en tal caso, cómo se convierten. La unidad de medida del artículo seleccionado se muestra y no constituye una decisión pendiente.

## OPEN-009 — Distribución de carga del perfil nominal

Definir la proporción de solicitudes entre consulta del catálogo y validación de selecciones, además de los datos representativos con los que se ejecutará la evaluación de carga nominal.

## OPEN-010 — Contrato externo de la API

El [contrato modular existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) ya define rutas, métodos y representaciones para operaciones administrativas. Sigue pendiente su alineación integral con la ERS y la definición de las operaciones y representaciones faltantes para la consulta no administrativa del catálogo, el historial de revisiones de recetas, la copia de composición y la actualización de ingredientes de recetas. La API también debe alinearse con la separación entre `status` e `isAvailable` y con la visibilidad según la capacidad administrativa (BR-MENU-032, BR-MENU-033). La revisión de los mockups orientará esas decisiones.

El transporte de imágenes está decidido: `POST /api/v1/media/images` valida el archivo y devuelve `data.id` con un UUID generado por el servidor. Después, las solicitudes JSON de creación o actualización de entradas y ofertas utilizan ese identificador como `imageId`. La carga y la asociación son operaciones separadas; este flujo no constituye una decisión pendiente de OPEN-010.

## OPEN-011 — Contrato de eventos con Inventario

La comunicación asíncrona entre Menu e Inventario está decidida (BR-MENU-034), pero su contrato se definirá posteriormente, como ocurrió con el contrato de la API. Falta precisar la estructura y el contenido de los eventos que intercambian ambos servicios, qué datos de receta necesita Inventario para su copia local, cómo se identifican la receta y su revisión, cómo se tratan los eventos duplicados o fuera de orden, qué grado de consistencia eventual se acepta y qué `isAvailable` tiene un recurso mientras no ha llegado ningún evento.

## OPEN-012 — Notificación y revisión ante cambios de disponibilidad

Como la disponibilidad nunca altera el `status`, queda por decidir cómo se entera el administrador de que una oferta ha dejado de poder ordenarse o ha vuelto a poder hacerlo. Debe determinarse si existe una notificación, por qué medio se entrega y si esos cambios abren una revisión o un flujo de trabajo para examinar las ofertas afectadas antes de que el administrador resuelva su `status`.
