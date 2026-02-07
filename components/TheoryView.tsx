import React from 'react';
import { THEORY_TICKETS } from '../constants';
import TheoryCard from './TheoryCard';

const TheoryView: React.FC = () => {
  return (
    <div className="animate-fade-in-up">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 mb-4 tracking-tighter">
          THEORETICAL_MINIMUM
        </h2>
        <div className="inline-block px-4 py-2 bg-purple-900/20 border border-purple-500/30 rounded-lg backdrop-blur-sm">
          <p className="text-purple-200/80 font-mono text-sm">
            "Landau for Image Classification" // Hardcore Depth
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-12 max-w-5xl mx-auto">
        {THEORY_TICKETS.map((ticket) => (
          <TheoryCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </div>
  );
};

export default TheoryView;