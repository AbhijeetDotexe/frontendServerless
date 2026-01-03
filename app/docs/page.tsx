'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  AlertTriangle
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
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <div className="pt-20 max-w-7xl mx-auto flex">
        
        {/* --- Sidebar Navigation (Desktop) --- */}
        <aside className="hidden lg:block w-64 fixed h-[calc(100vh-5rem)] overflow-y-auto border-r border-slate-800 pr-4 pb-10 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="space-y-8 mt-8">
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

        {/* --- Mobile Menu Toggle --- */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-50 hover:bg-indigo-500 transition-colors"
        >
          <Menu size={24} />
        </button>

        {/* --- Main Content --- */}
        <main className="flex-1 lg:pl-72 px-6 py-8 pb-24 max-w-5xl">
          
          {/* Section: Introduction */}
          <section id="intro" className="mb-16">
            <div className="flex items-center gap-2 text-indigo-400 mb-4">
              <Book size={20} />
              <span className="text-sm font-bold tracking-wider uppercase">Documentation</span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-6">Writing Serverless Functions</h1>
            <p className="text-lg text-slate-400 leading-relaxed mb-6">
              ServerlessFlow allows you to deploy code without provisioning servers. Your functions are event-driven, meaning they run only when triggered by an HTTP request, a scheduled cron job, or a database event.
            </p>
            
            <div className="bg-slate-900/50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
              <h4 className="text-white font-bold text-lg mb-2">How it works</h4>
              <ol className="list-decimal list-inside space-y-2 text-slate-400">
                <li>Write your function code in one of our supported languages.</li>
                <li>We containerize your code automatically.</li>
                <li>We invoke your container when a request comes in.</li>
                <li>We scale your function from 0 to 1,000+ instances instantly.</li>
              </ol>
            </div>
          </section>

          {/* Section: Anatomy */}
          <section id="anatomy" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Function Anatomy</h2>
            <p className="text-slate-400 mb-6">
              Regardless of the language, every function follows the same input/output contract. This strict contract allows us to normalize requests from different sources.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 mb-3 text-blue-400">
                    <Activity size={18} />
                    <h3 className="font-bold text-white">Input (Args)</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    Your function receives a single parameter (usually called <code>args</code>). This contains:
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-500 space-y-1 ml-1">
                    <li>HTTP Query Parameters</li>
                    <li>HTTP Body (JSON)</li>
                    <li>Path Parameters</li>
                  </ul>
               </div>

               <div className="bg-slate-900 p-5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2 mb-3 text-green-400">
                    <Zap size={18} />
                    <h3 className="font-bold text-white">Output (Return)</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">
                    You must return a JSON object (or Dictionary).
                  </p>
                  <ul className="list-disc list-inside text-sm text-slate-500 space-y-1 ml-1">
                    <li><code className="text-indigo-400">body</code>: The actual response data.</li>
                    <li><code className="text-indigo-400">statusCode</code>: (Optional) HTTP status.</li>
                    <li><code className="text-indigo-400">headers</code>: (Optional) Custom headers.</li>
                  </ul>
               </div>
            </div>
          </section>

          {/* Section: Runtimes */}
          <section id="runtimes" className="mb-16 scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Code className="text-purple-400" />
              Runtime Examples
            </h2>
            
            <p className="text-slate-400 mb-6">
              Select your preferred language to see the boilerplate code. This code is ready to deploy immediately.
            </p>

            {/* Language Tabs */}
            <div className="border-b border-slate-800 flex gap-6 mb-6 overflow-x-auto">
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

            {/* Code Block Display */}
            <div className="relative group rounded-xl overflow-hidden shadow-2xl bg-[#0F1117] border border-slate-800">
               <div className="flex justify-between items-center px-4 py-3 bg-slate-900/50 border-b border-slate-800">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                  </div>
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{activeTab} Environment</span>
               </div>
               
               <CodeContent language={activeTab} />
            </div>

            {/* Language Specific Notes */}
            <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3">
              <Info className="text-blue-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-blue-400 font-bold text-sm mb-1">Language Specific Note</h4>
                <p className="text-sm text-slate-400">
                  {activeTab === 'nodejs' && "We run Node.js 18.x LTS. 'require' is supported, but ES Modules (import/export) require setting 'type': 'module' in package.json."}
                  {activeTab === 'python' && "Supported version: Python 3.9. External libraries (pip) can be included by uploading a requirements.txt file."}
                  {activeTab === 'go' && "We compile your Go code using Go 1.20. Ensure your function is exported (Capitalized) so our runtime can access it."}
                  {activeTab === 'swift' && "Swift 5.7 runtime. Ideal for high-performance compute tasks where type safety is critical."}
                  {activeTab === 'php' && "PHP 8.2 runtime. Arrays are automatically converted to JSON responses."}
                </p>
              </div>
            </div>
          </section>

          {/* Section: Best Practices */}
          <section id="best-practices" className="mb-16">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Shield className="text-green-400" />
              Best Practices
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
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

          {/* Section: Logging */}
          <section id="logging" className="mb-16">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="text-yellow-400" />
              Logging & Monitoring
            </h2>
            <p className="text-slate-400 mb-6">
              ServerlessFlow automatically captures standard output (stdout) and standard error (stderr) streams. You do not need a third-party logging library.
            </p>

            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
              <h3 className="text-white font-semibold mb-4">How to view logs</h3>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded text-indigo-400 mt-0.5"><Terminal size={16} /></div>
                  <div>
                    <strong className="text-slate-200">Dashboard Stream:</strong>
                    <p className="text-sm text-slate-400">Navigate to your function details page. The "Real-time Logs" tab shows a live websocket connection to your running container.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="bg-slate-800 p-1.5 rounded text-indigo-400 mt-0.5"><Code size={16} /></div>
                  <div>
                    <strong className="text-slate-200">Structured Logging:</strong>
                    <p className="text-sm text-slate-400">If you print a JSON string (e.g. <code className="bg-slate-800 px-1 rounded text-xs">console.log(JSON.stringify(obj))</code>), our dashboard will automatically parse and format it for easier reading.</p>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Section: Environment Variables */}
          <section id="env-vars" className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6">Environment Variables</h2>
            <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg flex gap-4 items-start">
              <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={20} />
              <div>
                <h4 className="text-yellow-500 font-semibold text-sm">Security Warning</h4>
                <p className="text-sm text-slate-400 mt-1">
                  Never hardcode API keys or database passwords in your function code. Use the "Settings" tab in your dashboard to add encrypted environment variables.
                </p>
              </div>
            </div>
          </section>

        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-sm p-8 flex flex-col">
          <button onClick={() => setMobileMenuOpen(false)} className="self-end text-slate-400 mb-8 hover:text-white"><X size={32}/></button>
          <nav className="flex flex-col gap-6 text-xl font-medium">
             <button onClick={() => scrollToSection('intro')} className="text-left text-white">Introduction</button>
             <button onClick={() => scrollToSection('runtimes')} className="text-left text-white">Runtimes</button>
             <button onClick={() => scrollToSection('best-practices')} className="text-left text-white">Best Practices</button>
             <button onClick={() => scrollToSection('logging')} className="text-left text-white">Logging</button>
          </nav>
        </div>
      )}
    </div>
  );
}

/* --- Sub-Components --- */

function DocGroup({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 pl-3">{title}</h3>
      <div className="flex flex-col space-y-1">{children}</div>
    </div>
  );
}

function DocLink({ children, active, onClick }: { children: React.ReactNode, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
    >
      {children}
    </button>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${active ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
    >
      {children}
    </button>
  );
}

function InfoCard({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="bg-slate-900 p-5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors">
      <h4 className="text-white font-bold mb-2">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{children}</p>
    </div>
  );
}

// Updated Code Content Component with COPY Functionality
function CodeContent({ language }: { language: string }) {
  const [copied, setCopied] = useState(false);

  const codes: any = {
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
}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codes[language]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2s
  };

  return (
    <div className="relative">
      <button 
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition-all z-10"
        title="Copy code"
      >
        {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
      </button>

      <pre className="font-mono text-sm leading-relaxed text-slate-300 p-6 overflow-x-auto bg-[#0F1117]">
        <code>{codes[language]}</code>
      </pre>
    </div>
  );
}