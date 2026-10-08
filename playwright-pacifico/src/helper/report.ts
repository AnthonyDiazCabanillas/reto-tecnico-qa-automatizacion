import * as os from "os";
const report = require("multiple-cucumber-html-reporter");

const navegadores: Record<string, string> = { chrome: "chrome", firefox: "firefox", webkit: "safari" };
const plataformas: Record<string, string> = { win32: "windows", darwin: "osx", linux: "linux" };

report.generate({
    jsonDir: "test-results/reports",
    reportPath: "test-results/reports/",
    reportName: "Automatización SauceDemo - Playwright + Cucumber",
    pageTitle: "Reporte de ejecución",
    displayDuration: true,
    metadata: {
        browser: { name: navegadores[process.env.BROWSER || "chrome"] || "chrome", version: "Playwright" },
        device: process.env.CI ? "GitHub Actions" : os.hostname(),
        platform: { name: plataformas[os.platform()] || os.platform(), version: os.release() }
    },
    customData: {
        title: "Información de la ejecución",
        data: [
            { label: "Proyecto", value: "SauceDemo" },
            { label: "Entorno", value: process.env.ENV || "dev" },
            { label: "Navegador", value: process.env.BROWSER || "chrome" },
            { label: "Fecha", value: new Date().toLocaleString("es-PE") }
        ]
    }
});
