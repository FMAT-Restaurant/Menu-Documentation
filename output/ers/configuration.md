# Configuración de la Especificación Consolidada

**Documento:** Especificación Técnica, Funcional y de Arquitectura de Dominio Consolidada  
**Servicio:** Menu (Sistema de Comandas para Restaurantes)  
**Versión:** 1.4.0 (Consolidada Vigente)  
**Estado:** Vigente / En Revisión con Cuestiones Abiertas Pendientes  
**Fecha:** 2026-09-25  

## Identificación y Propósito

El presente documento constituye la especificación técnica, funcional, estructural y de arquitectura consolidada y vigente para el servicio **Menu**, componente del sistema de comandas y gestión de restaurantes.

Su objetivo es constituirse como la **fuente autorizada de verdad consolidada del servicio Menu**, proporcionando un modelo coherente, riguroso y verificable derivado exclusivamente de las doce fuentes autorizadas del proyecto.

La versión **1.4.0** (fecha 2026-09-25) conserva la consolidación de los refinamientos normativos de la versión **1.3.12** y agrega las precisiones conceptuales sobre límites de responsabilidad, modelo de dominio y contrato de datos.

### Autoridad Temporal y Semántica de las Fuentes

La especificación se fundamenta estrictamente en la evolución cronológica y jerárquica de las doce fuentes autorizadas del proyecto:

1. **`Problema-Inicial.md`** (Origen del problema, identificación de ambigüedades estructurales en modificadores e instrucciones de cocción).
2. **`Consultoria-1.md`** (Análisis de rendimiento, perfil de carga para restaurantes y límites de latencia).
3. **`Consultoria-2.md`** (Desacoplamiento de variantes e inventario, archivado, outbox y consistencia asíncrona).
4. **`Auditoria-1.md`** (Detección de agujeros y debilidades del modelo conceptual inicial).
5. **`Auditoria-2.md`** (Propuestas de solución: patrón Default Variant, variante como unidad vendible).
6. **`Modelo-Pre-Final.md`** (Modelo intermedio de taxonomía comercial y cumplimiento).
7. **`Decisiones-cierre-invariantes.md`** (Cierres arquitectónicos formales ADR-001 a ADR-008).
8. **`Req-F-Aproved.md`** (Base de 41 requisitos funcionales formalmente aprobados).
9. **`Auditoria-3.md`** (Diseño consolidado de dominio, propiedad de modificadores en item hoja con especialización opcional, desacoplamiento estricto de combos y reevaluación no obstructiva por archivado de variantes).
10. **`Auditoria-4.md`** (Síntesis consolidada del modelo, separación estricta de responsabilidades entre Menu, Orders + Kitchen e Inventory, eliminación de Preparación y efectos físicos en Menu, readiness y disponibilidad calculados por Orders + Kitchen, revisiones comerciales y culinarias desacopladas).
11. **`Consultoria-3.md`** (Autoridad posterior sobre ciclo de vida administrativo, habilitación y retiro de componentes internos, propagación de elegibilidad estructural y creación de órdenes)

#### Regla de Prevalencia

Una fuente posterior sustituye a una anterior en caso de contradicción explícita o cuando la decisión posterior refine de forma incompatible el modelo previo:

- **`Consultoria-3.md`** se conserva como autoridad respecto a jerarquía resolutiva y cronológica posterior exclusivamente sobre el ciclo de vida administrativo, habilitación y retiro de componentes internos, propagación de elegibilidad estructural y la creación y custodia de órdenes por Orders + Kitchen. Prevalece sobre cualquier regla incompatible previa de `Auditoria-4.md`, `Auditoria-3.md` o `Req-F-Aproved.md` (en particular respecto a asignar `ARCHIVED` a variantes, limitar `MenuItem` a solo `ACTIVE`/`INACTIVE` o flujos erróneos de creación de comandas).
- **`Auditoria-4.md`** se conserva como máxima autoridad sobre la arquitectura global, separación estricta de servicios (Menu → POS → Orders + Kitchen → Inventory), ownership de datos, eliminación de Preparación y efectos físicos en Menu, y cálculo externo de readiness y disponibilidad operacional por Orders + Kitchen, salvo en las precisiones de ciclo de vida y habilitación refinadas por `Consultoria-3.md`.
- **`Auditoria-3.md`** representa la base más estable del catálogo comercial para la propiedad de modificadores en el item hoja, la especialización comercial por variante, el desacoplamiento de combos y la reevaluación no obstructiva por archivado o deshabilitación de componentes (prevaleciendo sobre la restricción previa de rechazo obligatorio de `Req-F-Aproved.md` y ADR-005).
- **`Req-F-Aproved.md`** aporta la línea base de los 41 requisitos funcionales aprobados. Sus requisitos se conservan vigentes salvo cuando una decisión posterior de `Auditoria-3.md`, `Auditoria-4.md` o `Consultoria-3.md` los contradiga, refine o vuelva obsoletos, en cuyo caso se actualizan o marcan como reemplazados con trazabilidad explícita individual.
- Se excluyen terminantemente del historial y de la regla de prevalencia todas las referencias a refinamientos, aclaraciones o revisiones posteriores no contenidas en las doce fuentes autorizadas.
