import React, { useState } from 'react';
import { WEEKS } from './constants';
import WeekView from './components/WeekView';
import TheoryView from './components/TheoryView';

type ViewMode = 'competitions' | 'theory';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('competitions');
  const [activeWeekId, setActiveWeekId] = useState<number>(1);
  const activeWeek = WEEKS.find(w => w.id === activeWeekId) || WEEKS[0];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-blue-900/10 rounded-full blur-[100px]"></div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        
        {/* Header Section */}
        <header className="flex flex-col items-center justify-center mb-16 pt-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-1 bg-cyan-500 rounded-full animate-ping"></div>
            <span className="text-xs font-mono text-cyan-500 tracking-[0.2em] uppercase">System Online</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 mb-8 drop-shadow-2xl text-center">
            KAGGLE <span className="text-cyan-400">MASTERY</span>
            <span className="block text-lg md:text-xl font-normal text-slate-400 mt-2 tracking-wide font-mono">
              // Neural Network Competition Sprint
            </span>
          </h1>

          {/* Cyberpunk Toggle Switch */}
          <div className="relative p-1 bg-slate-900/50 border border-slate-800 rounded-lg backdrop-blur-md inline-flex">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-slate-800 border border-slate-700 rounded transition-all duration-300 ease-out shadow-lg ${
                viewMode === 'competitions' ? 'left-1' : 'left-[calc(50%+0px)] translate-x-0'
              }`}
            ></div>
            <button
              onClick={() => setViewMode('competitions')}
              className={`relative z-10 px-8 py-2.5 rounded text-sm font-bold tracking-wide transition-colors duration-300 ${
                viewMode === 'competitions' ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              COMPETITIONS
            </button>
            <button
              onClick={() => setViewMode('theory')}
              className={`relative z-10 px-8 py-2.5 rounded text-sm font-bold tracking-wide transition-colors duration-300 ${
                viewMode === 'theory' ? 'text-purple-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              THEORY_MINIMUM
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="min-h-[600px] animate-fade-in-up">
          {viewMode === 'competitions' ? (
            <>
              {/* Week Navigation */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {WEEKS.map((week) => {
                  const isActive = activeWeekId === week.id;
                  return (
                    <button
                      key={week.id}
                      onClick={() => setActiveWeekId(week.id)}
                      className={`group relative px-6 py-4 rounded-xl border transition-all duration-300 overflow-hidden ${
                        isActive 
                          ? 'bg-slate-900/80 border-cyan-500/50 shadow-[0_0_30px_-10px_rgba(34,211,238,0.3)]' 
                          : 'bg-slate-900/30 border-slate-800 hover:border-slate-600 hover:bg-slate-800/50'
                      }`}
                    >
                      {isActive && <div className="absolute inset-0 bg-cyan-500/5 pointer-events-none"></div>}
                      <div className="flex flex-col items-center">
                        <span className={`text-xs font-mono uppercase tracking-widest mb-1 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
                          Week 0{week.id}
                        </span>
                        <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                          {week.title}
                        </span>
                        <span className={`text-[10px] mt-1 ${isActive ? 'text-cyan-300/70' : 'text-slate-600'}`}>
                          {week.subtitle.split('—')[0]}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <WeekView week={activeWeek} />
            </>
          ) : (
            <TheoryView />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center border-t border-slate-900 mt-20">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-mono text-slate-400">
            {viewMode === 'competitions' 
              ? "STATUS: TRAINING IN PROGRESS"
              : "STATUS: ACQUIRING KNOWLEDGE"}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;