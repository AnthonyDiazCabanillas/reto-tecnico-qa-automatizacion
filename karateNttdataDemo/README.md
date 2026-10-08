# Automatización de APIs – Karate

Pruebas de API con **Karate 1.2.0** (BDD), ejecutadas con **JUnit 5** y **Maven**, con reporte **Cucumber HTML**.

| API | Qué se prueba |
|---|---|
| [Swagger PetStore](https://petstore.swagger.io) | POST, GET, PUT, DELETE y 404 sobre `/pet` |
| [Restful Booker](https://restful-booker.herokuapp.com) | Token de autenticación, POST, GET, **PATCH**, PUT, DELETE y 404 sobre `/booking` |

## Requisitos
- Java 17
- Maven 3.8+

## Ejecución
```bash
mvn clean test                                        # toda la suite
mvn clean test -Dkarate.options="--tags @createPet"   # por tag
mvn clean test -Dkarate.env="dev"                     # por entorno
mvn clean test -Dthreads=1                            # hilos (por defecto 3)
```
> En PowerShell, entre comillas: `mvn clean test "-Dkarate.options=--tags @createPet"`

## Reportes
| Reporte | Ubicación |
|---|---|
| Karate | `target/karate-reports/karate-summary.html` |
| Cucumber HTML | `target/cucumber-html-reports/overview-features.html` |

## Estructura
```
pom.xml                                   Dependencias (Karate 1.2.0, JUnit 5.10.0, Surefire 2.22.2, cucumber-reporting)
src/test/java/karate-config.js            Configuración global: URLs, credenciales, timeouts, reintentos
src/test/java/karate/runner/TestRunner.java   Runner en paralelo + generación del reporte Cucumber
src/test/java/resources/
  features/createPetStore.feature         POST /pet (Scenario Outline)
  features/getPet.feature                 GET /pet/{id}, GET /pet/findByStatus, 404
  features/updatePet.feature              PUT /pet (Scenario Outline)
  features/booking.feature                Token, PATCH, PUT, GET, DELETE y 404 en reservas
  features/common/*.feature               Helpers reutilizables (@ignore): crear mascota, crear reserva, token
  request/*.json                          Cuerpos de petición
  schemas/*.json                          Esquemas de respuesta (validación de estructura)
```

## Escenarios
| Tag | Escenario | Método |
|---|---|---|
| `@createPet` | Crear mascota (3 combinaciones de nombre/estado/categoría) | POST |
| `@getPet` | Obtener mascota por id y validar esquema | GET |
| `@findByStatus` | Listar por estado (available, pending, sold) | GET |
| `@petNotFound` | Mascota eliminada → 404 "Pet not found" | DELETE + GET |
| `@updatePet` | Actualizar nombre y estado (2 combinaciones) y verificar con GET | PUT + GET |
| `@token` | Token con credenciales válidas / inválidas | POST |
| `@patchBooking` | Actualización parcial (3 variantes) y PATCH sin token → 403 | PATCH |
| `@putBooking` | Reemplazo completo de una reserva | PUT |
| `@getBooking` | Consultar reserva y comparar con la creada | GET |
| `@bookingNotFound` | Reserva eliminada → 404 | DELETE + GET |

## Robustez
- **Datos únicos por ejecución** (ids aleatorios): no hay choques con otros usuarios de las APIs públicas.
- **Cada escenario crea sus propios datos** mediante helpers reutilizables (`call`), sin depender de datos preexistentes.
- **`retry until`** para la consistencia eventual de PetStore (un GET justo después de un POST puede devolver 404).
- **Validación de esquema** de las respuestas (`schemas/*.json`) además de los valores.
- **Token obtenido una sola vez por feature** (`callonce`).
- **Timeouts** configurados para APIs lentas.
