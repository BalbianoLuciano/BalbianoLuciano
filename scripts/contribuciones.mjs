// Genera assets/contribuciones.svg con las contribuciones del ultimo anio de las
// dos cuentas, la personal y la de trabajo, sumadas dia por dia. Los datos son
// publicos: no hace falta token.
//
// El calendario de GitHub reparte los verdes en cuartos lineales: con un dia de
// 115 comits, uno de 21 queda del mismo tono que uno de 2. Aca la escala es
// logaritmica, y debajo van barras por semana, que si son lineales: muestran
// cuanto pesa cada semana de verdad.
import { writeFile, mkdir } from 'node:fs/promises';

const CUENTAS = (process.env.CUENTAS ?? 'BalbianoLuciano,InvisibleGeeksBalbiano').split(',');
const CELDA = 15;
const SEPARACION = 4;
const PASO = CELDA + SEPARACION;
const MARGEN = 28;
// Alturas del bloque de arriba: etiqueta, numero, regla, meses, grid y barras.
const Y_ETIQUETA = 40;
const Y_NUMERO = 122;
const Y_REGLA = 148;
const Y_MESES = 176;
const Y_GRID = 186;
const ALTO_BARRAS = 64;
const SEMANAS = 53;

// Escala de GitHub en oscuro. El 0 es el hueco, no el cero.
const VERDES = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const FONDO = '#0d1117';
const LINEA = '#30363d';
const TEXTO = '#e6edf3';
const APAGADO = '#7d8590';
const MESES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const nivel = (n, max) => {
  if (n === 0) return 0;
  // Logaritmica: con un maximo de 115, 2 comits es el primer verde, 21 el
  // tercero y 60 el ultimo. Los cuartos lineales los dejaban a todos abajo.
  return Math.max(1, Math.min(4, Math.ceil((4 * Math.log(n + 1)) / Math.log(max + 1))));
};

const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));
const miles = (n) => n.toLocaleString('en-US');

const pedir = (cuenta) =>
  fetch(`https://github-contributions-api.jogruber.de/v4/${cuenta}?y=last`).then((r) => {
    if (!r.ok) throw new Error(`la API respondio ${r.status} para ${cuenta}`);
    return r.json();
  });

const respuestas = await Promise.all(CUENTAS.map(pedir));

// Se suma por fecha: las dos cuentas cubren el mismo anio, pero no se asume
// que vengan alineadas.
const porFecha = new Map();
const totales = [];
respuestas.forEach((datos, i) => {
  const lista = datos.contributions ?? [];
  if (lista.length === 0) throw new Error(`la API no devolvio dias para ${CUENTAS[i]}`);
  totales.push(datos.total?.lastYear ?? lista.reduce((a, d) => a + d.count, 0));
  for (const d of lista) porFecha.set(d.date, (porFecha.get(d.date) ?? 0) + d.count);
});

const dias = [...porFecha.entries()]
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([date, count]) => ({ date, count }));
const total = totales.reduce((a, n) => a + n, 0);
const max = Math.max(...dias.map((d) => d.count));
const activos = dias.filter((d) => d.count > 0).length;

// El grid arranca en domingo, como en GitHub: la primera columna se completa
// con huecos si el anio no empieza justo ahi.
const primero = new Date(`${dias[0].date}T00:00:00Z`);
const relleno = primero.getUTCDay();
const celdas = [...Array.from({ length: relleno }, () => null), ...dias];
const semanas = Math.min(SEMANAS, Math.ceil(celdas.length / 7));
const ancho = MARGEN * 2 + semanas * PASO - SEPARACION;

const porSemana = Array.from({ length: semanas }, (_, s) =>
  celdas.slice(s * 7, s * 7 + 7).reduce((a, d) => a + (d?.count ?? 0), 0),
);
const mejorSemana = Math.max(...porSemana);

let grid = '';
let etiquetas = '';
let barras = '';
let mesPrevio = -1;
const Y_BARRAS = Y_GRID + 7 * PASO + 18;
for (let s = 0; s < semanas; s++) {
  const x = MARGEN + s * PASO;
  for (let d = 0; d < 7; d++) {
    const dia = celdas[s * 7 + d];
    if (!dia) continue;
    const y = Y_GRID + d * PASO;
    grid += `<rect x="${x}" y="${y}" width="${CELDA}" height="${CELDA}" rx="2" fill="${VERDES[nivel(dia.count, max)]}"><title>${dia.date}: ${dia.count}</title></rect>`;
    if (d === 0) {
      const mes = new Date(`${dia.date}T00:00:00Z`).getUTCMonth();
      if (mes !== mesPrevio) {
        mesPrevio = mes;
        etiquetas += `<text x="${x}" y="${Y_MESES}" fill="${APAGADO}" font-size="11" font-family="${MONO}" letter-spacing="1.4">${MESES[mes].toUpperCase()}</text>`;
      }
    }
  }
  const altoBarra = porSemana[s] === 0 ? 0 : Math.max(2, Math.round((porSemana[s] / mejorSemana) * ALTO_BARRAS));
  barras += `<rect x="${x}" y="${Y_BARRAS + ALTO_BARRAS - altoBarra}" width="${CELDA}" height="${altoBarra}" rx="2" fill="${VERDES[3]}"><title>${porSemana[s]} in the week</title></rect>`;
}

const Y_BASE = Y_BARRAS + ALTO_BARRAS;
const alto = Y_BASE + MARGEN + 12;
const desde = dias[0].date;
const hasta = dias[dias.length - 1].date;
const desglose = CUENTAS.map((c, i) => `@${esc(c).toUpperCase()} ${miles(totales[i])}`).join('  ·  ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${esc(miles(total))} contribuciones en el ultimo anio, sumando ${esc(CUENTAS.join(' y '))}">
<rect width="${ancho}" height="${alto}" fill="${FONDO}"/>
<text x="${MARGEN}" y="${Y_ETIQUETA}" fill="${APAGADO}" font-size="12" font-family="${MONO}" letter-spacing="2.2">PERSONAL + WORK ACCOUNTS</text>
<text x="${MARGEN}" y="${Y_NUMERO}" fill="${TEXTO}" font-size="76" font-weight="700" font-family="${MONO}" letter-spacing="-2">${miles(total)}</text>
<text x="${MARGEN + 250}" y="${Y_NUMERO - 22}" fill="${APAGADO}" font-size="13" font-family="${MONO}" letter-spacing="2.2">CONTRIBUTIONS</text>
<text x="${MARGEN + 250}" y="${Y_NUMERO}" fill="${APAGADO}" font-size="13" font-family="${MONO}" letter-spacing="2.2">IN THE LAST YEAR</text>
<text x="${ancho - MARGEN}" y="${Y_NUMERO - 22}" fill="${TEXTO}" font-size="13" text-anchor="end" font-family="${MONO}" letter-spacing="2.2">${activos} ACTIVE DAYS</text>
<text x="${ancho - MARGEN}" y="${Y_NUMERO}" fill="${APAGADO}" font-size="11" text-anchor="end" font-family="${MONO}" letter-spacing="1.4">${desglose}</text>
<line x1="${MARGEN}" y1="${Y_REGLA}" x2="${ancho - MARGEN}" y2="${Y_REGLA}" stroke="${LINEA}" stroke-width="1"/>
${etiquetas}${grid}
<line x1="${MARGEN}" y1="${Y_BASE + 0.5}" x2="${ancho - MARGEN}" y2="${Y_BASE + 0.5}" stroke="${LINEA}" stroke-width="1"/>
${barras}
<text x="${MARGEN}" y="${alto - 12}" fill="${APAGADO}" font-size="11" font-family="${MONO}" letter-spacing="1.4">${desde} → ${hasta}  ·  BARS: CONTRIBUTIONS PER WEEK</text>
<text x="${ancho - MARGEN}" y="${alto - 12}" fill="${APAGADO}" font-size="11" text-anchor="end" font-family="${MONO}" letter-spacing="1.4">BEST WEEK ${mejorSemana}  ·  MAX ${max} IN A DAY</text>
</svg>
`;

await mkdir('assets', { recursive: true });
await writeFile('assets/contribuciones.svg', svg);
console.log(`assets/contribuciones.svg — ${total} contribuciones, ${activos} dias activos, maximo ${max}, mejor semana ${mejorSemana}`);
