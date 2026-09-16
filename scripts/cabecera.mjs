// Renderiza scripts/cabecera.html a assets/cabecera.png, al doble.
// Hace falta correrlo en local: el kit de Typekit de Dharma esta restringido
// por dominio y solo carga desde 127.0.0.1 o localhost.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { chromium } from '/Users/lucianobalbiano/Documents/PersonalRepos/gridwright/node_modules/.pnpm/playwright@1.62.1/node_modules/playwright/index.mjs';

const html = await readFile(new URL('./cabecera.html', import.meta.url));
const server = createServer((_, res) => res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(html));
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = server.address();

const navegador = await chromium.launch({ channel: 'chrome' });
const pagina = await navegador.newPage({ viewport: { width: 1280, height: 320 }, deviceScaleFactor: 2 });
await pagina.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
await pagina.waitForTimeout(600);

const dharma = await pagina.evaluate(() => document.fonts.check("700 132px 'dharma-gothic-e'"));
if (!dharma) throw new Error('Dharma no cargo: la cabecera saldria con la tipografia de respaldo');

await pagina.screenshot({ path: 'assets/cabecera.png' });
await navegador.close();
server.close();
console.log('assets/cabecera.png listo');
