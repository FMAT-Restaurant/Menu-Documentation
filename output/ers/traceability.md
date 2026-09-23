# Matriz de Trazabilidad

## Propósito y alcance

Esta matriz relaciona, uno a uno, los identificadores normativos contenidos en los tres artefactos consolidados del servicio Menu:

- [functional-requirements.md](functional-requirements.md): 42 requisitos funcionales.
- [non-functional-requirements.md](non-functional-requirements.md): 5 requisitos no funcionales.
- [business-rules.md](business-rules.md): 34 reglas de negocio y 5 invariantes de integridad.

La declaración completa y el criterio de verificación de cada elemento permanecen en su documento de origen. Esta matriz concentra la identificación, la procedencia y las relaciones entre requisitos, reglas e invariantes. Una celda `—` significa que el documento de origen no declara una relación normativa directa; no representa un requisito faltante.

## Resumen de cobertura

| Artefacto                        |                   Elementos trazados | Cobertura                             |
| :------------------------------- | -----------------------------------: | :------------------------------------ |
| `functional-requirements.md`     |            42 requisitos funcionales | 100% de los identificadores presentes |
| `non-functional-requirements.md` |          5 requisitos no funcionales | 100% de los identificadores presentes |
| `business-rules.md`              | 34 reglas de negocio + 5 invariantes | 100% de los identificadores presentes |
| **Total**                        |          **86 elementos normativos** | **100%**                              |

## Matriz de requisitos funcionales

| ID                 | Elemento                                                                     | Fuente autorizada documentada                                                                              | Reglas e invariantes relacionadas                                                         |
| :----------------- | :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| `REQ-MENU-ITM-001` | Definición del `MenuItem` comercial                                          | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | `BR-MENU-001`, `BR-MENU-009`, `BR-MENU-010`, `BR-MENU-018`, `BR-MENU-019`                 |
| `REQ-MENU-ITM-002` | Transición de estado administrativo                                          | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`; `Consultoria-3.md`                                 | `BR-MENU-032`                                                                             |
| `REQ-MENU-VAR-001` | Presentación vendible de item hoja y variante `DEFAULT`                      | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | `BR-MENU-005`, `BR-MENU-006`, `INV-MENU-001`, `INV-MENU-002`                              |
| `REQ-MENU-VAR-002` | Definición de dimensión de variante                                          | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | —                                                                                         |
| `REQ-MENU-VAR-003` | Valor de dimensión de variante                                               | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | —                                                                                         |
| `REQ-MENU-VAR-004` | Definición de variantes vendibles                                            | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | `BR-MENU-002`, `BR-MENU-003`, `BR-MENU-004`                                               |
| `REQ-MENU-VAR-005` | Migración atómica de variante predeterminada                                 | `Req-F-Aproved.md`; `Auditoria-3.md`                                                                       | —                                                                                         |
| `REQ-MENU-VAR-006` | Elegibilidad estructural de variante hoja                                    | `Req-F-Aproved.md`; `Auditoria-4.md`; `Consultoria-3.md`                                                   | —                                                                                         |
| `REQ-MENU-VAR-007` | Habilitación, deshabilitación y retiro de variantes hoja                     | `Consultoria-3.md`                                                                                         | `BR-MENU-033`                                                                             |
| `REQ-MENU-PRC-001` | Precio absoluto autoritativo de la variante                                  | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | `BR-MENU-007`                                                                             |
| `REQ-MENU-PRC-002` | Proyección del precio de catálogo                                            | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | —                                                                                         |
| `REQ-MENU-PRC-003` | Exclusión de catálogo sin unidades elegibles                                 | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | —                                                                                         |
| `REQ-MENU-MOD-001` | Definición de grupos de modificadores en item hoja                           | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | `BR-MENU-013`, `INV-MENU-004`                                                             |
| `REQ-MENU-MOD-002` | Opciones de modificador y configuración general comercial                    | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | `BR-MENU-013`, `BR-MENU-015`                                                              |
| `REQ-MENU-MOD-003` | Especialización comercial de modificador por variante                        | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | `BR-MENU-014`                                                                             |
| `REQ-MENU-MOD-004` | Copia administrativa de configuraciones de modificadores                     | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | —                                                                                         |
| `REQ-MENU-MOD-005` | Proyección de modificadores efectivos comerciales                            | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | —                                                                                         |
| `REQ-MENU-COM-001` | Configuración de combo                                                       | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`; `Consultoria-3.md`                                 | `BR-MENU-008`, `BR-MENU-017`                                                              |
| `REQ-MENU-COM-002` | Definición del espacio de selección (`ComboSlot`)                            | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`                                                     | `BR-MENU-011`, `INV-MENU-004`                                                             |
| `REQ-MENU-COM-003` | Opciones de combo vinculadas a la variante hoja                              | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`; `Consultoria-3.md`                                 | `BR-MENU-008`, `BR-MENU-012`, `BR-MENU-016`, `BR-MENU-029`, `BR-MENU-030`, `INV-MENU-002` |
| `REQ-MENU-COM-004` | Copia administrativa de configuración de combo                               | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | `BR-MENU-026`                                                                             |
| `REQ-MENU-COM-005` | Asignación múltiple de opciones con atomicidad por destino                   | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | `BR-MENU-026`, `BR-MENU-027`, `BR-MENU-028`                                               |
| `REQ-MENU-COM-006` | Elegibilidad estructural de configuración de combo                           | `Req-F-Aproved.md`; `Auditoria-4.md`; `Consultoria-3.md`                                                   | `BR-MENU-034`, `INV-MENU-004`                                                             |
| `REQ-MENU-COM-007` | Habilitación local y retiro de componentes de combo                          | `Consultoria-3.md`                                                                                         | `BR-MENU-033`                                                                             |
| `REQ-MENU-LIF-001` | Archivado reversible de `MenuItem` y reevaluación no obstructiva             | `Auditoria-3.md`; `Auditoria-4.md`; `Consultoria-3.md`; modifica `Req-F-Aproved.md` REQ-MENU-026 y ADR-005 | `BR-MENU-020`, `BR-MENU-032`                                                              |
| `REQ-MENU-LIF-002` | Guardado de definiciones incompletas en contexto inactivo                    | `Req-F-Aproved.md`; `Auditoria-3.md`; `Auditoria-4.md`; ADR-005                                            | `INV-MENU-004`                                                                            |
| `REQ-MENU-LIF-003` | Advertencias de capacidad faltante                                           | `Req-F-Aproved.md`; ADR-005; `Consultoria-3.md`                                                            | —                                                                                         |
| `REQ-MENU-LIF-004` | Eliminación definitiva restringida de `MenuItem`                             | `Consultoria-3.md`                                                                                         | `BR-MENU-032`, `INV-MENU-005`                                                             |
| `REQ-MENU-VER-001` | Generación de revisión inmutable de `MenuItem`                               | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | `INV-MENU-003`                                                                            |
| `REQ-MENU-REV-001` | Detección de necesidad de revisión por cambios comerciales y culinarios      | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | `BR-MENU-031`                                                                             |
| `REQ-MENU-REV-002` | Visibilidad administrativa del estado de revisión                            | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | —                                                                                         |
| `REQ-MENU-REV-003` | Seguimiento desacoplado mediante `observedRevision` y `acknowledgedRevision` | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | —                                                                                         |
| `REQ-MENU-REV-004` | Conservación de la configuración comercial al confirmar revisión             | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | —                                                                                         |
| `REQ-MENU-REV-005` | Referencia visual del slot y precios informativos                            | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | —                                                                                         |
| `REQ-MENU-REV-006` | No disparación de revisión por disponibilidad operacional                    | `Auditoria-4.md`                                                                                           | —                                                                                         |
| `REQ-MENU-AVL-001` | Publicación conceptual y notificación de catálogo                            | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | —                                                                                         |
| `REQ-MENU-AVL-002` | Recepción y proyección desacoplada de disponibilidad operacional             | `Req-F-Aproved.md`; `Auditoria-4.md`                                                                       | —                                                                                         |
| `REQ-MENU-AVL-003` | Recepción y proyección de readiness de preparación                           | `Auditoria-4.md`                                                                                           | —                                                                                         |
| `REQ-MENU-AVL-004` | Proyección de disponibilidad granular de variante                            | `Auditoria-4.md`                                                                                           | `BR-MENU-022`                                                                             |
| `REQ-MENU-AVL-005` | Proyección de disponibilidad de modificadores                                | `Auditoria-4.md`                                                                                           | `BR-MENU-021`                                                                             |
| `REQ-MENU-AVL-006` | Propagación de disponibilidad a opciones, slots y configuraciones de combo   | `Auditoria-4.md`; `Consultoria-3.md`                                                                       | `BR-MENU-023`, `BR-MENU-024`, `BR-MENU-034`                                               |
| `REQ-MENU-AVL-007` | Derivación de disponibilidad agregada de `MenuItem` para catálogo            | `Auditoria-4.md`                                                                                           | `BR-MENU-025`                                                                             |

## Matriz de requisitos no funcionales

| ID                 | Elemento                                                         | Procedencia documentada                                                                                   | Relación y criterio de aceptación                                                                                                                                                                                                           |
| :----------------- | :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NFR-MENU-PERF-01` | Presupuesto de rendimiento de aceptación                         | `Decisiones-cierre-invariantes.md` ADR-004; `Consultoria-1.md`                                            | Enmarca `NFR-MENU-PERF-02` y `NFR-MENU-PERF-03`. Se valida mediante pruebas de carga automatizadas con datasets representativos.                                                                                                            |
| `NFR-MENU-PERF-02` | Perfil nominal: concurrencia, tasa, mezcla, errores e integridad | Fuentes de rendimiento declaradas en el documento: `Consultoria-1.md` y ADR-004                           | Hasta 40 clientes POS concurrentes, 30 req/s durante 30 minutos, error interno menor a 0.1% y cero órdenes aceptadas perdidas, duplicadas o corrompidas; incluye los objetivos de latencia por clase de operación.                          |
| `NFR-MENU-PERF-03` | Capacidad ante ráfagas                                           | Fuentes de rendimiento declaradas en el documento: `Consultoria-1.md` y ADR-004                           | 100 req/s durante 60 segundos sin colapso ni reinicio y con cero solicitudes confirmadas perdidas o corrompidas; no exige conservar la latencia nominal durante la ráfaga.                                                                  |
| `NFR-MENU-CONS-01` | Delimitación de outbox e integración transaccional               | ADR-003; `Consultoria-2.md`                                                                               | El outbox y la entrega física hacia Inventory son responsabilidad de Orders, no de Menu. Relación directa con `REQ-MENU-AVL-001` y sus notificaciones conceptuales asíncronas.                                                              |
| `NFR-MENU-RESI-01` | Resiliencia y desacoplamiento de disponibilidad operacional      | Fuentes de resiliencia y disponibilidad declaradas en el documento: `Consultoria-2.md` y `Auditoria-4.md` | La desconexión o demora de eventos de Orders + Kitchen no modifica navegación, precios, configuración, estado administrativo ni elegibilidad persistida; protege especialmente `REQ-MENU-AVL-002`, `REQ-MENU-VAR-006` y `REQ-MENU-PRC-002`. |

## Matriz de reglas de negocio

| ID            | Regla                                                               | Requisitos funcionales relacionados                        |
| :------------ | :------------------------------------------------------------------ | :--------------------------------------------------------- |
| `BR-MENU-001` | Identidad y tipo de `MenuItem`                                      | `REQ-MENU-ITM-001`                                         |
| `BR-MENU-002` | Unicidad de dimensión en variante                                   | `REQ-MENU-VAR-004`                                         |
| `BR-MENU-003` | Pertenencia estricta de dimensiones                                 | `REQ-MENU-VAR-004`                                         |
| `BR-MENU-004` | Unicidad de combinación de variante                                 | `REQ-MENU-VAR-004`                                         |
| `BR-MENU-005` | Variante técnica `DEFAULT`                                          | `REQ-MENU-VAR-001`                                         |
| `BR-MENU-006` | Exclusividad item frente a variante                                 | `REQ-MENU-VAR-001`                                         |
| `BR-MENU-007` | Autoridad absoluta de precio                                        | `REQ-MENU-PRC-001`                                         |
| `BR-MENU-008` | Cálculo del precio del combo                                        | `REQ-MENU-COM-001`, `REQ-MENU-COM-003`                     |
| `BR-MENU-009` | Clasificación comercial `PREPARED` en Menu                          | `REQ-MENU-ITM-001`                                         |
| `BR-MENU-010` | Clasificación comercial `STOCKED` en Menu                           | `REQ-MENU-ITM-001`                                         |
| `BR-MENU-011` | Límites de selección de `ComboSlot`                                 | `REQ-MENU-COM-002`                                         |
| `BR-MENU-012` | Selección de `ComboOption`                                          | `REQ-MENU-COM-003`                                         |
| `BR-MENU-013` | Límites de modificadores en item hoja                               | `REQ-MENU-MOD-001`, `REQ-MENU-MOD-002`                     |
| `BR-MENU-014` | Especialización comercial de modificadores                          | `REQ-MENU-MOD-003`                                         |
| `BR-MENU-015` | Ownership culinario de efectos de modificador                       | `REQ-MENU-MOD-002`                                         |
| `BR-MENU-016` | Confinamiento de modificadores en combos                            | `REQ-MENU-COM-003`                                         |
| `BR-MENU-017` | Ausencia de modificadores en combo                                  | `REQ-MENU-COM-001`                                         |
| `BR-MENU-018` | Clasificación comercial exclusiva de hoja                           | `REQ-MENU-ITM-001`                                         |
| `BR-MENU-019` | Separación de categorías                                            | `REQ-MENU-ITM-001`                                         |
| `BR-MENU-020` | Reevaluación de dependencias al archivar o deshabilitar componentes | `REQ-MENU-LIF-001`                                         |
| `BR-MENU-021` | No bloqueo por modificador opcional no disponible                   | `REQ-MENU-AVL-005`                                         |
| `BR-MENU-022` | Bloqueo operacional de variante por grupo obligatorio o readiness   | `REQ-MENU-AVL-004`                                         |
| `BR-MENU-023` | Herencia de disponibilidad en `ComboOption`                         | `REQ-MENU-AVL-006`                                         |
| `BR-MENU-024` | Capacidad disponible de `ComboSlot` y combo                         | `REQ-MENU-AVL-006`                                         |
| `BR-MENU-025` | Disponibilidad agregada de `MenuItem` por existencia                | `REQ-MENU-AVL-007`                                         |
| `BR-MENU-026` | Identidad y mapeo explícito de slots                                | `REQ-MENU-COM-004`, `REQ-MENU-COM-005`                     |
| `BR-MENU-027` | Atomicidad por destino y éxito parcial                              | `REQ-MENU-COM-005`                                         |
| `BR-MENU-028` | Ausencia de rollback parcial por slot                               | `REQ-MENU-COM-005`                                         |
| `BR-MENU-029` | Independencia de modificadores repetidos en combos                  | `REQ-MENU-COM-003`                                         |
| `BR-MENU-030` | Multiplicidad de opciones hacia la misma variante                   | `REQ-MENU-COM-003`                                         |
| `BR-MENU-031` | Condiciones de detección de necesidad de revisión                   | `REQ-MENU-REV-001`                                         |
| `BR-MENU-032` | Ciclo de vida de `MenuItem` y eliminación definitiva                | `REQ-MENU-ITM-002`, `REQ-MENU-LIF-001`, `REQ-MENU-LIF-004` |
| `BR-MENU-033` | Habilitación de componentes y retiro con conservación histórica     | `REQ-MENU-VAR-007`, `REQ-MENU-COM-007`                     |
| `BR-MENU-034` | Diferenciación entre slot deshabilitado y capacidad insuficiente    | `REQ-MENU-COM-006`, `REQ-MENU-AVL-006`                     |

## Matriz de invariantes de integridad

| ID             | Invariante                                                                                 | Requisitos funcionales relacionados                                            |
| :------------- | :----------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| `INV-MENU-001` | Variante obligatoria en estado activo                                                      | `REQ-MENU-VAR-001`                                                             |
| `INV-MENU-002` | `variantId` no nulo                                                                        | `REQ-MENU-VAR-001`, `REQ-MENU-COM-003`                                         |
| `INV-MENU-003` | Inmutabilidad de versiones comerciales                                                     | `REQ-MENU-VER-001`                                                             |
| `INV-MENU-004` | Capacidad vendible en estado activo                                                        | `REQ-MENU-LIF-002`, `REQ-MENU-MOD-001`, `REQ-MENU-COM-002`, `REQ-MENU-COM-006` |
| `INV-MENU-005` | Eliminación definitiva de `MenuItem` condicionada a `ARCHIVED` y ausencia de restricciones | `REQ-MENU-LIF-004`                                                             |

## Criterio de mantenimiento

Cuando se agregue, retire o cambie un identificador normativo en cualquiera de los tres documentos fuente, esta matriz deberá actualizarse en la misma modificación documental. La consistencia mínima exigida es:

1. Cada identificador de los tres documentos fuente aparece exactamente una vez en la sección de matriz que le corresponde.
2. Cada relación `REQ`–`BR` o `REQ`–`INV` apunta a un identificador existente en los documentos fuente.
3. Las relaciones no determinadas se mantienen como `—` hasta que una fuente autorizada las establezca; no se deben inferir contratos o decisiones técnicas para completar la matriz.
