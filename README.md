# Hi, I'm Luciano 👋

📍 **Buenos Aires, Argentina** · 🇪🇺 **EU citizen (Spain)** — no visa sponsorship needed · 🌍 **Remote-first**

**AI Engineer** · Spec-driven development · Co-founder & Frontend Architect at [Dmeter](https://dmeter.com.ar) · Team Leader at Invisible Geeks

[![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](#)
[![Claude](https://img.shields.io/badge/-Claude%20AI-D97757?style=flat-square&logo=anthropic&logoColor=white)](#)
[![MCP](https://img.shields.io/badge/-Model%20Context%20Protocol-000000?style=flat-square&logo=anthropic&logoColor=white)](#)
[![OpenAI](https://img.shields.io/badge/-OpenAI-412991?style=flat-square&logo=openai&logoColor=white)](#)
[![PHP](https://img.shields.io/badge/-PHP-777BB4?style=flat-square&logo=php&logoColor=white)](#)
[![Laravel](https://img.shields.io/badge/-Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white)](#)
[![Vue.js](https://img.shields.io/badge/-Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white)](#)
[![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)](#)
[![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](#)
[![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)](#)

> I build AI systems that reach production instead of stopping at a demo: MCP servers, RAG pipelines and agents wired into the systems people already use. I work spec-first — the specification before the code — and keep business rules versioned as data instead of buried in the program.
>
> Six products in production at Dmeter, the studio I co-founded, where I lead the technical decisions and architecture. Before the AI work: 5 years of Laravel, Vue and TypeScript, large-scale migrations and multi-tenant systems.

🌐 **Portfolio:** [balbianoluciano.github.io](https://balbianoluciano.github.io)

---

## 🤖 AI work

**Dmeter MCP Server** — An MCP server in TypeScript on the official Model Context Protocol SDK that centralises the studio's operations. It exposes tools, resources and prompts that the whole team consumes from their own Claude Code instance. Includes a RAG knowledge base over projects and documentation, proposal and document generation, budget estimation, and onboarding for new people. Multi-user: each person connects from their own instance.
*TypeScript · Node 20 · MCP SDK · Hugging Face Transformers · SQLite · Zod · Puppeteer*

**RAG over the studio's knowledge** — Retrieval over our projects and internal documentation using local embeddings and SQLite, with no external vector service. Chunking, indexing and retrieval written directly rather than delegated to a framework, so retrieval quality is something I can measure and tune.

**Proposal generation** — RAG over ChromaDB with Llama 3.3 70B through Groq and OpenRouter, including job posting scraping and application tracking. Agentic workflows with state carried between steps, retries and validation.

One design rule runs through all of it: **the system generates, the person decides.** Nothing is sent or published automatically.

---

## 🚀 Production work

* 🏗️ **[Hornero](https://hornero.dmeter.com.ar)** — Catalogue and stock engine that runs the same for a clothing shop, a hardware store or a gym: what changes between trades is data, not code. Each business declares its own schema and the dimensions generate the variant matrix. Isolation between businesses is guaranteed by Postgres row-level security rather than the ORM, with **248 tests against a real Postgres**.
  *Hono · Drizzle · Cloudflare Workers · Postgres 16 · Next · React 19 · PWA*

* 💡 **[Prolicht](https://www.prolicht.at)** — Site and catalogue for an Austrian architectural LED manufacturer with two decades of content trapped in a legacy CMS. I migrated **257 projects** with reproducible commands and a dry-run mode to review the diff before applying it, plus a room configurator and a presentation editor with a shareable client link.
  *Laravel 12 · Vue 3 · Inertia 2 · Tailwind 4 · MySQL 8 · Docker*

* ⚖️ **Portal de Pericias** — Multi-tenant SaaS where a court-appointed expert runs their whole practice: cases, expert reports, fees and deadlines. Eight entities on a layered architecture, digital evidence fingerprinted with MD5/SHA1/SHA256 on upload, documents in private storage, permissions guaranteed at the database level.
  *Laravel 13 · PHP 8.5 · Vue 3 · Inertia · MySQL 8.4 · Pest 4*

* 🦊 **[El Zorro Gris](https://elzorrogris.es)** — Platform for older adults across five verticals, with an engine that builds itineraries around how much the traveller can actually take: every activity carries physical effort and mental fatigue on a 1–5 scale, with caps per age segment and adjustments for weather and season. Custom chatbot with streaming, plus a custom EPUB reader with native Epub.js modifications.
  *Laravel · Vue 3 · Inertia · Stripe · OpenAI · Claude · Pest · Playwright*

* 📚 **[Malmberg.nl](https://malmberg.nl)** — Migration of **800+ pages** to HubSpot CMS on a custom React Islands boilerplate with selective hydration: only genuinely interactive components ship JavaScript.
  *React 18 · TypeScript · Tailwind · HubSpot CMS · Serverless Functions*

* 🔗 **Relay** — In-house operations workspace: chats, email, files, payments and numbers on a single screen. One inbox where context travels with the thread instead of living in someone's head. It plugs into what a company already uses rather than asking them to migrate all at once.

---

## 🧩 Open source

* 🧷 **[autofill](https://github.com/BalbianoLuciano/autofill)** — Chrome extension that fills job application forms. The hard part isn't writing into an input: it's recognising which field is which when the HTML doesn't help, and getting the value to actually register. Greenhouse, Lever and Ashby are React, and React discards `element.value = x` — the fix is to invoke the native prototype setter, which bypasses the descriptor React installed on the instance. A dictionary of 38 fields and 385 ways of asking for them across five languages, with a five-step cascade that compares by tokens rather than substrings. 127 tests, several traced from real forms. No LLM: the heuristics cover the case, and the model is documented as the last resort.
  *TypeScript · WXT · Manifest V3 · Vitest · happy-dom*

* 🎯 **[Portfolio](https://github.com/BalbianoLuciano/BalbianoLuciano.github.io)** — One screen, no scrolling anywhere, where every deeper level opens as a radial mask from the exact point you clicked. Built on a single governing specification written before any code, and every interaction obeys it.
  *Astro · React islands · GSAP · Lenis · Tailwind*

---

## 🛠️ Stack

**AI & agents** · Model Context Protocol · Claude Code · OpenAI API · Claude API · Groq · OpenRouter · Llama 3.3 · prompt engineering
**RAG & data** · ChromaDB · Hugging Face Transformers · local embeddings · SQLite · PostgreSQL · MySQL · MongoDB · Prisma · Drizzle
**Languages** · TypeScript · JavaScript · Python · PHP
**Web** · Laravel · Vue · React · Next.js · Astro · Inertia.js · Tailwind · Hono · Filament
**Infrastructure** · Cloudflare Workers · Docker · GitHub Actions · Vite
**Testing** · Pest · Playwright · Vitest · golden tests
**Method** · Spec-driven development · versioned business rules

---

## 📊 Where my commits live

Most of my daily code goes to my work account. This one holds the open projects and side work.

[![Work contributions](https://ghchart.rshah.org/InvisibleGeeksBalbiano)](https://github.com/InvisibleGeeksBalbiano)

→ **[@InvisibleGeeksBalbiano](https://github.com/InvisibleGeeksBalbiano)**

---

## 🎓 Education

* **Universidad Tecnológica Nacional** — Tecnicatura Universitaria en Programación *(in progress, Mar 2026 — Dec 2027)*
* **Informatorio Chaco** — Python/Django Web Developer *(2021)*
* **U.N.N.E.** — Architecture and Urbanism *(2017–2020, incomplete)* — where the interface work comes from
* UX/UI Designer + Figma · 2D Game Developer *(Udemy, 2024)*
* **English** — B2 Upper Intermediate, [EF SET certified](https://cert.efset.org/YTogwD)

---

## 🌍 Open to

**AI Engineer · Senior Full Stack · Tech Lead · Team Leader**

Remote worldwide. EU citizen, so no sponsorship needed for European positions. Spanish native, English B2.

[![Portfolio](https://img.shields.io/badge/-Portfolio-000000?style=flat-square&logo=astro&logoColor=white)](https://balbianoluciano.github.io)
[![LinkedIn](https://img.shields.io/badge/-LinkedIn-0A66C2?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/luciano-balbiano/)
[![Email](https://img.shields.io/badge/-Email-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:balbiano06@gmail.com)
