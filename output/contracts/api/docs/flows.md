# Secuencias administrativas complementarias

Las operaciones, payloads, resultados y errores se definen en [`../openapi.yaml`](../openapi.yaml). Este documento explica la relación entre operaciones sin reemplazar sus contratos.

## Creación, borrador y activación

`POST /api/menus/{menuId}/items` admite `ACTIVE` o `INACTIVE`. Una creación `ACTIVE` requiere una definición comercial completa y estructuralmente elegible en la misma operación; en caso contrario se rechaza sin crear un item activo parcial. Un item `INACTIVE` puede completarse después mediante operaciones de componentes. Si su grupo obligatorio o slot habilitado tiene capacidad menor que `minSelections`, el guardado devuelve advertencias estructuradas con entidad, mínimo y capacidad calculada. `PATCH /items/{itemId}` a `ACTIVE` revalida la capacidad y las dependencias; las señales operacionales de Orders + Kitchen siguen siendo una dimensión distinta. Desarchivar produce `INACTIVE`, y una activación posterior requiere otra solicitud explícita.

## Migración de variante DEFAULT

`POST /items/{itemId}/variant-migrations` sustituye la variante técnica sin dimensiones por variantes con selecciones de dimensiones ya pertenecientes al item. La operación aplica una sola revisión comercial y no publica estados intermedios. Rechaza combinaciones duplicadas o valores ajenos al item. El efecto sobre referencias históricas conserva las identidades que deban mantenerse según la ERS.

Archivar un ítem hoja o deshabilitar una variante no se bloquea por combos dependientes. Se excluyen de nuevas ventas las opciones afectadas y se reevalúa cada configuración dependiente: si algún slot habilitado ya no alcanza `minSelections`, la configuración queda inelegible y `REVIEW_REQUIRED`, mientras `MenuItem.status` del combo permanece intacto.

## Copias de modificadores y combos

`POST /items/{itemId}/modifier-config-copies` copia excepciones comerciales entre variantes del mismo item usando `FAIL` o `REPLACE`; la operación aplica todo o nada. `POST /combo-configurations/{configurationId}/clones` crea configuración, slots y opciones con nuevas identidades. `POST /combo-configurations/{configurationId}/copies` exige por cada slot origen un `targetSlotId` explícito o una directiva explícita de nuevo slot; no infiere correspondencia por nombre, posición u orden.

`POST /combo-option-copy-batches` exige `targetConfigurationId` y mapeo de slots para **cada destino**. Cada configuración destino se aplica completa o se rechaza completa; el lote puede combinar destinos aplicados y rechazados. La respuesta enumera el resultado por destino. Los códigos finales y la política técnica de concurrencia permanecen en `OPEN-002`.

Las configuraciones de Menu describen modificadores comerciales de variantes hoja. Si una orden selecciona una variante como componente de combo, sus modificadores se aplican solo a esa instancia física; los de componentes repetidos se resuelven por instancia, sin deduplicación ni bonificación implícita (`BR-MENU-016`, `BR-MENU-029`). La captura de esas selecciones y la aplicación autoritativa al aceptar la orden corresponden a Orders + Kitchen y no aparecen como comandos de esta API.

## Confirmación de revisión

`GET /reviews` muestra los targets `MenuItemVariant` y `ComboConfiguration`, sus causas y el estado agregado del item COMBO. El cliente confirma el `observedRevision` que leyó mediante el endpoint de `review-acknowledgements` correspondiente. Si apareció una revisión posterior, la confirmación no debe liquidar causas nuevas y la solicitud se rechaza por conflicto. Confirmar una configuración no cambia su precio, slots, opciones ni revisión comercial. La disponibilidad y readiness no generan por sí mismos una revisión administrativa.
