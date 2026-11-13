# Trazabilidad de requisitos

Este documento relaciona los requisitos de la ERS 3.3.0 del servicio Menu entre sí y con su versión anterior. Contiene tres matrices: la de requisitos funcionales, con el número de criterios de aceptación de cada requisito y sus requisitos no funcionales y cuestiones abiertas relacionados; la de requisitos no funcionales, con los requisitos funcionales que miden; y la de cuestiones abiertas, con los requisitos que cada una afecta. Se completa con la tabla de reglas transversales, que indica el criterio dueño de cada regla y los criterios que la citan, y con la tabla de correspondencia, que asigna a cada identificador de la versión 2.4.1 los requisitos y criterios que lo sustituyen. Los requisitos funcionales se definen en los archivos enlazados desde [`functional-requirements.md`](functional-requirements.md); los no funcionales, en [`non-functional-requirements.md`](non-functional-requirements.md); y las cuestiones abiertas, en [`open.md`](open.md). Las cuestiones abiertas no se tratan como decisiones adoptadas.

## Matriz de requisitos funcionales

| Requisito | Título | Archivo | Nº de criterios | RNF relacionados | OPEN relacionadas |
| :--- | :--- | :--- | ---: | :--- | :--- |
| RF-GEN-01 | Permisos de las operaciones | [`transversales.md`](requirements/transversales.md) | 5 | — | — |
| RF-GEN-02 | Control de concurrencia por versión | [`transversales.md`](requirements/transversales.md) | 4 | — | — |
| RF-GEN-03 | Datos obligatorios y textos no vacíos | [`transversales.md`](requirements/transversales.md) | 9 | — | — |
| RF-GEN-04 | Estado administrativo | [`transversales.md`](requirements/transversales.md) | 7 | — | OPEN-012 |
| RF-GEN-05 | Atomicidad de las operaciones | [`transversales.md`](requirements/transversales.md) | 3 | — | — |
| RF-IMG-01 | Carga de una imagen | [`imagenes.md`](requirements/imagenes.md) | 2 | — | — |
| RF-IMG-02 | Validación del archivo de imagen | [`imagenes.md`](requirements/imagenes.md) | 6 | — | — |
| RF-IMG-03 | Asociación de una imagen a una entrada u oferta | [`imagenes.md`](requirements/imagenes.md) | 3 | — | — |
| RF-IMG-04 | Pertenencia y eliminación de imágenes | [`imagenes.md`](requirements/imagenes.md) | 3 | — | OPEN-014 |
| RF-IMG-05 | Reemplazo del archivo de una imagen | [`imagenes.md`](requirements/imagenes.md) | 6 | — | — |
| RF-CAT-01 | Creación de una categoría | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 4 | — | — |
| RF-CAT-02 | Edición de una categoría | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 4 | — | — |
| RF-CAT-03 | Eliminación de una categoría | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 3 | — | — |
| RF-CAT-04 | Clasificación de entradas en categorías | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 5 | — | — |
| RF-ENT-01 | Creación de una entrada | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 5 | — | — |
| RF-ENT-02 | Edición de una entrada | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 4 | — | — |
| RF-ENT-03 | Activación de una entrada | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 3 | — | — |
| RF-ENT-04 | Inactivación de una entrada | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 2 | — | — |
| RF-ENT-05 | Archivado de una entrada | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 3 | — | — |
| RF-ENT-06 | Desarchivado de una entrada | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 2 | — | — |
| RF-ENT-07 | Eliminación de una entrada archivada | [`categorias-y-entradas.md`](requirements/categorias-y-entradas.md) | 3 | — | — |
| RF-OFE-01 | Creación de una oferta | [`ofertas.md`](requirements/ofertas.md) | 6 | — | OPEN-001 |
| RF-OFE-02 | Edición de una oferta | [`ofertas.md`](requirements/ofertas.md) | 4 | — | OPEN-001 |
| RF-OFE-03 | Precio base de la oferta | [`ofertas.md`](requirements/ofertas.md) | 4 | — | OPEN-001 |
| RF-OFE-04 | Activación de una oferta | [`ofertas.md`](requirements/ofertas.md) | 5 | — | OPEN-012 |
| RF-OFE-05 | Inactivación de una oferta | [`ofertas.md`](requirements/ofertas.md) | 3 | — | — |
| RF-OFE-06 | Eliminación de una oferta inactiva | [`ofertas.md`](requirements/ofertas.md) | 5 | — | — |
| RF-COMP-01 | Composición válida | [`composicion.md`](requirements/composicion.md) | 4 | — | — |
| RF-COMP-02 | Grupos de selección obligatorios | [`composicion.md`](requirements/composicion.md) | 5 | — | — |
| RF-COMP-03 | Número de rondas del grupo de selección | [`composicion.md`](requirements/composicion.md) | 3 | — | OPEN-006 |
| RF-COMP-04 | Tiempo de servicio del grupo de selección | [`composicion.md`](requirements/composicion.md) | 4 | — | — |
| RF-COMP-05 | Elegibilidad de opciones por ronda | [`composicion.md`](requirements/composicion.md) | 3 | — | — |
| RF-COMP-06 | Opción predeterminada del grupo de selección | [`composicion.md`](requirements/composicion.md) | 2 | — | — |
| RF-COMP-07 | Orden de presentación de grupos y opciones | [`composicion.md`](requirements/composicion.md) | 3 | — | — |
| RF-COMP-08 | Actualización parcial de la composición | [`composicion.md`](requirements/composicion.md) | 7 | — | — |
| RF-COMP-09 | Alta de un grupo de selección | [`composicion.md`](requirements/composicion.md) | 2 | — | — |
| RF-COMP-10 | Modificación de un grupo de selección | [`composicion.md`](requirements/composicion.md) | 2 | — | — |
| RF-COMP-11 | Eliminación de grupos de selección | [`composicion.md`](requirements/composicion.md) | 3 | — | — |
| RF-COMP-12 | Copia de composición desde otra oferta | [`composicion.md`](requirements/composicion.md) | 9 | — | OPEN-011 |
| RF-OPC-01 | Alta de una opción | [`opciones.md`](requirements/opciones.md) | 3 | — | — |
| RF-OPC-02 | Modificación de una opción | [`opciones.md`](requirements/opciones.md) | 2 | — | — |
| RF-OPC-03 | Eliminación de opciones | [`opciones.md`](requirements/opciones.md) | 3 | — | — |
| RF-OPC-04 | Activación de una opción | [`opciones.md`](requirements/opciones.md) | 2 | — | — |
| RF-OPC-05 | Inactivación de una opción | [`opciones.md`](requirements/opciones.md) | 2 | — | — |
| RF-OPC-06 | Nombre mostrado de la opción | [`opciones.md`](requirements/opciones.md) | 2 | — | — |
| RF-OPC-07 | Origen de contenido de la opción | [`opciones.md`](requirements/opciones.md) | 3 | — | — |
| RF-OPC-08 | Contenido directo de Inventario | [`opciones.md`](requirements/opciones.md) | 5 | — | OPEN-006 |
| RF-OPC-09 | Asignación de una receta existente | [`opciones.md`](requirements/opciones.md) | 5 | — | — |
| RF-OPC-10 | Creación de una receta desde la opción | [`opciones.md`](requirements/opciones.md) | 3 | — | — |
| RF-REC-01 | Creación de una receta | [`recetas.md`](requirements/recetas.md) | 6 | — | OPEN-003 |
| RF-REC-02 | Líneas de ingrediente | [`recetas.md`](requirements/recetas.md) | 8 | — | OPEN-006 |
| RF-REC-03 | Unidad de medida visible | [`recetas.md`](requirements/recetas.md) | 2 | — | OPEN-006 |
| RF-REC-04 | Edición de una receta por revisión | [`recetas.md`](requirements/recetas.md) | 6 | — | OPEN-011 |
| RF-REC-05 | Conservación del historial de revisiones | [`recetas.md`](requirements/recetas.md) | 2 | — | — |
| RF-REC-06 | Consulta del historial de revisiones | [`recetas.md`](requirements/recetas.md) | 3 | — | — |
| RF-REC-07 | Eliminación de una receta sin referencias | [`recetas.md`](requirements/recetas.md) | 4 | — | — |
| RF-DISP-01 | Disponibilidad de una opción | [`disponibilidad.md`](requirements/disponibilidad.md) | 3 | — | OPEN-011 |
| RF-DISP-02 | Disponibilidad de un grupo de selección | [`disponibilidad.md`](requirements/disponibilidad.md) | 1 | — | — |
| RF-DISP-03 | Disponibilidad de una oferta | [`disponibilidad.md`](requirements/disponibilidad.md) | 1 | — | — |
| RF-DISP-04 | Disponibilidad de una entrada | [`disponibilidad.md`](requirements/disponibilidad.md) | 1 | — | — |
| RF-DISP-05 | Oferta ordenable | [`disponibilidad.md`](requirements/disponibilidad.md) | 2 | — | — |
| RF-DISP-06 | Recálculo y recuperación de la disponibilidad | [`disponibilidad.md`](requirements/disponibilidad.md) | 5 | — | OPEN-011, OPEN-012 |
| RF-INTG-01 | Validación síncrona de artículos de Inventario | [`integracion-con-inventario.md`](requirements/integracion-con-inventario.md) | 3 | — | — |
| RF-INTG-02 | Autoridad de Inventario sobre sus artículos | [`integracion-con-inventario.md`](requirements/integracion-con-inventario.md) | 4 | — | — |
| RF-INTG-03 | Recepción de la disponibilidad de los orígenes de contenido | [`integracion-con-inventario.md`](requirements/integracion-con-inventario.md) | 6 | — | OPEN-011 |
| RF-INTG-04 | Opción de contenido directo como origen publicado | [`integracion-con-inventario.md`](requirements/integracion-con-inventario.md) | 4 | — | — |
| RF-INTG-05 | Emisión de eventos de orígenes de contenido | [`integracion-con-inventario.md`](requirements/integracion-con-inventario.md) | 6 | — | OPEN-011 |
| RF-CONS-01 | Consulta del catálogo para quien no lo administra | [`consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md) | 5 | RNF-REND-01, RNF-REND-02, RNF-REND-03 | — |
| RF-CONS-02 | Presentación de las ofertas vendibles | [`consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md) | 5 | RNF-REND-01, RNF-REND-02, RNF-REND-03 | — |
| RF-CONS-03 | Búsqueda y filtrado de entradas | [`consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md) | 4 | RNF-REND-01, RNF-REND-02, RNF-REND-03 | OPEN-009 |
| RF-CONS-04 | Consulta administrativa del catálogo | [`consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md) | 6 | — | — |
| RF-CONS-05 | Consumo del catálogo bajo demanda | [`consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md) | 2 | — | OPEN-012 |
| RF-CONS-06 | Generación de la carta imprimible | [`consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md) | 4 | — | — |
| RF-CONS-07 | Contenido de la carta imprimible | [`consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md) | 6 | — | OPEN-001 |
| RF-CONS-08 | Organización de la carta imprimible | [`consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md) | 6 | — | — |

Total: 75 requisitos funcionales y 295 criterios de aceptación.

## Matriz de requisitos no funcionales

| RNF | Tema | RF relacionados | OPEN relacionadas |
| :--- | :--- | :--- | :--- |
| RNF-REND-01 | Presupuesto de rendimiento de aceptación | RF-CONS-01, RF-CONS-02, RF-CONS-03 | — |
| RNF-REND-02 | Perfil nominal de operación | RF-CONS-01, RF-CONS-02, RF-CONS-03 | OPEN-009 |
| RNF-REND-03 | Capacidad ante ráfagas | RF-CONS-01, RF-CONS-02, RF-CONS-03 | OPEN-009 |

Los tres requisitos no funcionales miden solo la consulta, la búsqueda y el filtrado del catálogo y se definen en [`non-functional-requirements.md`](non-functional-requirements.md).

## Matriz de cuestiones abiertas

| OPEN | Tema | RF/RNF afectados |
| :--- | :--- | :--- |
| [OPEN-001](open.md#open-001--importes-de-precios) | Importes de precios | RF-OFE-01, RF-OFE-02, RF-OFE-03, RF-CONS-07 |
| [OPEN-003](open.md#open-003--alcance-de-la-biblioteca-de-recetas) | Alcance de la biblioteca de recetas | RF-REC-01 |
| [OPEN-006](open.md#open-006--cantidades-y-unidades) | Cantidades y unidades | RF-COMP-03, RF-OPC-08, RF-REC-02, RF-REC-03 |
| [OPEN-009](open.md#open-009--distribución-de-carga-del-perfil-nominal) | Distribución de carga del perfil nominal | RF-CONS-03, RNF-REND-02, RNF-REND-03 |
| [OPEN-011](open.md#open-011--garantías-de-entrega-de-los-eventos-con-inventario) | Garantías de entrega de los eventos con Inventario | RF-COMP-12, RF-REC-04, RF-DISP-01, RF-DISP-06, RF-INTG-03, RF-INTG-05 |
| [OPEN-012](open.md#open-012--notificación-y-revisión-ante-cambios-de-disponibilidad) | Notificación y revisión ante cambios de disponibilidad | RF-GEN-04, RF-OFE-04, RF-DISP-06, RF-CONS-05 |
| [OPEN-014](open.md#open-014--retención-de-imágenes-nunca-asociadas) | Retención de imágenes nunca asociadas | RF-IMG-04 |

## Reglas transversales

Cada regla transversal tiene un único criterio dueño, o un conjunto de criterios dueños dentro del mismo requisito, que la enuncia; los demás criterios la citan con «conforme a» sin repetirla. En la columna de citas, los criterios se agrupan por el criterio citado; cuando una regla se detalla en otros criterios de su mismo requisito, también se incluyen las citas a esos criterios.

| Regla | Criterio dueño | Criterios que la citan |
| :--- | :--- | :--- |
| Permisos de las operaciones | RF-GEN-01.CA5 | RF-GEN-01.CA5: RF-CONS-01.CA5, RF-CONS-04.CA6, RF-CONS-06.CA1, RF-REC-06.CA3 |
| Datos obligatorios y textos no vacíos | RF-GEN-03.CA1 | RF-GEN-03.CA2: RF-CAT-01.CA2; RF-GEN-03.CA3: RF-ENT-01.CA2; RF-GEN-03.CA4: RF-OFE-01.CA3; RF-GEN-03.CA5: RF-COMP-01.CA2, RF-COMP-09.CA2; RF-GEN-03.CA6: RF-COMP-01.CA2, RF-OPC-01.CA3; RF-GEN-03.CA7: RF-REC-01.CA2 |
| Versión vigente del recurso | RF-GEN-02.CA1, RF-GEN-02.CA2 | RF-GEN-02.CA1: RF-CAT-02.CA4, RF-IMG-05.CA5, RF-OFE-02.CA4, RF-REC-04.CA6, RF-REC-07.CA4; RF-GEN-02.CA4: RF-COMP-08.CA4, RF-COMP-12.CA8 |
| Atomicidad de las operaciones | RF-GEN-05.CA1 | RF-GEN-05.CA1: RF-GEN-03.CA1, RF-IMG-03.CA3, RF-IMG-05.CA4, RF-ENT-07.CA1, RF-OFE-06.CA1, RF-COMP-08.CA5, RF-COMP-12.CA8, RF-OPC-09.CA3, RF-REC-07.CA2, RF-INTG-01.CA2, RF-INTG-01.CA3; RF-GEN-05.CA3: RF-IMG-01.CA2, RF-OPC-10.CA3 |
| Estado administrativo | RF-GEN-04.CA4, RF-GEN-04.CA5, RF-GEN-04.CA6 | RF-GEN-04.CA4: RF-COMP-08.CA6, RF-OPC-04.CA2, RF-OPC-05.CA2, RF-DISP-05.CA1, RF-DISP-06.CA5, RF-INTG-03.CA6; RF-GEN-04.CA5: RF-ENT-03.CA3, RF-ENT-04.CA2, RF-ENT-05.CA2, RF-ENT-06.CA2; RF-GEN-04.CA7: RF-OFE-05.CA2 |
| Visibilidad para quien consulta el catálogo | RF-CONS-01.CA1, RF-CONS-01.CA2 | RF-CONS-01: RF-GEN-01.CA5, RF-CONS-03.CA4; RF-CONS-01.CA1: RF-ENT-04.CA1, RF-OFE-05.CA1, RF-OPC-04.CA1, RF-OPC-05.CA1; RF-CONS-01.CA2: RF-COMP-01.CA3, RF-INTG-03.CA3 |
| Composición válida | RF-COMP-01.CA2, RF-COMP-01.CA4 | RF-COMP-01.CA2: RF-OFE-04.CA1; RF-COMP-01.CA4: RF-OFE-01.CA4 |
| Recálculo de la disponibilidad | RF-DISP-06.CA3 | RF-DISP-06.CA3: RF-OFE-04.CA5, RF-OFE-05.CA3, RF-OFE-06.CA5, RF-COMP-08.CA6, RF-COMP-12.CA9, RF-OPC-04.CA2, RF-OPC-05.CA2; RF-DISP-06.CA2: RF-INTG-03.CA3; RF-DISP-06.CA4: RF-INTG-03.CA4 |
| Imagen de entradas y ofertas | RF-IMG-03.CA1, RF-IMG-03.CA2, RF-IMG-04.CA2 | RF-IMG-03.CA1: RF-ENT-01.CA2, RF-OFE-01.CA3; RF-IMG-03.CA2: RF-ENT-02.CA2, RF-OFE-02.CA3; RF-IMG-04.CA2: RF-IMG-05.CA3; RF-IMG-04.CA3: RF-ENT-07.CA3, RF-OFE-06.CA5 |
| Unidad de medida de Inventario | RF-INTG-02.CA3 | RF-INTG-02.CA3: RF-REC-03.CA2 |
| Estado administrativo inicial de las opciones | RF-OPC-01.CA2 | RF-OPC-01.CA2: RF-GEN-03.CA6, RF-COMP-12.CA4 |
| Revisión vigente de la receta | RF-OPC-09.CA2 | RF-OPC-09.CA2: RF-COMP-12.CA5 |
| Elegibilidad de opciones | RF-COMP-05.CA1, RF-COMP-05.CA2 | RF-COMP-05.CA1: RF-COMP-03.CA2; RF-COMP-05.CA2: RF-OPC-04.CA1, RF-OPC-05.CA1 |

## Tabla de correspondencia

Esta tabla es el único lugar de la ERS, junto con el registro de cambios de [`configuration.md`](configuration.md), en el que figuran los identificadores de la versión 2.4.1. Cubre los 63 identificadores anteriores (28 requisitos funcionales, 3 requisitos no funcionales, 24 reglas de negocio y 8 invariantes) y los elementos sin identificador; todos tienen destino en la versión 3.0.0.

### Requisitos funcionales de la versión 2.4.1

| Antiguo | Nuevo |
| :--- | :--- |
| REQ-MENU-CAT-001 | RF-CAT-01 (CA1, CA2), RF-CAT-02 (CA2, CA3), RF-CAT-04.CA1, RF-GEN-03.CA2 |
| REQ-MENU-CAT-002 | RF-CONS-01 (CA1–CA3), RF-CONS-02 (CA3, CA5), RF-GEN-04 (CA5, CA6), RF-CONS-04.CA1 |
| REQ-MENU-ENTRY-001 | RF-ENT-01 (CA2–CA4), RF-GEN-03.CA3, RF-IMG-03.CA1, RF-CAT-04.CA4, RF-CONS-01.CA1 |
| REQ-MENU-ENTRY-002 | RF-ENT-02 (CA1–CA3), RF-CAT-04.CA4; el reemplazo de la imagen por otro identificador queda sustituido por RF-IMG-03.CA2 y RF-IMG-05 |
| REQ-MENU-ENTRY-003 | RF-ENT-03, RF-ENT-04, RF-ENT-05 (CA1, CA2), RF-ENT-06, RF-GEN-04 (CA4, CA5, CA6), RF-CONS-01 (CA1, CA2), RF-DISP-04 |
| REQ-MENU-ENTRY-004 | RF-ENT-07 |
| REQ-MENU-OFFER-001 | RF-OFE-01 (CA1–CA3, CA5), RF-GEN-03.CA4, RF-IMG-03.CA1 |
| REQ-MENU-OFFER-002 | RF-CONS-02 (CA1–CA4) |
| REQ-MENU-OFFER-003 | RF-OFE-03 (CA1–CA3), RF-OFE-02.CA1 |
| REQ-MENU-OFFER-004 | RF-OFE-04 (CA1–CA3), RF-OFE-05, RF-CONS-01 (CA1, CA2), RF-DISP-03, RF-DISP-05, RF-DISP-06.CA4, RF-GEN-04 (CA4, CA6, CA7) |
| REQ-MENU-OFFER-005 | RF-COMP-12 (CA2–CA7, CA9) |
| REQ-MENU-OFFER-006 | RF-OFE-06 (CA1–CA3) |
| REQ-MENU-COMP-001 | RF-COMP-01 (CA1, CA2), RF-COMP-02 (CA1, CA3), RF-COMP-08 (definición de la composición) |
| REQ-MENU-COMP-002 | RF-COMP-02 (CA1, CA2), RF-DISP-03, RF-DISP-05.CA1 |
| REQ-MENU-COMP-003 | RF-COMP-01.CA2, RF-OPC-01, RF-OPC-04, RF-OPC-05, RF-DISP-02, RF-COMP-05 (CA1, CA2), RF-COMP-06 |
| REQ-MENU-COMP-004 | RF-COMP-03, RF-COMP-05.CA1 |
| REQ-MENU-COMP-005 | RF-COMP-04 |
| REQ-MENU-COMP-006 | RF-COMP-08, RF-COMP-09, RF-COMP-10, RF-COMP-11 (CA1, CA2), RF-OPC-01 (CA1, CA3), RF-OPC-02.CA1, RF-OPC-03 (CA1, CA2), RF-GEN-02 (CA1, CA2, CA4), RF-GEN-03 (CA5, CA6), RF-DISP-06.CA3 |
| REQ-MENU-CONT-001 | RF-OPC-07.CA1, RF-OPC-09 (CA1, CA2), RF-OPC-10.CA2, RF-OPC-04, RF-OPC-05, RF-OPC-06, RF-COMP-05.CA2, RF-DISP-06.CA3 |
| REQ-MENU-CONT-002 | RF-OPC-08 (CA1, CA3, CA5), RF-OPC-06, RF-COMP-03.CA3 |
| REQ-MENU-CONT-003 | RF-OPC-09 (CA1–CA5), RF-OPC-10 (CA1, CA2), RF-REC-04.CA4 |
| REQ-MENU-REC-001 | RF-REC-01 (CA1–CA3, CA5, CA6), RF-REC-02.CA1, RF-OPC-10 |
| REQ-MENU-REC-002 | RF-REC-02 (CA2, CA4), RF-COMP-03.CA3 |
| REQ-MENU-REC-003 | RF-REC-04 (CA1, CA4, CA5), RF-REC-01.CA4, RF-REC-05.CA1 |
| REQ-MENU-REC-004 | RF-REC-03 |
| REQ-MENU-REC-005 | RF-REC-07 (CA1–CA3), RF-REC-05.CA2 |
| REQ-MENU-AVAIL-001 | RF-INTG-03, RF-DISP-01, RF-DISP-06 (CA2–CA4) |
| REQ-MENU-AVAIL-002 | RF-INTG-05 |

### Requisitos no funcionales de la versión 2.4.1

| Antiguo | Nuevo |
| :--- | :--- |
| NFR-MENU-PERF-01 | RNF-REND-01 (solo consulta, búsqueda y filtrado; la parte de validación de selecciones al aceptar una orden se retira y su regla de dominio queda en RF-CONS-05.CA2) |
| NFR-MENU-PERF-02 | RNF-REND-02 (se conserva la fila de latencia de búsqueda, filtrado o consulta por categoría; se retiran la fila de validación de selecciones de extremo a extremo y su clase de operación) |
| NFR-MENU-PERF-03 | RNF-REND-03 (mezcla de carga sin la validación de selecciones) |

### Reglas de negocio de la versión 2.4.1

| Antiguo | Nuevo |
| :--- | :--- |
| BR-MENU-001 | RF-CAT-01.CA1, RF-CAT-04 (CA1–CA4) |
| BR-MENU-002 | RF-OFE-01.CA1, RF-ENT-01.CA5 |
| BR-MENU-003 | RF-ENT-01.CA4, RF-GEN-04 (CA1, CA4), RF-GEN-01.CA2, RF-CONS-01.CA1, RF-ENT-05.CA1, RF-ENT-06.CA1, RF-ENT-07.CA1; la «retirada del catálogo administrable habitual» queda sustituida por RF-CONS-04.CA2 y RF-ENT-05.CA3 |
| BR-MENU-004 | RF-CONS-01 (CA1, CA2), RF-DISP-04, RF-GEN-04 (CA5, CA6) |
| BR-MENU-005 | RF-OFE-01.CA1, RF-GEN-03.CA4, RF-CONS-02 (CA1, CA3, CA4) |
| BR-MENU-006 | RF-COMP-01 (CA1, CA2), RF-GEN-04.CA3, RF-DISP-02, RF-OFE-04 (CA1, CA2) |
| BR-MENU-007 | RF-OFE-03 (CA1, CA2), RF-COMP-12.CA7 |
| BR-MENU-008 | RF-COMP-02 (CA1, CA2), RF-DISP-03, RF-GEN-04.CA4 |
| BR-MENU-009 | RF-COMP-06, RF-COMP-05.CA1, RF-DISP-02.CA1, RF-DISP-05.CA1 |
| BR-MENU-010 | RF-COMP-03 |
| BR-MENU-011 | RF-COMP-05 (CA1, CA2) |
| BR-MENU-012 | RF-COMP-02 (CA4, CA5) |
| BR-MENU-013 | RF-COMP-04 |
| BR-MENU-015 | RF-OPC-06 (CA1, CA2), RF-COMP-12 (CA2, CA4–CA6, CA9) |
| BR-MENU-016 | RF-GEN-04 (CA2, CA4), RF-GEN-01.CA2, RF-DISP-01, RF-CONS-01 (CA1, CA2), RF-DISP-06.CA3 |
| BR-MENU-017 | RF-OPC-07.CA1 |
| BR-MENU-018 | RF-INTG-02, RF-OPC-08.CA2, RF-INTG-03.CA1, RF-INTG-03.CA5, RF-COMP-01.CA3; la «unidad compatible con el artículo» queda sustituida por RF-OPC-08.CA3 (cantidad en la unidad de Inventario, sin unidad propia) |
| BR-MENU-019 | RF-REC-02 (CA1, CA2), RF-REC-03.CA1; la «unidad compatible» queda sustituida por RF-REC-02.CA4 |
| BR-MENU-020 | RF-REC-01 (CA1, CA2, CA4), RF-OPC-09 (CA1, CA2, CA4), RF-OPC-10.CA2, RF-REC-04 (CA1, CA4), RF-REC-05.CA1 |
| BR-MENU-030 | RF-OFE-06 (CA1–CA3) |
| BR-MENU-031 | RF-REC-07 (CA1, CA2), RF-REC-05.CA2 |
| BR-MENU-032 | RF-DISP-01, RF-DISP-02, RF-DISP-03, RF-DISP-04, RF-DISP-05, RF-DISP-06 (CA1, CA4), RF-GEN-04.CA4 |
| BR-MENU-033 | RF-CONS-01 (CA1, CA2), RF-CONS-04.CA1 |
| BR-MENU-034 | RF-INTG-03, RF-INTG-04, RF-INTG-05, RF-GEN-04.CA4 (modificada: la validación de artículos pasa a ser síncrona, RF-INTG-01) |

### Invariantes de la versión 2.4.1

| Antiguo | Nuevo |
| :--- | :--- |
| INV-MENU-001 | RF-ENT-01.CA1, RF-CAT-01.CA1, RF-CAT-04.CA4 |
| INV-MENU-002 | RF-GEN-04.CA4, RF-COMP-01.CA4 (generalizada a toda oferta), RF-OFE-04.CA1, RF-DISP-05.CA1 |
| INV-MENU-003 | RF-COMP-01.CA2, RF-COMP-02.CA2, RF-DISP-02.CA1, RF-DISP-03.CA1, RF-COMP-06 |
| INV-MENU-004 | RF-OPC-07.CA1, RF-COMP-05 (CA1, CA2) |
| INV-MENU-005 | RF-OPC-08 (CA1, CA2), RF-REC-02 (CA1, CA2), RF-REC-03, RF-INTG-02.CA3; la «unidad compatible» queda sustituida por RF-OPC-08.CA3 y RF-REC-02.CA4 |
| INV-MENU-007 | RF-OFE-03 (CA2, CA3, CA4), RF-COMP-12.CA7 |
| INV-MENU-008 | RF-OPC-09 (CA1–CA4), RF-REC-05 (CA1, CA2), RF-REC-06.CA2 |
| INV-MENU-009 | RF-ENT-07.CA1, RF-OFE-06.CA1 |

### Elementos sin identificador de la versión 2.4.1

| Antiguo | Nuevo |
| :--- | :--- |
| Criterio común para imágenes | RF-IMG-01, RF-IMG-02, RF-IMG-03 (CA1, CA3), RF-GEN-05.CA3; el reemplazo de la imagen indicando otro identificador, y la conservación de la vigente al omitirlo, quedan sustituidos por RF-IMG-03.CA2 (identificador fijo) y RF-IMG-05 (reemplazo del archivo) |
| Párrafo «Integración con Inventario» de los requisitos funcionales | Introducción de [`integracion-con-inventario.md`](requirements/integracion-con-inventario.md), RF-INTG-03.CA1 |
| OPEN-005 (resuelta) | RF-IMG-01..05; la resolución se registra en el registro de cambios y en la sección «Decisión resuelta» de este documento |

## Decisión resuelta

OPEN-005 está resuelta: la carga previa e independiente del archivo de imagen, su validación, su asociación permanente a una entrada u oferta mediante su identificador y el reemplazo de su archivo se especifican en RF-IMG-01..05, en [`imagenes.md`](requirements/imagenes.md).

OPEN-010 está cerrada desde la versión 3.2.0: el contrato de la API, en su versión 8.0.0, queda alineado con esta ERS e incluye las operaciones y representaciones que faltaban; las longitudes máximas de los textos, la idempotencia de los reintentos y la paginación siguen perteneciendo al contrato.

OPEN-013 está cerrada desde la versión 3.2.0: los permisos de RF-GEN-01 sustituyen a las dos capacidades anteriores, con permisos separados de consulta, de gestión y de cambio de estado por recurso.

## Criterio de mantenimiento

Cuando se cree o cambie un identificador normativo, este documento debe actualizarse junto con el documento que lo define. La revisión debe confirmar que:

1. Cada requisito funcional y cada criterio de aceptación se definen una sola vez en la ERS, y cada requisito funcional aparece una vez en la matriz de requisitos funcionales con su número de criterios vigente.
2. Cada requisito no funcional y cada cuestión abierta aparecen una vez como entrada propia en su matriz.
3. Cada relación y cada cita «conforme a» apuntan a un requisito o criterio existente, y las relaciones muestran solo vínculos respaldados por los criterios vigentes.
4. La tabla de correspondencia cubre todos los identificadores de la versión 2.4.1.
5. Solo las cuestiones sin resolver permanecen en [`open.md`](open.md); cuando una decisión autorizada las cierre, se retiran de ese registro y su resultado se incorpora al requisito aplicable y a este documento.
