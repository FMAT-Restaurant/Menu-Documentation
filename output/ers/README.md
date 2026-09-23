# ERS del servicio Menu

Índice de la especificación técnica, funcional y de arquitectura de dominio del servicio **Menu** para el sistema de comandas y gestión de restaurantes.

## Estado documental

| Campo               | Valor                                                                                                    |
| :------------------ | :------------------------------------------------------------------------------------------------------- |
| Servicio            | Menu                                                                                                     |
| Versión consolidada | 1.3.11                                                                                                   |
| Estado              | Vigente / En revisión con cuestiones abiertas pendientes                                                 |
| Fuente de verdad    | [`configuration.md`](configuration.md)                                                                   |
| Alcance             | Catálogo comercial, variantes, combos, modificadores, precios, elegibilidad y proyecciones operacionales |

La especificación es normativa y analítica. Define responsabilidades, reglas, límites y cuestiones pendientes; no constituye por sí misma una implementación ni evidencia de pruebas en ejecución.

## Ruta de lectura recomendada

1. [`configuration.md`](configuration.md) para conocer la versión, la autoridad de las fuentes, la regla de prevalencia y el alcance general.
2. [`context.md`](context.md) para entender el bounded context Menu, sus responsabilidades, los límites de ownership y el lenguaje del dominio.
3. [`architechture.md`](architechture.md) para revisar agregados, entidades, value objects, proyecciones, diagramas y límites de integración.
4. [`functional-requirements.md`](functional-requirements.md) para consultar las obligaciones funcionales verificables.
5. [`non-functional-requirements.md`](non-functional-requirements.md) para consultar rendimiento, concurrencia, integridad y resiliencia.
6. [`business-rules.md`](business-rules.md) para consultar las reglas de negocio e invariantes que restringen el modelo.
7. [`open.md`](open.md) para identificar las decisiones de integración, persistencia y transporte que permanecen abiertas.
8. [`traceability.md`](traceability.md) para consultar la cobertura y las relaciones entre requisitos, reglas e invariantes.

## Mapa de documentos

| Documento                                                          | Contenido                                                                                                                                                        | Uso principal                                                                                   |
| :----------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| [`configuration.md`](configuration.md)                             | Identificación, versión 1.3.11, autoridad temporal de las fuentes, regla de prevalencia, alcance y exclusiones.                                                  | Resolver qué versión y qué decisiones tienen autoridad dentro de la especificación consolidada. |
| [`context.md`](context.md)                                         | Bounded context Menu, responsabilidades, ownership de datos, límites con POS, Orders + Kitchen, Inventory y Sala, taxonomía, dimensiones ortogonales y glosario. | Entender qué pertenece a Menu y qué corresponde a otros microservicios.                         |
| [`architechture.md`](architechture.md)                             | Modelo de dominio, agregados `MenuItem` y `ComboConfiguration`, entidades, atributos, value objects, read models, diagramas y patrones de integración.           | Consultar la estructura conceptual y los límites de consistencia del dominio.                   |
| [`functional-requirements.md`](functional-requirements.md)         | 42 requisitos funcionales `REQ-MENU-*` organizados por catálogo, variantes, precios, modificadores, combos, ciclo de vida, revisiones y disponibilidad.          | Implementar o verificar las obligaciones funcionales del servicio Menu.                         |
| [`non-functional-requirements.md`](non-functional-requirements.md) | 5 requisitos no funcionales `NFR-MENU-*`, objetivos de latencia, perfil de carga, ráfagas, outbox externo y resiliencia.                                         | Definir objetivos de aceptación de ingeniería y límites operacionales.                          |
| [`business-rules.md`](business-rules.md)                           | 34 reglas `BR-MENU-*` y 5 invariantes `INV-MENU-*` sobre identidad, variantes, precios, combos, disponibilidad, revisiones y eliminación.                        | Validar restricciones de dominio e invariantes de integridad.                                   |
| [`open.md`](open.md)                                               | Cuestiones `OPEN-002`, `OPEN-007`, `OPEN-009`, `OPEN-010` y `OPEN-011`, con decisiones confirmadas y alcance técnico pendiente.                                  | Identificar decisiones que no deben inventarse durante el diseño o la implementación.           |
| [`traceability.md`](traceability.md)                               | Matriz individual de los 86 elementos normativos y sus relaciones entre requisitos, reglas e invariantes.                                                        | Auditar cobertura, procedencia y consistencia documental.                                       |

## Límites de responsabilidad destacados

- **Menu** administra la oferta comercial: `MenuItem`, `MenuItemVariant`, `ComboConfiguration`, `ComboSlot`, `ComboOption`, modificadores comerciales, precios, elegibilidad y proyecciones de catálogo.
- **POS** representa la UI o terminal de venta: consume el catálogo publicado por Menu, captura los artículos y configuraciones elegidos y solicita a Orders + Kitchen la creación de la comanda.
- **Orders + Kitchen** crea y custodia órdenes, comandas y snapshots inmutables de venta; también es responsable de preparación y disponibilidad operacional.
- **Inventory** custodia existencias y movimientos físicos de inventario.
- **Sala** es un microservicio independiente para reservaciones, mesas y operaciones relacionadas; no representa la UI del POS.

El contrato técnico que utiliza la UI/POS para enviar la selección a Orders + Kitchen permanece abierto en [`open.md`](open.md), principalmente bajo `OPEN-007`, y no forma parte de la responsabilidad del servicio Menu.

## Convenciones de navegación

- Los identificadores `REQ-MENU-*`, `NFR-MENU-*`, `BR-MENU-*` e `INV-MENU-*` son normativos y deben conservarse al referenciar requisitos, reglas o invariantes.
- Las decisiones aún no determinadas se identifican con `OPEN-*`; no deben completarse mediante suposiciones técnicas no respaldadas.
- Para comprobar la cobertura de identificadores y sus relaciones, consultar [`traceability.md`](traceability.md).
