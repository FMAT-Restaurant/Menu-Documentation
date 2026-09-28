# Surgical editor task

## Only writable target

- output/contracts/api-contract.md
- output/contracts/proposal.md
- output/contracts/api/openapi.yaml
- output/contracts/api/components/parameters.yaml
- output/contracts/api/components/schemas/common.yaml
- output/contracts/api/components/responses/errors.yaml
- output/contracts/api/paths/catalog.yaml
- output/contracts/api/paths/categories.yaml
- output/contracts/api/paths/entries.yaml
- output/contracts/api/paths/offers.yaml
- output/contracts/api/paths/recipes.yaml
- output/contracts/api/README.md
- output/contracts/api/docs/flows.md
- output/contracts/api/docs/traceability.md
- output/contracts/api/docs/auth-integration.md
- output/contracts/api/dist/openapi.yaml

Preserva todos los cambios dirty preexistentes. No modifiques ERS, modelo de dominio, configuraciones, schemas o ejemplos, ni index.html u otros archivos. La única excepción de schema permitida es output/contracts/api/components/schemas/common.yaml.

## Instructions

1. Copia íntegramente output/contracts/proposal.md a output/contracts/api-contract.md. Actualiza en la copia solo estado, encabezados y redacción que atribuya a métodos, rutas, representaciones, códigos HTTP, paginación/defaults o semánticas DELETE la condición de propuesta/candidata. Conserva decisiones y contenido sustantivo.
2. Actualiza referencias a proposal.md para apuntar al documento nuevo; cambia también los títulos y enlaces del README y de la trazabilidad.
3. En output/contracts/api/openapi.yaml, marca el contrato aceptado en título, versión y descripciones: elimina el sufijo -propuesta (versión 2.1.0) y describe /api/v1 como la raíz aceptada. No cambies las operaciones ni sus contratos.
4. Elimina las etiquetas/frases de propuesta o candidatura en parámetros, errores, rutas y docs indicados por el IntegrationPlan. Mantén los valores aceptados. RecipeLibrary conserva la ruta global; su alcance sigue OPEN-003.
5. Mantén expresamente sin resolver autenticación/autorización y concurrencia, además de moneda, precisión, redondeo, unidades, imágenes y cualquier otra cuestión OPEN. La ausencia de security no significa acceso anónimo o público. No edites ni sincronices los archivos ERS.
6. En output/contracts/api/components/schemas/common.yaml, cambia solo las descripciones de Identifier y Error.code: retira «propuesto» y, para Error.code, la cláusula de que su catálogo se definirá al acordar el contrato. Conserva type, constraints y estructura, y no decidas un catálogo exhaustivo.



7. Tras modificar las fuentes modulares y las dos descripciones indicadas en common.yaml, regenera output/contracts/api/dist/openapi.yaml al final con el bundler OpenAPI del proyecto. Elimina output/contracts/proposal.md solo después de verificar que el documento nuevo y sus enlaces conservan su contenido.

## Mandatory behavior

1. No agregues decisiones a cuestiones OPEN ni cambies comportamiento del contrato; el ajuste de common.yaml es estrictamente descriptivo y no modifica type, constraints ni estructura.
2. Antes de finalizar, verifica los enlaces internos afectados, que el dist se generó desde las fuentes modulares y que los archivos de producto fuera de la lista permitida permanecen sin modificar.
3. No ejecutes pruebas de producto.
