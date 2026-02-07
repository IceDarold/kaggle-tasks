import React from 'react';
import { Ticket, TicketSection } from '../types';

interface TheoryCardProps {
  ticket: Ticket;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <div className="relative mt-2 rounded bg-[#0d1117] border border-slate-700/50 font-mono text-xs overflow-hidden group/code">
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161b22] border-b border-slate-800">
      <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
      <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
      <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
      <div className="ml-auto text-[10px] text-slate-500">python</div>
    </div>
    <div className="p-3 overflow-x-auto text-slate-300 whitespace-pre-wrap">
      {code}
    </div>
  </div>
);

const SectionRenderer: React.FC<{ section: TicketSection; type: 'theory' | 'code' }> = ({ section, type }) => (
  <div className="mb-6 last:mb-0">
    <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2 ${
      type === 'theory' ? 'text-purple-300' : 'text-emerald-300'
    }`}>
      <span className={`w-1 h-3 rounded-full ${type === 'theory' ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
      {section.title}
    </h4>
    
    <div className="space-y-3">
      {section.items.map((item, idx) => {
        // Check if the item is a code block (starts with def, class, or triple quotes)
        const isCode = item.trim().startsWith('def ') || item.trim().startsWith('class ') || item.includes('"""') || item.includes('import ');
        
        if (isCode && type === 'code') {
          return <CodeBlock key={idx} code={item} />;
        }
        
        return (
          <div key={idx} className={`relative pl-4 text-sm leading-relaxed ${
             type === 'theory' ? 'text-slate-300' : 'text-slate-400'
          }`}>
            <div className={`absolute left-0 top-2 w-1 h-1 rounded-full ${
               type === 'theory' ? 'bg-slate-600' : 'bg-emerald-900'
            }`}></div>
            {item}
          </div>
        );
      })}
    </div>
  </div>
);

const TheoryCard: React.FC<TheoryCardProps> = ({ ticket }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#050912]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
      
      {/* Ticket Header Bar */}
      <div className="relative z-10 flex items-center justify-between px-6 py-4 bg-[#0a0f1c] border-b border-slate-800">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 text-purple-400 font-bold font-mono text-lg shadow-[0_0_15px_-5px_rgba(168,85,247,0.3)]">
            #{ticket.id}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              {ticket.title}
            </h3>
          </div>
        </div>
        <div className="hidden md:block px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-slate-500 font-mono uppercase tracking-wider">
           Confidential // Training Material
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Theory Column */}
        <div className="p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/20">
          <div className="flex items-center gap-2 mb-6 opacity-50">
             <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
             <span className="text-xs font-mono font-bold text-purple-400 uppercase">Theoretical_Analysis</span>
          </div>
          
          {ticket.theory.map((section, idx) => (
            <SectionRenderer key={idx} section={section} type="theory" />
          ))}
        </div>

        {/* Code Column */}
        <div className="p-6 md:p-8 bg-[#03060b]">
           <div className="flex items-center gap-2 mb-6 opacity-50">
             <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
             <span className="text-xs font-mono font-bold text-emerald-400 uppercase">Implementation_Protocol</span>
          </div>

          {ticket.code.map((section, idx) => (
             <SectionRenderer key={idx} section={section} type="code" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TheoryCard;