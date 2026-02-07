import React from 'react';
import { Week } from '../types';
import DayCard from './DayCard';

interface WeekViewProps {
  week: Week;
}

const WeekView: React.FC<WeekViewProps> = ({ week }) => {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-12 text-center relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent blur-xl"></div>
        <h2 className="relative text-2xl md:text-3xl font-bold text-white mb-2 tracking-tight">
          {week.subtitle}
        </h2>
        <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto opacity-50"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {week.competitions.map((comp) => (
          <DayCard 
            key={comp.day} 
            competition={comp} 
            isEven={false} // Unused in new design
          />
        ))}
      </div>
    </div>
  );
};

export default WeekView;