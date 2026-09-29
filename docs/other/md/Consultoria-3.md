## Decisiones — Estados administrativos y habilitación de componentes

### 1. Estado administrativo de MenuItem

El estado administrativo pertenece únicamente a `MenuItem` y aplica de la misma forma a todos sus tipos:

```text
PREPARED
STOCKED
COMBO
````

El tipo del `MenuItem` no modifica su ciclo administrativo.

Estados:

```text
ACTIVE
INACTIVE
ARCHIVED
```

Semántica:

* `ACTIVE`: el `MenuItem` está administrativamente habilitado para formar parte de la oferta comercial.
* `INACTIVE`: el `MenuItem` permanece administrable, pero no participa en nuevas ventas.
* `ARCHIVED`: el `MenuItem` se retira del catálogo administrativo ordinario, pero conserva identidad, historial y posibilidad de restauración.

`ARCHIVED` no significa eliminación definitiva.

---

### 2. Archivado reversible

El archivado deberá ser reversible.

Transición:

```text
ARCHIVED
→ desarchivar
→ INACTIVE
```

Un `MenuItem` desarchivado no deberá volver automáticamente a `ACTIVE`.

La activación posterior deberá ser explícita, permitiendo validar nuevamente elegibilidad, dependencias y preparación antes de ofrecerlo.

---

### 3. Eliminación definitiva de MenuItem

No se permitirá eliminar directamente un `MenuItem` que no esté archivado.

El flujo administrativo será:

```text
ACTIVE / INACTIVE
        ↓
     ARCHIVED
        ↓
[Desarchivar] o [Eliminar definitivamente]
```

La eliminación definitiva sólo podrá solicitarse desde `ARCHIVED`.

El sistema deberá impedirla cuando existan dependencias, referencias históricas o reglas de retención que obliguen a conservar la identidad del `MenuItem`.

---

### 4. Componentes internos no utilizan ARCHIVED

`ARCHIVED` existe únicamente para `MenuItem`.

No deberá utilizarse para:

```text
MenuItemVariant
ComboConfiguration
ComboSlot
ComboOption
```

Estos elementos forman parte de la definición interna vigente de un `MenuItem` y utilizan un mecanismo más simple de habilitación.

---

### 5. Habilitación de MenuItemVariant

Una `MenuItemVariant` deberá poder:

```text
habilitarse
deshabilitarse
eliminarse de la definición vigente
```

Modelo conceptual:

```text
MenuItemVariant
enabled: boolean
```

Una variante deshabilitada:

```text
enabled = false
```

no participa en nuevas ventas, aunque el `MenuItem` padre permanezca `ACTIVE`.

Ejemplo:

```text
Pizza Italiana              ACTIVE
├── Individual   enabled=true
├── Pareja       enabled=false
└── Familiar     enabled=true
```

El producto continúa activo, pero `Pareja` no puede seleccionarse.

---

### 6. Eliminación de variantes

Eliminar una variante significa retirarla de la definición vigente del `MenuItem`.

No debe implicar necesariamente destruir físicamente su identidad histórica.

Si la variante:

* ya fue publicada;
* aparece en órdenes históricas;
* es referenciada por Kitchen;
* fue utilizada por combos;
* aparece en revisiones anteriores;

su identidad deberá conservarse donde sea necesaria para historial y trazabilidad.

Por tanto:

```text
variante nunca publicada/referenciada
→ puede eliminarse físicamente

variante publicada/referenciada
→ se retira de la definición vigente
→ se conserva históricamente
```

---

### 7. Habilitación en Combo

El mismo principio aplica a los componentes internos de un `MenuItem` de tipo `COMBO`.

Podrán utilizar:

```text
enabled: boolean
```

cuando aplique:

```text
ComboConfiguration
ComboSlot
ComboOption
```

Semántica:

* `ComboConfiguration.enabled = false`
  → esa configuración completa no participa en nuevas ventas.

* `ComboSlot.enabled = false`
  → ese grupo de selección no participa en la configuración vigente.

* `ComboOption.enabled = false`
  → esa alternativa concreta no puede seleccionarse.

Ninguno de estos conceptos utiliza `ARCHIVED`.

---

### 8. Propagación estructural en Combo

La habilitación de componentes internos deberá afectar la elegibilidad estructural de niveles superiores.

Ejemplo:

```text
ComboSlot
minSelections = 1

Coca   enabled=false
Sprite enabled=true
```

El slot continúa siendo satisfacible.

Si:

```text
Coca   enabled=false
Sprite enabled=false
```

entonces:

```text
available/elegible capacity = 0
minSelections = 1

→ ComboConfiguration deja de ser elegible
```

Deshabilitar una `ComboOption` no debe desactivar automáticamente el `MenuItem` COMBO completo mientras siga existiendo una configuración válida.

---

### 9. Diferencia entre deshabilitar un Slot y agotar sus opciones

Debe distinguirse:

```text
ComboSlot.enabled = false
```

de:

```text
ComboSlot enabled
pero sin suficientes ComboOption elegibles/disponibles
```

En el primer caso existe una decisión administrativa explícita de retirar temporalmente ese slot de la configuración vigente.

En el segundo caso el slot continúa formando parte de la definición, pero actualmente no puede satisfacer sus restricciones.

Estas dos situaciones no deberán tratarse como equivalentes.

---

### 10. Separación entre estado, habilitación, elegibilidad y disponibilidad

Mantener cuatro conceptos separados:

```text
MenuItem.status
→ ciclo administrativo global

enabled
→ decisión administrativa local sobre un componente interno

eligibility
→ validez estructural para participar en una nueva venta

availability
→ posibilidad operacional actual
```

Ejemplos:

```text
MenuItem.status = ACTIVE
Variant.enabled = true
Variant.eligible = true
Variant.available = false
```

Significa:

> el producto está activo, la variante está habilitada y correctamente configurada, pero actualmente no puede satisfacerse operacionalmente.

Otro:

```text
MenuItem.status = ACTIVE
Variant.enabled = false
Variant.available = true
```

Significa:

> Kitchen podría producirla, pero Menu decidió no ofrecerla.

La disponibilidad no deberá reactivar componentes deshabilitados administrativamente.

---

### 11. Regla consolidada

El principio final será:

> `ARCHIVED` representa el retiro administrativo de una oferta comercial completa y, por tanto, existe únicamente para `MenuItem`.

Los componentes internos de un `MenuItem`:

```text
MenuItemVariant
ComboConfiguration
ComboSlot
ComboOption
```

no se archivan.

Pueden:

```text
habilitarse
deshabilitarse
retirarse de la definición vigente
```

preservando su identidad histórica cuando existan referencias que lo requieran.

El estado administrativo del `MenuItem` se aplica uniformemente a `PREPARED`, `STOCKED` y `COMBO`.

```

Con esto la corrección queda bastante clara porque separa definitivamente **ciclo de vida del producto completo** de **habilitación de componentes internos**, sin meter `ARCHIVED` en todos lados.
```


Adicionalmente, se debe cambiar y evaluar toda la especificación para dejar en claro que quien crea la orden es Order + Kitchen.
