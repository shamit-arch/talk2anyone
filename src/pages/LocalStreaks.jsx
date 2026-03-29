import React, { useState, useEffect } from 'react';
import { Flame, Award, Calendar } from 'lucide-react';

const LocalStreaks = () => {
  const [streak, setStreak] = useState(0);
  const [lastActivityDate, setLastActivityDate] = useState(null);
  const [hasPracticedToday, setHasPracticedToday] = useState(false);

  useEffect(() => {
    // We update state inside useEffect so it grabs the freshest localstorage data when mounted
    const refreshData = () => {
      const storedStreak = parseInt(localStorage.getItem('asl_streak') || '0', 10);
      const storedDate = localStorage.getItem('asl_last_activity');
      setStreak(storedStreak);
      setLastActivityDate(storedDate);
      if (storedDate === new Date().toDateString()) {
        setHasPracticedToday(true);
      }
    };
    refreshData();
    window.addEventListener('storage', refreshData);
    return () => window.removeEventListener('storage', refreshData);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative pt-10">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold">Your Progress</h1>
        <p className="text-grayText text-lg">Your streak automatically updates when you score points in the AI Skill Test.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>
          <Flame className={`w-24 h-24 transition-colors ${hasPracticedToday ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'text-grayText'}`} />
          <div>
            <span className="text-6xl font-bold">{streak}</span>
            <p className="text-xl text-grayText font-medium mt-2">Day Streak</p>
          </div>
        </div>

        <div className="glass-card p-8 flex flex-col justify-center space-y-8">
          <div className="flex items-center gap-4 border-b border-grayText/20 pb-4">
             <Calendar className="w-8 h-8 text-primary" />
             <div>
               <p className="text-sm text-grayText">Last Activity Date</p>
               <p className="text-lg font-bold">{lastActivityDate || 'No activity yet'}</p>
             </div>
          </div>
          <div className="flex items-center gap-4 pb-4">
             <Award className="w-8 h-8 text-primary" />
             <div>
               <p className="text-sm text-grayText">Current Milestone</p>
               <p className="text-lg font-bold">Sign Novice</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocalStreaks;
