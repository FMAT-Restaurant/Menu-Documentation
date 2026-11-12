# Surgical editor task

## Only writable target

La única edición pendiente de esta invocación es:

- `docs/apis/menu/dist/openapi.yaml`

Las fuentes `docs/apis/menu/openapi.yaml`, `docs/apis/menu/paths/inventory.yaml` y `docs/apis/menu/docs/README.md` ya están implementadas: leerlas si hace falta y no editarlas. No escribir otros archivos, incluidos AGENTS.md, .gitignore y `docs/tickets/`.

## Instructions

1. Desde la raíz del repositorio, ejecutar `pnpm api:bundle` para regenerar `docs/apis/menu/dist/openapi.yaml` a partir de `docs/apis/menu/openapi.yaml`. Conservar la salida generada por Redocly, sin editarla manualmente.
2. Confirmar en el bundle que `GET /inventory/items` continúa visible, tiene `servers` específico de Inventario con URL `https://{inventoryHost}/api/v1` y marcador `inventory.example.invalid`, y queda separado del servidor global `/api/v1` de Menu.
3. Confirmar que el bundle lleva la versión `4.0.2` y las descripciones que explican al frontend que Menu no atiende la consulta de Inventario.

## Mandatory behavior

1. Solo el bundle puede cambiar durante esta tarea. El workflow `.github/workflows/api-reference.yml` regenera el mismo archivo y falla ante cualquier diferencia con la versión guardada.
2. No añadir ni retirar endpoints, modificar seguridad, parámetros, respuestas o esquemas.
3. Informar si `pnpm api:bundle` modifica otro archivo o no produce el servidor de Inventario esperado.

