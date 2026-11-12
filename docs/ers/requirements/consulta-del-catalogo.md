# Consulta del catálogo

Este documento reúne los requisitos sobre la consulta del catálogo: la visibilidad para quien consulta el catálogo y para el administrador, la presentación de las ofertas, la búsqueda y el filtrado, y el consumo del catálogo bajo demanda. El índice de todos los requisitos se encuentra en [`../functional-requirements.md`](../functional-requirements.md).

### RF-CONS-01 — Consulta del catálogo para quien no lo administra

- **Requisito:** El sistema deberá presentar a quien consulta el catálogo las entradas activas con sus ofertas activas, su disponibilidad y su composición.
- **Criterios de aceptación:**
  - **RF-CONS-01.CA1:** Se presentan únicamente las entradas activas, las ofertas activas de esas entradas y, en su composición, las opciones activas; lo inactivo o archivado, y las ofertas de una entrada que no está activa, no se presentan.
  - **RF-CONS-01.CA2:** Toda entrada, oferta, grupo de selección u opción presentada que no está disponible se presenta deshabilitada y no se puede ordenar ni elegir; la entrada activa sin ofertas disponibles se trata conforme a RF-DISP-04.CA1.
  - **RF-CONS-01.CA3:** La composición de cada oferta presentada muestra el tiempo de servicio de cada grupo de selección.
  - **RF-CONS-01.CA4:** Se presentan todas las categorías del menú, también las que no clasifican entradas, y la agrupación «sin categoría».
- **Relacionados:** [RNF-REND-01](../non-functional-requirements.md); [RNF-REND-02](../non-functional-requirements.md); [RNF-REND-03](../non-functional-requirements.md); [OPEN-010](../open.md#open-010--contrato-externo-de-la-api).

### RF-CONS-02 — Presentación de las ofertas vendibles

- **Requisito:** El sistema deberá presentar cada entrada con sus ofertas como productos vendibles seleccionables de forma independiente.
- **Criterios de aceptación:**
  - **RF-CONS-02.CA1:** Cada oferta se presenta como un producto vendible que se selecciona individualmente entre las ofertas de su entrada.
  - **RF-CONS-02.CA2:** Ninguna oferta queda preseleccionada.
  - **RF-CONS-02.CA3:** El nombre visible de la oferta resulta del nombre comercial de la entrada y de la etiqueta de presentación, distingue a la oferta de las demás ofertas de su entrada y no duplica ni altera el nombre comercial.
  - **RF-CONS-02.CA4:** La etiqueta de presentación describe la presentación de la oferta; no sustituye la composición ni determina cantidades físicas.
  - **RF-CONS-02.CA5:** Cada oferta presentada muestra su precio base, conforme a RF-OFE-03.CA3.
- **Relacionados:** [RNF-REND-01](../non-functional-requirements.md); [RNF-REND-02](../non-functional-requirements.md); [RNF-REND-03](../non-functional-requirements.md).

### RF-CONS-03 — Búsqueda y filtrado de entradas

- **Requisito:** El sistema deberá permitir buscar entradas por texto y filtrarlas por categoría, con la visibilidad que corresponde a cada capacidad.
- **Criterios de aceptación:**
  - **RF-CONS-03.CA1:** La búsqueda por texto considera el nombre comercial, la descripción y los nombres de las categorías de la entrada.
  - **RF-CONS-03.CA2:** El filtro por categoría admite cualquier categoría del menú y la agrupación «sin categoría».
  - **RF-CONS-03.CA3:** El administrador puede filtrar, además, por estado administrativo.
  - **RF-CONS-03.CA4:** Los resultados respetan la visibilidad de RF-CONS-01 para quien consulta el catálogo y la de RF-CONS-04 para el administrador.
- **Relacionados:** [RNF-REND-01](../non-functional-requirements.md); [RNF-REND-02](../non-functional-requirements.md); [RNF-REND-03](../non-functional-requirements.md); [OPEN-009](../open.md#open-009--distribución-de-carga-del-perfil-nominal); [OPEN-010](../open.md#open-010--contrato-externo-de-la-api).

### RF-CONS-04 — Consulta administrativa del catálogo

- **Requisito:** El sistema deberá permitir al administrador consultar las categorías, las entradas, las ofertas con su composición y las recetas de la biblioteca en cualquier estado administrativo.
- **Criterios de aceptación:**
  - **RF-CONS-04.CA1:** El administrador ve todos los recursos del catálogo en cualquier estado administrativo.
  - **RF-CONS-04.CA2:** Las entradas archivadas se presentan siempre al administrador, sin necesidad de filtro.
  - **RF-CONS-04.CA3:** La consulta incluye las ofertas de todo el catálogo, para elegir el origen de una copia conforme a RF-COMP-12, y las recetas de la biblioteca, para asignarlas por identificador conforme a RF-OPC-09.
  - **RF-CONS-04.CA4:** La consulta de entradas admite los filtros de RF-CONS-03.
- **Relacionados:** [OPEN-010](../open.md#open-010--contrato-externo-de-la-api).

### RF-CONS-05 — Consumo del catálogo bajo demanda

- **Requisito:** El sistema deberá poner el catálogo a disposición de sus consumidores, como Órdenes y el punto de venta, únicamente mediante consulta bajo demanda.
- **Criterios de aceptación:**
  - **RF-CONS-05.CA1:** Menu no emite eventos de cambios del catálogo (precio base, estado administrativo o disponibilidad); los consumidores obtienen esos datos consultándolos.
  - **RF-CONS-05.CA2:** Menu no ofrece una operación de validación de las elecciones de una orden; esa comprobación corresponde a Órdenes con los datos que consulta del catálogo.
- **Relacionados:** [OPEN-012](../open.md#open-012--notificación-y-revisión-ante-cambios-de-disponibilidad) (solo la notificación al administrador).
