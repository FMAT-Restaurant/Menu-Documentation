No existe un estándar universal que diga «un POS debe responder en X ms y soportar Y TPS». Los fabricantes de POS/KDS hablan de operación **en tiempo real**, e incluso incorporan mecanismos de distribución de carga, pero normalmente no publican un SLA de latencia aplicable a cualquier restaurante. Oracle, por ejemplo, describe su KDS como una vista en tiempo real y contempla balanceo según la carga actual de las estaciones. ([Oracle Docs][1])

Para **su sistema de comandas**, yo fijaría los siguientes **requisitos no funcionales de aceptación**:

| Operación                                                     |                                  Objetivo aceptable | Límite que empezaría a considerar problemático |
| ------------------------------------------------------------- | --------------------------------------------------: | ---------------------------------------------: |
| Feedback visual al tocar `+`, `-`, seleccionar modifier, etc. |                                         **≤100 ms** |                                        >200 ms |
| Búsqueda/filtro/cambio de categoría del menú                  |                                     **p95 ≤200 ms** |                                        >500 ms |
| Agregar/modificar/quitar línea de orden                       |                                     **p95 ≤300 ms** |                                        >750 ms |
| Recalcular precio/validar configuración                       |                                     **p95 ≤300 ms** |                                        >500 ms |
| Crear/actualizar orden en backend                             |                                     **p95 ≤500 ms** |                                           >1 s |
| `Enviar a cocina` → ACK de Orders                             |                           **p95 ≤500 ms**, p99 ≤1 s |                                           >2 s |
| Orden visible en KDS                                          |                              **p95 ≤1 s**, p99 ≤2 s |                                           >3 s |
| Consulta de disponibilidad/inventario proyectado              |                                 **p95 ≤250–300 ms** |                                        >750 ms |
| Pago externo                                                  | feedback inmediato; normalmente **≤2–3 s** deseable |                         depende del adquirente |

Los primeros valores no son arbitrarios: el modelo RAIL coloca **100 ms** como el rango en que una acción todavía se siente inmediata; INP considera **≤200 ms** una buena respuesta y >500 ms deficiente. Nielsen establece además aproximadamente **1 segundo** como frontera antes de interrumpir perceptiblemente el flujo mental del usuario. ([web.dev][2])

En un POS yo sería **más exigente que en una web tradicional** en las operaciones repetitivas. Un mesero puede pulsar:

```text
Hamburguesa
→ Personalizar
→ Sin cebolla
→ Extra queso
→ Cantidad 2
→ Agregar
```

Si cada operación tarda 500–700 ms, individualmente no parece catastrófico, pero encadenadas hacen que el terminal se sienta pesado.

## Y respecto a carga

Aquí no recomiendo escribir simplemente:

> «El sistema soportará 100 usuarios simultáneos».

Eso dice muy poco.

Lo correcto es relacionarlo con **usuarios activos + frecuencia de operaciones + bursts**.

Por ejemplo, para una sucursal razonablemente grande podrías presupuestar:

```text
20 terminales/meseros activos

cada uno:
≈ 1 operación relevante / segundo durante momentos intensivos

≈ 20 req/s
```

Añades:

```text
KDS
Inventory
actualizaciones
administración
reintentos
eventos
```

y puedes terminar aproximadamente en:

```text
25–30 req/s de carga pico esperada.
```

Entonces yo probaría el sistema al menos así:

| Prueba                                             |                  Umbral recomendado inicial |
| -------------------------------------------------- | ------------------------------------------: |
| Usuarios/dispositivos concurrentes por restaurante |                                   **30–40** |
| Carga sostenida                                    |              **30 req/s durante 15–30 min** |
| Carga de diseño con margen                         |                             **50–60 req/s** |
| Burst corto                                        |               **100 req/s durante 30–60 s** |
| Creaciones/modificaciones críticas de orden        | **≥10 ops/s sin degradación significativa** |
| Error rate interno bajo carga nominal              |                                  **<0.1 %** |
| Órdenes duplicadas/perdidas                        |                                       **0** |
| p95 bajo carga nominal                             |   debe seguir cumpliendo los SLO anteriores |
| p99 `Enviar a cocina`                              |                                    **≤2 s** |

**Esos 30/60/100 req/s no son un estándar POS de la industria**; son un presupuesto de ingeniería razonable para este sistema y deben reemplazarse posteriormente por datos reales de operación.

Una regla que sí usaría como criterio arquitectónico sería:

```text
Capacidad mínima =
    2 × pico previsto
```

y probaría además bursts de:

```text
3–4 × pico previsto
```

no necesariamente exigiendo la misma latencia a 4×, pero sí:

```text
sin pérdida de órdenes
sin corrupción
sin duplicados
sin caída del servicio
con recuperación rápida de las colas
```

Esto es especialmente importante en `CreateOrder`/`SubmitOrder`: ante timeouts no puedes asumir que la operación falló y simplemente repetirla. APIs transaccionales como Square utilizan claves de **idempotencia** precisamente para que un retry no produzca órdenes o pagos duplicados. ([Square][3])

### Lo que pondría en su especificación

Para **Orders/POS**, me parece un excelente NFR decir:

> **Bajo la carga nominal de una sucursal de hasta 40 clientes POS/KDS concurrentes y 30 solicitudes por segundo sostenidas, el sistema deberá procesar al menos el 95 % de las operaciones interactivas en ≤300 ms y el 99 % en ≤1 s. El envío confirmado de una orden deberá reflejarse en el KDS en ≤1 s para p95 y ≤2 s para p99. El sistema deberá soportar ráfagas de al menos 100 solicitudes por segundo sin pérdida, duplicación ni corrupción de órdenes.**

Eso ya es **medible con k6/JMeter/Gatling**, tiene percentiles, tiene escenario de carga y, sobre todo, conecta directamente con la decisión que veníamos discutiendo: la configuración explícita de variantes, combos y modifiers tiene sentido si ayuda a que las operaciones críticas de `Orders` sean búsquedas/validaciones simples y mantengan estos SLO durante la hora pico.

[1]: https://docs.oracle.com/en/industries/food-beverage/simphony/19.5/kdscu/c_kds_basics.htm?utm_source=chatgpt.com "KDS Basics"
[2]: https://web.dev/articles/rail?utm_source=chatgpt.com "Measure performance with the RAIL model  |  Articles  |  web.dev"
[3]: https://developer.squareup.com/reference/square/payments-api/create-order?utm_source=chatgpt.com "POST /v2/orders - Square API Reference"
