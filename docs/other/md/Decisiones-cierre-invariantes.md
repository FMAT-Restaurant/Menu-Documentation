# Decisiones de cierre de invariantes — 2026-09-11

Este documento registra decisiones nuevas adoptadas por el arquitecto por delegación expresa del usuario: «tomes las decisiones coherentes para cerrar algunas invariantes abiertas (las que ya se han charlado)». No atribuye estas elecciones a las auditorías anteriores. La base es `Consultoria-2.md` pp. 9–16, `Consultoria-rendimiento.md` y las anotaciones del usuario en OPEN-001 y OPEN-006 de la versión española. Se conserva el alcance de Menu; los compromisos de Orders, Inventory y POS/KDS se identifican como contratos externos.

<a id="adr-001"></a>

## ADR-001 — Disponibilidad y consumo separados

**Origen:** decisión del usuario en OPEN-001: Inventory calcula y reporta disponibilidad desde una copia aplanada; comunicación publish/subscribe; Menu responde al cliente y marca no disponible cuando Inventory no está disponible. Complemento: Consultoria-2 pp. 11–14.

**Decisión:** Menu resuelve las definiciones a insumos de inventario, cantidades y unidades. Cada requisito de disponibilidad tiene una clave opaca y revisión de definición. Inventory puede conservar esa clave para correlación, pero no interpreta productos, tamaños, recetas, grupos ni slots. Para productos preparados se transmite la composición base; para almacenados, el artículo/SKU y cantidad de retiro. Menu conserva la correspondencia entre esas claves y variantes. Los combos se evalúan en Menu según las opciones elegibles de cada slot; cada opción remite al requerimiento plano de su cantidad suministrada. No se envía a Inventory un árbol de combos.

Menu publica cambios de **definición de insumos**, incluida su retirada, no el resultado de disponibilidad recibido de Inventory; así se evita un ciclo de notificaciones. Inventory publica resultado, revisión de definición, revisión creciente de evaluación e instante de caducidad para cada clave. Menu ignora resultados de definiciones distintas o evaluaciones anteriores a la última aceptada. Una definición nueva comienza sin disponibilidad confirmada.

Menu muestra disponibilidad solo para productos y variantes ACTIVE con configuración vendible y una evaluación positiva vigente para la revisión actual. Falta de evaluación, vencimiento o pérdida detectada de conexión/salud de Inventory producen no disponible. Inventory fija `validUntil` en cada evaluación; no hay una duración implícita ni permiso de reutilizar una respuesta sin vencimiento. Su duración es una configuración operativa explícita de Inventory, no un SLA inventado. Tras recuperación, Menu necesita una evaluación positiva vigente. La caducidad cubre también interrupciones silenciosas antes de detectar la desconexión.

El semáforo es orientativo, no una reserva ni garantía frente a compras concurrentes. En un combo, debe existir una selección que cubra todos los mínimos con opciones elegibles. Las opciones opcionales agotadas quedan sin selección; un slot de mínimo cero no bloquea el combo. Que varias opciones sean individualmente disponibles no garantiza stock conjunto. Al confirmar la línea, Menu resuelve el consumo neto de la selección completa y Orders solicita a Inventory el descuento atómico de esa lista. Un rechazo por falta de stock impide confirmar esa solicitud; no se acepta basándose solamente en el semáforo. No se definen aquí reintentos, endpoints ni códigos de error.

**Cierre:** OPEN-001. Contrato lógico parcial de OPEN-007.

<a id="adr-003"></a>

## ADR-003 — Archivado, historia y movimientos

**Base:** Consultoria-2 pp. 9–14. Se elige archivado para las variantes, con estados INACTIVE (configuración no vendible), ACTIVE (habilitada) y ARCHIVED (retirada e irreversible en esta versión).

Las variantes archivadas no se ofrecen para órdenes nuevas y siguen consultables en historia. Las revisiones históricas de productos, variantes, configuraciones y recetas se conservan sin depuración física en el alcance actual. No se fija un plazo legal ni se introduce una política automática de purga. La futura purga requiere otra decisión; no bloquea esta versión, cuya política es conservar. La API de catálogo rechaza el borrado físico de esta información. No se introducen claves foráneas entre servicios.

Menu resuelve los insumos netos de una línea seleccionada a partir de las revisiones elegidas. OMIT excluye el ingrediente de la receta base del componente al que se aplica; ADD aporta sus cantidades multiplicadas por la cantidad de modificador. Si coexisten OMIT y ADD del mismo ingrediente, primero se omite la aportación base y después se suma ADD. En combos se resuelve cada componente antes de sumar sus insumos; un modificador del paquete no modifica recetas hijas.

Orders conserva el resultado plano por línea y revisión de línea al solicitar confirmación, junto con las referencias de versiones comerciales/recetas, instrucciones de cocina y datos de precio ya capturados. Persiste la solicitud de movimiento en la misma transacción local mediante outbox y mantiene la confirmación pendiente hasta conocer el resultado de Inventory. La confirmación exitosa exige descuento aceptado; un rechazo mantiene la línea sin confirmar. La entrega puede repetirse: Inventory aplica cada identificador de movimiento una sola vez y rechaza reutilizarlo con contenido diferente. El identificador distingue línea, revisión y operación; `orderId` por sí solo no sirve como clave de idempotencia.

Orders solicita el descuento al confirmar, sin recalcular insumos desde la proyección de disponibilidad. La reversión autorizada utiliza el movimiento original y una identidad propia referida a él. No se revierte un descuento no aplicado ni más cantidad de la aplicada. Esto define exactitud contable, no autoriza automáticamente devolver ingredientes ya preparados: la política para decidir si procede una reversión queda fuera de este cierre. El transporte pendiente sobrevive fallos y puede reintentarse sin perder el trabajo persistido; no se afirma entrega garantizada en tiempo finito durante una caída indefinida.

**Cierre:** OPEN-003. Cierra la parte de insumos históricos de OPEN-009 y parte del contrato de OPEN-007.

<a id="adr-004"></a>

## ADR-004 — Presupuesto de rendimiento de aceptación

**Base:** Consultoria-rendimiento, tablas «Operación», «Prueba» y propuesta final. Se adoptan objetivos de ingeniería propios del proyecto, no estándares universales ni resultados medidos.

Perfil nominal por restaurante: 40 clientes POS/KDS concurrentes, 30 solicitudes por segundo durante 30 minutos. Mezcla reproducible: 30% búsqueda/categoría, 20% disponibilidad, 20% validación/precio, 20% edición de línea y 10% envío a cocina. Los datasets, tamaños de catálogo y equipo de prueba se registran con cada ejecución. El perfil usa la misma sucursal y estado de catálogo en la medición comparativa; no permite ocultar operaciones fallidas al calcular éxito.

Objetivos por clase: búsqueda/categoría p95 <= 200 ms; disponibilidad proyectada p95 <= 300 ms; validación/precio y edición de línea p95 <= 300 ms cada una; todas estas clases p99 <= 1 s; envío a cocina hasta ACK de Orders p95 <= 500 ms y p99 <= 1 s; visibilidad de esa orden en KDS desde su envío p95 <= 1 s y p99 <= 2 s. Las duraciones se miden de acción en POS a resultado observable, incluyendo red local y procesamiento, y se separan por operación. No se incluyen proveedores externos de pago. Errores internos bajo perfil nominal <0.1% de solicitudes ofrecidas. Errores por selección deliberadamente inválida se ensayan aparte y no diluyen el denominador nominal.

Ráfaga: 100 solicitudes por segundo durante 60 segundos, misma mezcla y clientes, inmediatamente tras el perfil nominal. Se exige cero órdenes aceptadas perdidas, duplicadas o corrompidas; no se exige el mismo percentil nominal durante la ráfaga. Cada solicitud fallida o pendiente queda contabilizada. Finalizada la ráfaga, se verifica que toda orden aceptada tenga su resultado persistido y que reintentar las pendientes no duplique efectos. El servicio no debe caer durante la ráfaga. No se afirma una capacidad superior ni un plazo de recuperación de colas no establecido.

**Cierre:** OPEN-004 para este perfil inicial. Las mediciones reales aún no existen.

<a id="adr-005"></a>

## ADR-005 — Conteo y habilitación

**Base:** Consultoria-2 pp. 14–16 sustituye COUNT(configuraciones) por suma de capacidades. Se decide explícitamente la ambigüedad residual de repetición de opciones de combo.

En ModifierGroup, el conteo es la suma de cantidades enteras seleccionadas. Cada cantidad es >=0 y <= maxQuantity de la configuración vigente. Dos unidades de una opción satisfacen mínimo dos si su capacidad lo permite. La configuración solo es vendible si 0 <= minSelections <= maxSelections y la suma de maxQuantity de configuraciones habilitadas cubre minSelections. maxQuantity es entero >=0; cero impide seleccionar esa configuración y aporta capacidad cero.

En ComboSlot, cada ComboOption puede seleccionarse cero o una vez por unidad de combo; dos opciones distintas pueden referir la misma variante si fueron configuradas así. El conteo es número de opciones seleccionadas, no la cantidad física `ComboOption.quantity`. Esa cantidad es entero >0 y multiplica únicamente las unidades suministradas. La capacidad del slot es el número de opciones habilitadas cuyo componente es ACTIVE; debe cubrir minSelections. Se aplican límites enteros 0 <= mínimo <= máximo. La disponibilidad momentánea se filtra para venta, pero no invalida por sí sola la configuración administrativa.

Un producto/variante INACTIVE permite guardar capacidad incompleta con advertencia identificable de capacidad insuficiente. Pasar a ACTIVE exige capacidad válida para todos los grupos y slots de las variantes que quedarán ACTIVE y al menos una variante ACTIVE. No se permite que una edición, retirada de configuración o archivado de componente deje una configuración ACTIVE dependiente inválida: se rechaza el cambio, o el administrador desactiva primero la configuración dependiente. Esto evita que archivar una variante rompa silenciosamente combos activos que la requieren.

Orders vuelve a validar los límites y aplicabilidad de la selección al confirmar la línea. Los errores identifican el grupo o slot y sus límites; no se exige un código HTTP. El archivado no puede rehabilitarse; una oferta equivalente requiere nueva identidad. No se amplía la función de guardado parcial a combinaciones estructuralmente inválidas prohibidas por BR-MENU-002/003/004.

**Cierre:** OPEN-005. Resuelve únicamente los rangos de selección de OPEN-010.

<a id="adr-006"></a>

## ADR-006 — Versiones de producto y receta

**Origen:** anotación del usuario en OPEN-006: «Cada cambio en el producto incrementa la version del producto, para existentes se mantiene la version que tenia cuando se creó la orden. Se sigue el formato: <number>_<ISO8601>». Ejemplo preservado: `1_2026-09-11T15:47:26-06:00`.

Se decide que cada cambio aceptado que modifica la definición comercial o ejecutable de un producto (incluidas variantes, estado administrativo, grupos, configuraciones y referencias de receta) crea una revisión inmutable nueva del producto. El contador empieza en 1 y aumenta exactamente en uno por cambio aceptado de definición, dentro de cada identidad. Reintentar el mismo cambio o guardar contenido idéntico no crea otra revisión. La fecha ISO8601 incluye zona horaria; el contador ordena las revisiones aun si los relojes coinciden. Las evaluaciones derivadas de stock no son ediciones del producto y no incrementan su versión.

Recipe conserva identidad y secuencia de versiones independientes con el mismo formato. Cambiar su nombre o composición crea nueva revisión; la referencia de una variante apunta a una revisión exacta de receta. Publicar una nueva revisión de receta no cambia automáticamente referencias existentes: adoptar esa revisión es una edición del producto y genera su versión. Así una receta compartida puede evolucionar sin alterar órdenes o productos silenciosamente.

Orders fija la versión del producto al crear la línea y conserva esa definición para la línea existente; una modificación explícita de la línea genera revisión de línea y una nueva selección validada. Al confirmar se conservan consumo e instrucciones resueltos de las versiones fijadas, no de las últimas del catálogo. Se valida la habilitación actual para evitar nuevas ventas de variantes archivadas, sin cambiar los valores históricos fijados. Una línea ya confirmada sigue operando con su snapshot aunque el catálogo cambie.

**Cierre:** OPEN-006. El almacenamiento histórico se rige por ADR-003.

<a id="adr-008"></a>

## ADR-008 — Elegibilidad, precio de catálogo y presentación predeterminada

**Base:** Modelo-Final pp. 7–8, 18–19, 27; Consultoria-2 p. 9 introduce archivado. La consultoría no resolvía el mínimo ni la transición de DEFAULT: las siguientes son elecciones nuevas dentro del encargo del usuario.

Para un `MenuItem` hoja, el precio de catálogo mostrado es el menor `unitPrice` entre sus `MenuItemVariant` elegibles ahora para una venta nueva (`MenuItem` y presentación ACTIVE, configuración válida y disponibilidad vigente positiva según ADR-001). Para un `MenuItem` COMBO, se aplica la misma regla a sus `ComboConfiguration.unitPrice` elegibles. Las presentaciones o configuraciones INACTIVE, ARCHIVED, agotadas o sin evaluación vigente quedan fuera. Si hay precios elegibles distintos, Menu muestra `Desde $X` usando el menor; si todos son iguales, muestra `$X`; si no hay candidatas, muestra el `MenuItem` no disponible y no muestra precio numérico. No se usa cero como precio de reemplazo.

Al añadir características de presentación a un `MenuItem` hoja que tiene presentación predeterminada, el administrador crea nuevas presentaciones INACTIVE con nuevas identidades y combinaciones explícitas. La presentación predeterminada conserva su significado histórico y no se convierte silenciosamente en un tamaño. Mientras existan características seleccionables, una presentación sin combinación no es elegible para nuevas ventas. La transición comercial se aplica como una nueva revisión del `MenuItem`: archiva DEFAULT y activa las nuevas presentaciones válidas sin exponer una revisión parcialmente migrada. Si falta configuración vendible, el `MenuItem` puede conservarse INACTIVE como trabajo incompleto. Las referencias de combos a DEFAULT deben corregirse o desactivarse antes de publicar la transición; las órdenes existentes conservan la identidad original.

**Cierre:** OPEN-008.

## Pendientes fuera del cierre

OPEN-002 sigue abierto: emparejamiento de espacios, conflictos de copia y fallos de lotes no discutidos. OPEN-007 queda parcialmente resuelto en su intercambio lógico de inventario y snapshots; no se eligen endpoints, transporte de consultas de catálogo/cocina ni contratos completos de publicación. OPEN-009 queda parcialmente resuelto en snapshots de consumo; el ajuste de precio por porción de combo y precio de modificadores de componentes repetidos siguen pendientes. OPEN-010 queda parcialmente resuelto en rangos de selecciones y archivado; no se deciden todos los rangos de precios, nombres, tipos de almacenamiento ni reclasificación de suministro.
