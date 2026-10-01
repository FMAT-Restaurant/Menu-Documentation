# Surgical editor task

## Only writable target

Raíz del repositorio: `C:\Users\tony\Desktop\Septimo semestre\vyv\proyecto\repos\Menu-Documentation`.

- `docs/ers/business-rules.md`
- `docs/ers/functional-requirements.md`
- `docs/other/md/domain-model.md`
- `docs/ers/context.md`
- `docs/ers/architechture.md`
- `docs/ers/traceability.md`
- `docs/ers/configuration.md`
- `docs/ers/README.md`

Una invocación del editor por archivo. Cada invocación modifica únicamente el archivo indicado y puede leer los demás. No escribir contratos, API, traducciones, copias históricas, imágenes derivadas, scripts, CI, `AGENTS.md` ni `.gitignore`.

## Instructions

1. En `docs/ers/business-rules.md`, sustituir BR-MENU-003/004/017/024/029/030 e INV-MENU-008/009 según el objetivo original. Alinear INV-MENU-002 para exigir una oferta ACTIVE y válida bajo entrada ACTIVE. Aclarar que `defaultOfferId` impide borrar individualmente la oferta, pero pertenece a la entrada y se retira con ella.
2. En `docs/ers/functional-requirements.md`, sustituir ENTRY-004, ajustar OFFER-005 y agregar OFFER-006 según el texto solicitado. Precisar ENTRY-003, CAT-002 y OFFER-004 respecto de estados/publicación; retirar conversión a INLINE de CONT-004 y PERS-003. Mantener los criterios comunes de imágenes y OPEN-010. Total: 31 requisitos.
3. En `docs/other/md/domain-model.md`, aplicar la política RESTRICT a Entry y Offer; conservar OfferRevision y su CompositionSnapshot históricos. Dejar InlineContent solo con receta local y AddOption solo con INVENTORY_ITEM, PREPARATION o CATALOG_OFFER. Actualizar resúmenes, tabla, entidades, reglas transversales y ambos diagramas Mermaid. Quitar toda materialización y desactivación automática durante eliminación.
4. En `docs/ers/context.md`, alinear estados/publicación, contenido INLINE, destinos de AddOption, eliminación, diagrama Mermaid y glosario con el nuevo modelo. La instantánea de composición pertenece únicamente a CatalogOfferRevision.
5. En `docs/ers/architechture.md`, alinear narración, tabla, diagramas de entidades y flujo de eliminación, y reglas arquitectónicas con RESTRICT, la retención histórica y la protección de una Entry ACTIVE. No introducir decisiones de API o persistencia.
6. En `docs/ers/traceability.md`, añadir una fila para OFFER-006 y corregir filas y vínculos afectados por ENTRY-004, OFFER-005, CONT-004, PERS-003, BR-MENU-029/030 e INV-MENU-008/009. Reflejar 31 FR, 30 BR y 9 INV.
7. En `docs/ers/configuration.md`, incrementar 2.1.2 a 2.1.3 con fecha 2026-09-30 y resumir la nueva política de eliminación. Preservar un Menu por sucursal y OPEN-005/010.
8. En `docs/ers/README.md`, actualizar 2.1.2 a 2.1.3 y ambas menciones de 30 a 31 requisitos funcionales.

## Mandatory behavior

1. Usar como autoridad semántica el objetivo íntegro en `.agents/agents/analyst/current/request.md` y las instrucciones específicas de `plan.json`.
2. Mantener los estados de CatalogEntry (ACTIVE, INACTIVE, ARCHIVED) y CatalogOffer (ACTIVE, INACTIVE); no agregar ARCHIVED a CatalogOffer.
3. Conservar `INLINE` en ComponentSource únicamente para receta local; conservar `CompositionSnapshot` únicamente como parte histórica de `CatalogOfferRevision`.
4. Rechazar eliminación ante referencias vigentes externas sin modificar dependientes. Conservar las revisiones históricas consultables por `offerId` y `revision`.
5. Verificar de forma documental que no quedan en los ocho archivos relaciones vigentes InlineContent/AddOption→CompositionSnapshot ni descripciones de conversión automática durante eliminación. No ejecutar pruebas ni modificar otros archivos.
