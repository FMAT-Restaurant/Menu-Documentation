# Tech Stack

## Frontend

| Technology            | Description                                                                                                     | Version     |
| --------------------- | --------------------------------------------------------------------------------------------------------------- | ----------- |
| TypeScript            | Strongly typed programming language built on JavaScript, used as the primary language for frontend development. | 7.0.2       |
| React                 | JavaScript library for building component-based web user interfaces.                                            | 19.3.0      |
| React Router          | Client-side routing library for React applications.                                                             | 7.18.4      |
| Axios                 | Promise-based HTTP client used to communicate with backend services.                                            | 1.20.0      |
| Jest                  | JavaScript testing framework used for unit and integration testing.                                             | 30.5.2      |
| React Testing Library | Testing utilities for React components focused on user-oriented testing practices.                              | 16.3.3      |
| Vite                  | Frontend development server and build tool optimized for modern web applications.                               | 8.3.1       |
| ESLint                | Static analysis tool used to identify problems and enforce code quality rules.                                  | 10.10.0     |
| Node.js               | JavaScript runtime used by the frontend development and build toolchain.                                        | 24.21.0 LTS |
| npm                   | Package manager used to manage frontend dependencies and scripts.                                               | 12.1.0      |

### Some clarifications about the frontend stack

#### TypeScript 7

TypeScript 7.0 is the new native implementation of the TypeScript compiler and language service, rewritten in Go. It is considered production-ready and typically provides full-build performance improvements of approximately 8x to 12x compared with TypeScript 6, while also improving editor responsiveness and reducing memory usage in many workloads.

However, TypeScript 7.0 does not yet expose a programmatic compiler API. A new API is expected to be introduced in TypeScript 7.1. This means that tools that interact directly with the TypeScript compiler API, such as `typescript-eslint`, may still require TypeScript 6 temporarily.

For this reason, the project should use TypeScript 7 as the primary compiler while keeping TypeScript 6 available only as a compatibility dependency for tools that still require the legacy compiler API.

The recommended configuration is:

```json
{
  "devDependencies": {
    "@typescript/native": "npm:typescript@^7.0.2",
    "typescript": "npm:@typescript/typescript6@^6.0.2"
  }
}
```

With this configuration:

- `@typescript/native` provides TypeScript 7 and its native `tsc` compiler.
- `typescript` resolves to the TypeScript 6 compatibility package so tools that expect to import the `typescript` package and use its programmatic API can continue working.
- TypeScript 7 remains the compiler used for normal project compilation.
- TypeScript 6 should not be treated as the project's primary TypeScript version; it exists only as a temporary compatibility layer.

TypeScript 7 was designed to remain compatible with TypeScript 6's type-checking and command-line behavior. Code that compiles correctly with TypeScript 6 under the supported configuration should generally produce equivalent results with TypeScript 7.

Once the required tooling supports the new TypeScript 7 API, or TypeScript 7.1 provides the necessary programmatic API support, the TypeScript 6 compatibility dependency should be removed and the project should use TypeScript 7 exclusively.

The project should therefore consider **TypeScript 7.0.2 as its official TypeScript version**, while `@typescript/typescript6` is only an implementation detail required during the ecosystem transition.

## Backend

| Technology          | Description                                                                                                                       | Version  |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- | -------- |
| Java                | Primary programming language used to implement backend services.                                                                  | 25 LTS   |
| Eclipse Temurin     | OpenJDK distribution used for local development, CI/CD and application runtime.                                                   | 25.0.4.1 |
| Spring Boot         | Framework used to implement and configure backend microservices.                                                                  | 4.1.1    |
| Spring Data JPA     | Persistence abstraction used to access relational data stored in PostgreSQL. Its version is managed by Spring Boot.               | 4.1.1    |
| Spring Data MongoDB | Persistence abstraction used to access document-oriented data stored in MongoDB. Its version is managed by Spring Boot.           | 5.1.1    |
| Spring AMQP         | Spring integration used for AMQP messaging and communication with RabbitMQ. Its version is managed by Spring Boot.                | 4.1.1    |
| Spring Security     | Authentication and authorization framework for Spring applications. Its version is managed by Spring Boot.                        | 7.1.1    |
| Gradle              | Build automation and dependency management tool used by backend services.                                                         | 9.8.0    |
| JUnit               | Testing framework used to implement unit and integration tests. Its version is managed by Spring Boot.                            | 6.0.3    |
| Mockito             | Mocking framework used to isolate dependencies during unit testing. Its version is managed by Spring Boot.                        | 5.23.0   |
| Testcontainers      | Library used to provide containerized infrastructure dependencies for integration testing. Its version is managed by Spring Boot. | 2.0.5    |

## Infrastructure

| Technology     | Description                                                                                             | Version |
| -------------- | ------------------------------------------------------------------------------------------------------- | ------- |
| PostgreSQL     | Relational database management system used for structured and transactional data.                       | 18.6    |
| RabbitMQ       | Message broker used for asynchronous communication and event exchange between services.                 | 4.3.6   |
| Docker         | Containerization platform used to package and run application services and infrastructure dependencies. | 29.8.1  |
| Docker Compose | Tool used to define and orchestrate multi-container local development environments.                     | 5.5.1   |

## API & Documentation

| Technology   | Description                                                                                                             | Version |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | ------- |
| OpenAPI      | Specification used to define and document HTTP API contracts between services and clients.                              | 3.2.1   |
| Scalar       | Interactive API documentation interface used to visualize and explore OpenAPI specifications.                           | 1.72.1  |
| AsyncAPI     | Specification used to define and document asynchronous messaging and event-driven contracts.                            | 3.1.0   |
| EventCatalog | Documentation platform used to organize and document domains, services, messages, events and event-driven architecture. | 4.10.10 |

## End-to-End Testing

| Technology | Description                                                                                                            | Version |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- | ------- |
| Playwright | End-to-end testing framework used to validate complete user workflows across the web application and backend services. | 1.63.0  |
