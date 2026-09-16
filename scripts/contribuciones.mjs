// Genera assets/contribuciones.svg con las contribuciones del ultimo anio de la
// cuenta de trabajo. Los datos son publicos: no hace falta token.
//
// El grafico de ghchart venia con fondo blanco y sin forma de tematizarlo. Este
// usa el verde de GitHub en oscuro, y pone adelante el numero, que es el dato.
import { writeFile, mkdir } from 'node:fs/promises';

const CUENTA = process.env.CUENTA ?? 'InvisibleGeeksBalbiano';
const CELDA = 15;
const SEPARACION = 4;
const PASO = CELDA + SEPARACION;
const MARGEN = 28;
// Alturas del bloque de arriba: etiqueta, numero, regla, meses y grid.
const Y_ETIQUETA = 40;
const Y_NUMERO = 122;
const Y_REGLA = 148;
const Y_MESES = 176;
const Y_GRID = 186;
const SEMANAS = 53;

// Escala de GitHub en oscuro. El 0 es el hueco, no el cero.
const VERDES = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const FONDO = '#0d1117';
const LINEA = '#30363d';
const TEXTO = '#e6edf3';
const APAGADO = '#7d8590';
const MESES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const nivel = (n, max) => {
  if (n === 0) return 0;
  // Cuartos del maximo real del anio: un dia de 43 comits no puede aplanar el resto.
  const q = Math.max(1, Math.ceil(max / 4));
  return Math.min(4, Math.ceil(n / q));
};

const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]));

const datos = await fetch(`https://github-contributions-api.jogruber.de/v4/${CUENTA}?y=last`)
  .then((r) => {
    if (!r.ok) throw new Error(`la API respondio ${r.status}`);
    return r.json();
  });

const dias = datos.contributions ?? [];
if (dias.length === 0) throw new Error('la API no devolvio dias');
const total = datos.total?.lastYear ?? dias.reduce((a, d) => a + d.count, 0);
const max = Math.max(...dias.map((d) => d.count));

// El grid arranca en domingo, como en GitHub: la primera columna se completa
// con huecos si el anio no empieza justo ahi.
const primero = new Date(`${dias[0].date}T00:00:00Z`);
const relleno = primero.getUTCDay();
const celdas = [...Array.from({ length: relleno }, () => null), ...dias];
const semanas = Math.min(SEMANAS, Math.ceil(celdas.length / 7));
const ancho = MARGEN * 2 + semanas * PASO - SEPARACION;

let grid = '';
let etiquetas = '';
let mesPrevio = -1;
for (let s = 0; s < semanas; s++) {
  for (let d = 0; d < 7; d++) {
    const dia = celdas[s * 7 + d];
    if (!dia) continue;
    const x = MARGEN + s * PASO;
    const y = Y_GRID + d * PASO;
    grid += `<rect x="${x}" y="${y}" width="${CELDA}" height="${CELDA}" fill="${VERDES[nivel(dia.count, max)]}"><title>${dia.date}: ${dia.count}</title></rect>`;
    if (d === 0) {
      const mes = new Date(`${dia.date}T00:00:00Z`).getUTCMonth();
      if (mes !== mesPrevio) {
        mesPrevio = mes;
        etiquetas += `<text x="${x}" y="${Y_MESES}" fill="${APAGADO}" font-size="11" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" letter-spacing="1.4">${MESES[mes].toUpperCase()}</text>`;
      }
    }
  }
}

const alto = Y_GRID + 7 * PASO + MARGEN + 12;
const desde = dias[0].date;
const hasta = dias[dias.length - 1].date;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}" viewBox="0 0 ${ancho} ${alto}" role="img" aria-label="${esc(total)} contribuciones en el ultimo anio en ${esc(CUENTA)}">
<rect width="${ancho}" height="${alto}" fill="${FONDO}"/>
<text x="${MARGEN}" y="${Y_ETIQUETA}" fill="${APAGADO}" font-size="12" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" letter-spacing="2.2">WORK ACCOUNT · @${esc(CUENTA).toUpperCase()}</text>
<text x="${MARGEN}" y="${Y_NUMERO}" fill="${TEXTO}" font-size="76" font-weight="700" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" letter-spacing="-2">${total.toLocaleString('en-US')}</text>
<text x="${MARGEN + 250}" y="${Y_NUMERO - 22}" fill="${APAGADO}" font-size="13" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" letter-spacing="2.2">CONTRIBUTIONS</text>
<text x="${MARGEN + 250}" y="${Y_NUMERO}" fill="${APAGADO}" font-size="13" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" letter-spacing="2.2">IN THE LAST YEAR</text>
<line x1="${MARGEN}" y1="${Y_REGLA}" x2="${ancho - MARGEN}" y2="${Y_REGLA}" stroke="${LINEA}" stroke-width="1"/>
${etiquetas}${grid}
<text x="${MARGEN}" y="${alto - 12}" fill="${APAGADO}" font-size="11" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" letter-spacing="1.4">${desde} → ${hasta}</text>
<text x="${ancho - MARGEN}" y="${alto - 12}" fill="${APAGADO}" font-size="11" text-anchor="end" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" letter-spacing="1.4">MAX ${max} IN A DAY</text>
</svg>
`;

await mkdir('assets', { recursive: true });
await writeFile('assets/contribuciones.svg', svg);
console.log(`assets/contribuciones.svg — ${total} contribuciones, maximo ${max}, ${dias.length} dias`);
