# Requisitos Funcionales del Servicio Menu

Esta sección define las capacidades observables que el servicio Menu debe ofrecer para administrar el catálogo comercial. Los requisitos describen las necesidades del administrador y de quienes consultan el catálogo; las reglas de dominio relacionadas se enlazan en [business-rules.md](business-rules.md).

## Categorías y entradas del catálogo

### REQ-MENU-CAT-001 — Administración de categorías

- **Requisito:** El sistema deberá permitir al administrador crear y editar categorías de un menú, indicando su nombre y descripción.
- **Criterio de aceptación:** Una categoría creada o editada conserva el nombre y la descripción indicados y puede clasificarse en más de una entrada del mismo menú.

### REQ-MENU-CAT-002 — Consulta del catálogo publicable

- **Requisito:** El sistema deberá presentar las entradas y ofertas que estén activas y cumplan las condiciones de publicación del catálogo. La presentación deberá permitir reconocer cuál es la identidad comercial del producto y cuáles son sus ofertas vendibles.
- **Criterio de aceptación:** Una entrada incompleta o inactiva no se presenta como oferta vigente. Una entrada activa con una oferta válida presenta esa oferta y su precio declarado; las ofertas de una misma entrada se distinguen entre sí.

### REQ-MENU-ENTRY-001 — Creación de una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una entrada del catálogo indicando su nombre comercial, descripción, imagen y las categorías que correspondan dentro del mismo menú. Toda entrada nueva deberá iniciar inactiva.
- **Criterio de aceptación:** Al crear una entrada con esos datos, el sistema conserva los datos y las categorías seleccionadas y la registra como inactiva, sin publicarla hasta una activación posterior del administrador.

### REQ-MENU-ENTRY-002 — Edición de una entrada

- **Requisito:** El sistema deberá permitir al administrador cambiar el nombre comercial, la descripción, la imagen y las categorías de una entrada existente.
- **Criterio de aceptación:** Tras guardar los cambios, la entrada muestra los valores actualizados y permanece asociada únicamente a categorías del menú al que pertenece.

### REQ-MENU-ENTRY-003 — Estado y archivado de una entrada

- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una entrada y archivarla de manera reversible. Desarchivar una entrada deberá dejarla inactiva para que el administrador decida expresamente si vuelve a activarla.
- **Criterio de aceptación:** Una entrada activa solo se publica si tiene al menos una oferta válida. Una entrada archivada no se publica; al desarchivarla queda inactiva y requiere una activación explícita posterior.

### REQ-MENU-ENTRY-004 — Eliminación de una entrada archivada

- **Requisito:** El sistema deberá permitir eliminar definitivamente una entrada solo si está archivada. Antes de eliminar sus ofertas, deberá localizar las referencias vigentes a cualquiera de ellas, tanto en el origen de una `ComponentOption` como en una `AddOption`. Deberá desactivar en lote cada `ComponentOption` contenedora y sustituir cada referencia vigente por una copia local `INLINE` de la composición completa de la revisión de oferta que esa referencia tenía fijada. Solo después de completar todas las sustituciones podrá eliminar la entrada y sus ofertas vigentes.
- **Criterio de aceptación:** La eliminación de una entrada activa o inactiva se rechaza. Para una entrada archivada, la operación termina íntegramente o no aplica ningún cambio: las opciones afectadas quedan inactivas, las composiciones copiadas conservan slots, alternativas y personalizaciones, no queda ninguna referencia vigente a las ofertas eliminadas y las ofertas contenedoras tienen nuevas revisiones. Las revisiones históricas publicadas permanecen intactas y las fotografías de las ofertas eliminadas que necesitan siguen siendo consultables.

## Ofertas y composición

### REQ-MENU-OFFER-001 — Creación de ofertas para una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una o más ofertas pertenecientes a una entrada del catálogo. Para cada oferta deberá poder indicar una etiqueta de presentación opcional, un precio base y una imagen. Toda oferta nueva deberá iniciar inactiva.
- **Criterio de aceptación:** Una entrada puede tener varias ofertas con precios, etiquetas e imágenes propios. Al crear una oferta, queda inactiva hasta que el administrador la active.

### REQ-MENU-OFFER-002 — Identidad de entrada y presentación vendible

- **Requisito:** El sistema deberá presentar con claridad la diferencia entre una entrada y cada una de sus ofertas. La entrada conserva el nombre comercial autoritativo; la etiqueta de oferta distingue una presentación y puede aparecer junto al nombre de la entrada.
- **Criterio de aceptación:** La información mostrada permite distinguir dos ofertas de la misma entrada sin duplicar ni alterar el nombre comercial de la entrada. La etiqueta describe la presentación y no sustituye la composición ni determina cantidades.

### REQ-MENU-OFFER-003 — Precio base declarado

- **Requisito:** El sistema deberá permitir al administrador fijar el precio base de cada oferta vendible. El precio será propio de esa oferta e independiente de qué posiciones o contenidos se incluyan o elijan.
- **Criterio de aceptación:** Cambiar las posiciones u opciones de una oferta no suma automáticamente precios de componentes ni modifica su precio base. El precio consultado coincide con el que el administrador declaró para esa oferta.

### REQ-MENU-OFFER-004 — Activación de una oferta

- **Requisito:** El sistema deberá permitir al administrador activar o inactivar una oferta. Para activarla, deberá exigir que tenga una composición válida.
- **Criterio de aceptación:** Una oferta inactiva no se presenta como alternativa vigente. Una oferta sin composición válida no puede activarse; una oferta válida puede activarse mediante una acción administrativa.

### REQ-MENU-OFFER-005 — Referencia a una oferta reutilizada

- **Requisito:** Cuando una oferta se utilice como contenido dentro de otra, el sistema deberá permitir identificar la versión publicada de la oferta referenciada que forma parte de la composición.
- **Criterio de aceptación:** Una actualización de la oferta referenciada no cambia por sí sola la composición publicada que ya la utiliza; cualquier adopción de una versión posterior queda identificada. Tras eliminar la entrada propietaria, las referencias históricas conservan la revisión fijada y la fotografía correspondiente permanece consultable.

### REQ-MENU-COMP-001 — Composición de una oferta

- **Requisito:** El sistema deberá permitir definir para cada oferta una composición con una o más posiciones. Cada posición deberá poder identificarse por su función, como primera pizza, bebida o plato principal.
- **Criterio de aceptación:** Toda oferta válida contiene al menos una posición, incluso cuando representa un producto individual. Las posiciones pertenecen a la composición de esa oferta.

### REQ-MENU-COMP-002 — Inclusión de posiciones

- **Requisito:** El sistema deberá permitir indicar si todas las posiciones de una oferta se incluyen automáticamente o si el cliente puede elegir entre posiciones elegibles. Cuando haya elección, el administrador deberá poder marcar posiciones obligatorias y establecer el mínimo y máximo de las demás posiciones que pueden incluirse.
- **Criterio de aceptación:** Si no se permite elegir posiciones, todas quedan incluidas y no se aplican límites de elección. Si se permite elegir, las posiciones obligatorias siempre se incluyen y no cuentan para el mínimo ni el máximo; esos límites se aplican solo a las demás posiciones elegibles.

### REQ-MENU-COMP-003 — Alternativas de contenido por posición

- **Requisito:** El sistema deberá permitir al administrador definir una o más alternativas de contenido para cada posición. Para una posición incluida deberá quedar determinada una de sus alternativas; si hay varias, el cliente podrá elegir exactamente una para esa posición.
- **Criterio de aceptación:** Elegir si una posición se incluye es una decisión distinta de elegir qué contenido ocupa esa posición. Una posición obligatoria que tenga varias alternativas sigue permitiendo elegir su contenido.

### REQ-MENU-COMP-004 — Cantidad incluida por posición

- **Requisito:** El sistema deberá permitir indicar cuántas unidades del contenido incluye una posición. Cuando unidades iguales deban personalizarse por separado, el administrador deberá poder representarlas como posiciones independientes.
- **Criterio de aceptación:** La cantidad se muestra asociada a su posición. Dos unidades destinadas a recibir personalizaciones independientes se identifican en posiciones distintas.

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

- **Requisito:** El sistema deberá permitir usar una oferta existente como contenido de una posición en otra oferta. La oferta referenciada conservará su composición y sus posibilidades de personalización propias.
- **Criterio de aceptación:** La oferta hija se reconoce como contenido reutilizado y su precio base no se suma automáticamente al precio base de la oferta que la contiene. Si se elimina la entrada propietaria de la oferta hija, cada uso vigente se materializa como contenido local `INLINE` con una copia de la composición completa de su revisión fijada, sin aplanarla como receta.

### REQ-MENU-REC-001 — Biblioteca de recetas reutilizables

- **Requisito:** El sistema deberá permitir al administrador crear y mantener una biblioteca de recetas reutilizables. Cada receta deberá poder describir su rendimiento, unidad de rendimiento y una o más líneas con cantidades y unidades, referidas a artículos de Inventario o a otras recetas reutilizables.
- **Criterio de aceptación:** Una receta de biblioteca puede utilizarse desde distintas ofertas y productos. Una línea identifica un único artículo de Inventario o una receta reutilizable, con su cantidad y unidad.

### REQ-MENU-REC-002 — Uso y ajuste local de una receta

- **Requisito:** El sistema deberá permitir usar una receta publicada de la biblioteca tal como está o declarar ajustes administrativos propios de la alternativa que la utiliza.
- **Criterio de aceptación:** Un ajuste local permite añadir, retirar, cambiar la cantidad o sustituir un artículo de Inventario cuando la operación corresponda; queda limitado a esa alternativa y no cambia la receta de biblioteca ni otros usos.

### REQ-MENU-REC-003 — Edición de recetas sin cambio retroactivo

- **Requisito:** El sistema deberá conservar revisiones identificables de las recetas reutilizables. Editar una receta publicada deberá crear una nueva revisión, sin alterar la revisión que ya utilizan ofertas existentes hasta que su administrador actualice expresamente esa referencia.
- **Criterio de aceptación:** Después de editar y publicar una receta, una oferta que apuntaba a la revisión anterior conserva el contenido previamente referenciado; una oferta puede actualizarse para utilizar la nueva revisión mediante una acción administrativa.

## Personalizaciones

### REQ-MENU-PERS-001 — Personalizaciones de una alternativa

- **Requisito:** El sistema deberá permitir declarar personalizaciones opcionales para cada alternativa de contenido, de modo que dos apariciones del mismo artículo, receta u oferta puedan tener opciones distintas. Deberá permitir nombrar los grupos y las alternativas para que se entiendan en su contexto.
- **Criterio de aceptación:** Las personalizaciones quedan asociadas a una sola aparición. Modificar las de una alternativa no cambia las personalizaciones de otra que comparta el mismo contenido de origen.

### REQ-MENU-PERS-002 — Cambios a ingredientes de una receta

- **Requisito:** Cuando la alternativa tenga una receta efectiva, el administrador deberá poder ofrecer cambios de cantidad o eliminación para líneas directas de artículos de Inventario ya presentes en esa receta.
- **Criterio de aceptación:** Cada cambio identifica inequívocamente una línea existente de la receta efectiva. No se usa esta opción para modificar líneas internas de una oferta hija ni de una subreceta referenciada.

### REQ-MENU-PERS-003 — Opciones para agregar contenido

- **Requisito:** El sistema deberá permitir definir grupos de contenido adicional para una alternativa ya incluida, con límites de cuántas opciones adicionales pueden elegirse. Cada opción podrá referirse a un artículo de Inventario, una receta reutilizable o una oferta del catálogo, o contener una copia local `INLINE` de la composición de una oferta materializada, y declarar su ajuste de precio; cuando corresponda, también su cantidad y unidad.
- **Criterio de aceptación:** Los límites del grupo rigen solo la selección de contenido adicional y no alteran las reglas de inclusión de posiciones. Cada opción tiene un único modo de contenido. Si apuntaba a una oferta de una entrada eliminada, conserva `priceDelta` y sustituye el destino por una copia local de la composición de la revisión fijada; la `ComponentOption` que contiene la personalización queda inactiva.

### REQ-MENU-PERS-004 — Sustitución de un ingrediente

- **Requisito:** Cuando la alternativa tenga una receta efectiva, el administrador deberá poder señalar una línea directa de artículo de Inventario que pueda sustituirse y definir uno o más artículos de Inventario como reemplazo, con la cantidad, unidad y ajuste de precio aplicables.
- **Criterio de aceptación:** Cada grupo de reemplazo identifica la línea de ingrediente que sustituye. Los reemplazos son artículos de Inventario y no recetas ni ofertas completas.

### REQ-MENU-PERS-005 — Instrucciones de preparación

- **Requisito:** El sistema deberá permitir definir grupos de instrucciones seleccionables para una alternativa, asignarles nombres y registrar el texto de cada instrucción. Una instrucción podrá referirse a una parte identificable de la preparación.
- **Criterio de aceptación:** Las instrucciones se muestran como indicaciones de elaboración o servicio. Por sí solas no añaden, retiran ni sustituyen cantidades físicas.

### REQ-MENU-PERS-006 — Ajustes de precio de personalizaciones

- **Requisito:** El sistema deberá permitir declarar un ajuste de precio para cada personalización que lo requiera. El catálogo conservará el importe declarado sin calcular el precio final de una orden.
- **Criterio de aceptación:** El ajuste queda asociado a la personalización correspondiente y no modifica el precio base de la oferta.
