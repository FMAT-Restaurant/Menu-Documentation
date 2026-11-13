# Recetas

Este documento reúne los requisitos sobre la biblioteca de recetas: creación, líneas de ingrediente, edición por revisiones, historial y eliminación de recetas. El índice completo de requisitos está en [`../functional-requirements.md`](../functional-requirements.md).

### RF-REC-01 — Creación de una receta

- **Requisito:** El sistema deberá permitir al administrador crear una receta en la biblioteca de recetas.
- **Criterios de aceptación:**
  - **RF-REC-01.CA1:** Toda receta pertenece a la biblioteca de recetas.
  - **RF-REC-01.CA2:** La receta conserva su nombre, descripción, instrucciones en texto y líneas de ingrediente; los datos obligatorios son los indicados en RF-GEN-03.CA7.
  - **RF-REC-01.CA3:** Una receta tiene una o más líneas de ingrediente; se rechaza una receta sin líneas de ingrediente.
  - **RF-REC-01.CA4:** Toda receta nueva se crea con la revisión 1.
  - **RF-REC-01.CA5:** La receta puede asignarse a opciones de distintas ofertas.
  - **RF-REC-01.CA6:** La creación puede iniciarse desde la biblioteca de recetas o desde la configuración de una opción, conforme a RF-OPC-10.
- **Relacionados:** [OPEN-003](../open.md#open-003--alcance-de-la-biblioteca-de-recetas).

### RF-REC-02 — Líneas de ingrediente

- **Requisito:** El sistema deberá permitir al administrador definir cada línea de ingrediente de una receta con un artículo de Inventario y una cantidad.
- **Criterios de aceptación:**
  - **RF-REC-02.CA1:** Cada línea de ingrediente referencia un único artículo de Inventario.
  - **RF-REC-02.CA2:** Cada línea de ingrediente conserva la cantidad indicada.
  - **RF-REC-02.CA3:** La cantidad de cada línea de ingrediente es positiva.
  - **RF-REC-02.CA4:** La cantidad de la línea se expresa en la unidad que Inventario establece para el artículo; la línea de ingrediente no tiene unidad propia.
  - **RF-REC-02.CA5:** Una receta no repite el mismo artículo de Inventario en dos líneas de ingrediente.
  - **RF-REC-02.CA6:** El artículo de Inventario de la línea se valida conforme a RF-INTG-01.CA2 y RF-INTG-01.CA3.
  - **RF-REC-02.CA7:** La cantidad de la línea es distinta del número de rondas, conforme a RF-COMP-03.CA3.
  - **RF-REC-02.CA8:** Las líneas de ingrediente de una receta conservan el orden indicado por el administrador y se presentan en ese orden.
- **Relacionados:** [OPEN-006](../open.md#open-006--cantidades-y-unidades).

### RF-REC-03 — Unidad de medida visible

- **Requisito:** El sistema deberá mostrar en cada línea de ingrediente la unidad de medida que Inventario administra para su artículo.
- **Criterios de aceptación:**
  - **RF-REC-03.CA1:** Al seleccionar, consultar o editar una línea de ingrediente se muestran la unidad del artículo de Inventario y la cantidad asociada.
  - **RF-REC-03.CA2:** La visualización no cambia ni duplica la identidad ni la unidad administradas por Inventario, conforme a RF-INTG-02.CA3; la precisión y los rangos de la cantidad quedan pendientes en OPEN-006.
- **Relacionados:** [OPEN-006](../open.md#open-006--cantidades-y-unidades) (precisión y rangos de la cantidad).

### RF-REC-04 — Edición de una receta por revisión

- **Requisito:** El sistema deberá permitir al administrador modificar el nombre, la descripción, las instrucciones y las líneas de ingrediente de una receta, creando una nueva revisión.
- **Criterios de aceptación:**
  - **RF-REC-04.CA1:** Cada edición aceptada crea una revisión nueva, con el número siguiente al de la revisión vigente, y esa revisión nueva pasa a ser la revisión vigente.
  - **RF-REC-04.CA2:** La edición aplica las mismas validaciones que la creación, conforme a RF-REC-01.CA3 y RF-REC-02.
  - **RF-REC-04.CA3:** Una edición sin cambios no crea una revisión nueva.
  - **RF-REC-04.CA4:** Todas las opciones que referencian la receta usan la revisión nueva de inmediato, sin necesidad de reasignar la receta.
  - **RF-REC-04.CA5:** La disponibilidad de esas opciones se actualiza con los eventos de disponibilidad que Inventario emita después sobre la receta, conforme a RF-INTG-03; el valor de la disponibilidad mientras no llega el evento queda pendiente en OPEN-011.
  - **RF-REC-04.CA6:** La edición exige la versión vigente de la receta, conforme a RF-GEN-02.CA1.
- **Relacionados:** [OPEN-011](../open.md#open-011--garantías-de-entrega-de-los-eventos-con-inventario).

### RF-REC-05 — Conservación del historial de revisiones

- **Requisito:** El sistema deberá conservar las revisiones anteriores de cada receta como historial inmutable.
- **Criterios de aceptación:**
  - **RF-REC-05.CA1:** Las revisiones anteriores de una receta se conservan y no se modifican.
  - **RF-REC-05.CA2:** El historial de revisiones se conserva después de eliminar la definición vigente de la receta.

### RF-REC-06 — Consulta del historial de revisiones

- **Requisito:** El sistema deberá permitir al administrador consultar el historial de revisiones de una receta.
- **Criterios de aceptación:**
  - **RF-REC-06.CA1:** La consulta presenta cada revisión con su número y con el nombre, la descripción, las instrucciones y las líneas de ingrediente que tenía.
  - **RF-REC-06.CA2:** El historial de revisiones puede consultarse también cuando se ha eliminado la definición vigente de la receta.
  - **RF-REC-06.CA3:** La consulta del historial de revisiones requiere el permiso «Ver recetas», conforme a RF-GEN-01.CA5.

### RF-REC-07 — Eliminación de una receta sin referencias

- **Requisito:** El sistema deberá permitir al administrador eliminar la definición vigente de una receta si y solo si ninguna opción la referencia.
- **Criterios de aceptación:**
  - **RF-REC-07.CA1:** La definición vigente de una receta se elimina si y solo si ninguna opción de ninguna oferta referencia la receta, cualquiera que sea el estado administrativo de la oferta o de la opción.
  - **RF-REC-07.CA2:** Si alguna opción referencia la receta, la eliminación se rechaza conforme a RF-GEN-05.CA1, sin cambiar la oferta, la opción ni la receta.
  - **RF-REC-07.CA3:** La eliminación conserva el historial de revisiones, conforme a RF-REC-05.CA2.
  - **RF-REC-07.CA4:** La eliminación exige la versión vigente de la receta, conforme a RF-GEN-02.CA1.
