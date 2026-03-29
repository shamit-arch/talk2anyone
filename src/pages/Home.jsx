import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade-in">

      <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
        Master Sign Language with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Retro-Futuristic AI</span>
      </h1>
      <p className="text-xl text-grayText max-w-2xl">
        Convert between Sign Language and Text instantly. Practice your skills and build daily streaks on your device.
      </p>
      <div className="flex gap-4 pt-8">
        <Link to="/studio" className="bg-primary hover:bg-primaryHover text-black px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 transform hover:scale-105 shadow-[0_0_20px_rgba(205,180,219,0.3)]">
          Try AI Studio Now <ArrowRight />
        </Link>
        <Link to="/learn" className="glass-card hover:bg-surface text-whiteText px-8 py-4 rounded-xl font-bold text-lg transition-all">
          Learn A-Z Signs
        </Link>
      </div>
    </div>
  );
};

export default Home;
