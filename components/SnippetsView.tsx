import React, { useState, useMemo } from 'react';
import { CodeSnippet } from '../types';

interface SnippetsViewProps {
  snippets: CodeSnippet[];
}

// Simple Python syntax highlighter regexes
const HIGHLIGHT_PATTERNS = [
  { regex: /(#.*$)/gm, className: "text-slate-500 italic" }, // Comments
  { regex: /\b(def|class|import|from|return|if|else|for|while|try|except|with|as|pass|break|continue|lambda)\b/g, className: "text-purple-400 font-bold" }, // Keywords
  { regex: /\b(True|False|None)\b/g, className: "text-orange-400" }, // Booleans/None
  { regex: /('.*?'|".*?")/g, className: "text-green-400" }, // Strings
  { regex: /\b(self)\b/g, className: "text-red-400 italic" }, // self
  { regex: /\b(int|float|str|list|dict|set|tuple)\b/g, className: "text-cyan-400" }, // Types
  { regex: /\b([A-Z][a-zA-Z0-9_]*)\b/g, className: "text-yellow-300" }, // Class names (heuristic)
  { regex: /(@[a-zA-Z_]+)/g, className: "text-yellow-500" }, // Decorators
  { regex: /\b([0-9]+)\b/g, className: "text-blue-300" }, // Numbers
];

const SyntaxHighlighter: React.FC<{ code: string }> = ({ code }) => {
  const lines = code.split('\n');

  // Improved highlighting using a single pass regex for tokens
  const renderLine = (line: string) => {
    // Check for comment first
    const commentIndex = line.indexOf('#');
    let codePart = line;
    let commentPart = '';
    
    if (commentIndex !== -1) {
      codePart = line.substring(0, commentIndex);
      commentPart = line.substring(commentIndex);
    }

    // Process code part
    const tokens = codePart.split(/(\b\w+\b|\s+|[^\w\s])/g).filter(Boolean);
    
    return (
      <>
        {tokens.map((token, i) => {
           if (['def', 'class', 'return', 'import', 'from', 'if', 'else', 'elif', 'for', 'while', 'in', 'as', 'with', 'try', 'except'].includes(token)) 
             return <span key={i} className="text-purple-400 font-bold">{token}</span>;
           if (['True', 'False', 'None'].includes(token)) 
             return <span key={i} className="text-orange-400">{token}</span>;
           if (token === 'self') 
             return <span key={i} className="text-red-400 italic">{token}</span>;
           if (/^[A-Z][a-zA-Z0-9_]*$/.test(token) && token.length > 1) 
             return <span key={i} className="text-yellow-200">{token}</span>; // Classes/Constants
           if (!isNaN(parseFloat(token)))
             return <span key={i} className="text-blue-300">{token}</span>;
           if (token.startsWith('"') || token.startsWith("'"))
             return <span key={i} className="text-green-400">{token}</span>;
             
           return <span key={i} className="text-slate-300">{token}</span>;
        })}
        {commentPart && <span className="text-slate-500 italic">{commentPart}</span>}
      </>
    );
  };

  return (
    <div className="font-mono text-xs md:text-sm leading-6">
      {lines.map((line, i) => (
        <div key={i} className="table-row">
          <span className="table-cell text-right pr-4 select-none text-slate-700 w-8">{i + 1}</span>
          <span className="table-cell whitespace-pre-wrap break-all">{renderLine(line)}</span>
        </div>
      ))}
    </div>
  );
};

const SnippetsView: React.FC<SnippetsViewProps> = ({ snippets }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  
  // Extract unique categories (preserving order of appearance)
  const categories = useMemo(() => {
    return Array.from(new Set(snippets.map(s => s.category || 'General')));
  }, [snippets]);

  const [activeCategory, setActiveCategory] = useState<string>(categories[0] || 'General');

  // Filter snippets based on active tab
  const filteredSnippets = useMemo(() => {
    return snippets.filter(s => (s.category || 'General') === activeCategory);
  }, [snippets, activeCategory]);

  const handleCopy = (e: React.MouseEvent, code: string, index: number) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleExpand = (index: number) => {
    const newSet = new Set(expandedIndices);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setExpandedIndices(newSet);
  };

  return (
    <div className="animate-fade-in-up pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-black text-white mb-3 tracking-tighter">
          CODE_<span className="text-cyan-400">PATTERNS</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-mono text-sm">
          // Essential implementation blocks. Copy, adapt, deploy.
        </p>
      </div>

      {/* Categories Tabs */}
      <div className="max-w-5xl mx-auto mb-10 overflow-x-auto">
        <div className="flex justify-center min-w-max px-4">
          <div className="bg-[#0d1117] border border-slate-800 rounded-full p-1 flex gap-1 shadow-lg">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/50 shadow-[0_0_15px_-5px_rgba(34,211,238,0.3)]'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Snippets List */}
      <div className="space-y-8 max-w-5xl mx-auto">
        {filteredSnippets.map((snippet, idx) => {
          // IMPORTANT: Use original index (found in main array) or unique logic if we need unique IDs across tabs.
          // For simplicity here, we assume filtered list logic is fine, but keys must be unique.
          // Since we filter, idx is local to the category.
          const isExpanded = expandedIndices.has(idx);
          
          return (
            <div key={`${activeCategory}-${idx}`} className="relative group scroll-mt-24 animate-fade-in">
              
              {/* Context Header (Outside Window) */}
              <div className="flex items-baseline gap-3 mb-2 ml-2">
                 <h3 className="text-lg font-bold text-slate-200">{snippet.title}</h3>
              </div>
              
              {/* Code Window */}
              <div 
                className={`rounded-xl border bg-[#0d1117] shadow-2xl overflow-hidden relative transition-all duration-300 ${
                  isExpanded 
                    ? 'border-slate-700 shadow-[0_0_30px_-10px_rgba(6,182,212,0.1)]' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                
                {/* Window Controls Bar (Clickable to toggle) */}
                <div 
                  onClick={() => toggleExpand(idx)}
                  className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-slate-800 cursor-pointer hover:bg-[#1c2128] transition-colors select-none"
                >
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full transition-colors ${isExpanded ? 'bg-[#ff5f56]' : 'bg-slate-600'}`}></div>
                        <div className={`w-3 h-3 rounded-full transition-colors ${isExpanded ? 'bg-[#ffbd2e]' : 'bg-slate-600'}`}></div>
                        <div className={`w-3 h-3 rounded-full transition-colors ${isExpanded ? 'bg-[#27c93f]' : 'bg-slate-600'}`}></div>
                      </div>
                      
                      {/* Description Preview in Header when collapsed */}
                      {!isExpanded && (
                        <div className="hidden sm:block text-xs text-slate-500 truncate max-w-[300px] border-l border-slate-700 pl-4">
                          {snippet.description}
                        </div>
                      )}
                   </div>

                   <div className="flex items-center gap-3">
                     <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest hidden sm:block">
                        {isExpanded ? 'python' : 'collapsed'}
                     </span>
                     
                     {/* Toggle Icon */}
                     <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                     </div>

                     {/* Copy Button */}
                     <button 
                       onClick={(e) => handleCopy(e, snippet.code, idx)}
                       className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 transition-colors text-xs font-medium text-slate-400 hover:text-white group/btn ml-2 border border-slate-700"
                     >
                        {copiedIndex === idx ? (
                          <>
                            <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-green-400 hidden sm:inline">Copied</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="group-hover/btn:underline decoration-slate-600 underline-offset-4 hidden sm:inline">Copy</span>
                          </>
                        )}
                     </button>
                   </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="animate-fade-in">
                    {/* Full Description inside */}
                    <div className="px-6 py-4 border-b border-slate-800/50 bg-[#0d1117]">
                      <p className="text-sm text-slate-400 leading-relaxed font-mono">
                        # {snippet.description}
                      </p>
                    </div>

                    {/* Code Content */}
                    <div className="p-6 overflow-x-auto bg-[#0d1117]">
                       <SyntaxHighlighter code={snippet.code} />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Timeline Connector */}
              {idx !== filteredSnippets.length - 1 && (
                 <div className="absolute left-[19px] top-[100%] h-8 w-px bg-slate-800/50"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SnippetsView;