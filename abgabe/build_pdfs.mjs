// Wandelt die Abgabe-Entwürfe (abgabe/*.md) in schlichte PDFs mit den geforderten Dateinamen um.
// Ablauf: Markdown → HTML (marked im Browser) → Mermaid-Diagramme rendern → Playwright-Chromium page.pdf().
// Die Mermaid-Diagramme werden zusätzlich als SVG nach abgabe/diagramme/ geschrieben.
// Aufruf aus dem Projektordner: node abgabe/build_pdfs.mjs   (braucht Netz für die CDN-Skripte und `npx playwright install chromium`)
// Die Namen der Hauptverantwortlichen stehen in OWNERS und stammen aus Präsentation 1 (Folie 5); vom Team zu bestätigen.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const ABGABE = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.dirname(ABGABE);
const OUT = path.join(ABGABE, 'pdf');
const DIAGRAMS = path.join(ABGABE, 'diagramme');
const BUILD = path.join(OUT, '.build');

const REPO_URL = 'https://github.com/Paulo-Temme/SportMate';
const LIVE_URL = 'https://sportmate-gamma.vercel.app';
const MARKED = 'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js';
const MERMAID = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.1/dist/mermaid.min.js';

/** Hauptverantwortliche je Bereich (Präsentation 1, Folie 5). Bei Änderung hier anpassen. */
const OWNERS = { requirements: 'Julien', design: 'Renat', implementation: 'Paulo', testing: 'Niklas', management: 'Niklas', feedback: 'Julien', installation: 'Paulo' };

/** Dokumente: Quelle, Titel für die Fußzeile, Zielpfad relativ zu abgabe/pdf. */
const DOCUMENTS = [
  { key: 'requirements', title: 'Anforderungen', target: (o) => `${o}_requirements.pdf` },
  { key: 'design', title: 'Architektur und Entwurf', target: (o) => `${o}_design.pdf` },
  { key: 'implementation', title: 'Implementierung', target: (o) => `${o}_implementation/${o}_implementation.pdf` },
  { key: 'installation', title: 'Lauffähige Software', target: (o) => `${o}_installation.pdf` },
  { key: 'testing', title: 'Testen', target: (o) => `${o}_testing.pdf` },
  { key: 'management', title: 'Management', target: (o) => `${o}_management.pdf` },
  { key: 'feedback', title: 'Feedback-Dokumentation', target: (o) => `${o}_feedback.pdf` },
];

const STYLE = `
  @page { size: A4; margin: 18mm 16mm 20mm 16mm; }
  :root { --ink: #1d1f23; --ink-2: #555b63; --line: #d9d7d0; --accent: #c2431f; --soft: #f5f4f0; }
  html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; color: var(--ink); background: #fff;
         font-size: 10pt; line-height: 1.45; margin: 0; }
  h1 { font-size: 24pt; margin: 30mm 0 10mm; line-height: 1.15; border-bottom: 3px solid var(--accent); padding-bottom: 4mm; }
  h2 { font-size: 15pt; margin: 9mm 0 3mm; padding-bottom: 1.5mm; border-bottom: 1px solid var(--line); break-after: avoid; }
  h3 { font-size: 12pt; margin: 6mm 0 2mm; break-after: avoid; }
  h4, h5 { font-size: 10.5pt; margin: 4mm 0 1.5mm; break-after: avoid; }
  p, li { orphans: 3; widows: 3; }
  a { color: var(--accent); text-decoration: none; }
  code { font-family: Consolas, "Cascadia Mono", monospace; font-size: 8.6pt; background: var(--soft); padding: 0 2px; border-radius: 2px; }
  pre { background: var(--soft); border: 1px solid var(--line); border-radius: 4px; padding: 3mm; overflow-wrap: anywhere;
        white-space: pre-wrap; font-size: 8.4pt; break-inside: avoid; }
  pre code { background: none; padding: 0; }
  table { border-collapse: collapse; width: 100%; margin: 2mm 0 4mm; font-size: 8.4pt; }
  th, td { border: 1px solid var(--line); padding: 1.2mm 1.6mm; vertical-align: top; text-align: left; overflow-wrap: break-word; }
  td code { overflow-wrap: anywhere; }
  th { background: var(--soft); font-weight: 600; }
  tr { break-inside: avoid; }
  thead:has(th:empty:first-child + th:empty:last-child) { display: none; }
  img { max-width: 100%; }
  .screens img { max-height: 120mm; }
  blockquote { margin: 2mm 0; padding: 1mm 4mm; border-left: 3px solid var(--line); color: var(--ink-2); }
  .mermaid { margin: 3mm 0 5mm; text-align: center; break-inside: avoid; }
  .mermaid svg { max-width: 100% !important; height: auto; max-height: 235mm; }
  .pagebreak { break-after: page; }
  .diagram-error { color: var(--accent); font-size: 8pt; }
`;

function buildHtml(markdown, baseHref) {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><base href="${baseHref}">
<style>${STYLE}</style>
<script src="${MARKED}"></script><script src="${MERMAID}"></script></head>
<body><main id="content"></main>
<script id="source" type="application/json">${JSON.stringify(markdown).replace(/</g, '\\u003c')}</script>
<script>
(async () => {
  try {
    const markdown = JSON.parse(document.getElementById('source').textContent);
    document.getElementById('content').innerHTML = marked.parse(markdown, { gfm: true });
    const blocks = [...document.querySelectorAll('pre > code.language-mermaid')];
    blocks.forEach((code) => {
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code.textContent;
      code.parentElement.replaceWith(div);
    });
    mermaid.initialize({ startOnLoad: false, theme: 'neutral', flowchart: { htmlLabels: false }, sequence: { wrap: true, noteMargin: 10 }, fontFamily: 'Segoe UI, Arial, sans-serif' });
    for (const div of document.querySelectorAll('.mermaid')) {
      try { await mermaid.run({ nodes: [div] }); }
      catch (error) { div.insertAdjacentHTML('beforeend', '<p class="diagram-error">Diagramm konnte nicht gerendert werden: ' + String(error.message || error) + '</p>'); }
    }
    await Promise.all([...document.images].map((img) => img.complete ? null : new Promise((r) => { img.onload = img.onerror = r; })));
    window.__renderResult = { ok: true };
  } catch (error) {
    window.__renderResult = { ok: false, message: String(error) };
  }
})();
</script></body></html>`;
}

function footer(title) {
  return `<div style="font-size:7.5pt;color:#777;width:100%;padding:0 16mm;display:flex;justify-content:space-between;">
  <span>SportMate · ${title} · Entwurf</span><span>Seite <span class="pageNumber"></span> von <span class="totalPages"></span></span></div>`;
}

function archive(target, paths) {
  execFileSync('git', ['archive', '--format=zip', '-o', target, 'HEAD', ...paths], { cwd: REPO });
}

async function main() {
  rmSync(BUILD, { recursive: true, force: true });
  mkdirSync(BUILD, { recursive: true });
  mkdirSync(DIAGRAMS, { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const results = [];
  for (const document of DOCUMENTS) {
    const owner = OWNERS[document.key];
    const markdown = readFileSync(path.join(ABGABE, `${document.key}.md`), 'utf8');
    const htmlPath = path.join(BUILD, `${document.key}.html`);
    writeFileSync(htmlPath, buildHtml(markdown, pathToFileURL(ABGABE + path.sep).href));
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__renderResult !== undefined, null, { timeout: 60_000 });
    const result = await page.evaluate(() => window.__renderResult);
    if (!result.ok) throw new Error(`${document.key}: ${result.message}`);
    const svgs = await page.$$eval('.mermaid svg', (nodes) => nodes.map((node) => node.outerHTML));
    const errors = await page.$$eval('.diagram-error', (nodes) => nodes.map((node) => node.textContent));
    svgs.forEach((svg, index) => {
      const name = `${document.key}-${String(index + 1).padStart(2, '0')}.svg`;
      const standalone = svg.includes('xmlns=') ? svg : svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
      writeFileSync(path.join(DIAGRAMS, name), standalone);
    });
    const target = path.join(OUT, document.target(owner));
    mkdirSync(path.dirname(target), { recursive: true });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: target, format: 'A4', printBackground: true, displayHeaderFooter: true,
      headerTemplate: '<span></span>', footerTemplate: footer(document.title),
      margin: { top: '18mm', bottom: '20mm', left: '16mm', right: '16mm' } });
    results.push({ document: document.key, target: path.relative(ABGABE, target), diagrams: svgs.length, errors });
  }
  await browser.close();

  const implementation = path.join(OUT, `${OWNERS.implementation}_implementation`);
  const testing = path.join(OUT, `${OWNERS.testing}_testing`);
  mkdirSync(testing, { recursive: true });
  const commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: REPO }).toString().trim();
  const links = `Repository: ${REPO_URL} (Branch develop)\nLive-App: ${LIVE_URL}\nQuellcode-Stand im Archiv: Commit ${commit}\n`;
  writeFileSync(path.join(implementation, 'REPOSITORY.txt'), links);
  writeFileSync(path.join(OUT, 'LINKS.txt'), links);
  for (const folder of [implementation, testing]) {
    for (const file of readdirSync(folder)) if (/^SportMate-(quellcode|testcode)-.*\.zip$/.test(file)) rmSync(path.join(folder, file));
  }
  archive(path.join(implementation, `SportMate-quellcode-${commit}.zip`), []);
  archive(path.join(testing, `SportMate-testcode-${commit}.zip`), ['e2e', 'tests', 'vitest.config.mts', 'playwright.config.ts']);
  rmSync(BUILD, { recursive: true, force: true });

  for (const result of results) {
    console.log(`${result.target}: ${result.diagrams} Diagramme${result.errors.length ? `, FEHLER: ${result.errors.join(' | ')}` : ''}`);
  }
  console.log(`Quellcode- und Testcode-Archiv aus Commit ${commit} (nur committeter Stand).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
