# Ofertas

Este documento reúne los requisitos funcionales de las ofertas de una entrada del catálogo: su creación, su edición, su precio base, su activación, su inactivación y su eliminación. El índice completo de requisitos y las convenciones de redacción se encuentran en [Requisitos funcionales del servicio Menu](../functional-requirements.md).

### RF-OFE-01 — Creación de una oferta

- **Requisito:** El sistema deberá permitir al administrador crear una oferta en una entrada, con su etiqueta de presentación, precio base, imagen y composición inicial.
- **Criterios de aceptación:**
  - **RF-OFE-01.CA1:** Cada oferta pertenece a una única entrada, que la contiene.
  - **RF-OFE-01.CA2:** Una entrada puede tener varias ofertas, cada una con su precio base, su etiqueta de presentación y su imagen propios.
  - **RF-OFE-01.CA3:** Los datos obligatorios de la oferta son los establecidos en RF-GEN-03.CA4, y la imagen se asocia conforme a RF-IMG-03.CA1.
  - **RF-OFE-01.CA4:** La composición inicial se define con grupos de selección y opciones conforme a RF-COMP-09 y RF-OPC-01, y debe ser válida conforme a RF-COMP-01.CA4.
  - **RF-OFE-01.CA5:** Toda oferta nueva inicia inactiva.
  - **RF-OFE-01.CA6:** No se crean ofertas en una entrada archivada, conforme a RF-ENT-05.CA3.
- **Relacionados:** [OPEN-001](../open.md#open-001--importes-de-precios).

### RF-OFE-02 — Edición de una oferta

- **Requisito:** El sistema deberá permitir al administrador modificar la etiqueta de presentación y el precio base de una oferta, también cuando está activa.
- **Criterios de aceptación:**
  - **RF-OFE-02.CA1:** La etiqueta de presentación y el precio base se modifican tanto si la oferta está activa como si está inactiva.
  - **RF-OFE-02.CA2:** La edición no cambia el estado administrativo de la oferta.
  - **RF-OFE-02.CA3:** La edición no cambia la imagen de la oferta, conforme a RF-IMG-03.CA2.
  - **RF-OFE-02.CA4:** La edición exige la versión vigente de la oferta, conforme a RF-GEN-02.CA1.
- **Relacionados:** [OPEN-001](../open.md#open-001--importes-de-precios).

### RF-OFE-03 — Precio base de la oferta

- **Requisito:** El sistema deberá conservar como precio base de cada oferta el que declara el administrador, sin derivarlo de su composición.
- **Criterios de aceptación:**
  - **RF-OFE-03.CA1:** El precio base corresponde a la oferta completa.
  - **RF-OFE-03.CA2:** Los grupos de selección y las opciones no aportan cargos al precio base: cambiarlos no suma precios ni modifica el precio base.
  - **RF-OFE-03.CA3:** El precio base consultado coincide con el último declarado por el administrador.
  - **RF-OFE-03.CA4:** Menu no calcula el precio final de una orden; ese precio lo determina Órdenes.
- **Relacionados:** [OPEN-001](../open.md#open-001--importes-de-precios).

### RF-OFE-04 — Activación de una oferta

- **Requisito:** El sistema deberá permitir al administrador activar una oferta inactiva.
- **Criterios de aceptación:**
  - **RF-OFE-04.CA1:** Activar una oferta exige que su composición sea válida conforme a RF-COMP-01.CA2.
  - **RF-OFE-04.CA2:** Activar una oferta no exige que esté disponible.
  - **RF-OFE-04.CA3:** Una oferta puede activarse aunque su entrada esté inactiva.
  - **RF-OFE-04.CA4:** Las ofertas de una entrada archivada no se activan, conforme a RF-ENT-05.CA3.
  - **RF-OFE-04.CA5:** La activación recalcula la disponibilidad de la entrada conforme a RF-DISP-06.CA3.
- **Relacionados:** [OPEN-012](../open.md#open-012--notificación-y-revisión-ante-cambios-de-disponibilidad).

### RF-OFE-05 — Inactivación de una oferta

- **Requisito:** El sistema deberá permitir al administrador inactivar una oferta activa.
- **Criterios de aceptación:**
  - **RF-OFE-05.CA1:** Una oferta inactivada deja de presentarse a quien consulta el catálogo, conforme a RF-CONS-01.CA1.
  - **RF-OFE-05.CA2:** La oferta permanece inactiva hasta que el administrador la active, conforme a RF-GEN-04.CA7.
  - **RF-OFE-05.CA3:** La inactivación recalcula la disponibilidad de la entrada conforme a RF-DISP-06.CA3.

### RF-OFE-06 — Eliminación de una oferta inactiva

- **Requisito:** El sistema deberá permitir al administrador eliminar individualmente una oferta inactiva.
- **Criterios de aceptación:**
  - **RF-OFE-06.CA1:** Una oferta solo se elimina individualmente si está inactiva; la eliminación de una oferta activa se rechaza conforme a RF-GEN-05.CA1.
  - **RF-OFE-06.CA2:** La disponibilidad no interviene en la eliminación de una oferta.
  - **RF-OFE-06.CA3:** Al eliminar una oferta se eliminan también su composición, sus grupos de selección y sus opciones, que le pertenecen exclusivamente.
  - **RF-OFE-06.CA4:** Haber servido como origen de una copia no impide eliminar una oferta, conforme a RF-COMP-12.CA6.
  - **RF-OFE-06.CA5:** La eliminación recalcula la disponibilidad de la entrada conforme a RF-DISP-06.CA3, y la imagen de la oferta se elimina conforme a RF-IMG-04.CA3.
