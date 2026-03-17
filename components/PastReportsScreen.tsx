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
        // Not a valid JSON response
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
                <h3 className="text-xl font-bold text-white mb-4">Confirmed Symptoms</h3>
                <p className="text-gray-400 italic">No specific symptoms were confirmed during this session.</p>
            </div>
        );
    }

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold text-white mb-4">Confirmed Symptoms</h3>
            <div className="bg-[#14263A] rounded-xl p-4 border border-brand-emerald/20">
                <ul className="space-y-3">
                    {symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start">
                            <CheckIcon className="w-5 h-5 text-brand-emerald mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-200">{symptom}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ReportDetailView: React.FC<{ report: Report; onBack: () => void }> = ({ report, onBack }) => {
    return (
        <div className="p-6 animate-fade-in flex flex-col h-full text-white overflow-y-auto">
            <button onClick={onBack} className="flex items-center space-x-2 text-brand-emerald hover:text-brand-teal mb-4 self-start">
                <ChevronLeftIcon className="w-5 h-5" />
                <span>All Reports</span>
            </button>
            <div className="flex-grow pb-10">
                <div className="-mx-6">
                   {/* Remove padding to let ResultCard fill width if needed, or keep it wrapped */}
                   <ResultCard diagnosis={report.diagnosis} onViewReports={onBack} audioData={null} />
                </div>
                
                <SymptomList history={report.history} />
                
                <h3 className="text-xl font-bold text-white mt-8 mb-4">Full Conversation</h3>
                <div className="space-y-4">
                    {report.history
                      .slice(0, -2)
                      .filter(turn => turn.parts[0].text !== "Let's begin. Ask me the first question about my symptoms.")
                      .map((turn, index) => {
                        if (turn.role === 'user' && turn.parts[0].text) {
                            return (
                                <div key={index} className="flex justify-end animate-slide-in-right">
                                    <div className="bg-brand-emerald text-brand-navy p-3 rounded-2xl rounded-br-sm max-w-[80%] shadow">
                                        <p className="font-bold text-xs opacity-70 mb-1">You</p>
                                        <p className="font-medium">{turn.parts[0].text}</p>
                                    </div>
                                </div>
                            );
                        }
                        if (turn.role === 'model') {
                            const response = parseModelResponse(turn);
                            if (response?.type === 'question') {
                                return (
                                    <div key={index} className="flex justify-start animate-slide-in-left">
                                        <div className="bg-[#14263A] border border-brand-teal/30 p-3 rounded-2xl rounded-bl-sm max-w-[80%] shadow-lg">
                                            <p className="font-bold text-xs text-brand-teal mb-1">Healthkinator</p>
                                            <p className="text-gray-200">{response.text}</p>
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
        <div className="p-6 animate-fade-in flex flex-col h-full text-white">
             <div className="flex items-center justify-between mb-8 flex-shrink-0">
                <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors mr-2">
                    <ChevronLeftIcon className="w-6 h-6 text-white" />
                </button>
                <h2 className="text-3xl font-bold flex-grow text-center mr-10 relative">Past Reports</h2>
            </div>
            {reports.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400">
                    <FileTextIcon className="w-16 h-16 mb-4 opacity-50 text-brand-teal" />
                    <h3 className="text-xl font-bold text-white mb-2">No Reports Yet</h3>
                    <p>Complete a diagnosis to see your reports here.</p>
                </div>
            ) : (
                <ul className="space-y-4 overflow-y-auto flex-grow pb-10">
                    {reports.map(report => (
                        <li key={report.id}>
                            <button onClick={() => setSelectedReport(report)} className="w-full text-left p-5 bg-[#14263A] border border-brand-teal/20 rounded-2xl hover:bg-[#1C3652] hover:border-brand-emerald transition-all duration-300">
                                <div className="flex justify-between items-start mb-2">
                                    <p className="font-bold text-white text-lg pr-4 line-clamp-2">{report.diagnosis.condition}</p>
                                    <span className="text-xs font-medium text-brand-emerald px-2 py-1 bg-brand-emerald/10 rounded whitespace-nowrap">
                                        {new Date(report.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-700/50 rounded-full h-1.5 mb-1 overflow-hidden">
                                     <div className="bg-brand-emerald h-1.5 rounded-full" style={{ width: `${report.diagnosis.confidence}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-400 text-right">Confidence: {report.diagnosis.confidence}%</p>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default PastReportsScreen;