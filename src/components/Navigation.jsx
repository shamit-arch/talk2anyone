import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame } from 'lucide-react';

const Navigation = () => {
  const [streak, setStreak] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Load streak from local storage
    const storedStreak = localStorage.getItem('asl_streak') || '0';
    setStreak(parseInt(storedStreak, 10));
  }, []);

  const isActive = (path) => location.pathname === path ? 'text-primary' : 'text-grayText hover:text-whiteText';

  return (
    <nav className="flex items-center justify-between p-6 border-b border-surface/50 bg-background/50 backdrop-blur-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
        <img src="/favicon.png" alt="Logo" className="w-7 h-7" />
        <span>Talk2Anyone.ai</span>
      </Link>
      <div className="flex items-center gap-6 font-medium">
        <Link to="/learn" className={`transition-colors ${isActive('/learn')}`}>Learn ASL</Link>
        <Link to="/studio" className={`transition-colors ${isActive('/studio')}`}>AI Studio</Link>
        <Link to="/streaks" className={`transition-colors ${isActive('/streaks')}`}>Streaks</Link>
        
        <div className="flex items-center gap-2 bg-surface px-4 py-2 rounded-full border border-grayText/20">
          <Flame className="text-orange-500 w-5 h-5" />
          <span className="font-bold text-whiteText">{streak} Day{streak !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
