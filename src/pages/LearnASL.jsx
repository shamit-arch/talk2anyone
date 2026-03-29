import React from 'react';
import { Download } from 'lucide-react';

const LearnASL = () => {
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-4">Learn ASL Alphabet</h1>
          <p className="text-grayText text-lg">Master the foundational signs of American Sign Language.</p>
        </div>
        
        <a 
          href="/asl_handsigns/all.jpg" 
          download="ASL_Cheatsheet.jpg"
          className="bg-primary hover:bg-primaryHover text-black px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(205,180,219,0.3)] w-fit"
        >
          <Download className="w-5 h-5" />
          Download Cheatsheet
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {alphabet.map((letter) => (
          <div key={letter} className="glass-card flex flex-col items-center justify-center p-6 aspect-square hover:bg-surface transition-colors cursor-pointer group hover:border-primary/50 relative overflow-hidden">
            <img 
              src={`/asl_handsigns/${letter}.png`} 
              alt={`ASL sign for ${letter}`} 
              className="w-full h-full object-contain mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-md z-10 brightness-110"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-2xl font-bold text-grayText group-hover:text-primary uppercase z-10 transition-colors mt-1">{letter}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnASL;
