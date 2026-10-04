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

- **Requisito:** El sistema deberá presentar las entradas `ACTIVE` y sus ofertas `ACTIVE` que cumplan las condiciones de publicación del catálogo. Una oferta solo se presenta cuando su entrada está `ACTIVE` y la oferta es válida. La presentación deberá permitir reconocer cuál es la identidad comercial del producto y cuáles son sus ofertas vendibles.
- **Criterio de aceptación:** Una entrada incompleta, `INACTIVE` o `ARCHIVED` no se presenta como vigente. Una entrada `ACTIVE` debe disponer de al menos una oferta `ACTIVE` y válida; cada oferta presentada está `ACTIVE`, tiene una composición válida y muestra su precio declarado. Las ofertas de una misma entrada se distinguen entre sí. Cambiar el estado administrativo de una entrada no modifica automáticamente el estado de sus ofertas, ni viceversa.

### REQ-MENU-ENTRY-001 — Creación de una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una entrada del catálogo indicando su nombre comercial, descripción, imagen y las categorías que correspondan dentro del mismo menú. Toda entrada nueva deberá iniciar inactiva.
- **Criterio de aceptación:** La creación requiere la imagen junto con los metadatos y las categorías seleccionadas. El sistema conserva esos datos y registra la entrada como inactiva, sin publicarla hasta una activación posterior del administrador.

### REQ-MENU-ENTRY-002 — Edición de una entrada

- **Requisito:** El sistema deberá permitir al administrador cambiar el nombre comercial, la descripción, la imagen y las categorías de una entrada existente.
- **Criterio de aceptación:** La imagen puede reemplazarse al editar; si no se cambia, se conserva la imagen vigente. Tras guardar los cambios, la entrada muestra los valores actualizados y permanece asociada únicamente a categorías del menú al que pertenece.

### REQ-MENU-ENTRY-003 — Estado y archivado de una entrada

- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una entrada y archivarla de manera reversible desde los estados `ACTIVE` o `INACTIVE`. Desarchivar una entrada deberá dejarla en `INACTIVE` para que el administrador decida expresamente si vuelve a activarla. Estos cambios no modificarán automáticamente los estados administrativos de sus ofertas.
- **Criterio de aceptación:** El sistema rechaza activar una entrada si no dispone de al menos una oferta `ACTIVE` y válida. Una entrada solo se publica en estado `ACTIVE` y cuando cumple esa condición. Una entrada archivada no se publica; al desarchivarla queda en `INACTIVE` y requiere una activación explícita posterior. Archivar, desarchivar, activar o inactivar la entrada no cambia el estado de sus ofertas.

### REQ-MENU-ENTRY-004 — Eliminación de una entrada archivada

- **Requisito:** El sistema deberá permitir eliminar definitivamente una entrada únicamente cuando se encuentre archivada y ninguna de sus ofertas mantenga referencias vigentes externas desde otras definiciones del catálogo.
- **Criterio de aceptación:** La eliminación de una entrada activa o inactiva se rechaza. Si alguna de las ofertas de una entrada archivada es utilizada por un `CatalogOfferSource` u otra referencia vigente que requiera su existencia, la eliminación se rechaza sin realizar modificaciones parciales y se informa qué dependencias la impiden. Cuando no existen dichas referencias, se eliminan la entrada y sus definiciones vigentes poseídas. Las revisiones históricas publicadas permanecen intactas y consultables.

## Ofertas y composición

### REQ-MENU-OFFER-001 — Creación de ofertas para una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una o más ofertas pertenecientes a una entrada del catálogo. Para cada oferta deberá poder indicar una etiqueta de presentación opcional, un precio base y una imagen. Toda oferta nueva deberá iniciar inactiva.
- **Criterio de aceptación:** La creación de cada oferta requiere su imagen. Una entrada puede tener varias ofertas con precios, etiquetas e imágenes propios. Al crear una oferta, queda inactiva hasta que el administrador la active.

### REQ-MENU-OFFER-002 — Identidad de entrada y presentación vendible

- **Requisito:** El sistema deberá presentar con claridad la diferencia entre una entrada y cada una de sus ofertas. La entrada conserva el nombre comercial autoritativo; la etiqueta de oferta distingue una presentación y puede aparecer junto al nombre de la entrada.
- **Criterio de aceptación:** La información mostrada permite distinguir dos ofertas de la misma entrada sin duplicar ni alterar el nombre comercial de la entrada. La etiqueta describe la presentación y no sustituye la composición ni determina cantidades.

### REQ-MENU-OFFER-003 — Precio base declarado

- **Requisito:** El sistema deberá permitir al administrador fijar el precio base de cada oferta vendible. El precio será propio de esa oferta e independiente de qué posiciones o contenidos se incluyan o elijan.
- **Criterio de aceptación:** Cambiar las posiciones u opciones de una oferta no suma automáticamente precios de componentes ni modifica su precio base. El precio consultado coincide con el que el administrador declaró para esa oferta.

### REQ-MENU-OFFER-004 — Activación de una oferta

- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una oferta. Para activarla, deberá exigir que tenga una composición válida.
- **Criterio de aceptación:** Una oferta `INACTIVE` no se presenta como alternativa vigente. Una oferta sin composición válida no puede activarse; una oferta con composición válida puede activarse mediante una acción administrativa, incluso mientras su entrada está `INACTIVE`, pero no se publica hasta que la entrada esté `ACTIVE`. Una oferta solo se publica si tanto ella como su entrada están en estado `ACTIVE`, y la entrada `ACTIVE` conserva al menos una oferta `ACTIVE` y válida. El sistema rechaza inactivar la única oferta `ACTIVE` y válida de una entrada `ACTIVE`; el administrador debe inactivar la entrada de forma explícita antes. Cambiar el estado de la oferta no modifica automáticamente el de su entrada, ni viceversa.

### REQ-MENU-OFFER-005 — Referencia a una oferta reutilizada

- **Requisito:** Cuando una oferta se utilice como contenido dentro de otra, el sistema deberá identificar la revisión publicada concreta de la oferta referenciada.
- **Criterio de aceptación:** La actualización de la oferta referenciada produce una revisión nueva y no cambia por sí sola las composiciones ya publicadas que utilizan una revisión anterior. Las revisiones publicadas previamente permanecen intactas y consultables.

### REQ-MENU-OFFER-006 — Eliminación de una oferta

- **Requisito:** El sistema deberá permitir eliminar individualmente una oferta únicamente cuando esté inactiva y no mantenga referencias vigentes externas.
- **Criterio de aceptación:** La eliminación de una oferta activa se rechaza. También se rechaza si la oferta es utilizada por un `CatalogOfferSource` o si corresponde al `defaultOfferId` de su entrada. La operación no modifica automáticamente los recursos que la referencian. Si no existen dependencias impeditivas, se elimina la definición vigente de la oferta y sus estructuras poseídas. Sus revisiones históricas publicadas permanecen intactas y consultables.

### REQ-MENU-COMP-001 — Composición de una oferta

- **Requisito:** El sistema deberá permitir definir para cada oferta una composición con una o más posiciones. Cada posición deberá poder identificarse por su función, como primera pizza, bebida o plato principal.
- **Criterio de aceptación:** Toda oferta válida contiene al menos una posición, incluso cuando representa un producto individual. Las posiciones pertenecen a la composición de esa oferta.

### REQ-MENU-COMP-002 — Inclusión de posiciones

- **Requisito:** El sistema deberá permitir indicar si todas las posiciones de una oferta se incluyen automáticamente o si el cliente puede elegir entre posiciones elegibles. Cuando haya elección, el administrador deberá poder marcar posiciones obligatorias y establecer el mínimo y máximo de las demás posiciones que pueden incluirse.
- **Criterio de aceptación:** Si no se permite elegir posiciones, todas quedan incluidas y no se aplican límites de elección. Si se permite elegir, las posiciones obligatorias siempre se incluyen y no cuentan para el mínimo ni el máximo; esos límites se aplican solo a las demás posiciones elegibles.

### REQ-MENU-COMP-003 — Alternativas de contenido por posición

- **Requisito:** El sistema deberá permitir al administrador definir una o más alternativas de contenido (`ComponentOption`) para cada posición. Para cada posición incluida deberá quedar seleccionada exactamente una de sus alternativas; si hay varias, el cliente podrá elegir una para esa posición.
- **Criterio de aceptación:** Elegir si una posición se incluye es una decisión distinta de elegir qué contenido ocupa esa posición. Una posición obligatoria que tenga varias alternativas sigue permitiendo elegir su contenido.

### REQ-MENU-COMP-004 — Cantidad incluida por posición

- **Requisito:** El sistema deberá permitir indicar cuántas unidades del contenido incluye una posición.
- **Criterio de aceptación:** La cantidad se muestra asociada a su posición.

### REQ-MENU-COMP-005 — Tiempo sugerido de servicio

- **Requisito:** El sistema deberá permitir asociar a una posición el tiempo de servicio sugerido, por ejemplo, entrada, plato fuerte, postre o bebida.
- **Criterio de aceptación:** La sugerencia se muestra asociada a la posición y no cambia su inclusión, contenido, cantidad ni precio.

### REQ-MENU-COMP-006 — Ubicación espacial descriptiva

- **Requisito:** El sistema deberá permitir nombrar ubicaciones o regiones de una composición y asociarlas a posiciones, para describir dónde se ubica un contenido, por ejemplo, izquierda, derecha u orilla.
- **Criterio de aceptación:** La ubicación se conserva como una etiqueta descriptiva asociada a la posición. No determina si la posición es obligatoria ni calcula cobertura o consumo de ingredientes.

## Contenido y recetas

### REQ-MENU-CONT-001 — Alternativas de contenido

- **Requisito:** El sistema deberá permitir definir cada alternativa de contenido mediante exactamente una de estas formas: preparación definida directamente para esa alternativa, artículo de Inventario, receta reutilizable o referencia a otra oferta del catálogo. El administrador deberá poder activar o inactivar cada alternativa y asignarle una etiqueta contextual.
- **Criterio de aceptación:** Cada alternativa tiene un solo tipo de contenido. Una alternativa inactiva no se ofrece como nueva elección. Su etiqueta contextual no cambia la identidad del artículo, receta u oferta a la que hace referencia.

### REQ-MENU-CONT-002 — Uso directo de un artículo de Inventario

- **Requisito:** El sistema deberá permitir seleccionar como contenido un artículo de Inventario e indicar la cantidad y unidad correspondientes. El nombre mostrado podrá describirse para ese contexto sin crear otra identidad de artículo.
- **Criterio de aceptación:** El contenido conserva la referencia al artículo de Inventario, la cantidad y la unidad; el nombre contextual no sustituye la identidad administrada por Inventario.

### REQ-MENU-CONT-003 — Preparación definida en una alternativa

- **Requisito:** El sistema deberá permitir al administrador definir directamente en una alternativa la preparación que compone su contenido, incluyendo los ingredientes o preparaciones reutilizables y sus cantidades.
- **Criterio de aceptación:** La preparación queda asociada a esa alternativa y puede describirse sin convertir sus ingredientes de Inventario en identidades propiedad del catálogo.

### REQ-MENU-CONT-004 — Otra oferta como contenido

- **Requisito:** El sistema deberá permitir usar una oferta existente como contenido de una posición en otra oferta. La oferta referenciada conservará su composición.
- **Criterio de aceptación:** La oferta hija se reconoce como contenido reutilizado y su precio base no se suma automáticamente al precio base de la oferta que la contiene. La eliminación de la oferta o de su entrada propietaria se rechaza mientras exista esta referencia vigente, sin modificar la composición que la contiene.

### REQ-MENU-REC-001 — Biblioteca de recetas reutilizables

- **Requisito:** El sistema deberá permitir al administrador crear y mantener una biblioteca de recetas reutilizables. Cada receta deberá poder tener una o más líneas con cantidades y unidades, referidas a artículos de Inventario o a otras recetas reutilizables.
- **Criterio de aceptación:** Una receta de biblioteca puede utilizarse desde distintas ofertas y productos. Una línea identifica un único artículo de Inventario o una receta reutilizable, con su cantidad y unidad.

### REQ-MENU-REC-002 — Uso y ajuste local de una receta

- **Requisito:** El sistema deberá permitir usar una receta publicada de la biblioteca tal como está o declarar ajustes administrativos propios de la alternativa que la utiliza.
- **Criterio de aceptación:** Un ajuste local permite añadir, retirar, cambiar la cantidad o sustituir un artículo de Inventario cuando la operación corresponda; queda limitado a esa alternativa y no cambia la receta de biblioteca ni otros usos.

### REQ-MENU-REC-003 — Edición de recetas sin cambio retroactivo

- **Requisito:** El sistema deberá conservar revisiones identificables de las recetas reutilizables. Editar una receta publicada deberá crear una nueva revisión, sin alterar la revisión que ya utilizan ofertas existentes hasta que su administrador actualice expresamente esa referencia.
- **Criterio de aceptación:** Después de editar y publicar una receta, una oferta que apuntaba a la revisión anterior conserva el contenido previamente referenciado; una oferta puede actualizarse para utilizar la nueva revisión mediante una acción administrativa.
