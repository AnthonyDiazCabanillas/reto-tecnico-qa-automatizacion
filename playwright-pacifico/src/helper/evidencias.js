/**
 * Genera un PDF de evidencias a partir del reporte JSON de Cucumber.
 * Por cada escenario: estado, pasos (Given/When/Then) y la captura de pantalla de cada paso.
 *
 * Uso: npm run evidencias
 * Salida: test-results/reports/evidencias.pdf
 */
const fs = require("fs");
const path = require("path");
const { chromium } = require("@playwright/test");

const JSON_PATH = path.resolve("test-results/reports/cucumber-report.json");
const PDF_PATH = path.resolve("test-results/reports/evidencias.pdf");

const esc = (t = "") => String(t)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const limpiarAnsi = (t = "") => t.replace(/\u001b\[\d+m/g, "");
const segundos = (ns = 0) => (ns / 1e9).toFixed(1) + " s";

function estadoEscenario(pasos) {
    if (pasos.some(p => p.result.status === "failed")) return "failed";
    if (pasos.every(p => p.result.status === "passed")) return "passed";
    return "skipped";
}

const ETIQUETA = { passed: "PASÓ", failed: "FALLÓ", skipped: "OMITIDO", undefined: "SIN DEFINIR", pending: "PENDIENTE" };

function construirHtml(features) {
    const escenarios = [];
    for (const f of features) {
        for (const el of f.elements || []) {
            if (el.type !== "scenario") continue;
            const todos = el.steps || [];
            const pasos = todos.filter(s => !s.hidden && s.keyword && s.name !== undefined);
            const estado = estadoEscenario(todos);
            const duracion = todos.reduce((a, s) => a + (s.result.duration || 0), 0);
            escenarios.push({ feature: f.name, nombre: el.name, tags: (el.tags || []).map(t => t.name), pasos, estado, duracion });
        }
    }

    const total = escenarios.length;
    const ok = escenarios.filter(e => e.estado === "passed").length;
    const ko = escenarios.filter(e => e.estado === "failed").length;
    const fecha = new Date().toLocaleString("es-PE", { dateStyle: "long", timeStyle: "short" });
    const navegador = process.env.BROWSER || "chrome";
    const entorno = process.env.ENV || "dev";

    const indice = escenarios.map((e, i) => `
        <tr>
          <td>${i + 1}</td>
          <td>${esc(e.nombre)}</td>
          <td class="c">${e.pasos.length}</td>
          <td class="c">${segundos(e.duracion)}</td>
          <td class="c"><span class="badge ${e.estado}">${ETIQUETA[e.estado]}</span></td>
        </tr>`).join("");

    const detalle = escenarios.map((e, i) => {
        const pasos = e.pasos.map((p, j) => {
            const capturas = (p.embeddings || []).filter(x => (x.mime_type || "").startsWith("image/"));
            const img = capturas.length
                ? `<img src="data:${capturas[capturas.length - 1].mime_type};base64,${capturas[capturas.length - 1].data}">`
                : `<div class="sin-captura">${p.result.status === "skipped" ? "Sin captura (paso no ejecutado)" : "Sin captura disponible"}</div>`;
            const error = p.result.status === "failed" && p.result.error_message
                ? `<pre class="error">${esc(limpiarAnsi(p.result.error_message).split("\n").slice(0, 6).join("\n"))}</pre>` : "";
            return `
            <div class="paso">
              <div class="paso-cab">
                <span class="num">${i + 1}.${j + 1}</span>
                <span class="kw">${esc(p.keyword.trim())}</span>
                <span class="txt">${esc(p.name)}</span>
                <span class="badge ${p.result.status}">${ETIQUETA[p.result.status] || p.result.status}</span>
              </div>
              ${error}
              ${img}
            </div>`;
        }).join("");
        return `
        <section class="escenario">
          <div class="esc-cab">
            <div class="esc-num">Escenario ${i + 1} de ${total}</div>
            <h2>${esc(e.nombre)}</h2>
            <div class="meta">
              <span class="badge ${e.estado}">${ETIQUETA[e.estado]}</span>
              <span>Feature: ${esc(e.feature)}</span>
              <span>Duración: ${segundos(e.duracion)}</span>
            </div>
            <div class="tags">${e.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
          </div>
          ${pasos}
        </section>`;
    }).join("");

    return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 14mm 12mm; }
  * { box-sizing: border-box; }
  body { font-family: "Segoe UI", Arial, sans-serif; color: #1f2937; font-size: 10.5pt; margin: 0; }
  h1 { font-size: 22pt; margin: 0 0 4px; color: #111827; }
  h2 { font-size: 14pt; margin: 4px 0 6px; color: #111827; }
  .portada { padding: 30mm 4mm 0; page-break-after: always; }
  .sub { color: #6b7280; font-size: 11pt; margin-bottom: 18px; }
  .kpis { display: flex; gap: 10px; margin: 18px 0 22px; }
  .kpi { flex: 1; border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 12px; }
  .kpi b { display: block; font-size: 20pt; }
  .kpi.ok b { color: #15803d; } .kpi.ko b { color: #b91c1c; }
  .datos td { padding: 3px 12px 3px 0; } .datos td:first-child { color: #6b7280; }
  table.indice { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 9.5pt; }
  table.indice th { text-align: left; background: #f3f4f6; padding: 6px; border-bottom: 1px solid #d1d5db; }
  table.indice td { padding: 6px; border-bottom: 1px solid #e5e7eb; }
  .c { text-align: center; }
  .badge { display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 8pt; font-weight: 600; letter-spacing: .3px; }
  .badge.passed { background: #dcfce7; color: #166534; }
  .badge.failed { background: #fee2e2; color: #991b1b; }
  .badge.skipped, .badge.undefined, .badge.pending { background: #f3f4f6; color: #4b5563; }
  .escenario { page-break-before: always; }
  .esc-cab { border-bottom: 2px solid #111827; padding-bottom: 8px; margin-bottom: 10px; }
  .esc-num { color: #6b7280; font-size: 9pt; text-transform: uppercase; letter-spacing: .5px; }
  .meta { display: flex; gap: 14px; align-items: center; color: #4b5563; font-size: 9pt; }
  .tags { margin-top: 6px; } .tags span { font-size: 8pt; color: #4338ca; margin-right: 8px; }
  .paso { page-break-inside: avoid; margin: 0 0 12px; }
  .paso-cab { display: flex; gap: 6px; align-items: baseline; margin-bottom: 4px; }
  .num { color: #9ca3af; font-size: 8.5pt; min-width: 28px; }
  .kw { font-weight: 700; color: #7c3aed; }
  .txt { flex: 1; }
  .paso img { width: 100%; border: 1px solid #d1d5db; border-radius: 4px; }
  .sin-captura { color: #9ca3af; font-style: italic; font-size: 9pt; padding: 6px 0; }
  pre.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; padding: 6px; font-size: 8pt; white-space: pre-wrap; margin: 4px 0; }
</style></head><body>
  <div class="portada">
    <h1>Evidencias de ejecución</h1>
    <div class="sub">Automatización Front-End · Playwright + Cucumber · SauceDemo</div>
    <table class="datos">
      <tr><td>Fecha de generación</td><td>${esc(fecha)}</td></tr>
      <tr><td>Entorno</td><td>${esc(entorno)}</td></tr>
      <tr><td>Navegador</td><td>${esc(navegador)}</td></tr>
    </table>
    <div class="kpis">
      <div class="kpi"><b>${total}</b>Escenarios</div>
      <div class="kpi ok"><b>${ok}</b>Pasaron</div>
      <div class="kpi ko"><b>${ko}</b>Fallaron</div>
    </div>
    <table class="indice">
      <thead><tr><th>#</th><th>Escenario</th><th class="c">Pasos</th><th class="c">Duración</th><th class="c">Estado</th></tr></thead>
      <tbody>${indice}</tbody>
    </table>
  </div>
  ${detalle}
</body></html>`;
}

(async () => {
    if (!fs.existsSync(JSON_PATH)) {
        console.error(`No se encontró ${JSON_PATH}. Ejecuta primero las pruebas.`);
        process.exit(1);
    }
    const features = JSON.parse(fs.readFileSync(JSON_PATH, "utf-8"));
    const html = construirHtml(features);

    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    await page.pdf({
        path: PDF_PATH,
        format: "A4",
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: "<span></span>",
        footerTemplate: `<div style="font-size:8px;color:#9ca3af;width:100%;text-align:center;">
            Evidencias SauceDemo · Página <span class="pageNumber"></span> de <span class="totalPages"></span></div>`,
        margin: { top: "14mm", bottom: "16mm", left: "12mm", right: "12mm" }
    });
    await browser.close();
    console.log(`\nPDF de evidencias generado en: ${PDF_PATH}\n`);
})();
