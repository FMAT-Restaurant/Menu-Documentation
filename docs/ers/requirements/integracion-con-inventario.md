# Integración con Inventario

Menu valida de forma síncrona con Inventario los artículos que referencia y se comunica con él mediante eventos asíncronos sobre orígenes de contenido: cada receta y cada opción con contenido directo de Inventario es un origen cuya alta, modificación y eliminación Menu comunica a Inventario, e Inventario comunica a Menu la disponibilidad de cada origen. Los eventos y su contenido se definen en el [contrato de eventos](https://fmat-restaurant.github.io/Menu-Documentation/events/), y sus garantías de entrega quedan pendientes en [OPEN-011](../open.md#open-011--garantías-de-entrega-de-los-eventos-con-inventario); el índice de requisitos está en [`../functional-requirements.md`](../functional-requirements.md).

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

### RF-INTG-03 — Recepción de la disponibilidad de los orígenes de contenido

- **Requisito:** El sistema deberá consumir los eventos de Inventario que comunican si cada origen de contenido está disponible.
- **Criterios de aceptación:**
  - **RF-INTG-03.CA1:** La disponibilidad de los orígenes de contenido llega a Menu mediante eventos asíncronos de Inventario; cada evento identifica un origen, que es una receta o una opción con contenido directo de Inventario conforme a RF-INTG-04.CA1, y comunica si está disponible.
  - **RF-INTG-03.CA2:** Tras un evento, toda opción cuyo origen es el identificado adopta la disponibilidad comunicada: si el origen es una receta, todas las opciones que la referencian; si es una opción con contenido directo de Inventario, esa opción.
  - **RF-INTG-03.CA3:** La no disponibilidad se propaga al grupo de selección, a la oferta y a la entrada conforme a RF-DISP-06.CA2, y lo no disponible se presenta deshabilitado conforme a RF-CONS-01.CA2.
  - **RF-INTG-03.CA4:** Un evento posterior que comunica que el origen está disponible restaura la disponibilidad conforme a RF-DISP-06.CA4.
  - **RF-INTG-03.CA5:** Un artículo eliminado o dado de baja en Inventario llega como un evento que comunica que cada origen que lo contiene no está disponible; el retiro de un artículo no tiene un evento propio.
  - **RF-INTG-03.CA6:** Ningún evento cambia el estado administrativo, conforme a RF-GEN-04.CA4.
- **Relacionados:** [OPEN-011](../open.md#open-011--garantías-de-entrega-de-los-eventos-con-inventario) (duplicados, orden, consistencia eventual y disponibilidad antes del primer evento).

### RF-INTG-04 — Opción de contenido directo como origen publicado

- **Requisito:** El sistema deberá tratar cada opción con contenido directo de Inventario como un origen de contenido propio ante Inventario.
- **Criterios de aceptación:**
  - **RF-INTG-04.CA1:** Cada opción con contenido directo de Inventario es un origen de contenido identificado por el identificador de la propia opción.
  - **RF-INTG-04.CA2:** Ese origen contiene un único artículo de Inventario, el de la opción, con la cantidad de la opción, y no tiene nombre.
  - **RF-INTG-04.CA3:** Ninguna opción reutiliza el origen de otra, aunque ambas tengan el mismo artículo y la misma cantidad.
  - **RF-INTG-04.CA4:** Inventario evalúa la disponibilidad de cada origen de forma independiente, y la de una opción con contenido directo de Inventario como la de una receta de un único ingrediente.

### RF-INTG-05 — Emisión de eventos de orígenes de contenido

- **Requisito:** El sistema deberá emitir un evento para Inventario cada vez que se crea, se modifica o se elimina un origen de contenido.
- **Criterios de aceptación:**
  - **RF-INTG-05.CA1:** Se emite un evento de alta al crear una receta, también cuando se crea desde una opción, y al crear una opción con contenido directo de Inventario, también cuando se crea con su oferta o como parte de una copia de composición.
  - **RF-INTG-05.CA2:** Se emite un evento de modificación al crear una revisión nueva de una receta y al cambiar el artículo o la cantidad de una opción con contenido directo de Inventario; una edición que no crea una revisión nueva ni cambia el artículo o la cantidad no emite evento.
  - **RF-INTG-05.CA3:** Se emite un evento de eliminación al eliminar la definición vigente de una receta y al eliminar una opción con contenido directo de Inventario, ya sea porque la actualización de la composición la omite de la lista de opciones, porque se elimina su grupo de selección o porque se elimina su oferta o la entrada de esta.
  - **RF-INTG-05.CA4:** Solo las operaciones aceptadas emiten eventos; una operación rechazada no emite ninguno.
  - **RF-INTG-05.CA5:** Los eventos de alta y de modificación contienen el identificador del origen, su nombre, que es el de la receta y no existe en una opción con contenido directo de Inventario, y la lista de artículos de Inventario con su cantidad, expresada en la unidad que Inventario establece para el artículo; el evento de eliminación contiene solo el identificador del origen.
  - **RF-INTG-05.CA6:** Solo el evento de alta indica el tipo de origen: receta o contenido directo de Inventario.
- **Relacionados:** [OPEN-011](../open.md#open-011--garantías-de-entrega-de-los-eventos-con-inventario) (duplicados, orden, ámbito por sucursal y reconciliación).
