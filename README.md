<div align="center">

# Menu Documentation

![Tipo](https://img.shields.io/badge/tipo-especificaci%C3%B3n%20y%20dise%C3%B1o-111111)
![Idioma](https://img.shields.io/badge/idioma-espa%C3%B1ol-444444)
![Estado](https://img.shields.io/badge/estado-base%20documental-1A1A1A)

</div>

## Propósito

Este repositorio concentra la definición documental del sistema de comandas de FMAT Restaurant. Su objetivo es convertir el análisis del dominio y las decisiones de arquitectura en artefactos verificables que sirvan como referencia común para el diseño, la revisión y la futura implementación.

El alcance actual se centra especialmente en el bounded context `Menu`, responsable de la definición del catálogo, los productos vendibles, las variantes, los modificadores, los combos y las resoluciones necesarias para su operación en el flujo de comandas.

## Qué contiene

| Área                           | Propósito                                                                                                                                                          |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Requisitos y modelo de dominio | Define el problema, el modelo conceptual, las reglas de negocio y los requisitos funcionales.                                                                      |
| Especificación consolidada     | Reúne el alcance, las responsabilidades del servicio `Menu`, sus invariantes y los requisitos vigentes.                                                            |
| Contratos e interfaces         | Documenta APIs, eventos, tipos, esquemas, convenciones y trazabilidad entre contratos y requisitos cuando estos entregables están presentes en la revisión activa. |
| Revisiones y auditorías        | Registra decisiones, hallazgos, correcciones, consultorías y criterios de aceptación.                                                                              |

## Estructura del repositorio

```text
.
├── .agents/                 Recursos locales para agentes y habilidades de trabajo
├── .stitch/                 Sistema visual y metadatos de los mockups
├── docs/
│   ├── md/                  Fuentes de análisis, modelo, requisitos y auditorías
│   ├── original/            Documentos originales en PDF
├── output/
│   ├── ers/                 Especificación consolidada del servicio Menu
│   ├── ui-spec/             Especificación semántica de la interfaz de usuario
├── tools/               Herramientas de conversión, validación y generación de artefactos
├── AGENTS.md                Reglas de colaboración y control de alcance
└── README.md                Guía general del repositorio
```

### `docs/`: fuentes y trazabilidad del análisis

Esta carpeta conserva el material que explica de dónde provienen las decisiones del diseño:

- `docs/md/` contiene el problema inicial, modelos conceptuales, requisitos funcionales, auditorías, consultorías y decisiones de cierre.
- `docs/original/` conserva los documentos fuente en su formato original.
- `docs/requests/` registra solicitudes que orientan o documentan los trabajos realizados sobre la especificación.

### `output/`: entregables consolidados

Aquí se encuentran los artefactos preparados para consulta y revisión:

- `output/ers/spec.md` es la especificación vigente y consolidada del servicio `Menu`.
- `output/ui-spec/` contiene la especificación semántica de la interfaz: vistas, navegación, estados, flujos y auditorías de consistencia.

La arquitectura de la especificación de interfaz se documenta en [`docs/ui-spec-arch.md`](docs/ui-spec-arch.md). Los artefactos semánticos de `output/ui-spec/` son la referencia para describir qué existe en cada vista y cómo se relacionan sus acciones, estados y requisitos; los mockups representan la posterior exploración visual.

### `.stitch/`: sistema visual

Contiene el sistema visual y los metadatos utilizados para mantener consistencia entre los mockups: viewport objetivo, tipografía, escala cromática, superficies, bordes y demás tokens de diseño.

## Licencia y uso

> [!NOTE]
> No se ha definido una licencia de distribución en este repositorio. El contenido debe tratarse como material de especificación y diseño del proyecto FMAT Restaurant hasta que se establezcan formalmente las condiciones de uso.
