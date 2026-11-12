# Requisitos Funcionales del Servicio Menu

Esta sección define las capacidades observables que el servicio Menu debe ofrecer para administrar el catálogo comercial. Los requisitos describen las necesidades del administrador y de quienes consultan el catálogo; las reglas de dominio relacionadas se enlazan en [business-rules.md](business-rules.md).

## Criterio común para imágenes

- Antes de crear una entrada o una oferta, el administrador carga la imagen en una operación previa e independiente. El sistema valida la imagen y le asigna un identificador; la creación del recurso requiere ese identificador como `imageId`, sin reenviar el archivo ni una URL.
- Al editar una entrada o actualizar una oferta, puede reemplazarse la imagen enviando como `imageId` el identificador de otra imagen previamente cargada y validada. Si se omite `imageId`, se conserva la imagen vigente.
- Solo se admiten JPEG, PNG y WebP, con tamaño máximo de 10 MiB y ancho y alto máximos de 4096 px cada uno. El servicio valida el contenido real del archivo, no solo el tipo declarado.
- Un archivo inválido o no decodificable, que exceda el tamaño o cualquiera de las dimensiones máximas, se rechaza durante la carga sin crear una imagen utilizable ni modificar recursos existentes.
- Un `imageId` inexistente, inválido o no accesible al solicitante se rechaza al crear o modificar el recurso. El rechazo es íntegro: no crea el recurso, no aplica cambios parciales y conserva la imagen vigente.
- La carga de la imagen es una operación independiente de su asociación. Un fallo posterior al crear o modificar el recurso no deshace la carga previa.

El flujo de imágenes queda acordado: carga previa y validada del archivo, con identificador asignado por el sistema, y asociación posterior mediante `imageId`. La alineación restante del contrato de API con la ERS, en operaciones y representación de datos, continúa pendiente de revisar los mockups y se registra en [OPEN-010](open.md).

## Categorías y entradas del catálogo

### REQ-MENU-CAT-001 — Administración de categorías

- **Requisito:** El sistema deberá permitir al administrador crear y editar categorías de un menú, indicando un nombre obligatorio y, opcionalmente, una descripción.
- **Criterio de aceptación:** El sistema acepta la creación de una categoría sin descripción. Al editar, omitir la descripción conserva el valor vigente y enviar una cadena vacía deja la categoría sin texto descriptivo. La categoría puede clasificarse en más de una entrada del mismo menú.

### REQ-MENU-CAT-002 — Consulta no administrativa del catálogo

- **Requisito:** El sistema deberá presentar a quien no tiene capacidad de administrar el catálogo las entradas `ACTIVE` y sus ofertas `ACTIVE`, con su `isAvailable` y su composición, de forma que se reconozcan la identidad comercial del producto y sus ofertas vendibles.
- **Criterio de aceptación:** Una entrada `INACTIVE` o `ARCHIVED` y una oferta `INACTIVE` no se presentan. Una entrada u oferta `ACTIVE` sin `isAvailable` se presenta deshabilitada y no se puede ordenar. La composición muestra la disponibilidad de cada slot y el `status` y la disponibilidad de cada opción; las opciones `INACTIVE` no se presentan como elegibles. Cada oferta presentada muestra su precio declarado y se distingue de las demás ofertas de su entrada. Cambiar el `status` de una entrada no cambia el de sus ofertas, ni el `status` de una oferta cambia el de su entrada. Quien administra el catálogo consulta los recursos en cualquier `status` (BR-MENU-033).

### REQ-MENU-ENTRY-001 — Creación de una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una entrada del catálogo indicando su nombre comercial, descripción, imagen y las categorías que correspondan dentro del mismo menú. Toda entrada nueva deberá iniciar inactiva.
- **Criterio de aceptación:** La creación requiere `imageId` de una imagen previamente cargada y validada, junto con los metadatos y las categorías seleccionadas. El sistema conserva esos datos y registra la entrada como inactiva, sin mostrarla a quien no administra el catálogo hasta una activación posterior del administrador.

### REQ-MENU-ENTRY-002 — Edición de una entrada

- **Requisito:** El sistema deberá permitir al administrador cambiar el nombre comercial, la descripción, la imagen y las categorías de una entrada existente.
- **Criterio de aceptación:** La imagen puede reemplazarse al editar enviando `imageId` de una nueva imagen previamente cargada y validada; si se omite, se conserva la imagen vigente. Tras guardar los cambios, la entrada muestra los valores actualizados y permanece asociada únicamente a categorías del menú al que pertenece.

### REQ-MENU-ENTRY-003 — Estado y archivado de una entrada

- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una entrada y archivarla de manera reversible desde los estados `ACTIVE` o `INACTIVE`. Desarchivar una entrada deberá dejarla en `INACTIVE` para que el administrador decida expresamente si vuelve a activarla. Estos cambios no modificarán automáticamente los estados de sus ofertas.
- **Criterio de aceptación:** El `status` de la entrada es administrativo y no cambia por el `status` ni por la disponibilidad de sus ofertas. Una entrada `ACTIVE` se muestra aunque no tenga ofertas disponibles; en ese caso aparece deshabilitada. Una entrada archivada no se muestra; al desarchivarla queda en `INACTIVE` y requiere una activación explícita posterior. Archivar, desarchivar, activar o inactivar la entrada no cambia el estado de sus ofertas.

### REQ-MENU-ENTRY-004 — Eliminación de una entrada archivada

- **Requisito:** El sistema deberá permitir eliminar definitivamente una entrada únicamente cuando se encuentre archivada.
- **Criterio de aceptación:** La eliminación de una entrada activa o inactiva se rechaza. Al eliminar una entrada archivada, se eliminan la entrada y sus definiciones poseídas.

## Ofertas y composición

### REQ-MENU-OFFER-001 — Creación de ofertas para una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una o más ofertas pertenecientes a una entrada del catálogo. Para cada oferta deberá indicar una etiqueta de presentación (`presentationTag`), un precio base y una imagen. Toda oferta nueva deberá iniciar inactiva.
- **Criterio de aceptación:** La creación de cada oferta requiere `presentationTag`, obligatorio y no nulo, e `imageId` de su imagen previamente cargada y validada. Una oferta no puede crearse sin `presentationTag`: se rechaza la creación si falta o no tiene valor. Una entrada puede tener varias ofertas con precios, etiquetas e imágenes propios. Al crear una oferta, queda inactiva hasta que el administrador la active.

### REQ-MENU-OFFER-002 — Identidad de entrada y presentación vendible

- **Requisito:** El sistema deberá presentar cada `CatalogEntry` con sus ofertas y permitir identificar cada `CatalogOffer` concreta como una oferta vendible seleccionable de forma independiente. La entrada conserva el nombre comercial autoritativo; la etiqueta de oferta distingue una presentación y puede aparecer junto al nombre de la entrada.
- **Criterio de aceptación:** Ninguna oferta queda preseleccionada por defecto y cada oferta concreta se identifica y puede seleccionarse de forma independiente. La información mostrada permite distinguir dos ofertas de la misma entrada sin duplicar ni alterar el nombre comercial de la entrada. La etiqueta describe la presentación y no sustituye la composición ni determina cantidades.

### REQ-MENU-OFFER-003 — Precio base declarado

- **Requisito:** El sistema deberá permitir al administrador fijar el precio base de cada oferta vendible. El precio será propio de esa oferta e independiente de los slots de su composición y de las opciones seleccionadas.
- **Criterio de aceptación:** Cambiar los slots u opciones de una oferta no suma automáticamente precios de componentes ni modifica su precio base. El precio consultado coincide con el que el administrador declaró para esa oferta.

### REQ-MENU-OFFER-004 — Activación de una oferta

- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una oferta. Para activarla, deberá exigir una composición estructuralmente válida (al menos un slot y cada slot con al menos una opción), sin exigir disponibilidad.
- **Criterio de aceptación:** Una oferta `INACTIVE` no se presenta a quien no administra el catálogo. Una oferta sin composición válida no puede activarse; con composición válida puede activarse aunque no tenga `isAvailable` o aunque su entrada esté `INACTIVE`, y solo se muestra cuando su entrada está `ACTIVE`. Una oferta `ACTIVE` sin `isAvailable` aparece deshabilitada y no se puede ordenar; recupera `isAvailable` sin intervención cuando todos sus slots vuelven a estar disponibles. El sistema nunca cambia el `status` de la oferta por disponibilidad: una oferta inactivada por el administrador permanece `INACTIVE` hasta que este la active. Cambiar el `status` de la oferta no modifica el de la entrada.

### REQ-MENU-OFFER-005 — Copia de composición desde una oferta del catálogo

- **Requisito:** Al configurar una oferta, el sistema deberá permitir seleccionar otra oferta del catálogo para copiar sus slots y opciones a la composición destino.
- **Criterio de aceptación:** La operación agrega a la composición destino copias locales editables de los slots y opciones configurados en la oferta seleccionada, conserva los slots que ya tuviera la composición destino y copia el `status` de las opciones de cada slot. El sistema recalcula `isAvailable` de los slots copiados y de la oferta destino. No conserva una referencia a la oferta de origen ni copia su precio base. Los cambios posteriores en cualquiera de las ofertas no sincronizan sus composiciones.

### REQ-MENU-OFFER-006 — Eliminación de una oferta

- **Requisito:** El sistema deberá permitir eliminar individualmente una oferta únicamente cuando esté inactiva.
- **Criterio de aceptación:** La eliminación de una oferta `ACTIVE` se rechaza sin cambios; la disponibilidad no interviene en esta decisión. Al eliminar una oferta `INACTIVE`, se eliminan la oferta y sus estructuras poseídas.

### REQ-MENU-COMP-001 — Composición de una oferta

- **Requisito:** El sistema deberá permitir definir para cada oferta una composición (`Composition`) formada por uno o más slots (`CompositionSlot`). Cada slot deberá poder identificarse por su función, como bebida o plato principal.
- **Criterio de aceptación:** Toda composición válida contiene al menos un slot. Todos los slots pertenecen estructuralmente a la composición de esa oferta.

### REQ-MENU-COMP-002 — Participación de slots

- **Requisito:** El sistema deberá conservar todos los slots definidos como miembros estructurales y obligatorios de la composición, que participan en la selección.
- **Criterio de aceptación:** Todo slot participa en la selección y genera sus rondas. Un slot sin `isAvailable` deja a la oferta sin `isAvailable`, y la oferta no se puede ordenar.

### REQ-MENU-COMP-003 — Opciones por slot

- **Requisito:** El sistema deberá permitir al administrador definir una o más opciones (`SlotOption`) de contenido para cada slot y activar o inactivar cada opción.
- **Criterio de aceptación:** Cada slot tiene al menos una opción. El slot tiene `isAvailable` si al menos una de sus opciones `ACTIVE` lo tiene. Una opción `INACTIVE` o sin `isAvailable` no puede seleccionarse. Si el slot tiene una sola opción `ACTIVE` con `isAvailable`, se utiliza directamente; si tiene varias, en cada ronda el cliente elige exactamente una de ellas.

### REQ-MENU-COMP-004 — Cantidad de rondas por slot

- **Requisito:** El sistema deberá permitir indicar en cada `CompositionSlot` cuántas rondas de selección comprende el slot.
- **Criterio de aceptación:** La cantidad pertenece al slot y no a sus opciones. Si un slot tiene cantidad 3, el cliente realiza tres rondas y en cada una elige exactamente una opción `ACTIVE` con `isAvailable` de ese slot.

### REQ-MENU-COMP-005 — Tiempo sugerido de servicio

- **Requisito:** El sistema deberá permitir configurar opcionalmente en un slot el curso sugerido de servicio, con uno de estos valores: entrada, plato fuerte, postre o bebida.
- **Criterio de aceptación:** Si se informa el curso, el sistema acepta exactamente entrada, plato fuerte, postre o bebida y rechaza cualquier otro valor. El curso aceptado se muestra asociado al slot como sugerencia de tiempo de servicio y no cambia sus opciones, sus rondas de selección ni el precio.

### REQ-MENU-COMP-006 — Actualización de la composición de una oferta

- **Requisito:** El sistema deberá permitir al administrador actualizar parcialmente la composición de una oferta. Los datos omitidos de un elemento conservan sus valores vigentes, y un slot u opción indicado con su identificador existente se actualiza parcialmente. Si se omite la lista de slots de la composición o la de opciones de un slot, se conserva la lista vigente; si se incluye, reemplaza la lista completa y elimina los elementos vigentes que no aparezcan en ella. Los slots y opciones nuevos se indican sin identificador y el sistema les asigna uno. Un slot nuevo requiere nombre, cantidad y al menos una opción; una opción nueva requiere `displayName`, `status` y origen de contenido. Cada actualización deberá indicar la versión vigente de la composición sobre la que se realiza.
- **Criterio de aceptación:** Se rechazan las listas vacías; los identificadores duplicados, desconocidos o pertenecientes a otro recurso; los slots nuevos sin nombre, cantidad u opciones; y las opciones nuevas sin `displayName`, `status` u origen de contenido. También se rechaza la actualización que no indica la versión de la composición o que indica una versión desactualizada. Cualquier rechazo deja íntegra la composición, sin aplicar cambios parciales. Una actualización aceptada recalcula `isAvailable` de cada slot, de la oferta y de la entrada, sin cambiar el `status` de la oferta ni el de la entrada.

## Contenido y recetas

### REQ-MENU-CONT-001 — Opciones de contenido

- **Requisito:** El sistema deberá permitir definir cada opción de contenido mediante exactamente una de estas formas: artículo de Inventario o receta. Para una receta, el administrador podrá seleccionar una receta existente de la biblioteca o definir una nueva durante la configuración de la opción. El administrador deberá poder activar o inactivar cada opción y asignarle una etiqueta contextual.
- **Criterio de aceptación:** Cada opción tiene un solo tipo de contenido: `INVENTORY_ITEM` o `RECIPE`. Toda opción de tipo receta se asigna mediante el identificador de una receta de la biblioteca, sin que el administrador indique una revisión, y usa siempre la revisión vigente de esa receta, tanto si se seleccionó una receta existente como si se definió durante la configuración; una receta nueva queda guardada en la biblioteca antes de su asignación. Una opción inactiva no se ofrece como nueva elección. Al inactivar o activar una opción, el sistema recalcula `isAvailable` de su slot, de la oferta y de la entrada, sin cambiar el `status` de ninguno de ellos. La etiqueta contextual no cambia la identidad del artículo o receta a la que hace referencia.

### REQ-MENU-CONT-002 — Uso directo de un artículo de Inventario

- **Requisito:** El sistema deberá permitir configurar una opción cuyo contenido sea un artículo de Inventario, indicando la cantidad y unidad del artículo. El nombre mostrado podrá describirse para ese contexto sin crear otra identidad de artículo.
- **Criterio de aceptación:** El contenido conserva la referencia al artículo de Inventario, la cantidad y la unidad, separadas de las rondas de selección definidas por `CompositionSlot.quantity`; el nombre contextual no sustituye la identidad administrada por Inventario.

### REQ-MENU-CONT-003 — Selección de una receta para un slot

- **Requisito:** Al configurar un `CompositionSlot`, el sistema deberá permitir al administrador asignarle una receta de `RecipeLibrary` mediante una `SlotOption` de tipo `RECIPE`. Podrá seleccionar una receta existente solo por su identificador o crear una receta nueva durante el flujo de configuración; la definición nueva deberá guardarse en la biblioteca antes de quedar asignada. La opción deberá usar siempre la revisión vigente de la receta asignada.
- **Criterio de aceptación:** La selección requiere únicamente `recipeId`; la opción no indica ninguna revisión. Una receta inexistente se rechaza sin aplicar cambios parciales. Al actualizar una opción que ya usa `RECIPE`, omitir `recipeId` conserva la receta asignada. La definición asignada no se modifica desde la opción; para cambiarla, el administrador edita la receta en la biblioteca, y la revisión nueva se aplica a la opción de inmediato (REQ-MENU-REC-003).

### REQ-MENU-REC-001 — Creación de recetas

- **Requisito:** El sistema deberá permitir al administrador crear una receta en `RecipeLibrary` indicando su nombre, descripción, instrucciones en texto y una o más líneas de ingredientes seleccionados de Inventario. La creación podrá iniciarse desde la biblioteca o durante la configuración de una `SlotOption`.
- **Criterio de aceptación:** La receta creada conserva el nombre, la descripción, las instrucciones y las referencias a los `InventoryItem` seleccionados. La receta queda disponible en `RecipeLibrary` y puede asignarse a opciones de distintas ofertas.

### REQ-MENU-REC-002 — Cantidad por ingrediente

- **Requisito:** Al crear o editar una receta, el sistema deberá permitir al administrador indicar la cantidad correspondiente a cada ingrediente de Inventario.
- **Criterio de aceptación:** Cada `ComponentIngredient` conserva la cantidad indicada para el artículo referenciado. Esta cantidad describe la receta y no se confunde con las rondas de selección definidas por `CompositionSlot.quantity`.

### REQ-MENU-REC-003 — Edición de recetas por revisión

- **Requisito:** El sistema deberá permitir al administrador modificar una receta creada, incluidos su nombre, descripción, instrucciones y sus ingredientes. Cada edición deberá crear una nueva revisión identificable, con el número siguiente al de la vigente, que pasa a ser la revisión vigente.
- **Criterio de aceptación:** Una receta nueva se crea con la revisión 1 y cada edición aceptada incrementa su número de revisión en 1. Todas las opciones vigentes que referencian la receta usan la revisión nueva de inmediato, sin reasignarla, y su `isAvailable` se recalcula según los eventos de factibilidad de Inventario (BR-MENU-034). Las revisiones anteriores se conservan como historial consultable.

### REQ-MENU-REC-004 — Unidad de medida visible por ingrediente

- **Requisito:** Al seleccionar, consultar o editar un ingrediente de receta, el sistema deberá mostrar su unidad de medida autoritativa de Inventario.
- **Criterio de aceptación:** Cada línea de ingrediente muestra la unidad correspondiente al `InventoryItem` referenciado y la cantidad asociada. La visualización no cambia ni duplica la identidad o la unidad administrada por Inventario; las reglas de precisión, rangos y conversión se remiten a [OPEN-006](open.md).

### REQ-MENU-REC-005 — Eliminación de una receta sin uso vigente

- **Requisito:** El sistema deberá permitir eliminar la definición vigente de una receta si y solo si ninguna opción de ninguna oferta la referencia, cualquiera que sea el estado de la oferta o de la opción.
- **Criterio de aceptación:** Si una `SlotOption` de cualquier `CatalogOffer` referencia el `recipeId`, la eliminación se rechaza íntegramente y no cambia la oferta, la opción ni la receta. Si no existe ninguna referencia vigente, se elimina la definición de la biblioteca y se conserva su historial de revisiones.

## Integración con Inventario

Menu e Inventario intercambian eventos asíncronos conforme a BR-MENU-034; el contrato de esos eventos queda pendiente en [OPEN-011](open.md).

### REQ-MENU-AVAIL-001 — Recepción de eventos de disponibilidad de Inventario

- **Requisito:** El sistema deberá consumir los eventos de Inventario que comunican que una receta deja de poder elaborarse o vuelve a poder elaborarse, o que un artículo deja de estar disponible o vuelve a estarlo. Con cada evento deberá recalcular `isAvailable` de las opciones `RECIPE` e `INVENTORY_ITEM` afectadas y, en cascada, de sus slots, ofertas y entradas.
- **Criterio de aceptación:** Tras un evento que marca una receta como no factible, toda opción que la referencia queda sin `isAvailable`; si era la única opción `ACTIVE` disponible de su slot, el slot y la oferta quedan sin `isAvailable` y la oferta aparece deshabilitada. Un evento posterior que la marca como factible restaura `isAvailable` sin intervención administrativa, y lo mismo aplica a los artículos de Inventario. Ningún evento cambia el `status`. El formato, la identificación de receta y revisión, la idempotencia, el orden y el valor inicial se rigen por [OPEN-011](open.md).

### REQ-MENU-AVAIL-002 — Emisión de eventos de receta para Inventario

- **Requisito:** El sistema deberá emitir un evento al crear una receta, al crear una nueva revisión y al eliminar su definición vigente, para que Inventario mantenga su copia local.
- **Criterio de aceptación:** Cada creación, revisión o eliminación aceptada emite un evento que identifica la receta afectada. El contenido y el formato del evento quedan pendientes en [OPEN-011](open.md).
