# Reto técnico – Automatización QA

[![CI - Automatización QA](../../actions/workflows/ci.yml/badge.svg)](../../actions/workflows/ci.yml)

Dos proyectos de automatización construidos sobre los frameworks base del reto, con integración continua en **GitHub Actions**.

| Proyecto | Tipo | Stack | Alcance |
|---|---|---|---|
| [`karateNttdataDemo`](karateNttdataDemo) | API | Karate 1.2.0 · JUnit 5 · Maven | 19 escenarios: POST, GET, PUT, PATCH, DELETE, 404, Scenario Outline y token |
| [`playwright-pacifico`](playwright-pacifico) | UI | Playwright · Cucumber (BDD) · TypeScript · POM | 19 escenarios en SauceDemo: login, carrito y checkout |

## Integración continua
El workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) se ejecuta en cada push / pull request a `main`, de lunes a viernes a las 7:00 a. m. (hora de Lima) y manualmente desde la pestaña **Actions** (*Run workflow*).

| Job | Qué hace |
|---|---|
| **API · Karate** | Java 17 + Maven, ejecuta la suite en paralelo y publica el reporte Karate y el Cucumber HTML |
| **UI · Playwright** | Matriz de 3 navegadores (Chrome, Firefox, WebKit) en modo headless, con reintento automático; publica reporte HTML, **PDF de evidencias** y **trace** de los escenarios fallidos |

Cada ejecución muestra un **resumen de resultados** en la página del workflow y deja los reportes como **artefactos descargables**.

## Ejecución local
Ver el README de cada proyecto:
- [Karate](karateNttdataDemo/README.md)
- [Playwright](playwright-pacifico/README.md)
