'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Globe,
  Menu,
  Play,
  Search,
  Shield,
  TerminalSquare,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const codeLines = [
  "function main(params) {",
  "  const name = params.name || \"stranger\";",
  "  console.log(\"Processing request for \" + name);",
  "  return { body: \"Hello \" + name + \"!\" };",
  "}",
];

function Header({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e8e7e1] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ff5a1f] text-white shadow-[0_14px_28px_rgba(255,90,31,0.22)]">
            <Shield size={20} fill="currentColor" />
          </div>
          <span className="text-xl font-semibold tracking-[-0.03em] text-[#181817]">ServerlessFlow</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#504f49] lg:flex">
          <Link href="/" className="transition-colors hover:text-[#181817]">Product</Link>
          <Link href="/docs" className="transition-colors hover:text-[#181817]">Docs</Link>
          <Link href="/dashboard" className="transition-colors hover:text-[#181817]">Dashboard</Link>
          <Link href="/login" className="transition-colors hover:text-[#181817]">Login</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/docs"
            className="hidden items-center gap-2 rounded-full border border-[#d8d7d0] bg-white px-5 py-3 text-sm font-semibold text-[#1f1f1b] shadow-[0_8px_20px_rgba(20,20,20,0.04)] md:flex"
          >
            <Search size={16} />
            Search Docs
          </Link>
          <Link
            href={primaryHref}
            className="rounded-full bg-[#4f59d9] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,89,217,0.18)] transition-transform hover:-translate-y-0.5"
          >
            {primaryLabel}
          </Link>
          <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d8d7d0] bg-white text-[#1f1f1b] lg:hidden">
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

function BrowserWindow() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute inset-x-10 top-8 h-20 rounded-full bg-[#ddddd7] blur-3xl" />

      <div className="relative overflow-hidden rounded-[2rem] border border-[#232321] bg-[#f6f6f3] shadow-[0_36px_80px_rgba(22,22,22,0.16)]">
        <div className="border-b border-[#d8d8d2] bg-[#ecece8] px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff6258]" />
              <span className="h-3 w-3 rounded-full bg-[#f4be49]" />
              <span className="h-3 w-3 rounded-full bg-[#4dc761]" />
            </div>

            <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-full border border-[#d7d7d1] bg-white px-4 py-2 text-sm text-[#5b5b56] shadow-inner">
              <Globe size={15} className="text-[#7a7a73]" />
              <span className="truncate">serverlessflow.dev/functions/welcome</span>
            </div>

            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d7d7d1] bg-white text-[#4d4d48]">
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-[#e7e7e1] bg-white p-5 sm:p-6 lg:border-b-0 lg:border-r">
            <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6d6d67]">
              <span className="rounded-full bg-[#f2f2ee] px-3 py-1">Node.js 18</span>
              <span className="rounded-full bg-[#f2f2ee] px-3 py-1">HTTP trigger</span>
              <span className="rounded-full bg-[#edf2ff] px-3 py-1 text-[#4955d8]">Public endpoint</span>
            </div>

            <div className="rounded-[1.5rem] border border-[#e5e5de] bg-[#fbfbf8] p-4 shadow-[0_12px_30px_rgba(20,20,20,0.05)]">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#76766f]">Editor</p>
                  <h3 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-[#171716]">welcome.js</h3>
                </div>
                <button className="flex shrink-0 items-center gap-2 rounded-full bg-[#ff5a1f] px-4 py-2 text-sm font-semibold text-white">
                  <Play size={15} fill="currentColor" />
                  Run Test
                </button>
              </div>

              <div className="rounded-[1.2rem] bg-[#171716] px-4 py-4 font-mono text-[13px] leading-7 text-[#f2f2ec]">
                {codeLines.map((line, index) => (
                  <div key={line} className="grid grid-cols-[28px_1fr] gap-3">
                    <span className="text-right text-[#76766f]">{index + 1}</span>
                    <span className={line.startsWith('  return') ? 'text-[#8fd3ff]' : line.includes('console.log') ? 'text-[#8fe3a5]' : line.includes('stranger') ? 'text-[#ffcb86]' : 'text-[#f2f2ec]'}>
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Metric label="Execution" value="24ms" />
              <Metric label="Runtime" value="Node.js 18" />
              <Metric label="Response" value="200 OK" />
            </div>
          </div>

          <div className="bg-[#f7f7f4] p-5 sm:p-6">
            <div className="space-y-4">
              <InfoCard
                eyebrow="Output"
                title="Test request"
                icon={<TerminalSquare size={18} className="text-[#ff5a1f]" />}
              >
                <InfoRow label="Input" value='{"name":"Abhijeet"}' mono />
                <InfoRow label="Response" value='{"body":"Hello Abhijeet!"}' mono />
                <InfoRow label="Visibility" value="stdout captured automatically" />
              </InfoCard>

              <InfoCard
                eyebrow="Recent logs"
                title="Execution activity"
                icon={<CheckCircle2 size={18} className="text-[#2e8a57]" />}
              >
                <LogLine text="POST /api/execute/welcome 200" success />
                <LogLine text="Processing request for Abhijeet" />
                <LogLine text="Function completed in 24ms" />
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.1rem] border border-[#e6e6df] bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#777771]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#171716]">{value}</p>
    </div>
  );
}

function InfoCard({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-[1.4rem] border border-[#e5e5de] bg-white p-4 shadow-[0_10px_24px_rgba(20,20,20,0.04)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f5f5f1]">{icon}</div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#76766f]">{eyebrow}</p>
          <h3 className="text-lg font-semibold tracking-[-0.02em] text-[#171716]">{title}</h3>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1rem] border border-[#ecece6] bg-[#fbfbf8] px-4 py-3 text-sm">
      <span className="font-medium text-[#4f4f49]">{label}</span>
      <span className={mono ? 'max-w-[60%] truncate font-mono text-[#171716]' : 'max-w-[60%] text-right font-semibold text-[#171716]'}>{value}</span>
    </div>
  );
}

function LogLine({ text, success }: { text: string; success?: boolean }) {
  return (
    <div className={`rounded-[1rem] border border-[#ecece6] px-4 py-3 font-mono text-[13px] ${success ? 'bg-[#eef8f1] text-[#2e8a57]' : 'bg-[#fbfbf8] text-[#63635d]'}`}>
      {text}
    </div>
  );
}

function ProductCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[1.5rem] border border-[#e8e8e2] bg-white p-5 shadow-[0_12px_28px_rgba(20,20,20,0.04)]">
      <h3 className="text-xl font-semibold tracking-[-0.03em] text-[#171717]">{title}</h3>
      <p className="mt-2 text-sm leading-7 text-[#5f5f59]">{text}</p>
    </div>
  );
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[#e7e7e0] bg-white px-4 py-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#787870]">{label}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-[#171716]">{value}</p>
    </div>
  );
}

export default function LandingPage() {
  const { user, isLoading } = useAuth();

  const primaryHref = !isLoading && user ? '/dashboard' : '/signup';
  const primaryLabel = !isLoading && user ? 'Open Dashboard' : 'Get Started';

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f5f5f2] text-[#171717]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[linear-gradient(180deg,#ffffff_0%,#f8f8f5_68%,#f5f5f2_100%)]" />
      <div className="pointer-events-none absolute left-[-8rem] top-24 h-64 w-64 rounded-full bg-[#ff5a1f]/10 blur-3xl" />
      <div className="pointer-events-none absolute right-[-10rem] top-12 h-72 w-72 rounded-full bg-[#dddcd5] blur-3xl" />

      <Header primaryHref={primaryHref} primaryLabel={primaryLabel} />

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-12 sm:pt-16 lg:pt-20">
        <section className="relative overflow-hidden rounded-[2.75rem] bg-white px-6 pb-12 pt-8 shadow-[0_26px_80px_rgba(20,20,20,0.06)] sm:px-10 lg:px-14 lg:pt-12">
          <div className="pointer-events-none absolute inset-x-0 top-48 overflow-hidden">
            <p className="select-none text-center text-[6rem] font-semibold uppercase leading-none tracking-[-0.08em] text-[#f1f1ec] sm:text-[8rem] lg:text-[12rem]">
              flow
            </p>
          </div>

          <div className="relative z-10 grid items-start gap-10 lg:grid-cols-[1.18fr_0.82fr]">
            <div className="max-w-4xl pt-2">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#666660]">
                Serverless function development, deployment, and observability
              </p>
              <h1 className="mt-5 max-w-4xl font-[family:var(--font-display)] text-[3.9rem] leading-[0.94] tracking-[-0.06em] text-[#171717] sm:text-[4.8rem] lg:text-[5.6rem]">
                Build serverless functions without stitching five tools together.
              </h1>
              <p className="mt-7 max-w-3xl text-xl leading-9 text-[#2f2f2b] sm:text-2xl">
                ServerlessFlow gives you one workspace to write functions, test sample payloads, publish HTTP endpoints, choose runtimes, and inspect logs and execution output without jumping between separate tools.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href={primaryHref}
                  className="flex min-w-[240px] items-center justify-center gap-2 rounded-full bg-[#ff5a1f] px-8 py-4 text-lg font-semibold text-white shadow-[0_18px_38px_rgba(255,90,31,0.24)] transition-transform hover:-translate-y-0.5"
                >
                  {primaryLabel}
                  <ArrowRight size={20} />
                </Link>
                <Link href="/docs" className="text-base font-semibold text-[#3d49d8] underline decoration-[#c7cdf8] underline-offset-4">
                  Explore the docs
                </Link>
              </div>
            </div>

            <div className="flex justify-start lg:justify-end">
              <div className="w-full max-w-[22rem] rounded-[1.8rem] border border-[#1f1f1d] bg-white p-6 shadow-[0_18px_44px_rgba(20,20,20,0.08)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#76766f]">Platform snapshot</p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#171716]">Everything needed to ship a function.</h2>
                  </div>
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.1rem] border border-[#1f1f1d] bg-[#fafaf7] text-[#ff5a1f]">
                    <Shield size={26} fill="currentColor" />
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-sm text-[#4e4e48]">
                  <div className="rounded-[1rem] border border-[#ecece6] bg-[#fbfbf8] px-4 py-3">
                    Node.js, Python, and Go runtimes in one editor.
                  </div>
                  <div className="rounded-[1rem] border border-[#ecece6] bg-[#fbfbf8] px-4 py-3">
                    HTTP endpoints, cron jobs, and database-driven workflows.
                  </div>
                  <div className="rounded-[1rem] border border-[#ecece6] bg-[#fbfbf8] px-4 py-3">
                    Built-in execution output, logs, and response visibility.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-10 grid gap-4 sm:grid-cols-3">
            <ProductCard title="Author and test" text="Start with runtime-aware boilerplates, run sample payloads, and inspect the response before you deploy." />
            <ProductCard title="Publish endpoints" text="Turn functions into public HTTP APIs and keep runtime, trigger, and endpoint details visible in the same place." />
            <ProductCard title="Read live behavior" text="Use built-in logs and execution output to understand what ran, what returned, and how long it took." />
          </div>

          <div className="relative z-10 mt-8 grid gap-4 rounded-[2rem] border border-[#ebeae4] bg-[#fbfbf8] p-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#76766f]">What teams get</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#171716]">A clearer path from code to live endpoint.</h2>
              <p className="mt-3 text-sm leading-7 text-[#5f5f59]">
                Instead of splitting the workflow across an editor, deployment panel, logs tab, and separate test client, ServerlessFlow keeps the important pieces visible in one place.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <DataPoint label="Supported runtimes" value="Node.js, Python, Go" />
              <DataPoint label="Trigger types" value="HTTP, cron, database events" />
              <DataPoint label="Built-in tooling" value="Execution output, logs, endpoint visibility" />
            </div>
          </div>

          <div className="relative z-10 mt-12 lg:mt-14">
            <BrowserWindow />
          </div>
        </section>
      </main>
    </div>
  );
}
