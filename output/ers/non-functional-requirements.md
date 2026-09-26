# Requisitos No Funcionales

Los requisitos no funcionales documentados en esta sección reproducen los compromisos técnicos, perfiles operativos y presupuestos de rendimiento justificados en las fuentes autorizadas (`Consultoria-1.md`, `Consultoria-2.md` y `Decisiones-cierre-invariantes.md` — ADR-004). Constituyen **objetivos formales de aceptación de ingeniería**, no mediciones empíricas de software ya ejecutadas.

## Presupuesto de Rendimiento de Aceptación (ADR-004)

- **Identificador:** `NFR-MENU-PERF-01`
- **Declaración:** Los flujos de punto de venta que consumen el catálogo de Menu y gestionan órdenes en Orders + Kitchen deberán satisfacer el presupuesto de rendimiento bajo las condiciones operativas nominales y de ráfaga establecidas para cada sucursal de restaurante. Los objetivos se evalúan de extremo a extremo y no constituyen tiempos objetivo de endpoints individuales de Menu.
- **Fuente:** `Decisiones-cierre-invariantes.md` (ADR-004); `Consultoria-1.md`.
- **Criterio:** Validación mediante pruebas de carga automatizadas con datasets representativos del restaurante.

## Perfil Nominal de Operación

- **Identificador:** `NFR-MENU-PERF-02`
- **Condiciones de Carga Nominal por Restaurante:**
  - **Concurrencia:** Hasta **40 clientes POS/KDS concurrentes** activos simultáneamente por sucursal.
  - **Tasa de Solicitudes:** **30 solicitudes por segundo (req/s) sostenidas** durante un periodo continuo de **30 minutos**.
  - **Mezcla de Carga Reproducible:**
    - 30% Búsqueda, filtrado o cambio de categoría del menú (responsabilidad de Menu).
    - 20% Consulta de disponibilidad proyectada en el catálogo (Menu sirve la proyección basada en disponibilidad y readiness operacionales originados por Orders + Kitchen; Menu no calcula existencias ni preparación).
    - 20% Validación de selección comercial y resolución del importe aplicable al aceptar la orden (responsabilidad de Orders + Kitchen, aplicando las reglas comerciales definidas por Menu).
    - 20% Edición de selecciones de comanda (responsabilidad de Orders + Kitchen).
    - 10% Envío de comanda a cocina y aceptación de la orden (responsabilidad de Orders + Kitchen).
  - **Tasa de Error Interno:** Inferior al **0.1% (<0.1%)** de las solicitudes ofrecidas bajo carga nominal. Las solicitudes de selección deliberadamente inválida se prueban por separado y no se incluyen en el denominador de errores internos.
  - **Integridad:** Cero (**0**) órdenes aceptadas perdidas, duplicadas o corrompidas; la aceptación y persistencia de la orden son responsabilidad de Orders + Kitchen.

El perfil describe de extremo a extremo los flujos POS que abarcan el catálogo administrado por Menu y la gestión de órdenes de Orders + Kitchen. Menu es responsable de definir y validar administrativamente la configuración comercial, mantener los precios y sus reglas, y servir en el catálogo la proyección de disponibilidad basada en la disponibilidad y readiness operacionales originados por Orders + Kitchen. Menu no calcula existencias ni preparación. Orders + Kitchen es responsable de originar esas señales operacionales, validar la selección elegida al aceptar una orden, resolver el importe aplicable, editar y conservar la selección de la comanda, aceptar la orden y hacerla visible en cocina. El POS puede dar retroalimentación inmediata mientras el usuario selecciona opciones; esa retroalimentación no constituye la aceptación autoritativa de la orden. Estas responsabilidades no asignan a Menu la selección hecha por el cliente ni a Orders + Kitchen la propiedad de las reglas comerciales.

Para las variantes hoja PREPARED y STOCKED, `MenuItemVariant.unitPrice` es un precio absoluto asignado directamente: no se calcula a partir de Preparación, ingredientes ni existencias. La configuración de modificadores aporta los `priceDelta` comerciales efectivos. La regla exacta para agregar los deltas de modificadores seleccionados al precio de una variante hoja permanece abierta en OPEN-010. Para un combo, el importe final sigue BR-MENU-008: el precio absoluto de `ComboConfiguration` más los `priceDelta` de las opciones seleccionadas y los modificadores seleccionados en sus componentes; no se suman los precios regulares `MenuItemVariant.unitPrice` de esos componentes.

## Objetivos de Latencia por Clase de Operación

Las duraciones son objetivos de extremo a extremo: se miden desde la acción física en el cliente POS hasta el resultado observable en pantalla, incluyendo red local y procesamiento. No representan latencias de endpoints individuales de Menu. La responsabilidad indicada es la de la clase de operación; las mediciones incluyen el flujo POS completo cuando participan ambos servicios:

| Clase de Operación                                                                        | Responsabilidad principal | Objetivo Percentil 95 (p95) | Objetivo Percentil 99 (p99) | Límite Crítico Inaceptable |
| :---------------------------------------------------------------------------------------- | :-----------------------: | :-------------------------: | :-------------------------: | :------------------------: |
| **Feedback táctil UI** (toque de selección, modificador; retroalimentación no autoritativa) |            POS            |        **≤ 100 ms**         |              -              |          > 200 ms          |
| **Búsqueda / Filtro / Categoría de Menú**                                                  |           Menu            |        **≤ 200 ms**         |         **≤ 1.0 s**         |          > 500 ms          |
| **Consulta de Disponibilidad Proyectada**                                                  | Menu sirve; Orders + Kitchen origina señales |        **≤ 300 ms**         |         **≤ 1.0 s**         |          > 750 ms          |
| **Validación de Selección Comercial y Resolución del Importe Aplicable**                   |     Orders + Kitchen      |        **≤ 300 ms**         |         **≤ 1.0 s**         |          > 500 ms          |
| **Edición de Selección en Comanda**                                                        |     Orders + Kitchen      |        **≤ 300 ms**         |         **≤ 1.0 s**         |          > 750 ms          |
| **Envío de comanda y aceptación (`Enviar a cocina` → ACK Orders)**                        |     Orders + Kitchen      |        **≤ 500 ms**         |         **≤ 1.0 s**         |          > 2.0 s           |
| **Visibilidad de la orden en KDS desde su envío**                                         |     Orders + Kitchen      |        **≤ 1.0 s**          |         **≤ 2.0 s**         |              -             |

## Capacidad ante Ráfagas (Burst)

- **Identificador:** `NFR-MENU-PERF-03`
- **Condición de Ráfaga Intensa:** Tasa de **100 solicitudes por segundo (req/s)** durante una ventana de **60 segundos**, con los mismos clientes y mezcla de carga del perfil nominal, aplicada inmediatamente después de esa prueba. La evaluación es de extremo a extremo sobre los flujos POS que abarcan Menu y Orders + Kitchen.
- **Criterios de Aceptación:**
  1. **Disponibilidad:** Los servicios que participan en el flujo evaluado no deberán colapsar ni reiniciar procesos durante la ráfaga.
  2. **Integridad:** Cero (**0**) órdenes aceptadas perdidas, duplicadas o corrompidas. Orders + Kitchen es responsable de la aceptación y persistencia de las órdenes.
  3. Cada solicitud fallida o pendiente se contabiliza. Al terminar la ráfaga, toda orden aceptada deberá tener su resultado persistido y reintentar solicitudes pendientes no deberá duplicar efectos.
  4. No se exige mantener los percentiles de latencia nominales durante la ventana de ráfaga y no existe un plazo de recuperación preestablecido.

## Concurrencia e Integridad Transaccional

- **Identificador:** `NFR-MENU-CONS-01`
- **Delimitación de Outbox e Integración:** Conforme a lo documentado en ADR-003, el patrón Transactional Outbox y las garantías de entrega física asociadas constituyen una responsabilidad externa asignada exclusivamente al servicio Orders para la emisión confiable de movimientos hacia Inventory, y **no representan una obligación impuesta al servicio Menu**. Menu emite sus notificaciones conceptuales de cambio de catálogo de forma asíncrona sin asumir transactional outbox local.
- **Confiabilidad de consumidores y confirmaciones:** Los consumidores de los mensajes operacionales definidos en `domain-events.md` deberán procesar los mensajes de forma idempotente. Las reservas y sus ajustes deberán resolverse mediante respuestas explícitas de confirmación, rechazo o ajuste; la ausencia de un mensaje no deberá interpretarse como éxito. La consistencia entre servicios es eventual. `domain-events.md` recomienda Transactional Outbox para publicación y Inbox o un almacén de mensajes procesados para deduplicación; la implementación concreta y su ownership técnico permanecen abiertos en `OPEN-007`.
- **Separación del catálogo Menu:** Menu puede emitir notificaciones conceptuales de cambio de catálogo de forma asíncrona, pero ese plano de integración es independiente del flujo operacional de `domain-events.md`. Los nombres, transporte, envelope, versionado, invalidación y garantías de entrega de dichas notificaciones permanecen sujetos a `OPEN-007`; este requisito no impone un Transactional Outbox local a Menu.

## Resiliencia y Desacoplamiento de Disponibilidad Operacional

- **Identificador:** `NFR-MENU-RESI-01`
- **Inalterabilidad de Definiciones Comerciales:** La desconexión temporal de red o la demora en la recepción de señales o mensajes del contrato de proyecciones de catálogo desde Orders + Kitchen no afectará la navegación del catálogo comercial, ni modificará precios, configuraciones, estados administrativos ni la elegibilidad estructural persistida en Menu.
