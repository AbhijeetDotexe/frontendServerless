'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Editor from '@monaco-editor/react';
import { Navbar } from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Save, Settings, Globe,
  ChevronDown, CheckCircle, AlertCircle,
  Code2, Loader2, Play, Terminal, Clock, ExternalLink, Copy, AlertTriangle,
  ChevronRight, Cpu, FileCode2
} from 'lucide-react';

// --- CONFIGURATION ---
const LANGUAGES = {
  nodejs: { 
    label: 'Node.js 18', 
    shortLabel: 'JS',
    monacoLanguage: 'javascript', 
    backendRuntime: 'nodejs:18',
    color: '#68a063',
    boilerplate: `function main(params) {\n  const name = params.name || 'stranger';\n  console.log("Log: Processing for " + name);\n  return { body: "Hello " + name + "!" };\n}` 
  },
  python: { 
    label: 'Python 3.11', 
    shortLabel: 'PY',
    monacoLanguage: 'python', 
    backendRuntime: 'python:3.11',
    color: '#3572A5',
    boilerplate: `def main(args):\n    # 1. Parse Input\n    name = args.get("name", "stranger")\n    \n    # 2. Do Logic\n    greeting = "Hello " + name + "!"\n    print(f"Processing request for: {name}")\n    \n    # 3. Return Dict\n    return {"body": greeting}` 
  },
  go: { 
    label: 'Go 1.20', 
    shortLabel: 'GO',
    monacoLanguage: 'go', 
    backendRuntime: 'go:1.20',
    color: '#00ADD8',
    boilerplate: `package main\n\nimport "fmt"\n\n// Exported function (Capitalized)\nfunc Main(args map[string]interface{}) map[string]interface{} {\n    // 1. Type Assertion\n    name, ok := args["name"].(string)\n    if !ok {\n        name = "stranger"\n    }\n    \n    // 2. Logic\n    fmt.Println("Log: Processing request...")\n    \n    // 3. Return Map\n    msg := make(map[string]interface{})\n    msg["body"] = "Hello, " + name + "!"\n    return msg\n}` 
  },
};

type LanguageKey = keyof typeof LANGUAGES;

function EditorContent() {
  const { user, isLoading: authLoading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const functionId = searchParams.get('id');

  // Form State
  const [name, setName] = useState(`Untitled Function - ${Date.now()}`);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [category, setCategory] = useState('utility');
  const [complexity, setComplexity] = useState('simple');

  // Editor State
  const [selectedLang, setSelectedLang] = useState<LanguageKey>('nodejs');
  const [code, setCode] = useState(LANGUAGES['nodejs'].boilerplate);
  const [editorFontSize, setEditorFontSize] = useState(16);
  
  // Language Switch Modal
  const [showLangModal, setShowLangModal] = useState(false);
  const [pendingLang, setPendingLang] = useState<LanguageKey | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  
  // Loading States
  const [isSaving, setIsSaving] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isFetching, setIsFetching] = useState(!!functionId);

  // Output State
  const [executionResult, setExecutionResult] = useState<unknown>(null);
  const [executionMeta, setExecutionMeta] = useState<{
    duration?: number;
    status?: string;
    webUrl?: string;
    timestamp?: string;
  } | null>(null);
  const [showOutput, setShowOutput] = useState(true);

  // Toast
  const [toast, setToast] = useState<{ show: boolean, type: 'success' | 'error', message: string }>({
    show: false, type: 'success', message: ''
  });

  // Route protection
  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  // Fetch existing function
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
            if (func.metadata) {
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

  const handleLanguageChangeRequest = (newLang: LanguageKey) => {
    setShowLangDropdown(false);
    if (newLang === selectedLang) return;
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

  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      name, description, code, 
      runtime: LANGUAGES[selectedLang].backendRuntime,
      tags, isPublic, 
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
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (response.ok) {
        showToast('success', functionId ? 'Function updated!' : 'Function deployed!');
        if (!functionId && data.data?.uuid) {
          router.replace(`/editor?id=${data.data.uuid}`);
        }
      } else {
        showToast('error', data.message || 'Failed to save.');
      }
    } catch {
      showToast('error', 'Network error.');
    } finally {
      setIsSaving(false);
    }
  };

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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
    } catch {
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

  const currentLang = LANGUAGES[selectedLang];

  if (authLoading || isFetching) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="flex items-center gap-3 text-[var(--muted)]">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm font-medium">Loading workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden pt-12 bg-[var(--background)] text-[var(--foreground)] transition-colors duration-200">
      
      {/* Language Confirmation Modal */}
      {showLangModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLangModal(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--warning-subtle)]">
                <AlertTriangle size={20} className="text-[#e67700] dark:text-[#fcc419]" />
              </div>
              <h3 className="text-base font-semibold text-[var(--foreground)]">Change Language?</h3>
            </div>
            <p className="mb-6 text-sm leading-6 text-[var(--muted)]">
              Switching to <span className="font-semibold text-[var(--foreground)]">{pendingLang ? LANGUAGES[pendingLang].label : ''}</span> will reset the editor with the runtime boilerplate. Unsaved code will be <span className="font-semibold text-[#e03131]">lost</span>.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLangModal(false)}
                className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:bg-[var(--surface-3)]"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLanguageChange}
                className="flex-1 rounded-lg bg-[#3b5bdb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3451c7]"
              >
                Switch Runtime
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'}`}>
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl text-sm font-medium ${
          toast.type === 'success' 
            ? 'border-[#2f9e44]/30 bg-[var(--surface)] text-[#2f9e44] dark:text-[#40c057]' 
            : 'border-[#e03131]/30 bg-[var(--surface)] text-[#e03131] dark:text-[#fa5252]'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span className="text-[var(--foreground)]">{toast.message}</span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ─── LEFT SIDEBAR ─────────────────────────────── */}
        <aside className="flex w-72 shrink-0 flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--surface)]">
          
          {/* Sidebar header */}
          <div className="flex h-11 items-center gap-2 border-b border-[var(--border)] bg-[var(--surface-2)] px-4">
            <Settings size={14} className="text-[var(--muted-2)]" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Configuration</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Function Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 placeholder:text-[var(--muted-2)]"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                rows={3} 
                className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10 placeholder:text-[var(--muted-2)]" 
                placeholder="What does this function do?"
              />
            </div>

            <div className="h-px bg-[var(--border)]" />

            {/* Category & Complexity */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Category</label>
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10"
                >
                  <option value="utility">Utility</option>
                  <option value="api">API</option>
                  <option value="data-processing">Data</option>
                  <option value="scheduled">Scheduled</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Complexity</label>
                <select 
                  value={complexity} 
                  onChange={(e) => setComplexity(e.target.value)}
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 text-sm text-[var(--foreground)] outline-none transition focus:border-[#3b5bdb] focus:ring-2 focus:ring-[#3b5bdb]/10"
                >
                  <option value="simple">Simple</option>
                  <option value="intermediate">Medium</option>
                  <option value="complex">Complex</option>
                </select>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--muted)]">Tags</label>
              <div className="flex min-h-[2.5rem] flex-wrap gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2 transition focus-within:border-[#3b5bdb] focus-within:ring-2 focus-within:ring-[#3b5bdb]/10">
                {tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 rounded-md bg-[#eef2ff] dark:bg-[#1e2238] border border-[#c5cdf8] dark:border-[#2f3970] px-2 py-0.5 text-xs font-medium text-[#3b5bdb] dark:text-[#748ffc]">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-[#748ffc] hover:text-[#3b5bdb]">×</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)} 
                  onKeyDown={handleAddTag} 
                  placeholder={tags.length === 0 ? "Type & press Enter..." : ""}
                  className="min-w-[100px] flex-1 bg-transparent text-xs text-[var(--foreground)] outline-none placeholder:text-[var(--muted-2)]" 
                />
              </div>
            </div>

            {/* Public access */}
            <div className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
              <div>
                <p className="text-xs font-medium text-[var(--foreground)]">Public Endpoint</p>
                <p className="text-[11px] text-[var(--muted)]">Allow HTTP web invocation</p>
              </div>
              <button
                type="button"
                onClick={() => setIsPublic(!isPublic)}
                className={`relative inline-flex h-5 w-9 cursor-pointer rounded-full transition-colors duration-200 ${isPublic ? 'bg-[#3b5bdb]' : 'bg-[var(--border-2)]'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition duration-200 mt-0.5 ${isPublic ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Deploy button */}
          <div className="border-t border-[var(--border)] bg-[var(--surface-2)] p-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#3b5bdb] py-2.5 text-sm font-semibold text-white transition hover:bg-[#3451c7] disabled:opacity-50 shadow-sm"
            >
              {isSaving 
                ? <><Loader2 className="animate-spin" size={15} /> Deploying...</>
                : <><Save size={15} /> {functionId ? 'Update & Deploy' : 'Deploy Function'}</>
              }
            </button>
          </div>
        </aside>

        {/* ─── EDITOR AREA ──────────────────────────────── */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          
          {/* ── TOOLBAR ── */}
          <div className="flex h-11 shrink-0 items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-3">
            
            {/* Left: File info + Language selector + Font size controls */}
            <div className="flex items-center gap-2 text-[var(--muted)]">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5">
                <FileCode2 size={15} className="text-[var(--muted-2)]" />
                <span
                  className="max-w-[150px] truncate text-xs sm:text-sm font-medium text-[var(--foreground)]"
                  title={name}
                >
                  {name.length > 22 ? name.slice(0, 22) + '…' : name}
                </span>
                <ChevronRight size={13} className="text-[var(--border-2)]" />
              </div>

              {/* Language pill / dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowLangDropdown(v => !v)}
                  className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs sm:text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--border-2)] hover:bg-[var(--surface-2)] select-none"
                >
                  {/* Language color dot */}
                  <span
                    className="h-2 w-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: currentLang.color }}
                  />
                  <span style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }}>{currentLang.label}</span>
                  <ChevronDown size={12} className={`text-[var(--muted)] transition-transform duration-150 ${showLangDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showLangDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLangDropdown(false)} />
                    <div className="absolute left-0 top-full z-20 mt-1.5 w-48 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                      <div className="px-2 py-1.5">
                        {Object.entries(LANGUAGES).map(([key, lang]) => (
                          <button
                            key={key}
                            onClick={() => handleLanguageChangeRequest(key as LanguageKey)}
                            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs sm:text-sm font-medium transition ${
                              key === selectedLang
                                ? 'bg-[#eef2ff] dark:bg-[#1e2238] text-[#3b5bdb] dark:text-[#748ffc]'
                                : 'text-[var(--foreground)] hover:bg-[var(--surface-2)]'
                            }`}
                          >
                            <span
                              className="h-2 w-2 rounded-full flex-shrink-0"
                              style={{ backgroundColor: lang.color }}
                            />
                            <span style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }}>{lang.label}</span>
                            {key === selectedLang && (
                              <CheckCircle size={13} className="ml-auto text-[#3b5bdb] dark:text-[#748ffc]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Runtime badge */}
              <div className="hidden sm:flex items-center gap-1 rounded-md bg-[var(--surface-3)] px-2 py-1">
                <Cpu size={12} className="text-[var(--muted-2)]" />
                <span style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace", fontSize: 12 }} className="text-[var(--muted)]">{currentLang.backendRuntime}</span>
              </div>

              {/* Font Size Adjuster */}
              <div className="flex items-center rounded-md border border-[var(--border)] bg-[var(--surface)] px-1 py-0.5" title="Code Editor Font Size (or use Ctrl + Mouse Scroll)">
                <button
                  type="button"
                  onClick={() => setEditorFontSize(s => Math.max(12, s - 1))}
                  className="px-1.5 py-0.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] rounded transition-colors"
                  title="Smaller code font (A-)"
                >
                  A-
                </button>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11 }} className="px-1 font-medium text-[var(--foreground)]">
                  {editorFontSize}px
                </span>
                <button
                  type="button"
                  onClick={() => setEditorFontSize(s => Math.min(26, s + 1))}
                  className="px-1.5 py-0.5 text-xs font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)] rounded transition-colors"
                  title="Larger code font (A+)"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Right: Function ID + Test Run */}
            <div className="flex items-center gap-2">
              {functionId && (
                <div className="hidden items-center gap-1 rounded-md bg-[var(--surface-3)] px-2 py-1 md:flex">
                  <Code2 size={12} className="text-[var(--muted-2)]" />
                  <span style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace", fontSize: 12 }} className="text-[var(--muted)] max-w-[80px] truncate">{functionId}</span>
                </div>
              )}

              <button 
                onClick={handleExecute}
                disabled={isExecuting || !functionId}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all ${
                  !functionId 
                    ? 'cursor-not-allowed bg-[var(--surface-3)] text-[var(--muted-2)]'
                    : isExecuting
                    ? 'bg-[#3b5bdb] text-white opacity-80'
                    : 'bg-[#3b5bdb] text-white hover:bg-[#3451c7] shadow-sm hover:shadow-[0_4px_12px_rgba(59,91,219,0.3)]'
                }`}
                title={!functionId ? 'Deploy first, then run' : 'Run test execution'}
              >
                {isExecuting 
                  ? <Loader2 className="animate-spin" size={14} />
                  : <Play size={14} fill="currentColor" />
                }
                <span>{isExecuting ? 'Running…' : 'Test Run'}</span>
              </button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1 relative min-h-0 bg-[#1e1e1e]">
            <Editor
              height="100%"
              language={currentLang.monacoLanguage}
              theme={theme === 'dark' ? 'vs-dark' : 'vs'}
              value={code}
              onChange={(value) => setCode(value || '')}
              options={{ 
                minimap: { enabled: false }, 
                fontSize: editorFontSize, 
                lineHeight: Math.round(editorFontSize * 1.62),
                fontFamily: "'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace",
                fontLigatures: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                mouseWheelZoom: true,
                padding: { top: 14, bottom: 14 },
                renderLineHighlight: 'gutter',
                overviewRulerLanes: 0,
                scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                wordWrap: 'off',
                tabSize: 2,
              }}
            />
          </div>

          {/* ── OUTPUT PANEL ── */}
          <div 
            className="shrink-0 flex flex-col border-t border-[var(--border)] bg-[var(--surface)] transition-all duration-300 ease-in-out"
            style={{ height: showOutput ? '240px' : '36px' }} 
          >
            {/* Output header */}
            <button
              onClick={() => setShowOutput(!showOutput)}
              className="flex h-9 shrink-0 w-full cursor-pointer select-none items-center justify-between border-b border-[var(--border)] bg-[var(--surface-2)] px-4 hover:bg-[var(--surface-3)] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Terminal size={13} className="text-[var(--muted-2)]" />
                <span style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace", fontSize: 11 }} className="font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">Output</span>
                {Boolean(executionResult) && executionMeta && (
                  <span style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }} className={`ml-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                    executionMeta.status === 'success' 
                      ? 'bg-[#ebfbee] dark:bg-[#132b1b] text-[#2f9e44] dark:text-[#40c057]' 
                      : 'bg-[#fff5f5] dark:bg-[#341717] text-[#e03131] dark:text-[#fa5252]'
                  }`}>
                    {executionMeta.status === 'success' ? '200 OK' : 'Error'}
                  </span>
                )}
              </div>
              <ChevronDown size={14} className={`text-[var(--muted)] transition-transform duration-200 ${showOutput ? '' : 'rotate-180'}`} />
            </button>

            {/* Output body */}
            <div className={`flex-1 overflow-auto transition-opacity duration-200 ${showOutput ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {!executionResult && !isExecuting && (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-[var(--muted-2)]">
                  <Play size={20} className="opacity-40" />
                  <p style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }} className="text-xs">Press <kbd className="rounded bg-[var(--surface-3)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--muted)]">Test Run</kbd> to execute</p>
                </div>
              )}

              {isExecuting && (
                <div className="flex h-full items-center justify-center gap-2 text-[var(--muted)]">
                  <Loader2 className="animate-spin text-[#3b5bdb]" size={16} />
                  <span style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }} className="text-xs">Executing on OpenWhisk…</span>
                </div>
              )}

              {Boolean(executionResult) && (
                <div className="p-4 space-y-3">
                  {/* Meta row */}
                  <div style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }} className="flex items-center gap-3 text-[11px] text-[var(--muted)] border-b border-[var(--border)] pb-3">
                    <span className={`rounded-md px-2 py-0.5 font-semibold ${
                      executionMeta?.status === 'success' 
                        ? 'bg-[#ebfbee] dark:bg-[#132b1b] text-[#2f9e44] dark:text-[#40c057]' 
                        : 'bg-[#fff5f5] dark:bg-[#341717] text-[#e03131] dark:text-[#fa5252]'
                    }`}>
                      {executionMeta?.status === 'success' ? '200 OK' : 'Error'}
                    </span>
                    {executionMeta?.duration && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {executionMeta.duration}ms
                      </span>
                    )}
                    {executionMeta?.timestamp && (
                      <span className="ml-auto text-[var(--muted-2)]">{new Date(executionMeta.timestamp).toLocaleTimeString()}</span>
                    )}
                  </div>

                  {/* Web URL */}
                  {executionMeta?.webUrl && (
                    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-2)] px-3 py-2.5">
                      <p style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }} className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-2)]">
                        <Globe size={11} /> Web Endpoint
                      </p>
                      <div className="flex items-center gap-2">
                        <a 
                          href={executionMeta.webUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }}
                          className="flex flex-1 items-center gap-1 truncate text-xs text-[#3b5bdb] dark:text-[#748ffc] hover:underline"
                        >
                          {executionMeta.webUrl} <ExternalLink size={10} />
                        </a>
                        <button 
                          onClick={() => copyToClipboard(executionMeta.webUrl!)}
                          className="text-[var(--muted-2)] transition hover:text-[var(--foreground)]"
                          title="Copy URL"
                        >
                          <Copy size={13} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Response body */}
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }} className="mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted-2)]">Response Body</p>
                    <pre style={{ fontFamily: "'JetBrains Mono', Menlo, Monaco, monospace" }} className="whitespace-pre-wrap break-all rounded-lg border border-[var(--border)] bg-[var(--surface-2)] p-4 text-sm sm:text-[14px] leading-relaxed text-[var(--foreground)]">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <div className="relative flex flex-col bg-[var(--background)] text-[var(--foreground)]" style={{ height: '100dvh' }}>
      <Navbar />
      <Suspense fallback={
        <div className="flex h-screen items-center justify-center text-[var(--muted)]">
          <Loader2 className="animate-spin mr-2" size={18} /> Loading…
        </div>
      }>
        <EditorContent />
      </Suspense>
    </div>
  );
}