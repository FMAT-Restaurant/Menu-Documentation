# Surgical editor task — `ers-2.4.1-domain-terms-and-cleanup`

## Only writable target

Cada invocación del editor ejecuta **un solo** archivo de esta lista: el que nombre el orquestador. Los editores corren en paralelo, uno por archivo; ninguno depende de lo que escriba otro.

- `docs/ers/functional-requirements.md`
- `docs/ers/configuration.md`
- `docs/ers/README.md`
- `docs/ers/traceability.md`
- `docs/ers/open.md`
- `docs/ers/business-rules.md`
- `docs/ers/architechture.md`
- `docs/ers/context.md`
- `docs/apis/menu/docs/README.md` (**solo** la cita de versión de la ERS, 2.4.0 → 2.4.1)

No se puede escribir ningún otro archivo. Quedan prohibidos en particular `docs/other/md/domain-model.md` (decisión del usuario: no se modifica), `docs/ers/non-functional-requirements.md` (no tiene ocurrencias que corregir), el resto de `docs/apis/**` (`openapi.yaml`, `paths/`, `components/`, `dist/`), `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `.claude/` y `.codex/`. El árbol de trabajo contiene cambios previos sin commit (ERS 2.2.0–2.4.0 y API 7.0.x) aprobados: no los reviertas ni los "corrijas".

**Informe:** como los editores corren en paralelo, cada uno escribe su informe parcial (mismo esquema que `.agents/agents/editor/resources/execution-report.schema.json`) en `.agents/agents/editor/current/reports/<nombre-base-del-archivo>.json` (p. ej. `reports/business-rules.json`; para `docs/apis/menu/docs/README.md` usa `reports/api-README.json` y para `docs/ers/README.md` usa `reports/ers-README.json`), **no** en `execution-report.json`. El orquestador los une.

## Bloques compartidos (todos los editores)

### Decisiones (mismo significado en todos los archivos)

1. **Detalles de API → términos de dominio.** En la ERS no quedan `POST /api/v1/media/images`, `data.id`, "UUID", "cuerpo JSON", "solicitudes JSON", "POST y PATCH JSON", "servidor", "transporte", "de tipo string", "sin admitir `null`" ni "consistente con el contrato de API vigente" (excepción: el registro de cambios histórico de `configuration.md`, que no se toca). Las reglas se conservan **sin cambio semántico**: carga previa del archivo, validada e independiente de su asociación; el **sistema asigna** el identificador de la imagen; la entrada u oferta se asocia mediante ese identificador (`imageId`); JPEG/PNG/WebP, 10 MiB, 4096 px, validación del contenido real, rechazo íntegro, un fallo de asociación no deshace la carga previa y omitir `imageId` al editar conserva la imagen. `presentationTag` es **obligatorio y no nulo**: una oferta no puede crearse sin él. Se pueden mantener los enlaces al contrato de API publicado únicamente donde describen OPEN-010 (alineación pendiente del contrato).
2. **Autoridad.** La ERS (`docs/ers/`) es la autoridad normativa; `domain-model.md` pasa a ser fuente de contexto (modelo conceptual de referencia que sirvió de base; no normativo; donde difiera, prevalece la ERS). No se deja `domain-model.md` descrito como "vigente" ni como autoridad.
3. **"vigente" aplicado a ofertas** se elimina (ya no tienen historial): "oferta vigente", "ofertas vigentes", "`CatalogOffer` vigente", "definición vigente" de una oferta/entrada eliminada, "estructuras vigentes", "definiciones vigentes poseídas". **Se conserva** "vigente" en recetas ("definición vigente de una receta", "revisión vigente", "receta vigente"), en "opciones vigentes", en "referencia(s) vigente(s)" entre ofertas, en "imagen vigente", "valor vigente", "lista vigente", "especificación vigente", etc.
4. **Inglés en prosa:** "Orders determina" → "Órdenes determina"; "Inventory posee" → "Inventario posee". No toques identificadores Mermaid (`subgraph Orders`, nodos `Inventory`, etc.).
5. **Versión** ERS 2.4.0 → **2.4.1** (corrección), fecha **2026-11-11**.

### Estilo y validadores

- Conserva el estilo de cada archivo (backticks donde ya se usan; en `architechture.md` las entidades y atributos van sin backticks en prosa).
- No toques párrafos que no se indiquen. No cambies la semántica de ninguna regla.
- `npm run lint:ers` revisa, dentro de cada archivo, encabezados duplicados, párrafos/viñetas/filas idénticos (≥ 80 caracteres), líneas idénticas y diagramas/declaraciones Mermaid repetidos: no copies la misma frase larga como párrafo o viñeta completa en dos lugares del mismo archivo. `npm run lint:mermaid` valida los diagramas.

## Instructions

### 1. `docs/ers/functional-requirements.md`

1. **Criterio común para imágenes, viñeta 1** (l.7). Sustituye la viñeta completa por:
   `- Antes de crear una entrada o una oferta, el administrador carga la imagen en una operación previa e independiente. El sistema valida la imagen y le asigna un identificador; la creación del recurso requiere ese identificador como \`imageId\`, sin reenviar el archivo ni una URL.`
2. **Párrafo tras las viñetas de imágenes** (l.14, "El flujo de imágenes queda acordado conforme al [contrato de la API]…"). Sustituye el párrafo completo por:
   `El flujo de imágenes queda acordado: carga previa y validada del archivo, con identificador asignado por el sistema, y asociación posterior mediante \`imageId\`. La alineación restante del contrato de API con la ERS, en operaciones y representación de datos, continúa pendiente de revisar los mockups y se registra en [OPEN-010](open.md).`
   (Sin enlace a la URL de la API ni "transporte"/"JSON".) Las demás viñetas de imágenes no cambian.
3. **REQ-MENU-ENTRY-004**, criterio (l.46): "se eliminan la entrada y sus definiciones vigentes poseídas." → "se eliminan la entrada y sus definiciones poseídas."
4. **REQ-MENU-OFFER-001**, criterio (l.53): sustituye "La creación de cada oferta requiere \`presentationTag\` de tipo string, sin admitir \`null\`, e \`imageId\` de su imagen previamente cargada y validada. Se rechaza la creación si se omite \`presentationTag\` o se envía con valor \`null\`." por "La creación de cada oferta requiere \`presentationTag\`, obligatorio y no nulo, e \`imageId\` de su imagen previamente cargada y validada. Una oferta no puede crearse sin \`presentationTag\`: se rechaza la creación si falta o no tiene valor." El resto del criterio se conserva.
5. **REQ-MENU-OFFER-006**, criterio (l.78): "Al eliminar una oferta \`INACTIVE\`, se eliminan su definición vigente y sus estructuras poseídas." → "Al eliminar una oferta \`INACTIVE\`, se eliminan la oferta y sus estructuras poseídas."
6. **REQ-MENU-REC-005** (l.149–150): en el requisito, "ninguna opción de ninguna oferta vigente la referencia" → "ninguna opción de ninguna oferta la referencia"; en el criterio, "Si una \`SlotOption\` de cualquier \`CatalogOffer\` vigente referencia el \`recipeId\`" → "Si una \`SlotOption\` de cualquier \`CatalogOffer\` referencia el \`recipeId\`". Se conservan el título ("sin uso vigente"), "la definición vigente de una receta" y "Si no existe ninguna referencia vigente".

### 2. `docs/ers/configuration.md`

1. Tabla: `| Versión | 2.4.0 (Consolidada Vigente) |` → `| Versión | 2.4.1 (Consolidada Vigente) |`. Fecha se mantiene `2026-11-11`.
2. **Identificación y Propósito, l.15** (párrafo largo). Cambios puntuales, el resto del párrafo queda igual:
   - Primera oración: "La versión **2.4.0** (fecha 2026-11-11) fija como autoridad el modelo vigente de Menú/Catálogo en [\`domain-model.md\`](../other/md/domain-model.md)." → "La versión **2.4.1** (fecha 2026-11-11) fija como autoridad normativa los documentos de esta ERS en \`docs/ers/\`; [\`domain-model.md\`](../other/md/domain-model.md) es el modelo conceptual de referencia y aporta contexto."
   - "Una receta vigente solo se elimina cuando ninguna opción de una oferta vigente la referencia" → "Una receta vigente solo se elimina cuando ninguna opción de ninguna oferta la referencia".
   - "El archivo se valida en la carga previa mediante \`POST /api/v1/media/images\`, donde el servidor genera y devuelve su identificador; las solicitudes JSON de creación y actualización de entradas y ofertas lo referencian mediante \`imageId\`." → "El archivo se valida en una carga previa e independiente, en la que el sistema asigna el identificador de la imagen; la creación y la actualización de entradas y ofertas la asocian mediante ese identificador (\`imageId\`)."
   - Las oraciones finales sobre el contrato de API existente y OPEN-010 se conservan.
3. **l.17**: sustituye la línea completa por: "\`presentationTag\` es un atributo obligatorio y no nulo de \`CatalogOffer\`: una oferta no puede crearse sin él."
4. **Alcance operativo vigente, l.25**: "y conserva \`Menu\` tal como está definido en [\`domain-model.md\`](../other/md/domain-model.md)." → "y conserva \`Menu\` tal como lo define esta ERS en [contexto](context.md) y [arquitectura](architechture.md)."
5. **Lista de fuentes, ítem 12** (l.42): "(modelo conceptual vigente de entidades, relaciones, composición, recetas y límites del catálogo)." → "(modelo conceptual de referencia que sirvió de base a la ERS: entidades, relaciones, composición, recetas y límites del catálogo; aporta contexto y no es normativo)."
6. **Regla de Prevalencia** (l.46–50). Mantén la frase introductoria (l.46). Sustituye las tres viñetas por estas tres, en este orden:
   - `- Los documentos normativos de esta ERS en \`docs/ers/\` son la autoridad normativa del dominio de Menú/Catálogo y de sus requisitos: [arquitectura](architechture.md), [requisitos funcionales](functional-requirements.md), [reglas de negocio](business-rules.md), [requisitos no funcionales](non-functional-requirements.md), [cuestiones abiertas](open.md) y [trazabilidad](traceability.md). Los requisitos, reglas y criterios vigentes rigen la especificación; OPEN-005 conserva las restricciones de contenido de imágenes en los requisitos funcionales y su trazabilidad: carga previa del archivo, validada e independiente, en la que el sistema asigna el identificador de la imagen, seguida de la asociación de la entrada u oferta mediante ese identificador (\`imageId\`), con atomicidad por operación. El [contrato de API existente](https://fmat-restaurant.github.io/Menu-Documentation/api/) define operaciones administrativas; su alineación integral y la cobertura de operaciones y representaciones faltantes siguen pendientes bajo OPEN-010. El flujo de imágenes está resuelto.`
   - `- El [modelo conceptual de referencia](../other/md/domain-model.md) aporta el contexto del dominio que sirvió de base a esta ERS: entidades, relaciones, reglas de composición, contenido, recetas, precios declarados y límites con otros contextos. No es normativo; donde difiera de los documentos de la ERS, prevalece la ERS.`
   - `- Las fuentes históricas enumeradas arriba aportan contexto sobre la evolución y las decisiones del proyecto; no constituyen norma vigente ni prevalecen sobre los documentos normativos de la ERS.`
7. **Registro de cambios**: inserta encima de `### 2.4.0 (2026-11-11)` (sin modificar ninguna entrada anterior):

   ```md
   ### 2.4.1 (2026-11-11)

   - **Detalles de API:** Antes: la ERS citaba la ruta de carga de imágenes, `data.id`, UUID, cuerpos JSON y POST/PATCH, y describía `presentationTag` como string sin `null` según el contrato de API. → Ahora: carga previa validada con identificador asignado por el sistema y asociación mediante `imageId`; `presentationTag` es obligatorio y no nulo.
   - **Autoridad del modelo de dominio:** Antes: `domain-model.md` era el modelo autoritativo. → Ahora: la ERS es la autoridad normativa y `domain-model.md` aporta contexto.
   - **Terminología de ofertas:** Antes: "oferta vigente", "definiciones vigentes" y similares, heredados del historial de ofertas. → Ahora: sin "vigente" en ofertas; se conserva en recetas.
   - **Términos en inglés:** Antes: "Orders" e "Inventory" en prosa. → Ahora: "Órdenes" e "Inventario".
   - **Temas de trazabilidad:** Antes: los temas de REQ-MENU-ENTRY-001, ENTRY-002, OFFER-001, OFFER-006 y CONT-001 diferían de sus títulos. → Ahora: coinciden con los títulos de los requisitos funcionales.
   - **README:** Antes: "las recetas conservan su número de revisión". → Ahora: inician en la revisión 1, que aumenta en 1 con cada edición.
   ```

   (Deja una línea en blanco entre la última viñeta de 2.4.1 y `### 2.4.0`.)

### 3. `docs/ers/README.md`

1. **l.3**: "El modelo conceptual vigente se describe en [\`../other/md/domain-model.md\`](../other/md/domain-model.md)." → "La autoridad normativa es esta ERS; el modelo conceptual de referencia, que aporta contexto y no es normativo, se describe en [\`../other/md/domain-model.md\`](../other/md/domain-model.md)."
2. Tabla: `| Versión | 2.4.0 |` → `| Versión | 2.4.1 |`.
3. **Blockquote OPEN-005 (l.17)**: "El flujo está decidido: carga previa mediante \`POST /api/v1/media/images\`, con identificador generado por el servidor y devuelto como \`data.id\`, seguida de asociación mediante \`imageId\` en solicitudes JSON de entradas y ofertas." → "El flujo está decidido: carga previa del archivo, validada e independiente, en la que el sistema asigna el identificador de la imagen, seguida de la asociación de la entrada u oferta mediante ese identificador (\`imageId\`)." Elimina además la oración "El transporte de imágenes ya está resuelto." (redundante). El resto del blockquote (enlace al contrato de API y OPEN-010, lista de pendientes) se conserva.
4. **Ruta de lectura, ítem 2** (l.22): "para consultar el modelo conceptual vigente y sus relaciones." → "para consultar el modelo conceptual de referencia y sus relaciones, como contexto no normativo; prevalece la ERS."
5. **Mapa de documentos, fila de domain-model.md** (l.36): columna Contenido: "Modelo conceptual de Menú/Catálogo, …" → "Modelo conceptual de referencia de Menú/Catálogo, …" (resto igual); columna Uso principal: "Interpretar las entidades y relaciones vigentes." → "Consultar el contexto conceptual de entidades y relaciones; no es normativo."
6. **Límites de responsabilidad, viñeta Menú/Catálogo** (l.47): sustituye "las recetas conservan su número de revisión y las opciones de slot se seleccionan solo por ID; cada edición crea una revisión nueva que las opciones vigentes usan de inmediato, y las revisiones anteriores se conservan como historial." por "las recetas inician en la revisión 1, que aumenta en 1 con cada edición; las opciones de slot se seleccionan solo por ID y usan de inmediato cada revisión nueva, y las revisiones anteriores se conservan como historial."
7. No cambies los conteos (28 requisitos, 24 reglas, 8 invariantes, 7 cuestiones).

### 4. `docs/ers/traceability.md`

1. Matriz de requisitos funcionales, columna Tema (solo esa celda en cada fila):
   - `REQ-MENU-ENTRY-001`: "Creación de entrada con imagen obligatoria" → "Creación de una entrada".
   - `REQ-MENU-ENTRY-002`: "Reemplazo y conservación de la imagen vigente" → "Edición de una entrada".
   - `REQ-MENU-OFFER-001`: "Creación de oferta con imagen obligatoria" → "Creación de ofertas para una entrada".
   - `REQ-MENU-OFFER-006`: "Eliminación de una oferta inactiva" → "Eliminación de una oferta".
   - `REQ-MENU-CONT-001`: "Tipos y configuración de opciones de contenido" → "Opciones de contenido".
2. **Decisión resuelta, l.48**: sustituye "El flujo acordado requiere cargar previamente el archivo mediante \`POST /api/v1/media/images\`; tras validarlo, el servidor genera su identificador y devuelve \`data.id\`. Las solicitudes JSON de creación de entradas y ofertas requieren ese identificador como \`imageId\`;" por "El flujo acordado requiere una carga previa del archivo, validada e independiente de su asociación, en la que el sistema asigna el identificador de la imagen. La creación de entradas y ofertas requiere ese identificador como \`imageId\`;". El resto del párrafo ("en la actualización es opcional y omitirlo conserva la imagen vigente…") se conserva. El párrafo l.50 (contrato de API y OPEN-010) no cambia.

### 5. `docs/ers/open.md`

1. **Tabla, fila OPEN-010, columna "Alcance establecido"** (l.11): "El flujo de imágenes está decidido: carga validada con identificador generado por el servidor y asociación mediante \`imageId\` en JSON." → "El flujo de imágenes está decidido: carga validada previa con identificador asignado por el sistema y asociación mediante ese identificador (\`imageId\`)." El enlace al contrato modular en esa celda se conserva.
2. **Sección OPEN-010, l.35**: sustituye el párrafo completo por: "El flujo de imágenes está decidido: el archivo se valida en una carga previa, en la que el sistema asigna el identificador de la imagen; después, la creación o la actualización de entradas y ofertas se asocia a ella mediante ese identificador (\`imageId\`). La carga y la asociación son operaciones independientes; este flujo no constituye una decisión pendiente de OPEN-010."
3. Nada más (l.3 "modelo vigente" y l.33 se conservan).

### 6. `docs/ers/business-rules.md`

1. **BR-MENU-031** (l.27): "ninguna \`SlotOption\` de ninguna oferta vigente la referencia" → "ninguna \`SlotOption\` de ninguna oferta la referencia". Se conserva "La definición vigente de una receta".
2. **INV-MENU-007** (l.39): "Orders determina el precio final de la orden." → "Órdenes determina el precio final de la orden."
3. **INV-MENU-008** (l.40): "cuando ya no existan referencias desde ofertas vigentes." → "cuando ya no existan referencias desde ofertas." Se conservan "opción \`RECIPE\` vigente", "revisión vigente" y "definición vigente".

### 7. `docs/ers/architechture.md`

1. **l.29**: "ninguna SlotOption de ninguna oferta vigente la referencia" → "ninguna SlotOption de ninguna oferta la referencia". ("Una receta vigente" se conserva.)
2. **l.31**: "Al eliminar una entrada, las ofertas y estructuras vigentes poseídas se retiran con ella." → "Al eliminar una entrada, las ofertas y estructuras poseídas se retiran con ella." ("No hay referencias vigentes de una oferta a otra" se conserva.)
3. **l.70**: "Inventory posee la identidad, unidad de medida y stock de InventoryItem." → "Inventario posee la identidad, unidad de medida y stock de InventoryItem."
4. **l.74**: "ninguna SlotOption de ninguna oferta vigente la referencia" → "ninguna SlotOption de ninguna oferta la referencia".
5. **l.202**: "Cuando procede, se retiran la definición vigente y sus estructuras poseídas." → "Cuando procede, se retiran el recurso y sus estructuras poseídas." ("Las ofertas no mantienen referencias vigentes entre sí" se conserva.)
6. **Diagrama de eliminación, l.210** (solo el texto de la etiqueta, no el id del nodo): `DeleteEntry["Eliminar CatalogEntry,<br/>ofertas vigentes y estructuras poseídas"]` → `DeleteEntry["Eliminar CatalogEntry,<br/>ofertas y estructuras poseídas"]`.
7. **l.270** (ítem 6): "La definición vigente solo se elimina si ninguna SlotOption de una oferta vigente la referencia" → "La definición vigente solo se elimina si ninguna SlotOption de ninguna oferta la referencia".
8. No toques identificadores Mermaid (`Inventory`, `Orders`, `Catalog`…) ni "opciones vigentes"/"revisión vigente".

### 8. `docs/ers/context.md`

1. **l.31**: "ninguna \`SlotOption\` de ninguna oferta vigente la referencia" → "ninguna \`SlotOption\` de ninguna oferta la referencia". Nada más (no toques `subgraph Orders` ni l.35 "referencia vigente entre ofertas").

### 9. `docs/apis/menu/docs/README.md`

1. **l.3**: "la fuente de requisitos y dominio es la [ERS del servicio Menu](../../../ers/README.md), versión 2.4.0." → "… versión 2.4.1." Nada más en este archivo (no cambies la versión de la API 7.0.3 ni ningún otro texto).

## Mandatory behavior

1. Ejecuta solo el archivo que te asigne el orquestador y solo los cambios listados para él.
2. Tras editar, verifica con búsqueda en tu archivo: (a) para archivos de `docs/ers/` excepto el registro de cambios de `configuration.md`: no quedan `/api/v1`, `data.id`, `UUID`, `JSON`, `POST`, `PATCH`, "servidor", "de tipo string", "admitir \`null\`"; (b) no quedan "oferta vigente", "ofertas vigentes", "\`CatalogOffer\` vigente", "estructuras vigentes", "vigentes poseídas"; (c) no quedan "Orders determina" ni "Inventory posee" en prosa.
3. No ejecutes tests; no hagas commit.
4. Si un cambio exige escribir otro archivo, no lo hagas: informa BLOCKED en tu informe parcial y en `.agents/agents/editor/current/editor-feedback.md`.
