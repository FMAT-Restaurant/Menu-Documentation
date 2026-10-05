# Solicitud original

Modificar en [ers](docs/ers/) : \
\* Quitar lo de que un grupo/slot pueda ser requerido u opcional. Ahora todos son requeridos. \
\* Refinar y uniformizar el lenguaje oblicuo del dominio, slots es grupos dejad de llamarlos grupos y las "varientes" son las opciones de ese slot. En general dejar de usar tantos términos en el modelo de dominio para referirse a lo mismo porque lo hace confuso.

Reglas:

- No debes documentar cada eliminación/modificación o su por que, porque se vuelve confuso el documento, solo se descarta, se reestrcutura y verifica que todo esté bien.
- Mantener consistencia
- propagar lo que afecta para todo el ers

Al finalizar solo dime en este chat que terminos cambiaste

## Corrección posterior del usuario

ME equivoqué un grupo es una composición

Composition: conjunto que contiene slots

## Decisión posterior del usuario

Si una oferta quedó `INACTIVE` automáticamente porque no quedaban slots `ACTIVE`, al volver a tener un `CompositionSlot` `ACTIVE` la oferta debe reactivarse automáticamente por UX. La inactivación explícita por administración debe conservarse; un cambio posterior de opciones no la revierte por sí mismo.
