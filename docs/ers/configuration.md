# Configuración de la Especificación Consolidada

| Campo | Valor |
| :--- | :--- |
| Documento | Especificación de Requisitos y Dominio del Servicio Menu |
| Servicio | Menu (Sistema de Comandas para Restaurantes) |
| Versión | 2.1.1 (Consolidada Vigente) |
| Estado | Vigente / En Revisión con Cuestiones Abiertas Pendientes |
| Fecha | 2026-09-29 |

## Identificación y Propósito

Este documento fija la versión, las fuentes de autoridad y el alcance de la especificación vigente para el servicio **Menu**.

La versión **2.1.1** (fecha 2026-09-29) incorpora el cierre de **OPEN-005**: la creación y actualización que carga imágenes de entradas u ofertas usa `multipart/form-data`; se admiten JPEG, PNG y WebP, con máximos de 10 MiB y 4096 × 4096 px. Un formato no admitido produce 415; una imagen inválida, demasiado grande o fuera de dimensiones produce 422. El rechazo es íntegro y no aplica cambios parciales. Las respuestas de escritura y las consultas conservan las referencias JSON `imageRef` y `offerImageRef`; el formato de solicitud de datos y las representaciones de lectura permanecen sin cambios. Esta versión conserva el cierre de entradas archivadas y la base de reespecificación integral del catálogo de las versiones anteriores. Su fuente conceptual principal es [`domain-model.md`](../other/md/domain-model.md), que define el modelo vigente de Menú/Catálogo.

## Autoridad Temporal y Semántica de las Fuentes

Las fuentes siguientes registran el análisis y las decisiones del proyecto. El orden documenta su evolución y aporta contexto a la especificación vigente:

1. [**`Problema-Inicial.md`**](../other/md/Problema-Inicial.md) (contexto y necesidades iniciales del servicio).
2. [**`Consultoria-1.md`**](../other/md/Consultoria-1.md) (criterios de rendimiento y perfiles de carga).
3. [**`Consultoria-2.md`**](../other/md/Consultoria-2.md) (análisis de responsabilidades y operación del servicio).
4. [**`Auditoria-1.md`**](../other/md/Auditoria-1.md) (revisión del modelo conceptual inicial).
5. [**`Auditoria-2.md`**](../other/md/Auditoria-2.md) (propuestas de modelado del catálogo).
6. [**`Modelo-Pre-Final.md`**](../other/md/Modelo-Pre-Final.md) (modelo intermedio del dominio).
7. [**`Decisiones-cierre-invariantes.md`**](../other/md/Decisiones-cierre-invariantes.md) (decisiones de cierre y criterios de aceptación).
8. [**`Req-F-Aproved.md`**](../other/md/Req-F-Aproved.md) (base histórica de requisitos funcionales).
9. [**`Auditoria-3.md`**](../other/md/Auditoria-3.md) (revisión del modelo de dominio y las reglas comerciales).
10. [**`Auditoria-4.md`**](../other/md/Auditoria-4.md) (revisión de responsabilidades y límites entre servicios).
11. [**`Consultoria-3.md`**](../other/md/Consultoria-3.md) (revisión del ciclo de vida y responsabilidades operativas).
12. [**`domain-model.md`**](../other/md/domain-model.md) (modelo conceptual vigente de entidades, relaciones, composición, recetas, personalizaciones y límites del catálogo).

### Regla de Prevalencia

La especificación vigente se aplica con este orden de autoridad:

- El [modelo conceptual vigente](../other/md/domain-model.md) define el dominio autoritativo de Menú/Catálogo: entidades, relaciones, reglas de composición, contenido, recetas, personalizaciones, precios declarados y límites con otros contextos.
- Los documentos normativos de esta ERS en `docs/ers/` desarrollan y precisan ese modelo: [arquitectura](architechture.md), [requisitos funcionales](functional-requirements.md), [reglas de negocio](business-rules.md), [requisitos no funcionales](non-functional-requirements.md), [cuestiones abiertas](open.md) y [trazabilidad](traceability.md). Los requisitos, reglas y criterios vigentes rigen la especificación; OPEN-005 está cerrada y sus criterios de carga de imágenes quedan especificados en los requisitos funcionales y trazados en el documento de trazabilidad.
- Las fuentes históricas enumeradas arriba aportan contexto sobre la evolución y las decisiones del proyecto; no constituyen norma vigente ni prevalecen sobre el modelo conceptual y los documentos normativos actuales.
