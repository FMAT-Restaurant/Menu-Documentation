# Disponibilidad derivada

Este documento reúne los requisitos con los que el servicio Menu deriva la disponibilidad de opciones, grupos de selección, ofertas y entradas, y determina cuándo una oferta es ordenable. El índice completo de requisitos está en [`../functional-requirements.md`](../functional-requirements.md).

### RF-DISP-01 — Disponibilidad de una opción

- **Requisito:** El sistema deberá derivar la disponibilidad de cada opción del último estado comunicado por Inventario sobre su contenido.
- **Criterios de aceptación:**
  - **RF-DISP-01.CA1:** Una opción con receta está disponible si y solo si Inventario comunicó que su receta se puede elaborar.
  - **RF-DISP-01.CA2:** Una opción con contenido directo de Inventario está disponible si y solo si Inventario comunicó que su artículo está disponible; un artículo retirado de Inventario la deja no disponible conforme a RF-INTG-04.CA4.
  - **RF-DISP-01.CA3:** El estado administrativo de una opción no interviene en su propia disponibilidad.
- **Relacionados:** [OPEN-011](../open.md#open-011--contrato-de-eventos-con-inventario) (valor antes del primer evento).

### RF-DISP-02 — Disponibilidad de un grupo de selección

- **Requisito:** El sistema deberá considerar disponible un grupo de selección si y solo si tiene al menos una opción activa y disponible.
- **Criterios de aceptación:**
  - **RF-DISP-02.CA1:** Un grupo de selección está disponible si y solo si al menos una de sus opciones está activa y disponible.

### RF-DISP-03 — Disponibilidad de una oferta

- **Requisito:** El sistema deberá considerar disponible una oferta si y solo si todos sus grupos de selección están disponibles.
- **Criterios de aceptación:**
  - **RF-DISP-03.CA1:** Una oferta está disponible si y solo si todos sus grupos de selección lo están.

### RF-DISP-04 — Disponibilidad de una entrada

- **Requisito:** El sistema deberá considerar disponible una entrada si y solo si tiene al menos una oferta activa y disponible.
- **Criterios de aceptación:**
  - **RF-DISP-04.CA1:** Una entrada está disponible si y solo si al menos una de sus ofertas está activa y disponible; por tanto, una entrada sin ofertas activas no está disponible.

### RF-DISP-05 — Oferta ordenable

- **Requisito:** El sistema deberá considerar ordenable una oferta si y solo si ella y su entrada están activas y ambas están disponibles.
- **Criterios de aceptación:**
  - **RF-DISP-05.CA1:** Una oferta es ordenable si y solo si la oferta y su entrada están activas y ambas están disponibles; dejar de ser ordenable no cambia ningún estado administrativo, conforme a RF-GEN-04.CA4.
  - **RF-DISP-05.CA2:** Las ofertas de una entrada archivada no son ordenables.

### RF-DISP-06 — Recálculo y recuperación de la disponibilidad

- **Requisito:** El sistema deberá recalcular la disponibilidad de forma automática cada vez que cambian los datos de los que depende.
- **Criterios de aceptación:**
  - **RF-DISP-06.CA1:** La disponibilidad es un valor derivado que el administrador no asigna.
  - **RF-DISP-06.CA2:** Un cambio en la disponibilidad de una opción se propaga a su grupo de selección, a su oferta y a la entrada de esta.
  - **RF-DISP-06.CA3:** La disponibilidad se recalcula cuando cambia el estado administrativo de una opción, cuando se actualiza o copia una composición, cuando llega un evento de Inventario y cuando se activa, inactiva o elimina una oferta (este último caso, para su entrada).
  - **RF-DISP-06.CA4:** La disponibilidad se recupera sin intervención administrativa cuando vuelven a cumplirse sus condiciones.
  - **RF-DISP-06.CA5:** El recálculo no cambia ningún estado administrativo, conforme a RF-GEN-04.CA4.
- **Relacionados:** [OPEN-011](../open.md#open-011--contrato-de-eventos-con-inventario); [OPEN-012](../open.md#open-012--notificación-y-revisión-ante-cambios-de-disponibilidad).
