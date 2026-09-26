## API (Backend for frontend)

La columna **auth** identifica el tipo de acceso, no el mecanismo de autenticación. Las lecturas administrativas del ítem y de la configuración incluyen sus componentes; las operaciones `DELETE` respetan las condiciones de eliminación de la ERS, mientras que `PATCH` permite retirarlos conservando su identidad histórica.

Aquí tienes la tabla completa con el diseño de endpoints optimizado y limpio, manteniendo exactamente el mismo formato que utilizaste originalmente:

| URI                                                                        | Método HTTP | auth             | Consumidores                     |
| -------------------------------------------------------------------------- | ----------- | ---------------- | -------------------------------- |
| `/api/menus/{menuId}/catalog`                                              | GET         | Canal autorizado | POS (UI), otros canales de venta |
| `/api/menus/{menuId}/catalog/{catalogItemId}`                              | GET         | Canal autorizado | POS (UI), otros canales de venta |
| `/api/menus/{menuId}/items`                                                | GET         | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/items`                                                | POST        | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/items/{itemId}`                                       | PATCH       | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/items/{itemId}`                                       | DELETE      | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/items/{itemId}/modifier-config-copies`                | POST        | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/combos`                                               | POST        | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/combos/{comboId}`                                     | GET         | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/combos/{comboId}`                                     | PATCH       | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/combos/{comboId}`                                     | DELETE      | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/combos/{comboId}/clones`                              | POST        | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/combos/{comboId}/copies`                              | POST        | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/combos/option-copy-batches`                           | POST        | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/categories`                                           | GET         | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/categories`                                           | POST        | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/categories/{categoryId}`                              | PATCH       | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/reviews`                                              | GET         | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/items/{itemId}/variants/{variantId}/acknowledgements` | POST        | Administración   | Administración de Menú (UI)      |
| `/api/menus/{menuId}/combos/{comboId}/acknowledgements`                    | POST        | Administración   | Administración de Menú (UI)  |

`PATCH /items/{itemId}` cubre activar, desactivar, archivar y desarchivar; la activación revalida las condiciones de la ERS y el desarchivado deja el ítem `INACTIVE`. La migración de variante predeterminada y las copias son operaciones atómicas sobre varios componentes; el lote de opciones de combo conserva atomicidad por destino. Las definiciones de servicio incluyen las variantes preparadas aún inactivas para su asociación culinaria en Orders + Kitchen.

## Eventos

Menú publica únicamente los hechos necesarios para mantener la proyección comercial de Orders + Kitchen. Una notificación de cambio cubre cada alta o revisión comercial confirmada del `MenuItem`, incluidos sus componentes; también se publica para variantes `PREPARED` todavía inactivas, cuya identidad necesita Cocina antes de la activación. POS consulta el catálogo mediante la API; su mecanismo de actualización permanece abierto en `OPEN-007`.

| Nombre                         | Descripción                                                                                                                                                                                                                                       | Consumidores     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `menu_item_definition_changed` | Se creó o cambió la definición comercial de un `MenuItem`: variantes, precios, modificadores, configuraciones de combo o estado administrativo. Incluye definiciones inactivas necesarias para asociar la preparación de una variante `PREPARED`. | Orders + Kitchen |
| `menu_item_deleted`            | Se eliminó definitivamente un `MenuItem` archivado tras cumplir las restricciones de la ERS; su proyección comercial puede retirarse.                                                                                                             | Orders + Kitchen |

La disponibilidad, el readiness y los cambios culinarios provienen de Orders + Kitchen; las confirmaciones de revisión administrativa no modifican la definición comercial. No se proponen eventos salientes adicionales para esos casos ni comandos de saga de órdenes o inventario.

## Eventos consumidos

La ERS distingue estas señales originadas por Orders + Kitchen. Los nombres son propuestos; `OPEN-007` aún deja abierto el contrato técnico de transporte y mensajes.

| Nombre                                  | Descripción                                                                                                                                                                                                                        | Emisor           |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| `variant_availability_changed`          | Cambió la disponibilidad operacional calculada para una variante; Menú actualiza su proyección sin modificar la definición comercial ni generar revisión.                                                                          | Orders + Kitchen |
| `modifier_availability_changed`         | Cambió la disponibilidad o capacidad operacional de un modificador para una variante; Menú actualiza su proyección granular.                                                                                                       | Orders + Kitchen |
| `variant_preparation_readiness_changed` | Cambió el readiness de preparación de una variante; Menú lo proyecta independientemente de la disponibilidad y de la revisión administrativa.                                                                                      | Orders + Kitchen |
| `variant_culinary_definition_changed`   | Se notificó una alteración culinaria efectiva asociada a una variante; Menú registra la causa de revisión y la propaga a combos dependientes cuando corresponde. Una revisión de preparación aún no adoptada no activa este aviso. | Orders + Kitchen |

Menú deriva por sí mismo la disponibilidad de combos y del catálogo a partir de estas señales. No consume directamente eventos físicos de Inventory ni eventos de órdenes para cumplir estas proyecciones.
