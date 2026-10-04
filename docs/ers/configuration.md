# Configuración de la Especificación Consolidada

| Campo | Valor |
| :--- | :--- |
| Documento | Especificación de Requisitos y Dominio del Servicio Menu |
| Servicio | Menu (Sistema de Comandas para Restaurantes) |
| Versión | 2.1.5 (Consolidada Vigente) |
| Estado | Vigente / En Revisión con Cuestiones Abiertas Pendientes |
| Fecha | 2026-10-03 |

## Identificación y Propósito

Este documento fija la versión, las fuentes de autoridad y el alcance de la especificación vigente para el servicio **Menu**.

La versión **2.1.5** (fecha 2026-10-03) fija como autoridad el modelo vigente de Menú/Catálogo en [`domain-model.md`](../other/md/domain-model.md). El alcance operativo contempla un catálogo por sucursal, provisionado con su instalación, sin administración de menús. Se conservan las restricciones de contenido y validación atómica de imágenes de **OPEN-005**; las operaciones, los datos y las representaciones externas de la API permanecen pendientes bajo **OPEN-010**.

### Ciclo de vida y referencias

Una entrada se archiva desde ACTIVE o INACTIVE y al desarchivarla queda INACTIVE; una entrada ACTIVE requiere al menos una oferta ACTIVE y válida, sin cambios automáticos entre estados. Solo se elimina una entrada ARCHIVED o una oferta INACTIVE cuando no hay referencias vigentes externas; la eliminación individual de una oferta también se rechaza si corresponde a defaultOfferId o si invalidaría una entrada ACTIVE. Estas eliminaciones aplican RESTRICT: ante una restricción, se rechazan sin modificar las definiciones dependientes ni alterar sus referencias vigentes. Las revisiones históricas publicadas permanecen inmutables y consultables. Se conserva el cierre de entradas archivadas y la base de reespecificación integral del catálogo.

## Alcance operativo vigente

El alcance esperado para esta versión es un `Menu` —el catálogo completo— por sucursal, provisionado mediante configuración al instalar la sucursal. Esta versión no contempla administración de menús. Este alcance operativo no modifica las entidades ni las invariantes del dominio vigente, no agrega `Branch` ni `Tenant` al dominio y conserva `Menu` tal como está definido en [`domain-model.md`](../other/md/domain-model.md).

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
12. [**`domain-model.md`**](../other/md/domain-model.md) (modelo conceptual vigente de entidades, relaciones, composición, recetas y límites del catálogo).

### Regla de Prevalencia

La especificación vigente se aplica con este orden de autoridad:

- El [modelo conceptual vigente](../other/md/domain-model.md) define el dominio autoritativo de Menú/Catálogo: entidades, relaciones, reglas de composición, contenido, recetas, precios declarados y límites con otros contextos.
- Los documentos normativos de esta ERS en `docs/ers/` desarrollan y precisan ese modelo: [arquitectura](architechture.md), [requisitos funcionales](functional-requirements.md), [reglas de negocio](business-rules.md), [requisitos no funcionales](non-functional-requirements.md), [cuestiones abiertas](open.md) y [trazabilidad](traceability.md). Los requisitos, reglas y criterios vigentes rigen la especificación; OPEN-005 conserva las restricciones de contenido y validación atómica de imágenes en los requisitos funcionales y su trazabilidad. Las operaciones y representaciones externas de API quedan pendientes bajo OPEN-010.
- Las fuentes históricas enumeradas arriba aportan contexto sobre la evolución y las decisiones del proyecto; no constituyen norma vigente ni prevalecen sobre el modelo conceptual y los documentos normativos actuales.
