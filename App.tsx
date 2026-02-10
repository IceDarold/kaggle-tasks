import React, { useState } from 'react';
import { TRACKS } from './constants';
import WeekView from './components/WeekView';
import TheoryView from './components/TheoryView';

type ViewMode = 'competitions' | 'theory';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('competitions');
  const [activeTrackId, setActiveTrackId] = useState<string>(TRACKS[0].id);
  const [activeWeekId, setActiveWeekId] = useState<number>(1);

  const activeTrack = TRACKS.find(t => t.id === activeTrackId) || TRACKS[0];
  const activeWeek = activeTrack.weeks.find(w => w.id === activeWeekId) || activeTrack.weeks[0];

  const handleTrackChange = (trackId: string) => {
    setActiveTrackId(trackId);
    setActiveWeekId(1); // Reset to week 1 when switching tracks
  };

  const getTrackStyles = (trackId: string, isActive: boolean) => {
    switch (trackId) {
      case 'audio':
        return {
          accentColor: 'text-pink-400',
          indicatorClass: isActive ? 'bg-pink-400 shadow-[0_0_8px_rgba(244,114,182,0.8)]' : 'bg-slate-600',
          containerClass: isActive ? 'bg-slate-800 text-white shadow-lg ring-1 ring-pink-500/30' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
        };
      case 'detection':
        return {
          accentColor: 'text-green-400',
          indicatorClass: isActive ? 'bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-slate-600',
          containerClass: isActive ? 'bg-slate-800 text-white shadow-lg ring-1 ring-green-500/30' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
        };
      case 'segmentation':
        return {
          accentColor: 'text-purple-400',
          indicatorClass: isActive ? 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]' : 'bg-slate-600',
          containerClass: isActive ? 'bg-slate-800 text-white shadow-lg ring-1 ring-purple-500/30' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
        };
      case 'tabular':
        return {
          accentColor: 'text-orange-400',
          indicatorClass: isActive ? 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]' : 'bg-slate-600',
          containerClass: isActive ? 'bg-slate-800 text-white shadow-lg ring-1 ring-orange-500/30' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
        };
      default: // image
        return {
          accentColor: 'text-cyan-400',
          indicatorClass: isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-600',
          containerClass: isActive ? 'bg-slate-800 text-white shadow-lg ring-1 ring-cyan-500/30' : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
        };
    }
  };

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
          <div className="relative p-1 bg-slate-900/50 border border-slate-800 rounded-lg backdrop-blur-md inline-flex mb-8">
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
              {/* Track Selector */}
              <div className="flex justify-center mb-10">
                 <div className="inline-flex flex-wrap justify-center gap-4 p-2 bg-[#0a0f1c]/50 border border-slate-800 rounded-2xl backdrop-blur-xl max-w-4xl">
                   {TRACKS.map((track, index) => {
                      const isActive = activeTrackId === track.id;
                      const styles = getTrackStyles(track.id, isActive);

                      return (
                        <button
                          key={track.id}
                          onClick={() => handleTrackChange(track.id)}
                          className={`relative px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-3 overflow-hidden ${styles.containerClass}`}
                        >
                           {/* Status Indicator */}
                           <div className={`w-2 h-2 rounded-full ${styles.indicatorClass}`}></div>
                           
                           <div className="text-left">
                             <div className="text-xs font-mono uppercase tracking-wider opacity-70">Module_0{index + 1}</div>
                             <div className={`font-bold whitespace-nowrap ${isActive ? styles.accentColor : ''}`}>{track.title}</div>
                           </div>
                        </button>
                      )
                   })}
                 </div>
              </div>

              {/* Week Navigation */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {activeTrack.weeks.map((week) => {
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
              ? `STATUS: TRAINING [${activeTrack.title.toUpperCase()}]`
              : "STATUS: ACQUIRING KNOWLEDGE"}
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;