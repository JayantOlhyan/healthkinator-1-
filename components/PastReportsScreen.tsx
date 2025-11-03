import React, { useState } from 'react';
import type { Report, Content, GeminiResponse } from '../types';
import ResultCard from './ResultScreen';
import { ChevronLeftIcon, FileTextIcon, CheckIcon } from './icons';

const parseModelResponse = (content: Content): GeminiResponse | null => {
    try {
        const text = content.parts[0].text;
        if (text && text.startsWith('{')) {
            return JSON.parse(text);
        }
    } catch (e) {
        // Not a valid JSON response, likely a user message part or malformed data.
    }
    return null;
};

const SymptomList: React.FC<{ history: Content[] }> = ({ history }) => {
    const symptoms: string[] = [];
    for (let i = 0; i < history.length - 1; i++) {
        const currentTurn = history[i];
        const nextTurn = history[i+1];

        if (currentTurn.role === 'model' && nextTurn.role === 'user' && nextTurn.parts[0].text === 'Yes') {
            const modelResponse = parseModelResponse(currentTurn);
            if (modelResponse && modelResponse.type === 'question') {
                let symptom = modelResponse.text
                    .replace(/^(Do you have|Are you experiencing|Is there|Is your|Have you been)\s*/i, '')
                    .replace(/\?$/, '')
                    .trim();
                symptom = symptom.replace(/^(a|an)\s/i, '').trim();
                symptom = symptom.charAt(0).toUpperCase() + symptom.slice(1);
                symptoms.push(symptom);
            }
        }
    }

    if (symptoms.length === 0) {
        return (
             <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Confirmed Symptoms</h3>
                <p className="text-gray-500 dark:text-gray-400 italic">No specific symptoms were confirmed during this session.</p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Confirmed Symptoms</h3>
            <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-4">
                <ul className="space-y-3">
                    {symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start">
                            <CheckIcon className="w-5 h-5 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-800 dark:text-gray-200">{symptom}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ReportDetailView: React.FC<{ report: Report; onBack: () => void }> = ({ report, onBack }) => {
    return (
        <div className="p-6 animate-fade-in flex flex-col h-full">
            <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-4 self-start">
                <ChevronLeftIcon className="w-5 h-5" />
                <span>All Reports</span>
            </button>
            <div className="flex-grow overflow-y-auto">
                {/* ResultCard is reused here without the restart/view reports buttons */}
                <ResultCard diagnosis={report.diagnosis} />
                
                <SymptomList history={report.history} />
                
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4">Full Conversation</h3>
                <div className="space-y-4">
                    {report.history
                      .slice(0, -2)
                      .filter(turn => turn.parts[0].text !== "Let's begin. Ask me the first question about my symptoms.")
                      .map((turn, index) => {
                        if (turn.role === 'user' && turn.parts[0].text) {
                            return (
                                <div key={index} className="flex justify-end animate-slide-in-right">
                                    <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-br-lg max-w-xs sm:max-w-sm shadow">
                                        <p className="font-semibold text-sm">You</p>
                                        <p>{turn.parts[0].text}</p>
                                    </div>
                                </div>
                            );
                        }
                        if (turn.role === 'model') {
                            const response = parseModelResponse(turn);
                            if (response?.type === 'question') {
                                return (
                                    <div key={index} className="flex justify-start animate-slide-in-left">
                                        <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-lg max-w-xs sm:max-w-sm shadow">
                                            <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">Healthkinator</p>
                                            <p className="text-gray-700 dark:text-gray-200">{response.text}</p>
                                        </div>
                                    </div>
                                );
                            }
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};


const PastReportsScreen: React.FC<{ reports: Report[], onBack: () => void }> = ({ reports, onBack }) => {
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);

    if (selectedReport) {
        return <ReportDetailView report={selectedReport} onBack={() => setSelectedReport(null)} />;
    }

    return (
        <div className="p-6 animate-fade-in flex flex-col h-full">
             <div className="flex items-center justify-between mb-6 flex-shrink-0">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Past Reports</h2>
                <button onClick={onBack} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
                    Start New
                </button>
            </div>
            {reports.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400">
                    <FileTextIcon className="w-16 h-16 mb-4 opacity-50" />
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No Reports Yet</h3>
                    <p>Complete a diagnosis to see your reports here.</p>
                </div>
            ) : (
                <ul className="space-y-3 overflow-y-auto flex-grow">
                    {reports.map(report => (
                        <li key={report.id}>
                            <button onClick={() => setSelectedReport(report)} className="w-full text-left p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <div className="flex justify-between items-center">
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{report.diagnosis.condition}</p>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{new Date(report.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Confidence: {report.diagnosis.confidence}%</p>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PastReportsScreen;