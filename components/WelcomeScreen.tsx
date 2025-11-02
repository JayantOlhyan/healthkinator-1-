
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-full animate-fade-in">
      <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4 font-display">Your Interactive Symptom Guesser</h2>
      <p className="max-w-md text-slate-300 mb-8">
        Answer a few simple questions, and our AI will help you understand your symptoms. Let's begin your health assessment.
      </p>
      <div className="bg-red-500 bg-opacity-10 border border-red-500/30 text-red-300 text-sm rounded-lg p-4 max-w-md mb-8">
        <strong>Disclaimer:</strong> This tool is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment.
      </div>
      <button
        onClick={onStart}
        className="font-display bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-500/20"
      >
        Start Diagnosis
      </button>
    </div>
  );
};

export default WelcomeScreen;
