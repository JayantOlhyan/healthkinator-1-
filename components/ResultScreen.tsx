import React from 'react';
import { Diagnosis } from '../types';

interface ResultScreenProps {
  diagnosis: Diagnosis;
  onViewReports: () => void;
  audioData: string | null;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ diagnosis, onViewReports }) => {
  // Infer mock severity and urgency from confidence
  let severity = 'Moderate';
  let urgency = 'Medium';
  let urgencyColor = 'bg-yellow-500/20 text-yellow-400';

  if (diagnosis.confidence > 80) {
    severity = 'Mild';
    urgency = 'Low';
    urgencyColor = 'bg-brand-emerald/20 text-brand-emerald';
  } else if (diagnosis.confidence < 50) {
    severity = 'Severe';
    urgency = 'High';
    urgencyColor = 'bg-red-500/20 text-red-400';
  }

  // The backend might not parse these perfectly (it just returns textual suggestions)
  // We'll map the first suggestion to "Recommended Action"
  const recommendation = diagnosis.suggestions && diagnosis.suggestions.length > 0 
      ? diagnosis.suggestions[0] 
      : 'Rest and observe symptoms';

  return (
    <div className="flex flex-col items-center justify-between h-full w-full p-6 animate-fade-in text-white relative">
      
      {/* Top Section */}
      <div className="flex flex-col items-center mt-4 mb-6 z-10 w-full">
        {/* Small avatar with orange glow */}
        <div className="w-20 h-20 rounded-full border-2 border-brand-orange p-1 glow-orange-border mb-4 overflow-hidden relative">
            <div className="absolute inset-0 bg-brand-orange/10 rounded-full"></div>
            <img src="/doctor-avatar.png" alt="Doctor" className="w-full h-full object-cover rounded-full mix-blend-screen" />
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          I think I know!
        </h1>
      </div>

      {/* Main Result Card */}
      <div className="w-full max-w-sm rounded-[2rem] border-[3px] border-brand-emerald bg-[#0F292B]/80 text-white p-6 shadow-xl glow-emerald-strong relative z-10">
          
          {/* Header row in card */}
          <div className="flex justify-between items-start mb-6 border-b border-brand-emerald/30 pb-4">
              <h2 className="text-2xl font-bold max-w-[50%] leading-tight text-white drop-shadow-md">
                {diagnosis.condition}
              </h2>

              {/* Fake Confidence Gauge */}
              <div className="flex flex-col items-center min-w-[30%]">
                 <div className="relative w-24 h-12 overflow-hidden flex items-end justify-center mb-1">
                     {/* Semi circle arc track */}
                     <div className="absolute top-0 w-24 h-24 border-4 border-gray-700 rounded-full"></div>
                     {/* Active arc */}
                     <div 
                        className="absolute top-0 w-24 h-24 border-4 border-brand-emerald rounded-full transition-all duration-1000 ease-out"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', transformOrigin: 'center', transform: `rotate(${(diagnosis.confidence / 100) * 180 - 180}deg)` }}
                     ></div>
                 </div>
                 <p className="text-[10px] uppercase tracking-wider text-brand-emerald font-semibold mb-0">Confidence</p>
                 <p className="text-2xl font-extrabold text-white drop-shadow-sm">{diagnosis.confidence}%</p>
              </div>
          </div>

          {/* List Details */}
          <div className="space-y-4">
              <div className="flex items-center">
                  <span className="text-2xl mr-4 opacity-80">⚖️</span>
                  <div>
                      <span className="text-gray-300 text-sm">Severity Level: </span>
                      <span className="font-bold text-brand-emerald">{severity}</span>
                  </div>
              </div>
              <div className="flex items-start">
                  <span className="text-2xl mr-4 opacity-80 mt-1">🛏️</span>
                  <div>
                      <span className="text-gray-300 text-sm">Recommended Action:<br/></span>
                      <span className="font-bold text-white leading-tight block mt-1">{recommendation}</span>
                  </div>
              </div>
              <div className="flex items-center">
                  <span className="text-2xl mr-4 opacity-80">👨‍⚕️</span>
                  <div>
                      <span className="text-gray-300 text-sm">Doctor Visit Urgency: </span>
                      <span className={`font-bold px-2 py-0.5 rounded text-xs uppercase tracking-wide ml-1 ${urgencyColor}`}>{urgency}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Bottom Actions */}
      <div className="w-full max-w-sm flex flex-col gap-4 mt-10 mb-2 z-10">
        <button
          onClick={onViewReports}
          className="w-full font-bold bg-[#143632] border border-brand-emerald text-brand-emerald py-4 px-6 rounded-2xl text-lg hover:bg-[#1A4541] transition-all duration-300 shadow-lg"
        >
          View Full Report
        </button>
        <button
          className="w-full font-bold bg-brand-orange text-white py-4 px-6 rounded-2xl text-lg hover:bg-[#ff8a3d] transition-all duration-300 shadow-lg shadow-brand-orange/20 glow-orange"
        >
          Connect to Doctor
        </button>
      </div>

    </div>
  );
};

export default ResultScreen;
