import { After, AfterAll, AfterStep, Before, BeforeAll, ITestCaseHookParameter, Status, setDefaultTimeout } from "@cucumber/cucumber";
import * as fs from "fs";
import { invokeBrowser, isHeadless } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";

// Tiempo máximo por paso: 60 s (sin límite en modo debug, donde el Inspector pausa la ejecución)
setDefaultTimeout(process.env.PWDEBUG ? -1 : 60 * 1000);

const TRACES_DIR = "test-results/traces";

BeforeAll(async function () {
    getEnv();
    global.browser = await invokeBrowser();
});

Before(async function () {
    // Chrome con ventana: viewport null = usa el tamaño real de la ventana maximizada.
    // Headless / Firefox / WebKit: resolución fija Full HD para capturas consistentes.
    const maximizado = process.env.BROWSER === "chrome" && !isHeadless();
    global.context = await global.browser.newContext({ viewport: maximizado ? null : { width: 1920, height: 1080 } });
    // Trace de Playwright (DOM, red, consola y capturas) para diagnosticar fallos
    await global.context.tracing.start({ screenshots: true, snapshots: true, sources: true });
    global.page = await global.context.newPage();
});

After(async function ({ pickle, result }: ITestCaseHookParameter) {
    // En local, pausa de 2 s para ver la pantalla final antes de cerrar
    if (!isHeadless()) await global.page.waitForTimeout(2000);

    // Se guarda el trace de los escenarios fallidos (o de todos con TRACE=always)
    if (result?.status === Status.FAILED || process.env.TRACE === "always") {
        fs.mkdirSync(TRACES_DIR, { recursive: true });
        const nombre = pickle.name.replace(/[^a-zA-Z0-9-_]+/g, "_").slice(0, 80);
        const ruta = `${TRACES_DIR}/${nombre}_${Date.now()}.zip`;
        await global.context.tracing.stop({ path: ruta });
        await this.attach(`Trace: ${ruta}  (abrir con: npx playwright show-trace ${ruta})`, "text/plain");
    } else {
        await global.context.tracing.stop();
    }
    await global.page.close();
    await global.context.close();
});

AfterAll(async function () {
    await global.browser.close();
});

AfterStep(async function () {
    // Espera a que la página termine de cargar para que la captura sea útil como evidencia
    await global.page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => { });
    // La captura es evidencia: si falla (p. ej. ventana minimizada) no debe tumbar la prueba
    try {
        const img = await global.page.screenshot({ type: "png", timeout: 10000 });
        await this.attach(img, "image/png");
    } catch (e) {
        await this.attach("No se pudo tomar la captura de este paso: " + (e as Error).message.split("\n")[0], "text/plain");
    }
});
