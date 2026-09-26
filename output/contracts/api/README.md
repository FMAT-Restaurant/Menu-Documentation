# API síncrona de Menu — propuesta 0.1.1

Esta carpeta contiene una propuesta **OpenAPI 3.1.1** para el servicio Menu, alineada con la ERS consolidada **1.3.12** y las 50 operaciones de [`../proposal.md`](../proposal.md). `openapi.yaml` es la entrada canónica de los contratos HTTP. Las descripciones, esquemas, respuestas y extensiones de trazabilidad dentro de OpenAPI definen la propuesta; los documentos Markdown solo ayudan a navegarla y auditarla.

## Índice

| Artefacto | Contenido |
| --- | --- |
| [`openapi.yaml`](openapi.yaml) | Raíz, seguridad propuesta, rutas y referencias externas. |
| [`paths/`](paths/) | Una Path Item por URI, con todos los métodos de esa URI. |
| [`components/schemas/`](components/schemas/) | Solicitudes, entidades comerciales, proyecciones de lectura y resultados. |
| [`components/responses/`](components/responses/) | Respuestas de error reutilizables. |
| [`dist/openapi.yaml`](dist/openapi.yaml) | Bundle derivado, autocontenido, para Swagger Editor. |
| [`docs/flows.md`](docs/flows.md) | Secuencias administrativas cuya atomicidad abarca varios componentes. |
| [`docs/traceability.md`](docs/traceability.md) | Matriz bidireccional entre API y los 86 elementos normativos de la ERS. |

## Abrir en Swagger Editor

Importar [`dist/openapi.yaml`](dist/openapi.yaml) en Swagger Editor. `openapi.yaml` y sus `$ref` a archivos vecinos son la fuente modular; el bundle es una salida derivada y no se edita a mano. Desde la raíz del repositorio se regenera y valida así:

```sh
swagger-cli validate output/contracts/api/openapi.yaml
swagger-cli bundle output/contracts/api/openapi.yaml --type yaml --outfile output/contracts/api/dist/openapi.yaml
swagger-cli validate output/contracts/api/dist/openapi.yaml
```

La raíz registra los esquemas y respuestas reutilizables en `components`. Así, el bundle mantiene referencias `#/components/...` y no genera punteros hacia propiedades internas de `paths` con llaves codificadas. Se usa OpenAPI 3.1.1 por compatibilidad con la versión de `swagger-cli` empleada para esta salida.

## Consumidores y límites

- **Canal autorizado (POS u otros canales):** consulta el catálogo vendible de Menu; captura elecciones, pero solicita la orden a Orders + Kitchen por un contrato ajeno a esta API.
- **Servicio autorizado (Orders + Kitchen):** consulta definiciones comerciales, incluso variantes `PREPARED` aún inactivas necesarias para la asociación culinaria.
- **Administración de Menu:** define y revisa la oferta comercial. Menu no custodia órdenes, preparación culinaria ni movimientos físicos de Inventory.

`x-access-class` identifica las tres clases anteriores. El esquema HTTP bearer es una **propuesta técnica**, no una decisión de autenticación aprobada por la ERS (`OPEN-007`). El formato de errores, la paginación y otros detalles de wire se señalan como provisionales en las operaciones afectadas. Los identificadores son cadenas lógicas opacas; la ERS no fija UUID ni persistencia física.

## Cuestiones abiertas

La propuesta no cierra `OPEN-002` (catálogo definitivo de errores y concurrencia de lotes), `OPEN-007` (integración, mecanismo de autenticación, transporte e invalidación), `OPEN-009` (repetición de una misma opción concreta en una orden), `OPEN-010` (moneda, precisión, signo, redondeo y composición del precio de variante hoja con modificadores) ni `OPEN-011` (retención y purga). Los importes son magnitudes numéricas lógicas, sin inventar política monetaria. La aceptación de órdenes y sus importes finales pertenece a Orders + Kitchen.

Los objetivos de latencia de la ERS son de extremo a extremo en el flujo POS y no deben interpretarse como presupuestos individuales de estos endpoints.

Los perfiles nominales y de ráfaga (`NFR-MENU-PERF-01` a `03`) incluyen búsqueda, disponibilidad, aceptación y edición de órdenes en sus servicios propietarios; no definen umbrales aislados para cada operación de Menu. La integridad de órdenes y el Transactional Outbox hacia Inventory corresponden a Orders + Kitchen (`NFR-MENU-CONS-01`). La consistencia de señales operacionales es eventual: si se retrasan, la navegación comercial sigue disponible y no se alteran precios, configuraciones ni estados administrativos (`NFR-MENU-RESI-01`). Este documento no convierte esas obligaciones en garantías comprobadas de una implementación.
