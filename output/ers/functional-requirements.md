# Requisitos Funcionales Consolidados

Esta sección establece las obligaciones normativas del servicio Menu derivadas de los 41 requisitos de `Req-F-Aproved.md`, las decisiones de `Auditoria-3.md` y las resoluciones de ownership y arquitectura de `Auditoria-4.md`.

## Definición y Catálogo de MenuItems

### REQ-MENU-ITM-001 — Definición del MenuItem Comercial

- **Obligación:** El servicio Menu deberá crear y registrar un `MenuItem` comercial con nombre, descripción, referencia de imagen, `menuId` propietario, un tipo discriminador (`PREPARED`, `STOCKED` o `COMBO`) y un estado administrativo inicial (`ACTIVE` o `INACTIVE`).
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-001); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 2).
- **Verificación:** Demostración: Registrar un `MenuItem` con cada uno de los tres tipos permitidos y cada estado inicial permitido, verificando la consistencia de los atributos registrados.
- **Trazabilidad:** Vigente.

### REQ-MENU-ITM-002 — Transición de Estado Administrativo

- **Obligación:** El servicio Menu deberá permitir cambiar el estado administrativo de un `MenuItem` entre `ACTIVE` e `INACTIVE` mediante una operación administrativa explícita, así como transicionar un `MenuItem` hacia `ARCHIVED` (archivado reversible) desde `ACTIVE` o `INACTIVE`, y desarchivarlo desde `ARCHIVED` exclusivamente hacia `INACTIVE` (requiriendo una activación explícita posterior para regresar a `ACTIVE`).
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-002); respaldado por `Auditoria-3.md`, `Auditoria-4.md` (Sección 21) y `Consultoria-3.md` (Secciones 1 y 2).
- **Verificación:** Prueba: Ejecutar las transiciones `ACTIVE <-> INACTIVE`, el archivado desde ambos estados hacia `ARCHIVED`, y el desarchivado desde `ARCHIVED` hacia `INACTIVE` constatando que no se reactiva automáticamente.
- **Trazabilidad:** Refinado por `Consultoria-3.md` para consagrar el archivado reversible y desarchivado a `INACTIVE`.

---

## Variantes de Productos Hoja

### REQ-MENU-VAR-001 — Presentación Vendible de Item Hoja (Default Variant)

- **Obligación:** El servicio Menu deberá proveer al menos una `MenuItemVariant` vendible concreta para cada `MenuItem` hoja (`PREPARED` o `STOCKED`) en estado `ACTIVE`. Cuando comercialmente no se expongan opciones de presentación diferenciadas al cliente, el servicio deberá proveer una variante técnica predeterminada (`DEFAULT`), garantizando que en órdenes de venta `variantId != null` sin requerir dimensiones comerciales (`VariantDimension`) ni valores de dimensión. En estado `INACTIVE`, se admite guardar definiciones preliminares sin variantes vendibles con la advertencia correspondiente.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-003); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 3).
- **Verificación:** Prueba: Definir un `MenuItem` PREPARED y uno STOCKED sin variantes comerciales visibles y comprobar que disponen de una presentación vendible concreta con `variantId` no nulo.
- **Trazabilidad:** Vigente.

### REQ-MENU-VAR-002 — Definición de Dimensión de Variante

- **Obligación:** El servicio Menu deberá permitir definir dimensiones de variante con nombre (`VariantDimension`) para un `MenuItem` hoja (ej. _Tamaño_, _Presentación_).
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-004); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 4).
- **Verificación:** Demostración: Definir una característica comercial en un item hoja y verificar su pertenencia exclusiva al `MenuItem` propietario.
- **Trazabilidad:** Vigente.

### REQ-MENU-VAR-003 — Valor de Dimensión de Variante

- **Obligación:** El servicio Menu deberá permitir definir valores con nombre (`VariantValue`, ej. _Chica_, _Mediana_, _Familiar_) dentro de una `VariantDimension` perteneciente a un `MenuItem` hoja.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-023); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 4).
- **Verificación:** Demostración: Registrar valores de dimensión y comprobar que pertenecen a la dimensión y al `MenuItem` correspondiente.
- **Trazabilidad:** Vigente.

### REQ-MENU-VAR-004 — Definición de Variantes Vendibles

- **Obligación:** El servicio Menu deberá permitir definir una `MenuItemVariant` vendible asociándole valores de dimensiones pertenecientes a su `MenuItem` hoja, como máximo un valor por dimensión y sin repetir combinaciones idénticas dentro del mismo item.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-005); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 4).
- **Verificación:** Prueba: Registrar una variante válida e intentar registrar combinaciones duplicadas o valores de dimensiones de otro item, comprobando el rechazo correspondiente.
- **Trazabilidad:** Vigente.

### REQ-MENU-VAR-005 — Migración Atómica de Variante Predeterminada

- **Obligación:** El servicio Menu deberá permitir reemplazar, en un `MenuItem` hoja, la `MenuItemVariant` técnica `DEFAULT` por variantes con valores de presentación explícitos como una única operación y revisión comercial consistente.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-032); respaldado por `Auditoria-3.md`.
- **Verificación:** Prueba: Ejecutar la transición de variante técnica a variantes explícitas verificando que no se exponen estados parciales no vendibles.
- **Trazabilidad:** Vigente.

### REQ-MENU-VAR-006 — Elegibilidad Estructural de Variante Hoja

- **Obligación:** El servicio Menu deberá considerar una `MenuItemVariant` hoja como estructuralmente elegible para nuevas ventas si y solo si su `MenuItem` propietario está `ACTIVE`, la variante está habilitada (`enabled == true`) en su definición vigente, su configuración comercial está completa y sus reglas comerciales obligatorias pueden satisfacerse. La elegibilidad estructural es independiente de las existencias físicas de inventario y del readiness de cocina. Las variantes no poseen estado `ARCHIVED`.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-039); refinado por `Auditoria-4.md` (Secciones 22 y 23) y `Consultoria-3.md` (Secciones 1, 2 y 4).
- **Verificación:** Demostración: Configurar variantes habilitadas y deshabilitadas bajo items activos e inactivos; verificar que solo las variantes habilitadas bajo items activos participan en la oferta y que la falta temporal de stock no altera la elegibilidad.
- **Trazabilidad:** Refinado por `Consultoria-3.md` para sustituir el archivado de variantes por habilitación `enabled: boolean`.

### REQ-MENU-VAR-007 — Habilitación, Deshabilitación y Retiro de Variantes Hoja

- **Obligación:** El servicio Menu deberá permitir habilitar (`enabled = true`) y deshabilitar (`enabled = false`) una `MenuItemVariant` en su definición vigente de manera local e independiente, sin alterar el estado `MenuItem.status` del contenedor. Asimismo, para el retiro de una variante de la definición vigente:
  1. Si la variante nunca ha sido publicada y nunca ha sido referenciada (sin órdenes históricas en Orders + Kitchen, sin referencias de preparación en Kitchen, sin uso en opciones de combo y sin presencia en revisiones anteriores), el servicio admitirá su eliminación física.
  2. Si la variante ya fue publicada o existe cualquier referencia que requiera trazabilidad (incluyendo órdenes históricas en Orders + Kitchen, preparación en Kitchen, uso en combos o revisiones anteriores, como ejemplos no exhaustivos), el servicio impedirá su destrucción física y exigirá su retiro de la definición vigente mediante conservación histórica con `enabled = false`, preservando su identidad para auditoría y trazabilidad.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Consultoria-3.md` (Secciones 1, 2, 4 y 6).
- **Verificación:** Prueba: Habilitar y deshabilitar una variante verificando su reflejo en la elegibilidad; eliminar físicamente una variante nunca publicada ni referenciada; intentar eliminar una variante con referencias históricas (órdenes, Kitchen, combos o revisiones) comprobando el rechazo de destrucción física y ejecutando el retiro de la definición vigente mediante conservación histórica con `enabled = false`.
- **Trazabilidad:** Incorporado formalmente a partir de `Consultoria-3.md`.

---

## Precios Autoritativos y Proyección de Catálogo

### REQ-MENU-PRC-001 — Precio Absoluto Autoritativo de la Variante

- **Obligación:** El servicio Menu deberá permitir asignar un precio unitario de venta absoluto y autoritativo (`unitPrice`) a cada `MenuItemVariant` vendible. No se utilizará un precio base en `MenuItem` como fuente autoritativa de pricing.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-006); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 5).
- **Verificación:** Prueba: Asignar precios distintos a variantes del mismo item y verificar su independencia y carácter absoluto.
- **Trazabilidad:** Vigente.

### REQ-MENU-PRC-002 — Proyección del Precio de Catálogo

- **Obligación:** El servicio Menu deberá derivar y proyectar el precio visible de catálogo para un `MenuItem` a partir de sus unidades vendibles elegibles (`MenuItemVariant.unitPrice` en hojas o `ComboConfiguration.unitPrice` en combos):
  - Proyectar `$X` cuando exista una sola unidad elegible o cuando todas las unidades elegibles tengan el mismo precio.
  - Proyectar `Desde $X` (donde `$X` es el menor precio unitario) cuando existan unidades elegibles con precios distintos.
  - Omitir cualquier precio numérico cuando no existan unidades elegibles.
    La falta de disponibilidad operacional no elimina ni reescribe el `unitPrice` comercial.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-007); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 5).
- **Verificación:** Prueba: Evaluar la proyección de catálogo con variantes de precios idénticos, precios escalonados y sin unidades elegibles; verificar los formatos generados y constatar que la indisponibilidad temporal no altera el precio de catálogo.
- **Trazabilidad:** Vigente.

### REQ-MENU-PRC-003 — Exclusión de Catálogo sin Unidades Elegibles

- **Obligación:** Cuando un `MenuItem` no disponga de ninguna `MenuItemVariant` o `ComboConfiguration` estructuralmente elegible para venta, el servicio Menu deberá excluir dicho item de la oferta pública para nuevas comandas y no deberá exponer ningún precio numérico.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-029); respaldado por `Auditoria-3.md` y `Auditoria-4.md`.
- **Verificación:** Prueba: Deshabilitar todas las variantes (`enabled = false`) de un item hoja o inhabilitar/archivar el item y comprobar que se excluye de nuevas ventas y no muestra precio numérico.
- **Trazabilidad:** Vigente.

---

## Grupos y Opciones de Modificadores Comerciales

### REQ-MENU-MOD-001 — Definición de Grupos de Modificadores en el Item Hoja

- **Obligación:** El servicio Menu deberá permitir definir grupos de modificadores (`ModifierGroup`) directamente en un `MenuItem` hoja (`PREPARED` o `STOCKED`). El grupo es propiedad del item hoja y compartido por todas sus variantes, definiendo los límites enteros $0 <= \text{minSelections} <= \text{maxSelections}$. El concepto de grupo de modificadores pertenece al modelo de items hoja y está ausente del modelo de `COMBO`.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-013); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 9).
- **Verificación:** Demostración: Registrar un `ModifierGroup` en un item hoja con sus límites enteros de selección; verificar su disponibilidad en todas sus variantes y constatar su ausencia de la estructura de combos.
- **Trazabilidad:** Vigente.

### REQ-MENU-MOD-002 — Opciones de Modificador y Configuración General Comercial

- **Obligación:** El servicio Menu deberá permitir definir opciones de modificador (`ModifierOption`) dentro de un `ModifierGroup` con nombre y una estructura anidada de configuración comercial general (`generalConfig`) que contiene el delta de precio (`priceDelta`) y el límite de cantidad máxima (`maxQuantity`), sin exponer dichos atributos como campos planos directos de `ModifierOption`. La configuración comercial de Menu no incluye recetas, ingredientes, gramajes ni efectos sobre insumos físicos.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-014); refinado por `Auditoria-4.md` (Secciones 9 y 11).
- **Verificación:** Demostración: Definir una opción comercial con su ajuste de precio y límite de cantidad anidados en `generalConfig`; comprobar que el modelo de Menu almacena exclusivamente atributos comerciales sin directivas de insumos.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para excluir efectos sobre ingredientes de la responsabilidad de Menu.

### REQ-MENU-MOD-003 — Especialización Comercial de Modificador por Variante (VariantModifierConfig)

- **Obligación:** Cuando el comportamiento comercial de una `ModifierOption` deba diferir en una variante específica respecto a la configuración general, el servicio Menu deberá permitir registrar una `VariantModifierConfig` asociada a la tupla `(variantId, modifierOptionId)` que contiene de forma plana `variantId`, `modifierOptionId`, `enabled`, `priceDelta` y `maxQuantity`. Para variantes sin configuración específica, regirá plenamente `generalConfig`.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-015); refinado por `Auditoria-4.md` (Sección 10).
- **Verificación:** Prueba: Registrar una opción con configuración general y una excepción comercial por variante; verificar que las variantes sin excepción aplican la configuración general y la variante especializada aplica sus propios valores comerciales.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para circunscribir la especialización a datos comerciales.

### REQ-MENU-MOD-004 — Copia Administrativa de Configuraciones de Modificadores

- **Obligación:** El servicio Menu deberá permitir copiar excepciones comerciales de modificadores (`VariantModifierConfig`) desde una `MenuItemVariant` hoja origen hacia una o más variantes hoja destino del mismo `MenuItem`, aplicando de forma atómica la política de resolución de conflictos seleccionada (`FAIL` o `REPLACE`).
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-016); refinado por `Auditoria-4.md` (Sección 10).
- **Verificación:** Prueba: Copiar configuraciones comerciales entre variantes del mismo item y verificar la atomicidad y aplicación de la política de conflicto sin involucrar información de insumos.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para excluir efectos sobre ingredientes y detalles no confirmados.

### REQ-MENU-MOD-005 — Proyección de Modificadores Efectivos Comerciales (ResolvedVariantModifier)

- **Obligación:** El servicio Menu deberá materializar para cada `MenuItemVariant` publicada y cada `ModifierOption` aplicable una proyección de lectura comercial efectiva `ResolvedVariantModifier` que contenga de forma plana y exclusiva: `variantId`, `modifierOptionId`, `enabled`, `priceDelta` y `maxQuantity`, resolviendo la especialización de `VariantModifierConfig` cuando exista o recurriendo a los valores anidados en `generalConfig` en su defecto. Esta proyección es estrictamente comercial; no incluye disponibilidad operacional, límites operativos disponibles (`availableMaxQuantity`) ni efectos físicos de preparación e ingredientes, representándose los datos operacionales únicamente a través de `ModifierAvailability` y en Orders + Kitchen.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-038); refinado por `Auditoria-4.md` (Sección 12).
- **Verificación:** Inspección: Publicar un item con una opción general y una excepción por variante; constatar que la proyección resuelta contiene exclusivamente los valores comerciales efectivos sin campos de disponibilidad operacional ni de insumos o recetas.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para desacoplar la proyección comercial de efectos culinarios y de disponibilidad física.

---

## Combos, Configuraciones, Slots y Opciones

### REQ-MENU-COM-001 — Configuración de Combo (ComboConfiguration)

- **Obligación:** El servicio Menu deberá permitir definir una o más `ComboConfiguration` para un `MenuItem` de tipo `COMBO` en estado `ACTIVE`, cada una con nombre, precio unitario absoluto autoritativo (`unitPrice`), bandera `enabled: boolean` y uno o más `ComboSlot`. En estado `INACTIVE`, se permite guardar definiciones con capacidad incompleta conforme a REQ-MENU-LIF-002. `ComboConfiguration` no posee estado administrativo de ciclo de vida propio ni estado `ARCHIVED`.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-010); respaldado por `Auditoria-3.md`, `Auditoria-4.md` (Sección 13.1) y `Consultoria-3.md`.
- **Verificación:** Demostración: Definir un combo con configuraciones vendibles de precios absolutos propios; verificar su registro en el catálogo.
- **Trazabilidad:** Vigente.

### REQ-MENU-COM-002 — Definición del Espacio de Selección (ComboSlot)

- **Obligación:** El servicio Menu deberá permitir configurar cada `ComboSlot` con nombre, bandera `enabled: boolean` y los límites enteros `minSelections` y `maxSelections` de opciones que el cliente puede seleccionar, cumpliendo estrictamente $0 <= \text{minSelections} <= \text{maxSelections}$.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-011); respaldado por `Auditoria-3.md` y `Auditoria-4.md` (Sección 13.2).
- **Verificación:** Demostración: Configurar un slot con nombre y límites enteros; comprobar que se validan los límites y se aceptan definiciones incompletas mientras el combo permanezca `INACTIVE`.
- **Trazabilidad:** Vigente.

### REQ-MENU-COM-003 — Opciones de Combo Vinculadas Directamente a la Variante Hoja

- **Obligación:** El servicio Menu deberá permitir agregar a un `ComboSlot` opciones (`ComboOption`) que apunten directamente a una `MenuItemVariant` hoja concreta (`itemVariantId`), con una cantidad entera positiva de unidades físicas completas (`quantity >= 1`), un ajuste de precio (`priceDelta`) y una bandera `enabled: boolean`. No se admiten coeficientes fraccionarios inferidos en combos; presentaciones fraccionadas diferenciadas deben modelarse como variantes hoja independientes.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-012); respaldado por `Auditoria-3.md`, `Auditoria-4.md` (Secciones 13.2 y 16) y `Consultoria-3.md`.
- **Verificación:** Prueba: Asociar opciones a slots apuntando directamente a variantes hoja con cantidades enteras positivas, deltas de precio explícitos y bandera de habilitación; verificar su persistencia y rechazo de cantidades fraccionarias.
- **Trazabilidad:** Vigente.

### REQ-MENU-COM-004 — Copia Administrativa de Configuración de Combo

- **Obligación:** El servicio Menu deberá permitir copiar configuraciones de combo cumpliendo las siguientes reglas:
  1. Al clonar una `ComboConfiguration` completa, sus slots y opciones se crean con nuevas identidades independientes.
  2. Al copiar hacia una `ComboConfiguration` destino existente, la solicitud deberá proporcionar un mapeo explícito de slots (`sourceSlotId -> targetSlotId`) o directiva explícita de creación de nuevo slot.
  3. Queda estrictamente excluido el emparejamiento automático o matching heurístico por nombre o posición.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-024); refinado por `Auditoria-4.md` (Sección 37).
- **Verificación:** Prueba: Ejecutar clonación verificando asignación de nuevas identidades; ejecutar copia a configuración existente con mapeo explícito comprobando correspondencia unívoca; verificar rechazo ante ausencia de mapeo explícito.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para excluir matching heurístico y simplificar requisitos de copia.

### REQ-MENU-COM-005 — Asignación Múltiple de Opciones de Combo con Atomicidad por Destino

- **Obligación:** El servicio Menu deberá permitir aplicar operaciones de copia de opciones de combo hacia múltiples configuraciones destino en un único lote administrativo. La solicitud deberá exigir, por cada configuración destino del lote, su identificador explícito (`targetConfigurationId`) y el mapeo explícito de ranuras `sourceSlotId -> targetSlotId` o la directiva explícita de creación de nuevo slot en el destino. Se deberán rechazar solicitudes con datos omitidos, ambiguos o incompletos, y queda estrictamente prohibida cualquier heurística basada en coincidencia de nombres, orden o posición ordinal, o semántica inferida. Cada `ComboConfiguration` destino constituirá una unidad atómica independiente (se aplica íntegramente o se rechaza por completo), admitiendo éxito parcial entre destinos independientes del lote.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-025); refinado por `Auditoria-4.md` (Sección 37).
- **Verificación:** Prueba: Enviar un lote hacia múltiples configuraciones destino donde cada una especifica su identificador y mapeo explícito `sourceSlotId -> targetSlotId` o directiva de creación; verificar el rechazo inmediato ante omisión de identificadores, mapeos ambiguos o intentos de inferencia por nombre/posición; verificar en un lote mixto con un destino válido y otro con colisión o error que el válido se aplica íntegramente y el erróneo se rechaza sin escrituras parciales (éxito parcial entre destinos).
- **Trazabilidad:** Refinado por `Auditoria-4.md` para consagrar la exigencia de IDs y mapeos explícitos por destino sin heurísticas, junto con atomicidad por destino y éxito parcial (`BR-MENU-026`, `BR-MENU-027`, `BR-MENU-028`).

### REQ-MENU-COM-006 — Elegibilidad Estructural de Configuración de Combo

- **Obligación:** El servicio Menu deberá considerar una `ComboConfiguration` como estructuralmente elegible para nuevas ventas si y solo si su `MenuItem` COMBO está `ACTIVE`, la configuración tiene `enabled == true` y cada uno de sus `ComboSlot` obligatorios habilitados (`enabled == true` y `minSelections > 0`) puede satisfacer `minSelections` mediante `ComboOption` habilitadas (`enabled == true`) que referencien `MenuItemVariant` hoja elegibles. Los slots deshabilitados (`enabled == false`) quedan excluidos de la evaluación activa. La disponibilidad de inventario no determina la elegibilidad estructural.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-040); refinado por `Auditoria-4.md` (Secciones 22 y 26) y `Consultoria-3.md` (Secciones 2, 4 y 5).
- **Verificación:** Demostración: Configurar combos con variantes componentes elegibles e inelegibles y con slots habilitados y deshabilitados; comprobar que la configuración pasa a no elegible cuando no puede alcanzar `minSelections` con componentes elegibles en sus slots habilitados, con total independencia del stock.
- **Trazabilidad:** Refinado por `Consultoria-3.md`.

### REQ-MENU-COM-007 — Habilitación Local y Retiro de Componentes de Combo

- **Obligación:** El servicio Menu deberá permitir habilitar (`enabled = true`) y deshabilitar (`enabled = false`) de manera local y granular los componentes internos de un combo:
  1. Una `ComboConfiguration` completa, retirándola de la oferta activa sin modificar el estado `MenuItem.status` del contenedor.
  2. Un `ComboSlot`, excluyéndolo de la definición activa del combo.
  3. Una `ComboOption`, impidiendo su selección en el slot.
     Asimismo, para el retiro de la definición vigente de cualquiera de estos componentes (`ComboConfiguration`, `ComboSlot`, `ComboOption`), al igual que en `MenuItemVariant`:
  - Si el componente nunca ha sido publicado y nunca ha sido referenciado, el servicio admitirá su eliminación física.
  - Si el componente ya fue publicado o existe cualquier referencia que requiera trazabilidad (tales como órdenes históricas en Orders + Kitchen, preparación en Kitchen, utilización en combos o presencia en revisiones anteriores, como ejemplos no exhaustivos), el servicio impedirá su destrucción física y exigirá su retiro de la definición vigente mediante conservación histórica con `enabled = false`, preservando su identidad.
    Deshabilitar una `ComboOption` no desactiva automáticamente el `MenuItem` COMBO contenedor mientras exista una configuración válida. No se impondrá una transición incondicional a `REVIEW_REQUIRED` por cualquier deshabilitación o retiro de componentes, preservando las reglas de revisión independientes respaldadas en otras secciones.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Consultoria-3.md` (Secciones 2, 4, 6, 7 y 8).
- **Verificación:** Prueba: Habilitar, deshabilitar y retirar componentes de combo; comprobar que componentes nunca publicados ni referenciados admiten eliminación física; constatar que componentes con referencias de trazabilidad conservan su identidad mediante `enabled = false` impidiendo destrucción física; verificar que operan localmente, excluyen el componente de la evaluación de elegibilidad y disponibilidad, constatar que deshabilitar una `ComboOption` no desactiva automáticamente el `MenuItem` COMBO mientras exista una configuración válida, y verificar que no se impone una transición incondicional a `REVIEW_REQUIRED`.
- **Trazabilidad:** Incorporado formalmente a partir de `Consultoria-3.md`.

---

## Ciclo de Vida, Archivado y Reglas Incompletas

### REQ-MENU-LIF-001 — Archivado Reversible de MenuItem y Reevaluación No Obstructiva de Dependencias

- **Obligación:** El servicio Menu deberá permitir archivar un `MenuItem` comercial (`status = ARCHIVED`) de manera reversible desde un estado vigente (`ACTIVE` o `INACTIVE`). El archivado aplica a la entidad raíz `MenuItem` (productos hoja y combos) y es el único estado de archivado del catálogo comercial. El item archivado deja de ser elegible para nuevas ventas y se conserva inmutable para fines históricos y de auditoría. El archivado es reversible: una operación administrativa explícita de desarchivado produce obligatoriamente `INACTIVE`, y una activación posterior hacia `ACTIVE` requiere una operación explícita que revalide conjuntamente elegibilidad estructural, dependencias y preparación (manteniendo preparación y readiness bajo la autoridad exclusiva de Orders + Kitchen) antes de ofrecer el artículo para nuevas ventas.
  Cuando se archive un `MenuItem` hoja:
  1. Todas sus variantes dejan de ser elegibles para nuevas ventas.
  2. Las `ComboOption` que referencien variantes de dicho item dejan de ser elegibles.
  3. Se reevalúan automáticamente las `ComboConfiguration` dependientes.
  4. Si una configuración dependiente ya no puede satisfacer el `minSelections` de alguno de sus slots habilitados mediante opciones elegibles, dicha configuración se marca como no elegible y su estado de revisión se actualiza a `REVIEW_REQUIRED`.
  5. El estado administrativo (`MenuItem.status`) del combo dependiente **no cambia automáticamente** ni se bloquea el archivado del item hoja por existir dependencias activas.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Auditoria-3.md`, `Auditoria-4.md` (Sección 36) y `Consultoria-3.md` (Secciones 1, 2, 3 y 4); modifica la restricción de rechazo previo de `Req-F-Aproved.md` (REQ-MENU-026) y ADR-005.
- **Verificación:** Prueba: Archivar un item hoja utilizado por un combo activo; comprobar que el archivado se ejecuta exitosamente, sus opciones quedan no elegibles, la configuración se marca `REVIEW_REQUIRED` si no alcanza mínimos y `MenuItem.status` del combo permanece inalterado; desarchivar el item y constatar que su estado pasa a `INACTIVE`, requiriendo revalidar elegibilidad, dependencias y preparación antes de su reactivación a `ACTIVE`.
- **Trazabilidad:** Refinado por `Consultoria-3.md` para consagrar el archivado reversible y desarchivado a `INACTIVE`.

### REQ-MENU-LIF-002 — Guardado de Definiciones Incompletas en Contexto Inactivo

- **Obligación:** El servicio Menu deberá permitir guardar una definición incompleta cuando el contexto que contiene la regla esté en estado `INACTIVE` (`MenuItem.status == INACTIVE`): para un `ModifierGroup`, cuando su `MenuItem` hoja contenedor esté `INACTIVE`; para un `ComboSlot`, cuando el `MenuItem` COMBO contenedor esté `INACTIVE`. Las restricciones de capacidad mínima y de presencia de unidades vendibles aplican únicamente como condición obligatoria para la activación comercial en `ACTIVE`, permitiendo en `INACTIVE` definiciones parciales o con capacidad insuficiente acompañadas de advertencias identificables, sin imponer mínimos incondicionales incompatibles.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-027); respaldado por `Auditoria-3.md`, `Auditoria-4.md` y ADR-005.
- **Verificación:** Prueba: Guardar items hoja o combos en `INACTIVE` con capacidad menor a `minSelections`; verificar que se guardan exitosamente con advertencia y se bloquea su activación comercial.
- **Trazabilidad:** Vigente.

### REQ-MENU-LIF-003 — Advertencias de Capacidad Faltante

- **Obligación:** El servicio Menu deberá incluir, al guardar un `MenuItem` en estado `INACTIVE` con capacidad insuficiente, una advertencia estructurada que identifique la entidad afectada (`ModifierGroup` o `ComboSlot`), el valor de `minSelections` y la capacidad calculada correspondiente.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-028); respaldado por ADR-005 y `Consultoria-3.md`.
- **Verificación:** Inspección: Comprobar que la advertencia incluye la identidad de la entidad, el tipo, `minSelections` y la capacidad calculada.
- **Trazabilidad:** Vigente.

### REQ-MENU-LIF-004 — Eliminación Definitiva Restringida de MenuItem

- **Obligación:** El servicio Menu deberá permitir la eliminación física o definitiva de un `MenuItem` **únicamente** bajo el cumplimiento estricto del predicado canónico: que el `MenuItem` se encuentre previamente en estado `ARCHIVED` y exista ausencia total de dependencias, de referencias históricas necesarias para trazabilidad (tales como órdenes de venta pasadas en Orders + Kitchen, preparación en Kitchen, uso en combos o revisiones anteriores, como ejemplos no exhaustivos) y de restricciones de retención (legales, fiscales, contables u operativas). El sistema deberá impedir y bloquear la eliminación física si no se cumple alguna de estas condiciones copulativas.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Consultoria-3.md` (Secciones 1, 3 y 4).
- **Verificación:** Prueba: Intentar eliminar un `MenuItem` en `ACTIVE` o `INACTIVE` (comprobar rechazo); intentar eliminar un `MenuItem` en `ARCHIVED` ante la presencia de dependencias, referencias históricas para trazabilidad o restricciones de retención (comprobar bloqueo); eliminar un `MenuItem` en `ARCHIVED` ante ausencia total de dependencias, referencias históricas y restricciones de retención, y verificar la eliminación definitiva exitosa.
- **Trazabilidad:** Incorporado formalmente a partir de `Consultoria-3.md`.

---

## Versionado Inmutable de Definiciones Comerciales

### REQ-MENU-VER-001 — Generación de Revisión Inmutable de MenuItem

- **Obligación:** El servicio Menu deberá crear una nueva revisión inmutable independiente de un `MenuItem` ante cualquier modificación aceptada en su definición comercial (nombre, descripción, estado administrativo, variantes, precios, modificadores o combos), bajo el formato `<number>_<ISO8601>`. Las fluctuaciones operacionales de disponibilidad de inventario **no** crearán versiones comerciales de `MenuItem`.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-031); refinado por `Auditoria-4.md` (Secciones 6, 31, 35).
- **Verificación:** Prueba: Modificar el precio de una variante y verificar incremento de revisión; simular cambios de disponibilidad operacional y comprobar que no se incrementa la versión comercial.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para excluir recetas y vincular exclusivamente a definiciones comerciales.

---

## Detección, Gestión y Seguimiento de Revisiones

### REQ-MENU-REV-001 — Detección de Necesidad de Revisión (REVIEW_REQUIRED) por Cambios Comerciales y Culinarios

- **Obligación:** El servicio Menu deberá gestionar el estado de revisión lógica (`reviewStatus`) y representar lógicamente las causas pendientes de revisión distinguiendo con precisión los dos targets aplicables:
  1. **`MenuItemVariant` (Target inicial de revisión culinaria):** Menu marcará la `MenuItemVariant` en `REVIEW_REQUIRED` y registrará una causa lógica de revisión culinaria (`CULINARY`) cuando Orders + Kitchen notifique una alteración en la preparación (e.g., alteraciones de receta o composición técnica, referidas de forma ilustrativa como `RecipeChanged` o `IngredientEffectChanged`), conservando la identidad del cambio (`changeId`) y el motivo (`COMPOSITION` o `STATUS`). Una nueva revisión de receta no producirá aviso de revisión en Menu hasta que la `MenuItemVariant` la adopte explícitamente.
  2. **`ComboConfiguration` (Target de revisión comercial o culinaria propagada):** Menu marcará una `ComboConfiguration` como `REVIEW_REQUIRED` cuando una `ComboOption` configurada —incluida una opción deshabilitada que continúa siendo dependencia configurada— apunte a una `MenuItemVariant` hoja cuyo cambio no atendido presente causas con uno o más motivos `PRICE`, `COMPOSITION`, `MODIFIERS` o `STATUS`, o cuando se propague una causa culinaria desde la variante hacia el combo dependiente.
     En ambos targets, los cambios cosméticos, los cambios en variantes no referenciadas y las fluctuaciones operacionales de disponibilidad no generarán estado de revisión. Una revisión pendiente no bloqueará automáticamente la disponibilidad operacional para venta.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-033); refinado por `Auditoria-4.md` (Secciones 30, 31, 34, 35).
- **Verificación:** Prueba: Modificar precio de una variante componente y comprobar que el combo pasa a `REVIEW_REQUIRED`, incluso si la `ComboOption` que la referencia está deshabilitada; verificar que una nueva revisión de receta no produce aviso hasta que la `MenuItemVariant` la adopte explícitamente; simular aviso de cambio culinario desde Kitchen y verificar que la variante y sus combos dependientes reflejan revisión; simular cambios de stock, cambios cosméticos o modificaciones en variantes no referenciadas y comprobar ausencia de aviso.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para distinguir causas comerciales y culinarias, formalizar la representación lógica de causas pendientes, declarar que una `ComboOption` configurada continúa siendo dependencia aunque esté deshabilitada y establecer que una nueva revisión de receta no produce aviso hasta que la `MenuItemVariant` la adopte explícitamente (`BR-MENU-031`).

### REQ-MENU-REV-002 — Visibilidad Administrativa del Estado de Revisión

- **Obligación:** El servicio Menu deberá exponer en sus interfaces y vistas administrativas el estado de revisión (`reviewStatus`) y el desglose lógico de causas pendientes para los dos targets aplicables:
  1. Las `MenuItemVariant` en estado `REVIEW_REQUIRED` con indicación de las causas culinarias notificadas (`changeId`, motivo `COMPOSITION` o `STATUS`).
  2. Las `ComboConfiguration` en estado `REVIEW_REQUIRED` junto con un estado agregado por `MenuItem` COMBO y el detalle de causas comerciales y culinarias propagadas con sus motivos de discrepancia (`PRICE`, `COMPOSITION`, `MODIFIERS`, `STATUS`).
     Este estado de revisión y sus causas permanecerán estrictamente separados de `MenuItem.status`, de los estados de ciclo de vida de las variantes y de la disponibilidad operacional momentánea.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-034); respaldado por `Auditoria-4.md` (Sección 34).
- **Verificación:** Inspección: Consultar las vistas administrativas y constatar visibilidad de revisiones por configuración y combo agregado con detalle de motivos, sin alteración de estados comerciales.
- **Trazabilidad:** Vigente.

### REQ-MENU-REV-003 — Seguimiento Desacoplado Mediante observedRevision y acknowledgedRevision

- **Obligación:** El servicio Menu deberá implementar un mecanismo lógico coherente de seguimiento de revisiones para los dos targets aplicables (`MenuItemVariant` y `ComboConfiguration`), sustentado en los atributos `observedRevision`, `acknowledgedRevision` y causas pendientes:
  1. Al producirse un cambio no atendido relevante, Menu incrementa `observedRevision`, asocia la causa lógica correspondiente y deriva la condición `reviewStatus = REVIEW_REQUIRED` dado que `observedRevision > acknowledgedRevision`.
  2. Al confirmar administrativamente la revisión de una `MenuItemVariant` o `ComboConfiguration` seleccionada explícitamente en base a su versión observada, Menu actualiza `acknowledgedRevision = observedRevision`, liquidando las causas atendidas y restableciendo `reviewStatus = UP_TO_DATE`.
  3. Los cambios posteriores que incrementen `observedRevision` permanecerán pendientes con sus respectivas causas sin que la confirmación previa los suprima accidentalmente. Este mecanismo opera de manera independiente y desacoplada de `commercialRevision` (contador de versión del catálogo) y sin inventar esquemas físicos.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-035); refinado por `Auditoria-4.md` (Sección 33).
- **Verificación:** Prueba: Con `observedRevision = 8` y `acknowledgedRevision = 7` (`REVIEW_REQUIRED`), confirmar la revisión (`acknowledgedRevision = 8`); simular un nuevo cambio concurrente con `observedRevision = 9` y constatar que el estado vuelve automáticamente a `REVIEW_REQUIRED`.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para implementar el seguimiento desacoplado observed/acknowledged con causas estructuradas.

### REQ-MENU-REV-004 — Conservación de la Configuración Comercial al Confirmar Revisión

- **Obligación:** El servicio Menu deberá permitir confirmar administrativamente la revisión de una `ComboConfiguration` sin modificar su `unitPrice`, sus slots ni sus opciones; la confirmación únicamente registra los cambios observados como atendidos sin generar revisión comercial del item.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-036); respaldado por `Auditoria-4.md` (Sección 33).
- **Verificación:** Prueba: Confirmar una revisión observada y constatar que precios, slots y opciones se conservan intactos.
- **Trazabilidad:** Vigente.

### REQ-MENU-REV-005 — Referencia Visual del Slot (Precios Informativos)

- **Obligación:** Para cada `ComboSlot` y sus opciones base (`baseOptionIds`), el servicio Menu deberá exponer con carácter estrictamente informativo de referencia administrativa:
  - `saved`: suma de los precios fijados guardados de las variantes base multiplicados por `ComboOption.quantity` ($\sum \text{savedUnitPrice} \times \text{quantity}$).
  - `current`: suma de los precios actuales de esas mismas variantes base multiplicados por `ComboOption.quantity` ($\sum \text{currentUnitPrice} \times \text{quantity}$).
  - `difference`: cálculo firmado de la diferencia, $\text{difference} = \text{current} - \text{saved}$.
    Estos tres valores son exclusivamente de referencia visual informativa y no alteran ni modifican el precio de venta unitario del combo (`ComboConfiguration.unitPrice`).
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-037); respaldado por `Auditoria-4.md`.
- **Verificación:** Consulta: Verificar el cálculo informativo `saved`, `current` y `difference` en la administración de slots con `baseOptionIds` y multiplicación por `quantity`, sin alteración de `unitPrice`.
- **Trazabilidad:** Vigente.

### REQ-MENU-REV-006 — No Disparación de Revisión por Disponibilidad Operacional

- **Obligación:** El servicio Menu deberá garantizar que las fluctuaciones operacionales de disponibilidad comunicadas por Orders + Kitchen no generen revisiones comerciales ni culinarias (`AvailabilityChanged != REVIEW_REQUIRED`). La disminución o agotamiento momentáneo de stock no marcará entidades comerciales en estado de revisión pendiente.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Auditoria-4.md` (Sección 35).
- **Verificación:** Prueba: Simular transiciones de disponibilidad de variantes y modificadores de disponible a no disponible; constatar que `reviewStatus` permanece inalterado en `UP_TO_DATE`.
- **Trazabilidad:** Incorporado formalmente a partir de `Auditoria-4.md`.

---

## Publicación, Proyecciones, Readiness y Disponibilidad

### REQ-MENU-AVL-001 — Publicación Conceptual y Notificación de Catálogo

- **Obligación:** El servicio Menu deberá exponer su catálogo comercial hacia POS y otros canales de venta autorizados, y emitir notificaciones conceptuales ante cambios comerciales efectivos en la definición del menú (precios, estructura de variantes/combos o estados administrativos) para permitir el refresco de las proyecciones de catálogo en dichos consumidores.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-022); refinado por `Auditoria-4.md` (Secciones 28 y 39).
- **Verificación:** Demostración: Ejecutar cambios comerciales y constatar la emisión de la notificación conceptual de cambio para la sincronización de las proyecciones de catálogo en POS y otros consumidores autorizados.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para documentar la notificación como familia conceptual.

### REQ-MENU-AVL-002 — Recepción y Proyección de Disponibilidad Operacional Desacoplada

- **Obligación:** El servicio Menu deberá reflejar la disponibilidad operacional a partir de las evaluaciones y notificaciones publicadas por Orders + Kitchen pertenecientes a la familia conceptual de cambios de disponibilidad operacional (ilustradas de manera no normativa en Auditoria-4.md bajo nombres como `VariantAvailabilityChanged` y `ModifierAvailabilityChanged`). Menu **no calculará físicamente la disponibilidad** a partir de recetas ni interactuará directamente con Inventory. Un cambio de disponibilidad operacional no alterará el estado administrativo (`status`), la elegibilidad estructural ni el precio comercial (`unitPrice`), y no generará una nueva versión comercial inmutable de `MenuItem`.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Req-F-Aproved.md` (REQ-MENU-041); refinado por `Auditoria-4.md` (Secciones 24 y 25).
- **Verificación:** Demostración: Recibir actualización de disponibilidad desde Kitchen; comprobar que Menu proyecta la señal operacional localmente mientras que `status`, elegibilidad, precio y versión comercial se mantienen inalterados.
- **Trazabilidad:** Refinado por `Auditoria-4.md` para trasladar el cálculo a Orders + Kitchen y definir la proyección en Menu.

### REQ-MENU-AVL-003 — Recepción y Proyección de Readiness de Preparación (PreparationStatus)

- **Obligación:** El servicio Menu deberá recibir y proyectar como proyección independiente la señal operacional de readiness de preparación perteneciente a la familia conceptual de readiness culinario (`status = READY | INCOMPLETE`) suministrada por Orders + Kitchen mediante el contrato de proyecciones de catálogo pendiente en `OPEN-007`. Esta señal indica exclusivamente el readiness operacional de Kitchen, definiéndose `INCOMPLETE` únicamente por readiness operacional inválido o incompleto informado por Orders + Kitchen y excluyendo explícitamente `reviewStatus` y cualquier causa o revisión administrativa. Cuando la variante requiera preparación (`PREPARED`), el estado `INCOMPLETE` impedirá su disponibilidad operacional para venta (`available = false`). `reviewStatus` y sus causas de revisión permanecerán estrictamente independientes y una revisión pendiente no bloqueará la disponibilidad operacional ni la venta.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Auditoria-4.md` (Sección 23).
- **Verificación:** Demostración: Recibir mediante el contrato de proyecciones de catálogo una actualización de `PreparationStatus` con estado `INCOMPLETE` para una variante estructuralmente elegible; verificar que Menu mantiene elegibilidad en `true` y proyecta disponibilidad en `false` para venta, constatando que el readiness no altera `reviewStatus`.
- **Trazabilidad:** Incorporado formalmente a partir de `Auditoria-4.md`.

### REQ-MENU-AVL-004 — Proyección de Disponibilidad Granular de Variante (VariantAvailability)

- **Obligación:** El servicio Menu deberá mantener una proyección local `VariantAvailability(variantId, available)` alimentada por señales del contrato de proyecciones de catálogo de Orders + Kitchen, de forma desacoplada de `PreparationStatus` y de la disponibilidad agregada de catálogo. Para variantes que requieren preparación, el readiness `INCOMPLETE` de Kitchen impedirá que la variante se proyecte como disponible para venta. La indisponibilidad de personalizaciones opcionales no volverá no disponible a la variante; sin embargo, si Kitchen reporta que un grupo obligatorio no puede satisfacerse, la variante se reflejará como no disponible (`available = false`). Una revisión pendiente (`reviewStatus = REVIEW_REQUIRED`) no bloqueará la disponibilidad operacional ni la venta.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Auditoria-4.md` (Secciones 24 y 25).
- **Verificación:** Prueba: Consultar la disponibilidad proyectada de una variante y verificar que coincide con la última señal reportada por Kitchen, comprobando que una revisión pendiente no bloquea la disponibilidad.
- **Trazabilidad:** Incorporado formalmente a partir de `Auditoria-4.md`.

### REQ-MENU-AVL-005 — Proyección de Disponibilidad de Modificadores (ModifierAvailability)

- **Obligación:** El servicio Menu deberá mantener una proyección local `ModifierAvailability(variantId, modifierOptionId, available, availableMaxQuantity)` a partir de las señales del contrato de proyecciones de catálogo suministradas por Orders + Kitchen. Un modificador opcional sin disponibilidad (`available = false`) **no bloqueará** la variante vendible.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Auditoria-4.md` (Sección 25).
- **Verificación:** Prueba: Simular indisponibilidad de un modificador puramente opcional; verificar que la opción se proyecta como no disponible mientras la variante permanece disponible.
- **Trazabilidad:** Incorporado formalmente a partir de `Auditoria-4.md`.

### REQ-MENU-AVL-006 — Propagación de Disponibilidad a Opciones, Slots y Configuraciones de Combo (ComboConfigurationAvailability)

- **Obligación:** El servicio Menu deberá propagar la disponibilidad operacional de variantes hacia sus composiciones comerciales evaluando exclusivamente componentes habilitados:
  1. Cada `ComboOption` hereda la señal de disponibilidad de la variante referenciada (`ComboOption.available = VariantAvailability.available`), requiriendo que la variante cuente con insumos y, si requiere preparación, `PreparationStatus == READY`.
  2. La capacidad disponible de un slot (`ComboSlot.availableCapacity`) es el conteo de opciones seleccionables en slots habilitados (`ComboSlot.enabled == true`). Cada opción seleccionable (habilitada con `ComboOption.enabled == true`, con variante elegible y disponible) aporta a lo sumo 1 selección independientemente de `quantity`.
  3. Los slots deshabilitados (`ComboSlot.enabled == false`) quedan excluidos de la definición activa del combo y no penalizan la disponibilidad de la configuración.
  4. Una `ComboOption` no disponible no bloquea el combo mientras el slot conserve `availableCapacity >= minSelections`.
  5. Una `ComboConfiguration` queda no disponible (`ComboConfigurationAvailability.available = false`) cuando alguno de sus slots obligatorios habilitados no puede satisfacer `minSelections`.
  6. Una revisión pendiente (`REVIEW_REQUIRED`) en una variante componente o en la propia configuración no bloquea automáticamente la disponibilidad del combo.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Auditoria-4.md` (Sección 26) y `Consultoria-3.md` (Secciones 2 y 5).
- **Verificación:** Prueba: En un combo con slot de 2 opciones disponibles y mínimo 1, simular indisponibilidad de una opción; constatar que la configuración de combo continúa disponible. Deshabilitar un slot secundario y comprobar que se excluye del cálculo sin afectar la disponibilidad. Comprobar que marcar la configuración en `REVIEW_REQUIRED` no altera su disponibilidad operacional.
- **Trazabilidad:** Refinado por `Consultoria-3.md`.

### REQ-MENU-AVL-007 — Derivación de Disponibilidad Agregada de MenuItem para Catálogo

- **Obligación:** El servicio Menu deberá derivar la señal agregada `CatalogItemProjection.isAvailable` para presentación visual en catálogo: un item hoja estará disponible si al menos una variante elegible está disponible; un combo estará disponible si al menos una configuración elegible está disponible. Esta señal es exclusiva para catálogo y no es fuente autoritativa individual.
- **Tipo:** Funcional.
- **Fuente Autorizada:** `Auditoria-4.md` (Sección 26).
- **Verificación:** Prueba: Consultar un item con una variante disponible y una agotada; comprobar que el catálogo expone `isAvailable = true`.
- **Trazabilidad:** Incorporado formalmente a partir de `Auditoria-4.md`.
