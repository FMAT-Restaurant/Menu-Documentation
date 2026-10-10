# ERS del servicio Menu

Índice de los requisitos, reglas de dominio y criterios de calidad del servicio **Menu** para el catálogo de un restaurante. El modelo conceptual vigente se describe en [`../other/md/domain-model.md`](../other/md/domain-model.md).

## Estado documental

| Campo | Valor |
| :--- | :--- |
| Servicio | Menu |
| Versión | 2.1.17 |
| Estado | Vigente / En revisión con cuestiones abiertas pendientes |
| Configuración de referencia | [`configuration.md`](configuration.md) |
| Alcance | Menu administra la identidad comercial del catálogo; cada `CatalogEntry` contiene ofertas y cada `CatalogOffer` concreta es vendible y seleccionable individualmente, con su composición. Una `Composition` contiene slots; todos los `CompositionSlot` son estructurales y `CompositionSlot.quantity` determina cuántas veces se eligen opciones de cada slot. El estado del slot se deriva de sus opciones: `ACTIVE` si al menos una está `ACTIVE`, e `INACTIVE` si ninguna lo está. Todos los slots `ACTIVE` participan y los `INACTIVE` no generan rondas. Si ningún slot permanece `ACTIVE`, la oferta pasa automáticamente a `INACTIVE`; cuando vuelve a haber un slot `ACTIVE`, la oferta se reactiva automáticamente si esa inactivación se debió a la ausencia de slots activos y no hubo una inactivación administrativa explícita. El estado administrativo de la entrada no cambia por esa cascada y una entrada `ACTIVE` sin oferta `ACTIVE` válida permanece oculta. Al configurar una composición desde otra oferta del catálogo, sus slots y opciones se copian como definiciones locales editables, conservando el estado de las opciones, sin vínculo, precio ni sincronización con la oferta de origen. RecipeLibrary administra recetas con datos textuales e ingredientes de Inventario, cantidad por ingrediente y unidad visible; las opciones de slot las referencian por ID y revisión. Órdenes registra la opción elegida en cada ronda y determina el precio final. |

La especificación establece capacidades observables, restricciones del dominio, criterios no funcionales y preguntas pendientes. No afirma que el software ya las implemente o que hayan sido verificadas en ejecución.

> **OPEN-005:** se conservan las restricciones de contenido de imágenes y el rechazo íntegro por operación, especificados en los requisitos funcionales y trazados en [`traceability.md`](traceability.md). El flujo está decidido: carga previa mediante `POST /api/v1/media/images`, con identificador generado por el servidor y devuelto como `data.id`, seguida de asociación mediante `imageId` en solicitudes JSON de entradas y ofertas. El [contrato de API existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) define operaciones administrativas; su alineación restante y las operaciones y representaciones faltantes siguen pendientes en OPEN-010 después de revisar los mockups. El transporte de imágenes ya está resuelto. Permanecen pendientes OPEN-001, OPEN-003, OPEN-006, OPEN-009 y OPEN-010.

## Ruta de lectura recomendada

1. [`configuration.md`](configuration.md) para consultar la versión y las reglas documentales de autoridad.
2. [`../other/md/domain-model.md`](../other/md/domain-model.md) para consultar el modelo conceptual vigente y sus relaciones.
3. [`context.md`](context.md) para entender el alcance de Menú/Catálogo, su lenguaje y sus límites con Inventario y Órdenes.
4. [`architechture.md`](architechture.md) para consultar la vista conceptual del catálogo para Front y la vista técnica del diagrama de clases para Back.
5. [`functional-requirements.md`](functional-requirements.md) para consultar los 25 requisitos funcionales verificables.
6. [`non-functional-requirements.md`](non-functional-requirements.md) para consultar los criterios de rendimiento y operación.
7. [`business-rules.md`](business-rules.md) para consultar las 22 reglas de negocio y 8 invariantes del dominio.
8. [`open.md`](open.md) para identificar las 5 decisiones de requisitos aún pendientes, incluida OPEN-010.
9. [`traceability.md`](traceability.md) para consultar las relaciones entre requisitos, reglas, invariantes y criterios no funcionales.

## Mapa de documentos

| Documento | Contenido | Uso principal |
| :--- | :--- | :--- |
| [`configuration.md`](configuration.md) | Identificación, versión, autoridad de fuentes y alcance documental. | Resolver la versión y las reglas de prevalencia documentales. |
| [`../other/md/domain-model.md`](../other/md/domain-model.md) | Modelo conceptual de Menú/Catálogo, composición por slots y opciones, fuentes de contenido, recetas y límites de dominio. | Interpretar las entidades y relaciones vigentes. |
| [`context.md`](context.md) | Responsabilidad de Menú/Catálogo, ownership, límites entre contextos y glosario. | Entender qué datos y decisiones pertenecen a cada contexto. |
| [`architechture.md`](architechture.md) | Vista conceptual del catálogo para Front y vista técnica del diagrama de clases para Back, además de límites arquitectónicos. | Entender el modelo del catálogo desde la perspectiva de Front o consultar sus clases de dominio desde la perspectiva de Back. |
| [`functional-requirements.md`](functional-requirements.md) | 25 requisitos `REQ-MENU-*` para categorías, entradas, ofertas, composiciones de slots y opciones, y recetas. | Implementar o revisar las capacidades funcionales solicitadas. |
| [`non-functional-requirements.md`](non-functional-requirements.md) | Criterios `NFR-MENU-*` de carga, latencia y comportamiento operativo. | Evaluar los objetivos de calidad definidos para el servicio y sus flujos completos. |
| [`business-rules.md`](business-rules.md) | 22 reglas `BR-MENU-*` y 8 invariantes `INV-MENU-*`. | Validar las restricciones comerciales y la integridad del modelo. |
| [`open.md`](open.md) | 5 cuestiones de requisitos que requieren una decisión explícita, incluida OPEN-010. | Evitar fijar valores o comportamientos que aún no están determinados. |
| [`traceability.md`](traceability.md) | Matrices de los requisitos, reglas, invariantes y criterios no funcionales. | Auditar cobertura e integridad de las referencias normativas. |

## Límites de responsabilidad destacados

- **Menú/Catálogo** define la identidad comercial de las entradas, sus ofertas vendibles, composiciones de slots y opciones, y precios declarados. Todos los slots `ACTIVE` participan y los `INACTIVE` no generan rondas; el estado del slot deriva de sus opciones. La oferta se inactiva si no queda ningún slot `ACTIVE` y se reactiva automáticamente cuando vuelve a haber uno, siempre que la inactivación haya sido automática por ausencia de slots activos y no haya una inactivación administrativa explícita. La entrada conserva su estado administrativo y no se publica si carece de oferta `ACTIVE` válida. Al configurar una composición desde otra oferta, incorpora una copia local editable que conserva los estados de opciones. RecipeLibrary almacena recetas con instrucciones textuales e ingredientes seleccionados de Inventario; sus opciones de slot fijan la receta por ID y revisión.
- **Inventario** es propietario de la identidad y las existencias de `InventoryItem`; Menú/Catálogo mantiene referencias a esos artículos.
- **Órdenes** registra la opción elegida en cada ronda y determina el precio final de acuerdo con las definiciones comerciales del catálogo.

## Convenciones de navegación

- `REQ-MENU-*`, `NFR-MENU-*`, `BR-MENU-*` e `INV-MENU-*` identifican contenido normativo y deben conservarse en sus referencias.
- `OPEN-*` identifica preguntas que requieren una decisión antes de fijar el comportamiento correspondiente.
- La matriz de [`traceability.md`](traceability.md) permite localizar las relaciones entre cada identificador normativo.
