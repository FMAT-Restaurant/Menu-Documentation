# Configuración de la Especificación Consolidada

**Documento:** Especificación Técnica, Funcional y de Arquitectura de Dominio Consolidada  
**Servicio:** Menu (Sistema de Comandas para Restaurantes)  
**Versión:** 1.3.11 (Consolidada Vigente)  
**Estado:** Vigente / En Revisión con Cuestiones Abiertas Pendientes  
**Fecha:** 2026-09-22  

## Identificación y Propósito

El presente documento constituye la especificación técnica, funcional, estructural y de arquitectura consolidada y vigente para el servicio **Menu**, componente del sistema de comandas y gestión de restaurantes.

Su objetivo es constituirse como la **fuente autorizada de verdad consolidada del servicio Menu**, proporcionando un modelo coherente, riguroso y verificable derivado exclusivamente de las doce fuentes autorizadas del proyecto.

La versión **1.3.11** (fecha 2026-09-22) consolida la especificación del servicio Menu incorporando los refinamientos normativos de **Consultoria-3.md** y la revisión de los flujos operacionales definidos en `output/diagrams/domain-events.md`. `Consultoria-3.md` conserva autoridad cronológica posterior sobre ciclo de vida administrativo, habilitación y retiro de componentes internos, propagación de elegibilidad estructural y clarificación de creación y custodia de órdenes por Orders + Kitchen:

1. Unifica el estado administrativo de ciclo de vida exclusivamente en `MenuItem` con los estados `ACTIVE`, `INACTIVE` y `ARCHIVED`, aplicable de manera idéntica y uniforme a todos sus tipos (`PREPARED`, `STOCKED`, `COMBO`), sin que el tipo del producto altere su ciclo administrativo.
2. Establece el archivado reversible para `MenuItem`: transita de `ACTIVE` o `INACTIVE` hacia `ARCHIVED`, y el desarchivado produce obligatoriamente `INACTIVE` (`ARCHIVED -> INACTIVE`), sin retorno automático a `ACTIVE`. Una activación posterior hacia `ACTIVE` debe ser explícita y requiere revalidar conjuntamente elegibilidad estructural, dependencias y preparación (manteniendo preparación y readiness bajo la autoridad exclusiva de Orders + Kitchen) antes de ofrecer el artículo para nuevas ventas.
3. Restringe la eliminación definitiva de `MenuItem` para que solo pueda solicitarse bajo el predicado canónico de encontrarse previamente en estado `ARCHIVED` y existir ausencia total de dependencias, referencias históricas necesarias para trazabilidad (tales como órdenes de venta, preparación en Kitchen, uso en combos o revisiones anteriores, como ejemplos no exhaustivos) y restricciones de retención (legales, fiscales, contables u operativas), siendo impedida y bloqueada por el sistema ante la presencia de cualquiera de ellas.
4. Suprime el concepto de `ARCHIVED` en componentes internos (`MenuItemVariant`, `ComboConfiguration`, `ComboSlot`, `ComboOption`), adoptando en su lugar la semántica local de habilitación `enabled: boolean` (habilitarse, deshabilitarse y retirarse de la definición vigente).
5. Define el retiro de componentes internos (`MenuItemVariant`, `ComboConfiguration`, `ComboSlot`, `ComboOption`) de la definición vigente distinguiéndolo formalmente de la destrucción física: si el componente nunca ha sido publicado y nunca ha sido referenciado históricamente puede eliminarse físicamente; si ya fue publicado o cuenta con cualquier referencia que requiera trazabilidad (en órdenes de venta históricas, preparación en Kitchen, utilización en combos o revisiones anteriores, como ejemplos no exhaustivos), se retira de la definición vigente conservando su identidad histórica mediante `enabled = false` para trazabilidad y auditoría, dejando abiertos los mecanismos técnicos concretos de persistencia y purga (OPEN-011).
6. Incorpora la semántica de habilitación local en combos mediante `enabled: boolean`: `ComboConfiguration.enabled = false` retira la configuración completa de nuevas ventas; `ComboSlot.enabled = false` retira temporalmente ese grupo de selección de la configuración vigente; `ComboOption.enabled = false` impide la selección de esa alternativa concreta. Ninguno utiliza `ARCHIVED`.
7. Diferencia explícitamente `ComboSlot.enabled = false` (decisión administrativa de excluir el slot de la configuración) de un `ComboSlot` habilitado (`enabled = true`) que temporalmente carece de capacidad suficiente (`availableCapacity < minSelections` o capacidad elegible insuficiente).
8. Desacopla la propagación estructural en combos: deshabilitar una `ComboOption` no desactiva automáticamente el `MenuItem` COMBO mientras exista una configuración válida. No se impone una transición incondicional a `REVIEW_REQUIRED` por cualquier deshabilitación o retiro de componentes, preservando las reglas de revisión independientes respaldadas en otras secciones.
9. Consagra la separación estricta entre cuatro conceptos ortogonales independientes: `MenuItem.status` (ciclo administrativo global), `enabled` (decisión administrativa local sobre componentes internos), `eligibility` (validez estructural para participar en una nueva venta) y `availability` (posibilidad operacional actual informada por Cocina/Inventario, la cual jamás podrá reactivar o habilitar componentes administrativamente deshabilitados).
10. Clarifica y afirma de forma uniforme en toda la especificación que POS, como UI/terminal de venta, consume el catálogo comercial publicado por Menu, captura los artículos y configuraciones elegidos y solicita a _Orders + Kitchen_ la creación de la comanda con esa selección; _Orders + Kitchen_ es el creador y custodio exclusivo de las órdenes, comandas y snapshots inmutables de venta. `Sala` representa un microservicio independiente para reservaciones, mesas y operaciones relacionadas, no la UI del POS. El contrato técnico que la UI utiliza para enviar la selección permanece abierto y no forma parte de la responsabilidad del servicio Menu.
11. Mantiene las decisiones previas consolidadas respecto a precios autoritativos absolutos (`unitPrice`), especialización comercial plana (`ResolvedVariantModifier`), referencia visual informativa de slots (`SlotPriceReference`), clonación profunda con nuevas identidades y copia masiva con atomicidad por destino y éxito parcial (`BR-MENU-026`, `BR-MENU-027`, `BR-MENU-028`).
12. Mantiene explícitamente abiertas las cuestiones técnicas de persistencia, transporte y políticas detalladas de retención histórica bajo las cuestiones abiertas OPEN-002, OPEN-007, OPEN-009, OPEN-010 y OPEN-011.

Por consiguiente, el estado del documento se declara como **Vigente / En Revisión con Cuestiones Abiertas Pendientes**, reflejando con honestidad técnica que el modelo conceptual y funcional se encuentra consolidado bajo las fuentes vigentes mientras que los detalles técnicos de implementación no definidos por el negocio permanecen abiertos. La presente revisión documental constituye una especificación analítica y normativa, no una prueba de implementación, integración o comportamiento en ejecución.

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
10. **`Auditoria-4.md`** (Síntesis consolidada del modelo, separación estricta de responsabilidades entre Menu, Orders + Kitchen e Inventory, eliminación de recetas y efectos físicos en Menu, readiness y disponibilidad calculados por Orders + Kitchen, revisiones comerciales y culinarias desacopladas).
11. **`Consultoria-3.md`** (Autoridad posterior sobre ciclo de vida administrativo, habilitación y retiro de componentes internos, propagación de elegibilidad estructural y creación de órdenes: consagración de `MenuItem.status` con `ACTIVE`, `INACTIVE`, `ARCHIVED` uniforme para todos los tipos; archivado reversible hacia `INACTIVE` y eliminación definitiva únicamente desde `ARCHIVED` bloqueada por dependencias, historial o retención; eliminación de `ARCHIVED` en componentes internos adoptando `enabled: boolean` y retiro no destructivo; diferenciación entre slot deshabilitado y slot sin capacidad suficiente; establecimiento de que deshabilitar una `ComboOption` no desactiva automáticamente el `MenuItem` COMBO mientras exista una configuración válida; y ratificación de que Orders + Kitchen crea y custodia las órdenes mientras POS envía la solicitud).

#### Regla de Prevalencia

Una fuente posterior sustituye a una anterior en caso de contradicción explícita o cuando la decisión posterior refine de forma incompatible el modelo previo:

- **`Consultoria-3.md`** ostenta la máxima jerarquía resolutiva y cronológica posterior exclusivamente sobre el ciclo de vida administrativo, habilitación y retiro de componentes internos, propagación de elegibilidad estructural y la creación y custodia de órdenes por Orders + Kitchen. Prevalece sobre cualquier regla incompatible previa de `Auditoria-4.md`, `Auditoria-3.md` o `Req-F-Aproved.md` (en particular respecto a asignar `ARCHIVED` a variantes, limitar `MenuItem` a solo `ACTIVE`/`INACTIVE` o flujos erróneos de creación de comandas).
- **`Auditoria-4.md`** se conserva como máxima autoridad sobre la arquitectura global, separación estricta de servicios (Menu → POS → Orders + Kitchen → Inventory), ownership de datos, eliminación de recetas y efectos físicos en Menu, y cálculo externo de readiness y disponibilidad operacional por Orders + Kitchen, salvo en las precisiones de ciclo de vida y habilitación refinadas por `Consultoria-3.md`.
- **`Auditoria-3.md`** representa la base más estable del catálogo comercial para la propiedad de modificadores en el item hoja, la especialización comercial por variante, el desacoplamiento de combos y la reevaluación no obstructiva por archivado o deshabilitación de componentes (prevaleciendo sobre la restricción previa de rechazo obligatorio de `Req-F-Aproved.md` y ADR-005).
- **`Req-F-Aproved.md`** aporta la línea base de los 41 requisitos funcionales aprobados. Sus requisitos se conservan vigentes salvo cuando una decisión posterior de `Auditoria-3.md`, `Auditoria-4.md` o `Consultoria-3.md` los contradiga, refine o vuelva obsoletos, en cuyo caso se actualizan o marcan como reemplazados con trazabilidad explícita individual.
- Se excluyen terminantemente del historial y de la regla de prevalencia todas las referencias a refinamientos, aclaraciones o revisiones posteriores no contenidas en las doce fuentes autorizadas.

### Alcance y Exclusiones

- **Dentro del alcance del servicio Menu:**
  - Definición y mantenimiento del catálogo comercial: items, presentaciones vendibles hoja (`MenuItemVariant`), combos (`ComboConfiguration`), slots y opciones.
  - Custodia de precios unitarios absolutos autoritativos en variantes y configuraciones de combo, así como deltas comerciales de modificadores y opciones.
  - Proyección de precios de catálogo (`$X`, `Desde $X`).
  - Modelado de dimensiones (`VariantDimension`) y valores (`VariantValue`) para variantes hoja.
  - Variante técnica predeterminada (`DEFAULT`) cuando comercialmente no se exponen opciones de presentación.
  - Grupos de modificadores (`ModifierGroup`) y opciones (`ModifierOption`) comerciales en items hoja, junto con especializaciones comerciales por variante (`VariantModifierConfig`).
  - Proyección comercial efectiva de modificadores (`ResolvedVariantModifier`) hacia canales de venta (POS).
  - Gestión de estados administrativos (`ACTIVE`, `INACTIVE` y `ARCHIVED` de forma única y uniforme para `MenuItem` en `PREPARED`, `STOCKED` y `COMBO`, con archivado reversible hacia `INACTIVE` y eliminación definitiva únicamente desde `ARCHIVED` condicionada a la ausencia total de dependencias, referencias históricas necesarias para trazabilidad y restricciones de retención; componentes internos gobernados por habilitación local `enabled: boolean` sin `ARCHIVED`, distinguiendo retiro lógico de destrucción física).
  - Reglas de elegibilidad estructural de items hoja y combos sin confundirlas con disponibilidad operacional.
  - Exclusión estricta de conceptos no autorizados: no se adoptan banderas booleanas redundantes para modificadores, ni conceptos de niveles o conteos de gratuidad no respaldados.
  - Recepción y proyección operacional de readiness de preparación (`PreparationStatus`: `READY` / `INCOMPLETE`) publicado por Orders + Kitchen.
  - Recepción y proyección operacional de disponibilidad de variantes y modificadores suministrada por Orders + Kitchen mediante el contrato separado de proyecciones pendiente en `OPEN-007`.
  - Propagación de disponibilidad operacional hacia opciones de combo, slots (`availableCapacity`) y configuraciones de combo (`ComboConfigurationAvailability`), así como derivación agregada para catálogo (`CatalogItemProjection.isAvailable`).
  - Gestión y visibilidad del estado de supervisión administrativa de revisiones (`reviewStatus`: `UP_TO_DATE`, `REVIEW_REQUIRED`) diferenciando causas comerciales de avisos culinarios, con seguimiento desacoplado mediante `observedRevision` y `acknowledgedRevision`.
  - Versionado inmutable de definiciones comerciales del menú (`<number>_<ISO8601>`).

- **Fuera del alcance del servicio Menu (Responsabilidad exclusiva de otros servicios):**
  - **Orders + Kitchen:** Creación, custodia y ciclo de vida de órdenes y comandas; captura y congelamiento de snapshots inmutables de venta; definiciones culinarias de preparación; recetas (`Recipe`), ingredientes, gramajes e instrucciones de cocina; revisiones de preparación (`PreparationRevision`); interpretación física de modificadores (adición u omisión de insumos); resolución física de productos almacenados (`STOCKED`) hacia artículos de inventario; traducción de variantes y modificadores a requerimientos físicos de Inventory; evaluación y cálculo de disponibilidad operacional en tiempo real; gestión y publicación de readiness de preparación; emisión de comandas físicas o electrónicas para estaciones de cocina.
  - **Inventory:** Custodia del inventario físico, bodegas, almacenes, existencias disponibles, cálculo de stock remanente, mermas, órdenes de compra, reservas físicas, liberaciones, consumos atómicos y movimientos de almacén.
  - **POS:** UI/terminal de venta responsable del renderizado de interfaces gráficas, interacción táctil, lógica local de carritos de compra, navegación de pantallas, hardware terminal, captura de elecciones del cliente y envío de solicitudes de creación de orden a Orders + Kitchen.
  - **Sala:** Microservicio responsable de reservaciones, mesas y operaciones relacionadas con la sala. No representa la UI/terminal POS ni forma parte del flujo de consumo del catálogo y creación de órdenes descrito en esta especificación.
