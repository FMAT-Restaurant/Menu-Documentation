# Opciones y contenido

Este documento reúne los requisitos sobre las opciones de los grupos de selección: su alta, modificación, eliminación, estado administrativo, nombre mostrado y origen de contenido, ya sea contenido directo de Inventario o una receta. El índice completo de requisitos se encuentra en [`../functional-requirements.md`](../functional-requirements.md).

### RF-OPC-01 — Alta de una opción

- **Requisito:** El sistema deberá permitir al administrador agregar opciones nuevas a un grupo de selección.
- **Criterios de aceptación:**
  - **RF-OPC-01.CA1:** Una opción nueva se indica sin identificador y el sistema le asigna uno.
  - **RF-OPC-01.CA2:** Toda opción nueva inicia activa y su estado administrativo no se indica al crearla; las opciones creadas por copia siguen la excepción de RF-COMP-12.CA4.
  - **RF-OPC-01.CA3:** Los datos obligatorios de la opción nueva son los establecidos en RF-GEN-03.CA6.

### RF-OPC-02 — Modificación de una opción

- **Requisito:** El sistema deberá permitir al administrador modificar parcialmente una opción existente, indicada por su identificador.
- **Criterios de aceptación:**
  - **RF-OPC-02.CA1:** Una opción indicada con su identificador existente se actualiza solo en los datos indicados.
  - **RF-OPC-02.CA2:** El tipo de contenido de la opción no se modifica, conforme a RF-OPC-07.CA2.

### RF-OPC-03 — Eliminación de opciones

- **Requisito:** El sistema deberá eliminar de un grupo de selección las opciones vigentes que no aparecen en la lista de opciones indicada en una actualización.
- **Criterios de aceptación:**
  - **RF-OPC-03.CA1:** Incluir la lista de opciones de un grupo de selección la reemplaza completa, de modo que las opciones vigentes ausentes de la lista se eliminan.
  - **RF-OPC-03.CA2:** Se rechaza una lista de opciones vacía.
  - **RF-OPC-03.CA3:** Las opciones solo se eliminan por esta vía o junto con su grupo de selección u oferta, conforme a RF-COMP-11.CA3.

### RF-OPC-04 — Activación de una opción

- **Requisito:** El sistema deberá permitir al administrador activar una opción inactiva.
- **Criterios de aceptación:**
  - **RF-OPC-04.CA1:** Una opción activada vuelve a presentarse a quien consulta el catálogo y vuelve a ser elegible si está disponible, conforme a RF-CONS-01.CA1 y RF-COMP-05.CA2.
  - **RF-OPC-04.CA2:** La activación de una opción recalcula la disponibilidad de su grupo de selección, su oferta y su entrada conforme a RF-DISP-06.CA3, sin cambiar los estados administrativos de estos conforme a RF-GEN-04.CA4.

### RF-OPC-05 — Inactivación de una opción

- **Requisito:** El sistema deberá permitir al administrador inactivar una opción activa.
- **Criterios de aceptación:**
  - **RF-OPC-05.CA1:** Una opción inactivada deja de presentarse a quien consulta el catálogo y deja de ser elegible, conforme a RF-CONS-01.CA1 y RF-COMP-05.CA2.
  - **RF-OPC-05.CA2:** La inactivación de una opción recalcula la disponibilidad de su grupo de selección, su oferta y su entrada conforme a RF-DISP-06.CA3, sin cambiar los estados administrativos de estos conforme a RF-GEN-04.CA4.

### RF-OPC-06 — Nombre mostrado de la opción

- **Requisito:** El sistema deberá permitir al administrador asignar a cada opción un nombre mostrado para su contexto.
- **Criterios de aceptación:**
  - **RF-OPC-06.CA1:** Cada opción es una aparición contextual dentro de su grupo de selección, identificada por su nombre mostrado.
  - **RF-OPC-06.CA2:** El nombre mostrado no cambia la identidad del artículo de Inventario ni de la receta que la opción contiene.

### RF-OPC-07 — Origen de contenido de la opción

- **Requisito:** El sistema deberá exigir que cada opción tenga exactamente un origen de contenido: un artículo de Inventario o una receta.
- **Criterios de aceptación:**
  - **RF-OPC-07.CA1:** Cada opción tiene un solo origen de contenido, que es un artículo de Inventario o una receta.
  - **RF-OPC-07.CA2:** El tipo de contenido de una opción no cambia después de crearla; para usar el otro tipo se crea una opción nueva, y se rechaza la modificación que intente cambiarlo.
  - **RF-OPC-07.CA3:** Un grupo de selección no contiene dos opciones con el mismo contenido, es decir, el mismo artículo de Inventario o la misma receta; el mismo contenido sí puede repetirse en grupos de selección u ofertas distintos.

### RF-OPC-08 — Contenido directo de Inventario

- **Requisito:** El sistema deberá permitir al administrador definir el contenido de una opción como un artículo de Inventario con su cantidad.
- **Criterios de aceptación:**
  - **RF-OPC-08.CA1:** El contenido directo de Inventario conserva la referencia al artículo de Inventario y la cantidad.
  - **RF-OPC-08.CA2:** La cantidad del contenido directo de Inventario es positiva.
  - **RF-OPC-08.CA3:** La cantidad se expresa en la unidad que Inventario establece para el artículo, y el contenido no tiene unidad propia.
  - **RF-OPC-08.CA4:** El artículo de Inventario se valida conforme a RF-INTG-01.CA2 y RF-INTG-01.CA3.
  - **RF-OPC-08.CA5:** La cantidad del contenido es distinta del número de rondas, conforme a RF-COMP-03.CA3.
- **Relacionados:** [OPEN-006](../open.md#open-006--cantidades-y-unidades).

### RF-OPC-09 — Asignación de una receta existente

- **Requisito:** El sistema deberá permitir al administrador asignar a una opción una receta de la biblioteca de recetas mediante su identificador.
- **Criterios de aceptación:**
  - **RF-OPC-09.CA1:** La receta se asigna solo por su identificador, sin indicar ninguna revisión.
  - **RF-OPC-09.CA2:** La opción usa siempre la revisión vigente de su receta, tanto si se seleccionó una receta existente como si se creó durante la configuración de la opción.
  - **RF-OPC-09.CA3:** Un identificador de receta inexistente se rechaza conforme a RF-GEN-05.CA1.
  - **RF-OPC-09.CA4:** Al modificar una opción que ya usa una receta, omitir el identificador de la receta conserva la receta asignada.
  - **RF-OPC-09.CA5:** La receta asignada no se modifica desde la opción; para cambiarla se edita en la biblioteca de recetas conforme a RF-REC-04.

### RF-OPC-10 — Creación de una receta desde la opción

- **Requisito:** El sistema deberá permitir al administrador crear una receta nueva durante la configuración de una opción.
- **Criterios de aceptación:**
  - **RF-OPC-10.CA1:** La receta creada desde la opción cumple RF-REC-01 y RF-REC-02.
  - **RF-OPC-10.CA2:** La receta nueva se guarda primero en la biblioteca de recetas y después se asigna a la opción.
  - **RF-OPC-10.CA3:** Si se rechaza la actualización de la composición que asigna la receta, esta permanece en la biblioteca de recetas, conforme a RF-GEN-05.CA3.
