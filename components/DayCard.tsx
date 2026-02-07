import React from 'react';
import { Competition } from '../types';

interface DayCardProps {
  competition: Competition;
  isEven: boolean;
}

const DayCard: React.FC<DayCardProps> = ({ competition }) => {
  return (
    <div className="group relative flex flex-col h-full">
      {/* Glass Panel Background */}
      <div className="absolute inset-0 bg-[#0a0f1c]/80 backdrop-blur-sm rounded-xl border border-slate-800 transition-all duration-300 group-hover:border-cyan-500/30 group-hover:bg-[#0a0f1c]/90 group-hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]"></div>
      
      {/* Decorative corners */}
      <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t border-l border-slate-600 rounded-tl-lg group-hover:border-cyan-400 transition-colors"></div>
      <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b border-r border-slate-600 rounded-br-lg group-hover:border-cyan-400 transition-colors"></div>

      {/* Content Container */}
      <div className="relative z-10 p-5 flex flex-col h-full">
        
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs font-bold shadow-inner">
            {competition.day}
          </div>
          <a 
            href={competition.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] uppercase font-bold tracking-wider text-slate-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
          >
            KAGGLE_LINK
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

        <h3 className="text-lg font-bold text-slate-100 leading-tight mb-4 group-hover:text-cyan-200 transition-colors min-h-[3rem]">
          {competition.title}
        </h3>

        {/* Separator */}
        <div className="h-px w-full bg-slate-800 mb-4 group-hover:bg-slate-700 transition-colors"></div>

        {/* Tasks */}
        <div className="space-y-3 flex-grow">
          {competition.tasks.map((task, idx) => (
            <div key={idx} className="group/task">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-cyan-500/70 font-mono text-xs">
                  {idx === 0 ? '>' : '$'}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide group-hover/task:text-cyan-400 transition-colors">
                  {task.title}
                </span>
              </div>
              <p className="text-sm text-slate-500 pl-4 border-l border-slate-800 leading-relaxed group-hover/task:text-slate-300 group-hover/task:border-slate-700 transition-colors">
                {task.description}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Status */}
        <div className="mt-5 pt-3 border-t border-dashed border-slate-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
           <span className="text-[10px] text-cyan-500 font-mono">STATUS: PENDING</span>
           <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></div>
        </div>
      </div>
    </div>
  );
};

export default DayCard;