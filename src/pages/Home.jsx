import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8"
    >
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-6xl md:text-8xl font-extrabold tracking-tight leading-tight flex items-center gap-4"
      >
        <img src="/favicon.png" alt="Logo" className="w-40 h-40" /> 
          Talk2Anyone.ai <Sparkles className="text-yellow-400 w-10 h-10 animate-pulse" />
      </motion.h1>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
      >
        Master Sign Language with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Retro-Futuristic AI</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-xl text-grayText max-w-2xl"
      >
        Convert between Sign Language and Text instantly. Practice your skills and build daily streaks on your device.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex gap-4 pt-8"
      >
        <Link to="/studio" className="bg-primary hover:bg-primaryHover text-black px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center gap-2 transform hover:scale-105 shadow-[0_0_20px_rgba(205,180,219,0.3)]">
          Try AI Studio Now <ArrowRight />
        </Link>
        <Link to="/learn" className="glass-card hover:bg-surface text-whiteText px-8 py-4 rounded-xl font-bold text-lg transition-all cursor-pointer">
          Learn A-Z Signs
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default Home;
