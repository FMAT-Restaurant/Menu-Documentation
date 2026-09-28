# Trazabilidad de requisitos, reglas e invariantes

Esta matriz relaciona los requisitos funcionales con las reglas e invariantes que restringen su cumplimiento. Las cuestiones abiertas no se tratan como decisiones adoptadas. Los identificadores se definen en [`functional-requirements.md`](functional-requirements.md), [`non-functional-requirements.md`](non-functional-requirements.md) y [`business-rules.md`](business-rules.md).

## Matriz de requisitos funcionales

| Requisito | Tema | Reglas relacionadas | Invariantes relacionadas | Criterios no funcionales relacionados |
| :--- | :--- | :--- | :--- | :--- |
| `REQ-MENU-CAT-001` | Administración de categorías | `BR-MENU-001` | `INV-MENU-001` | — |
| `REQ-MENU-CAT-002` | Consulta del catálogo publicable | `BR-MENU-004`, `BR-MENU-006` | `INV-MENU-002` | `NFR-MENU-PERF-02` |
| `REQ-MENU-ENTRY-001` | Creación de una entrada | `BR-MENU-002`, `BR-MENU-003` | `INV-MENU-001` | — |
| `REQ-MENU-ENTRY-002` | Edición de una entrada | `BR-MENU-002` | `INV-MENU-001` | — |
| `REQ-MENU-ENTRY-003` | Estado y archivado de una entrada | `BR-MENU-003`, `BR-MENU-004` | `INV-MENU-002` | — |
| `REQ-MENU-ENTRY-004` | Eliminación de una entrada archivada | `BR-MENU-003`, `BR-MENU-029`, `BR-MENU-030` | `INV-MENU-008`, `INV-MENU-009` | — |
| `REQ-MENU-OFFER-001` | Creación de ofertas para una entrada | `BR-MENU-005`, `BR-MENU-006` | `INV-MENU-001` | — |
| `REQ-MENU-OFFER-002` | Identidad de entrada y presentación vendible | `BR-MENU-002`, `BR-MENU-005` | — | — |
| `REQ-MENU-OFFER-003` | Precio base declarado | `BR-MENU-007`, `BR-MENU-027` | `INV-MENU-007` | — |
| `REQ-MENU-OFFER-004` | Activación de una oferta | `BR-MENU-006` | `INV-MENU-002` | — |
| `REQ-MENU-OFFER-005` | Referencia a una oferta reutilizada | `BR-MENU-028`, `BR-MENU-029` | `INV-MENU-008` | — |
| `REQ-MENU-COMP-001` | Composición de una oferta | `BR-MENU-006` | `INV-MENU-002`, `INV-MENU-004` | — |
| `REQ-MENU-COMP-002` | Inclusión de posiciones | `BR-MENU-008`, `BR-MENU-009`, `BR-MENU-010` | `INV-MENU-003` | `NFR-MENU-PERF-02`, `NFR-MENU-PERF-03` |
| `REQ-MENU-COMP-003` | Alternativas de contenido por posición | `BR-MENU-011` | `INV-MENU-004` | `NFR-MENU-PERF-02`, `NFR-MENU-PERF-03` |
| `REQ-MENU-COMP-004` | Cantidad incluida por posición | `BR-MENU-012` | `INV-MENU-004` | — |
| `REQ-MENU-COMP-005` | Tiempo sugerido de servicio | `BR-MENU-013` | — | — |
| `REQ-MENU-COMP-006` | Ubicación espacial descriptiva | `BR-MENU-013`, `BR-MENU-014` | — | — |
| `REQ-MENU-CONT-001` | Alternativas de contenido | `BR-MENU-015`, `BR-MENU-016`, `BR-MENU-017` | `INV-MENU-004` | `NFR-MENU-PERF-02`, `NFR-MENU-PERF-03` |
| `REQ-MENU-CONT-002` | Uso directo de un artículo de Inventario | `BR-MENU-018`, `BR-MENU-019` | `INV-MENU-005` | — |
| `REQ-MENU-CONT-003` | Preparación definida en una alternativa | `BR-MENU-017`, `BR-MENU-020` | `INV-MENU-005` | — |
| `REQ-MENU-CONT-004` | Otra oferta como contenido | `BR-MENU-007`, `BR-MENU-015`, `BR-MENU-028`, `BR-MENU-029`, `BR-MENU-030` | `INV-MENU-008`, `INV-MENU-009` | — |
| `REQ-MENU-REC-001` | Biblioteca de recetas reutilizables | `BR-MENU-018`, `BR-MENU-019`, `BR-MENU-020` | `INV-MENU-005`, `INV-MENU-008` | — |
| `REQ-MENU-REC-002` | Uso y ajuste local de una receta | `BR-MENU-020`, `BR-MENU-021` | `INV-MENU-005` | — |
| `REQ-MENU-REC-003` | Edición de recetas sin cambio retroactivo | `BR-MENU-020` | `INV-MENU-008` | — |
| `REQ-MENU-PERS-001` | Personalizaciones de una alternativa | `BR-MENU-015`, `BR-MENU-022` | `INV-MENU-006` | — |
| `REQ-MENU-PERS-002` | Cambios a ingredientes de una receta | `BR-MENU-022`, `BR-MENU-023` | `INV-MENU-005`, `INV-MENU-006` | — |
| `REQ-MENU-PERS-003` | Opciones para agregar contenido | `BR-MENU-022`, `BR-MENU-024`, `BR-MENU-027`, `BR-MENU-030` | `INV-MENU-006`, `INV-MENU-007`, `INV-MENU-009` | — |
| `REQ-MENU-PERS-004` | Sustitución de un ingrediente | `BR-MENU-022`, `BR-MENU-025`, `BR-MENU-027` | `INV-MENU-005`, `INV-MENU-006`, `INV-MENU-007` | — |
| `REQ-MENU-PERS-005` | Instrucciones de preparación | `BR-MENU-022`, `BR-MENU-026` | `INV-MENU-006` | — |
| `REQ-MENU-PERS-006` | Ajustes de precio de personalizaciones | `BR-MENU-027` | `INV-MENU-007` | — |

## Matriz de criterios no funcionales

| Identificador | Tema | Requisitos funcionales relacionados | Cuestiones pendientes relacionadas |
| :--- | :--- | :--- | :--- |
| `NFR-MENU-PERF-01` | Alcance y método de evaluación del presupuesto de rendimiento | `REQ-MENU-CAT-002`, `REQ-MENU-COMP-002`, `REQ-MENU-COMP-003`, `REQ-MENU-CONT-001` | — |
| `NFR-MENU-PERF-02` | Carga nominal y latencias de consulta y validación | `REQ-MENU-CAT-002`, `REQ-MENU-COMP-002`, `REQ-MENU-COMP-003`, `REQ-MENU-CONT-001` | `OPEN-009` |
| `NFR-MENU-PERF-03` | Capacidad ante ráfagas | `REQ-MENU-CAT-002`, `REQ-MENU-COMP-002`, `REQ-MENU-COMP-003`, `REQ-MENU-CONT-001` | `OPEN-009` |

## Matriz de reglas de negocio

| Identificador | Tema | Requisitos funcionales relacionados |
| :--- | :--- | :--- |
| `BR-MENU-001` | Clasificación por categorías | `REQ-MENU-CAT-001`, `REQ-MENU-ENTRY-001`, `REQ-MENU-ENTRY-002` |
| `BR-MENU-002` | Identidad comercial de la entrada | `REQ-MENU-ENTRY-001`, `REQ-MENU-ENTRY-002`, `REQ-MENU-OFFER-002` |
| `BR-MENU-003` | Ciclo de vida de la entrada | `REQ-MENU-ENTRY-001`, `REQ-MENU-ENTRY-003`, `REQ-MENU-ENTRY-004` |
| `BR-MENU-004` | Publicación de una entrada | `REQ-MENU-CAT-002`, `REQ-MENU-ENTRY-003` |
| `BR-MENU-005` | Pertenencia y etiqueta de la oferta | `REQ-MENU-OFFER-001`, `REQ-MENU-OFFER-002` |
| `BR-MENU-006` | Composición de una oferta | `REQ-MENU-CAT-002`, `REQ-MENU-OFFER-001`, `REQ-MENU-OFFER-004`, `REQ-MENU-COMP-001` |
| `BR-MENU-007` | Precio base fijo | `REQ-MENU-OFFER-003`, `REQ-MENU-CONT-004` |
| `BR-MENU-008` | Inclusión automática de espacios | `REQ-MENU-COMP-002` |
| `BR-MENU-009` | Espacios obligatorios y elegibles | `REQ-MENU-COMP-002` |
| `BR-MENU-010` | Límites de elección de espacios | `REQ-MENU-COMP-002` |
| `BR-MENU-011` | Selección del contenido | `REQ-MENU-COMP-003` |
| `BR-MENU-012` | Cantidad e identidad de espacios | `REQ-MENU-COMP-004` |
| `BR-MENU-013` | Curso y ubicación | `REQ-MENU-COMP-005`, `REQ-MENU-COMP-006` |
| `BR-MENU-014` | Región descriptiva | `REQ-MENU-COMP-006` |
| `BR-MENU-015` | Alternativa contextual | `REQ-MENU-OFFER-002`, `REQ-MENU-CONT-001`, `REQ-MENU-CONT-004`, `REQ-MENU-PERS-001` |
| `BR-MENU-016` | Estado de una alternativa | `REQ-MENU-CONT-001` |
| `BR-MENU-017` | Un solo origen de contenido | `REQ-MENU-CONT-001`, `REQ-MENU-CONT-003` |
| `BR-MENU-018` | Ownership de Inventario | `REQ-MENU-CONT-002`, `REQ-MENU-REC-001` |
| `BR-MENU-019` | Líneas de receta | `REQ-MENU-CONT-002`, `REQ-MENU-REC-001` |
| `BR-MENU-020` | Biblioteca y revisiones de receta | `REQ-MENU-OFFER-005`, `REQ-MENU-CONT-003`, `REQ-MENU-REC-001`, `REQ-MENU-REC-002`, `REQ-MENU-REC-003` |
| `BR-MENU-021` | Ajustes administrativos locales | `REQ-MENU-REC-002` |
| `BR-MENU-022` | Alcance de las personalizaciones | `REQ-MENU-PERS-001`, `REQ-MENU-PERS-002`, `REQ-MENU-PERS-003`, `REQ-MENU-PERS-004`, `REQ-MENU-PERS-005` |
| `BR-MENU-023` | Modificación o retiro de ingredientes | `REQ-MENU-PERS-002` |
| `BR-MENU-024` | Contenido adicional | `REQ-MENU-PERS-003` |
| `BR-MENU-025` | Sustitución de ingrediente | `REQ-MENU-PERS-004` |
| `BR-MENU-026` | Instrucciones de preparación | `REQ-MENU-PERS-005` |
| `BR-MENU-027` | Ajustes de precio declarados | `REQ-MENU-OFFER-003`, `REQ-MENU-PERS-003`, `REQ-MENU-PERS-004`, `REQ-MENU-PERS-006` |
| `BR-MENU-028` | Referencias recursivas | `REQ-MENU-OFFER-005`, `REQ-MENU-CONT-004` |
| `BR-MENU-029` | Revisión de ofertas referenciadas | `REQ-MENU-ENTRY-004`, `REQ-MENU-OFFER-005`, `REQ-MENU-CONT-004` |
| `BR-MENU-030` | Eliminación y conversión de referencias vigentes | `REQ-MENU-ENTRY-004`, `REQ-MENU-CONT-004`, `REQ-MENU-PERS-003` |

## Matriz de invariantes de integridad

| Identificador | Invariante | Requisitos funcionales relacionados |
| :--- | :--- | :--- |
| `INV-MENU-001` | Pertenencia al menú | `REQ-MENU-CAT-001`, `REQ-MENU-ENTRY-001`, `REQ-MENU-ENTRY-002`, `REQ-MENU-OFFER-001` |
| `INV-MENU-002` | Publicación válida | `REQ-MENU-CAT-002`, `REQ-MENU-ENTRY-003`, `REQ-MENU-OFFER-004`, `REQ-MENU-COMP-001` |
| `INV-MENU-003` | Integridad de selección | `REQ-MENU-COMP-002` |
| `INV-MENU-004` | Contenido determinado | `REQ-MENU-COMP-001`, `REQ-MENU-COMP-003`, `REQ-MENU-COMP-004`, `REQ-MENU-CONT-001` |
| `INV-MENU-005` | Referencia íntegra de contenido de Inventario y receta | `REQ-MENU-CONT-002`, `REQ-MENU-CONT-003`, `REQ-MENU-REC-001`, `REQ-MENU-REC-002`, `REQ-MENU-PERS-002`, `REQ-MENU-PERS-004` |
| `INV-MENU-006` | Personalizaciones aisladas | `REQ-MENU-PERS-001`, `REQ-MENU-PERS-002`, `REQ-MENU-PERS-003`, `REQ-MENU-PERS-004`, `REQ-MENU-PERS-005` |
| `INV-MENU-007` | Separación de precio | `REQ-MENU-OFFER-003`, `REQ-MENU-PERS-003`, `REQ-MENU-PERS-004`, `REQ-MENU-PERS-006` |
| `INV-MENU-008` | Referencias acíclicas e históricas | `REQ-MENU-ENTRY-004`, `REQ-MENU-OFFER-005`, `REQ-MENU-CONT-004`, `REQ-MENU-REC-001`, `REQ-MENU-REC-003` |
| `INV-MENU-009` | Eliminación sin referencias vigentes colgantes | `REQ-MENU-ENTRY-004`, `REQ-MENU-CONT-004`, `REQ-MENU-PERS-003` |

## Criterio de mantenimiento

Cuando se cree o cambie un identificador normativo, esta matriz debe actualizarse junto con el documento que lo define. La revisión debe confirmar que:

1. Cada requisito, criterio no funcional, regla e invariante definido aparece una vez como entrada propia en su matriz.
2. Cada relación apunta a identificadores existentes.
3. Las relaciones muestran solo vínculos respaldados por las declaraciones y criterios publicados.
4. Las cuestiones abiertas permanecen identificadas en [`open.md`](open.md) hasta que una decisión autorizada las resuelva.
