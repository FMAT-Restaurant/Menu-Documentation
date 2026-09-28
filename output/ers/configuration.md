# Configuración de la Especificación Consolidada

| Campo | Valor |
| :--- | :--- |
| Documento | Especificación de Requisitos y Dominio del Servicio Menu |
| Servicio | Menu (Sistema de Comandas para Restaurantes) |
| Versión | 2.1.0 (Consolidada Vigente) |
| Estado | Vigente / En Revisión con Cuestiones Abiertas Pendientes |
| Fecha | 2026-09-28 |

## Identificación y Propósito

Este documento fija la versión, las fuentes de autoridad y el alcance de la especificación vigente para el servicio **Menu**.

La versión **2.1.0** (fecha 2026-09-28) incorpora la eliminación definitiva de entradas archivadas con conversión íntegra de referencias vigentes a contenido local y conservación de revisiones históricas. Mantiene como base la reespecificación integral del catálogo de la versión 2.0.0. Su fuente conceptual principal es [`docs/md/domain-model.md`](../../docs/md/domain-model.md), que define el modelo vigente de Menú/Catálogo.

## Autoridad Temporal y Semántica de las Fuentes

Las fuentes siguientes registran el análisis y las decisiones del proyecto. El orden documenta su evolución y aporta contexto a la especificación vigente:

1. **`Problema-Inicial.md`** (contexto y necesidades iniciales del servicio).
2. **`Consultoria-1.md`** (criterios de rendimiento y perfiles de carga).
3. **`Consultoria-2.md`** (análisis de responsabilidades y operación del servicio).
4. **`Auditoria-1.md`** (revisión del modelo conceptual inicial).
5. **`Auditoria-2.md`** (propuestas de modelado del catálogo).
6. **`Modelo-Pre-Final.md`** (modelo intermedio del dominio).
7. **`Decisiones-cierre-invariantes.md`** (decisiones de cierre y criterios de aceptación).
8. **`Req-F-Aproved.md`** (base histórica de requisitos funcionales).
9. **`Auditoria-3.md`** (revisión del modelo de dominio y las reglas comerciales).
10. **`Auditoria-4.md`** (revisión de responsabilidades y límites entre servicios).
11. **`Consultoria-3.md`** (revisión del ciclo de vida y responsabilidades operativas).
12. **`docs/md/domain-model.md`** (modelo conceptual vigente de entidades, relaciones, composición, recetas, personalizaciones y límites del catálogo).

### Regla de Prevalencia

La especificación vigente se aplica con este orden de autoridad:

- **`docs/md/domain-model.md`** define el modelo conceptual autoritativo de Menú/Catálogo: entidades, relaciones, reglas de composición, contenido, recetas, personalizaciones, precios declarados y límites con otros contextos.
- **`output/ers/architechture.md`** desarrolla la arquitectura y los diagramas del servicio de acuerdo con ese modelo conceptual.
- **`output/ers/functional-requirements.md`**, **`business-rules.md`**, **`non-functional-requirements.md`**, **`open.md`** y **`traceability.md`** especifican capacidades, restricciones, criterios de calidad y decisiones pendientes con base en el modelo vigente.
- Las fuentes históricas enumeradas arriba proporcionan contexto documental. Los requisitos, reglas y criterios de calidad que aparecen en la ERS vigente son los que rigen esta especificación.
