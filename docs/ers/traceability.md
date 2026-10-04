# Trazabilidad de requisitos, reglas e invariantes

Esta matriz relaciona los requisitos funcionales con las reglas e invariantes que restringen su cumplimiento. Las cuestiones abiertas no se tratan como decisiones adoptadas. Los identificadores se definen en [`functional-requirements.md`](functional-requirements.md), [`non-functional-requirements.md`](non-functional-requirements.md) y [`business-rules.md`](business-rules.md).

## Matriz de requisitos funcionales

| Requisito | Tema | Reglas relacionadas | Invariantes relacionadas | Criterios no funcionales relacionados |
| :--- | :--- | :--- | :--- | :--- |
| `REQ-MENU-CAT-001` | Administración de categorías | `BR-MENU-001` | `INV-MENU-001` | — |
| `REQ-MENU-CAT-002` | Consulta del catálogo publicable | `BR-MENU-004`, `BR-MENU-006` | `INV-MENU-002` | `NFR-MENU-PERF-02` |
| `REQ-MENU-ENTRY-001` | Creación de entrada con imagen obligatoria | `BR-MENU-001`, `BR-MENU-002`, `BR-MENU-003` | `INV-MENU-001` | — |
| `REQ-MENU-ENTRY-002` | Reemplazo y conservación de la imagen vigente | `BR-MENU-001`, `BR-MENU-002` | `INV-MENU-001` | — |
| `REQ-MENU-ENTRY-003` | Estado y archivado de una entrada | `BR-MENU-003`, `BR-MENU-004` | `INV-MENU-002` | — |
| `REQ-MENU-ENTRY-004` | Eliminación de una entrada archivada | `BR-MENU-003`, `BR-MENU-029`, `BR-MENU-030` | `INV-MENU-008`, `INV-MENU-009` | — |
| `REQ-MENU-OFFER-001` | Creación de oferta con imagen obligatoria | `BR-MENU-005`, `BR-MENU-006` | `INV-MENU-001` | — |
| `REQ-MENU-OFFER-002` | Identidad de entrada y presentación vendible | `BR-MENU-002`, `BR-MENU-005` | — | — |
| `REQ-MENU-OFFER-003` | Precio base declarado | `BR-MENU-007` | `INV-MENU-007` | — |
| `REQ-MENU-OFFER-004` | Activación de una oferta | `BR-MENU-004`, `BR-MENU-006`, `BR-MENU-008`, `BR-MENU-016` | `INV-MENU-002`, `INV-MENU-003` | — |
| `REQ-MENU-OFFER-005` | Copia de composición desde una oferta del catálogo | `BR-MENU-007`, `BR-MENU-015`, `BR-MENU-029` | `INV-MENU-003`, `INV-MENU-007` | — |
| `REQ-MENU-OFFER-006` | Eliminación de una oferta inactiva | `BR-MENU-004`, `BR-MENU-029`, `BR-MENU-030` | `INV-MENU-002`, `INV-MENU-008`, `INV-MENU-009` | — |
| `REQ-MENU-COMP-001` | Composición de una oferta | `BR-MENU-006` | `INV-MENU-002`, `INV-MENU-003` | — |
| `REQ-MENU-COMP-002` | Inclusión de grupos | `BR-MENU-008` | `INV-MENU-003` | `NFR-MENU-PERF-02`, `NFR-MENU-PERF-03` |
| `REQ-MENU-COMP-003` | Opciones por grupo | `BR-MENU-006`, `BR-MENU-009`, `BR-MENU-011`, `BR-MENU-012`, `BR-MENU-016` | `INV-MENU-003`, `INV-MENU-004` | `NFR-MENU-PERF-02`, `NFR-MENU-PERF-03` |
| `REQ-MENU-COMP-004` | Cantidad de rondas del grupo | `BR-MENU-010`, `BR-MENU-011`, `BR-MENU-012` | `INV-MENU-003`, `INV-MENU-004` | `NFR-MENU-PERF-02`, `NFR-MENU-PERF-03` |
| `REQ-MENU-COMP-005` | Tiempo sugerido de servicio | `BR-MENU-013` | — | — |
| `REQ-MENU-CONT-001` | Tipos y configuración de opciones de contenido | `BR-MENU-004`, `BR-MENU-006`, `BR-MENU-008`, `BR-MENU-015`, `BR-MENU-016`, `BR-MENU-017`, `BR-MENU-018`, `BR-MENU-020` | `INV-MENU-002`, `INV-MENU-003`, `INV-MENU-004`, `INV-MENU-005`, `INV-MENU-008` | `NFR-MENU-PERF-02`, `NFR-MENU-PERF-03` |
| `REQ-MENU-CONT-002` | Uso directo de un artículo de Inventario | `BR-MENU-018` | `INV-MENU-005` | — |
| `REQ-MENU-CONT-003` | Selección de una receta para un slot | `BR-MENU-017`, `BR-MENU-018`, `BR-MENU-019`, `BR-MENU-020` | `INV-MENU-004`, `INV-MENU-005`, `INV-MENU-008` | `NFR-MENU-PERF-01`, `NFR-MENU-PERF-02`, `NFR-MENU-PERF-03` |
| `REQ-MENU-REC-001` | Creación de recetas | `BR-MENU-018`, `BR-MENU-019`, `BR-MENU-020` | `INV-MENU-005` | — |
| `REQ-MENU-REC-002` | Cantidad por ingrediente | `BR-MENU-019` | `INV-MENU-005` | — |
| `REQ-MENU-REC-003` | Edición de recetas por revisión | `BR-MENU-019`, `BR-MENU-020` | `INV-MENU-005`, `INV-MENU-008` | — |
| `REQ-MENU-REC-004` | Unidad de medida visible por ingrediente | `BR-MENU-018`, `BR-MENU-019` | `INV-MENU-005` | — |
| `REQ-MENU-REC-005` | Eliminación de una receta sin uso vigente | `BR-MENU-031` | `INV-MENU-008` | — |

## Matriz de criterios no funcionales

| Identificador | Tema | Requisitos funcionales relacionados | Cuestiones pendientes relacionadas |
| :--- | :--- | :--- | :--- |
| `NFR-MENU-PERF-01` | Alcance y método de evaluación del presupuesto de rendimiento | `REQ-MENU-CAT-002`, `REQ-MENU-COMP-002`, `REQ-MENU-COMP-003`, `REQ-MENU-COMP-004`, `REQ-MENU-CONT-001`, `REQ-MENU-CONT-003` | — |
| `NFR-MENU-PERF-02` | Carga nominal y latencias de consulta y validación | `REQ-MENU-CAT-002`, `REQ-MENU-COMP-002`, `REQ-MENU-COMP-003`, `REQ-MENU-COMP-004`, `REQ-MENU-CONT-001`, `REQ-MENU-CONT-003` | `OPEN-009` |
| `NFR-MENU-PERF-03` | Capacidad ante ráfagas | `REQ-MENU-CAT-002`, `REQ-MENU-COMP-002`, `REQ-MENU-COMP-003`, `REQ-MENU-COMP-004`, `REQ-MENU-CONT-001`, `REQ-MENU-CONT-003` | `OPEN-009` |

## Decisión resuelta

OPEN-005 queda resuelta para las restricciones de contenido de imagen y el rechazo íntegro de imágenes inválidas; esos criterios se especifican en los requisitos funcionales y se relacionan con `REQ-MENU-ENTRY-001/002` y `REQ-MENU-OFFER-001`. El transporte, las operaciones y las representaciones externas de API quedan pendientes bajo OPEN-010 en [cuestiones abiertas](open.md), a la espera de revisar los mockups.

## Matriz de reglas de negocio

| Identificador | Tema | Requisitos funcionales relacionados |
| :--- | :--- | :--- |
| `BR-MENU-001` | Clasificación por categorías | `REQ-MENU-CAT-001`, `REQ-MENU-ENTRY-001`, `REQ-MENU-ENTRY-002` |
| `BR-MENU-002` | Identidad comercial de la entrada | `REQ-MENU-ENTRY-001`, `REQ-MENU-ENTRY-002`, `REQ-MENU-OFFER-002` |
| `BR-MENU-003` | Ciclo de vida de la entrada | `REQ-MENU-ENTRY-001`, `REQ-MENU-ENTRY-003`, `REQ-MENU-ENTRY-004` |
| `BR-MENU-004` | Publicación de una entrada | `REQ-MENU-CAT-002`, `REQ-MENU-ENTRY-003`, `REQ-MENU-OFFER-004`, `REQ-MENU-OFFER-006`, `REQ-MENU-CONT-001` |
| `BR-MENU-005` | Pertenencia y etiqueta de la oferta | `REQ-MENU-OFFER-001`, `REQ-MENU-OFFER-002` |
| `BR-MENU-006` | Composición de una oferta | `REQ-MENU-CAT-002`, `REQ-MENU-OFFER-001`, `REQ-MENU-OFFER-004`, `REQ-MENU-COMP-001`, `REQ-MENU-COMP-003`, `REQ-MENU-CONT-001` |
| `BR-MENU-007` | Precio base fijo | `REQ-MENU-OFFER-003`, `REQ-MENU-OFFER-005` |
| `BR-MENU-008` | Inclusión de slots | `REQ-MENU-OFFER-004`, `REQ-MENU-COMP-002`, `REQ-MENU-CONT-001` |
| `BR-MENU-009` | Opción predeterminada | `REQ-MENU-COMP-003` |
| `BR-MENU-010` | Cantidad de rondas del grupo | `REQ-MENU-COMP-004` |
| `BR-MENU-011` | Selección por ronda | `REQ-MENU-COMP-003`, `REQ-MENU-COMP-004` |
| `BR-MENU-012` | Identidad de slots y opciones | `REQ-MENU-COMP-003`, `REQ-MENU-COMP-004` |
| `BR-MENU-013` | Curso | `REQ-MENU-COMP-005` |
| `BR-MENU-015` | Opción contextual y copia de composición | `REQ-MENU-OFFER-005`, `REQ-MENU-CONT-001` |
| `BR-MENU-016` | Estado de una opción | `REQ-MENU-OFFER-004`, `REQ-MENU-COMP-003`, `REQ-MENU-CONT-001` |
| `BR-MENU-017` | Un solo origen de contenido | `REQ-MENU-CONT-001`, `REQ-MENU-CONT-003` |
| `BR-MENU-018` | Ownership de Inventario | `REQ-MENU-CONT-001`, `REQ-MENU-CONT-002`, `REQ-MENU-CONT-003`, `REQ-MENU-REC-001`, `REQ-MENU-REC-004` |
| `BR-MENU-019` | Ingredientes de receta | `REQ-MENU-CONT-003`, `REQ-MENU-REC-001`, `REQ-MENU-REC-002`, `REQ-MENU-REC-003`, `REQ-MENU-REC-004` |
| `BR-MENU-020` | Biblioteca y revisiones de receta | `REQ-MENU-CONT-001`, `REQ-MENU-CONT-003`, `REQ-MENU-REC-001`, `REQ-MENU-REC-003` |
| `BR-MENU-029` | Revisiones de ofertas | `REQ-MENU-ENTRY-004`, `REQ-MENU-OFFER-005`, `REQ-MENU-OFFER-006` |
| `BR-MENU-030` | Eliminación e historial | `REQ-MENU-ENTRY-004`, `REQ-MENU-OFFER-006` |
| `BR-MENU-031` | Eliminación de recetas en uso | `REQ-MENU-REC-005` |

## Matriz de invariantes de integridad

| Identificador | Invariante | Requisitos funcionales relacionados |
| :--- | :--- | :--- |
| `INV-MENU-001` | Pertenencia al menú | `REQ-MENU-CAT-001`, `REQ-MENU-ENTRY-001`, `REQ-MENU-ENTRY-002`, `REQ-MENU-OFFER-001` |
| `INV-MENU-002` | Publicación válida | `REQ-MENU-CAT-002`, `REQ-MENU-ENTRY-003`, `REQ-MENU-OFFER-004`, `REQ-MENU-OFFER-006`, `REQ-MENU-COMP-001`, `REQ-MENU-CONT-001` |
| `INV-MENU-003` | Integridad de slots | `REQ-MENU-OFFER-004`, `REQ-MENU-OFFER-005`, `REQ-MENU-COMP-001`, `REQ-MENU-COMP-002`, `REQ-MENU-COMP-003`, `REQ-MENU-COMP-004`, `REQ-MENU-CONT-001` |
| `INV-MENU-004` | Contenido determinado | `REQ-MENU-COMP-003`, `REQ-MENU-COMP-004`, `REQ-MENU-CONT-001`, `REQ-MENU-CONT-003` |
| `INV-MENU-005` | Referencia íntegra de contenido de Inventario y receta | `REQ-MENU-CONT-001`, `REQ-MENU-CONT-002`, `REQ-MENU-CONT-003`, `REQ-MENU-REC-001`, `REQ-MENU-REC-002`, `REQ-MENU-REC-003`, `REQ-MENU-REC-004` |
| `INV-MENU-007` | Precio base fijo | `REQ-MENU-OFFER-003`, `REQ-MENU-OFFER-005` |
| `INV-MENU-008` | Referencias versionadas e históricas | `REQ-MENU-ENTRY-004`, `REQ-MENU-OFFER-006`, `REQ-MENU-CONT-001`, `REQ-MENU-CONT-003`, `REQ-MENU-REC-003`, `REQ-MENU-REC-005` |
| `INV-MENU-009` | Eliminación e historial | `REQ-MENU-ENTRY-004`, `REQ-MENU-OFFER-006` |

## Criterio de mantenimiento

Cuando se cree o cambie un identificador normativo, esta matriz debe actualizarse junto con el documento que lo define. La revisión debe confirmar que:

1. Cada requisito, criterio no funcional, regla e invariante definido aparece una vez como entrada propia en su matriz.
2. Cada relación apunta a identificadores existentes.
3. Las relaciones muestran solo vínculos respaldados por las declaraciones y criterios publicados.
4. Solo las cuestiones sin resolver permanecen identificadas en [`open.md`](open.md); cuando una decisión autorizada las cierre, se retiran de ese registro y su resultado se incorpora al requisito aplicable y a esta matriz.
