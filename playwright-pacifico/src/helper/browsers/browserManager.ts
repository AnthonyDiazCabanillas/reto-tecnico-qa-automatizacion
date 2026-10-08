import { chromium, firefox, webkit, LaunchOptions } from "@playwright/test";

/**
 * Modo headless:
 *  - HEADLESS=true/false lo fuerza.
 *  - Si no se indica, es headless en CI (GitHub Actions define CI=true) y con ventana en local.
 */
export const isHeadless = (): boolean =>
    process.env.HEADLESS ? process.env.HEADLESS === "true" : !!process.env.CI;

export const invokeBrowser = () => {
    const headless = isHeadless();
    const options: LaunchOptions = {
        headless,
        // SLOWMO=500 -> espera 500 ms entre cada acción para ver la ejecución "en cámara lenta"
        slowMo: Number(process.env.SLOWMO || 0),
        args: ["--ignore-certificate-errors"]
    };
    const browserType = process.env.BROWSER || "";
    switch (browserType) {
        case "chrome":
            // En local se abre maximizado (requiere viewport: null en el contexto, ver hooks.ts)
            return chromium.launch({
                ...options,
                args: headless ? options.args : [...options.args!, "--start-maximized"]
            });
        case "firefox":
            return firefox.launch(options);
        case "webkit":
            return webkit.launch(options);
        default:
            throw new Error(`BROWSER inválido: "${browserType}". Use chrome, firefox o webkit`);
    }
}
