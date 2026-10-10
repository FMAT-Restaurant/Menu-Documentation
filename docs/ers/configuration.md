# Configuración de la Especificación Consolidada

| Campo | Valor |
| :--- | :--- |
| Documento | Especificación de Requisitos y Dominio del Servicio Menu |
| Servicio | Menu (Sistema de Comandas para Restaurantes) |
| Versión | 2.1.17 (Consolidada Vigente) |
| Estado | Vigente / En Revisión con Cuestiones Abiertas Pendientes |
| Fecha | 2026-10-10 |

## Identificación y Propósito

Este documento fija la versión, las fuentes de autoridad y el alcance de la especificación vigente para el servicio **Menu**.

La versión **2.1.17** (fecha 2026-10-10) fija como autoridad el modelo vigente de Menú/Catálogo en [`domain-model.md`](../other/md/domain-model.md). La arquitectura presenta una vista conceptual del catálogo orientada a Front y una vista técnica del modelo en diagrama de clases orientada a Back. Cada `CatalogOffer` contiene una `Composition` (composición), conjunto de uno o más `CompositionSlot` (slots), y cada slot contiene opciones (`SlotOption`). El estado del slot se deriva de sus opciones: `ACTIVE` si al menos una opción está `ACTIVE`, e `INACTIVE` si ninguna lo está. Todos los slots `ACTIVE` participan en la selección; cada uno genera `CompositionSlot.quantity` rondas y en cada ronda se elige exactamente una opción `ACTIVE`. Los slots `INACTIVE` no generan rondas. Si ningún slot permanece `ACTIVE`, `CatalogOffer` pasa automáticamente a `INACTIVE`; al volver a haber un slot `ACTIVE`, la oferta se reactiva automáticamente si su inactivación se debió a la ausencia de slots activos y seguía habilitada administrativamente. Una inactivación administrativa explícita permanece hasta una nueva activación administrativa. Una entrada solo se publica mientras está administrativamente `ACTIVE` y dispone de una oferta `ACTIVE` válida; si no tiene una, permanece `ACTIVE` pero oculta, y la inactivación automática de una oferta no cambia el estado administrativo de la entrada. Al configurar una oferta, otra oferta del catálogo puede servir como plantilla para copiar sus slots y opciones a la composición actual; la copia es editable e independiente, conserva los estados de las opciones y las fuentes de contenido, y no mantiene referencia, precio ni sincronización con la oferta plantilla. `ComponentSource` admite únicamente `INVENTORY_ITEM` y `RECIPE`. `RecipeDefinition` contiene nombre, descripción, instrucciones textuales y cantidades de ingredientes seleccionados de Inventario; la unidad autoritativa del artículo se muestra al configurar y consultar la receta. Cada opción de tipo `RECIPE` fija la definición por ID y revisión; una receta vigente solo se elimina cuando ninguna opción de una oferta vigente la referencia, y sus revisiones históricas permanecen consultables. El alcance operativo contempla un catálogo por sucursal, provisionado con su instalación, sin administración de menús. Se conservan las restricciones de contenido de imágenes de **OPEN-005**. El archivo se valida en la carga previa mediante `POST /api/v1/media/images`, donde el servidor genera y devuelve su identificador; las solicitudes JSON de creación y actualización de entradas y ofertas lo referencian mediante `imageId`. La carga y la asociación son operaciones independientes, con rechazo íntegro y atomicidad por operación; un fallo de asociación no deshace la carga previa. El [contrato de API existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) expone operaciones administrativas. Su alineación integral con la ERS y la cobertura de operaciones y representaciones faltantes permanecen pendientes bajo **OPEN-010**; el flujo de imágenes ya está resuelto.

### Ciclo de vida y referencias

Una entrada se archiva desde ACTIVE o INACTIVE y al desarchivarla queda INACTIVE. Su estado administrativo es independiente de sus ofertas: permanece ACTIVE si una oferta se inactiva automáticamente, aunque queda oculta si ya no tiene una oferta ACTIVE y válida; solo se publica cuando cumple ambas condiciones. Solo se elimina definitivamente una entrada ARCHIVED. Una oferta solo puede eliminarse individualmente si está INACTIVE y su eliminación no deja una entrada ACTIVE sin al menos una oferta ACTIVE y válida. Las definiciones poseídas exclusivamente se eliminan con el recurso; las revisiones históricas publicadas permanecen inmutables y consultables.

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
- Los documentos normativos de esta ERS en `docs/ers/` desarrollan y precisan ese modelo: [arquitectura](architechture.md), [requisitos funcionales](functional-requirements.md), [reglas de negocio](business-rules.md), [requisitos no funcionales](non-functional-requirements.md), [cuestiones abiertas](open.md) y [trazabilidad](traceability.md). Los requisitos, reglas y criterios vigentes rigen la especificación; OPEN-005 conserva las restricciones de contenido de imágenes en los requisitos funcionales y su trazabilidad: carga previa del archivo con validación e identificador generado por el servidor en `POST /api/v1/media/images`, seguida de asociación mediante `imageId` en los POST y PATCH JSON de entradas y ofertas, con atomicidad por operación. El [contrato de API existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) define operaciones administrativas; su alineación integral y la cobertura de operaciones y representaciones faltantes siguen pendientes bajo OPEN-010. El flujo de imágenes está resuelto.
- Las fuentes históricas enumeradas arriba aportan contexto sobre la evolución y las decisiones del proyecto; no constituyen norma vigente ni prevalecen sobre el modelo conceptual y los documentos normativos actuales.
