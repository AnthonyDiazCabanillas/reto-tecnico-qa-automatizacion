// Formateador de Cucumber que genera resultados para Allure en ./allure-results
const { CucumberJSAllureFormatter, AllureRuntime } = require("allure-cucumberjs");

function AllureReporter(options) {
    return new CucumberJSAllureFormatter(
        options,
        new AllureRuntime({ resultsDir: "./allure-results" }),
        {
            labels: [
                { pattern: [/@feature:(.*)/], name: "feature" },
                { pattern: [/@severity:(.*)/], name: "severity" }
            ]
        }
    );
}
AllureReporter.prototype = Object.create(CucumberJSAllureFormatter.prototype);
AllureReporter.prototype.constructor = AllureReporter;

exports.default = AllureReporter;
