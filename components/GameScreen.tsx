import React, { useState, useEffect } from 'react';
import type { Content } from '@google/genai';
import { Diagnosis, GeminiResponse, UserAnswer } from '../types';
import { generateResponse } from '../services/geminiService';
import { MAX_QUESTIONS } from '../constants';
import { LoadingSpinner, AiAvatarIcon } from './icons';

interface GameScreenProps {
  onFinish: (diagnosis: Diagnosis) => void;
  onError: (message: string) => void;
}

const AnswerButton: React.FC<{ onClick: () => void, children: React.ReactNode, disabled: boolean }> = ({ onClick, children, disabled }) => (
    <button 
        onClick={onClick}
        disabled={disabled}
        className="font-display w-full sm:w-auto text-sm sm:text-base bg-slate-800 border border-cyan-500/30 text-cyan-300 font-semibold py-2 px-6 rounded-lg hover:bg-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
    >
        {children}
    </button>
);

const GameScreen: React.FC<GameScreenProps> = ({ onFinish, onError }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [history, setHistory] = useState<Content[]>([]);
  
  useEffect(() => {
    const startGame = async () => {
      setIsLoading(true);
      const initialUserMessage: Content = { role: 'user', parts: [{ text: "Let's begin. Ask me the first question about my symptoms." }] };
      try {
        const response = await generateResponse([initialUserMessage]);
        if (response.type === 'question') {
          const modelResponse: Content = { role: 'model', parts: [{ text: JSON.stringify(response) }] };
          setHistory([initialUserMessage, modelResponse]);
        } else {
          throw new Error("Initial response was not a question.");
        }
      } catch (e) {
        const error = e as Error;
        onError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    startGame();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onError]);

  const handleAnswer = async (answer: UserAnswer) => {
    if (isLoading) return;

    setIsLoading(true);
    const userAnswer: Content = { role: 'user', parts: [{ text: answer }] };
    const newHistory = [...history, userAnswer];

    try {
      const response: GeminiResponse = await generateResponse(newHistory);
      const modelResponse: Content = { role: 'model', parts: [{ text: JSON.stringify(response) }] };
      setHistory([...newHistory, modelResponse]);

      if (response.type === 'diagnosis' && response.condition && response.confidence !== undefined) {
        onFinish({
          condition: response.condition,
          report: response.text,
          confidence: response.confidence,
        });
      }
    } catch (e) {
      const error = e as Error;
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    if (isLoading) return;
    // Remove the last user answer and the last model question to go back one step.
    setHistory(prev => prev.slice(0, -2));
  };
  
  const modelTurns = history.filter(h => h.role === 'model');
  const questionNumber = modelTurns.length;
  const lastModelTurn = modelTurns.length > 0 ? modelTurns[modelTurns.length - 1] : null;

  let currentQuestion = '';
  if (lastModelTurn && lastModelTurn.parts[0]?.text) {
      try {
          const parsed: GeminiResponse = JSON.parse(lastModelTurn.parts[0].text);
          if (parsed.type === 'question') {
              currentQuestion = parsed.text;
          }
      } catch (e) {
          console.error("Failed to parse last model message", e);
          currentQuestion = "Error displaying question.";
      }
  }

  const progress = Math.min(((questionNumber) / MAX_QUESTIONS) * 100, 100);
  const canGoBack = questionNumber > 1;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between animate-fade-in p-4">
        <div className="w-full">
            <div className="flex justify-between items-center mb-2 font-display text-cyan-400">
                <span>Question {questionNumber}</span>
                <span>Progress</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div className="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center w-full text-center my-8">
            <AiAvatarIcon className="w-20 h-20 text-cyan-400 mb-6" />
            {isLoading && history.length === 0 ? (
                <div className="flex flex-col items-center justify-center">
                    <LoadingSpinner className="w-12 h-12 text-cyan-500" />
                    <p className="mt-4 text-slate-300">Healthkinator is preparing...</p>
                </div>
            ) : isLoading ? (
                <div className="flex flex-col items-center justify-center">
                    <LoadingSpinner className="w-12 h-12 text-cyan-500" />
                    <p className="mt-4 text-slate-300">Healthkinator is thinking...</p>
                </div>
            ) : (
                <p className="text-xl md:text-2xl text-slate-100 font-medium max-w-lg animate-fade-in">
                    {currentQuestion}
                </p>
            )}
        </div>

        <div className="w-full">
            <div className="w-full flex flex-wrap justify-center gap-2 sm:gap-4">
                <AnswerButton onClick={() => handleAnswer('Yes')} disabled={isLoading}>Yes</AnswerButton>
                <AnswerButton onClick={() => handleAnswer('No')} disabled={isLoading}>No</AnswerButton>
                <AnswerButton onClick={() => handleAnswer('Probably')} disabled={isLoading}>Probably</AnswerButton>
                <AnswerButton onClick={() => handleAnswer('Probably not')} disabled={isLoading}>Probably Not</AnswerButton>
                <AnswerButton onClick={() => handleAnswer("Don't Know")} disabled={isLoading}>Don't Know</AnswerButton>
            </div>
            <div className="text-center mt-6">
                 <button
                    onClick={handleGoBack}
                    disabled={!canGoBack || isLoading}
                    className="font-display text-sm text-slate-400 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    &larr; Go back and change my answer
                </button>
            </div>
        </div>
    </div>
  );
};

export default GameScreen;
