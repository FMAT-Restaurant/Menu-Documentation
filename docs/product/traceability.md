# Trazabilidad de requisitos a tareas de MVP

## Propósito e identificadores

La ERS conserva sus identificadores normativos `REQ-MENU-*` y `NFR-MENU-*`. Cada `Task ID` identifica trabajo de entrega y usa el formato `MVPn-Tnnn`; no codifica el requisito de origen. Esta matriz relaciona ambos niveles sin cambiar el alcance de los planes. Las reglas de negocio, invariantes, etapas y relaciones NFR reproducen el roadmap de [Roadmap y planes](README.md) y la [matriz de trazabilidad de la ERS](../ers/traceability.md).

| Etapa | Plan de implementación |
| :--- | :--- |
| MVP-1 — Catálogo publicable | [Plan MVP-1](mvp-01-catalogo-publicable.md) |
| MVP-2 — Recetas y reutilización | [Plan MVP-2](mvp-02-recetas-y-reutilizacion.md) |
| MVP-3 — Personalizaciones y retiro seguro | [Plan MVP-3](mvp-03-personalizaciones-y-retiro-seguro.md) |

## Requisitos funcionales

Cada requisito aparece una vez. Cuando la entrega es por etapas, se incluyen los equipos e IDs de tarea de cada etapa. `—` indica que la ERS no relaciona un NFR con ese requisito.

| Requirement ID | Tema | Etapa(s) | Reglas de negocio | Invariantes | NFR relacionado | Tareas por etapa y equipo |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| REQ-MENU-CAT-001 | Administración de categorías | MVP-1 | BR-MENU-001 | INV-MENU-001 | — | MVP-1: MVP1-T009 (Front), MVP1-T010 (Back) |
| REQ-MENU-CAT-002 | Consulta del catálogo publicable | MVP-1 | BR-MENU-004, BR-MENU-006 | INV-MENU-002 | NFR-MENU-PERF-02 | MVP-1: MVP1-T011 (Front), MVP1-T012 (Back) |
| REQ-MENU-ENTRY-001 | Creación de una entrada | MVP-1 | BR-MENU-002, BR-MENU-003 | INV-MENU-001 | — | MVP-1: MVP1-T013 (Front), MVP1-T014 (Back) |
| REQ-MENU-ENTRY-002 | Edición de una entrada | MVP-1 | BR-MENU-002 | INV-MENU-001 | — | MVP-1: MVP1-T015 (Front), MVP1-T016 (Back) |
| REQ-MENU-ENTRY-003 | Estado y archivado de una entrada | MVP-1 | BR-MENU-003, BR-MENU-004 | INV-MENU-002 | — | MVP-1: MVP1-T017 (Front), MVP1-T018 (Back) |
| REQ-MENU-ENTRY-004 | Eliminación de una entrada archivada | MVP-3 | BR-MENU-003, BR-MENU-029, BR-MENU-030 | INV-MENU-008, INV-MENU-009 | — | MVP-3: MVP3-T005 (Front), MVP3-T006 (Back) |
| REQ-MENU-OFFER-001 | Creación de ofertas para una entrada | MVP-1 | BR-MENU-005, BR-MENU-006 | INV-MENU-001 | — | MVP-1: MVP1-T019 (Front), MVP1-T020 (Back) |
| REQ-MENU-OFFER-002 | Identidad de entrada y presentación vendible | MVP-1 | BR-MENU-002, BR-MENU-005 | — | — | MVP-1: MVP1-T021 (Front), MVP1-T022 (Back) |
| REQ-MENU-OFFER-003 | Precio base declarado | MVP-1 | BR-MENU-007, BR-MENU-027 | INV-MENU-007 | — | MVP-1: MVP1-T023 (Front), MVP1-T024 (Back) |
| REQ-MENU-OFFER-004 | Activación de una oferta | MVP-1 | BR-MENU-006 | INV-MENU-002 | — | MVP-1: MVP1-T025 (Front), MVP1-T026 (Back) |
| REQ-MENU-OFFER-005 | Referencia a una oferta reutilizada y sus revisiones | MVP-2 | BR-MENU-028, BR-MENU-029 | INV-MENU-008 | — | MVP-2: MVP2-T005, MVP2-T019 (Front), MVP2-T006 (Back) |
| REQ-MENU-COMP-001 | Composición de una oferta | MVP-1 | BR-MENU-006 | INV-MENU-002, INV-MENU-004 | — | MVP-1: MVP1-T027 (Front), MVP1-T028 (Back) |
| REQ-MENU-COMP-002 | Inclusión de posiciones | MVP-1 | BR-MENU-008, BR-MENU-009, BR-MENU-010 | INV-MENU-003 | NFR-MENU-PERF-02, NFR-MENU-PERF-03 | MVP-1: MVP1-T029 (Front), MVP1-T030 (Back) |
| REQ-MENU-COMP-003 | Alternativas de contenido por posición | MVP-1 | BR-MENU-011 | INV-MENU-004 | NFR-MENU-PERF-02, NFR-MENU-PERF-03 | MVP-1: MVP1-T031 (Front), MVP1-T032 (Back) |
| REQ-MENU-COMP-004 | Cantidad incluida por posición | MVP-1 | BR-MENU-012 | INV-MENU-004 | — | MVP-1: MVP1-T033 (Front), MVP1-T034 (Back) |
| REQ-MENU-COMP-005 | Tiempo sugerido de servicio | MVP-1 | BR-MENU-013 | — | — | MVP-1: MVP1-T035 (Front), MVP1-T036 (Back) |
| REQ-MENU-COMP-006 | Ubicación espacial descriptiva | MVP-1 | BR-MENU-013, BR-MENU-014 | — | — | MVP-1: MVP1-T037 (Front), MVP1-T038 (Back) |
| REQ-MENU-CONT-001 | Alternativas de contenido | MVP-1 (INVENTORY_ITEM); MVP-2 (INLINE, PREPARATION, CATALOG_OFFER) | BR-MENU-015, BR-MENU-016, BR-MENU-017 | INV-MENU-004 | NFR-MENU-PERF-02, NFR-MENU-PERF-03 | MVP-1: MVP1-T039 (Front), MVP1-T040 (Back)<br />MVP-2: MVP2-T007 (Front), MVP2-T008 (Back) |
| REQ-MENU-CONT-002 | Uso directo de un artículo de Inventario | MVP-1 | BR-MENU-018, BR-MENU-019 | INV-MENU-005 | — | MVP-1: MVP1-T041 (Front), MVP1-T042 (Back) |
| REQ-MENU-CONT-003 | Preparación definida en una alternativa | MVP-2 | BR-MENU-017, BR-MENU-020 | INV-MENU-005 | — | MVP-2: MVP2-T009 (Front), MVP2-T010 (Back) |
| REQ-MENU-CONT-004 | Otra oferta como contenido | MVP-2 (referencia/revisión); MVP-3 (materialización al eliminar) | BR-MENU-007, BR-MENU-015, BR-MENU-028, BR-MENU-029, BR-MENU-030 | INV-MENU-008, INV-MENU-009 | — | MVP-2: MVP2-T011 (Front), MVP2-T012 (Back)<br />MVP-3: MVP3-T007 (Front), MVP3-T008 (Back) |
| REQ-MENU-REC-001 | Biblioteca de recetas reutilizables | MVP-2 | BR-MENU-018, BR-MENU-019, BR-MENU-020 | INV-MENU-005, INV-MENU-008 | — | MVP-2: MVP2-T013 (Front), MVP2-T014 (Back) |
| REQ-MENU-REC-002 | Uso y ajuste local de una receta | MVP-2 | BR-MENU-020, BR-MENU-021 | INV-MENU-005 | — | MVP-2: MVP2-T015 (Front), MVP2-T016 (Back) |
| REQ-MENU-REC-003 | Edición de recetas sin cambio retroactivo | MVP-2 | BR-MENU-020 | INV-MENU-008 | — | MVP-2: MVP2-T017 (Front), MVP2-T018 (Back) |
| REQ-MENU-PERS-001 | Personalizaciones de una alternativa | MVP-3 | BR-MENU-015, BR-MENU-022 | INV-MENU-006 | — | MVP-3: MVP3-T009 (Front), MVP3-T010 (Back) |
| REQ-MENU-PERS-002 | Cambios a ingredientes de una receta | MVP-3 | BR-MENU-022, BR-MENU-023 | INV-MENU-005, INV-MENU-006 | — | MVP-3: MVP3-T011 (Front), MVP3-T012 (Back) |
| REQ-MENU-PERS-003 | Opciones para agregar contenido | MVP-3 | BR-MENU-022, BR-MENU-024, BR-MENU-027, BR-MENU-030 | INV-MENU-006, INV-MENU-007, INV-MENU-009 | — | MVP-3: MVP3-T013 (Front), MVP3-T014 (Back) |
| REQ-MENU-PERS-004 | Sustitución de un ingrediente | MVP-3 | BR-MENU-022, BR-MENU-025, BR-MENU-027 | INV-MENU-005, INV-MENU-006, INV-MENU-007 | — | MVP-3: MVP3-T015 (Front), MVP3-T016 (Back) |
| REQ-MENU-PERS-005 | Instrucciones de preparación | MVP-3 | BR-MENU-022, BR-MENU-026 | INV-MENU-006 | — | MVP-3: MVP3-T017 (Front), MVP3-T018 (Back) |
| REQ-MENU-PERS-006 | Ajustes de precio de personalizaciones | MVP-3 | BR-MENU-027 | INV-MENU-007 | — | MVP-3: MVP3-T019 (Front), MVP3-T020 (Back) |

## Criterios no funcionales de rendimiento

Los requisitos funcionales relacionados y las cuestiones abiertas provienen de la ERS. Las tareas de MVP-1 preparan e instrumentan mediciones parciales; no demuestran el cumplimiento E2E de estos NFR. El cierre de MVP-3 requiere un contrato y entorno acordados con Orders + Kitchen para el tramo de aceptación. Los perfiles nominal y de ráfaga (NFR-02 y NFR-03) también dependen de resolver OPEN-009. Ninguna fila constituye una aceptación global anticipada.

| NFR ID | Tema | Requisitos funcionales relacionados | Cuestión abierta ERS | MVP-1 — preparación parcial | MVP-3 — aceptación E2E pendiente |
| :--- | :--- | :--- | :--- | :--- | :--- |
| NFR-MENU-PERF-01 | Alcance y método de evaluación del presupuesto de rendimiento | REQ-MENU-CAT-002, REQ-MENU-COMP-002, REQ-MENU-COMP-003, REQ-MENU-CONT-001 | — | MVP1-T043 (Front), MVP1-T044 (Back) | MVP3-T021 (Front), MVP3-T022 (Back) |
| NFR-MENU-PERF-02 | Carga nominal y latencias de consulta y validación | REQ-MENU-CAT-002, REQ-MENU-COMP-002, REQ-MENU-COMP-003, REQ-MENU-CONT-001 | OPEN-009 | MVP1-T045 (Front), MVP1-T046 (Back) | MVP3-T023 (Front), MVP3-T024 (Back) |
| NFR-MENU-PERF-03 | Capacidad ante ráfagas | REQ-MENU-CAT-002, REQ-MENU-COMP-002, REQ-MENU-COMP-003, REQ-MENU-CONT-001 | OPEN-009 | MVP1-T047 (Front), MVP1-T048 (Back) | MVP3-T025 (Front), MVP3-T026 (Back) |

## Decisiones abiertas y cuestiones técnicas

Esta matriz refleja solo las etapas afectadas que ya declara [Roadmap y planes](README.md). No vincula una decisión abierta con requisitos individuales. La ERS y el roadmap vigentes no definen ni asignan `OPEN-004`.

| ID / fuente | Decisión pendiente | MVP afectado |
| :--- | :--- | :--- |
| OPEN-001 | Moneda, precisión, redondeo y rangos admisibles de `basePrice` y `priceDelta`. | MVP-1, MVP-3 |
| OPEN-002 | Uso de `defaultOfferId` y respuesta si la oferta predeterminada está inactiva. | MVP-1 |
| OPEN-003 | Alcance compartido o por menú de `RecipeLibrary` y consecuencias administrativas. | MVP-2 |
| OPEN-006 | Rangos, precisión, fracciones y unidades de cantidades en slots y recetas. | MVP-1, MVP-2, MVP-3 |
| OPEN-007 | Si el curso sugerido es una lista cerrada o admite otros valores configurables. | MVP-1 |
| OPEN-008 | Si `Composition` válida exige una alternativa activa por slot o basta una alternativa estructural. | MVP-1 |
| OPEN-009 | Mezcla de operaciones y dataset representativo para carga nominal. La herramienta de generación de carga se elige aparte de esta decisión. | MVP-1, MVP-3 |
| Contrato API, sin ID OPEN | Mecanismo y política de autenticación/autorización; la ausencia de `security` no implica acceso anónimo o público. | Todos |
| Contrato API, sin ID OPEN | Política de concurrencia para composición/revisiones, incluida la resolución de escrituras concurrentes. | MVP-1, MVP-2, MVP-3 |
| Integración externa, sin contrato en `docs/contracts` | Cómo obtiene la UI un `InventoryItem` y cómo se comprueba su existencia/unidad compatible; Inventario conserva la propiedad de identidad y stock. | MVP-1, MVP-2, MVP-3 |
| Organización técnica | Acordar topología de repositorios, escoger entre PostgreSQL y MongoDB documentados en el stack, y definir límites de transacción. | MVP-1 |
| CI/CD y operación, sin destino definido | El workflow actual de GitHub Actions valida únicamente el contrato OpenAPI. Una vez decidida la topología, el CI de las aplicaciones puede reutilizar o ampliar Actions; siguen pendientes registry, entornos, credenciales, promociones, secretos, despliegues y recuperación de CD. | Todos |
| Versionado del contrato API | `docs/other/stack.md` lista OpenAPI 3.2.1, mientras el contrato aceptado y su bundle declaran OpenAPI 3.1.0. | Todos |
| Integración de órdenes, sin contrato en `docs/contracts` | Cómo se ejecuta el recorrido completo de validación/aceptación por Orders + Kitchen para NFR-MENU-PERF-01..03. Solo se planifica la contribución Front y Back de Menu. | MVP-3 |

OPEN-005 está resuelto por `MVP1-T013..T016`, `MVP1-T019..T020`, `MVP2-T006` y `MVP2-T019`. La carga multipart admite JPEG/PNG/WebP hasta 10 MiB y 4096 × 4096 px; devuelve 415 para formato no admitido y 422 para imagen inválida, tamaño o dimensiones excedidos. Las lecturas y respuestas conservan las referencias `imageRef` y `offerImageRef`, según [el contrato API](../contracts/api-contract.md).

## Tareas de preparación técnica (SETUP)

Las tareas `SETUP` establecen o extienden la base técnica, Docker, CI y CD; se indexan aparte y no representan trazas de requisitos de la ERS.

| MVP | Task ID | Trabajo | Equipo |
| :--- | :--- | :--- | :--- |
| MVP-1 | MVP1-T001 | Definir repositorio y base Front | Front |
| MVP-1 | MVP1-T002 | Dockerizar Front | Front |
| MVP-1 | MVP1-T003 | CI de Front | Front |
| MVP-1 | MVP1-T004 | CD de Front | Front |
| MVP-1 | MVP1-T005 | Definir repositorio y base Back | Back |
| MVP-1 | MVP1-T006 | Dockerizar Back | Back |
| MVP-1 | MVP1-T007 | CI de Back y contrato | Back |
| MVP-1 | MVP1-T008 | CD de Back | Back |
| MVP-2 | MVP2-T001 | Extender base Front | Front |
| MVP-2 | MVP2-T002 | Actualizar CI/CD de Front | Front |
| MVP-2 | MVP2-T003 | Extender modelo y persistencia | Back |
| MVP-2 | MVP2-T004 | Actualizar CI/CD de Back | Back |
| MVP-3 | MVP3-T001 | Extender editor Front de personalizaciones | Front |
| MVP-3 | MVP3-T002 | Integrar retiro seguro en CI/CD | Front |
| MVP-3 | MVP3-T003 | Asegurar atomicidad y consistencia | Back |
| MVP-3 | MVP3-T004 | Incluir invariantes de MVP-3 en CI/CD | Back |

## Cobertura e integridad

- Los 30 identificadores `REQ-MENU-*` de la ERS están mapeados una vez cada uno a etapa(s), BR, INV, NFR aplicable y tarea(s) de Front/Back.
- Los tres `NFR-MENU-PERF-*` están relacionados con los requisitos funcionales de la ERS y con tareas preparatorias de MVP-1 y de aceptación E2E pendiente en MVP-3.
- Las 16 tareas `SETUP` de MVP-1, MVP-2 y MVP-3 están indexadas separadamente; no se usan como trazas de requisitos.
- En las matrices de este documento, los únicos equipos asignados son Front y Back.
- Para definiciones normativas, consultar [requisitos funcionales](../ers/functional-requirements.md), [requisitos no funcionales](../ers/non-functional-requirements.md), [reglas de negocio](../ers/business-rules.md) y [trazabilidad de la ERS](../ers/traceability.md). Para las tareas, consultar los [tres planes de implementación](README.md).
