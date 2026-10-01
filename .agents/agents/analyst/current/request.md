# Correcciones del ciclo de vida y eliminación

## 1. `CatalogEntry`

Mantener los estados:

```text
ACTIVE
INACTIVE
ARCHIVED
```

Semántica:

- `ACTIVE`: la entrada puede publicarse cuando cumple sus invariantes de publicación.
- `INACTIVE`: la entrada sigue siendo administrable, pero no se publica.
- `ARCHIVED`: la entrada queda retirada del flujo normal de administración y publicación.
- Archivar una entrada puede realizarse desde `ACTIVE` o `INACTIVE`.
- Desarchivar siempre deja la entrada en `INACTIVE`.
- Solo una entrada `ARCHIVED` puede eliminarse definitivamente.

La eliminación definitiva se permite únicamente cuando ninguna de sus ofertas tiene referencias vigentes externas.

---

## 2. `CatalogOffer`

Mantener únicamente:

```text
ACTIVE
INACTIVE
```

Semántica:

- `ACTIVE`: la oferta puede utilizarse como oferta vigente si su entrada también está activa y la composición es válida.
- `INACTIVE`: la oferta permanece administrable pero no puede utilizarse como nueva alternativa vigente.

No agregar `ARCHIVED` a `CatalogOffer`.

Una oferta solo puede eliminarse individualmente cuando:

1. Está `INACTIVE`.
2. No está referenciada por ningún `CatalogOfferSource` vigente.
3. No está referenciada por ningún `AddOption` vigente.
4. No es la oferta indicada por `CatalogEntry.defaultOfferId`.
5. Su eliminación no deja una `CatalogEntry ACTIVE` incumpliendo las condiciones necesarias para permanecer activa.

La eliminación de una oferta elimina sus estructuras poseídas, como su composición vigente, slots, opciones y personalizaciones.

Las revisiones históricas publicadas no se eliminan junto con la definición vigente.

---

# Cambios en `business-rules.md`

## Reemplazar `BR-MENU-003`

```md
- **BR-MENU-003 — Ciclo de vida de la entrada:** Una entrada nueva inicia inactiva. Sus estados administrativos son activa, inactiva y archivada. Una entrada inactiva no se publica. Una entrada archivada queda retirada del catálogo administrable habitual y tampoco se publica. Archivar es reversible; desarchivar deja siempre la entrada inactiva. Solo una entrada archivada puede eliminarse definitivamente y únicamente cuando ninguna de sus ofertas mantiene referencias vigentes externas.
```

## Mantener `BR-MENU-004`, pero aclarar la publicación

Usar:

```md
- **BR-MENU-004 — Publicación de una entrada:** Para permanecer activa y publicable, una entrada debe disponer de al menos una oferta activa y válida. El estado de la entrada no modifica automáticamente el estado administrativo de sus ofertas.
```

Esto permite:

```text
Entry INACTIVE
├── Offer A ACTIVE
└── Offer B INACTIVE
```

y simplemente ninguna oferta se publica mientras la entrada permanezca inactiva.

---

## Reemplazar `BR-MENU-017`

Actualmente permite `INLINE` con receta local o composición copiada.

Dejar:

```md
- **BR-MENU-017 — Un solo origen de contenido:** Cada alternativa tiene exactamente un origen: contenido `INLINE` con una receta local, un artículo de Inventario, una receta reutilizable o una oferta del catálogo.
```

`INLINE` queda reservado para contenido definido localmente mediante receta.

---

## Reemplazar `BR-MENU-024`

Eliminar `INLINE` como destino de `AddOption`.

Usar:

```md
- **BR-MENU-024 — Contenido adicional:** Un grupo de adiciones establece cuántas de sus opciones pueden elegirse para una alternativa ya incluida. Cada opción utiliza exactamente uno de estos contenidos: artículo de Inventario, receta reutilizable u oferta del catálogo.
```

---

## Reemplazar `BR-MENU-029`

Usar:

```md
- **BR-MENU-029 — Revisión de ofertas referenciadas:** Una composición publicada debe identificar la revisión concreta de toda oferta referenciada. Una modificación posterior de la oferta no cambia retroactivamente las composiciones que conservan una revisión anterior. Las revisiones históricas publicadas permanecen inmutables y consultables independientemente de la existencia de la definición vigente de la oferta.
```

---

## Reemplazar completamente `BR-MENU-030`

Eliminar toda la lógica actual de:

```text
CATALOG_OFFER
→ INLINE
→ CompositionSnapshot
→ nuevas revisiones
→ materialización recursiva
```

Usar:

```md
- **BR-MENU-030 — Eliminación y referencias vigentes:** Una entrada archivada no puede eliminarse mientras cualquiera de sus ofertas mantenga referencias vigentes externas. Del mismo modo, una oferta inactiva no puede eliminarse individualmente mientras sea referenciada por otra definición vigente del catálogo. Las referencias que impiden la eliminación incluyen `CatalogOfferSource`, `AddOption` de destino `CATALOG_OFFER` y `defaultOfferId` cuando corresponda. La operación se rechaza sin modificar los recursos dependientes. Las relaciones de composición poseídas exclusivamente por el recurso eliminado pueden eliminarse junto con él. Las revisiones históricas publicadas permanecen inmutables y consultables.
```

---

## Reemplazar `INV-MENU-008`

```md
- **INV-MENU-008 — Referencias acíclicas e históricas:** Las referencias entre ofertas y recetas no forman ciclos. Toda referencia publicada identifica una revisión concreta y las revisiones históricas permanecen inmutables aunque la definición vigente correspondiente sea eliminada.
```

---

## Reemplazar `INV-MENU-009`

```md
- **INV-MENU-009 — Eliminación sin referencias vigentes colgantes:** Ninguna entrada u oferta puede eliminarse mientras existan referencias vigentes externas hacia la definición que se pretende eliminar. Una eliminación válida no deja referencias vigentes colgantes y no modifica revisiones históricas publicadas.
```

---

# Cambios en `functional-requirements.md`

## Reemplazar `REQ-MENU-ENTRY-004`

```md
### REQ-MENU-ENTRY-004 — Eliminación de una entrada archivada

- **Requisito:** El sistema deberá permitir eliminar definitivamente una entrada únicamente cuando se encuentre archivada y ninguna de sus ofertas mantenga referencias vigentes externas desde otras definiciones del catálogo.
- **Criterio de aceptación:** La eliminación de una entrada activa o inactiva se rechaza. Si alguna de las ofertas de una entrada archivada es utilizada por un `CatalogOfferSource`, un `AddOption` de tipo `CATALOG_OFFER` u otra referencia vigente que requiera su existencia, la eliminación se rechaza sin realizar modificaciones parciales y se informa qué dependencias la impiden. Cuando no existen dichas referencias, se eliminan la entrada y sus definiciones vigentes poseídas. Las revisiones históricas publicadas permanecen intactas y consultables.
```

---

## Ajustar `REQ-MENU-OFFER-005`

Usar:

```md
### REQ-MENU-OFFER-005 — Referencia a una oferta reutilizada

- **Requisito:** Cuando una oferta se utilice como contenido dentro de otra, el sistema deberá identificar la revisión publicada concreta de la oferta referenciada.
- **Criterio de aceptación:** La actualización de la oferta referenciada produce una revisión nueva y no cambia por sí sola las composiciones ya publicadas que utilizan una revisión anterior. Las revisiones publicadas previamente permanecen intactas y consultables.
```

Eliminar de este requisito cualquier comportamiento relacionado con convertir una oferta eliminada en contenido `INLINE`.

---

## Agregar `REQ-MENU-OFFER-006`

```md
### REQ-MENU-OFFER-006 — Eliminación de una oferta

- **Requisito:** El sistema deberá permitir eliminar individualmente una oferta únicamente cuando esté inactiva y no mantenga referencias vigentes externas.
- **Criterio de aceptación:** La eliminación de una oferta activa se rechaza. También se rechaza si la oferta es utilizada por un `CatalogOfferSource`, por un `AddOption` de tipo `CATALOG_OFFER` o si corresponde al `defaultOfferId` de su entrada. La operación no modifica automáticamente los recursos que la referencian. Si no existen dependencias impeditivas, se elimina la definición vigente de la oferta y sus estructuras poseídas. Sus revisiones históricas publicadas permanecen intactas y consultables.
```

---

# Cambios en `domain-model.md`

## `CatalogEntry`

Reemplazar sus reglas de eliminación por:

```md
**Reglas e invariantes:** `brandName` es el nombre comercial autoritativo. Puede guardarse una entrada incompleta, pero una entrada activa y publicable debe disponer de al menos una oferta activa y válida. El archivado es reversible y desarchivar deja siempre la entrada inactiva. El estado de una entrada no modifica automáticamente el estado administrativo de sus ofertas. Solo una entrada `ARCHIVED` admite eliminación definitiva. La eliminación se rechaza mientras cualquiera de sus ofertas mantenga referencias vigentes externas. Cuando no existen dichas referencias, la entrada y sus definiciones vigentes poseídas pueden eliminarse en conjunto. Las revisiones históricas publicadas permanecen inmutables y consultables.
```

---

## `CatalogOffer`

Agregar a sus reglas:

```md
Una oferta solo puede eliminarse individualmente cuando está `INACTIVE`, no corresponde al `defaultOfferId` de su entrada y no mantiene referencias vigentes externas mediante `CatalogOfferSource` o `AddOption`. La eliminación no modifica automáticamente los recursos que la referencian. Sus revisiones históricas publicadas permanecen inmutables.
```

---

## `CatalogOfferRevision`

Mantener esta entidad.

Debe seguir siendo independiente de la definición vigente.

Dejar explícitamente:

```md
**Reglas e invariantes:** es inmutable. La eliminación de una `CatalogOffer` o de su `CatalogEntry` puede retirar la definición vigente, pero no elimina las revisiones históricas publicadas que deban conservarse. Una revisión puede seguir consultándose mediante `offerId` y `revision` aunque ya no exista la definición vigente correspondiente.
```

---

## `CompositionSnapshot`

No eliminar la entidad porque sigue siendo necesaria para `CatalogOfferRevision`.

Pero cambiar sus relaciones.

Eliminar:

```text
InlineContent vigente
AddOption vigente con destino INLINE
```

Dejar solamente:

```md
**Relaciones:** pertenece a una `CatalogOfferRevision` y conserva la composición publicada correspondiente a esa revisión.
```

Eliminar también todas las reglas relativas a:

- conversión de ofertas a `INLINE`;
- materialización durante eliminación;
- referencias recursivamente materializadas;
- copias vigentes creadas al borrar una oferta.

Mantener únicamente su función histórica:

```md
**Reglas e invariantes:** conserva de forma inmutable la composición publicada de una revisión, incluidos slots, alternativas, personalizaciones y reglas de selección. Sus identidades internas pertenecen al ámbito de la revisión histórica.
```

---

## `InlineContent`

Cambiar atributos de:

```text
recipe?
compositionSnapshot?
```

a:

```text
recipe
```

Usar:

```md
### `InlineContent`

**Atributos:** `id`, `name?`, `recipe`, `description?`.

**Relaciones:** es contenido local de una sola `ComponentOption` mediante `ComponentSource`. Contiene una `RecipeDefinition` de alcance local.

**Reglas e invariantes:** permite definir una preparación directamente dentro de una alternativa sin crear una receta reutilizable. Puede usar artículos de Inventario y preparaciones reutilizables existentes. No copia ni redefine la identidad autoritativa de los artículos de Inventario.
```

Eliminar cualquier referencia a:

```text
compositionSnapshot
```

dentro de `InlineContent`.

---

## `AddOption`

Cambiar:

```text
targetType:
INVENTORY_ITEM | PREPARATION | CATALOG_OFFER | INLINE
```

por:

```text
targetType:
INVENTORY_ITEM | PREPARATION | CATALOG_OFFER
```

Eliminar el atributo:

```text
compositionSnapshot?
```

Las relaciones deben quedar:

```md
**Relaciones:** referencia exactamente un `InventoryItem`, una `RecipeDefinition` reutilizable o una revisión publicada de `CatalogOffer`, según `targetType`.
```

Y las reglas:

```md
**Reglas e invariantes:** incorpora contenido que no estaba incluido en la receta base de esa opción. Para `CATALOG_OFFER`, `targetId` y `targetRevision` identifican la oferta y la revisión publicada utilizadas. `priceDelta` expresa únicamente el cargo o crédito declarado por esa personalización y no altera `basePrice`.
```

---

## `ComponentSource`

Mantener:

```text
INLINE
INVENTORY_ITEM
PREPARATION
CATALOG_OFFER
```

Aquí `INLINE` sigue existiendo porque una `ComponentOption` puede contener una receta local.

No eliminar `INLINE` de `ComponentSource`.

---

# Reemplazar la regla transversal 8

Actualmente contiene toda la conversión automática.

Usar:

```md
8. Una `CatalogEntry` archivada o una `CatalogOffer` inactiva no puede eliminarse mientras alguna definición vigente del catálogo mantenga una referencia externa hacia una de las ofertas afectadas. La operación se rechaza sin modificar los recursos dependientes. Las estructuras poseídas exclusivamente por el recurso eliminado pueden eliminarse con él y las revisiones históricas permanecen inmutables.
```

---

# Ajustes al diagrama de entidades

Mantener:

```text
CatalogOfferRevision
    *-- CompositionSnapshot
```

Eliminar las relaciones:

```text
InlineContent
    *-- CompositionSnapshot
```

y:

```text
AddOption
    *-- CompositionSnapshot
```

`InlineContent` debe relacionarse únicamente con:

```text
InlineContent
    *-- RecipeDefinition
```

`AddOption` debe poder referenciar únicamente:

```text
InventoryItem
RecipeDefinition
CatalogOfferRevision
```

según su `targetType`.

---

# Política resultante

## Desactivación

```text
ACTIVE → INACTIVE
```

Impide nuevos usos/publicación.

No elimina referencias existentes.

No cambia automáticamente otros recursos.

---

## Archivado de entrada

```text
ACTIVE   ─┐
          ├─→ ARCHIVED
INACTIVE ─┘

ARCHIVED → INACTIVE
```

Archivar retira la entrada del flujo normal.

No elimina sus ofertas.

No modifica automáticamente sus estados.

---

## Eliminación de `CatalogOffer`

```text
CatalogOffer INACTIVE
        ↓
¿defaultOfferId?
        ├─ sí → RESTRICT
        ↓ no
¿referencias vigentes?
        ├─ sí → RESTRICT
        ↓ no
DELETE definición vigente
        ↓
conservar CatalogOfferRevision
```

---

## Eliminación de `CatalogEntry`

```text
CatalogEntry ARCHIVED
        ↓
¿alguna oferta tiene referencias vigentes?
        ├─ sí → RESTRICT
        ↓ no
DELETE Entry
        ↓
DELETE ofertas vigentes y estructuras poseídas
        ↓
conservar CatalogOfferRevision
```

---

# Regla arquitectónica resumida

> La desactivación impide el uso futuro de un recurso sin alterar sus referencias existentes. El archivado retira administrativamente una entrada sin eliminarla. La eliminación física solo se permite cuando no existen referencias vigentes externas. Las relaciones de propiedad pueden eliminarse junto con su propietario, mientras que las referencias entre recursos independientes utilizan `RESTRICT`. Las revisiones históricas publicadas permanecen inmutables y consultables.