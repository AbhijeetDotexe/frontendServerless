'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import {
  Book,
  Code,
  Zap,
  Shield,
  Activity,
  Menu,
  X,
  Copy,
  Check,
  Info,
} from 'lucide-react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('nodejs');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      <Navbar />

      <div className="mx-auto flex max-w-7xl pt-16">
        {/* Sidebar */}
        <aside className="fixed hidden h-[calc(100vh-4rem)] w-72 overflow-y-auto border-r border-[var(--border)] pr-5 pb-10 pt-7 lg:block">
          <div className="space-y-7">
            <DocGroup title="Getting Started">
              <DocLink onClick={() => scrollToSection('intro')} active>Introduction</DocLink>
              <DocLink onClick={() => scrollToSection('anatomy')}>Function Anatomy</DocLink>
            </DocGroup>

            <DocGroup title="Runtimes & Syntax">
              <DocLink onClick={() => { setActiveTab('nodejs'); scrollToSection('runtimes'); }}>Node.js</DocLink>
              <DocLink onClick={() => { setActiveTab('python'); scrollToSection('runtimes'); }}>Python</DocLink>
              <DocLink onClick={() => { setActiveTab('go'); scrollToSection('runtimes'); }}>Go</DocLink>
              <DocLink onClick={() => { setActiveTab('swift'); scrollToSection('runtimes'); }}>Swift</DocLink>
              <DocLink onClick={() => { setActiveTab('php'); scrollToSection('runtimes'); }}>PHP</DocLink>
            </DocGroup>

            <DocGroup title="Platform Features">
              <DocLink onClick={() => scrollToSection('best-practices')}>Best Practices</DocLink>
              <DocLink onClick={() => scrollToSection('logging')}>Live Logging</DocLink>
            </DocGroup>
          </div>
        </aside>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed right-6 bottom-6 z-50 rounded-full bg-[#3b5bdb] p-3.5 text-white shadow-xl lg:hidden"
          aria-label="Open documentation navigation"
        >
          <Menu size={24} />
        </button>

        <main className="max-w-5xl flex-1 px-6 py-10 pb-28 lg:pl-80">
          {/* Introduction */}
          <section id="intro" className="mb-16">
            <div className="mb-3.5 flex items-center gap-2 text-[#3b5bdb] dark:text-[#748ffc]">
              <Book size={18} />
              <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.14em]">Documentation</span>
            </div>
            <h1 className="mb-5 text-3xl font-bold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl lg:text-5xl">
              Writing Serverless Functions
            </h1>
            <p className="mb-8 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              ServerlessFlow allows you to deploy code without provisioning servers. Your functions are event-driven, meaning they execute instantly when triggered by an HTTP request or test run.
            </p>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xs">
              <h4 className="mb-3 text-base sm:text-lg font-semibold text-[var(--foreground)]">How it works</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
                <li>Write or edit your function code in our unified web workspace.</li>
                <li>Save and deploy — automatically creating an OpenWhisk action.</li>
                <li>Invoke via HTTP endpoint or execute directly via the Test Run button.</li>
                <li>Monitor response payload, duration, and runtime logs in the output drawer.</li>
              </ol>
            </div>
          </section>

          {/* Anatomy */}
          <section id="anatomy" className="mb-16">
            <h2 className="mb-3 text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[var(--foreground)]">
              Function Anatomy
            </h2>
            <p className="mb-6 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              Regardless of the language, every function follows a simple input/output contract.
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs">
                <div className="mb-3 flex items-center gap-2 text-[#3b5bdb] dark:text-[#748ffc]">
                  <Activity size={18} />
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">Input (args)</h3>
                </div>
                <p className="mb-3 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
                  Your function receives a parameter containing:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-[var(--muted)]">
                  <li>HTTP Query Parameters</li>
                  <li>HTTP Body (JSON)</li>
                  <li>Path Parameters</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs">
                <div className="mb-3 flex items-center gap-2 text-[#2f9e44]">
                  <Zap size={18} />
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)]">Output (Return)</h3>
                </div>
                <p className="mb-3 text-sm sm:text-base leading-relaxed text-[var(--muted)]">
                  Return a JSON object or dictionary containing:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-[var(--muted)]">
                  <li><code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-sm font-semibold text-[#3b5bdb] dark:text-[#748ffc]">body</code>: The actual response data.</li>
                  <li><code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-sm font-semibold text-[#3b5bdb] dark:text-[#748ffc]">statusCode</code>: (Optional) HTTP code.</li>
                  <li><code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-sm font-semibold text-[#3b5bdb] dark:text-[#748ffc]">headers</code>: (Optional) Custom headers.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Runtimes */}
          <section id="runtimes" className="mb-16 scroll-mt-20">
            <h2 className="mb-3.5 flex items-center gap-2.5 text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[var(--foreground)]">
              <Code size={24} className="text-[#3b5bdb] dark:text-[#748ffc]" />
              Runtime Examples
            </h2>

            <p className="mb-6 text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              Select a runtime below to view boilerplate code ready for deployment:
            </p>

            <div className="mb-5 flex gap-2.5 border-b border-[var(--border)] pb-3 overflow-x-auto">
              {['nodejs', 'python', 'go', 'swift', 'php'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveTab(lang)}
                  className={`rounded-lg px-4 py-2 text-sm sm:text-base font-semibold transition ${
                    activeTab === lang
                      ? 'bg-[#3b5bdb] text-white shadow-xs'
                      : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
                  }`}
                >
                  {lang === 'nodejs' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[#0d1117] shadow-md">
              <div className="flex items-center justify-between border-b border-[#21262d] bg-[#161b22] px-5 py-3.5">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                  <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                </div>
                <span className="font-mono text-xs sm:text-sm font-medium uppercase tracking-wider text-[#8b949e]">{activeTab} runtime</span>
              </div>

              <CodeContent language={activeTab} />
            </div>

            <div className="mt-5 flex gap-3.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5 text-sm sm:text-base shadow-xs">
              <Info className="mt-0.5 shrink-0 text-[#3b5bdb] dark:text-[#748ffc]" size={20} />
              <div>
                <h4 className="font-semibold text-[var(--foreground)]">Runtime Note</h4>
                <p className="mt-1 text-[var(--muted)] leading-relaxed">
                  {activeTab === 'nodejs' && "We run Node.js 18.x LTS. Function handler defaults to main(params)."}
                  {activeTab === 'python' && 'Supported version: Python 3.11. Function entry point defaults to main(args).'}
                  {activeTab === 'go' && 'We compile Go code using Go 1.20. Ensure your function is exported (Main) so the runtime can access it.'}
                  {activeTab === 'swift' && 'Swift 5.7 runtime. Ideal for high-performance compute tasks.'}
                  {activeTab === 'php' && 'PHP 8.2 runtime. Arrays are automatically converted to JSON responses.'}
                </p>
              </div>
            </div>
          </section>

          {/* Best Practices */}
          <section id="best-practices" className="mb-16">
            <h2 className="mb-4 flex items-center gap-2.5 text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[var(--foreground)]">
              <Shield size={24} className="text-[#2f9e44]" />
              Best Practices
            </h2>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs">
                <h4 className="mb-2 text-base sm:text-lg font-semibold text-[var(--foreground)]">Stateless Execution</h4>
                <p className="text-sm sm:text-base leading-relaxed text-[var(--muted)]">Functions should be stateless. Do not rely on in-memory variables persisting between requests.</p>
              </div>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-xs">
                <h4 className="mb-2 text-base sm:text-lg font-semibold text-[var(--foreground)]">Fast Execution</h4>
                <p className="text-sm sm:text-base leading-relaxed text-[var(--muted)]">Keep handlers lean to minimize latency. Offload heavy background work to async queues.</p>
              </div>
            </div>
          </section>

          {/* Logging */}
          <section id="logging" className="mb-16">
            <h2 className="mb-4 flex items-center gap-2.5 text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[var(--foreground)]">
              <Activity size={24} className="text-[#3b5bdb] dark:text-[#748ffc]" />
              Logging & Monitoring
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-[var(--muted)]">
              ServerlessFlow automatically captures stdout and stderr output. Everything printed via <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-sm sm:text-base font-mono">console.log()</code> or <code className="rounded bg-[var(--surface-2)] px-1.5 py-0.5 text-sm sm:text-base font-mono">print()</code> appears directly in your execution output drawer.
            </p>
          </section>
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--surface)] p-7 backdrop-blur-md lg:hidden">
          <button onClick={() => setMobileMenuOpen(false)} className="mb-6 self-end text-[var(--muted)] hover:text-[var(--foreground)]" aria-label="Close menu">
            <X size={26} />
          </button>
          <nav className="flex flex-col gap-4 text-lg font-medium text-[var(--foreground)]">
            <button onClick={() => scrollToSection('intro')} className="text-left py-1.5">Introduction</button>
            <button onClick={() => scrollToSection('anatomy')} className="text-left py-1.5">Function Anatomy</button>
            <button onClick={() => scrollToSection('runtimes')} className="text-left py-1.5">Runtimes</button>
            <button onClick={() => scrollToSection('best-practices')} className="text-left py-1.5">Best Practices</button>
            <button onClick={() => scrollToSection('logging')} className="text-left py-1.5">Live Logging</button>
          </nav>
        </div>
      )}
    </div>
  );
}

function DocGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 pl-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">{title}</h3>
      <div className="flex flex-col space-y-1">{children}</div>
    </div>
  );
}

function DocLink({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-3.5 py-2.5 text-left text-sm sm:text-[15px] font-medium transition-colors ${
        active 
          ? 'bg-[var(--surface-2)] text-[var(--foreground)] font-semibold shadow-xs' 
          : 'text-[var(--muted)] hover:bg-[var(--surface-2)] hover:text-[var(--foreground)]'
      }`}
    >
      {children}
    </button>
  );
}

function CodeContent({ language }: { language: string }) {
  const [copied, setCopied] = useState(false);

  const codes: Record<string, string> = {
    nodejs: `function main(params) {
  // 1. Parse Input
  const name = params.name || 'stranger';

  // 2. Logic & Logging
  console.log('Processing request for:', name);

  // 3. Return JSON
  return { body: 'Hello ' + name + '!' };
}`,
    python: `def main(args):
    # 1. Parse Input
    name = args.get("name", "stranger")

    # 2. Logic & Logging
    print(f"Processing request for: {name}")

    # 3. Return Dict
    return {"body": f"Hello {name}!"}`,
    swift: `func main(args: [String:Any]) -> [String:Any] {
    let name = args["name"] as? String ?? "stranger"
    print("Processing for: \\(name)")
    return [ "body" : "Hello \\(name)!" ]
}`,
    go: `package main

import "fmt"

func Main(args map[string]interface{}) map[string]interface{} {
    name, ok := args["name"].(string)
    if !ok {
        name = "stranger"
    }
    fmt.Println("Processing request for:", name)
    return map[string]interface{}{"body": "Hello, " + name + "!"}
}`,
    php: `<?php
function main(array $args) : array {
    $name = $args["name"] ?? "stranger";
    echo "Processing for $name";
    return ["body" => "Hello $name!"];
}`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codes[language]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-3.5 right-3.5 z-10 rounded-lg border border-[#30363d] bg-[#21262d] p-2 text-[#8b949e] hover:text-white transition-colors"
        title="Copy code"
      >
        {copied ? <Check size={16} className="text-[#3fb950]" /> : <Copy size={16} />}
      </button>

      <pre className="overflow-x-auto p-6 font-mono text-sm sm:text-[15px] leading-7 text-[#c9d1d9]">
        <code>{codes[language]}</code>
      </pre>
    </div>
  );
}
