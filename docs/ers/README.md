# ERS del servicio Menu

Índice de los requisitos, reglas de dominio y criterios de calidad del servicio **Menu** para el catálogo de un restaurante. El modelo conceptual vigente se describe en [`../other/md/domain-model.md`](../other/md/domain-model.md).

## Estado documental

| Campo | Valor |
| :--- | :--- |
| Servicio | Menu |
| Versión | 2.1.2 |
| Estado | Vigente / En revisión con cuestiones abiertas pendientes |
| Configuración de referencia | [`configuration.md`](configuration.md) |
| Alcance | Menu administra la identidad comercial del catálogo, sus ofertas, composición, recetas y personalizaciones. Inventario mantiene la identidad y existencias de sus artículos; el modelo de órdenes registra elecciones y determina el precio final. |

La especificación establece capacidades observables, restricciones del dominio, criterios no funcionales y preguntas pendientes. No afirma que el software ya las implemente o que hayan sido verificadas en ejecución.

> **OPEN-005:** se conservan las restricciones de contenido y validación atómica de imágenes, especificadas en los requisitos funcionales y trazadas en [`traceability.md`](traceability.md). El transporte y la representación externa no se fijan ahora; las operaciones, datos y representaciones de la API quedan pendientes en OPEN-010 después de revisar los mockups. Permanecen pendientes OPEN-001, OPEN-002, OPEN-003, OPEN-006, OPEN-007, OPEN-008, OPEN-009 y OPEN-010.

## Ruta de lectura recomendada

1. [`configuration.md`](configuration.md) para consultar la versión y las reglas documentales de autoridad.
2. [`../other/md/domain-model.md`](../other/md/domain-model.md) para consultar el modelo conceptual vigente y sus relaciones.
3. [`context.md`](context.md) para entender el alcance de Menú/Catálogo, su lenguaje y sus límites con Inventario y Órdenes.
4. [`architechture.md`](architechture.md) para revisar la arquitectura, entidades y diagramas del servicio.
5. [`functional-requirements.md`](functional-requirements.md) para consultar las 30 capacidades funcionales verificables.
6. [`non-functional-requirements.md`](non-functional-requirements.md) para consultar los criterios de rendimiento y operación.
7. [`business-rules.md`](business-rules.md) para consultar las 30 reglas de negocio y 9 invariantes del dominio.
8. [`open.md`](open.md) para identificar las 8 decisiones de requisitos aún pendientes, incluida OPEN-010.
9. [`traceability.md`](traceability.md) para consultar las relaciones entre requisitos, reglas, invariantes y criterios no funcionales.

## Mapa de documentos

| Documento | Contenido | Uso principal |
| :--- | :--- | :--- |
| [`configuration.md`](configuration.md) | Identificación, versión, autoridad de fuentes y alcance documental. | Resolver la versión y las reglas de prevalencia documentales. |
| [`../other/md/domain-model.md`](../other/md/domain-model.md) | Modelo conceptual de Menú/Catálogo, composición, contenido, recetas, personalizaciones y límites de dominio. | Interpretar las entidades y relaciones vigentes. |
| [`context.md`](context.md) | Responsabilidad de Menú/Catálogo, ownership, límites entre contextos y glosario. | Entender qué datos y decisiones pertenecen a cada contexto. |
| [`architechture.md`](architechture.md) | Modelo del servicio, entidades, relaciones, diagramas y límites arquitectónicos. | Consultar la organización arquitectónica del servicio. |
| [`functional-requirements.md`](functional-requirements.md) | 30 requisitos `REQ-MENU-*` para categorías, entradas, ofertas, composición, recetas y personalizaciones. | Implementar o revisar las capacidades funcionales solicitadas. |
| [`non-functional-requirements.md`](non-functional-requirements.md) | Criterios `NFR-MENU-*` de carga, latencia y comportamiento operativo. | Evaluar los objetivos de calidad definidos para el servicio y sus flujos completos. |
| [`business-rules.md`](business-rules.md) | 30 reglas `BR-MENU-*` y 9 invariantes `INV-MENU-*`. | Validar las restricciones comerciales y la integridad del modelo. |
| [`open.md`](open.md) | 8 cuestiones de requisitos que requieren una decisión explícita, incluida OPEN-010. | Evitar fijar valores o comportamientos que aún no están determinados. |
| [`traceability.md`](traceability.md) | Matrices de los requisitos, reglas, invariantes y criterios no funcionales. | Auditar cobertura e integridad de las referencias normativas. |

## Límites de responsabilidad destacados

- **Menú/Catálogo** define la identidad comercial de las entradas, sus ofertas vendibles, composiciones, contenido, recetas reutilizables, personalizaciones y precios declarados.
- **Inventario** es propietario de la identidad y las existencias de `InventoryItem`; Menú/Catálogo mantiene referencias a esos artículos.
- **Órdenes** registra las elecciones concretas de una orden y determina el precio final de acuerdo con las definiciones comerciales del catálogo.

## Convenciones de navegación

- `REQ-MENU-*`, `NFR-MENU-*`, `BR-MENU-*` e `INV-MENU-*` identifican contenido normativo y deben conservarse en sus referencias.
- `OPEN-*` identifica preguntas que requieren una decisión antes de fijar el comportamiento correspondiente.
- La matriz de [`traceability.md`](traceability.md) permite localizar las relaciones entre cada identificador normativo.
