import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
  onViewReports: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, onViewReports }) => {
  return (
    <div className="text-left flex flex-col items-start justify-center h-full animate-fade-in p-6">
      <p className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Ready to begin?
      </p>
      <p className="max-w-md text-gray-500 dark:text-gray-400 mb-8">
        This tool is for informational purposes only. Please consult a qualified healthcare provider for an accurate diagnosis.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <button
            onClick={onStart}
            className="font-bold bg-emerald-600 text-white py-4 px-10 rounded-2xl text-lg hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/30"
        >
            Start Diagnosis
        </button>
        <button
            onClick={onViewReports}
            className="font-bold bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-4 px-10 rounded-2xl text-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
        >
            Past Reports
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;