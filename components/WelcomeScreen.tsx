import React from 'react';

import { SettingsIcon, FileTextIcon } from './icons';

interface WelcomeScreenProps {
  onStart: (language: string) => void;
  onViewReports: () => void;
  onShowSettings: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onViewReports, onShowSettings }) => {
  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-6 animate-fade-in relative overflow-hidden">
      {/* Top Header Controls */}
      <div className="w-full flex justify-between items-center z-20 relative pt-2">
         <button onClick={onShowSettings} className="p-2 text-gray-400 hover:text-white transition-colors bg-white/5 rounded-full hover:bg-white/10">
            <SettingsIcon className="w-6 h-6" />
         </button>
         <button onClick={onViewReports} className="p-2 text-brand-emerald hover:text-brand-teal transition-colors bg-brand-emerald/10 rounded-full hover:bg-brand-emerald/20">
            <FileTextIcon className="w-6 h-6" />
         </button>
      </div>

      {/* Subtle Background Pattern/Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-brand-emerald/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top / Center Content */}
      <div className="flex flex-col items-center justify-center flex-grow w-full z-10 mt-10">
        <div className="relative mb-8">
          {/* Avatar with Strong Neon Glow */}
           <div className="w-40 h-40 rounded-full border-2 border-brand-emerald glow-emerald flex items-center justify-center bg-brand-navy/50 p-6 relative overflow-hidden">
              <img 
                src="/logo.svg" 
                alt="Healthkinator Logo" 
                className="w-full h-full object-contain drop-shadow-lg"
              />
           </div>
        </div>

        <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Healthkinator</h1>
        <p className="text-brand-emerald text-lg font-medium text-center px-4">
          Your Interactive Symptom Guesser
        </p>
      </div>

      {/* Bottom Actions */}
      <div className="w-full max-w-sm flex flex-col gap-4 mb-4 z-10">
        <button
          onClick={() => onStart('en')}
          className="w-full font-bold bg-brand-teal text-white py-4 px-6 rounded-full text-lg hover:bg-brand-emerald transition-all duration-300 transform active:scale-95"
        >
          Start in English
        </button>
        <button
          onClick={() => onStart('hi')}
          className="w-full font-bold bg-brand-orange text-white py-4 px-6 rounded-full text-lg hover:bg-[#ff8a3d] transition-all duration-300 transform active:scale-95 shadow-lg shadow-brand-orange/20"
        >
          हिंदी में शुरू करें
        </button>
      </div>
      
      {/* Disclaimer (Optional but good overlay) */}
      <p className="text-xs text-gray-400 text-center max-w-xs z-10 mt-2">
        This tool is for informational purposes only. Please consult a doctor for diagnosis.
      </p>
    </div>
  );
};

export default WelcomeScreen;