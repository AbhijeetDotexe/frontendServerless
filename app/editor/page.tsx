'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { 
  Save, Settings, Tag, Globe, Lock, 
  ChevronDown, CheckCircle, AlertCircle, 
  Code, Loader, Play, Terminal, Clock, ExternalLink, Copy
} from 'lucide-react';

// --- 1. CONFIGURATION: Updated Runtime Strings ---
const LANGUAGES = {
  nodejs: { 
    label: 'Node.js 18', 
    monacoLanguage: 'javascript', 
    backendRuntime: 'nodejs:18', // <--- FIXED: Matches backend requirement
    boilerplate: `function main(params) {\n  const name = params.name || 'World';\n  return { payload: "Hello " + name + "!" };\n}` 
  },
  python: { 
    label: 'Python 3.11', 
    monacoLanguage: 'python', 
    backendRuntime: 'python:3.11', // <--- FIXED
    boilerplate: `def main(args):\n    name = args.get("name", "World")\n    return { "payload": f"Hello {name}!" }` 
  },
  go: { 
    label: 'Go 1.20', 
    monacoLanguage: 'go', 
    backendRuntime: 'go:1.20', // <--- FIXED
    boilerplate: `package main\nimport "fmt"\nfunc Main(args map[string]interface{}) map[string]interface{} {\n  return map[string]interface{}{"payload": "Hello World"}\n}` 
  },
  swift: { 
    label: 'Swift 5.7', 
    monacoLanguage: 'swift', 
    backendRuntime: 'swift:5.7', // <--- FIXED
    boilerplate: `func main(args: [String:Any]) -> [String:Any] {\n    return [ "payload" : "Hello World!" ]\n}` 
  },
  php: { 
    label: 'PHP 8.1', 
    monacoLanguage: 'php', 
    backendRuntime: 'php:8.1', // <--- FIXED
    boilerplate: `<?php\nfunction main(array $args) : array {\n    return ["payload" => "Hello World!"];\n}` 
  }
};

type LanguageKey = keyof typeof LANGUAGES;

function EditorContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const functionId = searchParams.get('id');

  // --- Form State ---
  const [name, setName] = useState('Untitled Function');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('utility');
  const [complexity, setComplexity] = useState('simple');

  // --- Editor State ---
  const [selectedLang, setSelectedLang] = useState<LanguageKey>('nodejs');
  const [code, setCode] = useState(LANGUAGES['nodejs'].boilerplate);
  
  // --- Loading States ---
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFetching, setIsFetching] = useState(!!functionId);

  // --- Output State ---
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionMeta, setExecutionMeta] = useState<any>(null);
  const [showOutput, setShowOutput] = useState(true);

  // --- Toast ---
  const [toast, setToast] = useState<{ show: boolean, type: 'success' | 'error', message: string }>({
    show: false, type: 'success', message: ''
  });

  // Protect Route
  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  // Fetch Logic
  useEffect(() => {
    if (functionId && user) {
      const fetchFunctionDetails = async () => {
        setIsFetching(true);
        try {
          const token = localStorage.getItem('authToken');
          const res = await fetch(`http://localhost:3002/api/functions/${functionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.data) {
            const func = data.data;
            setName(func.name);
            setDescription(func.description || '');
            setCode(func.code);
            
            // Map the backend runtime string back to our internal key if possible
            // OR just default to nodejs if not found
            const foundKey = Object.keys(LANGUAGES).find(key => 
              LANGUAGES[key as LanguageKey].backendRuntime === func.runtime
            );
            setSelectedLang((foundKey as LanguageKey) || 'nodejs');

            setTags(func.tags || []);
            setIsPublic(func.isPublic);
            if(func.metadata) {
              setCategory(func.metadata.category || 'utility');
              setComplexity(func.metadata.complexity || 'simple');
            }
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsFetching(false);
        }
      };
      fetchFunctionDetails();
    }
  }, [functionId, user]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 4000);
  };

  // --- Save / Deploy Logic ---
  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      name, 
      description, 
      code, 
      runtime: LANGUAGES[selectedLang].backendRuntime, // <--- FIXED: Send "nodejs:18"
      tags, 
      isPublic, 
      metadata: { category, complexity }
    };

    try {
      const token = localStorage.getItem('authToken');
      let url = 'http://localhost:3002/api/functions';
      let method = 'POST';
      if (functionId) {
        url = `http://localhost:3002/api/functions/${functionId}`;
        method = 'PUT'; 
      }
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        showToast('success', functionId ? 'Function updated!' : 'Function created!');
        if (!functionId && data.data && data.data.uuid) {
          router.replace(`/editor?id=${data.data.uuid}`);
        }
      } else {
        showToast('error', data.message || 'Failed to save.');
      }
    } catch (error) {
      showToast('error', 'Network error.');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Execute / Test Logic ---
  const handleExecute = async () => {
    if (!functionId) {
      showToast('error', 'Please save/deploy the function first.');
      return;
    }

    setIsExecuting(true);
    setExecutionResult(null);
    setExecutionMeta(null);
    setShowOutput(true);

    try {
      const token = localStorage.getItem('authToken');
      const testPayload = { name: "Abhijeet" };

      const response = await fetch(`http://localhost:3002/api/execute/${functionId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ payload: testPayload })
      });

      const data = await response.json();
      
      if (data.success && data.data) {
        setExecutionResult(data.data.result);
        setExecutionMeta({
          duration: data.data.executionTime,
          status: data.data.status,
          webUrl: data.data.webActionUrl,
          timestamp: new Date().toISOString()
        });
      } else {
        setExecutionResult({ error: data.message || "Execution failed" });
      }
    } catch (error) {
      setExecutionResult({ error: "Network Error: Could not reach execution server." });
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('success', 'Copied to clipboard');
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (t: string) => setTags(tags.filter(tag => tag !== t));

  if (authLoading || isFetching) {
    return <div className="flex items-center justify-center h-screen bg-[#0F1117] text-slate-400"><Loader className="animate-spin mr-2" /> Loading...</div>;
  }

  return (
    // FIXED: Main container is strictly h-screen and hidden overflow to prevent window scrolling
    <div className="flex-1 flex pt-16 h-screen w-screen overflow-hidden relative">
      
      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-md ${toast.type === 'success' ? 'bg-slate-900/90 border-green-500/30 text-green-400' : 'bg-slate-900/90 border-red-500/30 text-red-400'}`}>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-bold text-white">{toast.message}</span>
        </div>
      </div>

      {/* --- Sidebar (Left) --- */}
      <aside className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800 shrink-0">
        <div className="p-6 space-y-8">
           <div className="flex items-center gap-2 text-indigo-400">
            <Settings size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Configuration</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm text-white focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-sm text-white outline-none resize-none" />
            </div>
          </div>
          <div className="h-px bg-slate-800"></div>
          <div>
              <label className="block text-xs text-slate-500 mb-2">Tags</label>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-indigo-500/20 text-indigo-300 text-xs px-2 py-1 rounded flex items-center gap-1">
                    {tag} <button onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Add tag..." className="bg-transparent outline-none text-xs flex-1 min-w-[60px]" />
              </div>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col gap-3">
            <button onClick={handleSave} disabled={isSaving} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 text-sm transition-all shadow-lg shadow-indigo-500/20">
              {isSaving ? <Loader className="animate-spin" size={16} /> : <><Save size={16} /> {functionId ? 'Update' : 'Deploy'}</>}
            </button>
        </div>
      </aside>

      {/* --- Main Content (Right) --- */}
      {/* FIXED: Added 'min-w-0' to prevent flex item overflow and ensure correct resizing */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] min-w-0 overflow-hidden">
        
        {/* Editor Toolbar */}
        <div className="h-12 bg-[#1e1e1e] border-b border-[#333] flex items-center justify-between px-4 shrink-0">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#2d2d2d] border border-[#444] rounded px-3 py-1">
                <Code size={14} className="text-indigo-400" />
                <select value={selectedLang} onChange={(e) => setSelectedLang(e.target.value as LanguageKey)} className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer">
                  {Object.entries(LANGUAGES).map(([key, lang]) => (
                    <option key={key} value={key} className="bg-[#2d2d2d]">{lang.label}</option>
                  ))}
                </select>
              </div>
           </div>
           
           <button 
             onClick={handleExecute}
             disabled={isExecuting || !functionId}
             className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-all ${
               !functionId 
                ? 'bg-[#2d2d2d] text-slate-500 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'
             }`}
           >
             {isExecuting ? <Loader className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
             {isExecuting ? 'Running...' : 'Test Run'}
           </button>
        </div>

        {/* Monaco Editor */}
        {/* FIXED: 'flex-1' will now properly fill the remaining height above the console */}
        <div className="flex-1 relative min-h-0">
            <Editor
              height="100%"
              language={LANGUAGES[selectedLang].monacoLanguage}
              theme="vs-dark"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
            />
        </div>

        {/* --- Output Panel --- */}
        {/* FIXED: Height transition is now handled by styles, and shrink-0 prevents it from pushing layout */}
        <div 
          className="border-t border-[#333] bg-[#161821] flex flex-col transition-all duration-300 ease-in-out shrink-0"
          style={{ height: showOutput ? '320px' : '40px' }} 
        >
           {/* Output Header */}
           <div 
             className="flex items-center justify-between px-4 h-10 bg-[#1e1e1e] cursor-pointer hover:bg-[#252525] select-none border-b border-[#333] shrink-0"
             onClick={() => setShowOutput(!showOutput)}
           >
              <div className="flex items-center gap-2 text-slate-400">
                <Terminal size={14} />
                <span className="text-xs font-mono font-bold uppercase">Console / Output</span>
              </div>
              <ChevronDown size={16} className={`text-slate-500 transition-transform duration-300 ${showOutput ? '' : 'rotate-180'}`} />
           </div>

           {/* Output Content */}
           <div className={`flex-1 overflow-auto p-4 font-mono text-sm ${showOutput ? 'opacity-100' : 'opacity-0'}`}>
              
              {!executionResult && !isExecuting && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600">
                  <Play size={24} className="mb-2 opacity-50" />
                  <p>Click "Test Run" to execute your function.</p>
                </div>
              )}

              {isExecuting && (
                <div className="h-full flex items-center justify-center text-slate-500 gap-2">
                  <Loader className="animate-spin text-indigo-500" size={20} />
                  <span>Executing function...</span>
                </div>
              )}

              {executionResult && (
                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                  
                  {/* Status Bar */}
                  <div className="flex items-center gap-4 text-xs border-b border-slate-800 pb-3">
                     <span className={`px-2 py-0.5 rounded font-bold ${executionMeta?.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                       {executionMeta?.status === 'success' ? '200 OK' : 'Error'}
                     </span>
                     <span className="flex items-center gap-1 text-slate-500">
                       <Clock size={12} /> {executionMeta?.duration || '0ms'}
                     </span>
                  </div>

                  {/* URL Display Section */}
                  {executionMeta?.webUrl && (
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                       <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                         <Globe size={12} /> Web Endpoint
                       </p>
                       <div className="flex items-center justify-between gap-2">
                         <a 
                           href={executionMeta.webUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-indigo-400 text-xs hover:underline truncate flex-1 flex items-center gap-1"
                         >
                           {executionMeta.webUrl} <ExternalLink size={10} />
                         </a>
                         <button 
                           onClick={() => copyToClipboard(executionMeta.webUrl)}
                           className="text-slate-500 hover:text-white transition-colors"
                           title="Copy URL"
                         >
                           <Copy size={14} />
                         </button>
                       </div>
                    </div>
                  )}

                  {/* JSON Output */}
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Response Body:</p>
                    <pre className="text-green-400 whitespace-pre-wrap break-all bg-slate-950 p-3 rounded-lg border border-slate-800/50">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <div className="min-h-screen bg-[#0F1117] text-slate-200 flex flex-col font-sans relative">
      <Navbar />
      <Suspense fallback={<div className="text-white p-10">Loading...</div>}>
        <EditorContent />
      </Suspense>
    </div>
  );
}