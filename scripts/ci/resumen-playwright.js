// Escribe en formato Markdown el resumen de Playwright + Cucumber para el "Job Summary" de GitHub Actions
const fs = require("fs");
const navegador = process.argv[2] || "chrome";
const archivo = "test-results/reports/cucumber-report.json";
if (!fs.existsSync(archivo)) {
    console.log(`### UI · Playwright (${navegador})\n\n:warning: No se generó el reporte (la ejecución no llegó a correr las pruebas).`);
    process.exit(0);
}
const features = JSON.parse(fs.readFileSync(archivo, "utf-8"));
// Con reintentos, un escenario puede aparecer más de una vez: se considera el último intento
const escenarios = new Map();
for (const f of features) {
    for (const el of f.elements || []) {
        if (el.type !== "scenario") continue;
        const estados = (el.steps || []).map(s => s.result.status);
        const estado = estados.includes("failed") ? "failed" : estados.every(s => s === "passed") ? "passed" : "skipped";
        escenarios.set(`${f.uri}:${el.line}:${el.name}`, { feature: f.name, nombre: el.name, estado });
    }
}
const lista = [...escenarios.values()];
const ok = lista.filter(e => e.estado === "passed").length;
const ko = lista.filter(e => e.estado === "failed");
console.log(`### ${ko.length ? ":x:" : ":white_check_mark:"} UI · Playwright (${navegador})\n`);
console.log("| Escenarios | OK | Fallidos |");
console.log("|---|---|---|");
console.log(`| ${lista.length} | ${ok} | ${ko.length} |\n`);
if (ko.length) {
    console.log("**Escenarios fallidos** (ver el trace en el artefacto):\n");
    ko.forEach(e => console.log(`- ${e.feature} › ${e.nombre}`));
}
