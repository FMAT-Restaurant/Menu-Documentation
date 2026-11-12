# Requisitos funcionales del servicio Menu

La ERS 3.0.0 organiza 72 requisitos funcionales en 11 áreas, distribuidos en 10 archivos del directorio `requirements/`. Cada requisito declara una capacidad del servicio Menu, y sus criterios de aceptación expresan las reglas del dominio que la capacidad debe respetar. Este documento es el índice de esos requisitos: no contiene criterios ni normas propias.

## Convenciones

### Identificadores

| Tipo | Formato | Ejemplo | Observaciones |
| :-- | :-- | :-- | :-- |
| Requisito funcional | `RF-<ÁREA>-NN` | `RF-ENT-01` | NN tiene dos dígitos, empieza en 01 en cada área y no tiene huecos. |
| Criterio de aceptación | `RF-<ÁREA>-NN.CAn` | `RF-ENT-01.CA3` | n empieza en 1 en cada requisito y no tiene huecos. |
| Requisito no funcional | `RNF-REND-NN` | `RNF-REND-02` | Se definen en [non-functional-requirements.md](non-functional-requirements.md). |
| Cuestión abierta | `OPEN-NNN` | `OPEN-011` | Se registran en [open.md](open.md); las nuevas continúan la numeración. |

La correspondencia entre estos identificadores y los de versiones anteriores de la ERS se recoge en [traceability.md](traceability.md).

### Códigos de área

| Código | Área | Archivo |
| :-- | :-- | :-- |
| `GEN` | Reglas generales: capacidades, concurrencia, datos obligatorios, estado administrativo, atomicidad | [transversales.md](requirements/transversales.md) |
| `IMG` | Imágenes | [imagenes.md](requirements/imagenes.md) |
| `CAT` | Categorías | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| `ENT` | Entradas del catálogo | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| `OFE` | Ofertas | [ofertas.md](requirements/ofertas.md) |
| `COMP` | Composición y grupos de selección | [composicion.md](requirements/composicion.md) |
| `OPC` | Opciones y su contenido | [opciones.md](requirements/opciones.md) |
| `REC` | Recetas y biblioteca de recetas | [recetas.md](requirements/recetas.md) |
| `DISP` | Disponibilidad derivada | [disponibilidad.md](requirements/disponibilidad.md) |
| `INTG` | Integración con Inventario (validación síncrona y eventos) | [integracion-con-inventario.md](requirements/integracion-con-inventario.md) |
| `CONS` | Consulta del catálogo | [consulta-del-catalogo.md](requirements/consulta-del-catalogo.md) |

### Formato de la ficha de requisito

Cada requisito se presenta con una ficha de la siguiente forma:

```markdown
### RF-ENT-01 — Creación de una entrada

- **Requisito:** El sistema deberá permitir al administrador crear una entrada del catálogo …
- **Criterios de aceptación:**
  - **RF-ENT-01.CA1:** La entrada pertenece al menú en el que se crea.
  - **RF-ENT-01.CA2:** …
- **Relacionados:** RNF-REND-02; OPEN-006.
```

- **Requisito:** una sola oración «El sistema deberá…» que declara una sola capacidad, sea una acción de un actor o un comportamiento del sistema.
- **Criterios de aceptación:** cada criterio es atómico, describe un hecho verificable, lleva su identificador y expresa por sí mismo la regla o invariante que establece.
- **Relacionados:** solo requisitos no funcionales y cuestiones abiertas; la línea se omite cuando no hay ninguno.
- Las remisiones a una cuestión abierta se escriben al final del criterio («…; lo que falta queda pendiente en OPEN-0NN») sin convertir lo pendiente en norma.

### Citas entre criterios

Cada regla transversal tiene un único criterio dueño. Los demás requisitos que dependen de ella no la repiten: la citan como texto con la fórmula «conforme a RF-XXX-NN.CAn», o «conforme a RF-XXX-NN» cuando remiten a un requisito completo.

### Significado de «ordenar» y actores

- «Ordenar» significa siempre pedir en una orden; de ahí el adjetivo «ordenable». Para la secuencia en que se muestran los elementos se emplea «orden de presentación».
- «El administrador» es quien tiene la capacidad de administrar el catálogo.
- «Quien consulta el catálogo» es quien solo tiene la capacidad de consultarlo, conforme a RF-GEN-01.

## Áreas y archivos

| Orden | Archivo | Título | Requisitos | Nº RF |
| --: | :-- | :-- | :-- | --: |
| 1 | [transversales.md](requirements/transversales.md) | Reglas generales del catálogo | RF-GEN-01..05 | 5 |
| 2 | [imagenes.md](requirements/imagenes.md) | Imágenes de entradas y ofertas | RF-IMG-01..05 | 5 |
| 3 | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) | Categorías y entradas del catálogo | RF-CAT-01..04, RF-ENT-01..07 | 11 |
| 4 | [ofertas.md](requirements/ofertas.md) | Ofertas | RF-OFE-01..06 | 6 |
| 5 | [composicion.md](requirements/composicion.md) | Composición y grupos de selección | RF-COMP-01..12 | 12 |
| 6 | [opciones.md](requirements/opciones.md) | Opciones y contenido | RF-OPC-01..10 | 10 |
| 7 | [recetas.md](requirements/recetas.md) | Recetas | RF-REC-01..07 | 7 |
| 8 | [disponibilidad.md](requirements/disponibilidad.md) | Disponibilidad derivada | RF-DISP-01..06 | 6 |
| 9 | [integracion-con-inventario.md](requirements/integracion-con-inventario.md) | Integración con Inventario | RF-INTG-01..05 | 5 |
| 10 | [consulta-del-catalogo.md](requirements/consulta-del-catalogo.md) | Consulta del catálogo | RF-CONS-01..05 | 5 |
| | | **Total** | | **72** |

## Índice de requisitos

| ID | Título | Archivo |
| :-- | :-- | :-- |
| RF-GEN-01 | Capacidades de administración y de consulta | [transversales.md](requirements/transversales.md) |
| RF-GEN-02 | Control de concurrencia por versión | [transversales.md](requirements/transversales.md) |
| RF-GEN-03 | Datos obligatorios y textos no vacíos | [transversales.md](requirements/transversales.md) |
| RF-GEN-04 | Estado administrativo | [transversales.md](requirements/transversales.md) |
| RF-GEN-05 | Atomicidad de las operaciones | [transversales.md](requirements/transversales.md) |
| RF-IMG-01 | Carga de una imagen | [imagenes.md](requirements/imagenes.md) |
| RF-IMG-02 | Validación del archivo de imagen | [imagenes.md](requirements/imagenes.md) |
| RF-IMG-03 | Asociación de una imagen a una entrada u oferta | [imagenes.md](requirements/imagenes.md) |
| RF-IMG-04 | Pertenencia y eliminación de imágenes | [imagenes.md](requirements/imagenes.md) |
| RF-IMG-05 | Reemplazo del archivo de una imagen | [imagenes.md](requirements/imagenes.md) |
| RF-CAT-01 | Creación de una categoría | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-CAT-02 | Edición de una categoría | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-CAT-03 | Eliminación de una categoría | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-CAT-04 | Clasificación de entradas en categorías | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-ENT-01 | Creación de una entrada | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-ENT-02 | Edición de una entrada | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-ENT-03 | Activación de una entrada | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-ENT-04 | Inactivación de una entrada | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-ENT-05 | Archivado de una entrada | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-ENT-06 | Desarchivado de una entrada | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-ENT-07 | Eliminación de una entrada archivada | [categorias-y-entradas.md](requirements/categorias-y-entradas.md) |
| RF-OFE-01 | Creación de una oferta | [ofertas.md](requirements/ofertas.md) |
| RF-OFE-02 | Edición de una oferta | [ofertas.md](requirements/ofertas.md) |
| RF-OFE-03 | Precio base de la oferta | [ofertas.md](requirements/ofertas.md) |
| RF-OFE-04 | Activación de una oferta | [ofertas.md](requirements/ofertas.md) |
| RF-OFE-05 | Inactivación de una oferta | [ofertas.md](requirements/ofertas.md) |
| RF-OFE-06 | Eliminación de una oferta inactiva | [ofertas.md](requirements/ofertas.md) |
| RF-COMP-01 | Composición válida | [composicion.md](requirements/composicion.md) |
| RF-COMP-02 | Grupos de selección obligatorios | [composicion.md](requirements/composicion.md) |
| RF-COMP-03 | Número de rondas del grupo de selección | [composicion.md](requirements/composicion.md) |
| RF-COMP-04 | Tiempo de servicio del grupo de selección | [composicion.md](requirements/composicion.md) |
| RF-COMP-05 | Elegibilidad de opciones por ronda | [composicion.md](requirements/composicion.md) |
| RF-COMP-06 | Opción predeterminada del grupo de selección | [composicion.md](requirements/composicion.md) |
| RF-COMP-07 | Orden de presentación de grupos y opciones | [composicion.md](requirements/composicion.md) |
| RF-COMP-08 | Actualización parcial de la composición | [composicion.md](requirements/composicion.md) |
| RF-COMP-09 | Alta de un grupo de selección | [composicion.md](requirements/composicion.md) |
| RF-COMP-10 | Modificación de un grupo de selección | [composicion.md](requirements/composicion.md) |
| RF-COMP-11 | Eliminación de grupos de selección | [composicion.md](requirements/composicion.md) |
| RF-COMP-12 | Copia de composición desde otra oferta | [composicion.md](requirements/composicion.md) |
| RF-OPC-01 | Alta de una opción | [opciones.md](requirements/opciones.md) |
| RF-OPC-02 | Modificación de una opción | [opciones.md](requirements/opciones.md) |
| RF-OPC-03 | Eliminación de opciones | [opciones.md](requirements/opciones.md) |
| RF-OPC-04 | Activación de una opción | [opciones.md](requirements/opciones.md) |
| RF-OPC-05 | Inactivación de una opción | [opciones.md](requirements/opciones.md) |
| RF-OPC-06 | Nombre mostrado de la opción | [opciones.md](requirements/opciones.md) |
| RF-OPC-07 | Origen de contenido de la opción | [opciones.md](requirements/opciones.md) |
| RF-OPC-08 | Contenido directo de Inventario | [opciones.md](requirements/opciones.md) |
| RF-OPC-09 | Asignación de una receta existente | [opciones.md](requirements/opciones.md) |
| RF-OPC-10 | Creación de una receta desde la opción | [opciones.md](requirements/opciones.md) |
| RF-REC-01 | Creación de una receta | [recetas.md](requirements/recetas.md) |
| RF-REC-02 | Líneas de ingrediente | [recetas.md](requirements/recetas.md) |
| RF-REC-03 | Unidad de medida visible | [recetas.md](requirements/recetas.md) |
| RF-REC-04 | Edición de una receta por revisión | [recetas.md](requirements/recetas.md) |
| RF-REC-05 | Conservación del historial de revisiones | [recetas.md](requirements/recetas.md) |
| RF-REC-06 | Consulta del historial de revisiones | [recetas.md](requirements/recetas.md) |
| RF-REC-07 | Eliminación de una receta sin referencias | [recetas.md](requirements/recetas.md) |
| RF-DISP-01 | Disponibilidad de una opción | [disponibilidad.md](requirements/disponibilidad.md) |
| RF-DISP-02 | Disponibilidad de un grupo de selección | [disponibilidad.md](requirements/disponibilidad.md) |
| RF-DISP-03 | Disponibilidad de una oferta | [disponibilidad.md](requirements/disponibilidad.md) |
| RF-DISP-04 | Disponibilidad de una entrada | [disponibilidad.md](requirements/disponibilidad.md) |
| RF-DISP-05 | Oferta ordenable | [disponibilidad.md](requirements/disponibilidad.md) |
| RF-DISP-06 | Recálculo y recuperación de la disponibilidad | [disponibilidad.md](requirements/disponibilidad.md) |
| RF-INTG-01 | Validación síncrona de artículos de Inventario | [integracion-con-inventario.md](requirements/integracion-con-inventario.md) |
| RF-INTG-02 | Autoridad de Inventario sobre sus artículos | [integracion-con-inventario.md](requirements/integracion-con-inventario.md) |
| RF-INTG-03 | Recepción de eventos de factibilidad de recetas | [integracion-con-inventario.md](requirements/integracion-con-inventario.md) |
| RF-INTG-04 | Recepción de eventos de disponibilidad de artículos | [integracion-con-inventario.md](requirements/integracion-con-inventario.md) |
| RF-INTG-05 | Emisión de eventos de receta | [integracion-con-inventario.md](requirements/integracion-con-inventario.md) |
| RF-CONS-01 | Consulta del catálogo para quien no lo administra | [consulta-del-catalogo.md](requirements/consulta-del-catalogo.md) |
| RF-CONS-02 | Presentación de las ofertas vendibles | [consulta-del-catalogo.md](requirements/consulta-del-catalogo.md) |
| RF-CONS-03 | Búsqueda y filtrado de entradas | [consulta-del-catalogo.md](requirements/consulta-del-catalogo.md) |
| RF-CONS-04 | Consulta administrativa del catálogo | [consulta-del-catalogo.md](requirements/consulta-del-catalogo.md) |
| RF-CONS-05 | Consumo del catálogo bajo demanda | [consulta-del-catalogo.md](requirements/consulta-del-catalogo.md) |
