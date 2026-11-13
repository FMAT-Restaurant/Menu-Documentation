# Eventos del servicio Menu

El contrato canónico de los eventos asíncronos entre Menu e Inventario es [asyncapi.yaml](../asyncapi.yaml) (AsyncAPI 3.1.0, versión 1.0.0), alineado con la [ERS del servicio Menu](../../../ers/README.md), versión 3.3.0 ([integración con Inventario](../../../ers/requirements/integracion-con-inventario.md), RF-INTG-03..05). Los eventos viajan por RabbitMQ (AMQP) y el host del broker se define en cada despliegue. Estos cuatro eventos son todos los del servicio; Menu no emite eventos de catálogo a otros consumidores (RF-CONS-05.CA1).

La vista renderizada del contrato se publica en el [sitio de documentación](https://fmat-restaurant.github.io/Menu-Documentation/events/).

## Resumen

| Evento | Productor → consumidor | Cuándo se emite |
|---|---|---|
| `menu.source.created` | Menu → Inventario | Al crear una receta (también desde la configuración de una opción) y al crear una opción `INVENTORY_ITEM` (también en el alta de una oferta y en una copia de composición armada en el front). |
| `menu.source.updated` | Menu → Inventario | En cada revisión nueva de una receta y al cambiar el artículo o la cantidad de una opción `INVENTORY_ITEM`. |
| `menu.source.deleted` | Menu → Inventario | Al eliminar la definición vigente de una receta y al eliminar una opción `INVENTORY_ITEM`. |
| `inventory.source.availability.updated` | Inventario → Menu | Cuando Inventario comunica si un origen de contenido está disponible. |

## Origen de contenido

Un origen de contenido es la unidad cuya disponibilidad evalúa Inventario. Cada receta y cada opción con contenido directo de Inventario (`INVENTORY_ITEM`) es un origen:

| Tipo (`sourceType`) | `sourceId` | `name` | `items` |
|---|---|---|---|
| `RECIPE` | Identificador de la receta. | Nombre de la receta. | Líneas de ingrediente de la receta. |
| `INVENTORY_ITEM` | Identificador de la opción. | `null` | Un único elemento con el artículo y la cantidad de la opción. |

Toda opción `INVENTORY_ITEM` se publica como un origen propio, sin reutilización entre opciones, aunque dos opciones tengan el mismo artículo y la misma cantidad. Inventario evalúa la disponibilidad de cada origen de forma independiente; una opción `INVENTORY_ITEM` la evalúa como una receta de un único ingrediente (RF-INTG-04).

En cada elemento de `items`, `id` es el identificador real del artículo en Inventario y `quantity` es la cantidad expresada en la unidad que Inventario establece para el artículo.

## Eventos producidos por Menu

### menu.source.created

Cuándo se emite (RF-INTG-05.CA1):

- Receta: al crear una receta, también cuando se crea desde la configuración de una opción.
- Opción: al crear una opción `INVENTORY_ITEM`, también en el alta de una oferta y en una copia de composición armada en el front.

Es el único evento que indica `sourceType` (RF-INTG-05.CA6).

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `sourceId` | string (uuid) | Sí | Identificador del origen: el de la receta o el de la opción. |
| `name` | string o `null` | Sí | Nombre de la receta; `null` en un origen `INVENTORY_ITEM`. |
| `sourceType` | string (`RECIPE` o `INVENTORY_ITEM`) | Sí | Tipo de origen. |
| `items` | array (al menos 1 elemento) | Sí | Artículos del origen; un solo elemento en un origen `INVENTORY_ITEM`. |
| `items[].id` | string | Sí | Identificador del artículo en Inventario. |
| `items[].quantity` | number (mayor que 0) | Sí | Cantidad en la unidad que Inventario establece para el artículo. |

Alta de una receta:

```json
{
  "sourceId": "c4813f65-00b4-4921-874e-03c555796401",
  "name": "Hamburguesa Hawaiana",
  "sourceType": "RECIPE",
  "items": [
    { "id": "CARNE-150G", "quantity": 200 },
    { "id": "PINA-REBANADA", "quantity": 2 }
  ]
}
```

Alta de una opción de contenido directo de Inventario:

```json
{
  "sourceId": "89cce4da-2f19-4d27-942d-b2ee82fb5402",
  "name": null,
  "sourceType": "INVENTORY_ITEM",
  "items": [
    { "id": "CARNE-150G", "quantity": 200 }
  ]
}
```

### menu.source.updated

Cuándo se emite (RF-INTG-05.CA2):

- Receta: en cada revisión nueva de la receta. Una edición que no crea una revisión nueva no emite el evento.
- Opción: al cambiar el artículo o la cantidad de una opción `INVENTORY_ITEM`. El `sourceId` de la opción no cambia cuando cambia su artículo.

El evento lleva el contenido completo vigente del origen, sin `sourceType`.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `sourceId` | string (uuid) | Sí | Identificador del origen: el de la receta o el de la opción. |
| `name` | string o `null` | Sí | Nombre de la receta; `null` en un origen `INVENTORY_ITEM`. |
| `items` | array (al menos 1 elemento) | Sí | Artículos del origen; un solo elemento en un origen `INVENTORY_ITEM`. |
| `items[].id` | string | Sí | Identificador del artículo en Inventario. |
| `items[].quantity` | number (mayor que 0) | Sí | Cantidad en la unidad que Inventario establece para el artículo. |

Revisión nueva de una receta:

```json
{
  "sourceId": "c4813f65-00b4-4921-874e-03c555796401",
  "name": "Hamburguesa Hawaiana Especial",
  "items": [
    { "id": "CARNE-150G", "quantity": 250 },
    { "id": "PINA-REBANADA", "quantity": 2 }
  ]
}
```

Cambio de cantidad de una opción de contenido directo de Inventario:

```json
{
  "sourceId": "89cce4da-2f19-4d27-942d-b2ee82fb5402",
  "name": null,
  "items": [
    { "id": "CARNE-150G", "quantity": 250 }
  ]
}
```

### menu.source.deleted

Cuándo se emite (RF-INTG-05.CA3):

- Receta: al eliminar la definición vigente de la receta.
- Opción: al eliminar una opción `INVENTORY_ITEM`, ya sea porque la actualización de la composición la omite de la lista de opciones de su grupo, porque se elimina su grupo de selección o porque se elimina en cascada con su oferta o con su entrada.

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `sourceId` | string (uuid) | Sí | Identificador del origen eliminado: el de la receta o el de la opción. |

Eliminación de la definición vigente de una receta:

```json
{
  "sourceId": "c4813f65-00b4-4921-874e-03c555796401"
}
```

## Eventos consumidos por Menu

### inventory.source.availability.updated

Inventario comunica si un origen de contenido está disponible (RF-INTG-03).

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---|---|
| `sourceId` | string (uuid) | Sí | Identificador del origen: el de la receta o el de la opción. |
| `isAvailable` | boolean | Sí | `true` si el origen está disponible y `false` si no lo está. |

La receta deja de estar disponible:

```json
{
  "sourceId": "c4813f65-00b4-4921-874e-03c555796401",
  "isAvailable": false
}
```

Reglas:

- El evento fija la disponibilidad de toda opción cuyo origen es `sourceId`: si es una receta, de todas las opciones que la usan; si es una opción `INVENTORY_ITEM`, de esa opción.
- El cambio se propaga a los grupos de selección, las ofertas y las entradas (RF-DISP-06).
- Ningún evento cambia `status`.
- Un artículo retirado de Inventario llega como `isAvailable: false` en cada origen que lo contiene; no existe un evento de retiro.

## Reglas comunes

- Solo las operaciones aceptadas emiten eventos; una operación rechazada no emite ninguno.
- Los cambios de disponibilidad se reflejan en `isAvailable` del contrato HTTP ([openapi.yaml](../openapi.yaml)).

## Pendiente

El tratamiento de eventos duplicados y fuera de orden, la consistencia eventual, la disponibilidad antes del primer evento (también en opciones copiadas), el ámbito por sucursal y la reconciliación quedan pendientes en [OPEN-011](../../../ers/open.md#open-011--garantías-de-entrega-de-los-eventos-con-inventario).
