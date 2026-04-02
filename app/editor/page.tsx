'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { 
  Save, Settings, Tag, Globe, Lock, 
  ChevronDown, CheckCircle, AlertCircle, 
  Code, Loader, Play, Terminal, Clock, ExternalLink, Copy, AlertTriangle
} from 'lucide-react';

// --- 1. CONFIGURATION: Updated Boilerplates ---
const LANGUAGES = {
  nodejs: { 
    label: 'Node.js 18', 
    monacoLanguage: 'javascript', 
    backendRuntime: 'nodejs:18',
    boilerplate: `function main(params) {\n  const name = params.name || 'stranger';\n  console.log("Log: Processing for " + name);\n  return { body: "Hello " + name + "!" };\n}` 
  },
  python: { 
    label: 'Python 3.11', 
    monacoLanguage: 'python', 
    backendRuntime: 'python:3.11',
    boilerplate: `def main(args):\n    # 1. Parse Input\n    name = args.get("name", "stranger")\n    \n    # 2. Do Logic\n    greeting = "Hello " + name + "!"\n    print(f"Processing request for: {name}")\n    \n    # 3. Return Dict\n    return {"body": greeting}` 
  },
  go: { 
    label: 'Go 1.20', 
    monacoLanguage: 'go', 
    backendRuntime: 'go:1.20',
    boilerplate: `package main\n\nimport "fmt"\n\n// Exported function (Capitalized)\nfunc Main(args map[string]interface{}) map[string]interface{} {\n    // 1. Type Assertion\n    name, ok := args["name"].(string)\n    if !ok {\n        name = "stranger"\n    }\n    \n    // 2. Logic\n    fmt.Println("Log: Processing request...")\n    \n    // 3. Return Map\n    msg := make(map[string]interface{})\n    msg["body"] = "Hello, " + name + "!"\n    return msg\n}` 
  },
  // swift: { 
  //   label: 'Swift 5.7', 
  //   monacoLanguage: 'swift', 
  //   backendRuntime: 'swift:5.7',
  //   boilerplate: `func main(args: [String:Any]) -> [String:Any] {\n    // 1. Parse Input safely\n    if let name = args["name"] as? String {\n        let greeting = "Hello \\(name)!"\n        print("Log: Processing for \\(name)")\n        return [ "body" : greeting ]\n    } else {\n        return [ "body" : "Hello stranger!" ]\n    }\n}` 
  // },
  // php: { 
  //   label: 'PHP 8.1', 
  //   monacoLanguage: 'php', 
  //   backendRuntime: 'php:8.1',
  //   boilerplate: `<?php\nfunction main(array $args) : array {\n    // 1. Null Coalescing for default\n    $name = $args["name"] ?? "stranger";\n    \n    // 2. Logic\n    $greeting = "Hello $name!";\n    \n    // 3. Stdout is captured as logs\n    echo "Log: Processing for $name";\n    \n    return ["body" => $greeting];\n}` 
  // }
};

type LanguageKey = keyof typeof LANGUAGES;

function EditorContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const functionId = searchParams.get('id');

  // --- Form State ---
  const [name, setName] = useState(`Untitled Function - ${Date.now()}`);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('utility');
  const [complexity, setComplexity] = useState('simple');

  // --- Editor State ---
  const [selectedLang, setSelectedLang] = useState<LanguageKey>('nodejs');
  const [code, setCode] = useState(LANGUAGES['nodejs'].boilerplate);
  
  // --- Language Switch Modal State ---
  const [showLangModal, setShowLangModal] = useState(false);
  const [pendingLang, setPendingLang] = useState<LanguageKey | null>(null);
  
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
          const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/functions/${functionId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await res.json();
          if (data.success && data.data) {
            const func = data.data;
            setName(func.name);
            setDescription(func.description || '');
            setCode(func.code);
            
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

  // --- Language Change Handler ---
  const handleLanguageChangeRequest = (newLang: LanguageKey) => {
    setPendingLang(newLang);
    setShowLangModal(true);
  };

  const confirmLanguageChange = () => {
    if (pendingLang) {
      setSelectedLang(pendingLang);
      setCode(LANGUAGES[pendingLang].boilerplate);
    }
    setShowLangModal(false);
    setPendingLang(null);
  };

  // --- Save / Deploy Logic ---
  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      name, 
      description, 
      code, 
      runtime: LANGUAGES[selectedLang].backendRuntime,
      tags, 
      isPublic, 
      metadata: { category, complexity }
    };

    try {
      const token = localStorage.getItem('authToken');
      let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/functions`;
      let method = 'POST';
      if (functionId) {
        url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/functions/${functionId}`;
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/execute/${functionId}`, {
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
    return <div className="flex h-screen items-center justify-center bg-[#f5f5f2] text-[#66665f]"><Loader className="animate-spin mr-2" /> Loading...</div>;
  }

  return (
    <div className="relative flex h-screen w-screen flex-1 overflow-hidden pt-16 bg-[#f5f5f2] text-[#171717]">
      
      {/* --- Language Confirmation Modal --- */}
      {showLangModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[rgba(246,240,227,0.72)] backdrop-blur-sm" onClick={() => setShowLangModal(false)}></div>
          <div className="relative w-full max-w-sm rounded-[1.75rem] border border-[#e7e7e0] bg-white p-6 shadow-[0_24px_60px_rgba(20,20,20,0.08)] animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center gap-3 text-[#b77908]">
              <AlertTriangle size={24} />
              <h3 className="font-[family:var(--font-display)] text-lg font-semibold tracking-[-0.02em] text-[#241d16]">Change Language?</h3>
            </div>
            <p className="mb-6 text-sm leading-7 text-[#65594b]">
              Changing the language will reset the editor with the new boilerplate. Any unsaved code changes will be <span className="font-semibold text-[#b85c38]">lost</span>.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLangModal(false)}
                className="flex-1 rounded-lg border border-[#dbc9ab] bg-white/80 px-4 py-2 text-sm font-medium text-[#4d4235] transition-colors hover:border-[#d4a11e] hover:bg-[#fff6df]"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLanguageChange}
                className="flex-1 rounded-lg bg-[#4f59d9] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#444fd0]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 transform ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-[0_18px_45px_rgba(34,28,21,0.14)] backdrop-blur-md ${toast.type === 'success' ? 'border-[#bfd5c4] bg-white/92 text-[#2f7a5a]' : 'border-[#efcf95] bg-white/92 text-[#b85c38]'}` }>
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span className="text-sm font-semibold text-[#241d16]">{toast.message}</span>
        </div>
      </div>

      {/* --- Sidebar (Left) --- */}
      <aside className="flex w-80 shrink-0 flex-col overflow-y-auto border-r border-[#e6e6df] bg-white shadow-[inset_-1px_0_0_rgba(231,231,224,0.9)] backdrop-blur-sm">
        <div className="p-6 space-y-8">
           <div className="flex items-center gap-2 text-[#9f7b26]">
            <Settings size={18} />
            <span className="text-xs font-semibold uppercase tracking-[0.22em]">Configuration</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-[#8b7d6e]">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-[#dbc9ab] bg-[#fffdfa] p-3 text-sm text-[#221c15] outline-none transition-colors focus:border-[#d4a11e]" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#8b7d6e]">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-[#dbc9ab] bg-[#fffdfa] p-3 text-sm text-[#221c15] outline-none transition-colors focus:border-[#d4a11e]" />
            </div>
          </div>
          <div className="h-px bg-[#eadfcb]"></div>
          <div>
              <label className="mb-2 block text-xs text-[#8b7d6e]">Tags</label>
              <div className="flex flex-wrap gap-2 rounded-xl border border-[#dbc9ab] bg-[#fffdfa] p-2">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 rounded-full border border-[#ffd7c7] bg-[#fff1ea] px-2.5 py-1 text-xs text-[#bf5a2b]">
                    {tag} <button onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
                <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Add tag..." className="min-w-[60px] flex-1 bg-transparent text-xs text-[#221c15] outline-none placeholder:text-[#8b7d6e]" />
              </div>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-3 border-t border-[#ddcfb3] bg-[#eadfc9]/88 p-4">
            <button onClick={handleSave} disabled={isSaving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#4f59d9] py-2.5 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(79,89,217,0.18)] transition-all hover:bg-[#444fd0] disabled:opacity-50">
              {isSaving ? <Loader className="animate-spin" size={16} /> : <><Save size={16} /> {functionId ? 'Update' : 'Deploy'}</>}
            </button>
        </div>
      </aside>

      {/* --- Main Content (Right) --- */}
      <div className="min-w-0 flex-1 flex flex-col overflow-hidden bg-white backdrop-blur-sm">
        
        {/* Editor Toolbar */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-[#e7e7e0] bg-[#f7f7f4] px-4">
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-[#dbc9ab] bg-white/80 px-3 py-1">
                <Code size={14} className="text-[#9f7b26]" />
                <select 
                  value={selectedLang} 
                  onChange={(e) => handleLanguageChangeRequest(e.target.value as LanguageKey)} 
                  className="cursor-pointer bg-transparent text-xs font-medium text-[#4d4235] focus:outline-none"
                >
                  {Object.entries(LANGUAGES).map(([key, lang]) => (
                    <option key={key} value={key} className="bg-[#fffdfa] text-[#221c15]">{lang.label}</option>
                  ))}
                </select>
              </div>
           </div>
           
           <button 
             onClick={handleExecute}
             disabled={isExecuting || !functionId}
             className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
               !functionId 
                ? 'cursor-not-allowed bg-[#f7f0df] text-[#a39480]'
                : 'bg-[#4f59d9] text-white shadow-[0_12px_28px_rgba(79,89,217,0.16)] hover:bg-[#444fd0]'
             }`}
           >
             {isExecuting ? <Loader className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
             {isExecuting ? 'Running...' : 'Test Run'}
           </button>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative min-h-0">
            <Editor
              height="100%"
              language={LANGUAGES[selectedLang].monacoLanguage}
              theme="vs"
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false }, fontSize: 14, automaticLayout: true }}
            />
        </div>

        {/* --- Output Panel --- */}
        <div 
          className="shrink-0 flex flex-col border-t border-[#e7e7e0] bg-white transition-all duration-300 ease-in-out"
          style={{ height: showOutput ? '320px' : '40px' }} 
        >
           <div 
             className="flex h-10 shrink-0 cursor-pointer select-none items-center justify-between border-b border-[#e7e7e0] bg-[#f7f7f4] px-4 hover:bg-[#f2f2ee]"
             onClick={() => setShowOutput(!showOutput)}
           >
              <div className="flex items-center gap-2 text-[#65594b]">
                <Terminal size={14} />
                <span className="text-xs font-mono font-semibold uppercase tracking-[0.18em]">Console / Output</span>
              </div>
              <ChevronDown size={16} className={`text-[#8b7d6e] transition-transform duration-300 ${showOutput ? "" : "rotate-180"}`} />
           </div>

           <div className={`flex-1 overflow-auto p-4 font-mono text-sm ${showOutput ? 'opacity-100' : 'opacity-0'}`}>
              
              {!executionResult && !isExecuting && (
                <div className="flex h-full flex-col items-center justify-center text-[#8b7d6e]">
                  <Play size={24} className="mb-2 opacity-50" />
                  <p>Click "Test Run" to execute your function.</p>
                </div>
              )}

              {isExecuting && (
                <div className="flex h-full items-center justify-center gap-2 text-[#8b7d6e]">
                  <Loader className="animate-spin text-[#9f7b26]" size={20} />
                  <span>Executing function...</span>
                </div>
              )}

              {executionResult && (
                <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4">
                  <div className="flex items-center gap-4 border-b border-[#eadfcb] pb-3 text-xs">
                     <span className={`rounded px-2 py-0.5 font-bold ${executionMeta?.status === 'success' ? 'bg-[#edf7f1] text-[#2f7a5a]' : 'bg-[#fff1e8] text-[#b85c38]'}` }>
                       {executionMeta?.status === 'success' ? '200 OK' : 'Error'}
                     </span>
                     <span className="flex items-center gap-1 text-[#8b7d6e]">
                       <Clock size={12} /> {executionMeta?.duration || '0ms'}
                     </span>
                  </div>

                  {executionMeta?.webUrl && (
                    <div className="rounded-lg border border-[#e7e7e0] bg-[#fbfbf8] p-3">
                       <p className="mb-1 flex items-center gap-1 text-xs text-[#8b7d6e]">
                         <Globe size={12} /> Web Endpoint
                       </p>
                       <div className="flex items-center justify-between gap-2">
                         <a 
                           href={executionMeta.webUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="flex flex-1 items-center gap-1 truncate text-xs text-[#7f6118] hover:underline"
                         >
                           {executionMeta.webUrl} <ExternalLink size={10} />
                         </a>
                         <button 
                           onClick={() => copyToClipboard(executionMeta.webUrl)}
                           className="text-[#8b7d6e] transition-colors hover:text-[#221c15]"
                           title="Copy URL"
                         >
                           <Copy size={14} />
                         </button>
                       </div>
                    </div>
                  )}

                  <div>
                    <p className="mb-1 text-xs text-[#8b7d6e]">Response Body:</p>
                    <pre className="whitespace-pre-wrap break-all rounded-lg border border-[#e7e7e0] bg-[#fbfbf8] p-3 text-[#2f7a5a]">
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
    <div className="relative flex min-h-screen flex-col bg-[#f5f5f2] text-[#171717]">
      <Navbar />
      <Suspense fallback={<div className="p-10 text-[#221c15]">Loading...</div>}>
        <EditorContent />
      </Suspense>
    </div>
  );
}