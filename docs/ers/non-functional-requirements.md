# Requisitos No Funcionales

Los siguientes objetivos son criterios formales de aceptación de ingeniería, no mediciones empíricas de software ya ejecutadas. Se sustentan en el perfil de rendimiento documentado en `Consultoria-1.md` y en ADR-004 de `Decisiones-cierre-invariantes.md`. Miden únicamente la consulta, la búsqueda y el filtrado del catálogo descritos en [`requirements/consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md); la validación de las selecciones al aceptar una orden corresponde a Órdenes (RF-CONS-05.CA2) y no es objeto de medición de Menu.

## RNF-REND-01 — Presupuesto de rendimiento de aceptación

- **Declaración:** La consulta, la búsqueda y el filtrado del catálogo deben satisfacer los perfiles nominal y de ráfaga de RNF-REND-02 y RNF-REND-03, medidos desde la acción en el punto de venta (POS) hasta el resultado visible. Estos objetivos no son latencias de operaciones individuales de Menu.
- **Fuente:** [Decisiones-cierre-invariantes.md](../other/md/Decisiones-cierre-invariantes.md) (ADR-004); [Consultoria-1.md](../other/md/Consultoria-1.md).
- **Criterio:** Evaluación mediante pruebas de carga automatizadas y conjuntos de datos representativos del catálogo.
- **Relacionados:** RF-CONS-01, RF-CONS-02, RF-CONS-03.

## RNF-REND-02 — Perfil nominal de operación

- **Condiciones de carga por sucursal:**
  - **Concurrencia:** Hasta **40 sesiones concurrentes**.
  - **Tasa de solicitudes:** **30 solicitudes por segundo** sostenidas durante **30 minutos**.
  - **Clases de operación incluidas en la mezcla de carga:**
    1. Consulta del catálogo (entradas, ofertas y composición; RF-CONS-01, RF-CONS-02).
    2. Búsqueda por texto (RF-CONS-03.CA1).
    3. Filtrado por categoría (RF-CONS-03.CA2).
  - **Proporción entre clases:** La proporción de solicitudes entre estas clases queda pendiente en [OPEN-009](open.md#open-009--distribución-de-carga-del-perfil-nominal); aquí no se asignan porcentajes.
  - **Tasa de error interno:** Inferior a **0,1 %** de las solicitudes ofrecidas.
- **Latencias objetivo por operación:**

| Operación | Alcance y responsabilidad | p95 (percentil 95) | p99 (percentil 99) | Límite crítico inaceptable |
| :-- | :-- | --: | --: | --: |
| Consulta, búsqueda o filtrado del catálogo | Punto de venta → Menu, desde la acción hasta el resultado visible | **≤ 200 ms** | **≤ 1,0 s** | **> 500 ms** |

- **Relacionados:** RF-CONS-01, RF-CONS-02, RF-CONS-03; [OPEN-009](open.md#open-009--distribución-de-carga-del-perfil-nominal).

## RNF-REND-03 — Capacidad ante ráfagas

- **Condición de ráfaga:** **100 solicitudes por segundo** durante **60 segundos**, con hasta 40 sesiones concurrentes y la misma mezcla de clases de operación de RNF-REND-02 (consulta, búsqueda y filtrado del catálogo).
- **Criterios de aceptación:**
  1. Menu no colapsa ni reinicia procesos durante la ráfaga.
  2. El informe de carga contabiliza las solicitudes completadas, fallidas o pendientes.
  3. No se exige mantener las latencias nominales durante la ráfaga ni se establece un plazo de recuperación.
- **Relacionados:** RF-CONS-01, RF-CONS-02, RF-CONS-03; [OPEN-009](open.md#open-009--distribución-de-carga-del-perfil-nominal) (proporción de la mezcla).
