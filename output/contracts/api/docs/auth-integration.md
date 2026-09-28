# Preparación para autenticación y autorización

La ERS 2.1.0 no establece credenciales, proveedor de identidad, identidad, autenticación, autorización, roles, permisos ni alcance por menú. Por tanto, el contrato no declara `securitySchemes` ni aplica `security` a las operaciones. La ausencia de esas claves significa que **este archivo no define el mecanismo ni los requisitos de autenticación; no implica que la API sea anónima o pública**.

El contrato reserva `#/components/responses/Unauthorized` y `#/components/responses/Forbidden` en el documento raíz. Son respuestas reutilizables, todavía sin vincular a una operación. El esquema común de error ya admite `code`, `message` y detalles opcionales.

Cuando se apruebe el contrato de identidad y permisos, la integración debe:

1. Declarar el mecanismo aprobado en `components.securitySchemes` del documento raíz.
2. Aplicar `security` globalmente o por operación según la política aprobada. El propósito de consulta publicable figura en el tag `Catálogo`; las operaciones de los demás tags son administrativas. Esta distinción de propósito no asigna roles ni implica que las consultas sean anónimas.
3. Referenciar las respuestas 401 y 403 en las operaciones donde correspondan y precisar sus condiciones, cabeceras y ejemplos conforme al mecanismo elegido.
4. Revisar el alcance de las bibliotecas entre menús antes de asignar permisos a recetas, porque `OPEN-003` sigue pendiente.
5. Actualizar la versión de la especificación aceptada y regenerar `dist/openapi.yaml` tras incorporar la decisión.

No se define una URI de inicio de sesión, un formato de token, un esquema Bearer, OAuth, cookies ni permisos concretos antes de esa decisión.
