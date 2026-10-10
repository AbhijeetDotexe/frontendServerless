'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  TerminalSquare,
  Zap,
  Box,
  Eye,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';

const codeLines = [
  { text: "function main(params) {", color: "#e2e8f0" },
  { text: "  const name = params.name || 'stranger';", color: "#94a3b8" },
  { text: "  console.log('Processing:', name);", color: "#6ee7b7" },
  { text: "  return { body: 'Hello ' + name + '!' };", color: "#93c5fd" },
  { text: "}", color: "#e2e8f0" },
];

function CodeBlock() {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[#0d1117] overflow-hidden shadow-lg">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-[#21262d] bg-[#161b22] px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-[#8b949e]">welcome.js — editor</span>
      </div>
      {/* Code */}
      <div className="p-5 font-mono text-[13px] leading-7">
        {codeLines.map((line, i) => (
          <div key={i} className="flex gap-4">
            <span className="w-5 shrink-0 select-none text-right text-[#484f58]">{i + 1}</span>
            <span style={{ color: line.color }}>{line.text}</span>
          </div>
        ))}
      </div>
      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-[#21262d] bg-[#3b5bdb] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#69db7c] animate-pulse" />
          <span className="font-mono text-[11px] font-medium text-white/80">Deployed • Node.js 18</span>
        </div>
        <span className="font-mono text-[11px] text-white/60">24ms</span>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-[var(--border-2)] hover:shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--surface-2)] text-[var(--foreground)]">
        {icon}
      </div>
      <h3 className="mb-1.5 text-sm font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="text-sm leading-6 text-[var(--muted)]">{text}</p>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0">
      <span className="text-sm text-[var(--muted)]">{label}</span>
      <span className="text-sm font-semibold text-[var(--foreground)]">{value}</span>
    </div>
  );
}

function InfoCard({
  eyebrow, title, icon, children,
}: { eyebrow: string; title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-2)]">{icon}</div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-2)]">{eyebrow}</p>
          <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
        </div>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-[var(--surface-2)] px-3 py-2.5 text-xs">
      <span className="font-medium text-[var(--muted)]">{label}</span>
      <span className={mono ? 'font-mono max-w-[55%] truncate text-[var(--foreground)]' : 'max-w-[55%] text-right font-semibold text-[var(--foreground)]'}>{value}</span>
    </div>
  );
}

function LogLine({ text, success }: { text: string; success?: boolean }) {
  return (
    <div className={`rounded-lg px-3 py-2 font-mono text-[11px] ${success ? 'bg-[#ebfbee] dark:bg-[#132b1b] text-[#2f9e44] dark:text-[#40c057]' : 'bg-[var(--surface-2)] text-[var(--muted)]'}`}>
      {text}
    </div>
  );
}

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const primaryHref = !isLoading && user ? '/dashboard' : '/signup';
  const primaryLabel = !isLoading && user ? 'Open Dashboard' : 'Get Started Free';

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <Navbar />

      <main className="relative mx-auto max-w-7xl px-6 pb-24 pt-20">

        {/* ── HERO ─────────────────────────────────────── */}
        <section className="mb-16">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
            
            {/* Hero text */}
            <div>
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2f9e44]" />
                OpenWhisk-powered runtime
              </div>

              <h1 className="text-[3.2rem] font-semibold leading-[1.08] tracking-[-0.04em] text-[var(--foreground)] sm:text-[4rem] lg:text-[4.8rem]">
                Ship serverless<br />
                <span className="text-[#3b5bdb] dark:text-[#748ffc]">without the friction.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">
                ServerlessFlow gives you one workspace to write, test, and deploy functions across Node.js, Python, and Go — with live output and endpoint visibility built in.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href={primaryHref}
                  className="flex items-center justify-center gap-2 rounded-lg bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90 shadow-sm"
                >
                  {primaryLabel}
                  <ArrowRight size={16} />
                </Link>
                <Link href="/docs" className="flex items-center gap-1.5 text-sm font-medium text-[#3b5bdb] dark:text-[#748ffc] hover:underline underline-offset-4">
                  Read the docs <ArrowRight size={14} />
                </Link>
              </div>

              {/* Social proof */}
              <div className="mt-10 flex items-center gap-6">
                {[
                  { label: "Runtimes", value: "Node.js · Python · Go" },
                  { label: "Cold start", value: "~24ms" },
                  { label: "Auth", value: "JWT secured" },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-2)]">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero code block + output */}
            <div className="space-y-3">
              <CodeBlock />
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  eyebrow="Output"
                  title="Test result"
                  icon={<TerminalSquare size={16} className="text-[#3b5bdb] dark:text-[#748ffc]" />}
                >
                  <InfoRow label="Input" value='{"name":"Abhijeet"}' mono />
                  <InfoRow label="Response" value='{"body":"Hello Abhijeet!"}' mono />
                </InfoCard>
                <InfoCard
                  eyebrow="Recent logs"
                  title="Activity"
                  icon={<CheckCircle2 size={16} className="text-[#2f9e44] dark:text-[#40c057]" />}
                >
                  <LogLine text="POST /execute 200" success />
                  <LogLine text="Completed in 24ms" />
                </InfoCard>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ─────────────────────────────────── */}
        <section className="mb-16">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">What you get</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">Everything in one workspace</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap size={18} />}
              title="Author & test"
              text="Start with runtime-aware boilerplates, run sample payloads, and inspect the response before you deploy."
            />
            <FeatureCard
              icon={<Globe size={18} />}
              title="Publish endpoints"
              text="Turn functions into public HTTP APIs with runtime, trigger, and endpoint details visible in one place."
            />
            <FeatureCard
              icon={<Eye size={18} />}
              title="Live output"
              text="Built-in logs and execution output show what ran, what returned, and how long it took."
            />
            <FeatureCard
              icon={<Box size={18} />}
              title="Multi-runtime"
              text="Node.js 18, Python 3.11, and Go 1.20 — switch runtimes without leaving the editor."
            />
            <FeatureCard
              icon={<Shield size={18} />}
              title="Secure by default"
              text="JWT authentication on every API call. Control public vs private endpoints with a single toggle."
            />
            <FeatureCard
              icon={<TerminalSquare size={18} />}
              title="Console output"
              text="stdout is captured automatically so logs from your function appear directly in the output panel."
            />
          </div>
        </section>

        {/* ── PLATFORM SNAPSHOT ────────────────────────── */}
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">Platform snapshot</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">A clearer path from code to live endpoint.</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Instead of splitting across an editor, deployment panel, logs tab, and a test client — ServerlessFlow keeps it all in one place.
              </p>
              <Link
                href={primaryHref}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#3b5bdb] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3451c7]"
              >
                Start building <ArrowRight size={15} />
              </Link>
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
              <StatRow label="Supported runtimes" value="Node.js · Python · Go" />
              <StatRow label="HTTP trigger" value="Public & private endpoints" />
              <StatRow label="Execution visibility" value="Output + logs built-in" />
              <StatRow label="Authentication" value="JWT — per-user isolation" />
              <StatRow label="Boilerplates" value="Runtime-aware, ready to edit" />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] px-6 py-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 text-sm text-[var(--muted-2)]">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--foreground)] text-[var(--background)]">
              <Shield size={12} fill="currentColor" />
            </div>
            <span className="font-semibold text-[var(--muted)]">ServerlessFlow</span>
          </div>
          <p>Serverless function development platform</p>
          <div className="flex gap-5">
            <Link href="/docs" className="hover:text-[var(--foreground)] transition-colors">Docs</Link>
            <Link href="/dashboard" className="hover:text-[var(--foreground)] transition-colors">Dashboard</Link>
            <Link href="/login" className="hover:text-[var(--foreground)] transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
