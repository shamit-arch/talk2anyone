import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const LearnASL = () => {
  const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <h1 className="text-4xl font-bold mb-4">Learn ASL Alphabet</h1>
          <p className="text-grayText text-lg">Master the foundational signs of American Sign Language.</p>
        </motion.div>
        
        <motion.a 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/asl_handsigns/all.jpg" 
          download="ASL_Cheatsheet.jpg"
          className="bg-primary hover:bg-primaryHover text-black px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(205,180,219,0.3)] w-fit"
        >
          <Download className="w-5 h-5" />
          Download Cheatsheet
        </motion.a>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
      >
        {alphabet.map((letter) => (
          <motion.div 
            variants={itemVariants}
            key={letter} 
            className="glass-card flex flex-col items-center p-4 aspect-[4/5] hover:bg-surface transition-colors cursor-pointer group hover:border-primary/50 relative overflow-hidden"
          >
            <div className="w-full flex-1 overflow-hidden mb-4 bg-white rounded-md shadow-inner flex items-center justify-center p-2">
              <img 
                src={`/asl_handsigns/${letter}.png`} 
                alt={`ASL sign for ${letter}`} 
                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span className="text-3xl font-bold text-whiteText group-hover:text-primary uppercase transition-colors">{letter}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default LearnASL;
