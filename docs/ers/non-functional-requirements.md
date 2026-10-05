# Requisitos No Funcionales

Los siguientes objetivos son criterios formales de aceptación de ingeniería, no mediciones empíricas de software ya ejecutadas. Se sustentan en el perfil de rendimiento documentado en `Consultoria-1.md` y ADR-004 de `Decisiones-cierre-invariantes.md`. Las responsabilidades descritas siguen el modelo de dominio del catálogo.

## Presupuesto de Rendimiento de Aceptación (ADR-004)

- **Identificador:** `NFR-MENU-PERF-01`
- **Declaración:** La navegación del catálogo y la validación de selecciones permitidas por su composición deben satisfacer los perfiles nominal y de ráfaga que se indican en esta sección. La navegación se mide desde la acción en POS hasta el resultado visible. El objetivo para validar una selección al aceptar una orden es de extremo a extremo (E2E) e incluye el uso de la composición definida en Menu y el flujo de aceptación de la orden. Se evalúan todos los `CompositionSlot` `ACTIVE`; cada slot genera las rondas indicadas por `CompositionSlot.quantity`, con exactamente una `SlotOption` `ACTIVE` elegida por ronda. Los slots `INACTIVE` no generan rondas. La validación considera la elegibilidad vigente de la oferta: si pasó a `INACTIVE` automáticamente al quedar sin slots `ACTIVE`, se reactiva automáticamente cuando vuelve a tener al menos un slot `ACTIVE`, siempre que no haya sido inactivada explícitamente por administración. La selección no reactiva una oferta inactivada administrativamente. Estos objetivos no son latencias objetivo de endpoints individuales de Menu.
- **Fuente:** [Decisiones-cierre-invariantes.md](../other/md/Decisiones-cierre-invariantes.md) (ADR-004); [Consultoria-1.md](../other/md/Consultoria-1.md).
- **Criterio:** Evaluación mediante pruebas de carga automatizadas y datasets representativos del catálogo.

## Perfil Nominal de Operación

- **Identificador:** `NFR-MENU-PERF-02`
- **Condiciones de carga por sucursal:**
  - **Concurrencia:** Hasta **40 sesiones concurrentes**.
  - **Tasa de solicitudes:** **30 solicitudes por segundo (req/s)** sostenidas durante **30 minutos**.
  - **Clases de operación incluidas en la mezcla de carga:**
    - Búsqueda, filtrado o consulta por categoría del catálogo administrado por Menu.
    - Validación de que las selecciones de slots y opciones cumplen la composición del catálogo al aceptar la orden. Este criterio es **E2E**: participan todos los `CompositionSlot` `ACTIVE`; cada slot genera las rondas indicadas por `CompositionSlot.quantity`, con exactamente una `SlotOption` `ACTIVE` por ronda. Los slots `INACTIVE` no generan rondas. Se evalúa la elegibilidad vigente de la oferta, incluida su reactivación automática al recuperar al menos un slot `ACTIVE` después de haber quedado `INACTIVE` por no tener slots `ACTIVE`; una inactivación administrativa explícita mantiene la oferta `INACTIVE`. El flujo incluye la composición definida en Menu y la aceptación de la orden.
    - La proporción de solicitudes entre estas clases requiere definición antes de ejecutar el perfil; aquí no se asignan nuevos porcentajes.
  - **Tasa de error interno:** Inferior a **0.1%** de las solicitudes ofrecidas. Las selecciones deliberadamente inválidas se evalúan aparte y no cuentan como errores internos.
- **Latencias objetivo por operación:**

| Operación | Alcance y responsabilidad | p95 | p99 | Límite crítico inaceptable |
| :-- | :-- | --: | --: | --: |
| Búsqueda, filtrado o consulta por categoría del catálogo | POS → Menu, desde la acción hasta el resultado visible | **≤ 200 ms** | **≤ 1.0 s** | **> 500 ms** |
| Validación de selecciones de slots y opciones al aceptar una orden | **E2E: composición del catálogo y flujo de aceptación de la orden** | **≤ 300 ms** | **≤ 1.0 s** | **> 500 ms** |

## Capacidad ante Ráfagas

- **Identificador:** `NFR-MENU-PERF-03`
- **Condición de ráfaga:** **100 req/s** durante **60 segundos**, con hasta 40 sesiones concurrentes y la misma mezcla de carga del perfil nominal. La evaluación que incluye validación de selecciones abarca **E2E** todos los `CompositionSlot` `ACTIVE`; cada slot genera las rondas indicadas por `CompositionSlot.quantity`, con exactamente una `SlotOption` `ACTIVE` elegida por ronda. Los slots `INACTIVE` no generan rondas. La evaluación considera la elegibilidad vigente de la oferta: si se inactivó automáticamente al quedar sin slots `ACTIVE`, recupera `ACTIVE` automáticamente cuando al menos un slot vuelve a estar `ACTIVE`; si fue inactivada explícitamente por administración, se mantiene `INACTIVE`. El flujo incluye la composición del catálogo y la aceptación de la orden.
- **Criterios de aceptación:**
  1. Los servicios que participan en el flujo evaluado no colapsan ni reinician procesos durante la ráfaga.
  2. El informe de carga contabiliza las solicitudes completadas, fallidas o pendientes.
  3. No se exige mantener las latencias nominales durante la ráfaga ni se establece un plazo de recuperación.
