# Composición y grupos de selección

Este documento reúne los requisitos de la composición de una oferta: su validez, los grupos de selección con sus rondas y su tiempo de servicio, la elegibilidad de las opciones, el orden de presentación, la edición de la composición y su copia desde otra oferta. El índice completo de requisitos se encuentra en [`../functional-requirements.md`](../functional-requirements.md).

## Estructura

### RF-COMP-01 — Composición válida

- **Requisito:** El sistema deberá mantener en cada oferta exactamente una composición válida.
- **Criterios de aceptación:**
  - **RF-COMP-01.CA1:** Cada oferta contiene exactamente una composición.
  - **RF-COMP-01.CA2:** Una composición es válida si y solo si se cumplen todas estas condiciones: (a) tiene al menos un grupo de selección; (b) cada grupo tiene nombre, número de rondas y al menos una opción, conforme a RF-GEN-03.CA5; (c) cada opción tiene nombre mostrado y exactamente un origen de contenido, conforme a RF-GEN-03.CA6 y RF-OPC-07.CA1; (d) ese origen referencia un artículo de Inventario existente, conforme a RF-INTG-01.CA2, o una receta existente, conforme a RF-OPC-09.CA3; (e) en el contenido directo de Inventario la cantidad es positiva, conforme a RF-OPC-08.CA2.
  - **RF-COMP-01.CA3:** La validez de la composición es estructural («bien armada») y no depende de la disponibilidad ni de las existencias de Inventario, que solo deciden si la oferta se puede ordenar. Por ejemplo, un combo con sus grupos y opciones es válido aunque Inventario comunique la falta de un ingrediente: se puede activar conforme a RF-OFE-04.CA2 y se presenta, pero deshabilitado y no ordenable mientras dure la falta, conforme a RF-DISP-05.CA1 y RF-CONS-01.CA2.
  - **RF-COMP-01.CA4:** Toda oferta tiene en todo momento una composición válida; se rechaza cualquier operación que la deje inválida.

### RF-COMP-02 — Grupos de selección obligatorios

- **Requisito:** El sistema deberá tratar todos los grupos de selección de una composición como miembros estructurales y obligatorios que participan en la selección.
- **Criterios de aceptación:**
  - **RF-COMP-02.CA1:** Todos los grupos de selección son obligatorios y forman parte estructural de la composición de su oferta.
  - **RF-COMP-02.CA2:** Todo grupo de selección participa en la selección y genera sus rondas.
  - **RF-COMP-02.CA3:** Cada grupo de selección se identifica por su función, expresada en su nombre (por ejemplo, bebida o plato principal).
  - **RF-COMP-02.CA4:** Cada opción pertenece a un único grupo de selección.
  - **RF-COMP-02.CA5:** Las rondas repetidas de un grupo conservan la identidad del grupo y no crean grupos adicionales.

### RF-COMP-03 — Número de rondas del grupo de selección

- **Requisito:** El sistema deberá permitir al administrador indicar el número de rondas de cada grupo de selección.
- **Criterios de aceptación:**
  - **RF-COMP-03.CA1:** El número de rondas pertenece al grupo de selección; las opciones no tienen un número de selección propio.
  - **RF-COMP-03.CA2:** Un grupo con tres rondas da lugar a tres rondas, en cada una de las cuales se elige una opción conforme a RF-COMP-05.CA1.
  - **RF-COMP-03.CA3:** El número de rondas es distinto de la cantidad física de un artículo o ingrediente, que se define en el origen de contenido.
- **Relacionados:** [OPEN-006](../open.md#open-006--cantidades-y-unidades) (rangos, precisión y valor predeterminado del número de rondas).

### RF-COMP-04 — Tiempo de servicio del grupo de selección

- **Requisito:** El sistema deberá permitir al administrador indicar opcionalmente el tiempo de servicio sugerido de un grupo de selección.
- **Criterios de aceptación:**
  - **RF-COMP-04.CA1:** El tiempo de servicio es opcional.
  - **RF-COMP-04.CA2:** Cuando se indica, el tiempo de servicio solo admite «entrada», «plato fuerte», «postre» o «bebida»; cualquier otro valor se rechaza.
  - **RF-COMP-04.CA3:** El tiempo de servicio aceptado se presenta asociado al grupo como sugerencia.
  - **RF-COMP-04.CA4:** El tiempo de servicio no cambia las opciones, las rondas ni el precio base, y no es una etapa de preparación en cocina.

## Selección

### RF-COMP-05 — Elegibilidad de opciones por ronda

- **Requisito:** El sistema deberá definir qué opciones de un grupo de selección son elegibles en cada ronda.
- **Criterios de aceptación:**
  - **RF-COMP-05.CA1:** En cada ronda de un grupo se elige exactamente una opción activa y disponible; el número de rondas no permite elegir más de una opción en una misma ronda.
  - **RF-COMP-05.CA2:** Las opciones inactivas o no disponibles no son elegibles.
  - **RF-COMP-05.CA3:** La comprobación de las elecciones de una orden corresponde a Órdenes, conforme a RF-CONS-05.CA2.

### RF-COMP-06 — Opción predeterminada del grupo de selección

- **Requisito:** El sistema deberá determinar la opción predeterminada de cada grupo de selección.
- **Criterios de aceptación:**
  - **RF-COMP-06.CA1:** Si un grupo tiene una sola opción elegible, esa opción es la predeterminada y se usa directamente, aunque el grupo contenga además opciones inactivas o no disponibles.
  - **RF-COMP-06.CA2:** Si un grupo tiene varias opciones elegibles, el catálogo no fija ninguna predeterminada.

### RF-COMP-07 — Orden de presentación de grupos y opciones

- **Requisito:** El sistema deberá permitir al administrador establecer el orden de presentación de los grupos de selección de una composición y de las opciones de cada grupo.
- **Criterios de aceptación:**
  - **RF-COMP-07.CA1:** Los grupos de selección se presentan en el orden establecido por el administrador, y ese orden es el orden en que se suceden sus rondas.
  - **RF-COMP-07.CA2:** Las opciones de un grupo se presentan en el orden establecido por el administrador.
  - **RF-COMP-07.CA3:** Las categorías, las entradas, las ofertas de una entrada y las recetas de la biblioteca se presentan en orden alfabético de su nombre (nombre comercial para la entrada y etiqueta de presentación para la oferta). Las líneas de ingrediente se rigen por RF-REC-02.CA8.

## Edición de la composición

### RF-COMP-08 — Actualización parcial de la composición

- **Requisito:** El sistema deberá permitir al administrador actualizar parcialmente la composición de una oferta en una sola operación.
- **Criterios de aceptación:**
  - **RF-COMP-08.CA1:** Los datos omitidos de un grupo de selección u opción conservan sus valores vigentes.
  - **RF-COMP-08.CA2:** Omitir la lista de grupos de la composición, o la de opciones de un grupo, conserva la lista vigente.
  - **RF-COMP-08.CA3:** Se rechazan los identificadores duplicados, desconocidos o pertenecientes a otro recurso.
  - **RF-COMP-08.CA4:** La actualización exige la versión vigente de la composición conforme a RF-GEN-02.CA4.
  - **RF-COMP-08.CA5:** Cualquier rechazo deja íntegra la composición, conforme a RF-GEN-05.CA1.
  - **RF-COMP-08.CA6:** Una actualización aceptada recalcula la disponibilidad conforme a RF-DISP-06.CA3, sin cambiar estados administrativos conforme a RF-GEN-04.CA4.
  - **RF-COMP-08.CA7:** No se actualiza la composición de una oferta de una entrada archivada, conforme a RF-ENT-05.CA3.

### RF-COMP-09 — Alta de un grupo de selección

- **Requisito:** El sistema deberá permitir al administrador agregar un grupo de selección nuevo a una composición.
- **Criterios de aceptación:**
  - **RF-COMP-09.CA1:** Un grupo nuevo se indica sin identificador y el sistema le asigna uno.
  - **RF-COMP-09.CA2:** Los datos obligatorios del grupo nuevo son los de RF-GEN-03.CA5.

### RF-COMP-10 — Modificación de un grupo de selección

- **Requisito:** El sistema deberá permitir al administrador modificar parcialmente un grupo de selección existente, indicado por su identificador.
- **Criterios de aceptación:**
  - **RF-COMP-10.CA1:** Un grupo indicado con su identificador existente se actualiza solo en los datos indicados.
  - **RF-COMP-10.CA2:** El nombre, el número de rondas, el tiempo de servicio y la lista de opciones del grupo son modificables.

### RF-COMP-11 — Eliminación de grupos de selección

- **Requisito:** El sistema deberá eliminar de una composición los grupos de selección vigentes que no aparecen en la lista de grupos indicada en una actualización.
- **Criterios de aceptación:**
  - **RF-COMP-11.CA1:** Incluir la lista de grupos la reemplaza completa: los grupos vigentes ausentes se eliminan con sus opciones.
  - **RF-COMP-11.CA2:** Se rechaza una lista de grupos vacía.
  - **RF-COMP-11.CA3:** Los grupos de selección y las opciones solo se eliminan mediante la actualización de la composición (RF-COMP-11, RF-OPC-03) o con su oferta (RF-OFE-06.CA3).

## Copia

### RF-COMP-12 — Copia de composición desde otra oferta

- **Requisito:** El sistema deberá permitir al administrador incorporar a una oferta copias de los grupos de selección y opciones de otra oferta del catálogo, enviadas como grupos y opciones nuevos.
- **Criterios de aceptación:**
  - **RF-COMP-12.CA1:** Quien configura obtiene los grupos de selección y las opciones de la oferta origen mediante la consulta administrativa de ofertas, y elige el origen conforme a RF-CONS-04.CA5.
  - **RF-COMP-12.CA2:** La copia se envía como grupos de selección y opciones nuevos, sin identificadores, al crear la oferta destino conforme a RF-OFE-01.CA4 o al actualizar su composición conforme a RF-COMP-09 y RF-OPC-01; no existe una operación de copia distinta, y las copias son locales y editables, con la independencia de RF-COMP-12.CA6.
  - **RF-COMP-12.CA3:** Para conservar los grupos que ya tenía la composición destino, la actualización los incluye junto con los grupos copiados, conforme a RF-COMP-11.CA1.
  - **RF-COMP-12.CA4:** Las opciones copiadas se envían con el estado administrativo que tenían en la oferta origen y lo conservan, conforme a RF-OPC-01.CA2.
  - **RF-COMP-12.CA5:** Las opciones con receta copiadas referencian la misma receta y usan su revisión vigente conforme a RF-OPC-09.CA2; las opciones con contenido directo de Inventario copiadas conservan el artículo y la cantidad.
  - **RF-COMP-12.CA6:** La oferta destino no conserva el identificador ni una referencia a la oferta origen, y los cambios posteriores en cualquiera de las dos no se sincronizan.
  - **RF-COMP-12.CA7:** La copia no incorpora el precio base, la etiqueta de presentación ni la imagen de la oferta origen.
  - **RF-COMP-12.CA8:** Cuando la copia se envía en una actualización de la composición, exige la versión vigente de la composición destino conforme a RF-GEN-02.CA4; en todos los casos es íntegra conforme a RF-GEN-05.CA1.
  - **RF-COMP-12.CA9:** La copia recalcula la disponibilidad de las opciones copiadas, de los grupos, de la oferta destino y de su entrada conforme a RF-DISP-06.CA3, como toda actualización de la composición según RF-COMP-08.CA6.
- **Relacionados:** [OPEN-011](../open.md#open-011--garantías-de-entrega-de-los-eventos-con-inventario) (disponibilidad inicial de opciones copiadas).
