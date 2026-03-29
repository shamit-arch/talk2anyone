import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import LearnASL from './pages/LearnASL';
import AITranslationStudio from './pages/AITranslationStudio';
import LocalStreaks from './pages/LocalStreaks';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/learn" element={<LearnASL />} />
            <Route path="/studio" element={<AITranslationStudio />} />
            <Route path="/streaks" element={<LocalStreaks />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
