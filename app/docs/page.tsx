'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import {
  Book,
  Code,
  Terminal,
  Zap,
  Shield,
  Activity,
  Menu,
  X,
  Copy,
  Check,
  Info,
  AlertTriangle,
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
    <div className="min-h-screen overflow-x-hidden bg-[#f5f5f2] text-[#171717] selection:bg-[#d9dcff] selection:text-[#171717]">
      <Navbar />

      <div className="mx-auto flex max-w-7xl pt-20">
        <aside className="fixed hidden h-[calc(100vh-5rem)] w-64 overflow-y-auto border-r border-[#e7e7e0] pr-4 pb-10 lg:block">
          <div className="mt-8 space-y-8">
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
              <DocLink onClick={() => scrollToSection('env-vars')}>Environment Variables</DocLink>
            </DocGroup>
          </div>
        </aside>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed right-6 bottom-6 z-50 rounded-full bg-[#4f59d9] p-3 text-white shadow-[0_18px_40px_rgba(79,89,217,0.18)] transition-colors hover:bg-[#444fd0] lg:hidden"
        >
          <Menu size={24} />
        </button>

        <main className="max-w-5xl flex-1 px-6 py-8 pb-24 lg:pl-72">
          <section id="intro" className="mb-16">
            <div className="mb-4 flex items-center gap-2 text-[#9f7b26]">
              <Book size={20} />
              <span className="text-sm font-semibold uppercase tracking-[0.24em]">Documentation</span>
            </div>
            <h1 className="mb-6 font-[family:var(--font-display)] text-4xl font-semibold tracking-[-0.03em] text-[#221c15]">
              Writing Serverless Functions
            </h1>
            <p className="mb-6 max-w-3xl text-lg leading-8 font-medium text-[#65594b]">
              ServerlessFlow allows you to deploy code without provisioning servers. Your functions are event-driven, meaning they run only when triggered by an HTTP request, a scheduled cron job, or a database event.
            </p>

            <div className="rounded-[1.5rem] border-l-4 border-[#d4a11e] bg-white/70 p-6 shadow-[0_16px_40px_rgba(110,84,29,0.07)]">
              <h4 className="mb-2 font-[family:var(--font-display)] text-lg font-semibold tracking-[-0.02em] text-[#241d16]">How it works</h4>
              <ol className="list-decimal list-inside space-y-2 text-[#65594b]">
                <li>Write your function code in one of our supported languages.</li>
                <li>We containerize your code automatically.</li>
                <li>We invoke your container when a request comes in.</li>
                <li>We scale your function from 0 to 1,000+ instances instantly.</li>
              </ol>
            </div>
          </section>

          <section id="anatomy" className="mb-16">
            <h2 className="mb-6 font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] text-[#241d16]">Function Anatomy</h2>
            <p className="mb-6 text-[#65594b] leading-7">
              Regardless of the language, every function follows the same input/output contract. This strict contract allows us to normalize requests from different sources.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-[1.5rem] border border-[#e7e7e0] bg-white p-5 shadow-[0_12px_28px_rgba(20,20,20,0.04)]">
                <div className="mb-3 flex items-center gap-2 text-[#9f7b26]">
                  <Activity size={18} />
                  <h3 className="font-[family:var(--font-display)] font-semibold tracking-[-0.02em] text-[#241d16]">Input (Args)</h3>
                </div>
                <p className="mb-2 text-sm leading-6 text-[#65594b]">
                  Your function receives a single parameter (usually called <code>args</code>). This contains:
                </p>
                <ul className="ml-1 list-disc list-inside space-y-1 text-sm text-[#7a6d5f]">
                  <li>HTTP Query Parameters</li>
                  <li>HTTP Body (JSON)</li>
                  <li>Path Parameters</li>
                </ul>
              </div>

              <div className="rounded-[1.5rem] border border-[#e7e7e0] bg-white p-5 shadow-[0_12px_28px_rgba(20,20,20,0.04)]">
                <div className="mb-3 flex items-center gap-2 text-[#2f7a5a]">
                  <Zap size={18} />
                  <h3 className="font-[family:var(--font-display)] font-semibold tracking-[-0.02em] text-[#241d16]">Output (Return)</h3>
                </div>
                <p className="mb-2 text-sm leading-6 text-[#65594b]">
                  You must return a JSON object (or Dictionary).
                </p>
                <ul className="ml-1 list-disc list-inside space-y-1 text-sm text-[#7a6d5f]">
                  <li><code className="text-[#9f7b26]">body</code>: The actual response data.</li>
                  <li><code className="text-[#9f7b26]">statusCode</code>: (Optional) HTTP status.</li>
                  <li><code className="text-[#9f7b26]">headers</code>: (Optional) Custom headers.</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="runtimes" className="mb-16 scroll-mt-24">
            <h2 className="mb-6 flex items-center gap-2 font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] text-[#241d16]">
              <Code className="text-[#9f7b26]" />
              Runtime Examples
            </h2>

            <p className="mb-6 text-[#65594b] leading-7">
              Select your preferred language to see the boilerplate code. This code is ready to deploy immediately.
            </p>

            <div className="mb-6 flex gap-6 overflow-x-auto border-b border-[#e4d7be]">
              {['nodejs', 'python', 'go', 'swift', 'php'].map((lang) => (
                <TabButton
                  key={lang}
                  active={activeTab === lang}
                  onClick={() => setActiveTab(lang)}
                >
                  {lang === 'nodejs' ? 'Node.js' : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </TabButton>
              ))}
            </div>

            <div className="group relative overflow-hidden rounded-[1.5rem] border border-[#e7e7e0] bg-white shadow-[0_18px_34px_rgba(20,20,20,0.05)]">
              <div className="flex items-center justify-between border-b border-[#e8dcc2] bg-[#fbf3e2] px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full border border-[#e8b8af] bg-[#f0c6ba]" />
                  <div className="h-3 w-3 rounded-full border border-[#ead498] bg-[#f4d36b]" />
                  <div className="h-3 w-3 rounded-full border border-[#bfd5c4] bg-[#bbdbc4]" />
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#8d7b64]">{activeTab} Environment</span>
              </div>

              <CodeContent language={activeTab} />
            </div>

            <div className="mt-6 flex gap-3 rounded-[1.25rem] border border-[#dfe2ff] bg-[#f3f5ff] p-4">
              <Info className="mt-0.5 shrink-0 text-[#a07110]" size={20} />
              <div>
                <h4 className="mb-1 text-sm font-semibold text-[#7f6118]">Language Specific Note</h4>
                <p className="text-sm leading-6 text-[#65594b]">
                  {activeTab === 'nodejs' && "We run Node.js 18.x LTS. 'require' is supported, but ES Modules (import/export) require setting 'type': 'module' in package.json."}
                  {activeTab === 'python' && 'Supported version: Python 3.9. External libraries (pip) can be included by uploading a requirements.txt file.'}
                  {activeTab === 'go' && 'We compile your Go code using Go 1.20. Ensure your function is exported (Capitalized) so our runtime can access it.'}
                  {activeTab === 'swift' && 'Swift 5.7 runtime. Ideal for high-performance compute tasks where type safety is critical.'}
                  {activeTab === 'php' && 'PHP 8.2 runtime. Arrays are automatically converted to JSON responses.'}
                </p>
              </div>
            </div>
          </section>

          <section id="best-practices" className="mb-16">
            <h2 className="mb-6 flex items-center gap-2 font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] text-[#241d16]">
              <Shield className="text-[#2f7a5a]" />
              Best Practices
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              <InfoCard title="Statelessness">
                Functions should be stateless. Do not rely on local variables persisting between requests. Use a database (like Redis or MongoDB) for state.
              </InfoCard>
              <InfoCard title="Execution Time">
                Keep functions fast. The default timeout is 60 seconds. Long-running tasks should be offloaded to a background worker or queue.
              </InfoCard>
              <InfoCard title="Error Handling">
                Always return standard HTTP status codes in your response body or error object to trigger retries properly.
              </InfoCard>
              <InfoCard title="Dependencies">
                Keep your deployment package small. Remove devDependencies before deploying to ensure faster cold starts.
              </InfoCard>
            </div>
          </section>

          <section id="logging" className="mb-16">
            <h2 className="mb-6 flex items-center gap-2 font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] text-[#241d16]">
              <Activity className="text-[#9f7b26]" />
              Logging & Monitoring
            </h2>
            <p className="mb-6 text-[#65594b] leading-7">
              ServerlessFlow automatically captures standard output (stdout) and standard error (stderr) streams. You do not need a third-party logging library.
            </p>

            <div className="rounded-[1.5rem] border border-[#e7e7e0] bg-white p-6 shadow-[0_12px_28px_rgba(20,20,20,0.04)]">
              <h3 className="mb-4 font-[family:var(--font-display)] text-xl font-semibold tracking-[-0.02em] text-[#241d16]">How to view logs</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 rounded bg-[#fff4cf] p-1.5 text-[#a07110]"><Terminal size={16} /></div>
                  <div>
                    <strong className="text-[#2d241c]">Dashboard Stream:</strong>
                    <p className="text-sm leading-6 text-[#65594b]">Navigate to your function details page. The &quot;Real-time Logs&quot; tab shows a live websocket connection to your running container.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 rounded bg-[#fff4cf] p-1.5 text-[#a07110]"><Code size={16} /></div>
                  <div>
                    <strong className="text-[#2d241c]">Structured Logging:</strong>
                    <p className="text-sm leading-6 text-[#65594b]">If you print a JSON string (e.g. <code className="rounded bg-[#f7f0df] px-1 text-xs text-[#7f6118]">console.log(JSON.stringify(obj))</code>), our dashboard will automatically parse and format it for easier reading.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <section id="env-vars" className="mb-16">
            <h2 className="mb-6 font-[family:var(--font-display)] text-2xl font-semibold tracking-[-0.02em] text-[#241d16]">Environment Variables</h2>
            <div className="flex items-start gap-4 rounded-[1.25rem] border border-[#efcf95] bg-[#fff1c7] p-4">
              <AlertTriangle className="mt-1 shrink-0 text-[#b77908]" size={20} />
              <div>
                <h4 className="text-sm font-semibold text-[#7f6118]">Security Warning</h4>
                <p className="mt-1 text-sm leading-6 text-[#65594b]">
                  Never hardcode API keys or database passwords in your function code. Use the &quot;Settings&quot; tab in your dashboard to add encrypted environment variables.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[rgba(251,246,234,0.96)] p-8 backdrop-blur-sm">
          <button onClick={() => setMobileMenuOpen(false)} className="mb-8 self-end text-[#65594b] hover:text-[#221c15]"><X size={32} /></button>
          <nav className="flex flex-col gap-6 text-xl font-medium text-[#221c15]">
            <button onClick={() => scrollToSection('intro')} className="text-left">Introduction</button>
            <button onClick={() => scrollToSection('runtimes')} className="text-left">Runtimes</button>
            <button onClick={() => scrollToSection('best-practices')} className="text-left">Best Practices</button>
            <button onClick={() => scrollToSection('logging')} className="text-left">Logging</button>
          </nav>
        </div>
      )}
    </div>
  );
}

function DocGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 pl-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#8b7d6e]">{title}</h3>
      <div className="flex flex-col space-y-1">{children}</div>
    </div>
  );
}

function DocLink({ children, active, onClick }: { children: React.ReactNode; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${active ? 'bg-[#fff1c7] text-[#7f6118]' : 'text-[#65594b] hover:bg-white/80 hover:text-[#221c15]'}`}
    >
      {children}
    </button>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`border-b-2 px-1 pb-3 text-sm font-medium whitespace-nowrap transition-colors ${active ? 'border-[#d4a11e] text-[#221c15]' : 'border-transparent text-[#8b7d6e] hover:text-[#4d4235]'}`}
    >
      {children}
    </button>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[1.5rem] border border-[#e7e7e0] bg-white p-5 shadow-[0_12px_28px_rgba(20,20,20,0.04)] transition-colors hover:border-[#dbc9ab]">
      <h4 className="mb-2 font-[family:var(--font-display)] font-semibold tracking-[-0.02em] text-[#241d16]">{title}</h4>
      <p className="text-sm leading-6 text-[#65594b]">{children}</p>
    </div>
  );
}

function CodeContent({ language }: { language: string }) {
  const [copied, setCopied] = useState(false);

  const codes: Record<string, string> = {
    nodejs: `function main(args) {
    // 1. Parse Input
    let name = args.name || 'stranger';

    // 2. Do Logic
    let greeting = 'Hello ' + name + '!';
    console.log("Processing request for: " + name);

    // 3. Return JSON
    return { "body": greeting };
}`,
    python: `def main(args):
    # 1. Parse Input
    name = args.get("name", "stranger")

    # 2. Do Logic
    greeting = "Hello " + name + "!"
    print(f"Processing request for: {name}")

    # 3. Return Dict
    return {"body": greeting}`,
    swift: `func main(args: [String:Any]) -> [String:Any] {
    // 1. Parse Input safely
    if let name = args["name"] as? String {
        let greeting = "Hello \\(name)!"
        print("Log: Processing for \\(name)")
        return [ "body" : greeting ]
    } else {
        return [ "body" : "Hello stranger!" ]
    }
}`,
    go: `package main

import "fmt"

// Exported function (Capitalized)
func Main(args map[string]interface{}) map[string]interface{} {
    // 1. Type Assertion
    name, ok := args["name"].(string)
    if !ok {
        name = "stranger"
    }

    // 2. Logic
    fmt.Println("Log: Processing request...")

    // 3. Return Map
    msg := make(map[string]interface{})
    msg["body"] = "Hello, " + name + "!"
    return msg
}`,
    php: `<?php
function main(array $args) : array {
    // 1. Null Coalescing for default
    $name = $args["name"] ?? "stranger";

    // 2. Logic
    $greeting = "Hello $name!";

    // 3. Stdout is captured as logs
    echo "Log: Processing for $name";

    return ["body" => $greeting];
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
        className="absolute top-4 right-4 z-10 rounded-md border border-[#e7e7e0] bg-white p-2 text-[#6c6c66] transition-all hover:bg-[#f3f5ff] hover:text-[#171717]"
        title="Copy code"
      >
        {copied ? <Check size={16} className="text-[#2f7a5a]" /> : <Copy size={16} />}
      </button>

      <pre className="overflow-x-auto bg-[#fffdfa] p-6 font-mono text-sm leading-relaxed text-[#43382d]">
        <code>{codes[language]}</code>
      </pre>
    </div>
  );
}
