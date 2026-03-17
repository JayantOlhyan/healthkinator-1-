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
    <div className="flex flex-col items-center h-full w-full p-6 animate-fade-in text-white relative overflow-y-auto hide-scrollbar pb-10">
      
      {/* Top Section */}
      <div className="flex flex-col items-center mt-4 mb-6 z-10 w-full flex-shrink-0">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">
          I think I know!
        </h1>
      </div>

      {/* Main Result Card */}
      <div className="w-full max-w-sm rounded-[2.5rem] border-[3px] border-brand-emerald bg-gradient-to-br from-[#0F292B] to-[#0a1b1d] text-white p-6 shadow-2xl glow-emerald-strong relative z-10 mb-8 flex-shrink-0 animate-scale-in">
          
          {/* Header row in card */}
          <div className="flex justify-between items-start mb-6 border-b border-brand-emerald/20 pb-5">
              <h2 className="text-2xl font-black max-w-[50%] leading-tight text-white drop-shadow-md">
                {diagnosis.condition}
              </h2>

              {/* Confidence Gauge */}
              <div className="flex flex-col items-center min-w-[30%]">
                 <div className="relative w-24 h-12 overflow-hidden flex items-end justify-center mb-1">
                     <div className="absolute top-0 w-24 h-24 border-4 border-white/5 rounded-full"></div>
                     <div 
                        className="absolute top-0 w-24 h-24 border-4 border-brand-emerald rounded-full transition-all duration-1000 ease-out"
                        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)', transformOrigin: 'center', transform: `rotate(${(diagnosis.confidence / 100) * 180 - 180}deg)` }}
                     ></div>
                 </div>
                 <p className="text-[10px] uppercase tracking-[0.2em] text-brand-emerald/80 font-bold mb-0">Confidence</p>
                 <p className="text-2xl font-black text-white drop-shadow-sm">{diagnosis.confidence}%</p>
              </div>
          </div>

          {/* Diagnosis Analysis */}
          {diagnosis.analysis && (
            <div className="mb-6 bg-brand-emerald/10 rounded-2xl p-4 border border-brand-emerald/20">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">📋</span>
                    <h3 className="text-xs uppercase tracking-widest font-bold text-brand-emerald">Medical Analysis</h3>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed font-medium italic">
                    "{diagnosis.analysis}"
                </p>
            </div>
          )}

          {/* List Details */}
          <div className="space-y-5">
              <div className="flex items-center group">
                  <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center mr-4 border border-brand-emerald/20 transition-all group-hover:scale-110">
                    <span className="text-xl">⚖️</span>
                  </div>
                  <div>
                      <span className="text-gray-400 text-[10px] uppercase tracking-widest block font-bold">Severity Level</span>
                      <span className="font-bold text-brand-emerald">{severity}</span>
                  </div>
              </div>
              
              <div className="flex items-start group">
                  <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center mr-4 border border-brand-emerald/20 shrink-0 transition-all group-hover:scale-110">
                    <span className="text-xl">🛏️</span>
                  </div>
                  <div className="flex-1">
                      <span className="text-gray-400 text-[10px] uppercase tracking-widest block font-bold mb-2">Recommended Actions</span>
                      <ul className="space-y-3">
                        {diagnosis.suggestions && diagnosis.suggestions.length > 0 ? (
                          diagnosis.suggestions.map((sug, idx) => (
                            <li key={idx} className="flex gap-3 text-sm items-start">
                              <span className="text-brand-emerald shrink-0 bg-brand-emerald/20 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">{idx + 1}</span>
                              <span className="text-gray-100 font-semibold leading-tight">{sug}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-white font-medium italic opacity-70">No specific recommendations provided.</li>
                        )}
                      </ul>
                  </div>
              </div>

              <div className="flex items-center pt-4 border-t border-brand-emerald/10 group">
                  <div className="w-10 h-10 rounded-xl bg-brand-emerald/10 flex items-center justify-center mr-4 border border-brand-emerald/20 transition-all group-hover:scale-110">
                    <span className="text-xl">👨‍⚕️</span>
                  </div>
                  <div>
                      <span className="text-gray-400 text-[10px] uppercase tracking-widest block font-bold">Doctor Visit Urgency</span>
                      <span className={`font-bold px-3 py-1 rounded-lg text-[10px] uppercase tracking-widest mt-1 inline-block ${urgencyColor}`}>{urgency}</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Doctor Connection Section */}
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-3xl p-6 mb-8 z-10 flex-shrink-0">
          <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full border border-brand-orange p-1 overflow-hidden bg-brand-navy">
                  <img src="/doctor-avatar.png" alt="Doctor" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                  <h3 className="font-bold text-white">Need professional help?</h3>
                  <p className="text-xs text-gray-400">Connect with Apollo 24/7 doctors instantly</p>
              </div>
          </div>
          <button
            onClick={() => (window.location.href = 'https://www.apollo247.com/doctors')}
            className="w-full font-bold bg-brand-orange text-white py-3 px-6 rounded-2xl text-base hover:bg-[#ff8a3d] transition-all duration-300 shadow-lg shadow-brand-orange/20 glow-orange"
          >
            Contact Apollo 24/7 Doctor
          </button>
      </div>

      {/* Bottom Actions */}
      <div className="w-full max-w-sm flex flex-col gap-4 z-10 flex-shrink-0">
        <button
          onClick={onViewReports}
          className="w-full font-bold bg-[#143632] border border-brand-emerald text-brand-emerald py-4 px-6 rounded-2xl text-lg hover:bg-[#1A4541] transition-all duration-300 shadow-lg"
        >
          View Full Report
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default ResultScreen;
