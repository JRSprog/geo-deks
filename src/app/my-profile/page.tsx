import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "My Profile | Geo Deks Game",
  description: "Developer profile and full tech stack of JRSprog.",
};

type Skill = { name: string; note?: string };
type StackGroup = {
  title: string;
  icon: string;
  tone: string;
  chip: string;
  skills: Skill[];
};

const PROFILE = {
  name: "JRSprog",
  role: "Full-Stack Web Developer",
  location: "Philippines",
  github: "https://github.com/JRSprog",
  bio: "I build web apps end to end: from hand-written HTML5, CSS, and native PHP pages, to large TypeScript monorepos with Next.js frontends, Laravel and Node backends, and Python AI services. I ship with Git, GitHub, and Docker.",
};

const HIGHLIGHTS = [
  { label: "Languages", value: "7" },
  { label: "Frameworks", value: "10+" },
  { label: "Apps shipped", value: "9" },
  { label: "Version control", value: "Git + GitHub" },
];

const STACK: StackGroup[] = [
  {
    title: "Languages",
    icon: "🧭",
    tone: "bg-[#e11d1d] text-white",
    chip: "bg-white/15 text-white border-white/40",
    skills: [
      { name: "HTML5", note: "semantic markup" },
      { name: "CSS", note: "layouts, animation" },
      { name: "JavaScript", note: "ES2020+" },
      { name: "TypeScript", note: "strict mode" },
      { name: "PHP", note: "native + Laravel" },
      { name: "Python", note: "FastAPI" },
      { name: "SQL", note: "PostgreSQL, MySQL" },
    ],
  },
  {
    title: "Frontend",
    icon: "🗺️",
    tone: "bg-[#f3c516] text-[#13212f]",
    chip: "bg-[#13212f]/10 text-[#13212f] border-[#13212f]/25",
    skills: [
      { name: "Next.js", note: "App Router" },
      { name: "React", note: "19" },
      { name: "Tailwind CSS", note: "v4" },
      { name: "HeroUI / React Aria" },
      { name: "shadcn / Radix" },
      { name: "Redux Toolkit" },
      { name: "Zustand" },
      { name: "TanStack Query" },
      { name: "React Hook Form + Zod" },
      { name: "Framer Motion" },
      { name: "PWA", note: "Serwist, next-pwa" },
      { name: "NextAuth + WebAuthn" },
    ],
  },
  {
    title: "Backend",
    icon: "📍",
    tone: "bg-[#2f9e44] text-white",
    chip: "bg-white/15 text-white border-white/40",
    skills: [
      { name: "Laravel", note: "12" },
      { name: "Native PHP", note: "no framework" },
      { name: "Node.js" },
      { name: "Hono" },
      { name: "Prisma ORM" },
      { name: "FastAPI" },
      { name: "Socket.IO", note: "realtime" },
      { name: "Laravel Sanctum" },
      { name: "REST API design" },
      { name: "Queues + Scheduler" },
    ],
  },
  {
    title: "Databases & Search",
    icon: "🌍",
    tone: "bg-[#2563eb] text-white",
    chip: "bg-white/15 text-white border-white/40",
    skills: [
      { name: "PostgreSQL" },
      { name: "MySQL", note: "XAMPP" },
      { name: "Redis" },
      { name: "Qdrant", note: "vector DB" },
      { name: "Meilisearch" },
    ],
  },
  {
    title: "DevOps & Tools",
    icon: "🛠️",
    tone: "bg-[#c24d19] text-white",
    chip: "bg-white/15 text-white border-white/40",
    skills: [
      { name: "Git" },
      { name: "GitHub" },
      { name: "GitHub Actions", note: "CI/CD" },
      { name: "Docker + Compose" },
      { name: "Dokploy" },
      { name: "pnpm workspaces" },
      { name: "XAMPP" },
      { name: "Vitest + Playwright" },
      { name: "PHPUnit" },
      { name: "Sentry" },
      { name: "ESLint + Prettier" },
    ],
  },
  {
    title: "AI & Integrations",
    icon: "🤖",
    tone: "bg-[#6e4a2f] text-white",
    chip: "bg-white/15 text-white border-white/40",
    skills: [
      { name: "OpenAI" },
      { name: "Google Gemini" },
      { name: "CLIP + PyTorch", note: "visual search" },
      { name: "Vercel AI SDK" },
      { name: "PayMongo", note: "payments" },
      { name: "J&T / XDE / ZQ", note: "shipping" },
      { name: "Cloudinary / AWS S3" },
      { name: "Firebase / OneSignal", note: "push" },
      { name: "Pusher / Supabase Realtime" },
      { name: "Cloudflare Turnstile" },
    ],
  },
];

const PROJECTS = [
  {
    name: "AF Home Platform",
    kind: "E-commerce + affiliate system",
    stack: "Next.js, Laravel, PostgreSQL, Redis, FastAPI, Docker",
    summary:
      "A pnpm monorepo with nine apps: storefront, admin, partner and supplier portals, a community app, a Socket.IO realtime gateway, a CLIP vector search service, and a rider QR scanner. Payments, shipping, wallet, and KYC are all integrated.",
  },
  {
    name: "Geo-Deks Card Game",
    kind: "Educational browser game",
    stack: "Next.js, React, TypeScript, Tailwind CSS",
    summary:
      "A UNO-style geography card game in Filipino. One player faces three CPU opponents, builds a civilization from Lokasyon, Rehiyon, Paggalaw, and Interaksyon cards, and blocks disasters with adaptation cards.",
    href: "/geo-deks",
  },
  {
    name: "Classic PHP Websites",
    kind: "Native PHP + HTML5 + CSS + JavaScript",
    stack: "PHP, MySQL, HTML5, CSS, vanilla JavaScript, XAMPP",
    summary:
      "Server-rendered sites and forms written without a framework: hand-written PHP sessions, MySQL queries, and plain CSS and JavaScript for interactivity.",
  },
];

const HOW_I_WORK = [
  "Version everything with Git and keep a clean commit history on GitHub.",
  "Type-safe code: strict TypeScript on the frontend, typed PHP on the backend.",
  "Mobile-first layouts with Tailwind, tested at phone width before desktop.",
  "Docker images built in CI so local, staging, and production match.",
];

export default function MyProfilePage() {
  const initials = PROFILE.name.slice(0, 2).toUpperCase();

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[url('/images/bg.png')] bg-cover bg-center bg-no-repeat p-3 text-[#102031] md:p-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(29,18,8,0.18)_0%,rgba(29,18,8,0.26)_100%)]" />

      <div className="relative mx-auto max-w-6xl rounded-3xl border border-[#b58f60] bg-[#efe4d2]/92 p-5 shadow-2xl backdrop-blur-[1px] md:p-7">
        {/* Top bar */}
        <nav className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/geo-deks"
            className="rounded-full bg-[#2f5d8a] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#2b567f]"
          >
            🎴 Play Geo-Deks
          </Link>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-[#1f2a44] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#13212f]"
          >
            GitHub ↗
          </a>
        </nav>

        {/* Hero */}
        <header className="mt-5 grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
          <div className="relative mx-auto h-32 w-32 md:mx-0">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#e11d1d,#f3c516,#2f9e44,#2563eb,#c24d19,#e11d1d)] shadow-[0_12px_24px_rgba(0,0,0,0.25)]" />
            <div className="absolute inset-[6px] flex items-center justify-center rounded-full border-4 border-white/90 bg-[#1f2a44] text-4xl font-black text-white">
              {initials}
            </div>
          </div>
          <div className="text-center md:text-left">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-[#6e4a2f]">
              Player Profile
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight md:text-4xl">
              {PROFILE.name}
            </h1>
            <p className="mt-1 text-base font-bold text-[#2b567f]">
              {PROFILE.role} · {PROFILE.location}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#3b2c1d]">
              {PROFILE.bio}
            </p>
          </div>
        </header>

        {/* Highlights */}
        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.label}
              className="rounded-xl bg-[#2b567f] px-4 py-3 text-white shadow"
            >
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/75">
                {h.label}
              </p>
              <p className="mt-1 text-lg font-black">{h.value}</p>
            </div>
          ))}
        </section>

        {/* Tech stack */}
        <section className="mt-8">
          <h2 className="text-2xl font-black tracking-tight">Tech Stack</h2>
          <p className="mt-1 text-sm text-[#5f4c36]">
            Every card in my deck, grouped by suit.
          </p>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {STACK.map((group) => (
              <article
                key={group.title}
                className={`relative overflow-hidden rounded-[1.35rem] border-[6px] border-[#f6f1e8] p-5 shadow-[0_12px_24px_rgba(0,0,0,0.18)] ${group.tone}`}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.28)_0%,rgba(255,255,255,0.12)_16%,transparent_30%),radial-gradient(circle_at_80%_82%,rgba(255,255,255,0.12)_0%,transparent_28%)]" />
                <div className="pointer-events-none absolute -right-6 -top-6 text-7xl opacity-20">
                  {group.icon}
                </div>
                <div className="relative">
                  <p className="text-[0.62rem] font-black uppercase tracking-[0.24em] opacity-90">
                    {group.skills.length} cards
                  </p>
                  <h3 className="mt-1 text-xl font-black drop-shadow-[0_1px_0_rgba(255,255,255,0.18)]">
                    {group.icon} {group.title}
                  </h3>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {group.skills.map((s) => (
                      <li
                        key={s.name}
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${group.chip}`}
                      >
                        {s.name}
                        {s.note ? (
                          <span className="ml-1 font-medium opacity-75">
                            · {s.note}
                          </span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mt-8">
          <h2 className="text-2xl font-black tracking-tight">Projects</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {PROJECTS.map((p) => (
              <article
                key={p.name}
                className="flex flex-col rounded-2xl border border-[#ba9b76] bg-[#f7f0e4] p-4 shadow-xl"
              >
                <p className="text-[0.62rem] font-black uppercase tracking-[0.24em] text-[#6e4a2f]">
                  {p.kind}
                </p>
                <h3 className="mt-1 text-lg font-bold">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#3b2c1d]">
                  {p.summary}
                </p>
                <p className="mt-3 rounded-lg bg-[#dfccb2] p-2 text-xs">
                  <span className="font-semibold">Stack:</span> {p.stack}
                </p>
                {p.href ? (
                  <Link
                    href={p.href}
                    className="mt-3 inline-block self-start rounded-full bg-[#2f6fa7] px-4 py-2 text-xs font-bold text-white"
                  >
                    Play it
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        {/* How I work */}
        <section className="mt-6 rounded-2xl bg-[#dfccb2] p-4 text-sm">
          <h3 className="font-bold">How I Work</h3>
          <ul className="mt-2 list-disc pl-5">
            {HOW_I_WORK.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </section>

        <footer className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-[#d7c2a3] pt-4 text-xs text-[#5f4c36]">
          <span>
            Built with Next.js, React, TypeScript, and Tailwind CSS.
          </span>
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-[#2b567f] hover:underline"
          >
            github.com/JRSprog
          </a>
        </footer>
      </div>
    </main>
  );
}
