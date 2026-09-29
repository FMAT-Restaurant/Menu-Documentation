# Requisitos funcionales

Cada bloque establece una obligación primaria. Las verificaciones son criterios propuestos, no pruebas de software ejecutadas. El lenguaje del dominio usa `MenuItem` para un item del catálogo, `MenuItemVariant` para una presentación vendible concreta de un item hoja y `ComboConfiguration` para una configuración vendible concreta de un combo. `Auditoria-4.md` es la fuente activa para el modelo corregido.

---

<a id="req-menu-001"></a>

### REQ-MENU-001 — Definición del MenuItem comercial

**Requisito:**
El servicio Menu deberá crear un `MenuItem` con nombre, descripción, referencia de imagen, `Menu` propietario, un tipo de `MenuItem` (`PREPARED`, `STOCKED` o `COMBO`) y un estado administrativo inicial (`ACTIVE` o `INACTIVE`).

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 36–37

**Verificación:** Demostración: Registrar un `MenuItem` con cada tipo y estado inicial permitido y comparar la información registrada con la definición proporcionada.

**Estado:** Confirmado

---

<a id="req-menu-002"></a>

### REQ-MENU-002 — Estado administrativo

**Requisito:**
El servicio Menu deberá permitir cambiar el estado administrativo de un `MenuItem` entre `ACTIVE` e `INACTIVE`.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 18–19

**Verificación:** Prueba: Ejecutar ambas transiciones e inspeccionar el estado resultante.

**Estado:** Confirmado

---

<a id="req-menu-003"></a>

### REQ-MENU-003 — Presentación vendible de item hoja

**Requisito:**
El servicio Menu deberá proporcionar al menos una `MenuItemVariant` vendible concreta para cada `MenuItem` hoja cuyo tipo sea `PREPARED` o `STOCKED`.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 7–8

**Verificación:** Prueba: Definir un `MenuItem` PREPARED o STOCKED y comprobar que dispone de al menos una presentación vendible concreta, incluso cuando no se muestra una elección de presentación al cliente.

**Estado:** Confirmado

---

<a id="req-menu-004"></a>

### REQ-MENU-004 — Definición de dimensión de variante

**Requisito:**
El servicio Menu deberá permitir definir una dimensión de variante con nombre para un `MenuItem` hoja.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 21, 36–37

**Verificación:** Demostración: Definir una característica como tamaño, verificar su nombre y comprobar que pertenece al `MenuItem` hoja seleccionado.

**Estado:** Confirmado

**Relacionado:** REQ-MENU-023

---

<a id="req-menu-005"></a>

### REQ-MENU-005 — Definición de variantes vendibles

**Requisito:**
El servicio Menu deberá permitir definir una `MenuItemVariant` vendible asociándole valores de dimensiones de variante pertenecientes a su `MenuItem` hoja, como máximo un valor por característica y sin repetir la misma combinación, conforme a BR-MENU-002 a BR-MENU-004.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 21

**Verificación:** Prueba: Registrar una presentación válida e intentar dos valores para una característica, un valor de otro `MenuItem` y una presentación duplicada.

**Estado:** Confirmado

---

<a id="req-menu-006"></a>

### REQ-MENU-006 — Precio absoluto de la variante

**Requisito:**
El servicio Menu deberá permitir asignar un precio de venta absoluto a cada `MenuItemVariant` vendible.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 26–28

**Verificación:** Prueba: Asignar precios distintos a dos variantes y comprobar cada precio de forma independiente.

**Estado:** Confirmado

---

<a id="req-menu-007"></a>

### REQ-MENU-007 — Presentación del precio de catálogo

**Requisito:**
El servicio Menu deberá mostrar el precio de catálogo a partir de las unidades vendibles elegibles de un `MenuItem`: para un item hoja usará `MenuItemVariant.unitPrice`; para un combo usará `ComboConfiguration.unitPrice`. Mostrará `Desde $X` cuando esas unidades tengan precios distintos, `$X` cuando todas tengan el mismo precio y ningún precio numérico cuando no haya unidades elegibles.

**Tipo:** Funcional

**Fuente:** [ADR-008 — Elegibilidad, precio de catálogo y presentación predeterminada](../../docs/md/Decisiones-cierre-invariantes.md#adr-008), junto con `docs/md/Auditoria-4.md`, items 8–10 y 23–32.

**Verificación:** Mostrar un item del catálogo con dos unidades vendibles elegibles de precios distintos, luego con precios iguales y finalmente sin unidades elegibles; comprobar respectivamente `Desde $X`, `$X` y ausencia de precio numérico.

**Estado:** Confirmado

---

<a id="req-menu-008"></a>

### REQ-MENU-008 — Configuración de suministro almacenado

**Requisito:**
El servicio Menu deberá permitir especificar el artículo de inventario y la cantidad de retiro que suministran una variante vendible almacenada.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 8–9, 37

**Verificación:** Prueba: Archivar una variante con órdenes históricas, comprobar conservación y exclusión de ofertas nuevas y comprobar el rechazo o la exigencia de desactivación cuando una configuración activa dependiente ya no pueda cumplir sus mínimos.

**Estado:** Confirmado

---

<a id="req-menu-009"></a>

### REQ-MENU-009 — Receta de presentación preparada

**Requisito:**
El servicio Menu deberá permitir asociar cada `MenuItemVariant` `PREPARED` con una revisión concreta de receta que contenga los ingredientes, cantidades y unidades usados para elaborar esa presentación.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 8–9, 35–37; `docs/md/Auditoria-4.md`, items 11–13

**Verificación:** Prueba: Definir dos presentaciones PREPARED, asociar cada una con una revisión de receta y comprobar que cada presentación expone su lista de ingredientes. Se puede usar la misma revisión cuando ambas presentaciones usan los mismos ingredientes y cantidades.

**Estado:** Confirmado

---

<a id="req-menu-010"></a>

### REQ-MENU-010 — Configuración de combo

**Requisito:**
El servicio Menu deberá permitir definir una o más `ComboConfiguration` para un `MenuItem` COMBO, cada una con nombre, precio unitario absoluto y uno o más `ComboSlot` de selección.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 9–10, 37

**Verificación:** Demostración: Definir espacios distintos para dos registros ComboConfiguration y verificar cada configuración.

**Estado:** Confirmado

---

<a id="req-menu-011"></a>

### REQ-MENU-011 — Definición del espacio de selección de

**Requisito:**
El servicio Menu deberá permitir configurar cada `ComboSlot` con un nombre y los límites enteros `minSelections` y `maxSelections` de opciones que el cliente puede seleccionar, cumpliendo `0 <= minSelections <= maxSelections` conforme a BR-MENU-024.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 10

**Verificación:** Demostración: Configurar un espacio con nombre, elegir su mínimo y máximo de opciones y comprobar que ambos límites aparecen en la configuración del combo.

**Estado:** Confirmado

---

<a id="req-menu-012"></a>

### REQ-MENU-012 — Definición de opciones de combo

**Requisito:**
El servicio Menu deberá agregar a un espacio de combo una opción que apunte a una `MenuItemVariant` hoja concreta, conserve una cantidad incluida positiva y conserve un `priceDelta` explícito.

**Tipo:** Funcional

**Fuente:** `docs/md/Auditoria-4.md`, items 23–32; sustituye la interpretación de precio fijo de opción del paquete de alineación anterior.

**Verificación:** Prueba: Configurar opciones con cantidades incluidas y `priceDelta` distintos; comprobar que cambiar solo la cantidad no cambia `ComboConfiguration.unitPrice`, mientras que el subtotal cambia únicamente por los deltas configurados y los modificadores seleccionados de productos hoja, nunca por `unitPrice` del componente.

**Estado:** Confirmado

---

<a id="req-menu-013"></a>

### REQ-MENU-013 — Definición de grupos de modificadores

**Requisito:**
El servicio Menu deberá permitir definir un `ModifierGroup` directamente en un `MenuItem` PREPARED o STOCKED conforme a BR-MENU-024. El grupo es compartido por las variantes hoja del item y no se adjunta a un COMBO.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 12–13, 48; `docs/md/Auditoria-4.md`, items 14–20

**Verificación:** Demostración: Definir un `ModifierGroup` en un `MenuItem` PREPARED o STOCKED, comprobar el item propietario y el nombre, y comprobar sus límites `minSelections` y `maxSelections`.

**Estado:** Confirmado

---

<a id="req-menu-014"></a>

### REQ-MENU-014 — Definición de opciones de modificadores

**Requisito:**
El servicio Menu deberá permitir definir una `ModifierOption` con nombre dentro de un `ModifierGroup` del mismo `MenuItem` PREPARED o STOCKED y una configuración general `generalConfig` (configuración de un modificador que aplica a todas las variantes) para sus variantes.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 42–44; `docs/md/Auditoria-4.md`, items 14–18

**Verificación:** Demostración: Definir una `ModifierOption` en un `MenuItem` hoja, comprobar su nombre y `ModifierGroup` propietario, y comprobar que tiene `generalConfig`.

**Estado:** Confirmado

---

<a id="req-menu-015"></a>

### REQ-MENU-015 — Precio de modificador por variante

**Requisito:**
El servicio Menu deberá permitir definir el `priceDelta` de `ModifierOption.generalConfig` y, cuando el comportamiento efectivo de una presentación difiera del general, una `VariantModifierConfig` para esa `MenuItemVariant` hoja con el ajuste específico.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 42–47; `docs/md/Auditoria-4.md`, items 14–18

**Verificación:** Prueba: Definir un ajuste general, agregar una excepción para una presentación hoja y comprobar que las presentaciones sin excepción usan el valor general y que la excepción usa su propio valor.

**Estado:** Confirmado

---

<a id="req-menu-016"></a>

### REQ-MENU-016 — Copia de configuraciones de modificadores

**Requisito:**
El servicio Menu deberá permitir copiar, mediante E-17, excepciones de modificadores seleccionadas —incluidos sus ajustes de precio, límites de cantidad y efectos sobre ingredientes— desde una `MenuItemVariant` hoja origen hacia una o más variantes hoja destino del mismo `MenuItem`, aplicando la política `FAIL` o `REPLACE` solicitada.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 45–46

**Verificación:** Prueba: Ejecutar E-17 en `dryRun` y después en modo de aplicación, comparar los parámetros copiados con el origen y comprobar que un conflicto `FAIL` no deja efectos parciales.

**Estado:** Confirmado

**Relacionado:** REQ-MENU-024

**Contrato activo:** [E-17](../interfaces/apis/entrada/E-17.md); [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

---

<a id="req-menu-017"></a>

### REQ-MENU-017 — Directiva de adición de ingrediente

**Requisito:**
El servicio Menu deberá permitir configurar una adición de ingrediente en `ModifierOption.generalConfig` o en `VariantModifierConfig`, identificando el artículo de Inventory, la cantidad añadida y la unidad de medida.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 34, 42–43

**Verificación:** Prueba: Configurar adiciones de cantidades distintas para la misma opción en dos variantes y verificar cada efecto.

**Estado:** Confirmado

---

<a id="req-menu-018"></a>

### REQ-MENU-018 — Directiva de omisión de ingrediente

**Requisito:**
El servicio Menu deberá permitir configurar una omisión de ingrediente en `ModifierOption.generalConfig` o en `VariantModifierConfig` mediante la identificación del artículo de Inventory que se omitirá en la preparación.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 33–34, 46

**Verificación:** Prueba: Configurar una omisión y verificar el ingrediente identificado y la directiva de omisión.

**Estado:** Confirmado

---

<a id="req-menu-019"></a>

### REQ-MENU-019 — Modificadores de preparación sin efectos sobre ingredientes

**Requisito:**
El servicio Menu deberá permitir definir un modificador de preparación para un `MenuItem` hoja sin efectos asociados sobre ingredientes.

**Tipo:** Funcional

**Fuente:** `docs/md/Problema-Inicial.md` pp. 108–110; `docs/md/Modelo-Final.md` pp. 42

**Verificación:** Prueba: Definir una instrucción de cocción sin efectos sobre ingredientes y verificar que la configuración se acepta.

**Estado:** Confirmado

---

<a id="req-menu-020"></a>

### REQ-MENU-020 — Definición de recetas

**Requisito:**
El servicio Menu deberá permitir definir una receta culinaria con nombre y composición de ingredientes que especifique cada artículo de Inventory, cantidad requerida y unidad de medida; Menu deberá asignar la revisión inicial de la receta.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 20–23, 37–38

**Verificación:** Demostración: Definir una receta con varios componentes, comprobar su `recipeId` y `recipeVersion` asignados por Menu y comparar su composición registrada con la definición proporcionada.

**Estado:** Confirmado

---

<a id="req-menu-021"></a>

### REQ-MENU-021 — Historial de versiones de receta

**Requisito:**
El servicio Menu deberá conservar cada cambio aceptado al nombre o a la lista de ingredientes de una receta como una nueva revisión inmutable de esa receta.

**Tipo:** Funcional

**Fuente:** [ADR-006 — Versiones de MenuItem y receta](../../docs/md/Decisiones-cierre-invariantes.md#adr-006).

**Verificación:** Cambiar el nombre de una receta y después su lista de ingredientes; comprobar que cada cambio aceptado crea una revisión nueva y que las anteriores no cambian. Este requisito trata del historial de recetas; la revisión de combos se especifica por separado en REQ-MENU-033 a REQ-MENU-037.

**Estado:** Confirmado

---

<a id="req-menu-022"></a>

### REQ-MENU-022 — Publicación de catálogo

**Requisito:**
El servicio Menu deberá exponer las definiciones vigentes mediante E-01 a E-03 y publicar las invalidaciones M-07 para cambios comerciales efectivos y M-08 para cambios efectivos de disponibilidad, para que las vistas consumidoras puedan actualizarse.

**Tipo:** Funcional

**Fuente:** [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

**Verificación:** Demostración: publicar un cambio de precio y un cambio de disponibilidad, comprobar que los consumidores reciben la definición o disponibilidad actualizada y comprobar que un cambio solo de disponibilidad no crea una revisión comercial nueva de `MenuItem`.

**Estado:** Confirmado

---

<a id="req-menu-023"></a>

### REQ-MENU-023 — Valor de dimensión de variante

**Requisito:**
El servicio Menu deberá permitir definir valores con nombre, como Pequeño o Grande, dentro de una dimensión de variante de un `MenuItem` hoja.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 21, 36–37

**Verificación:** Demostración: Definir dos valores para una dimensión de variante y comprobar que ambos pertenecen al `MenuItem` hoja seleccionado.

**Estado:** Confirmado

---

<a id="req-menu-024"></a>

### REQ-MENU-024 — Copia de configuración de combo

**Requisito:**
El servicio Menu deberá permitir copiar, mediante E-17, los `ComboSlot` y sus `ComboOption` desde una `ComboConfiguration` origen a una `ComboConfiguration` destino del mismo `MenuItem` COMBO, generando nuevas identidades en el destino.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 30–31

**Verificación:** Prueba: Ejecutar la copia en `dryRun` y en modo de aplicación, comparar slots y opciones resultantes con el origen y comprobar que un conflicto `FAIL` no deja una configuración parcial.

**Estado:** Confirmado

**Contrato activo:** [E-17](../interfaces/apis/entrada/E-17.md); [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

---

<a id="req-menu-025"></a>

### REQ-MENU-025 — Asignación múltiple de opciones de combo

**Requisito:**
El servicio Menu deberá permitir aplicar, mediante E-17 y usando los IDs explícitos de cada destino, un conjunto seleccionado de `ComboOption` a varias `ComboConfiguration` del mismo `MenuItem` COMBO en una operación administrativa atómica.

**Tipo:** Funcional

**Fuente:** `docs/md/Modelo-Final.md` pp. 31

**Verificación:** Demostración: Aplicar un conjunto seleccionado a dos registros `ComboConfiguration` y verificar asociaciones por `configurationId` y `slotId`, sin efectos parciales si un destino falla.

**Estado:** Confirmado

**Contrato activo:** [E-17](../interfaces/apis/entrada/E-17.md); [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

---

<a id="req-menu-026"></a>

### REQ-MENU-026 — Archivar variante

**Requisito:**
El servicio Menu deberá permitir archivar una `MenuItemVariant` conservando sus referencias históricas y excluyéndola de nuevas ventas. Las `ComboOption` que la referencien dejarán de ser elegibles. Menu deberá reevaluar las `ComboConfiguration` dependientes y marcar como inelegibles aquellas cuyos `ComboSlot` ya no puedan satisfacer sus mínimos, además de señalarlas para revisión administrativa.

**Tipo:** Funcional

**Fuente:** [ADR-003](../../docs/md/Decisiones-cierre-invariantes.md#adr-003)

**Verificación:** Archivar una variante con órdenes históricas, comprobar conservación y exclusión de ofertas nuevas y comprobar el rechazo o la exigencia de desactivación cuando una configuración activa dependiente ya no pueda cumplir sus mínimos.

**Estado:** Confirmado

---

<a id="req-menu-027"></a>

### REQ-MENU-027 — Guardar reglas de selección incompletas

**Requisito:**
El servicio Menu deberá permitir guardar una definición incompleta cuando el contexto que contiene la regla esté `INACTIVE`: para un `ModifierGroup`, el contexto puede ser su `MenuItem` o la `MenuItemVariant` hoja correspondiente; para un `ComboSlot`, es el `MenuItem` COMBO porque `ComboConfiguration` no tiene estado propio. La capacidad será inferior a `minSelections` cuando, para `ModifierGroup`, sea menor la suma de `maxQuantity` de sus `ModifierOption` habilitadas o, para `ComboSlot`, sea menor el número de `ComboOption` habilitadas cuyo `MenuItemVariant` componente está `ACTIVE`.

**Tipo:** Funcional

**Fuente:** [ADR-005](../../docs/md/Decisiones-cierre-invariantes.md#adr-005)

**Verificación:** Guardar un `MenuItem` hoja `INACTIVE` con un grupo cuyo mínimo sea 2 y capacidad calculada 1, guardar una `MenuItemVariant` hoja `INACTIVE` con la misma insuficiencia y guardar un `MenuItem` COMBO `INACTIVE` con un slot cuyo mínimo sea 2 y una sola opción habilitada con componente `ACTIVE`; comprobar que se guardan con advertencia identificable y no se ofrecen como `ACTIVE`.

**Estado:** Confirmado

---

<a id="req-menu-028"></a>

### REQ-MENU-028 — Informar selecciones faltantes

**Requisito:**
El servicio Menu deberá incluir, al guardar un `MenuItem` o `MenuItemVariant` `INACTIVE`, en la advertencia de capacidad incompleta la identidad y el tipo de cada `ModifierGroup` o `ComboSlot` que no pueda cumplir su `minSelections`, junto con el mínimo y la capacidad calculada: suma de `maxQuantity` para un grupo o número de opciones habilitadas con componente `ACTIVE` para un slot.

**Tipo:** Funcional

**Fuente:** [ADR-005](../../docs/md/Decisiones-cierre-invariantes.md#adr-005)

**Verificación:** Comprobar que cada advertencia exponga la identidad, el tipo (`ModifierGroup` o `ComboSlot`), `minSelections` y la capacidad calculada correspondiente.

**Estado:** Confirmado

---

<a id="req-menu-029"></a>

### REQ-MENU-029 — Sin precio de catálogo elegible

**Requisito:**
Cuando un MenuItem no tenga ninguna `MenuItemVariant` o `ComboConfiguration` elegible, el servicio Menu deberá excluirlo de nuevas selecciones de venta y no deberá exponer un precio de catálogo numérico.

**Tipo:** Funcional

**Fuente:** Decisión de usuario.

**Verificación:** Prueba: Configurar un item hoja sin variantes elegibles y un combo sin configuraciones elegibles; comprobar que ambos no se exponen para nuevas órdenes y que no muestran precio de catálogo numérico.

**Estado:** Confirmado

---

<a id="req-menu-030"></a>

### REQ-MENU-030 — Resolución neta de ingredientes

**Requisito:**
El servicio Menu deberá calcular la lista de ingredientes de una línea de orden a partir de la revisión de receta fijada para cada `MenuItemVariant` PREPARED, del artículo y cantidad de retiro de cada `MenuItemVariant` STOCKED, de la cantidad física `ComboOption.quantity` de cada componente seleccionado de un combo y de las personalizaciones ADD u OMIT seleccionadas en el componente propietario.

**Tipo:** Funcional

**Fuente:** [ADR-003](../../docs/md/Decisiones-cierre-invariantes.md#adr-003)

**Verificación:** Resolver una línea PREPARED, una línea STOCKED y una línea COMBO; comprobar receta y retiro respectivos, multiplicación física por `ComboOption.quantity`, aplicación de OMIT antes de ADD y confinamiento de cada efecto al componente que lo declaró.

**Estado:** Confirmado

---

<a id="req-menu-031"></a>

### REQ-MENU-031 — Revisión de MenuItem

**Requisito:**
El servicio Menu deberá crear una revisión inmutable nueva de un `MenuItem` por cada cambio aceptado de su definición comercial, incluidos cambios de estado administrativo, presentación hoja, referencia de receta, configuración de combo, opción de combo o configuración de modificador.

**Tipo:** Funcional

**Fuente:** [ADR-006 — Versiones de MenuItem y receta](../../docs/md/Decisiones-cierre-invariantes.md#adr-006).

**Verificación:** Cambiar el precio de una presentación hoja, la referencia de receta, una opción de combo y una configuración de modificador; comprobar que cada cambio aceptado crea una revisión nueva de `MenuItem` y que la anterior no cambia. Una actualización derivada solo de disponibilidad no crea una revisión de `MenuItem`.

**Estado:** Confirmado

---

<a id="req-menu-032"></a>

### REQ-MENU-032 — Migración de variante predeterminada

**Requisito:**
El servicio Menu deberá reemplazar, en un `MenuItem` hoja, la `MenuItemVariant` técnica `DEFAULT` por `MenuItemVariant` con valores de presentación explícitos como una sola revisión de `MenuItem`.

**Tipo:** Funcional

**Fuente:** [ADR-008 — Elegibilidad, precio de catálogo y presentación predeterminada](../../docs/md/Decisiones-cierre-invariantes.md#adr-008).

**Verificación:** Intentar migración incompleta y después publicar una válida; no se expone una revisión vendible parcial.

**Estado:** Confirmado

---

<a id="req-menu-033"></a>

### REQ-MENU-033 — Detección de revisión de combo

**Requisito:**
El servicio Menu deberá marcar una `ComboConfiguration` como `REVIEW_REQUIRED` cuando una `ComboOption` configurada —incluida una opción deshabilitada— apunte a una `MenuItemVariant` hoja cuyo cambio no atendido tenga uno o más motivos `PRICE`, `COMPOSITION`, `MODIFIERS` o `STATUS`; deberá ignorar cambios cosméticos, de stock y de variantes no referenciadas, y no deberá generar aviso por una nueva revisión de receta hasta que la variante la adopte explícitamente.

**Tipo:** Funcional

**Fuente:** [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

**Verificación:** Consultar E-20 después de cada caso y comprobar que los motivos anteriores generan `REVIEW_REQUIRED`, mientras que una opción deshabilitada sigue siendo dependiente, los cambios cosméticos/stock/variantes ajenas no generan aviso y una receta nueva solo lo genera después de su adopción por la variante.

**Estado:** Confirmado

---

<a id="req-menu-034"></a>

### REQ-MENU-034 — Visibilidad administrativa de revisión

**Requisito:**
El servicio Menu deberá exponer en E-19 y E-20 las `ComboConfiguration` con estado de revisión `REVIEW_REQUIRED` y un estado agregado por `MenuItem` COMBO; este estado de revisión deberá permanecer separado de `MenuItem.status`, del estado de cada `MenuItemVariant` y de la disponibilidad.

**Tipo:** Funcional

**Fuente:** [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

**Verificación:** Inspeccionar E-19/E-20, comprobar el estado por configuración y el agregado del combo y comprobar que un `MenuItem` no COMBO no recibe estado de revisión de combo.

**Estado:** Confirmado

---

<a id="req-menu-035"></a>

### REQ-MENU-035 — Confirmación de revisión observada

**Requisito:**
El servicio Menu deberá confirmar únicamente los `changeId` identificados por cada `reviewToken` observado enviado junto con el `configurationId` de las `ComboConfiguration` seleccionadas explícitamente en E-21; los cambios posteriores a la observación deberán permanecer pendientes.

**Tipo:** Funcional

**Fuente:** [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

**Verificación:** Confirmar una o varias configuraciones con sus tokens observados, comprobar que el intento “todas” enumera explícitamente las configuraciones mostradas y comprobar que cambios nuevos concurrentes permanecen pendientes.

**Estado:** Confirmado

---

<a id="req-menu-036"></a>

### REQ-MENU-036 — Conservación de configuración revisada

**Requisito:**
El servicio Menu deberá permitir confirmar el `reviewToken` de una `ComboConfiguration` sin modificar su `unitPrice`, sus `ComboSlot`, sus `ComboOption` ni el estado de las opciones retiradas; la confirmación solo registra los cambios observados como atendidos.

**Tipo:** Funcional

**Fuente:** [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

**Verificación:** Confirmar una revisión y comparar antes y después `unitPrice`, slots, opciones y estados; comprobar que no se crea revisión comercial, no se reactiva una opción retirada y que el recibo identifica los `changeId` atendidos.

**Estado:** Confirmado

---

<a id="req-menu-037"></a>

### REQ-MENU-037 — Referencia visual del slot

**Requisito:**
El servicio Menu deberá exponer, para cada `ComboSlot` y sus `baseOptionIds` administrativos, la suma `saved` de los `MenuItemVariant.unitPrice` fijados multiplicados por `ComboOption.quantity`, la suma `current` de esos mismos componentes con sus precios actuales y la diferencia firmada `current - saved`; estos datos serán solo referencia administrativa y no modificarán el precio de venta del combo.

**Tipo:** Funcional

**Fuente:** [ALIGN](../../docs/reviews/ers-interfaces-alignment/decisions.md)

**Verificación:** Consultar E-20 con una selección base de varias opciones, comprobar el uso de `itemVariantId` y `ComboOption.quantity` en `saved` y `current`, verificar `difference = current - saved` y comprobar que `ComboConfiguration.unitPrice` no cambia.

**Estado:** Confirmado

---

<a id="req-menu-038"></a>

### REQ-MENU-038 — Proyección publicada de modificadores efectivos

**Requisito:**
El servicio Menu deberá materializar, para cada `MenuItemVariant` hoja publicada y cada `ModifierOption` aplicable, una `ResolvedVariantModifier` con `enabled`, `priceDelta`, `maxQuantity` e `ingredientEffects`, aplicando la `VariantModifierConfig` cuando exista y `ModifierOption.generalConfig` en caso contrario.

**Tipo:** Funcional

**Fuente:** `docs/md/Auditoria-4.md`, items 14–18 y 21–22.

**Verificación:** Inspección: publicar un item con una opción default y una excepción de variante y comprobar una proyección `ResolvedVariantModifier` por variante/opción con los cuatro campos efectivos y la herencia correcta cuando no existe excepción.

**Estado:** Confirmado

---

<a id="req-menu-039"></a>

### REQ-MENU-039 — Elegibilidad de variante hoja

**Requisito:**
El servicio Menu deberá considerar una MenuItemVariant PREPARED o STOCKED elegible para nuevas ventas únicamente cuando:

- su MenuItem propietario esté ACTIVE;
- la variante esté activa y no ARCHIVED;
- posea una configuración completa y válida para su tipo;
- sus reglas comerciales obligatorias puedan satisfacerse.

La disponibilidad temporal derivada de Inventory no determinará su elegibilidad.

**Tipo:** Funcional

**Fuente:** Decisión de usuario.

**Verificación:** Demostración: mostrar un item con variantes elegibles y no elegibles, comprobar que solo las elegibles se ofrecen para nuevas órdenes y que la disponibilidad temporal no afecta la elegibilidad.

\*Estado:\*\* Confirmado

---

<a id="req-menu-040"></a>

### REQ-MENU-040 — Elegibilidad de configuración de combo

**Requisito:**
El servicio Menu deberá considerar una ComboConfiguration elegible para nuevas ventas únicamente cuando su MenuItem COMBO esté ACTIVE y cada ComboSlot pueda satisfacer su minSelections mediante ComboOption habilitadas que referencien MenuItemVariant hoja elegibles.

**Tipo:** Funcional

**Fuente:** Decisión de usuario.

**Verificación:** Demostración: mostrar un combo con configuraciones elegibles y no elegibles, comprobar que solo las elegibles se ofrecen para nuevas órdenes y que la disponibilidad temporal de los componentes no afecta la elegibilidad.

_Estado:_ Confirmado

---

<a id="req-menu-041"></a>

### REQ-MENU-041 — Disponibilidad operacional

**Requisito:**
El servicio Menu deberá determinar y publicar por separado la disponibilidad operacional de una unidad vendible elegible a partir de las condiciones actuales de Inventory. Un cambio exclusivamente de disponibilidad no deberá cambiar su estado administrativo, su elegibilidad estructural ni generar una nueva revisión comercial del MenuItem.

**Tipo:** Funcional

**Fuente:** Decisión de usuario.

**Verificación:** Demostración: mostrar un item con disponibilidad operacional y sin disponibilidad, comprobar que la elegibilidad estructural no cambia y que no se genera una nueva revisión comercial.

---