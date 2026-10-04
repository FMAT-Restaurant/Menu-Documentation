# Requisitos Funcionales del Servicio Menu

Esta sección define las capacidades observables que el servicio Menu debe ofrecer para administrar el catálogo comercial. Los requisitos describen las necesidades del administrador y de quienes consultan el catálogo; las reglas de dominio relacionadas se enlazan en [business-rules.md](business-rules.md).

## Criterio común para imágenes

- Crear una entrada requiere una imagen. Al editarla, la imagen puede reemplazarse; si no se cambia, se conserva la imagen vigente.
- Crear una oferta requiere una imagen. Al crear una revisión, la imagen puede reemplazarse; si no se cambia, se conserva la imagen vigente.
- Solo se admiten JPEG, PNG y WebP, con tamaño máximo de 10 MiB y ancho y alto máximos de 4096 px cada uno. El servicio valida el contenido real del archivo, no solo el tipo declarado.
- Una imagen inválida o no decodificable, que exceda el tamaño o cualquiera de las dimensiones máximas, se rechaza. El rechazo es íntegro: no crea el recurso ni la revisión, no aplica cambios parciales y conserva la imagen vigente.

El transporte, las operaciones y la representación de datos de la API quedan pendientes de revisar los mockups y se registran en [OPEN-010](open.md).

## Categorías y entradas del catálogo

### REQ-MENU-CAT-001 — Administración de categorías

- **Requisito:** El sistema deberá permitir al administrador crear y editar categorías de un menú, indicando su nombre y descripción.
- **Criterio de aceptación:** Una categoría creada o editada conserva el nombre y la descripción indicados y puede clasificarse en más de una entrada del mismo menú.

### REQ-MENU-CAT-002 — Consulta del catálogo publicable

- **Requisito:** El sistema deberá presentar las entradas `ACTIVE` que tengan al menos una oferta `ACTIVE` válida, junto con sus ofertas `ACTIVE` publicables. Una oferta solo se presenta cuando su entrada está `ACTIVE` y la oferta es válida. La presentación deberá permitir reconocer cuál es la identidad comercial del producto y cuáles son sus ofertas vendibles.
- **Criterio de aceptación:** Una entrada incompleta, `INACTIVE` o `ARCHIVED` no se presenta como vigente. Una entrada administrativamente `ACTIVE` sin ofertas `ACTIVE` válidas permanece `ACTIVE`, pero no se presenta en el catálogo; cuando vuelve a tener al menos una oferta `ACTIVE` válida, puede presentarse. Cada oferta presentada está `ACTIVE`, tiene una composición válida y muestra su precio declarado. Las ofertas de una misma entrada se distinguen entre sí. Cambiar el estado administrativo de una entrada no modifica automáticamente el estado de sus ofertas; la inactivación de una oferta tampoco cambia el estado administrativo de la entrada.
- **Requisito:** El sistema deberá presentar las entradas `ACTIVE` que tengan al menos una oferta `ACTIVE` válida, junto con sus ofertas `ACTIVE` publicables. Una oferta solo se presenta cuando su entrada está `ACTIVE` y la oferta es válida. La presentación deberá permitir reconocer cuál es la identidad comercial del producto y cuáles son sus ofertas vendibles.
- **Criterio de aceptación:** Una entrada incompleta, `INACTIVE` o `ARCHIVED` no se presenta como vigente. Una entrada administrativamente `ACTIVE` sin ofertas `ACTIVE` válidas permanece `ACTIVE`, pero no se presenta en el catálogo; cuando vuelve a tener al menos una oferta `ACTIVE` válida, puede presentarse. Cada oferta presentada está `ACTIVE`, tiene una composición válida y muestra su precio declarado. Las ofertas de una misma entrada se distinguen entre sí. Cambiar el estado administrativo de una entrada no modifica automáticamente el estado de sus ofertas; la inactivación de una oferta tampoco cambia el estado administrativo de la entrada.

### REQ-MENU-ENTRY-001 — Creación de una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una entrada del catálogo indicando su nombre comercial, descripción, imagen y las categorías que correspondan dentro del mismo menú. Toda entrada nueva deberá iniciar inactiva.
- **Criterio de aceptación:** La creación requiere la imagen junto con los metadatos y las categorías seleccionadas. El sistema conserva esos datos y registra la entrada como inactiva, sin publicarla hasta una activación posterior del administrador.

### REQ-MENU-ENTRY-002 — Edición de una entrada

- **Requisito:** El sistema deberá permitir al administrador cambiar el nombre comercial, la descripción, la imagen y las categorías de una entrada existente.
- **Criterio de aceptación:** La imagen puede reemplazarse al editar; si no se cambia, se conserva la imagen vigente. Tras guardar los cambios, la entrada muestra los valores actualizados y permanece asociada únicamente a categorías del menú al que pertenece.

### REQ-MENU-ENTRY-003 — Estado y archivado de una entrada

- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una entrada y archivarla de manera reversible desde los estados `ACTIVE` o `INACTIVE`. Desarchivar una entrada deberá dejarla en `INACTIVE` para que el administrador decida expresamente si vuelve a activarla. Estos cambios no modificarán automáticamente los estados de sus ofertas.
- **Criterio de aceptación:** El estado de la entrada es administrativo y no cambia automáticamente por la activación o inactivación de sus ofertas. Una entrada `ACTIVE` se publica solo mientras tenga al menos una oferta `ACTIVE` y válida; si deja de tenerla, permanece `ACTIVE` y se oculta del catálogo hasta que vuelva a tener una oferta elegible. Una entrada archivada no se publica; al desarchivarla queda en `INACTIVE` y requiere una activación explícita posterior. Archivar, desarchivar, activar o inactivar la entrada no cambia el estado de sus ofertas.
- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una entrada y archivarla de manera reversible desde los estados `ACTIVE` o `INACTIVE`. Desarchivar una entrada deberá dejarla en `INACTIVE` para que el administrador decida expresamente si vuelve a activarla. Estos cambios no modificarán automáticamente los estados de sus ofertas.
- **Criterio de aceptación:** El estado de la entrada es administrativo y no cambia automáticamente por la activación o inactivación de sus ofertas. Una entrada `ACTIVE` se publica solo mientras tenga al menos una oferta `ACTIVE` y válida; si deja de tenerla, permanece `ACTIVE` y se oculta del catálogo hasta que vuelva a tener una oferta elegible. Una entrada archivada no se publica; al desarchivarla queda en `INACTIVE` y requiere una activación explícita posterior. Archivar, desarchivar, activar o inactivar la entrada no cambia el estado de sus ofertas.

### REQ-MENU-ENTRY-004 — Eliminación de una entrada archivada

- **Requisito:** El sistema deberá permitir eliminar definitivamente una entrada únicamente cuando se encuentre archivada.
- **Criterio de aceptación:** La eliminación de una entrada activa o inactiva se rechaza. Al eliminar una entrada archivada, se eliminan la entrada y sus definiciones vigentes poseídas. Las revisiones históricas publicadas permanecen intactas y consultables.
- **Requisito:** El sistema deberá permitir eliminar definitivamente una entrada únicamente cuando se encuentre archivada.
- **Criterio de aceptación:** La eliminación de una entrada activa o inactiva se rechaza. Al eliminar una entrada archivada, se eliminan la entrada y sus definiciones vigentes poseídas. Las revisiones históricas publicadas permanecen intactas y consultables.

## Ofertas y composición

### REQ-MENU-OFFER-001 — Creación de ofertas para una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una o más ofertas pertenecientes a una entrada del catálogo. Para cada oferta deberá poder indicar una etiqueta de presentación opcional, un precio base y una imagen. Toda oferta nueva deberá iniciar inactiva.
- **Criterio de aceptación:** La creación de cada oferta requiere su imagen. Una entrada puede tener varias ofertas con precios, etiquetas e imágenes propios. Al crear una oferta, queda inactiva hasta que el administrador la active.

### REQ-MENU-OFFER-002 — Identidad de entrada y presentación vendible

- **Requisito:** El sistema deberá presentar cada `CatalogEntry` como agrupador de sus ofertas y permitir identificar cada `CatalogOffer` concreta como una opción individualmente seleccionable y vendible. La entrada conserva el nombre comercial autoritativo; la etiqueta de oferta distingue una presentación y puede aparecer junto al nombre de la entrada.
- **Criterio de aceptación:** Una entrada con varias ofertas se presenta como un mismo grupo comercial; ninguna oferta queda preseleccionada por defecto y cada oferta concreta se identifica y puede seleccionarse de forma independiente. La información mostrada permite distinguir dos ofertas de la misma entrada sin duplicar ni alterar el nombre comercial de la entrada. La etiqueta describe la presentación y no sustituye la composición ni determina cantidades.
- **Requisito:** El sistema deberá presentar cada `CatalogEntry` como agrupador de sus ofertas y permitir identificar cada `CatalogOffer` concreta como una opción individualmente seleccionable y vendible. La entrada conserva el nombre comercial autoritativo; la etiqueta de oferta distingue una presentación y puede aparecer junto al nombre de la entrada.
- **Criterio de aceptación:** Una entrada con varias ofertas se presenta como un mismo grupo comercial; ninguna oferta queda preseleccionada por defecto y cada oferta concreta se identifica y puede seleccionarse de forma independiente. La información mostrada permite distinguir dos ofertas de la misma entrada sin duplicar ni alterar el nombre comercial de la entrada. La etiqueta describe la presentación y no sustituye la composición ni determina cantidades.

### REQ-MENU-OFFER-003 — Precio base declarado

- **Requisito:** El sistema deberá permitir al administrador fijar el precio base de cada oferta vendible. El precio será propio de esa oferta e independiente de los grupos de su composición y de las opciones seleccionadas.
- **Criterio de aceptación:** Cambiar los grupos u opciones de una oferta no suma automáticamente precios de componentes ni modifica su precio base. El precio consultado coincide con el que el administrador declaró para esa oferta.
- **Requisito:** El sistema deberá permitir al administrador fijar el precio base de cada oferta vendible. El precio será propio de esa oferta e independiente de los grupos de su composición y de las opciones seleccionadas.
- **Criterio de aceptación:** Cambiar los grupos u opciones de una oferta no suma automáticamente precios de componentes ni modifica su precio base. El precio consultado coincide con el que el administrador declaró para esa oferta.

### REQ-MENU-OFFER-004 — Activación de una oferta

- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una oferta. Para activarla, deberá exigir que tenga una composición válida.
- **Criterio de aceptación:** Una oferta `INACTIVE` no se presenta como alternativa vigente. Una oferta sin composición válida o sin al menos un `requiredSlot` `ACTIVE` no puede activarse; una oferta con composición válida y al menos un `requiredSlot` `ACTIVE` puede activarse mediante una acción administrativa, incluso mientras su entrada está `INACTIVE`, pero no se publica hasta que la entrada esté `ACTIVE`. Una oferta solo se publica si tanto ella como su entrada están en estado `ACTIVE`; una entrada `ACTIVE` sin ofertas `ACTIVE` válidas permanece oculta y no cambia su estado administrativo. Si ningún slot requerido permanece `ACTIVE`, el sistema cambia automáticamente la oferta a `INACTIVE`. Si posteriormente vuelve a haber un slot requerido `ACTIVE`, la oferta permanece `INACTIVE` hasta una nueva activación administrativa. Cambiar el estado de la oferta no modifica el estado administrativo de la entrada.
- **Criterio de aceptación:** Una oferta `INACTIVE` no se presenta como alternativa vigente. Una oferta sin composición válida o sin al menos un `requiredSlot` `ACTIVE` no puede activarse; una oferta con composición válida y al menos un `requiredSlot` `ACTIVE` puede activarse mediante una acción administrativa, incluso mientras su entrada está `INACTIVE`, pero no se publica hasta que la entrada esté `ACTIVE`. Una oferta solo se publica si tanto ella como su entrada están en estado `ACTIVE`; una entrada `ACTIVE` sin ofertas `ACTIVE` válidas permanece oculta y no cambia su estado administrativo. Si ningún slot requerido permanece `ACTIVE`, el sistema cambia automáticamente la oferta a `INACTIVE`. Si posteriormente vuelve a haber un slot requerido `ACTIVE`, la oferta permanece `INACTIVE` hasta una nueva activación administrativa. Cambiar el estado de la oferta no modifica el estado administrativo de la entrada.

### REQ-MENU-OFFER-005 — Copia de composición desde una oferta del catálogo
### REQ-MENU-OFFER-005 — Copia de composición desde una oferta del catálogo

- **Requisito:** Al configurar una oferta, el sistema deberá permitir seleccionar otra oferta del catálogo para copiar sus slots y opciones a la composición destino.
- **Criterio de aceptación:** La operación agrega a la composición destino copias locales editables de los slots y opciones configurados en la oferta seleccionada, conserva los slots que ya tuviera la composición destino y copia para cada slot si es requerido u opcional, junto con el estado de sus opciones. El estado del slot copiado se deriva de las opciones copiadas. No conserva una referencia a la oferta de origen ni copia su precio base. Los cambios posteriores en cualquiera de las ofertas no sincronizan sus composiciones.
- **Requisito:** Al configurar una oferta, el sistema deberá permitir seleccionar otra oferta del catálogo para copiar sus slots y opciones a la composición destino.
- **Criterio de aceptación:** La operación agrega a la composición destino copias locales editables de los slots y opciones configurados en la oferta seleccionada, conserva los slots que ya tuviera la composición destino y copia para cada slot si es requerido u opcional, junto con el estado de sus opciones. El estado del slot copiado se deriva de las opciones copiadas. No conserva una referencia a la oferta de origen ni copia su precio base. Los cambios posteriores en cualquiera de las ofertas no sincronizan sus composiciones.

### REQ-MENU-OFFER-006 — Eliminación de una oferta

- **Requisito:** El sistema deberá permitir eliminar individualmente una oferta únicamente cuando esté inactiva y su eliminación no deje una entrada activa sin al menos una oferta activa y válida.
- **Criterio de aceptación:** La eliminación se rechaza si la oferta está activa o es la última oferta activa y válida de una entrada activa. En los demás casos, se elimina la definición vigente de la oferta y sus estructuras poseídas. Sus revisiones históricas publicadas permanecen intactas y consultables.
- **Requisito:** El sistema deberá permitir eliminar individualmente una oferta únicamente cuando esté inactiva y su eliminación no deje una entrada activa sin al menos una oferta activa y válida.
- **Criterio de aceptación:** La eliminación se rechaza si la oferta está activa o es la última oferta activa y válida de una entrada activa. En los demás casos, se elimina la definición vigente de la oferta y sus estructuras poseídas. Sus revisiones históricas publicadas permanecen intactas y consultables.

### REQ-MENU-COMP-001 — Composición de una oferta

- **Requisito:** El sistema deberá permitir definir para cada oferta una composición con uno o más grupos (`CompositionSlot`) y configurar explícitamente cada grupo como requerido u opcional. Cada grupo deberá poder identificarse por su función, como bebida o plato principal.
- **Criterio de aceptación:** Toda composición válida contiene al menos un grupo requerido, incluso cuando representa un producto individual. `requiredSlots` corresponde a los grupos requeridos de la composición. Todos los grupos pertenecen estructuralmente a la composición de esa oferta.
- **Requisito:** El sistema deberá permitir definir para cada oferta una composición con uno o más grupos (`CompositionSlot`) y configurar explícitamente cada grupo como requerido u opcional. Cada grupo deberá poder identificarse por su función, como bebida o plato principal.
- **Criterio de aceptación:** Toda composición válida contiene al menos un grupo requerido, incluso cuando representa un producto individual. `requiredSlots` corresponde a los grupos requeridos de la composición. Todos los grupos pertenecen estructuralmente a la composición de esa oferta.

### REQ-MENU-COMP-002 — Inclusión de grupos
### REQ-MENU-COMP-002 — Inclusión de grupos

- **Requisito:** El sistema deberá conservar todos los grupos definidos como miembros estructurales de la composición y distinguir cuáles participan en la selección.
- **Criterio de aceptación:** Un grupo requerido `ACTIVE` participa en la selección. Un grupo opcional `ACTIVE` puede participar u omitirse. Un grupo `INACTIVE` no puede seleccionarse ni genera rondas, independientemente de si es requerido u opcional.
- **Requisito:** El sistema deberá conservar todos los grupos definidos como miembros estructurales de la composición y distinguir cuáles participan en la selección.
- **Criterio de aceptación:** Un grupo requerido `ACTIVE` participa en la selección. Un grupo opcional `ACTIVE` puede participar u omitirse. Un grupo `INACTIVE` no puede seleccionarse ni genera rondas, independientemente de si es requerido u opcional.

### REQ-MENU-COMP-003 — Opciones por grupo
### REQ-MENU-COMP-003 — Opciones por grupo

- **Requisito:** El sistema deberá permitir al administrador definir una o más opciones (`SlotOption`) de contenido para cada grupo y activar o inactivar cada opción.
- **Criterio de aceptación:** Cada grupo tiene al menos una opción. El estado del grupo es derivado: es `ACTIVE` si al menos una de sus opciones está `ACTIVE`, e `INACTIVE` si ninguna lo está. Una opción `INACTIVE` no puede seleccionarse. Si un grupo participante tiene una sola opción `ACTIVE`, se utiliza directamente; si tiene varias opciones `ACTIVE`, en cada ronda el cliente elige exactamente una de ellas.
- **Requisito:** El sistema deberá permitir al administrador definir una o más opciones (`SlotOption`) de contenido para cada grupo y activar o inactivar cada opción.
- **Criterio de aceptación:** Cada grupo tiene al menos una opción. El estado del grupo es derivado: es `ACTIVE` si al menos una de sus opciones está `ACTIVE`, e `INACTIVE` si ninguna lo está. Una opción `INACTIVE` no puede seleccionarse. Si un grupo participante tiene una sola opción `ACTIVE`, se utiliza directamente; si tiene varias opciones `ACTIVE`, en cada ronda el cliente elige exactamente una de ellas.

### REQ-MENU-COMP-004 — Cantidad de rondas por grupo
### REQ-MENU-COMP-004 — Cantidad de rondas por grupo

- **Requisito:** El sistema deberá permitir indicar en cada `CompositionSlot` cuántas rondas de selección comprende su grupo.
- **Criterio de aceptación:** La cantidad pertenece al grupo y no a sus opciones. Si un grupo `ACTIVE` participa y su cantidad es 3, el cliente realiza tres rondas y en cada una elige exactamente una opción `ACTIVE` de ese grupo. Un grupo opcional `ACTIVE` omitido y cualquier grupo `INACTIVE` no generan rondas.
- **Requisito:** El sistema deberá permitir indicar en cada `CompositionSlot` cuántas rondas de selección comprende su grupo.
- **Criterio de aceptación:** La cantidad pertenece al grupo y no a sus opciones. Si un grupo `ACTIVE` participa y su cantidad es 3, el cliente realiza tres rondas y en cada una elige exactamente una opción `ACTIVE` de ese grupo. Un grupo opcional `ACTIVE` omitido y cualquier grupo `INACTIVE` no generan rondas.

### REQ-MENU-COMP-005 — Tiempo sugerido de servicio

- **Requisito:** El sistema deberá permitir configurar opcionalmente en un grupo el curso sugerido de servicio, con uno de estos valores: entrada, plato fuerte, postre o bebida.
- **Criterio de aceptación:** Si se informa el curso, el sistema acepta exactamente entrada, plato fuerte, postre o bebida y rechaza cualquier otro valor. El curso aceptado se muestra asociado al grupo como sugerencia de tiempo de servicio y no cambia sus opciones, las rondas de selección del grupo ni el precio.

## Contenido y recetas

### REQ-MENU-CONT-001 — Opciones de contenido
### REQ-MENU-CONT-001 — Opciones de contenido

- **Requisito:** El sistema deberá permitir definir cada opción de contenido mediante exactamente una de estas formas: artículo de Inventario o receta. Para una receta, el administrador podrá seleccionar una receta existente de la biblioteca o definir una nueva durante la configuración de la opción. El administrador deberá poder activar o inactivar cada opción y asignarle una etiqueta contextual.
- **Criterio de aceptación:** Cada opción tiene un solo tipo de contenido: `INVENTORY_ITEM` o `RECIPE`. Toda opción de tipo receta referencia una receta de la biblioteca mediante su identificador y revisión, tanto si se seleccionó una receta existente como si se definió durante la configuración; una receta nueva queda guardada en la biblioteca. Una opción inactiva no se ofrece como nueva elección. Al inactivar o activar una opción, el sistema recalcula el estado del grupo: `ACTIVE` si queda al menos una opción `ACTIVE`, e `INACTIVE` si no queda ninguna. Si, como consecuencia, ningún `requiredSlot` permanece `ACTIVE`, el sistema inactiva automáticamente la oferta; si más tarde vuelve a haber un `requiredSlot` `ACTIVE`, no reactiva la oferta sin una acción administrativa. La oferta inactivada no altera el estado administrativo de la entrada, que se oculta si ya no tiene otra oferta `ACTIVE` y válida. La etiqueta contextual no cambia la identidad del artículo o receta a la que hace referencia.
- **Requisito:** El sistema deberá permitir definir cada opción de contenido mediante exactamente una de estas formas: artículo de Inventario o receta. Para una receta, el administrador podrá seleccionar una receta existente de la biblioteca o definir una nueva durante la configuración de la opción. El administrador deberá poder activar o inactivar cada opción y asignarle una etiqueta contextual.
- **Criterio de aceptación:** Cada opción tiene un solo tipo de contenido: `INVENTORY_ITEM` o `RECIPE`. Toda opción de tipo receta referencia una receta de la biblioteca mediante su identificador y revisión, tanto si se seleccionó una receta existente como si se definió durante la configuración; una receta nueva queda guardada en la biblioteca. Una opción inactiva no se ofrece como nueva elección. Al inactivar o activar una opción, el sistema recalcula el estado del grupo: `ACTIVE` si queda al menos una opción `ACTIVE`, e `INACTIVE` si no queda ninguna. Si, como consecuencia, ningún `requiredSlot` permanece `ACTIVE`, el sistema inactiva automáticamente la oferta; si más tarde vuelve a haber un `requiredSlot` `ACTIVE`, no reactiva la oferta sin una acción administrativa. La oferta inactivada no altera el estado administrativo de la entrada, que se oculta si ya no tiene otra oferta `ACTIVE` y válida. La etiqueta contextual no cambia la identidad del artículo o receta a la que hace referencia.

### REQ-MENU-CONT-002 — Uso directo de un artículo de Inventario

- **Requisito:** El sistema deberá permitir configurar una opción cuyo contenido sea un artículo de Inventario, indicando la cantidad y unidad del artículo. El nombre mostrado podrá describirse para ese contexto sin crear otra identidad de artículo.
- **Criterio de aceptación:** El contenido conserva la referencia al artículo de Inventario, la cantidad y la unidad, separadas de las rondas de selección definidas por `CompositionSlot.quantity`; el nombre contextual no sustituye la identidad administrada por Inventario.
- **Requisito:** El sistema deberá permitir configurar una opción cuyo contenido sea un artículo de Inventario, indicando la cantidad y unidad del artículo. El nombre mostrado podrá describirse para ese contexto sin crear otra identidad de artículo.
- **Criterio de aceptación:** El contenido conserva la referencia al artículo de Inventario, la cantidad y la unidad, separadas de las rondas de selección definidas por `CompositionSlot.quantity`; el nombre contextual no sustituye la identidad administrada por Inventario.

### REQ-MENU-CONT-003 — Selección de una receta para un slot
### REQ-MENU-CONT-003 — Selección de una receta para un slot

- **Requisito:** Al configurar un `CompositionSlot`, el sistema deberá permitir al administrador asignarle una receta de `RecipeLibrary` mediante una `SlotOption` de tipo `RECIPE`. Podrá seleccionar una receta existente por su identificador y revisión o crear una receta nueva durante el flujo de configuración; la definición nueva deberá guardarse en la biblioteca antes de quedar asignada.
- **Criterio de aceptación:** La opción configurada conserva `recipeId` y `recipeRevision` de la receta elegida o recién creada. La definición asignada no se modifica desde la opción; para cambiarla, el administrador edita la receta en la biblioteca.
- **Requisito:** Al configurar un `CompositionSlot`, el sistema deberá permitir al administrador asignarle una receta de `RecipeLibrary` mediante una `SlotOption` de tipo `RECIPE`. Podrá seleccionar una receta existente por su identificador y revisión o crear una receta nueva durante el flujo de configuración; la definición nueva deberá guardarse en la biblioteca antes de quedar asignada.
- **Criterio de aceptación:** La opción configurada conserva `recipeId` y `recipeRevision` de la receta elegida o recién creada. La definición asignada no se modifica desde la opción; para cambiarla, el administrador edita la receta en la biblioteca.

### REQ-MENU-REC-001 — Creación de recetas
### REQ-MENU-REC-001 — Creación de recetas

- **Requisito:** El sistema deberá permitir al administrador crear una receta en `RecipeLibrary` indicando su nombre, descripción, instrucciones en texto y una o más líneas de ingredientes seleccionados de Inventario. La creación podrá iniciarse desde la biblioteca o durante la configuración de una `SlotOption`.
- **Criterio de aceptación:** La receta creada conserva el nombre, la descripción, las instrucciones y las referencias a los `InventoryItem` seleccionados. La receta queda disponible en `RecipeLibrary` y puede asignarse a opciones de distintas ofertas.
- **Requisito:** El sistema deberá permitir al administrador crear una receta en `RecipeLibrary` indicando su nombre, descripción, instrucciones en texto y una o más líneas de ingredientes seleccionados de Inventario. La creación podrá iniciarse desde la biblioteca o durante la configuración de una `SlotOption`.
- **Criterio de aceptación:** La receta creada conserva el nombre, la descripción, las instrucciones y las referencias a los `InventoryItem` seleccionados. La receta queda disponible en `RecipeLibrary` y puede asignarse a opciones de distintas ofertas.

### REQ-MENU-REC-002 — Cantidad por ingrediente

- **Requisito:** Al crear o editar una receta, el sistema deberá permitir al administrador indicar la cantidad correspondiente a cada ingrediente de Inventario.
- **Criterio de aceptación:** Cada `ComponentIngredient` conserva la cantidad indicada para el artículo referenciado. Esta cantidad describe la receta y no se confunde con las rondas de selección definidas por `CompositionSlot.quantity`.

### REQ-MENU-REC-003 — Edición de recetas por revisión
### REQ-MENU-REC-002 — Cantidad por ingrediente

- **Requisito:** Al crear o editar una receta, el sistema deberá permitir al administrador indicar la cantidad correspondiente a cada ingrediente de Inventario.
- **Criterio de aceptación:** Cada `ComponentIngredient` conserva la cantidad indicada para el artículo referenciado. Esta cantidad describe la receta y no se confunde con las rondas de selección definidas por `CompositionSlot.quantity`.

### REQ-MENU-REC-003 — Edición de recetas por revisión

- **Requisito:** El sistema deberá permitir al administrador modificar una receta creada, incluidos su nombre, descripción, instrucciones y sus ingredientes. La edición de una receta publicada deberá crear una nueva revisión identificable.
- **Criterio de aceptación:** Las opciones que referencian una revisión anterior continúan usando esa definición sin cambios retroactivos. El administrador puede actualizar expresamente una opción para que use la nueva revisión.
- **Requisito:** El sistema deberá permitir al administrador modificar una receta creada, incluidos su nombre, descripción, instrucciones y sus ingredientes. La edición de una receta publicada deberá crear una nueva revisión identificable.
- **Criterio de aceptación:** Las opciones que referencian una revisión anterior continúan usando esa definición sin cambios retroactivos. El administrador puede actualizar expresamente una opción para que use la nueva revisión.

### REQ-MENU-REC-004 — Unidad de medida visible por ingrediente

- **Requisito:** Al seleccionar, consultar o editar un ingrediente de receta, el sistema deberá mostrar su unidad de medida autoritativa de Inventario.
- **Criterio de aceptación:** Cada línea de ingrediente muestra la unidad correspondiente al `InventoryItem` referenciado y la cantidad asociada. La visualización no cambia ni duplica la identidad o la unidad administrada por Inventario; las reglas de precisión, rangos y conversión se remiten a [OPEN-006](open.md).
### REQ-MENU-REC-004 — Unidad de medida visible por ingrediente

- **Requisito:** Al seleccionar, consultar o editar un ingrediente de receta, el sistema deberá mostrar su unidad de medida autoritativa de Inventario.
- **Criterio de aceptación:** Cada línea de ingrediente muestra la unidad correspondiente al `InventoryItem` referenciado y la cantidad asociada. La visualización no cambia ni duplica la identidad o la unidad administrada por Inventario; las reglas de precisión, rangos y conversión se remiten a [OPEN-006](open.md).

### REQ-MENU-REC-005 — Eliminación de una receta sin uso vigente
### REQ-MENU-REC-005 — Eliminación de una receta sin uso vigente

- **Requisito:** El sistema deberá permitir eliminar la definición vigente de una receta si y solo si ninguna opción de ninguna oferta vigente la referencia, cualquiera que sea el estado de la oferta o de la opción.
- **Criterio de aceptación:** Si una `SlotOption` de cualquier `CatalogOffer` vigente referencia el `recipeId`, la eliminación se rechaza íntegramente y no cambia la oferta, la opción ni la receta. Si no existe ninguna referencia vigente, se elimina la definición de la biblioteca y se conservan sus revisiones históricas publicadas.
- **Requisito:** El sistema deberá permitir eliminar la definición vigente de una receta si y solo si ninguna opción de ninguna oferta vigente la referencia, cualquiera que sea el estado de la oferta o de la opción.
- **Criterio de aceptación:** Si una `SlotOption` de cualquier `CatalogOffer` vigente referencia el `recipeId`, la eliminación se rechaza íntegramente y no cambia la oferta, la opción ni la receta. Si no existe ninguna referencia vigente, se elimina la definición de la biblioteca y se conservan sus revisiones históricas publicadas.
