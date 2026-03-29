import React, { useState, useEffect, useRef } from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';

const AITest = () => {
  const [model, setModel] = useState(null);
  const [score, setScore] = useState(0);
  const [displayTarget, setDisplayTarget] = useState('A');
  const [displayProgress, setDisplayProgress] = useState(0); 

  const stateRef = useRef({ target: 'A', progress: 0, score: 0 });
  const webcamRef = useRef(null);
  const requestRef = useRef();

  const getRandomLetter = () => {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  useEffect(() => {
    const loadModel = async () => {
      try {
        let loadedModel;
        try { loadedModel = await tf.loadLayersModel('/tfjs_model/model.json'); } 
        catch (e) { loadedModel = await tf.loadGraphModel('/tfjs_model/model.json'); }
        setModel(loadedModel);
        
        const initialLetter = getRandomLetter();
        stateRef.current.target = initialLetter;
        setDisplayTarget(initialLetter);
      } catch (err) {}
    };
    loadModel();
  }, []);

  const detect = async () => {
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
             
             if (maxScore > 0.1 && predictedLetter === stateRef.current.target) {
                 stateRef.current.progress += 1;
             } else {
                 stateRef.current.progress = 0;
             }

             if (stateRef.current.progress > 10) {
                 // Success!
                 stateRef.current.score += 10;
                 stateRef.current.target = getRandomLetter();
                 stateRef.current.progress = 0;
                 setScore(stateRef.current.score);
                 setDisplayTarget(stateRef.current.target);
             }
             setDisplayProgress(stateRef.current.progress);
        }
        
        tf.dispose([tensor, predictionTensor]);
      } catch (e) {}
    }
    
    setTimeout(() => { requestRef.current = requestAnimationFrame(detect); }, 150);
  };

  useEffect(() => {
    if (model) { requestRef.current = requestAnimationFrame(detect); }
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [model]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in relative">
      <div className="text-center space-y-4">
         <h1 className="text-4xl font-bold">AI Skill Test</h1>
         <p className="text-grayText">Hold the gesture for the target letter to score points.</p>
         <div className="text-2xl font-bold text-primary">Score: {score}</div>
      </div>

      <div className="glass-card p-8 flex flex-col md:flex-row gap-8 items-center justify-center">
         
         {/* Webcam Box */}
         <div className="relative aspect-square w-full md:w-1/2 bg-black rounded-xl border border-grayText/20 overflow-hidden shadow-inner flex-shrink-0">
              <Webcam
                ref={webcamRef}
                audio={false}
                mirrored={true}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 m-auto w-[65%] h-[65%] border-2 border-dashed border-primary/60 rounded-xl z-20 pointer-events-none shadow-[inset_0_0_20px_rgba(205,180,219,0.2)] flex items-end justify-center pb-2">
                 <span className="text-primary/70 text-[10px] uppercase font-bold tracking-widest bg-background/80 px-2 py-1 rounded">Match Handsign Here</span>
              </div>
              
              {!model && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-30 backdrop-blur-sm">
                  <span className="text-primary font-bold animate-pulse tracking-widest">INITIALIZING AI...</span>
                </div>
              )}
         </div>

         {/* Target Box */}
         <div className="w-full md:w-1/2 flex flex-col items-center justify-center space-y-8">
             <h2 className="text-xl font-bold text-grayText uppercase tracking-widest">Your Target</h2>
             <div className="relative w-48 h-48 bg-surface rounded-2xl flex items-center justify-center border border-primary/30 shadow-[0_0_30px_rgba(205,180,219,0.1)]">
                 <span className="text-8xl font-bold text-whiteText drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">{displayTarget}</span>
                 {displayProgress > 0 && (
                     <div className="absolute bottom-4 w-3/4 h-2 bg-background rounded-full overflow-hidden">
                       <div className="h-full bg-primary transition-all duration-150" style={{ width: `${(displayProgress / 10) * 100}%` }}></div>
                     </div>
                 )}
             </div>
             
             <div className="flex items-center gap-2 text-sm text-grayText bg-surface/50 px-4 py-2 rounded-full border border-grayText/10">
                <Target className="w-4 h-4 text-orange-400" /> Keep holding until the bar fills!
             </div>
         </div>
         
      </div>
    </div>
  );
};

export default AITest;
