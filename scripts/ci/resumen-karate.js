// Escribe en formato Markdown el resumen de Karate para el "Job Summary" de GitHub Actions
const fs = require("fs");
const archivo = "target/karate-reports/karate-summary-json.txt";
if (!fs.existsSync(archivo)) {
    console.log("### API · Karate\n\n:warning: No se generó el resumen (la ejecución no llegó a correr las pruebas).");
    process.exit(0);
}
const r = JSON.parse(fs.readFileSync(archivo, "utf-8"));
const ok = r.scenariosfailed === 0;
console.log(`### ${ok ? ":white_check_mark:" : ":x:"} API · Karate ${r.version}\n`);
console.log("| Escenarios OK | Escenarios fallidos | Features | Hilos | Tiempo |");
console.log("|---|---|---|---|---|");
console.log(`| ${r.scenariosPassed} | ${r.scenariosfailed} | ${r.featuresPassed + r.featuresFailed} | ${r.threads} | ${(r.elapsedTime / 1000).toFixed(1)} s |\n`);
const fallidos = (r.featureSummary || []).filter(f => f.failed);
if (fallidos.length) {
    console.log("**Features con fallos:**\n");
    fallidos.forEach(f => console.log(`- ${f.relativePath || f.name}`));
}
