# Configuración de la Especificación Consolidada

| Campo | Valor |
| :--- | :--- |
| Documento | Especificación de Requisitos y Dominio del Servicio Menu |
| Servicio | Menu (Sistema de Comandas para Restaurantes) |
| Versión | 3.3.0 (Consolidada Vigente) |
| Estado | Vigente / En Revisión con Cuestiones Abiertas Pendientes |
| Fecha | 2026-11-13 |

## Identificación y Propósito

Este documento fija la versión, las fuentes de autoridad y el alcance de la especificación vigente para el servicio **Menu**.

La versión **3.3.0** (fecha 2026-11-13) fija como autoridad normativa los documentos de esta ERS en `docs/ers/`; el [modelo conceptual de referencia](../other/md/domain-model.md) aporta contexto y no es normativo. Los requisitos funcionales comprenden 75 requisitos atómicos agrupados en 11 áreas y distribuidos en 10 archivos de `requirements/`, cuyo índice es [`functional-requirements.md`](functional-requirements.md); cada requisito tiene criterios de aceptación identificados que expresan las reglas del dominio. Cada entrada, oferta y opción tiene un estado administrativo, que decide si se muestra a quien consulta el catálogo y que solo cambia el administrador, y una disponibilidad derivada, que decide si se puede ordenar y que el sistema recalcula sin intervención manual. Menu valida de forma síncrona con Inventario cada artículo que se referencia y se comunica con él mediante eventos de orígenes de contenido: emite el alta, la modificación y la eliminación de cada receta y de cada opción con contenido directo de Inventario, y recibe la disponibilidad de cada origen; las garantías de entrega de esos eventos quedan pendientes en OPEN-011. Quienes consumen el catálogo lo consultan bajo demanda: Menu no emite eventos de catálogo ni audita los cambios administrativos.

## Alcance operativo vigente

El alcance esperado para esta versión es un menú —el catálogo completo— por sucursal, provisionado mediante configuración al instalar la sucursal. Esta versión no contempla administración de menús. Este alcance operativo no modifica las entidades ni las reglas del dominio vigente, no agrega la sucursal ni el arrendatario al dominio y conserva el menú tal como lo define esta ERS en [contexto](context.md) y [arquitectura](architechture.md).

## Autoridad Temporal y Semántica de las Fuentes

Las fuentes siguientes registran el análisis y las decisiones del proyecto. El orden documenta su evolución y aporta contexto a la especificación vigente:

1. [**`Problema-Inicial.md`**](../other/md/Problema-Inicial.md) (contexto y necesidades iniciales del servicio).
2. [**`Consultoria-1.md`**](../other/md/Consultoria-1.md) (criterios de rendimiento y perfiles de carga).
3. [**`Consultoria-2.md`**](../other/md/Consultoria-2.md) (análisis de responsabilidades y operación del servicio).
4. [**`Auditoria-1.md`**](../other/md/Auditoria-1.md) (revisión del modelo conceptual inicial).
5. [**`Auditoria-2.md`**](../other/md/Auditoria-2.md) (propuestas de modelado del catálogo).
6. [**`Modelo-Pre-Final.md`**](../other/md/Modelo-Pre-Final.md) (modelo intermedio del dominio).
7. [**`Decisiones-cierre-invariantes.md`**](../other/md/Decisiones-cierre-invariantes.md) (decisiones de cierre y criterios de aceptación).
8. [**`Req-F-Aproved.md`**](../other/md/Req-F-Aproved.md) (base histórica de requisitos funcionales).
9. [**`Auditoria-3.md`**](../other/md/Auditoria-3.md) (revisión del modelo de dominio y las reglas comerciales).
10. [**`Auditoria-4.md`**](../other/md/Auditoria-4.md) (revisión de responsabilidades y límites entre servicios).
11. [**`Consultoria-3.md`**](../other/md/Consultoria-3.md) (revisión del ciclo de vida y responsabilidades operativas).
12. [**`domain-model.md`**](../other/md/domain-model.md) (modelo conceptual de referencia que sirvió de base a la ERS: entidades, relaciones, composición, recetas y límites del catálogo; aporta contexto y no es normativo).

### Regla de Prevalencia

La especificación vigente se aplica con este orden de autoridad:

- Los documentos normativos de esta ERS en `docs/ers/` son la autoridad normativa del dominio del catálogo y de sus requisitos: [arquitectura](architechture.md), [requisitos funcionales](functional-requirements.md) (índice y archivos por área en `requirements/`), [requisitos no funcionales](non-functional-requirements.md), [cuestiones abiertas](open.md) y [trazabilidad](traceability.md). Los requisitos y sus criterios de aceptación vigentes rigen la especificación; OPEN-005 está resuelta en RF-IMG-01..05. El [contrato de API](https://fmat-restaurant.github.io/Menu-Documentation/api/), en su versión 8.0.1, está alineado con esta ERS; OPEN-010 se cerró en la versión 3.2.0. El [contrato de eventos](https://fmat-restaurant.github.io/Menu-Documentation/events/), en AsyncAPI y en su versión 1.0.0, define los eventos de RF-INTG-03..05.
- El [modelo conceptual de referencia](../other/md/domain-model.md) aporta el contexto del dominio que sirvió de base a esta ERS: entidades, relaciones, reglas de composición, contenido, recetas, precios declarados y límites con otros contextos. No es normativo; donde difiera de los documentos de la ERS, prevalece la ERS.
- Las fuentes históricas enumeradas arriba aportan contexto sobre la evolución y las decisiones del proyecto; no constituyen norma vigente ni prevalecen sobre los documentos normativos de la ERS.

## Registro de cambios

Cada versión registra brevemente lo que cambia: lo que había antes y lo que hay ahora.

### 3.3.0 (2026-11-13)

- **Eventos con Inventario:** Antes: Inventario comunicaba la factibilidad de las recetas y la disponibilidad de los artículos, con un evento de retiro de artículos aún sin definir, y Menu emitía solo eventos de receta; el contrato quedaba pendiente en OPEN-011. → Ahora: cada receta y cada opción con contenido directo de Inventario es un origen de contenido; Menu emite el alta, la modificación y la eliminación de cada origen (RF-INTG-04, RF-INTG-05) e Inventario comunica la disponibilidad de cada origen (RF-INTG-03); un artículo retirado se comunica como no disponible, sin un evento de retiro.
- **Contratos:** Antes: contrato de la API 8.0.0 y ningún contrato de eventos. → Ahora: contrato de eventos en AsyncAPI, versión 1.0.0, y contrato de la API 8.0.1, con cambios solo descriptivos.
- **Requisitos:** Antes: 75 requisitos funcionales y 291 criterios de aceptación. → Ahora: 75 requisitos funcionales y 295 criterios; RF-INTG-03 pasa a 6 criterios, RF-INTG-04 a 4 y RF-INTG-05 a 6.
- **Cuestiones abiertas:** Antes: OPEN-011, «Contrato de eventos con Inventario», incluía la estructura y el contenido de los eventos, la identificación, los datos de receta y el retiro de artículos. → Ahora: OPEN-011, «Garantías de entrega de los eventos con Inventario», conserva solo los duplicados, el orden, la consistencia eventual, la disponibilidad inicial, el ámbito por sucursal y la reconciliación; siguen 7 cuestiones abiertas.

### 3.2.0 (2026-11-13)

- **Permisos:** Antes: dos capacidades, administrar y consultar el catálogo, con la definición de capacidades más finas pendiente en OPEN-013. → Ahora: cada operación exige un permiso de la lista de RF-GEN-01, con permisos separados de consulta, de gestión y de cambio de estado por recurso; una modificación que mezcla un cambio de estado con otros cambios exige ambos permisos, y los permisos llegan en la credencial emitida por un servicio externo.
- **Copia de composición:** Antes: operación propia del sistema, en la que las opciones copiadas eran una excepción al estado inicial activo. → Ahora: quien configura arma la copia con la consulta administrativa y la envía como grupos y opciones nuevos (RF-COMP-12); una opción nueva puede indicar su estado administrativo (RF-OPC-01.CA2) y la exclusión de las ofertas de entradas archivadas como origen pasa a RF-CONS-04.CA5.
- **Requisitos:** Antes: 75 requisitos funcionales y 287 criterios de aceptación. → Ahora: 75 requisitos funcionales y 291 criterios; RF-GEN-01 pasa a 5 criterios, RF-CONS-01 a 5 y RF-CONS-04 a 6, y las consultas citan su permiso.
- **Cuestiones abiertas:** Antes: 9. → Ahora: 7; se cierran OPEN-010, porque el contrato de la API 8.0.0 queda alineado con la ERS, y OPEN-013, resuelta por los permisos de RF-GEN-01.

### 3.1.0 (2026-11-12)

- **Carta imprimible:** Antes: el catálogo solo se consultaba y no existía un documento para entregar a los comensales. → Ahora: el administrador genera bajo demanda una carta imprimible en PDF con el catálogo del momento, que no se guarda en Menu (RF-CONS-06); incluye las entradas activas con al menos una oferta activa y esas ofertas, con nombre comercial, descripción, imagen, etiqueta de presentación y precio base, sin disponibilidad ni composición, y un encabezado con el nombre del menú, la fecha de generación y la moneda (RF-CONS-07); se organiza por categoría en orden alfabético, con la sección «sin categoría» al final (RF-CONS-08).
- **Requisitos:** Antes: 72 requisitos funcionales y 271 criterios de aceptación. → Ahora: 75 requisitos funcionales y 287 criterios; RF-GEN-01.CA2 incluye la generación de la carta imprimible entre las operaciones administrativas.
- **Cuestiones abiertas:** Antes: OPEN-001 no mencionaba la carta imprimible y OPEN-010 no incluía su generación. → Ahora: OPEN-001 cubre también la moneda del encabezado de la carta imprimible y OPEN-010 incluye la operación de generación de la carta en el contrato de la API.

### 3.0.0 (2026-11-12)

- **Estructura:** Antes: 28 requisitos en un archivo, y 24 reglas y 8 invariantes en `business-rules.md`. → Ahora: 72 requisitos atómicos en 10 archivos de `requirements/`, con criterios de aceptación identificados; `business-rules.md` se elimina y sus reglas pasan a ser criterios.
- **Identificadores:** Antes: `REQ-MENU-*`, `NFR-MENU-PERF-*`, `BR-MENU-*`, `INV-MENU-*`. → Ahora: `RF-<ÁREA>-NN`, `RF-…CAn` y `RNF-REND-NN`; la tabla de correspondencia está en `traceability.md`.
- **Vocabulario:** Antes: nombres de código en la prosa (slot, `status`, `isAvailable`…). → Ahora: términos formales; la correspondencia técnica figura solo en el glosario y en la vista técnica.
- **Categorías:** Antes: solo se creaban y editaban. → Ahora: eliminación con desasociación de sus entradas, nombre único en el menú, entradas sin categoría (agrupación «sin categoría») y todas las categorías visibles.
- **Búsqueda y consulta:** Antes: solo existía la consulta no administrativa. → Ahora: búsqueda por texto y filtro por categoría (y por estado administrativo para el administrador); consulta administrativa general; las entradas archivadas siempre son visibles para el administrador.
- **Entrada archivada:** Antes: «retirada del catálogo administrable habitual». → Ahora: es de solo lectura; solo se desarchiva o se elimina, y su eliminación borra todas sus ofertas.
- **Ofertas:** Antes: no había requisito de edición y la composición no se exigía al crearlas. → Ahora: edición de la etiqueta de presentación y del precio base, también con la oferta activa; la oferta se crea con una composición inicial válida.
- **Opciones:** Antes: el estado administrativo se indicaba al crearla y las opciones inactivas se mostraban como no elegibles. → Ahora: inicia activa; su tipo de contenido es inmutable; no se repite contenido en un grupo de selección; las inactivas no se muestran a quien consulta el catálogo.
- **Orden de presentación:** Antes: no estaba definido. → Ahora: el administrador define el orden de los grupos de selección (que es el orden de las rondas) y el de las opciones; el resto se presenta en orden alfabético.
- **Recetas:** Antes: la edición carecía de validaciones explícitas y el historial no tenía consulta. → Ahora: la edición aplica las mismas validaciones que la creación, no admite un artículo repetido y no crea revisión si no hay cambios; el historial se consulta; la receta creada desde una opción persiste aunque la composición se rechace.
- **Inventario:** Antes: la comunicación era solo asíncrona. → Ahora: validación síncrona del artículo al referenciarlo (rechazo íntegro si no existe o si Inventario no responde) y eventos para la disponibilidad; un artículo retirado se considera no disponible de forma permanente.
- **Imágenes:** Antes: al editar una entrada u oferta se reemplazaba la imagen indicando otro identificador (y omitirlo la conservaba). → Ahora: el identificador de la imagen queda fijo desde la creación y la imagen se cambia reemplazando su archivo, que se valida igual que en la carga; el archivo anterior se elimina.
- **Unidades:** Antes: la línea de ingrediente y el contenido directo tenían una unidad compatible con la del artículo, con unidades distintas de la base y conversiones pendientes en OPEN-006. → Ahora: la cantidad se expresa en la unidad que Inventario establece para el artículo, sin unidad propia; OPEN-006 conserva solo los rangos y la precisión.
- **Composición válida:** Antes: al menos un grupo de selección y una opción por grupo. → Ahora: definición completa (grupos con nombre, número de rondas y opciones; opciones con nombre mostrado y un origen de contenido existente; cantidad positiva), independiente de la disponibilidad.
- **Reglas generales:** Antes: la versión solo se exigía en la composición y la obligatoriedad de los datos no estaba declarada. → Ahora: la versión es obligatoria en toda modificación o eliminación; se declaran los datos obligatorios y se rechazan los textos vacíos; solo el nombre de categoría es único; cada imagen pertenece a un solo recurso y se elimina con él.
- **Rendimiento:** Antes: los objetivos incluían la validación de selecciones al aceptar una orden (de extremo a extremo, p95 ≤ 300 ms) y su mezcla de carga. → Ahora: RNF-REND-01..03 miden solo la consulta, la búsqueda y el filtrado del catálogo (p95 ≤ 200 ms); el objetivo de validación se retira porque esa validación corresponde a Órdenes.
- **Cuestiones abiertas:** Antes: 7. → Ahora: 9 (OPEN-013, capacidades más finas, y OPEN-014, retención de imágenes nunca asociadas; OPEN-001 y OPEN-011 ampliadas).
- **Alcance:** Antes: la auditoría y los eventos de catálogo no se trataban. → Ahora: Menu no audita los cambios administrativos ni emite eventos de catálogo; el catálogo se consulta bajo demanda.

### 2.4.1 (2026-11-11)

- **Detalles de API:** Antes: la ERS citaba la ruta de carga de imágenes, `data.id`, UUID, cuerpos JSON y POST/PATCH, y describía `presentationTag` como string sin `null` según el contrato de API. → Ahora: carga previa validada con identificador asignado por el sistema y asociación mediante `imageId`; `presentationTag` es obligatorio y no nulo.
- **Autoridad del modelo de dominio:** Antes: `domain-model.md` era el modelo autoritativo. → Ahora: la ERS es la autoridad normativa y `domain-model.md` aporta contexto.
- **Terminología de ofertas:** Antes: "oferta vigente", "definiciones vigentes" y similares, heredados del historial de ofertas. → Ahora: sin "vigente" en ofertas; se conserva en recetas.
- **Términos en inglés:** Antes: "Orders" e "Inventory" en prosa. → Ahora: "Órdenes" e "Inventario".
- **Temas de trazabilidad:** Antes: los temas de REQ-MENU-ENTRY-001, ENTRY-002, OFFER-001, OFFER-006 y CONT-001 diferían de sus títulos. → Ahora: coinciden con los títulos de los requisitos funcionales.
- **README:** Antes: "las recetas conservan su número de revisión". → Ahora: inician en la revisión 1, que aumenta en 1 con cada edición.

### 2.4.0 (2026-11-11)

- **Revisiones de oferta:** Antes: cada oferta publicaba revisiones inmutables (`CatalogOfferRevision` con su `CompositionSnapshot`, BR-MENU-029), consultables tras eliminarla. → Ahora: se retiran; las ofertas no tienen revisiones ni historial.
- **Revisiones de receta:** Antes: las revisiones publicadas de oferta registraban la revisión de receta vigente al publicarse. → Ahora: la revisión de receta es solo historial: inicia en 1, cada edición suma 1 y las anteriores son consultables.
- **Eliminación de oferta:** Antes: exigía `INACTIVE` y no dejar una entrada `ACTIVE` sin oferta `ACTIVE`. → Ahora: solo exige `INACTIVE`.
- **Actualización de composición:** Antes: sección sin identificador con detalles de la API. → Ahora: REQ-MENU-COMP-006, en términos de dominio y trazado.
- **Consulta no administrativa:** Antes: REQ-MENU-CAT-002 ocultaba las entradas "incompletas", en contra de BR-MENU-004. → Ahora: solo se ocultan entradas `INACTIVE` o `ARCHIVED` y ofertas `INACTIVE`.
- **Trazabilidad NFR:** Antes: varios requisitos no listaban todos los NFR-MENU-PERF que los relacionaban. → Ahora: las relaciones entre requisitos y NFR son simétricas.

### 2.3.0 (2026-11-11)

- **Referencia de receta:** Antes: la opción `RECIPE` fijaba internamente una revisión al asignarse. → Ahora: referencia la receta solo por `recipeId` y usa siempre su revisión vigente.
- **Edición de receta:** Antes: la revisión nueva no afectaba a las opciones existentes. → Ahora: todas las opciones vigentes que usan la receta pasan a la revisión nueva de inmediato; las anteriores quedan como historial.
- **Reasignación:** Antes: reenviar `recipeId`, aunque fuera el mismo, adoptaba la revisión más reciente. → Ahora: no hace falta reasignar; omitir `recipeId` conserva la receta asignada.
- **Copia desde oferta:** Antes: las opciones copiadas conservaban la revisión de receta fijada. → Ahora: referencian el mismo `recipeId` y siguen su revisión vigente.
- **Historial de ofertas publicadas:** Antes: opciones y revisiones publicadas de oferta guardaban cada una su revisión de receta. → Ahora: solo las revisiones publicadas de oferta registran la revisión de receta vigente al publicarse.
- **Copia de Inventario:** Antes: con revisiones fijadas, Inventario podía necesitar varias revisiones por receta. → Ahora: Inventario mantiene solo la revisión vigente de cada receta.

### 2.2.0 (2026-11-11)

- **Estados:** Antes: un único estado por recurso y slots con estado derivado de sus opciones. → Ahora: `status` administrativo decide si se muestra; `isAvailable` derivado decide si se puede ordenar.
- **Slots:** Antes: solo los slots `ACTIVE` participaban. → Ahora: todos son obligatorios; uno sin opción `ACTIVE` disponible deja a la oferta sin disponibilidad.
- **Visibilidad:** Antes: la entrada se publicaba u ocultaba según sus ofertas. → Ahora: quien no administra ve lo `ACTIVE`, con lo no disponible deshabilitado; el administrador ve todo.
- **Inactivación automática:** Antes: la oferta pasaba sola a `INACTIVE` y se reactivaba sola. → Ahora: solo el administrador cambia `status`; la disponibilidad se recupera sin intervención.
- **Activación de oferta:** Antes: requería al menos un slot `ACTIVE`. → Ahora: requiere composición estructuralmente válida, sin exigir disponibilidad.
- **Eliminación de oferta:** Antes: protegía la "última oferta activa y válida". → Ahora: protege la última oferta `ACTIVE`, sin considerar disponibilidad.
- **Integración con Inventario:** Antes: la ERS excluía eventos y disponibilidad en tiempo real. → Ahora: eventos asíncronos en ambos sentidos (REQ-MENU-AVAIL-001/002, BR-MENU-034).
- **Cuestiones abiertas:** Antes: cinco cuestiones pendientes. → Ahora: se suman OPEN-011 (contrato de eventos) y OPEN-012 (notificación y revisión ante cambios de disponibilidad).
