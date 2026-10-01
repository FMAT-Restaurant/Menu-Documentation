# Surgical editor task

## Only writable target

- Ningún archivo del repositorio. Entregar el ticket como texto en la respuesta.

## Instructions

- Usar el título y cuerpo siguientes como borrador común, listo para copiar en el repositorio frontend y en el backend. No insertar nombres de archivos o comandos exclusivos de uno de los dos stacks.
- Mantener las secciones y el orden del template. Corregir solo redacción necesaria para legibilidad, sin cerrar decisiones abiertas.

### Título

Configurar el análisis de código con SonarQube en este repositorio

### Cuerpo

## Descripción

Integrar este repositorio con SonarQube para ejecutar análisis de calidad del código y consultar sus resultados en un proyecto propio. Configurar el mecanismo de análisis compatible con el stack de este repositorio, sus parámetros externos y un procedimiento reproducible de ejecución. Esta tarea cubre la integración del repositorio; el provisionamiento y la administración de la instancia SonarQube se tratan por separado.

### Requisitos implicados

- No se identifica un requisito funcional de la ERS directamente relacionado con SonarQube. Esta es una tarea de calidad técnica del repositorio.

### Reglas de negocio implicadas

- No hay reglas de negocio del producto implicadas en esta configuración.

### Invariantes implicadas

- Cada repositorio usa una identidad de proyecto SonarQube propia para que los resultados de frontend y backend permanezcan separados.
- La URL, los tokens y demás credenciales se obtienen de configuración externa; no se guardan secretos en el repositorio.
- La integración respeta la estructura, el lenguaje y el sistema de build de este repositorio sin alterar la lógica del producto.

## Criterios de aceptación

- El repositorio contiene la configuración mínima para ejecutar el scanner o plugin de SonarQube compatible con su stack y asociar el análisis con su proyecto SonarQube.
- La configuración de fuentes, pruebas e inclusiones o exclusiones corresponde a la estructura real del repositorio; cualquier exclusión no obvia queda justificada.
- Se documentan los parámetros requeridos y el comando o procedimiento para ejecutar el análisis. La URL y las credenciales se suministran externamente.
- Con acceso a la instancia elegida, el análisis termina correctamente y sus resultados aparecen en el proyecto SonarQube correspondiente. Se registra la evidencia de esa ejecución en la entrega de la tarea.
- El mismo texto de tarea puede aplicarse al otro repositorio, usando su propia clave de proyecto y su mecanismo de análisis compatible.

## Decisiones abiertas

- Elegir SonarQube Cloud o SonarQube Server y definir quién provisiona/administra la instancia.
- Definir la URL, forma de autenticación y distribución de credenciales para cada ambiente.
- Definir si el análisis se ejecutará en CI, en qué eventos y con qué política para ramas y pull requests.
- Definir Quality Gate, Quality Profile y condiciones que bloquearían una entrega.
- Definir cómo se genera/importa cobertura y si habrá umbrales.
- Definir la estrategia de análisis, incluidos alcance, inclusiones y exclusiones particulares de frontend y backend.

## Referencias

- `docs/templates/ticket-template.md`: formato de la tarea.
- `docs/stack.md`: stacks de frontend y backend para seleccionar la integración compatible en cada repositorio.

## Mandatory behavior

1. Entregar solo el título y el cuerpo del ticket, con todas las secciones del template.
2. No crear ni publicar issues.
3. No modificar archivos documentales, de código, configuración, tests ni estado Git.

