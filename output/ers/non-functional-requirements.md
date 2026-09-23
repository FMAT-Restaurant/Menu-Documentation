# Requisitos No Funcionales

Los requisitos no funcionales documentados en esta sección reproducen los compromisos técnicos, perfiles operativos y presupuestos de rendimiento justificados en las fuentes autorizadas (`Consultoria-1.md`, `Consultoria-2.md` y `Decisiones-cierre-invariantes.md` — ADR-004). Constituyen **objetivos formales de aceptación de ingeniería**, no mediciones empíricas de software ya ejecutadas.

## Presupuesto de Rendimiento de Aceptación (ADR-004)

- **Identificador:** `NFR-MENU-PERF-01`
- **Declaración:** El servicio Menu deberá dimensionarse y optimizarse para satisfacer el presupuesto de rendimiento bajo las condiciones operativas nominales y de ráfaga establecidas para los terminales de venta en cada sucursal de restaurante.
- **Fuente:** `Decisiones-cierre-invariantes.md` (ADR-004); `Consultoria-1.md`.
- **Criterio:** Validación mediante pruebas de carga automatizadas con datasets representativos del restaurante.

## Perfil Nominal de Operación

- **Identificador:** `NFR-MENU-PERF-02`
- **Condiciones de Carga Nominal por Restaurante:**
  - **Concurrencia:** Hasta **40 clientes POS concurrentes** activos simultáneamente por sucursal.
  - **Tasa de Solicitudes:** **30 solicitudes por segundo (req/s) sostenidas** durante un periodo continuo de **30 minutos**.
  - **Mezcla de Carga Reproducible:**
    - 30% Búsqueda, filtrado o cambio de categoría del menú.
    - 20% Consulta de disponibilidad proyectada.
    - 20% Recálculo de precio y validación de configuración comercial.
    - 20% Edición de selecciones de comanda.
    - 10% Envío de comanda a cocina.
  - **Tasa de Error Interno:** Inferior al **0.1% (<0.1%)** de las solicitudes bajo carga nominal.
  - **Integridad:** Cero (**0**) órdenes aceptadas perdidas, duplicadas o corrompidas.

## Objetivos de Latencia por Clase de Operación

Las duraciones se miden desde la acción física en el cliente POS hasta el resultado observable en pantalla, incluyendo red local:

| Clase de Operación                                                            | Objetivo Percentil 95 (p95) | Objetivo Percentil 99 (p99) | Límite Crítico Inaceptable |
| :---------------------------------------------------------------------------- | :-------------------------: | :-------------------------: | :------------------------: |
| **Feedback táctil UI** (toque de selección, modificador)                      |        **≤ 100 ms**         |              -              |          > 200 ms          |
| **Búsqueda / Filtro / Categoría de Menú**                                     |        **≤ 200 ms**         |         **≤ 1.0 s**         |          > 500 ms          |
| **Consulta de Disponibilidad Proyectada**                                     |        **≤ 300 ms**         |         **≤ 1.0 s**         |          > 750 ms          |
| **Validación de Configuración y Precio**                                      |        **≤ 300 ms**         |         **≤ 1.0 s**         |          > 500 ms          |
| **Edición de Selección en Comanda**                                           |        **≤ 300 ms**         |         **≤ 1.0 s**         |          > 750 ms          |
| **Solicitud de creación a Orders + Kitchen (`Enviar a cocina` → ACK Orders)** |        **≤ 500 ms**         |         **≤ 1.0 s**         |          > 2.0 s           |

## Capacidad ante Ráfagas (Burst)

- **Identificador:** `NFR-MENU-PERF-03`
- **Condición de Ráfaga Intensa:** Tasa de **100 solicitudes por segundo (req/s)** durante una ventana de **60 segundos**, aplicada inmediatamente después de la prueba de perfil nominal.
- **Criterios de Aceptación:**
  1. **Disponibilidad del Servicio:** El servicio no deberá colapsar ni reiniciar procesos durante la ráfaga.
  2. **Integridad:** Cero (**0**) solicitudes confirmadas perdidas o corrompidas.
  3. No se exige mantener los percentiles de latencia nominales durante la ventana de ráfaga, y no existe un plazo de recuperación preestablecido en las fuentes.

## Concurrencia e Integridad Transaccional

- **Identificador:** `NFR-MENU-CONS-01`
- **Delimitación de Outbox e Integración:** Conforme a lo documentado en ADR-003, el patrón Transactional Outbox y las garantías de entrega física asociadas constituyen una responsabilidad externa asignada exclusivamente al servicio Orders para la emisión confiable de movimientos hacia Inventory, y **no representan una obligación impuesta al servicio Menu**. Menu emite sus notificaciones conceptuales de cambio de catálogo de forma asíncrona sin asumir transactional outbox local.
- **Confiabilidad de consumidores y confirmaciones:** Los consumidores de los mensajes operacionales definidos en `domain-events.md` deberán procesar los mensajes de forma idempotente. Las reservas y sus ajustes deberán resolverse mediante respuestas explícitas de confirmación, rechazo o ajuste; la ausencia de un mensaje no deberá interpretarse como éxito. La consistencia entre servicios es eventual. `domain-events.md` recomienda Transactional Outbox para publicación y Inbox o un almacén de mensajes procesados para deduplicación; la implementación concreta y su ownership técnico permanecen abiertos en `OPEN-007`.
- **Separación del catálogo Menu:** Menu puede emitir notificaciones conceptuales de cambio de catálogo de forma asíncrona, pero ese plano de integración es independiente del flujo operacional de `domain-events.md`. Los nombres, transporte, envelope, versionado, invalidación y garantías de entrega de dichas notificaciones permanecen sujetos a `OPEN-007`; este requisito no impone un Transactional Outbox local a Menu.

## Resiliencia y Desacoplamiento de Disponibilidad Operacional

- **Identificador:** `NFR-MENU-RESI-01`
- **Inalterabilidad de Definiciones Comerciales:** La desconexión temporal de red o la demora en la recepción de señales o mensajes del contrato de proyecciones de catálogo desde Orders + Kitchen no afectará la navegación del catálogo comercial, ni modificará precios, configuraciones, estados administrativos ni la elegibilidad estructural persistida en Menu.
