import React, { useState, useEffect } from 'react';
import { Diagnosis } from '../types';
import { ChevronRightIcon, LightbulbIcon, ShareIcon } from './icons';
import { playAudio } from '../utils/audio';

interface ResultCardProps {
  diagnosis: Diagnosis;
  onViewReports?: () => void;
  audioData?: string | null;
}

const ResultCard: React.FC<ResultCardProps> = ({ diagnosis, onViewReports, audioData }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const confidence = diagnosis.confidence;
  const isShareSupported = typeof navigator !== 'undefined' && 'share' in navigator;

  useEffect(() => {
    if (audioData) {
      const speakDiagnosis = async () => {
        setIsSpeaking(true);
        try {
          await playAudio(audioData);
        } catch (error) {
          console.error("TTS for diagnosis failed", error);
        } finally {
          setIsSpeaking(false);
        }
      };
      speakDiagnosis();
    }
  }, [audioData]);

  const handleShare = async () => {
    if (!isShareSupported) return;

    try {
      await navigator.share({
        title: 'Healthkinator Diagnosis',
        text: `Healthkinator suggests a probable diagnosis of ${diagnosis.condition} with ${diagnosis.confidence}% confidence. This is a preliminary assessment and not a substitute for professional medical advice.`,
      });
    } catch (error) {
      console.error('Error sharing diagnosis:', error);
    }
  };

  return (
    <div className="w-full mt-8 animate-fade-in">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Result</h2>
        <div className="bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-6 mb-6">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Probable Diagnosis</p>
            <div className="flex justify-between items-center my-1">
                <h3 className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{diagnosis.condition}</h3>
                <span className={`text-2xl font-bold text-emerald-900 dark:text-emerald-100`}>{confidence}%</span>
            </div>
            <div className="w-full bg-emerald-200 dark:bg-emerald-900 rounded-full h-2.5 my-3">
                <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${confidence}%` }}></div>
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Condition probability</p>
        </div>

        {diagnosis.suggestions && diagnosis.suggestions.length > 0 && (
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
                    <LightbulbIcon className="w-6 h-6 mr-3 text-emerald-500" />
                    Recommendations
                </h3>
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4">
                    <ul className="space-y-3">
                        {diagnosis.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start">
                                <div className="w-5 h-5 bg-emerald-500 rounded-full mr-3 mt-1 flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                                    {index + 1}
                                </div>
                                <span className="text-gray-800 dark:text-gray-200">{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}

        <button
            disabled={isSpeaking}
            className="w-full font-bold bg-emerald-600 text-white py-4 px-8 rounded-2xl text-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Recommend Telemedicine
        </button>

        {isShareSupported && (
            <button 
                onClick={handleShare}
                disabled={isSpeaking}
                className="w-full mt-4 flex justify-center items-center p-4 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <ShareIcon className="w-5 h-5 mr-3" />
                <span className="font-bold text-gray-800 dark:text-gray-100">Share Diagnosis</span>
            </button>
        )}

        {onViewReports && (
            <button 
              onClick={onViewReports} 
              disabled={isSpeaking}
              className="w-full mt-4 flex justify-between items-center p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="font-bold text-gray-800 dark:text-gray-100">Past Reports</span>
                <ChevronRightIcon className="w-6 h-6 text-gray-400" />
            </button>
        )}
    </div>
  );
};

export default ResultCard;
