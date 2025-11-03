import React from 'react';
import { Diagnosis } from '../types';
import { ChevronRightIcon } from './icons';

interface ResultCardProps {
  diagnosis: Diagnosis;
  onViewReports?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ diagnosis, onViewReports }) => {
  const confidence = diagnosis.confidence;

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

        <button
            className="w-full font-bold bg-emerald-600 text-white py-4 px-8 rounded-2xl text-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30"
        >
            Recommend Telemedicine
        </button>
        {onViewReports && (
            <button onClick={onViewReports} className="w-full mt-4 flex justify-between items-center p-4 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <span className="font-bold text-gray-800 dark:text-gray-100">Past Reports</span>
                <ChevronRightIcon className="w-6 h-6 text-gray-400" />
            </button>
        )}
    </div>
  );
};

export default ResultCard;