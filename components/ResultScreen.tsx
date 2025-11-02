
import React from 'react';
import { Diagnosis } from '../types';

interface ResultScreenProps {
  diagnosis: Diagnosis | null;
  error: string | null;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ diagnosis, error, onRestart }) => {

  if (error) {
    return (
        <div className="text-center w-full animate-fade-in flex flex-col items-center">
            <h2 className="text-3xl font-bold text-red-400 mb-4 font-display">An Error Occurred</h2>
            <p className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-lg max-w-md mb-8">
                {error}
            </p>
            <button
                onClick={onRestart}
                className="font-display bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
            >
                Try Again
            </button>
        </div>
    );
  }

  if (!diagnosis) {
    return (
        <div className="text-center w-full animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-300 mb-4 font-display">No diagnosis available.</h2>
             <button
                onClick={onRestart}
                className="font-display bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
            >
                Start Over
            </button>
        </div>
    );
  }

  const confidenceColor = diagnosis.confidence > 75 ? 'text-green-400' : diagnosis.confidence > 50 ? 'text-yellow-400' : 'text-orange-400';

  return (
    <div className="text-left w-full max-w-lg mx-auto animate-fade-in flex flex-col items-center">
      <h2 className="text-2xl font-bold text-slate-100 mb-2 font-display text-center">Preliminary Diagnosis</h2>
      <p className="text-center text-slate-400 mb-6">Based on your answers, here is a possible condition.</p>
      
      <div className="w-full bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-3xl font-bold text-cyan-400 font-display">{diagnosis.condition}</h3>
            <span className={`text-lg font-bold ${confidenceColor}`}>{diagnosis.confidence}% Confident</span>
        </div>
        <div className="text-slate-300 space-y-4 whitespace-pre-wrap">
            <p>{diagnosis.report}</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="font-display bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
      >
        Start New Diagnosis
      </button>
    </div>
  );
};

export default ResultScreen;
