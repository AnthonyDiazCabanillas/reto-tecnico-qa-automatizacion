# Automatización Front-End – SauceDemo (Playwright + Cucumber)

Automatización de **SauceDemo** (https://www.saucedemo.com) con **Playwright**, **Cucumber** (BDD, Gherkin en español) y el patrón **Page Object Model**, construida sobre el framework base del reto.

## Requisitos
- Node.js 18 o superior
- Java 17 (solo para el reporte Allure)

## Instalación
```bash
npm ci
npx playwright install
```

## Configuración por entorno
`src/helper/env/.env.dev` y `src/helper/env/.env.uat`:
```
BASEURL = https://www.saucedemo.com/
```

| Variable | Uso | Por defecto |
|---|---|---|
| `HEADLESS` | `true` / `false` | `true` en CI, `false` en local |
| `RETRY` | Reintentos por escenario fallido | `1` en CI, `0` en local |

## Ejecución
| Comando | Qué ejecuta |
|---|---|
| `npm run test-dev` | Suite completa en Chrome (entorno dev) |
| `npm run test-uat` | Suite completa en Chrome (entorno uat) |
| `npm run test-firefox` / `npm run test-webkit` | Suite completa en Firefox / WebKit |
| `npm run test-login` | Login exitoso y no exitoso (`@login`) |
| `npm run test-carrito` | Agregar productos al carrito (`@carrito`) |
| `npm run test-checkout` | Checkout completo y validaciones (`@checkout`) |

Por cualquier tag: `npm run test-dev --tags="@checkout_completo"`

### Ver la ejecución
| Comando | Para qué |
|---|---|
| `npm run test-visual` | Navegador visible en **cámara lenta** (700 ms entre acciones) |
| `npm run test-debug` | **Playwright Inspector**: avanza acción por acción y resalta cada elemento |
| `npm run test-trace` | Guarda el **trace de todos** los escenarios para reproducirlos con `npx playwright show-trace` |

Se combinan con tags: `npm run test-visual --tags="@checkout_completo"`

## Reportes
| Reporte | Ubicación |
|---|---|
| Cucumber HTML (captura por paso) | `test-results/reports/cucumber-report.html` |
| Multiple Cucumber HTML Reporter | `test-results/reports/index.html` |
| **PDF de evidencias** (portada, índice y captura por paso) | `test-results/reports/evidencias.pdf` |
| Allure | `npm run allure-report` |
| Trace de escenarios fallidos | `test-results/traces/*.zip` → `npx playwright show-trace <archivo>` |

Los reportes se generan automáticamente al terminar una ejecución exitosa. Tras una ejecución con fallos: `npm run reportes`.

## Estructura
```
config/cucumber.js                  Configuración de Cucumber (rutas, formatos, reintentos)
src/features/saucedemo/             Escenarios en Gherkin
  01_login.feature                  Login exitoso (4 usuarios) y no exitoso (5 casos)
  02_carrito.feature                Agregar 1 producto (4 variantes) y varios productos
  03_checkout.feature               Checkout completo (2 compras) y datos incompletos (3 casos)
src/pages/saucedemo/                Page Objects (localizadores data-test + acciones)
  SauceLoginPage.ts | InventoryPage.ts | CartPage.ts | CheckoutPage.ts
src/step-definitions/saucedemo/     Implementación de los pasos Given/When/Then
src/hooks/hooks.ts                  Ciclo de vida del navegador, captura por paso y trace en fallos
src/helper/browsers/                Selección de navegador y modo headless
src/helper/env/                     Variables por entorno (.env.dev, .env.uat)
src/helper/report.ts                Multiple Cucumber HTML Reporter
src/helper/evidencias.js            Generador del PDF de evidencias
src/helper/allure-reporter.js       Integración con Allure
```

## Cobertura (19 escenarios)
| Feature | Escenarios | Validaciones principales |
|---|---|---|
| Login | 9 | Título "Products", mensajes de error exactos, permanencia en login |
| Carrito | 5 | Contador del carrito, nombre y precio en el carrito, cantidad de ítems |
| Checkout | 5 | Resumen, subtotal, Total = Subtotal + Tax, "Thank you for your order!", carrito vacío, errores de formulario |

## Robustez
- **Localizadores `data-test`** (los que SauceDemo expone para automatización), sin XPath absolutos.
- **Asserts con auto-wait** de Playwright (`toHaveText`, `toBeVisible`, `toHaveURL`); sin esperas fijas.
- **Reintento automático en CI** para absorber fallos de red del sitio público.
- **Trace de Playwright** solo de escenarios fallidos (DOM, red, consola y capturas paso a paso).
- **Captura tolerante a fallos**: un problema al tomar la evidencia nunca hace fallar la prueba.
- **Contexto de navegador aislado por escenario** (sin cookies ni carrito compartidos).
