# Reglas generales del catálogo

Este documento reúne los requisitos que se aplican a todo el catálogo: permisos de las operaciones, control de concurrencia por versión, datos obligatorios, estado administrativo y atomicidad de las operaciones. El índice completo de requisitos se encuentra en [`../functional-requirements.md`](../functional-requirements.md).

### RF-GEN-01 — Permisos de las operaciones

- **Requisito:** El sistema deberá permitir cada operación del catálogo solo a quien tenga el permiso que la protege.
- **Criterios de aceptación:**
  - **RF-GEN-01.CA1:** Cada operación del catálogo está protegida por uno o más de los permisos de RF-GEN-01.CA5, y Menu exige esos permisos para realizarla.
  - **RF-GEN-01.CA2:** Una operación solicitada sin el permiso que la protege se rechaza sin cambios.
  - **RF-GEN-01.CA3:** Una modificación que combina un cambio de estado administrativo con otros cambios exige tanto el permiso de cambio de estado del recurso como el de su gestión.
  - **RF-GEN-01.CA4:** Los permisos llegan en la credencial de quien solicita la operación, emitida por un servicio externo; Menu no autentica a quien solicita ni asigna permisos.
  - **RF-GEN-01.CA5:** Los permisos, con su etiqueta y la capacidad que conceden, son los siguientes:
    - «Ver catálogo»: consultar el catálogo con la visibilidad de RF-CONS-01, incluidas la búsqueda y el filtrado de RF-CONS-03.
    - «Imprimir carta»: generar la carta imprimible conforme a RF-CONS-06.
    - «Ver categorías»: consultar las categorías con visibilidad administrativa.
    - «Gestionar categorías»: crear, editar y eliminar categorías.
    - «Ver entradas»: consultar las entradas en cualquier estado administrativo.
    - «Gestionar entradas»: crear entradas, editar sus datos y eliminarlas.
    - «Cambiar estado de entradas»: activar, inactivar, archivar y desarchivar entradas.
    - «Ver ofertas»: consultar las ofertas y su composición con visibilidad administrativa.
    - «Gestionar ofertas»: crear, editar y eliminar ofertas y actualizar su composición, incluida la copia de composición.
    - «Cambiar estado de ofertas»: activar e inactivar ofertas y opciones.
    - «Ver recetas»: consultar las recetas de la biblioteca y su historial de revisiones.
    - «Gestionar recetas»: crear, editar y eliminar recetas.
    - «Gestionar imágenes»: cargar imágenes y reemplazar su archivo.

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
  - **RF-GEN-03.CA6:** En una opción nueva, son obligatorios el nombre mostrado y el origen de contenido, y el estado administrativo es opcional conforme a RF-OPC-01.CA2; el contenido directo de Inventario exige el artículo y la cantidad, y la receta exige el identificador de la receta o una receta nueva.
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
