// Genera las insignias del README: los botones de los proyectos y los chips del
// stack. Manual de marca: bloques cuadrados, hormigon y vacio, mono en caja
// alta, y baranda una sola vez (el portfolio). Nada de logos ajenos.
import { writeFile, mkdir, rm } from 'node:fs/promises';

const HORMIGON = '#a8a49b';
const LUZ = '#c6c2b8';
const VACIO = '#15130f';
const BARANDA = '#2f5568';
const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

// La mono avanza parejo: 0.6 em por caracter, mas el tracking.
const ancho = (texto, tam, track) => texto.length * (tam * 0.6 + track);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const boton = ({ texto, flecha = true, fondo = HORMIGON, tinta = VACIO }) => {
  const TAM = 12, TRACK = 1.7, ALTO = 34, PAD = 15;
  const t = texto.toUpperCase();
  const w = Math.round(ancho(t, TAM, TRACK) + PAD * 2 + (flecha ? 16 : 0));
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${ALTO}" viewBox="0 0 ${w} ${ALTO}" role="img" aria-label="${t}">
<rect width="${w}" height="${ALTO}" fill="${fondo}"/>
<text x="${PAD}" y="22" fill="${tinta}" font-family="${MONO}" font-size="${TAM}" font-weight="500" letter-spacing="${TRACK}">${t}</text>
${flecha ? `<path d="M${w - PAD - 9} 16 h9 v9 M${w - PAD - 9} 25 l9 -9" fill="none" stroke="${tinta}" stroke-width="1.3"/>` : ''}
</svg>`;
};

const chip = (texto) => {
  const TAM = 11, TRACK = 1.5, ALTO = 28, PAD = 12;
  const t = texto.toUpperCase();
  const w = Math.round(ancho(t, TAM, TRACK) + PAD * 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${ALTO}" viewBox="0 0 ${w} ${ALTO}" role="img" aria-label="${t}">
<rect x="0.5" y="0.5" width="${w - 1}" height="${ALTO - 1}" fill="none" stroke="${HORMIGON}" stroke-width="1"/>
<text x="${PAD}" y="18" fill="${LUZ}" font-family="${MONO}" font-size="${TAM}" letter-spacing="${TRACK}">${t}</text>
</svg>`;
};

const BOTONES = [
  { nombre: 'gridwright', texto: 'Gridwright · repo' },
  { nombre: 'hornero', texto: 'Hornero · live' },
  { nombre: 'prolicht', texto: 'Prolicht · live' },
  { nombre: 'zorro-gris', texto: 'El Zorro Gris · live' },
  { nombre: 'malmberg', texto: 'Malmberg.nl · live' },
  { nombre: 'autofill', texto: 'autofill · repo' },
  { nombre: 'portfolio', texto: 'Portfolio', fondo: BARANDA, tinta: LUZ },
  { nombre: 'linkedin', texto: 'LinkedIn' },
  { nombre: 'mail', texto: 'balbiano06@gmail.com', flecha: false },
  { nombre: 'cuenta-trabajo', texto: '@InvisibleGeeksBalbiano' },
];

const STACK = [
  'Model Context Protocol', 'Claude Code', 'OpenAI API', 'Claude API', 'Groq', 'OpenRouter', 'Llama 3.3',
  'ChromaDB', 'local embeddings', 'SQLite', 'PostgreSQL', 'MySQL', 'Prisma', 'Drizzle',
  'TypeScript', 'JavaScript', 'Python', 'PHP',
  'Laravel', 'Vue', 'React', 'Next.js', 'Astro', 'Inertia.js', 'Tailwind', 'Hono', 'Filament',
  'Cloudflare Workers', 'Docker', 'GitHub Actions', 'Vite',
  'Pest', 'Playwright', 'Vitest', 'golden tests',
  'Spec-driven development', 'versioned business rules',
];

await rm('assets/insignias', { recursive: true, force: true });
await mkdir('assets/insignias', { recursive: true });
await mkdir('assets/stack', { recursive: true });
for (const b of BOTONES) await writeFile(`assets/insignias/${b.nombre}.svg`, boton(b));
for (const t of STACK) await writeFile(`assets/stack/${slug(t)}.svg`, chip(t));
console.log(`${BOTONES.length} botones y ${STACK.length} chips`);
