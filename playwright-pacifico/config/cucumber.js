module.exports = {
    default: {
        tags: process.env.npm_config_tags || "",
        formatOptions: {
            snippetInterface: "async-await"
        },
        paths: [
            "src/features/**/**/*.feature"
        ],
        dryRun: false,
        require: [
            "src/step-definitions/**/**/*.ts",
            "src/hooks/**/**/*.ts"
        ],
        requireModule: [
            "ts-node/register"
        ],
        format: [
            "progress-bar",
            "html:./test-results/reports/cucumber-report.html",
            "json:./test-results/reports/cucumber-report.json",
            "./src/helper/allure-reporter.js:./test-results/allure-formatter.log"
        ],
        // Reintentos: 1 en CI (sitios públicos pueden fallar por red), 0 en local. Se puede forzar con RETRY=n
        retry: Number(process.env.RETRY ?? (process.env.CI ? 1 : 0)),
        parallel: 1
    }
}
