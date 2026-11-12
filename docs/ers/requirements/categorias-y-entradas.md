# Categorías y entradas del catálogo

Este documento reúne los requisitos sobre la creación, edición y eliminación de categorías, la clasificación de entradas y el ciclo de vida de las entradas del catálogo. El índice de todos los requisitos y sus convenciones se encuentra en [`../functional-requirements.md`](../functional-requirements.md).

## Categorías

### RF-CAT-01 — Creación de una categoría

- **Requisito:** El sistema deberá permitir al administrador crear una categoría en el menú.
- **Criterios de aceptación:**
  - **RF-CAT-01.CA1:** La categoría pertenece al menú en el que se crea.
  - **RF-CAT-01.CA2:** Los datos obligatorios de la categoría son los de RF-GEN-03.CA2 (la descripción es opcional).
  - **RF-CAT-01.CA3:** El nombre de la categoría es único dentro del menú; se rechaza crear una categoría con el nombre de otra categoría del mismo menú.
  - **RF-CAT-01.CA4:** Para la unicidad, los nombres se comparan sin distinguir mayúsculas de minúsculas ni acentos y sin considerar los espacios al inicio y al final.

### RF-CAT-02 — Edición de una categoría

- **Requisito:** El sistema deberá permitir al administrador modificar el nombre y la descripción de una categoría.
- **Criterios de aceptación:**
  - **RF-CAT-02.CA1:** El nuevo nombre cumple la unicidad de RF-CAT-01.CA3, con la comparación de RF-CAT-01.CA4.
  - **RF-CAT-02.CA2:** Omitir la descripción conserva la descripción vigente.
  - **RF-CAT-02.CA3:** Indicar una descripción vacía deja la categoría sin descripción.
  - **RF-CAT-02.CA4:** La edición exige la versión vigente conforme a RF-GEN-02.CA1.

### RF-CAT-03 — Eliminación de una categoría

- **Requisito:** El sistema deberá permitir al administrador eliminar una categoría.
- **Criterios de aceptación:**
  - **RF-CAT-03.CA1:** La eliminación se permite siempre, clasifique o no entradas.
  - **RF-CAT-03.CA2:** Al eliminarse, la categoría deja de clasificar a sus entradas, que siguen existiendo sin otro cambio.
  - **RF-CAT-03.CA3:** Una entrada que pierde así su única categoría pasa a la agrupación «sin categoría» conforme a RF-CAT-04.CA5.

### RF-CAT-04 — Clasificación de entradas en categorías

- **Requisito:** El sistema deberá permitir clasificar cada entrada en ninguna, una o varias categorías de su mismo menú.
- **Criterios de aceptación:**
  - **RF-CAT-04.CA1:** Una categoría clasifica cero o más entradas.
  - **RF-CAT-04.CA2:** Una entrada puede pertenecer a más de una categoría.
  - **RF-CAT-04.CA3:** Clasificar una entrada en varias categorías no duplica la entrada.
  - **RF-CAT-04.CA4:** Una entrada solo se clasifica en categorías de su mismo menú; se rechaza una categoría de otro menú.
  - **RF-CAT-04.CA5:** Una entrada puede no tener categorías; en ese caso pertenece a la agrupación «sin categoría».

## Entradas

### RF-ENT-01 — Creación de una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una entrada del catálogo en el menú, con su nombre comercial, descripción, imagen y, opcionalmente, categorías.
- **Criterios de aceptación:**
  - **RF-ENT-01.CA1:** La entrada pertenece al menú en el que se crea.
  - **RF-ENT-01.CA2:** Los datos obligatorios son los de RF-GEN-03.CA3; la imagen se asocia conforme a RF-IMG-03.CA1 y las categorías, conforme a RF-CAT-04.CA4.
  - **RF-ENT-01.CA3:** El sistema conserva el nombre comercial, la descripción, la imagen y las categorías indicados.
  - **RF-ENT-01.CA4:** Toda entrada nueva inicia inactiva.
  - **RF-ENT-01.CA5:** El nombre comercial es la identidad comercial autoritativa de la entrada; la descripción, la imagen y las categorías describen esa identidad y no la composición de ninguna oferta.

### RF-ENT-02 — Edición de una entrada

- **Requisito:** El sistema deberá permitir al administrador modificar el nombre comercial, la descripción y las categorías de una entrada.
- **Criterios de aceptación:**
  - **RF-ENT-02.CA1:** Tras guardar, la entrada presenta los valores actualizados.
  - **RF-ENT-02.CA2:** La edición no cambia la imagen de la entrada, conforme a RF-IMG-03.CA2.
  - **RF-ENT-02.CA3:** Las categorías se asignan conforme a RF-CAT-04.CA4 y RF-CAT-04.CA5.
  - **RF-ENT-02.CA4:** Una entrada archivada no se edita, conforme a RF-ENT-05.CA3.

### RF-ENT-03 — Activación de una entrada

- **Requisito:** El sistema deberá permitir al administrador activar una entrada inactiva.
- **Criterios de aceptación:**
  - **RF-ENT-03.CA1:** Activar una entrada no exige que tenga ofertas, ofertas activas ni ofertas disponibles.
  - **RF-ENT-03.CA2:** Una entrada archivada no se activa directamente, conforme a RF-ENT-05.CA3.
  - **RF-ENT-03.CA3:** La activación no cambia el estado administrativo de sus ofertas, conforme a RF-GEN-04.CA5.

### RF-ENT-04 — Inactivación de una entrada

- **Requisito:** El sistema deberá permitir al administrador inactivar una entrada activa.
- **Criterios de aceptación:**
  - **RF-ENT-04.CA1:** Una entrada inactivada deja de presentarse a quien consulta el catálogo, conforme a RF-CONS-01.CA1.
  - **RF-ENT-04.CA2:** La inactivación no cambia el estado administrativo de sus ofertas, conforme a RF-GEN-04.CA5.

### RF-ENT-05 — Archivado de una entrada

- **Requisito:** El sistema deberá permitir al administrador archivar una entrada activa o inactiva.
- **Criterios de aceptación:**
  - **RF-ENT-05.CA1:** Una entrada se archiva desde el estado activo o inactivo.
  - **RF-ENT-05.CA2:** El archivado no cambia el estado administrativo de sus ofertas, conforme a RF-GEN-04.CA5.
  - **RF-ENT-05.CA3:** Sobre una entrada archivada solo se admiten el desarchivado (RF-ENT-06) y la eliminación (RF-ENT-07); cualquier otra operación sobre la entrada, sus ofertas, su composición o sus opciones (edición, cambio de estado administrativo, creación de ofertas, actualización o copia de composición, reemplazo del archivo de sus imágenes) se rechaza sin cambios.

### RF-ENT-06 — Desarchivado de una entrada

- **Requisito:** El sistema deberá permitir al administrador desarchivar una entrada archivada.
- **Criterios de aceptación:**
  - **RF-ENT-06.CA1:** Desarchivar deja siempre la entrada inactiva; solo vuelve a estar activa por una activación posterior conforme a RF-ENT-03.
  - **RF-ENT-06.CA2:** El desarchivado no cambia el estado administrativo de sus ofertas, conforme a RF-GEN-04.CA5.

### RF-ENT-07 — Eliminación de una entrada archivada

- **Requisito:** El sistema deberá permitir al administrador eliminar definitivamente una entrada archivada.
- **Criterios de aceptación:**
  - **RF-ENT-07.CA1:** Solo se elimina una entrada archivada; la eliminación de una entrada activa o inactiva se rechaza conforme a RF-GEN-05.CA1.
  - **RF-ENT-07.CA2:** Eliminar una entrada archivada elimina en cascada todas sus ofertas, también las activas, sin aplicar la condición de RF-OFE-06.CA1.
  - **RF-ENT-07.CA3:** Con cada oferta eliminada se eliminan su composición, grupos de selección y opciones, conforme a RF-OFE-06.CA3, y su imagen y la de la entrada, conforme a RF-IMG-04.CA3.
