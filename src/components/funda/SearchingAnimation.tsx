'use client';
import React, { useState, useEffect } from 'react';
import { Search, TrendingUp } from 'lucide-react';

interface SearchingAnimationProps {
  onComplete: () => void;
}

export default function SearchingAnimation({ onComplete }: SearchingAnimationProps) {
  const [progress, setProgress] = useState(0);
  const [currentAction, setCurrentAction] = useState('Initializing AI search...');
  const [foundCount, setFoundCount] = useState(0);

  useEffect(() => {
    const actions = [
      { text: 'Connecting to Funda.nl...', duration: 1000 },
      { text: 'Scanning available properties...', duration: 2000 },
      { text: 'Analyzing property details...', duration: 2000 },
      { text: 'Applying your preferences...', duration: 1500 },
      { text: 'Ranking best matches...', duration: 1500 },
      { text: 'Finalizing results...', duration: 1000 }
    ];

    let currentProgress = 0;
    let actionIndex = 0;

    const updateProgress = () => {
      if (actionIndex < actions.length) {
        setCurrentAction(actions[actionIndex].text);
        const increment = 100 / actions.length;
        const targetProgress = Math.min((actionIndex + 1) * increment, 100);

        const interval = setInterval(() => {
          currentProgress += 1;
          setProgress(Math.min(currentProgress, targetProgress));

          if (currentProgress % 5 === 0 && foundCount < 47) {
            setFoundCount(prev => Math.min(prev + Math.floor(Math.random() * 4) + 2, 47));
          }

          if (currentProgress >= targetProgress) {
            clearInterval(interval);
            actionIndex++;
            if (actionIndex < actions.length) {
              setTimeout(updateProgress, 200);
            } else {
              setTimeout(() => onComplete(), 800);
            }
          }
        }, actions[actionIndex].duration / increment);
      }
    };

    updateProgress();
  }, [onComplete, foundCount]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl p-10 md:p-14 shadow-2xl border border-slate-100">
          <div className="text-center mb-10">
            <div className="relative w-28 h-28 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full animate-pulse"></div>
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">AI is Working For You</h2>
            <p className="text-xl text-slate-600">Analyzing properties to find your perfect match</p>
          </div>

          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                {currentAction}
              </span>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {Math.floor(progress)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
              <div
                className="h-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-5">
            <div className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl text-center border border-indigo-200">
              <div className="text-4xl font-bold text-indigo-600 mb-2">{foundCount}</div>
              <div className="text-sm font-semibold text-indigo-800">Properties Scanned</div>
            </div>
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl text-center border border-purple-200">
              <div className="text-4xl font-bold text-purple-600 mb-2">Top</div>
              <div className="text-sm font-semibold text-purple-800">Best Matches</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}