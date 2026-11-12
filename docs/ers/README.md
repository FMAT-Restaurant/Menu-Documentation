# ERS del servicio Menu

Índice de los requisitos, reglas de dominio y criterios de calidad del servicio **Menu** para el catálogo de un restaurante. La autoridad normativa es esta ERS; el modelo conceptual de referencia, que aporta contexto y no es normativo, se describe en [`../other/md/domain-model.md`](../other/md/domain-model.md).

## Estado documental

| Campo | Valor |
| :--- | :--- |
| Servicio | Menu |
| Versión | 2.4.1 |
| Estado | Vigente / En revisión con cuestiones abiertas pendientes |
| Configuración de referencia | [`configuration.md`](configuration.md) |
| Alcance | Menu administra la identidad comercial del catálogo; cada `CatalogEntry` contiene ofertas y cada `CatalogOffer` concreta es vendible y seleccionable individualmente, con su composición. Una `Composition` contiene slots; todos los `CompositionSlot` son estructurales y `CompositionSlot.quantity` determina cuántas veces se eligen opciones de cada slot. Todos los slots son obligatorios y participan en la selección. Cada recurso separa su `status` administrativo, que solo cambia el administrador, de su disponibilidad `isAvailable`, que es derivada: la `SlotOption` según los eventos de Inventario, el `CompositionSlot` si tiene alguna opción `ACTIVE` disponible, la `CatalogOffer` si todos sus slots lo están y la `CatalogEntry` si tiene alguna oferta `ACTIVE` disponible. Lo `ACTIVE` se muestra y lo no disponible aparece deshabilitado y no se puede ordenar; ningún `status` cambia automáticamente. Menu e Inventario intercambian de forma asíncrona eventos de receta y de disponibilidad. Al configurar una composición desde otra oferta del catálogo, sus slots y opciones se copian como definiciones locales editables, conservando el `status` de las opciones, sin vínculo, precio ni sincronización con la oferta de origen. RecipeLibrary administra recetas con datos textuales e ingredientes de Inventario, cantidad por ingrediente y unidad visible; las recetas inician en la revisión 1, que aumenta en 1 con cada edición; las opciones de slot se asignan solo por ID y usan siempre la revisión vigente de la receta, y las revisiones anteriores quedan como historial consultable. Órdenes registra la opción elegida en cada ronda y determina el precio final. |

La especificación establece capacidades observables, restricciones del dominio, criterios no funcionales y preguntas pendientes. No afirma que el software ya las implemente o que hayan sido verificadas en ejecución.

> **OPEN-005:** se conservan las restricciones de contenido de imágenes y el rechazo íntegro por operación, especificados en los requisitos funcionales y trazados en [`traceability.md`](traceability.md). El flujo está decidido: carga previa del archivo, validada e independiente, en la que el sistema asigna el identificador de la imagen, seguida de la asociación de la entrada u oferta mediante ese identificador (`imageId`). El [contrato de API existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) define operaciones administrativas; su alineación restante y las operaciones y representaciones faltantes siguen pendientes en OPEN-010 después de revisar los mockups. Permanecen pendientes OPEN-001, OPEN-003, OPEN-006, OPEN-009, OPEN-010, OPEN-011 y OPEN-012.

## Ruta de lectura recomendada

1. [`configuration.md`](configuration.md) para consultar la versión y las reglas documentales de autoridad.
2. [`../other/md/domain-model.md`](../other/md/domain-model.md) para consultar el modelo conceptual de referencia y sus relaciones, como contexto no normativo; prevalece la ERS.
3. [`context.md`](context.md) para entender el alcance de Menú/Catálogo, su lenguaje y sus límites con Inventario y Órdenes.
4. [`architechture.md`](architechture.md) para consultar la vista conceptual del catálogo para Front y la vista técnica del diagrama de clases para Back.
5. [`functional-requirements.md`](functional-requirements.md) para consultar los 28 requisitos funcionales verificables.
6. [`non-functional-requirements.md`](non-functional-requirements.md) para consultar los criterios de rendimiento y operación.
7. [`business-rules.md`](business-rules.md) para consultar las 24 reglas de negocio y 8 invariantes del dominio.
8. [`open.md`](open.md) para identificar las 7 decisiones de requisitos aún pendientes, incluidas OPEN-010 y OPEN-011.
9. [`traceability.md`](traceability.md) para consultar las relaciones entre requisitos, reglas, invariantes y criterios no funcionales.

## Mapa de documentos

| Documento | Contenido | Uso principal |
| :--- | :--- | :--- |
| [`configuration.md`](configuration.md) | Identificación, versión, autoridad de fuentes y alcance documental. | Resolver la versión y las reglas de prevalencia documentales. |
| [`../other/md/domain-model.md`](../other/md/domain-model.md) | Modelo conceptual de referencia de Menú/Catálogo, composición por slots y opciones, fuentes de contenido, recetas y límites de dominio. | Consultar el contexto conceptual de entidades y relaciones; no es normativo. |
| [`context.md`](context.md) | Responsabilidad de Menú/Catálogo, ownership, límites entre contextos y glosario. | Entender qué datos y decisiones pertenecen a cada contexto. |
| [`architechture.md`](architechture.md) | Vista conceptual del catálogo para Front y vista técnica del diagrama de clases para Back, además de límites arquitectónicos. | Entender el modelo del catálogo desde la perspectiva de Front o consultar sus clases de dominio desde la perspectiva de Back. |
| [`functional-requirements.md`](functional-requirements.md) | 28 requisitos `REQ-MENU-*` para categorías, entradas, ofertas, composiciones de slots y opciones, recetas e integración con Inventario. | Implementar o revisar las capacidades funcionales solicitadas. |
| [`non-functional-requirements.md`](non-functional-requirements.md) | Criterios `NFR-MENU-*` de carga, latencia y comportamiento operativo. | Evaluar los objetivos de calidad definidos para el servicio y sus flujos completos. |
| [`business-rules.md`](business-rules.md) | 24 reglas `BR-MENU-*` y 8 invariantes `INV-MENU-*`. | Validar las restricciones comerciales y la integridad del modelo. |
| [`open.md`](open.md) | 7 cuestiones de requisitos que requieren una decisión explícita, incluidas OPEN-010 y OPEN-011. | Evitar fijar valores o comportamientos que aún no están determinados. |
| [`traceability.md`](traceability.md) | Matrices de los requisitos, reglas, invariantes y criterios no funcionales. | Auditar cobertura e integridad de las referencias normativas. |

## Límites de responsabilidad destacados

- **Menú/Catálogo** define la identidad comercial de las entradas, sus ofertas vendibles, composiciones de slots y opciones, y precios declarados. Cada slot es obligatorio y basta uno sin disponibilidad para que la oferta no pueda ordenarse. El administrador decide el `status` de entradas, ofertas y opciones, que nunca cambia por sí solo, mientras `isAvailable` se recalcula y se recupera sin intervención. Quien no administra el catálogo ve lo `ACTIVE`, con lo no disponible deshabilitado, y el administrador ve todo (BR-MENU-032, BR-MENU-033). Al configurar una composición desde otra oferta, incorpora una copia local editable que conserva el `status` de las opciones. RecipeLibrary almacena recetas con instrucciones textuales e ingredientes seleccionados de Inventario; las recetas inician en la revisión 1, que aumenta en 1 con cada edición; las opciones de slot se seleccionan solo por ID y usan de inmediato cada revisión nueva, y las revisiones anteriores se conservan como historial.
- **Inventario** es propietario de la identidad y las existencias de `InventoryItem`; Menú/Catálogo mantiene referencias a esos artículos. Inventario además mantiene una copia local de las recetas recibida por eventos de Menu, comprueba la factibilidad de las recetas y la disponibilidad de los artículos, y lo comunica a Menu por eventos, cuyo contrato queda pendiente en OPEN-011.
- **Órdenes** registra la opción elegida en cada ronda y determina el precio final de acuerdo con las definiciones comerciales del catálogo.

## Convenciones de navegación

- `REQ-MENU-*`, `NFR-MENU-*`, `BR-MENU-*` e `INV-MENU-*` identifican contenido normativo y deben conservarse en sus referencias.
- `OPEN-*` identifica preguntas que requieren una decisión antes de fijar el comportamiento correspondiente.
- La matriz de [`traceability.md`](traceability.md) permite localizar las relaciones entre cada identificador normativo.
