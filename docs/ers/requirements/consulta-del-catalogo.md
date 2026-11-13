# Consulta del catálogo

Este documento reúne los requisitos sobre la consulta del catálogo: la visibilidad para quien consulta el catálogo y para el administrador, la presentación de las ofertas, la búsqueda y el filtrado, el consumo del catálogo bajo demanda y la generación, el contenido y la organización de la carta imprimible. El índice de todos los requisitos se encuentra en [`../functional-requirements.md`](../functional-requirements.md).

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

### RF-CONS-06 — Generación de la carta imprimible

- **Requisito:** El sistema deberá permitir al administrador generar bajo demanda la carta imprimible del menú, un documento PDF con el catálogo destinado a los comensales.
- **Criterios de aceptación:**
  - **RF-CONS-06.CA1:** La generación de la carta imprimible requiere la capacidad de administrar el catálogo, conforme a RF-GEN-01.CA2.
  - **RF-CONS-06.CA2:** La carta imprimible se genera con el estado del catálogo en el momento de la solicitud.
  - **RF-CONS-06.CA3:** Menu no guarda la carta imprimible generada; cada solicitud genera una carta nueva.
  - **RF-CONS-06.CA4:** La generación de la carta imprimible no crea, modifica ni elimina ningún recurso del catálogo.
- **Relacionados:** [OPEN-010](../open.md#open-010--contrato-externo-de-la-api) (operación de generación de la carta imprimible).

### RF-CONS-07 — Contenido de la carta imprimible

- **Requisito:** El sistema deberá incluir en la carta imprimible las entradas activas y sus ofertas activas con sus datos comerciales, sin su disponibilidad ni su composición.
- **Criterios de aceptación:**
  - **RF-CONS-07.CA1:** La carta imprimible incluye únicamente las entradas activas que tienen al menos una oferta activa y, de cada una de ellas, únicamente sus ofertas activas; lo inactivo o archivado no se incluye.
  - **RF-CONS-07.CA2:** La disponibilidad no interviene en la inclusión de entradas y ofertas, y la carta imprimible no la muestra.
  - **RF-CONS-07.CA3:** Cada entrada incluida muestra su nombre comercial, su descripción y su imagen.
  - **RF-CONS-07.CA4:** Cada oferta incluida se presenta bajo su entrada con su etiqueta de presentación, que forma su nombre visible conforme a RF-CONS-02.CA3, su precio base y su imagen.
  - **RF-CONS-07.CA5:** La carta imprimible no muestra la composición de las ofertas: ni sus grupos de selección ni sus opciones.
  - **RF-CONS-07.CA6:** El encabezado de la carta imprimible muestra el nombre del menú, la fecha de generación y la moneda; el origen de la moneda queda pendiente en OPEN-001.
- **Relacionados:** [OPEN-001](../open.md#open-001--importes-de-precios).

### RF-CONS-08 — Organización de la carta imprimible

- **Requisito:** El sistema deberá organizar la carta imprimible en secciones por categoría.
- **Criterios de aceptación:**
  - **RF-CONS-08.CA1:** La carta imprimible presenta una sección por categoría del menú, en orden alfabético por el nombre de la categoría.
  - **RF-CONS-08.CA2:** Se omite toda sección sin entradas incluidas en la carta imprimible, tanto la de una categoría como la sección «sin categoría».
  - **RF-CONS-08.CA3:** Las entradas incluidas que no tienen categorías figuran en la sección «sin categoría», que se presenta después de las secciones de categoría.
  - **RF-CONS-08.CA4:** Dentro de cada sección, las entradas se presentan en orden alfabético por nombre comercial.
  - **RF-CONS-08.CA5:** Una entrada incluida que pertenece a varias categorías figura en la sección de cada una de ellas.
  - **RF-CONS-08.CA6:** Las ofertas de cada entrada se presentan en orden alfabético por etiqueta de presentación.
