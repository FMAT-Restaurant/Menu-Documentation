# Contrato de API síncrona de Menu/Catálogo

La especificación [OpenAPI 3.1](openapi.yaml) documenta el contrato HTTP aceptado, descrito en el [contrato de API](../api-contract.md) y derivado de la ERS 2.1.0. Las reglas de dominio citadas son las de la ERS vigente.

| Recurso | Contenido |
| :--- | :--- |
| [../api-contract.md](../api-contract.md) | Alcance, operaciones, paginación, representaciones, trazabilidad y cuestiones abiertas del contrato aceptado. |
| [openapi.yaml](openapi.yaml) | Documento raíz, servidor aceptado y 16 rutas. |
| [dist/openapi.yaml](dist/openapi.yaml) | Versión compilada en un solo archivo, con referencias internas. |
| [paths/](paths/) | 25 operaciones agrupadas por catálogo, categorías, entradas, ofertas, composiciones y recetas. Cada fila de `api-contract.md` corresponde a una operación. |
| [components/schemas/](components/schemas/) | Representaciones de catálogo, composición, recetas y personalizaciones. |
| [components/examples.yaml](components/examples.yaml) | Casos reutilizables de creación, publicación, eliminación, revisiones, composición y recetas. |
| [components/responses/](components/responses/) | Respuestas de error reutilizables. |
| [docs/flows.md](docs/flows.md) | Flujos de publicación, eliminación, revisión y selección comercial. |
| [docs/traceability.md](docs/traceability.md) | Correspondencia con requisitos, reglas, invariantes y cuestiones abiertas. |
| [docs/auth-integration.md](docs/auth-integration.md) | Puntos preparados para incorporar autenticación y autorización cuando se definan. |

El servidor aceptado es `/api/v1`; las claves `paths` del documento raíz omiten ese prefijo. Las referencias `$ref` resuelven archivos relativos. Los identificadores, importes, revisiones y errores usan las representaciones definidas en el contrato. La autenticación y autorización tienen [puntos de integración reservados](docs/auth-integration.md); su mecanismo y política siguen pendientes y no se infiere acceso anónimo o público. La política de concurrencia también sigue pendiente. Las cuestiones OPEN de dominio de la ERS permanecen sin resolver y se detallan en [open.md](../../ers/open.md).

Las consultas administrativas muestran definiciones inactivas; las consultas de catálogo publicable muestran solo entradas y ofertas activas que satisfacen las condiciones de publicación. Menu conserva referencias a artículos de Inventario, sin administrar sus existencias. La API no recibe selecciones de órdenes ni calcula su precio final.
