# Roadmap y planes de implementación de Menu

## 1. Alcance

Este roadmap convierte los requisitos y el contrato vigente del servicio Menu/Catálogo en tres entregas incrementales. La fuente normativa es la ERS 2.1.0 de output/ers/; las operaciones técnicas aceptadas se toman de output/contracts/api-contract.md y output/contracts/api/. [docs/stack.md](../../docs/stack.md) define la base tecnológica y las versiones; entre sus opciones de persistencia falta elegir PostgreSQL o MongoDB, y quedan por resolver la topología, los límites transaccionales y los detalles de despliegue. Solo hay dos equipos para las tareas del servicio: Front y Back.

Los planes siguen las secciones del [template de implementación técnica](../../docs/templates/template-technical-implementation-plan.md) y la guía [How to create Technical Documents from PRDs](../../docs/how-to-create-technical-documents-from-prds.md). Cada requisito funcional se asigna a un MVP y se descompone por equipo cuando requiere trabajo de interfaz y servicio. Los identificadores BR, INV y NFR se conservan según la [matriz de trazabilidad de la ERS](../ers/traceability.md).

## 2. Secuencia de MVP

| MVP | Resultado observable | Alcance funcional | Plan |
| :--- | :--- | :--- | :--- |
| MVP-1 — Catálogo publicable | Un administrador mantiene categorías, entradas, ofertas y su composición básica; una oferta válida puede publicarse y consultarse. El contenido inicial de las alternativas es un artículo referenciado de Inventario. | Categorías, ciclo de vida reversible de entradas, ofertas, composición y fuente INVENTORY_ITEM. | [Plan MVP-1](mvp-01-catalogo-publicable.md) |
| MVP-2 — Recetas y reutilización | Las alternativas pueden usar preparaciones locales, recetas reutilizables u ofertas referenciadas con revisión fija; una edición crea revisión y no cambia usos existentes. | Modos de contenido adicionales, bibliotecas y revisiones de receta, uso y revisión de ofertas referenciadas. Completa REQ-MENU-CONT-001. | [Plan MVP-2](mvp-02-recetas-y-reutilizacion.md) |
| MVP-3 — Personalizaciones y retiro seguro | Las apariciones declaran personalizaciones propias; una entrada archivada puede eliminarse en una operación íntegra que materializa sus referencias vigentes y conserva las revisiones históricas. | Familias de personalización, eliminación atómica de entradas y cierre de los criterios de rendimiento E2E. | [Plan MVP-3](mvp-03-personalizaciones-y-retiro-seguro.md) |

La división es incremental: REQ-MENU-CONT-001 se entrega por etapas, primero con INVENTORY_ITEM y luego con los modos restantes. REQ-MENU-CONT-004 queda funcional en MVP-2 para crear y fijar referencias, y completa su criterio de eliminación/conversión en MVP-3 junto con REQ-MENU-ENTRY-004 y REQ-MENU-PERS-003.

## 3. Cobertura y trazabilidad

La [trazabilidad de requisitos y tareas](traceability.md) asigna los 30 REQ y los 3 NFR a sus MVP y task ID, y relaciona además BR, INV y OPEN aplicables. REQ-MENU-CONT-001 se entrega por etapas entre MVP-1 y MVP-2; REQ-MENU-CONT-004 se completa entre MVP-2 y MVP-3. OPEN-005 está resuelto y se implementa en MVP-1 para entrada/oferta y MVP-2 para reemplazo de imagen en revisiones de oferta. Los NFR son transversales: MVP-1 instrumenta la medición del recorrido de consulta y MVP-3 ejecuta la evaluación E2E completa del recorrido POS/cliente y aceptación de orden; no se convierten en SLOs por endpoint de Menu. OPEN-009 mantiene pendiente la mezcla y el dataset representativos de carga.

## 4. Contratos y dependencias

| Tramo | Recursos/operaciones contractuales | Dependencia para el siguiente MVP |
| :--- | :--- | :--- |
| MVP-1 | Categorías; entradas salvo DELETE; ofertas salvo creación/consulta de revisiones; catálogo publicable; Composition GET/PUT. | Define la identidad, la estructura de CompositionSlot y el origen InventoryItem que extienden MVP-2 y MVP-3. |
| MVP-2 | Recetas y bibliotecas; revisiones de receta y oferta; modos PREPARATION y CATALOG_OFFER; composición con versiones fijadas. | Aporta revisiones/snapshots y usos referenciados sobre los que MVP-3 realiza materialización atómica. |
| MVP-3 | DELETE de entrada archivada; Composition PUT para personalizaciones y conversiones; formas Personalizations y AddOption. | Cierra invariantes de referencias históricas y el perfil E2E si existe contrato y entorno para la aceptación de órdenes. |

Los nombres exactos de rutas, operaciones, esquemas, errores y representaciones son los de output/contracts/api/. Los planes no agregan operaciones ni modifican su contrato. Menu declara reglas y referencias de Inventario, pero no administra stock; las selecciones y el precio final de una orden pertenecen a Órdenes.

## 5. Open Questions y decisiones técnicas pendientes

Estas cuestiones no se resuelven por inferencia. Cuando bloquean un criterio de aceptación, el plan indica que la decisión debe tomarse antes de completar esa tarea.

| ID / fuente | Decisión pendiente | MVP afectado |
| :--- | :--- | :--- |
| OPEN-001 | Moneda, precisión, redondeo y rangos admisibles de basePrice y priceDelta. | MVP-1, MVP-3 |
| OPEN-002 | Uso de defaultOfferId y respuesta si la oferta predeterminada está inactiva. | MVP-1 |
| OPEN-003 | Alcance compartido o por menú de RecipeLibrary y consecuencias administrativas. | MVP-2 |
| OPEN-006 | Rangos, precisión, fracciones y unidades de cantidades en slots y recetas. | MVP-1, MVP-2, MVP-3 |
| OPEN-007 | Si el curso sugerido es una lista cerrada o admite otros valores configurables. | MVP-1 |
| OPEN-008 | Si Composition válida exige una alternativa activa por slot o basta una alternativa estructural. | MVP-1 |
| OPEN-009 | Mezcla de operaciones y dataset representativo para carga nominal. | MVP-1, MVP-3 |
| Contrato API, sin ID OPEN | Mecanismo y política de autenticación/autorización; la ausencia de security no implica acceso anónimo o público. | Todos |
| Contrato API, sin ID OPEN | Política de concurrencia para composición/revisiones, incluida la resolución de escrituras concurrentes. | MVP-1, MVP-2, MVP-3 |
| Integración externa, sin contrato en output/contracts | Cómo obtiene la UI un InventoryItem y cómo se comprueba su existencia/unidad compatible; Inventario conserva la propiedad de identidad y stock. | MVP-1, MVP-2, MVP-3 |
| Organización técnica | Acordar topología de repositorios, escoger entre PostgreSQL y MongoDB documentados en el stack, y definir límites de transacción. | MVP-1 |
| CI/CD y operación, sin destino definido | El workflow actual de GitHub Actions valida únicamente el contrato OpenAPI. Una vez decidida la topología, el CI de las aplicaciones puede reutilizar o ampliar Actions; siguen pendientes registry, entornos, credenciales, promociones, secretos, despliegues y recuperación de CD. | Todos |
| Versionado del contrato API | docs/stack.md lista OpenAPI 3.2.1, mientras el contrato aceptado y su bundle declaran OpenAPI 3.1.0. | Todos |
| Integración de órdenes, sin contrato en output/contracts | Cómo se ejecuta el recorrido completo de validación/aceptación por Orders + Kitchen para NFR-MENU-PERF-01..03. Solo se planifica la contribución Front y Back de Menu. | MVP-3 |

### OPEN-005 resuelto — carga de imágenes

Front y Back usan `multipart/form-data` para crear entradas y ofertas; la actualización de entrada y la revisión de oferta permiten reemplazar la imagen opcionalmente. Se aceptan JPEG, PNG y WebP hasta 10 MiB y 4096 × 4096 px. El contrato devuelve 415 para formatos no admitidos y 422 para imagen inválida, tamaño o dimensiones excedidos; una solicitud rechazada no modifica la referencia vigente. Las respuestas y consultas conservan `imageRef` y `offerImageRef`. La definición normativa está en [el contrato API](../contracts/api-contract.md).

## 6. Coherencia técnica con el stack

Las versiones citadas en las tareas siguen la base de [docs/stack.md](../../docs/stack.md). Playwright 1.63.0 se reserva para pruebas E2E de navegador; la herramienta de generación de carga se elegirá independientemente de OPEN-009, que mantiene pendiente la mezcla de operaciones y el dataset. No se añaden tareas de implementación de RabbitMQ/AMQP, AsyncAPI o EventCatalog: el contrato HTTP y la ERS vigentes de Menu no las requieren. El cambio de OPEN-005 incrementa la versión del contrato API a 2.2.0 y conserva OpenAPI 3.1.0; la discrepancia con 3.2.1 propuesta en el stack sigue pendiente de una decisión específica de actualización de la especificación. El workflow actual de GitHub Actions usa Node.js 24, Redocly CLI 2.54.2 y oasdiff-action 0.1.6 únicamente para validar el contrato OpenAPI; no implementa CI ni CD de las aplicaciones.

## 7. Fuera de alcance de estos planes

- Implementar Inventario, órdenes, preparación o cálculo del precio final.
- Elegir o cambiar decisiones OPEN de dominio, seguridad, concurrencia, persistencia o despliegue sin aprobación.
- Añadir operaciones HTTP que no están en el contrato aceptado.
- Definir estética visual o flujos fuera de los criterios observables de la ERS.
- Ejecutar o declarar implementaciones, despliegues o pruebas de producto ya completadas. Este conjunto es un plan de trabajo, no evidencia de aceptación runtime.
