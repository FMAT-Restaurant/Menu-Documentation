# Reporte de Eventos, Operaciones y Semánticas Compartidas del Servicio Menu

**Fuente principal:** [`output/ers/spec.md`](../../output/ers/spec.md)  
**Versión de la fuente:** 1.3.5  
**Alcance:** eventos consumidos y emitidos por Menu, clasificación síncrona/asíncrona y modelos o semánticas compartidas con otros servicios.

> Este reporte es una lectura documental de `spec.md`. No constituye un contrato técnico adicional ni cierra las cuestiones abiertas de `OPEN-007`.

## 1. Criterios de interpretación

Se aplican las siguientes reglas:

- **Explícito:** la información aparece como obligación, atributo, estructura, origen, consumidor o semántica en `spec.md`.
- **Ejemplo ilustrativo:** el documento menciona un nombre concreto con carácter no normativo, como `CatalogItemPublished` o `RecipeChanged`.
- **[Propuesta]:** el documento no define el dato, el envelope, el transporte o la relación exacta. La marca no representa una decisión aprobada.

Los atributos de un modelo de lectura no se convierten automáticamente en atributos del payload de un evento. Cuando `spec.md` define la proyección pero no el evento que la alimenta, el reporte separa ambos niveles.

## 2. Resumen ejecutivo

- Menu consume tres familias conceptuales procedentes de **Orders + Kitchen**: disponibilidad operacional, readiness de preparación y alteraciones culinarias o de recetas.
- Menu no consume directamente los eventos físicos de **Inventory**. Los movimientos, reservas y deducciones de inventario pertenecen a la integración interna entre Orders + Kitchen e Inventory.
- Menu emite cinco familias conceptuales: publicación o cambios estructurales de catálogo, retiro o archivado, cambios de precios y deltas, confirmación de revisión y actualización estructural de combos.
- La integración entre bounded contexts se define como asíncrona y desacoplada. Las consultas públicas utilizan almacenamiento y modelos de lectura locales de Menu, pero el transporte técnico exacto de cada operación no está cerrado.
- Lo que se comparte son proyecciones, snapshots, precios, revisiones e identificadores opacos; no se comparten recetas, existencias, tablas ni estructuras internas.

## 3. Eventos que debe consumir Menu

La fuente establece que estas notificaciones son emitidas por Orders + Kitchen y proyectadas en Menu mediante cachés locales. Véanse [§7.4](../../output/ers/spec.md#sec-7-4), [§9.2](../../output/ers/spec.md#sec-9-2) y [§11.2](../../output/ers/spec.md#sec-11-2).

| Familia consumida | Emisor | Semántica que activa en Menu | Datos explícitos asociados | Datos del evento aún no definidos |
| --- | --- | --- | --- | --- |
| Disponibilidad operativa en vivo | **Orders + Kitchen**. | Actualiza la disponibilidad operacional de variantes y modificadores sin incrementar `commercialRevision` ni activar `REVIEW_REQUIRED`. | Para `VariantAvailability`: `variantId`, `available`, `lastUpdatedAt`. Para `ModifierAvailability`: `variantId`, `modifierOptionId`, `available`, `availableMaxQuantity`, `lastUpdatedAt`. | **[Propuesta]** Envelope, nombre normativo del evento, versión de esquema, ordenamiento, reintentos y mapeo exacto entre cada evento y la proyección. |
| Estado de preparación y readiness culinario | **Orders + Kitchen**. | Actualiza `PreparationStatus`; en variantes `PREPARED`, `INCOMPLETE` impide la disponibilidad operacional para venta. | `variantId`, `status` con valores `READY` o `INCOMPLETE`, `lastUpdatedAt`. | **[Propuesta]** Envelope, versión del evento y representación técnica de la transición de estado. |
| Alteraciones culinarias y recetas | **Orders + Kitchen**. | Incrementa `observedRevision` en la variante vinculada y activa `REVIEW_REQUIRED` cuando corresponde. | La semántica de `PendingReviewCause` define `reviewKind`, `changeId`, `motive`, `sourceVariantId` y `observedRevision`; los motivos permitidos son `PRICE`, `COMPOSITION`, `MODIFIERS` y `STATUS`. | **[Propuesta]** Identificador del target que Menu debe actualizar cuando no pueda derivarse de `sourceVariantId`, además del payload completo y sus metadatos técnicos. |

### 3.1 Eventos que Menu no debe consumir directamente

Menu no suscribe, procesa ni almacena eventos de bajo nivel de Inventory, incluyendo como ejemplos ilustrativos `PhysicalStockDepleted`, `PhysicalStockReplenished`, `InventoryReserved` e `InventoryDeducted`. Orders + Kitchen interpreta las recetas y media la relación con Inventory; Menu recibe únicamente las proyecciones de disponibilidad y readiness.

Esta frontera está descrita en [§11.3](../../output/ers/spec.md#sec-11-3), [§12.2](../../output/ers/spec.md#sec-12-2) y [§13.2](../../output/ers/spec.md#sec-13-2).

## 4. Eventos que debe emitir Menu

Las siguientes familias se describen en [§11.1](../../output/ers/spec.md#sec-11-1). Los nombres concretos que aparecen como `e.g.` son ejemplos ilustrativos no normativos.

| Familia emitida | Consumidores explícitos | Datos explícitos descritos en `spec.md` | Datos no definidos |
| --- | --- | --- | --- |
| Catálogo publicado y cambios estructurales | Canales de venta y consumidores periféricos. El diagrama de integración también muestra el canal hacia Orders + Kitchen. | Identificador del ítem o variante, SKU comercial, precio unitario absoluto, revisión comercial y marca temporal. | **[Propuesta]** Tipo normativo del evento, envelope, consumidor exacto por evento, versión de esquema y política de entrega. |
| Retiro y archivado comercial no destructivo | Se indica propagación hacia configuraciones dependientes, pero no se fija una lista cerrada de consumidores. | Tipo de entidad, identificador lógico, motivo y marca temporal de retiro. | **[Propuesta]** Consumidor exacto, estado de entrega, versión de evento y forma de representar la dependencia afectada. |
| Variación de precios y deltas | Terminales de venta y auditoría fiscal. | Identificador de la entidad, precio previo, nuevo precio unitario, revisión comercial resultante y fecha efectiva. | **[Propuesta]** Nombre normativo, consumidor adicional, envelope y reglas técnicas de deduplicación u ordenamiento. |
| Confirmación formal de revisión | No se identifica un consumidor técnico cerrado; la familia notifica la aceptación de una versión observada. | Identificador de la entidad comercial, revisión reconocida formalmente, responsable administrativo y marca temporal. | **[Propuesta]** Consumidor exacto, envelope, versión del evento y relación técnica con `changeId` o `reviewToken`. |
| Actualización estructural de combos | No se identifica una lista cerrada; el propósito es notificar cambios de composición a consumidores del catálogo. | Identificador de configuración de combo, revisión comercial y resumen de cambios estructurales. | **[Propuesta]** Detalle estructurado del cambio, consumidor exacto, envelope y versionado del evento. |

### 4.1 Ejemplos de nombres no normativos

El documento menciona los siguientes nombres como ejemplos ilustrativos:

- `CatalogItemPublished`.
- `MenuItemArchived`.
- `MenuItemPriceChanged`.
- `MenuItemRevisionConfirmed`.
- `ComboConfigurationUpdated`.

Estos nombres sirven para identificar la intención de cada familia, pero no constituyen por sí mismos un catálogo de eventos aprobado.

## 5. Operaciones síncronas y asíncronas

`spec.md` distingue la consulta local de catálogo de la integración asíncrona entre bounded contexts, pero deja abierta la infraestructura de transporte. Por ello se separa la modalidad lógica de la modalidad técnica.

| Operación o interacción | Clasificación documental | Evidencia y límite |
| --- | --- | --- |
| Consulta pública del catálogo desde POS, menú digital o cliente | **Consulta directa; síncrona a nivel lógico, transporte no fijado.** | Menu atiende la consulta desde su almacenamiento y modelos de lectura locales y responde con proyecciones. El documento no prescribe HTTP, RPC ni otro protocolo. |
| Consulta del detalle comercial de un ítem | **Consulta directa; síncrona a nivel lógico, transporte no fijado.** | Es una capacidad de lectura de Menu que devuelve variantes, precios, modificadores resueltos y estados proyectados. |
| Consulta y evaluación de combos | **Consulta local de Menu; transporte no fijado.** | `ComboConfigurationAvailability` se calcula a partir de proyecciones locales. No requiere una llamada bloqueante a Inventory o a Cocina durante la consulta pública. |
| Operaciones administrativas de ítems, variantes, modificadores y combos | **Modo de transporte no determinado.** | El lado de comando pertenece a `MenuItem` y `ComboConfiguration`, pero `spec.md` no define si la interfaz externa es síncrona o asíncrona. **[Propuesta]** elegir y documentar el patrón de interacción cuando se cierre `OPEN-007`. |
| Confirmación formal de revisión | **Modo de transporte no determinado.** | La confirmación requiere una acción administrativa explícita, pero el transporte técnico no está definido. |
| Recepción de disponibilidad operacional | **Asíncrona explícita.** | Orders + Kitchen notifica cambios; Menu actualiza sus cachés locales sin mutar la revisión comercial. |
| Recepción de readiness de preparación | **Asíncrona explícita.** | Orders + Kitchen notifica `READY` o `INCOMPLETE`; Menu proyecta el estado de forma independiente. |
| Recepción de alteraciones culinarias | **Asíncrona explícita.** | Orders + Kitchen notifica cambios de receta o directivas físicas; Menu registra la revisión observada y las causas correspondientes. |
| Publicación de cambios comerciales de Menu | **Asíncrona explícita entre bounded contexts.** | Menu publica familias de cambios mediante un canal de integración asíncrono. Middleware, tópicos, envelopes y versionado permanecen abiertos. |
| Creación de comanda | **No es una operación propia de Menu.** | POS o el canal de venta interactúa directamente con Orders + Kitchen, que posee `OrderLine` y los snapshots de órdenes. El protocolo de esa interacción tampoco está cerrado. |

### 5.1 Regla de clasificación

No se debe interpretar “consulta” como un contrato HTTP ni “evento” como un contrato completo de mensajería. La fuente confirma la separación lógica entre comandos, consultas y eventos, pero deja bajo `OPEN-007`:

- middleware de transporte;
- nombres y versionado de tópicos o canales;
- envelope formal;
- estrategia técnica de invalidación hacia POS;
- topología física de persistencia.

## 6. Modelos y semánticas compartidas

El intercambio se realiza mediante ownership exclusivo, identificadores lógicos opacos, proyecciones, snapshots y cachés. La fuente prohíbe el acceso directo a estructuras internas de otro bounded context. Véanse [§3.2](../../output/ers/spec.md#sec-3-2), [§8.3](../../output/ers/spec.md#sec-8-3) y [§12](../../output/ers/spec.md#sec-12).

| Modelo o semántica | Propietario | Consumidores o relacionados | Por qué se comparte | Representación permitida |
| --- | --- | --- | --- | --- |
| `CatalogItemProjection` | Menu | POS, clientes, menú digital y quioscos | Presentar los artículos elegibles y disponibles con precio y estado comercial. | Proyección pública de lectura. |
| `ResolvedVariantModifier` | Menu | POS, clientes y Orders + Kitchen cuando necesita la configuración comercial del modificador | Exponer la configuración comercial efectiva por variante sin mezclar disponibilidad ni efectos físicos de cocina. | DTO o proyección comercial. |
| `VariantAvailability` | Orders + Kitchen como autoridad operacional; Menu mantiene la proyección local | Menu y, de forma indirecta, POS mediante `CatalogItemProjection` | Informar si una variante puede atenderse operacionalmente en el momento. | Read model o caché local en Menu. |
| `PreparationStatus` | Orders + Kitchen como autoridad de readiness | Menu y consumidores de catálogo | Separar la completitud culinaria (`READY` / `INCOMPLETE`) de la elegibilidad comercial y de la revisión administrativa. | Read model o caché local en Menu. |
| `ModifierAvailability` | Orders + Kitchen como autoridad operacional | Menu y consumidores del catálogo | Proyectar disponibilidad y capacidad máxima por par `(variantId, modifierOptionId)`. | Read model o caché local en Menu. |
| Precio unitario, deltas y `commercialRevision` | Menu | POS, Orders + Kitchen, Facturación y auditoría de ventas, según el dato consumido | Mantener la semántica comercial y permitir que Orders + Kitchen registre snapshots reproducibles. | Proyección comercial y snapshot de orden. |
| `variantId`, `modifierOptionId` e identificadores externos | Cada bounded context conserva la autoridad de sus propios IDs | Menu, Orders + Kitchen, POS y relaciones lógicas con Inventory | Vincular conceptos entre contextos sin exponer entidades, tablas o claves internas. | Identificadores escalares opacos. |
| Snapshot de `OrderLine` | Orders + Kitchen | Facturación y auditoría de ventas | Conservar la selección concreta, precio y revisión observada sin depender de una lectura posterior de Menu. | Snapshot inmutable propiedad de Orders + Kitchen. |
| `ComboConfigurationAvailability` | Menu, calculada a partir de proyecciones operacionales | POS, clientes y consultas del catálogo | Determinar la disponibilidad agregada de un combo por la capacidad de sus slots. | Proyección dinámica de lectura; no es una fuente externa. |

### 6.1 Semánticas que no se comparten directamente

No forman parte del modelo compartido de Menu:

- recetas y revisiones técnicas de recetas;
- gramajes e instrucciones físicas de preparación;
- efectos físicos `ADD` / `OMIT` de modificadores;
- existencias, reservas y movimientos de Inventory;
- estructuras internas de persistencia o tablas de otro servicio;
- contratos directos Menu → Inventory.

Orders + Kitchen interpreta la receta y traduce la necesidad física hacia Inventory. Menu solo recibe la consecuencia operacional proyectada.

## 7. Datos que quedan como propuesta técnica

`spec.md` mantiene abiertos los siguientes elementos bajo `OPEN-007`. Se listan como propuestas de definición, no como requisitos aprobados:

- **[Propuesta] Envelope de evento:** identificador del evento, tipo normativo, versión de esquema, marca temporal de ocurrencia y datos de trazabilidad.
- **[Propuesta] Mapeo de payload:** relación formal entre cada familia de evento y los campos de `VariantAvailability`, `PreparationStatus`, `ModifierAvailability` o `PendingReviewCause`.
- **[Propuesta] Transporte:** broker, protocolo, tópicos o canales.
- **[Propuesta] Evolución:** estrategia de versionado y compatibilidad de esquemas.
- **[Propuesta] Entrega:** ordenamiento, reintentos, deduplicación y manejo de eventos atrasados.
- **[Propuesta] Invalidación de POS:** WebSockets, Server-Sent Events, sondeo condicional u otra alternativa; la fuente solo enumera alternativas abiertas.
- **[Propuesta] Consumidores exactos:** asignación de cada familia emitida a POS, clientes, Orders + Kitchen, auditoría u otros consumidores concretos cuando la fuente no lo especifica.

## 8. Trazabilidad resumida

| Tema del reporte | Sección de `spec.md` |
| --- | --- |
| Ownership y límites entre Menu, Orders + Kitchen e Inventory | [§3.2](../../output/ers/spec.md#sec-3-2), [§8.3](../../output/ers/spec.md#sec-8-3) |
| Comunicación asíncrona y modelos locales de lectura | [§8.2](../../output/ers/spec.md#sec-8-2) |
| Modelos `VariantAvailability`, `PreparationStatus`, `ModifierAvailability` y `CatalogItemProjection` | [§7.4](../../output/ers/spec.md#sec-7-4), [§9.2](../../output/ers/spec.md#sec-9-2) |
| Familias emitidas por Menu | [§11.1](../../output/ers/spec.md#sec-11-1) |
| Familias consumidas por Menu | [§11.2](../../output/ers/spec.md#sec-11-2) |
| Exclusión de eventos físicos de Inventory | [§11.3](../../output/ers/spec.md#sec-11-3) |
| Datos, ownership y snapshots compartidos | [§12.1](../../output/ers/spec.md#sec-12-1), [§12.2](../../output/ers/spec.md#sec-12-2), [§12.3](../../output/ers/spec.md#sec-12-3) |
| Middleware, envelopes, tópicos e invalidación pendientes | [§13.2](../../output/ers/spec.md#sec-13-2) |

## 9. Conclusión

El contrato documental vigente define con claridad las fronteras semánticas: Orders + Kitchen origina las señales operacionales y culinarias que Menu proyecta; Menu publica cambios comerciales para los consumidores del catálogo; Inventory permanece detrás de Orders + Kitchen. La especificación todavía no define el contrato técnico completo de mensajería. Por ello, los campos de los modelos de lectura y los atributos conceptuales de cada familia se reportan como explícitos, mientras que envelope, transporte, versionado y políticas de entrega quedan marcados como **[Propuesta]**.
