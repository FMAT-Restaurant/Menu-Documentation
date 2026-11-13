# ERS del servicio Menu

Índice de los requisitos funcionales, criterios de calidad y cuestiones abiertas del servicio **Menu** para el catálogo de un restaurante. La autoridad normativa es esta ERS; el modelo conceptual de referencia, que aporta contexto y no es normativo, se describe en [`../other/md/domain-model.md`](../other/md/domain-model.md).

## Estado documental

| Campo | Valor |
| :--- | :--- |
| Servicio | Menu |
| Versión | 3.3.0 |
| Estado | Vigente / En revisión con cuestiones abiertas pendientes |
| Configuración de referencia | [`configuration.md`](configuration.md) |
| Alcance | Menu administra la identidad comercial del catálogo de un restaurante: categorías, entradas, ofertas vendibles con su composición de grupos de selección y opciones, imágenes y la biblioteca de recetas. Cada recurso distingue el estado administrativo, que solo decide el administrador, de la disponibilidad, que se deriva de la información recibida de Inventario. Menu valida con Inventario los artículos que referencia, le comunica por eventos el alta, la modificación y la eliminación de sus orígenes de contenido (las recetas y las opciones con contenido directo de Inventario) y recibe de él la disponibilidad de cada origen. Cada operación exige un permiso, que llega en la credencial emitida por un servicio externo. El administrador genera bajo demanda una carta imprimible con las entradas y ofertas activas para entregarla a los comensales. Órdenes consulta el catálogo bajo demanda, registra la opción elegida en cada ronda y determina el precio final. |

La especificación establece capacidades observables, restricciones del dominio, criterios no funcionales y preguntas pendientes. No afirma que el software ya las implemente o que hayan sido verificadas en ejecución.

> **OPEN-005:** está resuelta en RF-IMG-01..05, y OPEN-010 y OPEN-013 se cerraron en la versión 3.2.0 (contrato de la API alineado y permisos de RF-GEN-01). Permanecen pendientes OPEN-001, OPEN-003, OPEN-006, OPEN-009, OPEN-011, OPEN-012 y OPEN-014, descritas en [`open.md`](open.md).

## Ruta de lectura recomendada

1. [`configuration.md`](configuration.md) para consultar la versión y las reglas documentales de autoridad.
2. [`../other/md/domain-model.md`](../other/md/domain-model.md) para consultar el modelo conceptual de referencia y sus relaciones, como contexto no normativo; prevalece la ERS.
3. [`context.md`](context.md) para entender el alcance de Menú/Catálogo, su lenguaje y sus límites con Inventario y Órdenes.
4. [`architechture.md`](architechture.md) para consultar la vista conceptual del catálogo y la vista técnica del diagrama de clases.
5. [`functional-requirements.md`](functional-requirements.md) para consultar las convenciones y el índice de los 75 requisitos funcionales.
6. Los archivos de requisitos por área, en este orden:
   1. [`requirements/transversales.md`](requirements/transversales.md): reglas generales del catálogo.
   2. [`requirements/imagenes.md`](requirements/imagenes.md): imágenes de entradas y ofertas.
   3. [`requirements/categorias-y-entradas.md`](requirements/categorias-y-entradas.md): categorías y entradas del catálogo.
   4. [`requirements/ofertas.md`](requirements/ofertas.md): ofertas.
   5. [`requirements/composicion.md`](requirements/composicion.md): composición y grupos de selección.
   6. [`requirements/opciones.md`](requirements/opciones.md): opciones y contenido.
   7. [`requirements/recetas.md`](requirements/recetas.md): recetas.
   8. [`requirements/disponibilidad.md`](requirements/disponibilidad.md): disponibilidad derivada.
   9. [`requirements/integracion-con-inventario.md`](requirements/integracion-con-inventario.md): integración con Inventario.
   10. [`requirements/consulta-del-catalogo.md`](requirements/consulta-del-catalogo.md): consulta del catálogo y carta imprimible.
7. [`non-functional-requirements.md`](non-functional-requirements.md) para consultar los criterios de rendimiento.
8. [`open.md`](open.md) para identificar las 7 cuestiones de requisitos aún pendientes.
9. [`traceability.md`](traceability.md) para consultar las relaciones entre requisitos funcionales, requisitos no funcionales y cuestiones abiertas, y la correspondencia con los identificadores anteriores.

## Mapa de documentos

| Documento | Contenido | Uso principal |
| :--- | :--- | :--- |
| [`configuration.md`](configuration.md) | Identificación, versión, autoridad de fuentes y alcance documental. | Resolver la versión y las reglas de prevalencia documentales. |
| [`../other/md/domain-model.md`](../other/md/domain-model.md) | Modelo conceptual de referencia de Menú/Catálogo, composición por grupos de selección y opciones, orígenes de contenido, recetas y límites de dominio. | Consultar el contexto conceptual de entidades y relaciones; no es normativo. |
| [`context.md`](context.md) | Responsabilidad de Menú/Catálogo, propiedad de los datos, límites entre contextos, exclusiones de alcance y glosario. | Entender qué datos y decisiones pertenecen a cada contexto. |
| [`architechture.md`](architechture.md) | Vista conceptual del catálogo y vista técnica del diagrama de clases, además de límites arquitectónicos. | Entender el modelo del catálogo o consultar sus clases de dominio. |
| [`functional-requirements.md`](functional-requirements.md) | Índice de los 75 requisitos funcionales organizados en 11 áreas, con las convenciones de identificación y el formato de la ficha. | Localizar un requisito y el archivo que lo contiene. |
| `requirements/` | 10 archivos con las fichas de los requisitos funcionales por área y sus criterios de aceptación; la lista y el orden figuran en el índice de requisitos funcionales. | Implementar o revisar las capacidades funcionales solicitadas. |
| [`non-functional-requirements.md`](non-functional-requirements.md) | 3 requisitos `RNF-REND-*` de rendimiento de la consulta, la búsqueda y el filtrado del catálogo. | Evaluar los objetivos de calidad definidos para el servicio. |
| [`open.md`](open.md) | 7 cuestiones de requisitos que requieren una decisión explícita. | Evitar fijar valores o comportamientos que aún no están determinados. |
| [`traceability.md`](traceability.md) | Matrices entre requisitos funcionales, requisitos no funcionales y cuestiones abiertas, recuento de criterios y tabla de correspondencia con los identificadores anteriores. | Auditar cobertura e integridad de las referencias normativas. |

## Límites de responsabilidad destacados

- **Menú/Catálogo** define la identidad comercial de las entradas, sus ofertas vendibles, su composición, sus opciones, los precios base declarados y las recetas de la biblioteca de recetas.
- **Inventario** es propietario de los artículos de Inventario y de sus existencias; valida los artículos que Menu referencia y le comunica por eventos la disponibilidad de cada origen de contenido.
- **Órdenes** registra la opción elegida en cada ronda y determina el precio final.

El detalle de la propiedad de los datos, los límites entre contextos y las exclusiones de alcance se encuentra en [`context.md`](context.md).

## Convenciones de navegación

- `RF-*` identifica un requisito funcional y `RF-*.CAn`, uno de sus criterios de aceptación.
- `RNF-REND-*` identifica un requisito no funcional de rendimiento.
- `OPEN-*` identifica preguntas que requieren una decisión antes de fijar el comportamiento correspondiente.
- Los identificadores de versiones anteriores solo figuran en la tabla de correspondencia de [`traceability.md`](traceability.md).
