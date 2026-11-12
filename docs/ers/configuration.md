# Configuración de la Especificación Consolidada

| Campo | Valor |
| :--- | :--- |
| Documento | Especificación de Requisitos y Dominio del Servicio Menu |
| Servicio | Menu (Sistema de Comandas para Restaurantes) |
| Versión | 2.4.1 (Consolidada Vigente) |
| Estado | Vigente / En Revisión con Cuestiones Abiertas Pendientes |
| Fecha | 2026-11-11 |

## Identificación y Propósito

Este documento fija la versión, las fuentes de autoridad y el alcance de la especificación vigente para el servicio **Menu**.

La versión **2.4.1** (fecha 2026-11-11) fija como autoridad normativa los documentos de esta ERS en `docs/ers/`; [`domain-model.md`](../other/md/domain-model.md) es el modelo conceptual de referencia y aporta contexto. La arquitectura presenta una vista conceptual del catálogo orientada a Front y una vista técnica del modelo en diagrama de clases orientada a Back. Cada `CatalogOffer` contiene una `Composition` (composición), conjunto de uno o más `CompositionSlot` (slots), y cada slot contiene opciones (`SlotOption`). Cada recurso separa su `status` administrativo, que decide si se muestra y solo cambia el administrador, de `isAvailable`, un booleano derivado que decide si se puede ordenar y se recalcula solo. `CompositionSlot` no tiene `status`: todos los slots son obligatorios, cada uno genera `CompositionSlot.quantity` rondas con exactamente una opción `ACTIVE` con `isAvailable` por ronda, y basta un slot sin `isAvailable` para que la oferta tampoco lo tenga. Quien no administra el catálogo ve las entradas y ofertas `ACTIVE`; las que no tienen `isAvailable` aparecen deshabilitadas y no se pueden ordenar, y el administrador ve todo en cualquier `status`. El sistema nunca cambia un `status` de forma automática. Menu e Inventario se comunican de forma asíncrona por eventos (BR-MENU-032 a BR-MENU-034), cuyo contrato queda pendiente en **OPEN-011**. Al configurar una oferta, otra oferta del catálogo puede servir como plantilla para copiar sus slots y opciones a la composición actual; la copia es editable e independiente, conserva el `status` de las opciones y las fuentes de contenido, y no mantiene referencia, precio ni sincronización con la oferta plantilla. `ComponentSource` admite únicamente `INVENTORY_ITEM` y `RECIPE`. `RecipeDefinition` contiene nombre, descripción, instrucciones textuales y cantidades de ingredientes seleccionados de Inventario; la unidad autoritativa del artículo se muestra al configurar y consultar la receta. Cada opción de tipo `RECIPE` se selecciona únicamente por `recipeId` y usa siempre la revisión vigente de la receta; cada receta se crea con la revisión 1 y cada edición crea una revisión nueva con el número siguiente, que las opciones vigentes usan de inmediato, mientras las revisiones anteriores quedan como historial consultable. Omitir `recipeId` en una opción existente conserva la receta asignada. Una receta vigente solo se elimina cuando ninguna opción de ninguna oferta la referencia, y su historial de revisiones permanece consultable. El alcance operativo contempla un catálogo por sucursal, provisionado con su instalación, sin administración de menús. Se conservan las restricciones de contenido de imágenes de **OPEN-005**. El archivo se valida en una carga previa e independiente, en la que el sistema asigna el identificador de la imagen; la creación y la actualización de entradas y ofertas la asocian mediante ese identificador (`imageId`). La carga y la asociación son operaciones independientes, con rechazo íntegro y atomicidad por operación; un fallo de asociación no deshace la carga previa. El [contrato de API existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) expone operaciones administrativas. Su alineación integral con la ERS y la cobertura de operaciones y representaciones faltantes permanecen pendientes bajo **OPEN-010**; el flujo de imágenes ya está resuelto.

`presentationTag` es un atributo obligatorio y no nulo de `CatalogOffer`: una oferta no puede crearse sin él.

### Ciclo de vida y referencias

Una entrada se archiva desde ACTIVE o INACTIVE y al desarchivarla queda INACTIVE. Su estado administrativo es independiente de sus ofertas y no cambia por el estado administrativo ni por la disponibilidad de estas; una entrada ACTIVE sin ofertas disponibles se muestra deshabilitada. Solo se elimina definitivamente una entrada ARCHIVED. Una oferta solo puede eliminarse individualmente si está INACTIVE; la disponibilidad no interviene. Las definiciones poseídas exclusivamente se eliminan con el recurso.

## Alcance operativo vigente

El alcance esperado para esta versión es un `Menu` —el catálogo completo— por sucursal, provisionado mediante configuración al instalar la sucursal. Esta versión no contempla administración de menús. Este alcance operativo no modifica las entidades ni las invariantes del dominio vigente, no agrega `Branch` ni `Tenant` al dominio y conserva `Menu` tal como lo define esta ERS en [contexto](context.md) y [arquitectura](architechture.md).

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
12. [**`domain-model.md`**](../other/md/domain-model.md) (modelo conceptual de referencia que sirvió de base a la ERS: entidades, relaciones, composición, recetas y límites del catálogo; aporta contexto y no es normativo).

### Regla de Prevalencia

La especificación vigente se aplica con este orden de autoridad:

- Los documentos normativos de esta ERS en `docs/ers/` son la autoridad normativa del dominio de Menú/Catálogo y de sus requisitos: [arquitectura](architechture.md), [requisitos funcionales](functional-requirements.md), [reglas de negocio](business-rules.md), [requisitos no funcionales](non-functional-requirements.md), [cuestiones abiertas](open.md) y [trazabilidad](traceability.md). Los requisitos, reglas y criterios vigentes rigen la especificación; OPEN-005 conserva las restricciones de contenido de imágenes en los requisitos funcionales y su trazabilidad: carga previa del archivo, validada e independiente, en la que el sistema asigna el identificador de la imagen, seguida de la asociación de la entrada u oferta mediante ese identificador (`imageId`), con atomicidad por operación. El [contrato de API existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) define operaciones administrativas; su alineación integral y la cobertura de operaciones y representaciones faltantes siguen pendientes bajo OPEN-010. El flujo de imágenes está resuelto.
- El [modelo conceptual de referencia](../other/md/domain-model.md) aporta el contexto del dominio que sirvió de base a esta ERS: entidades, relaciones, reglas de composición, contenido, recetas, precios declarados y límites con otros contextos. No es normativo; donde difiera de los documentos de la ERS, prevalece la ERS.
- Las fuentes históricas enumeradas arriba aportan contexto sobre la evolución y las decisiones del proyecto; no constituyen norma vigente ni prevalecen sobre los documentos normativos de la ERS.

## Registro de cambios

Cada versión registra brevemente lo que cambia: lo que había antes y lo que hay ahora.

### 2.4.1 (2026-11-11)

- **Detalles de API:** Antes: la ERS citaba la ruta de carga de imágenes, `data.id`, UUID, cuerpos JSON y POST/PATCH, y describía `presentationTag` como string sin `null` según el contrato de API. → Ahora: carga previa validada con identificador asignado por el sistema y asociación mediante `imageId`; `presentationTag` es obligatorio y no nulo.
- **Autoridad del modelo de dominio:** Antes: `domain-model.md` era el modelo autoritativo. → Ahora: la ERS es la autoridad normativa y `domain-model.md` aporta contexto.
- **Terminología de ofertas:** Antes: "oferta vigente", "definiciones vigentes" y similares, heredados del historial de ofertas. → Ahora: sin "vigente" en ofertas; se conserva en recetas.
- **Términos en inglés:** Antes: "Orders" e "Inventory" en prosa. → Ahora: "Órdenes" e "Inventario".
- **Temas de trazabilidad:** Antes: los temas de REQ-MENU-ENTRY-001, ENTRY-002, OFFER-001, OFFER-006 y CONT-001 diferían de sus títulos. → Ahora: coinciden con los títulos de los requisitos funcionales.
- **README:** Antes: "las recetas conservan su número de revisión". → Ahora: inician en la revisión 1, que aumenta en 1 con cada edición.

### 2.4.0 (2026-11-11)

- **Revisiones de oferta:** Antes: cada oferta publicaba revisiones inmutables (`CatalogOfferRevision` con su `CompositionSnapshot`, BR-MENU-029), consultables tras eliminarla. → Ahora: se retiran; las ofertas no tienen revisiones ni historial.
- **Revisiones de receta:** Antes: las revisiones publicadas de oferta registraban la revisión de receta vigente al publicarse. → Ahora: la revisión de receta es solo historial: inicia en 1, cada edición suma 1 y las anteriores son consultables.
- **Eliminación de oferta:** Antes: exigía `INACTIVE` y no dejar una entrada `ACTIVE` sin oferta `ACTIVE`. → Ahora: solo exige `INACTIVE`.
- **Actualización de composición:** Antes: sección sin identificador con detalles de la API. → Ahora: REQ-MENU-COMP-006, en términos de dominio y trazado.
- **Consulta no administrativa:** Antes: REQ-MENU-CAT-002 ocultaba las entradas "incompletas", en contra de BR-MENU-004. → Ahora: solo se ocultan entradas `INACTIVE` o `ARCHIVED` y ofertas `INACTIVE`.
- **Trazabilidad NFR:** Antes: varios requisitos no listaban todos los NFR-MENU-PERF que los relacionaban. → Ahora: las relaciones entre requisitos y NFR son simétricas.

### 2.3.0 (2026-11-11)

- **Referencia de receta:** Antes: la opción `RECIPE` fijaba internamente una revisión al asignarse. → Ahora: referencia la receta solo por `recipeId` y usa siempre su revisión vigente.
- **Edición de receta:** Antes: la revisión nueva no afectaba a las opciones existentes. → Ahora: todas las opciones vigentes que usan la receta pasan a la revisión nueva de inmediato; las anteriores quedan como historial.
- **Reasignación:** Antes: reenviar `recipeId`, aunque fuera el mismo, adoptaba la revisión más reciente. → Ahora: no hace falta reasignar; omitir `recipeId` conserva la receta asignada.
- **Copia desde oferta:** Antes: las opciones copiadas conservaban la revisión de receta fijada. → Ahora: referencian el mismo `recipeId` y siguen su revisión vigente.
- **Historial de ofertas publicadas:** Antes: opciones y revisiones publicadas de oferta guardaban cada una su revisión de receta. → Ahora: solo las revisiones publicadas de oferta registran la revisión de receta vigente al publicarse.
- **Copia de Inventario:** Antes: con revisiones fijadas, Inventario podía necesitar varias revisiones por receta. → Ahora: Inventario mantiene solo la revisión vigente de cada receta.

### 2.2.0 (2026-11-11)

- **Estados:** Antes: un único estado por recurso y slots con estado derivado de sus opciones. → Ahora: `status` administrativo decide si se muestra; `isAvailable` derivado decide si se puede ordenar.
- **Slots:** Antes: solo los slots `ACTIVE` participaban. → Ahora: todos son obligatorios; uno sin opción `ACTIVE` disponible deja a la oferta sin disponibilidad.
- **Visibilidad:** Antes: la entrada se publicaba u ocultaba según sus ofertas. → Ahora: quien no administra ve lo `ACTIVE`, con lo no disponible deshabilitado; el administrador ve todo.
- **Inactivación automática:** Antes: la oferta pasaba sola a `INACTIVE` y se reactivaba sola. → Ahora: solo el administrador cambia `status`; la disponibilidad se recupera sin intervención.
- **Activación de oferta:** Antes: requería al menos un slot `ACTIVE`. → Ahora: requiere composición estructuralmente válida, sin exigir disponibilidad.
- **Eliminación de oferta:** Antes: protegía la "última oferta activa y válida". → Ahora: protege la última oferta `ACTIVE`, sin considerar disponibilidad.
- **Integración con Inventario:** Antes: la ERS excluía eventos y disponibilidad en tiempo real. → Ahora: eventos asíncronos en ambos sentidos (REQ-MENU-AVAIL-001/002, BR-MENU-034).
- **Cuestiones abiertas:** Antes: cinco cuestiones pendientes. → Ahora: se suman OPEN-011 (contrato de eventos) y OPEN-012 (notificación y revisión ante cambios de disponibilidad).
