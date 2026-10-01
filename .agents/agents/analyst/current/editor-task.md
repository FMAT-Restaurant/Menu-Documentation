# Surgical editor task

## Only writable target

Los siguientes son los únicos destinos autorizados de GitHub. El orquestador invoca al editor una vez por issue; cada invocación trabaja un solo destino. No hay archivos locales autorizados para escritura.

- `github:FMAT-Restaurant/Menu-Frontend#MVP1-T005`
- `github:FMAT-Restaurant/Menu-Frontend#MVP1-T006`
- `github:FMAT-Restaurant/Menu-Frontend#MVP1-T007`
- `github:FMAT-Restaurant/Menu-Frontend#MVP1-T008`

## Instructions

### github:FMAT-Restaurant/Menu-Frontend#MVP1-T005

1. Repositorio de destino: FMAT-Restaurant/Menu-Frontend. Crear exactamente un issue con título "MVP1-T005 Definir repositorio y base Back", etiqueta enhancement y sin asignado, hito ni Project.
2. Usar este cuerpo exacto:

Usar Java 25 LTS con Eclipse Temurin 25.0.4.1, Spring Boot 4.1.1, Gradle 9.8.0, JUnit 6.0.3 y Mockito 5.23.0; mantener abierta la selección entre PostgreSQL 18.6 y MongoDB 8.3.11, junto con la topología y los límites transaccionales. Si se elige PostgreSQL, corresponde Spring Data JPA 4.1.1; si se elige MongoDB, Spring Data MongoDB 5.1.1; ambas versiones son gestionadas por Spring Boot 4.1.1 según docs/other/stack.md; no añadir Spring Security hasta que AuthN/AuthZ se decida explícitamente ni implicar acceso anónimo/público. Crear un servicio ejecutable local con un esqueleto OpenAPI.

Criterios de aceptación:
* Crear un servicio Back ejecutable local con un esqueleto OpenAPI usando las versiones del plan.
* Mantener sin resolver la elección de persistencia, la topología, los límites transaccionales y AuthN/AuthZ; no implicar acceso público o anónimo.

Equipo: Back

Referencias:
* [Plan MVP-1 — tareas fundacionales](https://fmat-restaurant.github.io/Menu-Documentation/product/mvp-01-catalogo-publicable/)

3. Antes de crear, buscar MVP1-T005 en todos los estados del repositorio; si ya existe, registrar su URL y no duplicarlo.

### github:FMAT-Restaurant/Menu-Frontend#MVP1-T006

1. Repositorio de destino: FMAT-Restaurant/Menu-Frontend. Crear exactamente un issue con título "MVP1-T006 Dockerizar Back", etiqueta enhancement y sin asignado, hito ni Project.
2. Usar este cuerpo exacto:

Crear la imagen del API con Eclipse Temurin 25.0.4.1 para build/runtime según corresponda y configuración local con Docker 29.8.1 y Docker Compose 5.5.1 para ejecutar Back junto a dependencias aprobadas; mantener abierta la topología. Termina cuando el proceso arranca con configuración externa.

Criterios de aceptación:
* Construir la imagen del API y arrancar el proceso con configuración externa y dependencias locales aprobadas.
* Mantener abierta la decisión de topología.

Equipo: Back

Referencias:
* [Plan MVP-1 — tareas fundacionales](https://fmat-restaurant.github.io/Menu-Documentation/product/mvp-01-catalogo-publicable/)

3. Antes de crear, buscar MVP1-T006 en todos los estados del repositorio; si ya existe, registrar su URL y no duplicarlo.

### github:FMAT-Restaurant/Menu-Frontend#MVP1-T007

1. Repositorio de destino: FMAT-Restaurant/Menu-Frontend. Crear exactamente un issue con título "MVP1-T007 CI de Back y contrato", etiqueta enhancement y sin asignado, hito ni Project.
2. Usar este cuerpo exacto:

Configurar CI con Java 25 LTS/Eclipse Temurin 25.0.4.1 y Gradle 9.8.0; ejecutar build y pruebas unitarias/integración con JUnit 6.0.3 y Mockito 5.23.0, usando Testcontainers 2.0.5 cuando las pruebas de integración requieran dependencias contenedorizadas. Validar el contrato OpenAPI modular aceptado (API 2.2.1, OpenAPI 3.1.0), incluidos los límites/códigos de error multipart y las respuestas JSON de lectura con referencias de imagen; usar Docker 29.8.1 y Docker Compose 5.5.1 para las dependencias locales cuando aplique y construir la imagen Docker. Mantener los gates de build, pruebas, contrato e imagen. Termina cuando cada cambio muestra el resultado y bloquea la publicación del artefacto si algún paso obligatorio falla.

Criterios de aceptación:
* El CI ejecuta build, pruebas unitarias e integración, validación del contrato OpenAPI modular aceptado y construcción de imagen Docker.
* Cada cambio reporta el resultado de los gates obligatorios y bloquea la publicación del artefacto si alguno falla.

Equipo: Back

Referencias:
* [Plan MVP-1 — tareas fundacionales](https://fmat-restaurant.github.io/Menu-Documentation/product/mvp-01-catalogo-publicable/)
* [Referencia de API Menu](https://fmat-restaurant.github.io/Menu-Documentation/api/)

3. Antes de crear, buscar MVP1-T007 en todos los estados del repositorio; si ya existe, registrar su URL y no duplicarlo.

### github:FMAT-Restaurant/Menu-Frontend#MVP1-T008

1. Repositorio de destino: FMAT-Restaurant/Menu-Frontend. Crear exactamente un issue con título "MVP1-T008 CD de Back", etiqueta enhancement y sin asignado, hito ni Project.
2. Usar este cuerpo exacto:

Configurar la publicación y promoción de la imagen Back a los entornos acordados, incluida la secuencia de migración compatible con el servicio. Bloqueado hasta acordar registry, destinos, credenciales, aprobaciones, persistencia y recuperación.

Criterios de aceptación:
* Publicar y promover la imagen Back en los entornos acordados con una secuencia de migración compatible.
* Mantener la tarea bloqueada hasta acordar registry, destinos, credenciales, aprobaciones, persistencia y recuperación.

Equipo: Back

Referencias:
* [Plan MVP-1 — tareas fundacionales](https://fmat-restaurant.github.io/Menu-Documentation/product/mvp-01-catalogo-publicable/)

3. Antes de crear, buscar MVP1-T008 en todos los estados del repositorio; si ya existe, registrar su URL y no duplicarlo.

## Mandatory behavior

1. Limitar la creación a `MVP1-T005`–`MVP1-T008` en `FMAT-Restaurant/Menu-Frontend`; no modificar ni duplicar `MVP1-T001`–`MVP1-T004` ya representadas por #5–#8.
2. Para cada destino asignado, buscar el Task ID en todos los estados justo antes de crear. Si ya existe, informar su URL y omitir la creación.
3. Crear el issue con el título, cuerpo y etiqueta `enhancement` de `plan.json`; el cuerpo debe indicar `Equipo: Back` y enlazar la documentación publicada.
4. Después de crear cada issue, consultar su URL/número y verificar título, cuerpo, etiqueta, referencia y unicidad del Task ID. Informar las cuatro URLs al orquestador.
5. No asignar responsables, hitos o GitHub Project; no editar archivos locales ni crear otras tareas del MVP.
