// app/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar'; // Ensure this path matches your structure
import { 
  Zap, 
  Shield, 
  Users, 
  Activity, 
  Code2, 
  Cpu,
  ArrowRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
      
      {/* --- Global Navbar (Handles Auth State) --- */}
      <Navbar />

      {/* --- Hero Section --- */}
      <main className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Serverless Flow Function v2.0
            </div>
            
            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your Modern <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Function Workspace
              </span>
            </h1>
            
            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Write, test, and deploy serverless functions with ease. Experience real-time logs, intelligent debugging, and seamless scaling.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-950 px-6 py-3.5 rounded-lg font-bold hover:bg-slate-200 transition-colors">
                  Write Functions Now
                  <ArrowRight size={18} />
                </button>
              </Link>
              <a href="#features">
                <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-medium border border-slate-700 hover:border-slate-500 hover:bg-slate-900 transition-all">
                  Explore Features
                </button>
              </a>
            </div>
          </div>

          {/* Right: Abstract Illustration */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-hidden">
              <div className="grid grid-cols-3 gap-4 items-center opacity-90">
                <div className="flex flex-col gap-6">
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-3">
                    <Code2 className="text-blue-400" size={20} />
                    <span className="text-xs font-mono text-slate-300">func.js</span>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-3 opacity-50">
                    <Code2 className="text-slate-400" size={20} />
                    <span className="text-xs font-mono text-slate-300">api.ts</span>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                   <Zap className="text-yellow-400 animate-pulse" size={24} />
                   <div className="h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 shadow-lg shadow-indigo-500/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-green-400 font-bold">Success</span>
                      <span className="text-[10px] text-slate-500">24ms</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                   <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                     <Cpu className="text-purple-400 mb-2" size={20} />
                     <div className="text-[10px] text-slate-400">Auto-Scaling...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- Features Grid Section --- */}
        <div id="features" className="mt-24 grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-20"></div>
            <div className="relative bg-[#0F1117] rounded-xl border border-slate-800 shadow-2xl overflow-hidden h-full flex flex-col">
              <div className="px-4 py-3 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="ml-4 px-3 py-1 bg-slate-800 rounded text-[10px] text-slate-400 font-mono">
                  sample_worker.ts
                </div>
              </div>
              <div className="p-6 font-mono text-sm overflow-hidden flex-1">
                 <div className="flex gap-4">
                    <div className="text-slate-600 select-none flex flex-col text-right">
                      {Array.from({length: 12}).map((_, i) => <span key={i}>{i + 1}</span>)}
                    </div>
                    <div className="text-slate-300">
                      <p><span className="text-purple-400">import</span> Code <span className="text-purple-400">from</span> <span className="text-green-400">"@/core"</span>;</p>
                      <p className="mt-2"><span className="text-purple-400">export async function</span> <span className="text-yellow-300">handler</span>(event) {'{'}</p>
                      <p className="pl-4"><span className="text-slate-500">// Initialize secure environment</span></p>
                      <p className="pl-4 mt-2"><span className="text-purple-400">const</span> response = <span className="text-purple-400">await</span> db.query({'{'}</p>
                      <p className="pl-8">id: event.userId,</p>
                      <p className="pl-8">status: <span className="text-green-400">"active"</span></p>
                      <p className="pl-4">{'}'});</p>
                      <p className="pl-4 mt-2"><span className="text-purple-400">return</span> {'{'}</p>
                      <p className="pl-8">statusCode: <span className="text-orange-400">200</span>,</p>
                      <p className="pl-4">{'}'};</p>
                      <p>{'}'}</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FeatureCard 
              icon={<Zap className="text-yellow-400" />}
              title="Instant Deployment"
              desc="Push to git and your functions are live globally in seconds."
              color="border-yellow-500/20 hover:border-yellow-500/50"
            />
            <FeatureCard 
              icon={<Activity className="text-purple-400" />}
              title="Detailed Logging"
              desc="Real-time streaming logs and granular monitoring metrics."
              color="border-purple-500/20 hover:border-purple-500/50"
            />
            <FeatureCard 
              icon={<Shield className="text-green-400" />}
              title="Secure Env"
              desc="Bank-grade encryption for environment variables and secrets."
              color="border-green-500/20 hover:border-green-500/50"
            />
            <FeatureCard 
              icon={<Users className="text-blue-400" />}
              title="Collab Coding"
              desc="Invite your team and code together in real-time workspaces."
              color="border-blue-500/20 hover:border-blue-500/50"
            />
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-slate-800 bg-slate-950 mt-12">
         <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
            <p>© 2024 ServerlessFlow Inc. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#" className="hover:text-white">Privacy</a>
               <a href="#" className="hover:text-white">Terms</a>
               <a href="#" className="hover:text-white">Twitter</a>
               <a href="#" className="hover:text-white">GitHub</a>
            </div>
         </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) {
  return (
    <div className={`p-5 rounded-xl bg-slate-900 border ${color} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group`}>
      <div className="mb-4 p-2 bg-slate-950 rounded-lg w-fit border border-slate-800 group-hover:border-slate-600 transition-colors">
        {icon}
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-400 leading-snug">{desc}</p>
    </div>
  );
}