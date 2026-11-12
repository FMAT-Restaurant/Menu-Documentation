# Integración con Inventario

Menu valida de forma síncrona con Inventario los artículos que referencia y recibe por eventos asíncronos la factibilidad de recetas y la disponibilidad de artículos; además, emite eventos de receta. El contrato de eventos queda pendiente en [OPEN-011](../open.md#open-011--contrato-de-eventos-con-inventario); el índice de requisitos está en [`../functional-requirements.md`](../functional-requirements.md).

### RF-INTG-01 — Validación síncrona de artículos de Inventario

- **Requisito:** El sistema deberá consultar de forma síncrona a Inventario cada artículo que se referencia en una opción de contenido directo o en una línea de ingrediente.
- **Criterios de aceptación:**
  - **RF-INTG-01.CA1:** La consulta se realiza al crear o modificar una opción con contenido directo de Inventario y al crear o editar una receta, también cuando se crea desde una opción.
  - **RF-INTG-01.CA2:** Si el artículo no existe en Inventario, la operación se rechaza conforme a RF-GEN-05.CA1.
  - **RF-INTG-01.CA3:** Si Inventario no responde, la operación se rechaza conforme a RF-GEN-05.CA1.

### RF-INTG-02 — Autoridad de Inventario sobre sus artículos

- **Requisito:** El sistema deberá referenciar los artículos de Inventario sin redefinir su identidad, su unidad de medida ni sus existencias.
- **Criterios de aceptación:**
  - **RF-INTG-02.CA1:** Menu conserva referencias a los artículos de Inventario y no los redefine.
  - **RF-INTG-02.CA2:** Menu no administra las existencias de los artículos.
  - **RF-INTG-02.CA3:** La identidad, la unidad de medida y las existencias de cada artículo pertenecen a Inventario, que es la única fuente de la unidad de medida.
  - **RF-INTG-02.CA4:** La igualdad numérica entre identificadores de contextos distintos no establece una identidad compartida.

### RF-INTG-03 — Recepción de eventos de factibilidad de recetas

- **Requisito:** El sistema deberá consumir los eventos de Inventario que comunican que una receta deja de poder elaborarse o vuelve a poder elaborarse.
- **Criterios de aceptación:**
  - **RF-INTG-03.CA1:** La factibilidad de las recetas y la disponibilidad de los artículos llegan a Menu mediante eventos asíncronos de Inventario.
  - **RF-INTG-03.CA2:** Tras un evento que marca una receta como no factible, toda opción que la referencia queda no disponible.
  - **RF-INTG-03.CA3:** La no disponibilidad se propaga al grupo de selección, a la oferta y a la entrada conforme a RF-DISP-06.CA2, y lo no disponible se presenta deshabilitado conforme a RF-CONS-01.CA2.
  - **RF-INTG-03.CA4:** Un evento posterior que marca la receta como factible restaura la disponibilidad conforme a RF-DISP-06.CA4.
  - **RF-INTG-03.CA5:** Ningún evento cambia el estado administrativo, conforme a RF-GEN-04.CA4.
- **Relacionados:** [OPEN-011](../open.md#open-011--contrato-de-eventos-con-inventario) (formato, identificación de la receta y de la revisión, idempotencia, orden y valor inicial).

### RF-INTG-04 — Recepción de eventos de disponibilidad de artículos

- **Requisito:** El sistema deberá consumir los eventos de Inventario que comunican que un artículo deja de estar disponible, vuelve a estarlo o se retira.
- **Criterios de aceptación:**
  - **RF-INTG-04.CA1:** Tras un evento que marca un artículo como no disponible, toda opción con contenido directo de ese artículo queda no disponible.
  - **RF-INTG-04.CA2:** La no disponibilidad de una opción con contenido directo se propaga al grupo de selección, a la oferta y a la entrada conforme a RF-DISP-06.CA2.
  - **RF-INTG-04.CA3:** Un evento posterior que marca el artículo como disponible restaura la disponibilidad conforme a RF-DISP-06.CA4.
  - **RF-INTG-04.CA4:** Un artículo eliminado o dado de baja en Inventario se trata como no disponible de forma permanente; solo afecta la disponibilidad y no cambia ningún estado administrativo; el detalle del evento queda pendiente en OPEN-011.
- **Relacionados:** [OPEN-011](../open.md#open-011--contrato-de-eventos-con-inventario) (detalle del evento de retirada de un artículo).

### RF-INTG-05 — Emisión de eventos de receta

- **Requisito:** El sistema deberá emitir un evento para Inventario al crear una receta, al crear una revisión nueva y al eliminar su definición vigente.
- **Criterios de aceptación:**
  - **RF-INTG-05.CA1:** Se emite un evento al crear una receta, al crear una revisión nueva y al eliminar la definición vigente.
  - **RF-INTG-05.CA2:** Solo las operaciones aceptadas emiten evento, y el evento identifica la receta afectada.
  - **RF-INTG-05.CA3:** Los eventos permiten a Inventario mantener una copia local de los datos que necesita de la revisión vigente de cada receta; su contenido y formato quedan pendientes en OPEN-011.
- **Relacionados:** [OPEN-011](../open.md#open-011--contrato-de-eventos-con-inventario) (contenido y formato de los eventos de receta).
