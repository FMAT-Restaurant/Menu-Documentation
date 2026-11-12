# Reglas generales del catálogo

Este documento reúne los requisitos que se aplican a todo el catálogo: capacidades de administración y de consulta, control de concurrencia por versión, datos obligatorios, estado administrativo y atomicidad de las operaciones. El índice completo de requisitos se encuentra en [`../functional-requirements.md`](../functional-requirements.md).

### RF-GEN-01 — Capacidades de administración y de consulta

- **Requisito:** El sistema deberá distinguir la capacidad de administrar el catálogo de la capacidad de consultarlo y permitir las operaciones administrativas solo a quien tenga la primera.
- **Criterios de aceptación:**
  - **RF-GEN-01.CA1:** Existen dos capacidades: la capacidad de administrar el catálogo y la capacidad de consultarlo.
  - **RF-GEN-01.CA2:** Toda operación administrativa (crear, editar, cambiar el estado administrativo, actualizar o copiar una composición, eliminar, cargar una imagen, reemplazar el archivo de una imagen, consultar con visibilidad administrativa o consultar el historial de recetas) se rechaza sin cambios cuando quien la solicita no tiene la capacidad de administrar el catálogo.
  - **RF-GEN-01.CA3:** Quien solo tiene la capacidad de consultar accede a la consulta del catálogo con la visibilidad de RF-CONS-01 y a la búsqueda de RF-CONS-03.
  - **RF-GEN-01.CA4:** La autenticación de quien solicita una operación y la asignación de capacidades corresponden a un servicio externo; Menu no autentica ni asigna capacidades.
- **Relacionados:** [OPEN-013](../open.md#open-013--capacidades-más-finas).

### RF-GEN-02 — Control de concurrencia por versión

- **Requisito:** El sistema deberá exigir que toda modificación o eliminación administrativa indique la versión vigente del recurso sobre el que se realiza.
- **Criterios de aceptación:**
  - **RF-GEN-02.CA1:** Se rechaza sin cambios la modificación o eliminación que no indica la versión del recurso.
  - **RF-GEN-02.CA2:** Se rechaza sin cambios la modificación o eliminación que indica una versión distinta de la vigente.
  - **RF-GEN-02.CA3:** La exigencia de versión se aplica a la edición, al cambio de estado administrativo y a la eliminación de categorías, entradas, ofertas, opciones y recetas, a la actualización y la copia de una composición y al reemplazo del archivo de una imagen.
  - **RF-GEN-02.CA4:** Para la actualización y la copia de una composición, y para los grupos de selección y opciones que contiene, la versión exigida es la de la composición destino.

### RF-GEN-03 — Datos obligatorios y textos no vacíos

- **Requisito:** El sistema deberá rechazar íntegramente la creación o modificación que omita un dato obligatorio o que indique un texto obligatorio vacío.
- **Criterios de aceptación:**
  - **RF-GEN-03.CA1:** Una creación o modificación que omite un dato obligatorio, o que indica vacío un texto obligatorio, se rechaza conforme a RF-GEN-05.CA1.
  - **RF-GEN-03.CA2:** En una categoría, el nombre es obligatorio y la descripción es opcional.
  - **RF-GEN-03.CA3:** En una entrada, son obligatorios el nombre comercial, la descripción y la imagen; las categorías son opcionales.
  - **RF-GEN-03.CA4:** En una oferta, son obligatorios la etiqueta de presentación, el precio base, la imagen y la composición inicial.
  - **RF-GEN-03.CA5:** En un grupo de selección nuevo, son obligatorios el nombre, el número de rondas y al menos una opción; el tiempo de servicio es opcional.
  - **RF-GEN-03.CA6:** En una opción nueva, son obligatorios el nombre mostrado y el origen de contenido, y el estado administrativo no se indica, conforme a RF-OPC-01.CA2; el contenido directo de Inventario exige el artículo y la cantidad, y la receta exige el identificador de la receta o una receta nueva.
  - **RF-GEN-03.CA7:** En una receta, son obligatorios el nombre, la descripción y las instrucciones; las líneas de ingrediente se exigen conforme a RF-REC-01.CA3, y cada línea de ingrediente exige el artículo y la cantidad.
  - **RF-GEN-03.CA8:** La única excepción a la exigencia de texto no vacío es la descripción opcional de la categoría, que se elimina cuando se edita con un valor vacío, conforme a RF-CAT-02.CA3.
  - **RF-GEN-03.CA9:** Ningún nombre ni etiqueta del catálogo exige unicidad, salvo el nombre de categoría conforme a RF-CAT-01.CA3: los nombres comerciales, las etiquetas de presentación, los nombres de grupo, los nombres mostrados y los nombres de receta pueden repetirse.

### RF-GEN-04 — Estado administrativo

- **Requisito:** El sistema deberá cambiar el estado administrativo de entradas, ofertas y opciones solo por una acción explícita del administrador sobre ese recurso.
- **Criterios de aceptación:**
  - **RF-GEN-04.CA1:** El estado administrativo de una entrada es activo, inactivo o archivado.
  - **RF-GEN-04.CA2:** El estado administrativo de una oferta o de una opción es activo o inactivo.
  - **RF-GEN-04.CA3:** El grupo de selección no tiene estado administrativo.
  - **RF-GEN-04.CA4:** Ni la disponibilidad, ni los eventos de Inventario, ni la actualización o la copia de una composición, ni la edición de una receta cambian el estado administrativo de ningún recurso.
  - **RF-GEN-04.CA5:** Cambiar el estado administrativo de una entrada no cambia el estado administrativo de sus ofertas.
  - **RF-GEN-04.CA6:** Cambiar el estado administrativo o la disponibilidad de una oferta, o eliminarla, no cambia el estado administrativo de su entrada.
  - **RF-GEN-04.CA7:** Una oferta u opción inactivada por el administrador permanece inactiva hasta que el administrador la active.
- **Relacionados:** [OPEN-012](../open.md#open-012--notificación-y-revisión-ante-cambios-de-disponibilidad).

### RF-GEN-05 — Atomicidad de las operaciones

- **Requisito:** El sistema deberá aplicar cada operación administrativa de forma íntegra.
- **Criterios de aceptación:**
  - **RF-GEN-05.CA1:** Una operación rechazada no crea, modifica ni elimina ningún recurso y conserva todos los valores vigentes.
  - **RF-GEN-05.CA2:** Una operación aceptada aplica todos sus cambios.
  - **RF-GEN-05.CA3:** La carga de una imagen (RF-IMG-01) y la creación de una receta desde una opción (RF-OPC-10) son operaciones independientes de la operación posterior que las usa; el rechazo de la operación posterior no las deshace.
