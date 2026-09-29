# Surgical editor task

## Only writable target

Repository root: `C:/Users/tony/Desktop/Septimo semestre/vyv/proyecto/repos/Menu-Documentation`.

- `README.md`

Do not modify `.gitignore`, docs, build, configuration, workflows or any other dirty file.

## Instructions

1. Replace the entire obsolete root README with a brief Spanish index of the published Menu documentation. Remove its old badges, repository tree and obsolete references to `docs/md` and `output/`. Link the site home at `https://fmat-restaurant.github.io/Menu-Documentation/`.
2. Under **Especificación**, link these nine pages in order, using the full origin and base path above: `/specification/`, `/specification/configuration/`, `/specification/context/`, `/specification/architechture/`, `/specification/functional-requirements/`, `/specification/non-functional-requirements/`, `/specification/business-rules/`, `/specification/open/`, `/specification/traceability/`. Use clear Spanish labels aligned to the source titles.
3. Link **Modelo conceptual** at `/reference/md/domain-model/`.
4. Under **Producto**, link `/product/`, `/product/mvp-01-catalogo-publicable/`, `/product/mvp-02-recetas-y-reutilizacion/`, `/product/mvp-03-personalizaciones-y-retiro-seguro/`, and `/product/traceability/`, in that order.
5. Under **Referencias**, link `/api/` as the Scalar API reference and `/events/` visibly marked **Pendiente** because no event contract is published. Every link must be an absolute Markdown URL prefixed by `https://fmat-restaurant.github.io/Menu-Documentation` and end with a slash.

## Mandatory behavior

1. Verify the README has one home URL plus exactly 17 direct section links: nine ERS, one model, five product, one API and one Events.
2. Confirm the slugs match the existing build outputs and `docusaurus.config.js` baseUrl; the analyst has already verified all 17 page files exist in build.
3. Report the README-only diff and preserve every other local change, especially `.gitignore`.
