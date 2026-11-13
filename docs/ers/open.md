# Cuestiones abiertas del modelo de catálogo

Esta sección registra las decisiones de requisitos que no quedan determinadas por la especificación vigente. No asigna respuestas por inferencia; cada cuestión indica lo que ya está establecido y lo que queda pendiente.

| ID | Cuestión | Alcance establecido | Decisión pendiente |
| :-- | :-- | :-- | :-- |
| OPEN-001 | Moneda e importes | Cada oferta tiene un precio base propio; el precio final lo determina Órdenes (RF-OFE-03). La carta imprimible muestra la moneda en su encabezado (RF-CONS-07). | Moneda aplicable y su origen (quién fija la moneda del menú; por ejemplo, la configuración de la sucursal); precisión, redondeo y rangos admisibles del precio base. |
| OPEN-003 | Alcance de la biblioteca de recetas | Toda receta pertenece a la biblioteca; se asigna por su identificador o se crea desde una opción (RF-REC-01, RF-OPC-09, RF-OPC-10). | Si la biblioteca se comparte entre varios menús o corresponde a uno solo. |
| OPEN-006 | Cantidades y unidades | Número de rondas por grupo de selección (RF-COMP-03); cantidades positivas del contenido directo de Inventario y de las líneas de ingrediente, expresadas en la unidad que Inventario establece para el artículo, sin unidad propia (RF-OPC-08, RF-REC-02); unidad de medida visible (RF-REC-03). | Rangos, precisión y valor predeterminado del número de rondas; rangos, precisión y valores fraccionarios de las cantidades. |
| OPEN-009 | Distribución de carga del perfil nominal | Clases de operación de RNF-REND-02: consulta del catálogo, búsqueda por texto y filtrado por categoría. La validación de selecciones no forma parte de la mezcla. | Proporción entre la consulta, la búsqueda y el filtrado, y datos representativos para la evaluación. |
| OPEN-010 | Contrato externo de la API | El contrato modular expone operaciones administrativas; el flujo de imágenes está decidido (RF-IMG-01..05). Las longitudes máximas, la idempotencia de los reintentos y la paginación pertenecen al contrato. | Alineación integral del contrato con la ERS 3.1.0 y operaciones o representaciones faltantes (véase la sección de esta cuestión). |
| OPEN-011 | Contrato de eventos con Inventario | Menu emite eventos de receta e Inventario emite eventos de factibilidad y de disponibilidad (RF-INTG-03..05); la validación de artículos es síncrona (RF-INTG-01). | Estructura y contenido de cada evento, identificación, duplicados, orden, consistencia eventual, disponibilidad inicial, retiro de artículos, ámbito por sucursal y reconciliación (véase la sección de esta cuestión). |
| OPEN-012 | Notificación al administrador ante cambios de disponibilidad | La disponibilidad no cambia el estado administrativo; Menu no emite eventos de catálogo a sus consumidores (RF-CONS-05.CA1). | Si se notifica al administrador y por qué medio; si esos cambios abren una revisión de las ofertas afectadas. |
| OPEN-013 | Capacidades más finas | Dos capacidades: administrar el catálogo y consultarlo; la autenticación y la asignación de capacidades son externas (RF-GEN-01). | Si existen capacidades más finas que «administrar el catálogo» y qué operaciones cubre cada una. |
| OPEN-014 | Retención de imágenes nunca asociadas | Cada imagen pertenece a un solo recurso; su archivo anterior se elimina al reemplazarlo y la imagen se elimina con su recurso (RF-IMG-04, RF-IMG-05). | Cuánto tiempo se conservan, y si se eliminan, las imágenes cargadas que nunca se asocian a una entrada u oferta. |

## OPEN-001 — Importes de precios

Cada oferta tiene un precio base propio, y el precio final de la orden lo determina Órdenes (RF-OFE-03). Queda por definir la moneda aplicable y su origen, es decir, quién fija la moneda del menú (por ejemplo, la configuración de la sucursal), así como las reglas de precisión, redondeo y rangos admisibles del precio base de la oferta. La carta imprimible muestra la moneda en su encabezado (RF-CONS-07.CA6), por lo que esa decisión determina también la moneda que figura en ella.

## OPEN-003 — Alcance de la biblioteca de recetas

Toda receta pertenece a la biblioteca de recetas; una opción la asigna únicamente por su identificador o la crea durante su configuración (RF-REC-01, RF-OPC-09, RF-OPC-10). Queda por determinar si la biblioteca de recetas se comparte entre varios menús o corresponde a un solo menú.

## OPEN-006 — Cantidades y unidades

Cada grupo de selección genera el número de rondas que indica su configuración (RF-COMP-03). Las cantidades del contenido directo de Inventario y de las líneas de ingrediente son positivas y se expresan en la unidad que Inventario establece para el artículo, sin unidad propia (RF-OPC-08, RF-REC-02); la unidad de medida del artículo se muestra (RF-REC-03) y no constituye una decisión pendiente. Quedan por fijar los rangos, la precisión y el valor predeterminado del número de rondas de cada grupo de selección, y los rangos, la precisión y los valores fraccionarios de las cantidades.

## OPEN-009 — Distribución de carga del perfil nominal

El perfil nominal de RNF-REND-02 comprende tres clases de operación: consulta del catálogo, búsqueda por texto y filtrado por categoría; la validación de selecciones no forma parte de la mezcla. Queda por definir la proporción de solicitudes entre esas tres clases y los datos representativos con los que se ejecutará la evaluación de carga nominal.

## OPEN-010 — Contrato externo de la API

El [contrato modular existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) ya define rutas, métodos y representaciones para operaciones administrativas, y el flujo de imágenes está decidido en RF-IMG-01..05. Las longitudes máximas de los textos, la idempotencia de los reintentos y la paginación pertenecen al contrato y no a esta especificación.

Sigue pendiente la alineación integral del contrato con la ERS 3.1.0 y la definición de las operaciones o representaciones faltantes: la consulta no administrativa del catálogo, la búsqueda y el filtrado, la consulta administrativa, el historial de revisiones de recetas, la copia de composición, la actualización de líneas de ingrediente, la eliminación de categorías, el orden de presentación, el reemplazo del archivo de una imagen con identificador fijo, la generación de la carta imprimible (RF-CONS-06), la representación del estado administrativo y de la disponibilidad, y la visibilidad según la capacidad. La revisión de las maquetas de pantalla orientará esas decisiones.

## OPEN-011 — Contrato de eventos con Inventario

La comunicación entre Menu e Inventario está decidida: la validación de artículos es síncrona (RF-INTG-01), Menu emite eventos de receta e Inventario emite eventos de factibilidad de recetas y de disponibilidad de artículos (RF-INTG-03..05). Su contrato se definirá posteriormente, como ocurrió con el contrato de la API.

Falta precisar la estructura y el contenido de cada evento; qué datos de receta recibe Inventario; cómo se identifican la receta y su revisión; cómo se tratan los eventos duplicados o fuera de orden y qué grado de consistencia eventual se acepta; qué disponibilidad tiene un recurso mientras no ha llegado ningún evento, también en el caso de las opciones creadas por copia; el evento de retiro (eliminación o baja) de un artículo; el ámbito por sucursal de los eventos; y la reconciliación de la copia local de recetas que mantiene Inventario.

## OPEN-012 — Notificación y revisión ante cambios de disponibilidad

La disponibilidad nunca altera el estado administrativo, y Menu no emite eventos de catálogo a sus consumidores (RF-CONS-05.CA1). Queda por decidir si se notifica al administrador que una oferta ha dejado de poder ordenarse o ha vuelto a poder hacerlo y por qué medio se entrega esa notificación, así como si esos cambios abren una revisión de las ofertas afectadas, entendida como su examen por el administrador antes de que resuelva su estado administrativo.

## OPEN-013 — Capacidades más finas

El catálogo distingue dos capacidades, administrarlo y consultarlo; la autenticación y la asignación de capacidades son externas a Menu (RF-GEN-01). Queda por determinar si existen capacidades más finas que «administrar el catálogo», por ejemplo una que solo permita cambiar el estado administrativo de las opciones, y qué operaciones cubre cada una.

## OPEN-014 — Retención de imágenes nunca asociadas

Cada imagen pertenece a un solo recurso; su archivo anterior se elimina al reemplazarlo y la imagen se elimina junto con su recurso (RF-IMG-04, RF-IMG-05). Queda por determinar cuánto tiempo se conservan, y si se eliminan, las imágenes cargadas que nunca se asocian a una entrada u oferta.
