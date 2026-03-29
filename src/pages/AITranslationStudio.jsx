import React, { useState, useEffect, useRef } from 'react';
import { Camera, Copy, Volume2, Share2, Hand, FileText, Target, CheckCircle2 } from 'lucide-react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';

const AITranslationStudio = () => {
  const [activeTab, setActiveTab] = useState('sign-to-text');
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState('Waiting for gesture...');
  const [textInput, setTextInput] = useState('');

  // Test Mode States
  const [testScore, setTestScore] = useState(0);
  const [displayTarget, setDisplayTarget] = useState('A');
  const [displayProgress, setDisplayProgress] = useState(0);

  const webcamRef = useRef(null);
  const requestRef = useRef();
  const lastPredictionRef = useRef({ letter: '', count: 0 });
  const testStateRef = useRef({ target: 'A', progress: 0, score: 0 });

  const getRandomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

  const incrementStreak = () => {
    const todayStr = new Date().toDateString();
    const lastActivityDateStr = localStorage.getItem('asl_last_activity');
    if (lastActivityDateStr === todayStr) return;

    let streak = parseInt(localStorage.getItem('asl_streak') || '0', 10);
    if (lastActivityDateStr) {
      const lastDate = new Date(lastActivityDateStr);
      const todayDate = new Date(todayStr);
      const diffTime = todayDate - lastDate;
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) streak += 1;
      else if (diffDays > 1) streak = 1;
    } else streak = 1;

    localStorage.setItem('asl_streak', streak.toString());
    localStorage.setItem('asl_last_activity', todayStr);
    window.dispatchEvent(new Event('storage')); // Update navbar
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        let loadedModel;
        try { loadedModel = await tf.loadLayersModel('/tfjs_model/model.json'); }
        catch (e) { loadedModel = await tf.loadGraphModel('/tfjs_model/model.json'); }
        setModel(loadedModel);
        setPrediction('Ready for Translation');

        const initialTarget = getRandomLetter();
        testStateRef.current.target = initialTarget;
        setDisplayTarget(initialTarget);
      } catch (err) {
        setPrediction("Model load failed.");
      }
    };
    loadModel();
  }, []);

  const detect = async () => {
    if (activeTab === 'text-to-sign') {
      requestRef.current = requestAnimationFrame(detect);
      return;
    }

    if (model && webcamRef.current && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video;
      try {
        const videoWidth = video.videoWidth;
        const videoHeight = video.videoHeight;
        const cropSize = Math.min(videoWidth, videoHeight);
        const startY = Math.floor((videoHeight - cropSize) / 2);
        const startX = Math.floor((videoWidth - cropSize) / 2);

        const tensor = tf.tidy(() => {
          let img = tf.browser.fromPixels(video);
          const croppedImg = tf.slice(img, [startY, startX, 0], [cropSize, cropSize, 3]);
          return tf.image.resizeNearestNeighbor(croppedImg, [256, 256])
            .toFloat().div(tf.scalar(255.0)).expandDims(0);
        });

        const predictionTensor = await model.predict(tensor);
        const scores = predictionTensor.dataSync();

        let maxScore = -1;
        let maxIndex = 0;
        for (let i = 0; i < scores.length; i++) {
          if (scores[i] > maxScore) { maxScore = scores[i]; maxIndex = i; }
        }

        if (scores.length >= 26) {
          const predictedLetter = String.fromCharCode(65 + Math.min(maxIndex, 25));

          if (activeTab === 'ai-skill-test') {
            if (maxScore > 0.1 && predictedLetter === testStateRef.current.target) {
              testStateRef.current.progress += 1;
            } else {
              testStateRef.current.progress = 0;
            }

            if (testStateRef.current.progress > 10) {
              testStateRef.current.score += 10;
              testStateRef.current.target = getRandomLetter();
              testStateRef.current.progress = 0;
              setTestScore(testStateRef.current.score);
              setDisplayTarget(testStateRef.current.target);
              incrementStreak(); // Auto update streak
            }
            setDisplayProgress(testStateRef.current.progress);
          } else {
            // Standard Translation Mode
            if (maxScore > 0.1) {
              if (lastPredictionRef.current.letter === predictedLetter) lastPredictionRef.current.count += 1;
              else { lastPredictionRef.current.letter = predictedLetter; lastPredictionRef.current.count = 1; }

              if (lastPredictionRef.current.count > 10) setPrediction(`CONFIRMED: ${predictedLetter}`);
              else setPrediction(`Holding ${predictedLetter}... (${lastPredictionRef.current.count}/10)`);
            } else {
              setPrediction(`Waiting for distinct gesture...`);
              lastPredictionRef.current.count = 0;
            }
          }
        } else {
          setPrediction(`Class: ${maxIndex}`);
        }
        tf.dispose([tensor, predictionTensor]);
      } catch (e) { }
    }
    setTimeout(() => { requestRef.current = requestAnimationFrame(detect); }, 150);
  };

  useEffect(() => {
    if (model) { requestRef.current = requestAnimationFrame(detect); }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [model, activeTab]);

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold">Talk2Anyone Studio</h1>
        <p className="text-grayText">Convert between Sign Language and Text instantly.</p>
      </div>

      <div className="glass-card shadow-2xl shadow-primary/5 flex flex-col md:flex-row overflow-hidden border-t-2 border-t-primary/20 bg-background/30">

        {/* Left Side: Input Source */}
        <div className="flex-1 min-w-0 p-8 space-y-6">
          <div className="flex flex-wrap gap-2 justify-between items-center bg-surface rounded-lg p-1 w-full xl:w-fit mb-4">
            <button
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'sign-to-text' ? 'bg-background text-whiteText shadow' : 'text-grayText hover:text-whiteText'}`}
              onClick={() => setActiveTab('sign-to-text')}
            >
              <Hand className="w-4 h-4" /> Translate
            </button>
            <button
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'text-to-sign' ? 'bg-background text-whiteText shadow' : 'text-grayText hover:text-whiteText'}`}
              onClick={() => setActiveTab('text-to-sign')}
            >
              <FileText className="w-4 h-4" /> Text to Sign
            </button>
            <button
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === 'ai-skill-test' ? 'bg-background text-whiteText shadow' : 'text-grayText hover:text-whiteText'}`}
              onClick={() => setActiveTab('ai-skill-test')}
            >
              <Target className="w-4 h-4" /> AI Skill Test
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg">Input Source</h3>
              <div className="flex gap-2 bg-surface rounded-md p-1">
                <button className="px-3 py-1 bg-background shadow rounded text-sm font-bold text-whiteText">
                  {activeTab === 'text-to-sign' ? 'Text' : 'Webcam'}
                </button>
              </div>
            </div>

            {activeTab !== 'text-to-sign' ? (
              <>
                <div className="bg-surface/50 rounded-lg p-4 border border-grayText/20 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-3 w-3">
                      {model ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-grayText"></span>
                      )}
                    </div>
                    <span className="text-sm font-medium">{model ? "AI Model Active" : "Loading Model Weights..."}</span>
                  </div>
                </div>

                <div className="relative aspect-video bg-black rounded-xl border border-grayText/20 overflow-hidden flex items-center justify-center shadow-inner">
                  <Webcam ref={webcamRef} audio={false} mirrored={true} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 m-auto w-48 h-48 sm:w-64 sm:h-64 border-4 border-dashed border-primary rounded-xl z-20 flex items-end justify-center pb-3 pointer-events-none shadow-[inset_0_0_30px_rgba(205,180,219,0.4),0_0_15px_rgba(205,180,219,0.4)]">
                    <span className="text-primary text-xs font-bold uppercase tracking-widest bg-background px-3 py-1.5 rounded-md backdrop-blur-md shadow-md border border-primary/30">Align Hand Here</span>
                  </div>
                  {!model && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 backdrop-blur-sm">
                      <span className="text-primary font-bold animate-pulse tracking-widest">INITIALIZING...</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="relative aspect-video bg-surface rounded-xl border border-grayText/20 overflow-hidden flex flex-col items-center justify-center p-8 space-y-4">
                <p className="text-grayText text-center max-w-sm">Type any text below. The AI will convert your text into the corresponding ASL hand signs sequentially.</p>
                <textarea
                  className="w-full h-32 bg-background border border-grayText/30 rounded-xl p-4 text-whiteText placeholder:text-grayText/50 focus:outline-none focus:border-primary transition-colors text-lg resize-none"
                  placeholder="Type a word to translate..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
            )}

          </div>
        </div>

        <div className="w-px bg-surface hidden md:block"></div>
        <div className="h-px bg-surface md:hidden w-full"></div>

        {/* Right Side: Output */}
        <div className="flex-1 min-w-0 p-8 space-y-6">
          <div className="flex justify-between items-center mb-6 mt-0 md:mt-16">
            <h3 className="font-bold text-lg text-whiteText uppercase">
              {activeTab === 'ai-skill-test' ? 'Scoreboard' : 'OUTPUT'}
            </h3>
          </div>

          {activeTab === 'sign-to-text' && (
            <div className="glass-card p-6 min-h-[160px] flex flex-col justify-between relative border border-grayText/10 bg-surface/30">
              <span className="absolute top-4 right-4 text-[10px] font-bold text-primary bg-background border border-primary/20 px-2 py-1 rounded tracking-wider">LIVE AI</span>
              <p className={`text-3xl font-bold tracking-wide leading-relaxed pt-6 transition-colors duration-300 ${prediction.startsWith('CONFIRMED') ? 'text-primary' : 'text-grayText'}`}>{prediction}</p>
            </div>
          )}

          {activeTab === 'text-to-sign' && (
            <div className="glass-card p-6 min-h-[160px] relative border border-grayText/10 bg-surface/30 flex flex-wrap content-start gap-4">
              {textInput.toUpperCase().split('').map((char, index) => {
                if (char >= 'A' && char <= 'Z') {
                  return (
                    <div key={index} className="inline-block flex-shrink-0 w-24 h-24 bg-background rounded-lg border border-grayText/20 overflow-hidden">
                      <img src={`/asl_handsigns/${char.toLowerCase()}.png`} alt={char} className="w-full h-full object-contain brightness-110" onError={(e) => { e.target.style.display = 'none' }} />
                    </div>
                  );
                } else if (char === ' ') {
                  return <div key={index} className="inline-block flex-shrink-0 w-12 h-24"></div>;
                }
                return null;
              })}
              {textInput.length === 0 && <p className="text-grayText/50">Sequence will appear here...</p>}
            </div>
          )}

          {activeTab === 'ai-skill-test' && (
            <div className="space-y-6">
              <div className="glass-card p-6 border border-primary/20 bg-background/50 flex justify-between items-center">
                <h4 className="font-bold text-grayText">Current Score</h4>
                <span className="text-3xl font-bold text-primary">{testScore}</span>
              </div>

              <div className="flex flex-col items-center justify-center space-y-6 pt-4">
                <h2 className="text-xl font-bold text-grayText uppercase tracking-widest">Your Target</h2>
                <div className="relative w-48 h-48 bg-surface rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(205,180,219,0.1)]">
                  <span className="text-8xl font-bold text-whiteText drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{displayTarget}</span>
                  {displayProgress > 0 && (
                    <div className="absolute bottom-4 w-3/4 h-2 bg-background rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all duration-150" style={{ width: `${(displayProgress / 10) * 100}%` }}></div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-grayText text-center max-w-xs">
                  Match this sign inside the camera box and hold it to score points! This automatically updates your daily streaks.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITranslationStudio;
