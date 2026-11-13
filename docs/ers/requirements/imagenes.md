# Imágenes de entradas y ofertas

Este documento reúne los requisitos sobre la carga, la validación, la asociación, la pertenencia y el reemplazo del archivo de las imágenes de entradas y ofertas. El índice completo de requisitos se encuentra en [`../functional-requirements.md`](../functional-requirements.md).

### RF-IMG-01 — Carga de una imagen

- **Requisito:** El sistema deberá permitir al administrador cargar un archivo de imagen en una operación previa e independiente de la creación de entradas y ofertas.
- **Criterios de aceptación:**
  - **RF-IMG-01.CA1:** La carga de un archivo válido le asigna un identificador de imagen.
  - **RF-IMG-01.CA2:** La carga se realiza antes y por separado de la creación del recurso, conforme a RF-GEN-05.CA3.

### RF-IMG-02 — Validación del archivo de imagen

- **Requisito:** El sistema deberá validar cada archivo de imagen que recibe, en la carga inicial y en el reemplazo del archivo.
- **Criterios de aceptación:**
  - **RF-IMG-02.CA1:** Solo se aceptan archivos JPEG, PNG o WebP.
  - **RF-IMG-02.CA2:** El tamaño máximo del archivo es 10 MiB.
  - **RF-IMG-02.CA3:** El ancho y el alto máximos son 4096 px cada uno.
  - **RF-IMG-02.CA4:** El formato se valida por el contenido real del archivo, no solo por el tipo declarado.
  - **RF-IMG-02.CA5:** Un archivo inválido, no decodificable o que excede el tamaño máximo o cualquiera de las dimensiones máximas se rechaza sin crear una imagen utilizable.
  - **RF-IMG-02.CA6:** El rechazo de un archivo no modifica ningún recurso ni ninguna imagen existentes.

### RF-IMG-03 — Asociación de una imagen a una entrada u oferta

- **Requisito:** El sistema deberá asociar una imagen a una entrada o a una oferta al crearla, mediante el identificador de una imagen previamente cargada.
- **Criterios de aceptación:**
  - **RF-IMG-03.CA1:** La creación de una entrada o de una oferta requiere el identificador de una imagen previamente cargada, sin reenviar el archivo ni una dirección URL.
  - **RF-IMG-03.CA2:** El identificador de imagen asociado al crear una entrada u oferta queda ligado a ella de forma permanente: la edición de la entrada u oferta no admite indicar otro identificador ni cambia su imagen, y la imagen se cambia reemplazando su archivo conforme a RF-IMG-05.
  - **RF-IMG-03.CA3:** Un identificador de imagen inexistente, inválido o no accesible a quien solicita la operación se rechaza conforme a RF-GEN-05.CA1.

### RF-IMG-04 — Pertenencia y eliminación de imágenes

- **Requisito:** El sistema deberá mantener cada imagen asociada a un solo recurso y eliminar sus archivos cuando dejan de usarse.
- **Criterios de aceptación:**
  - **RF-IMG-04.CA1:** Una imagen pertenece a una sola entrada u oferta, y se rechaza asociar a otro recurso una imagen ya asociada.
  - **RF-IMG-04.CA2:** Al reemplazar el archivo de una imagen, el archivo anterior se elimina y la imagen conserva su identificador.
  - **RF-IMG-04.CA3:** Al eliminar una entrada u oferta, incluida la eliminación en cascada conforme a RF-ENT-07.CA2, se elimina su imagen.
- **Relacionados:** [OPEN-014](../open.md#open-014--retención-de-imágenes-nunca-asociadas) (retención de imágenes cargadas y nunca asociadas).

### RF-IMG-05 — Reemplazo del archivo de una imagen

- **Requisito:** El sistema deberá permitir al administrador reemplazar el archivo de una imagen existente sin cambiar su identificador.
- **Criterios de aceptación:**
  - **RF-IMG-05.CA1:** El administrador carga un archivo nuevo para un identificador de imagen existente; el identificador no cambia y pasa a enlazar con el archivo nuevo.
  - **RF-IMG-05.CA2:** El archivo nuevo se valida conforme a RF-IMG-02.
  - **RF-IMG-05.CA3:** El archivo anterior se elimina conforme a RF-IMG-04.CA2.
  - **RF-IMG-05.CA4:** Un rechazo conserva sin cambios el archivo vigente, conforme a RF-GEN-05.CA1.
  - **RF-IMG-05.CA5:** El reemplazo exige la versión vigente de la imagen, conforme a RF-GEN-02.CA1.
  - **RF-IMG-05.CA6:** No se reemplaza el archivo de la imagen de una entrada archivada ni el de las imágenes de sus ofertas, conforme a RF-ENT-05.CA3.
