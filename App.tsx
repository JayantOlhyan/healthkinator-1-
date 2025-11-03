import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Diagnosis, GeminiResponse, UserAnswer, Report, Content, UserProfile } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import ResultCard from './components/ResultScreen';
import PastReportsScreen from './components/PastReportsScreen';
import SettingsScreen from './components/SettingsScreen';
import { Header } from './components/Layout';
import { generateResponse } from './services/geminiService';
import { getReports, saveReport, clearReports, getUserProfile, saveUserProfile } from './services/storageService';

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const storedTheme = window.localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(() => getUserProfile());

  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Content[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    setReports(getReports());
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleProfileUpdate = (newProfile: UserProfile) => {
    saveUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  const processResponse = useCallback((response: GeminiResponse, responseHistory: Content[]) => {
    const modelResponse: Content = { role: 'model', parts: [{ text: JSON.stringify(response) }] };
    setHistory([...responseHistory, modelResponse]);

    if (response.type === 'question') {
        setCurrentQuestion(response.text);
    } else if (response.type === 'diagnosis' && response.condition && response.confidence !== undefined) {
        const finalDiagnosis: Diagnosis = {
          condition: response.condition,
          report: response.text,
          confidence: response.confidence,
          suggestions: response.suggestions,
        };
        setDiagnosis(finalDiagnosis);

        const newReport: Report = {
            id: new Date().toISOString(),
            date: new Date().toISOString(),
            diagnosis: finalDiagnosis,
            history: responseHistory, // History *before* the model's diagnosis response
        };
        saveReport(newReport);
        setReports(prev => [newReport, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);
  
  const handleError = (message: string) => {
      setError(message);
  };

  const startGame = async () => {
    setGameState(GameState.Playing);
    setDiagnosis(null);
    setError(null);
    setHistory([]);
    setCurrentQuestion('');
    setIsLoading(true);

    const initialUserMessage: Content = { role: 'user', parts: [{ text: "Let's begin. Ask me the first question about my symptoms." }] };
    setHistory([initialUserMessage]);

    try {
      const response = await generateResponse([initialUserMessage]);
      processResponse(response, [initialUserMessage]);
    } catch (e) {
      handleError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswer = async (answer: UserAnswer) => {
    if (isLoading) return;

    setIsLoading(true);
    const userAnswer: Content = { role: 'user', parts: [{ text: answer }] };
    const newHistory = [...history, userAnswer];
    setHistory(newHistory);

    try {
      const response = await generateResponse(newHistory);
      processResponse(response, newHistory);
    } catch (e) {
      handleError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearReports = () => {
    clearReports();
    setReports([]);
  };

  const showPastReports = () => setGameState(GameState.PastReports);
  const showSettingsScreen = () => setGameState(GameState.Settings);
  
  const showWelcomeScreen = () => {
    setGameState(GameState.Welcome);
    setDiagnosis(null);
  };


  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return (
          <div className="p-6 flex flex-col flex-grow">
            <GameScreen 
              currentQuestion={currentQuestion}
              isLoading={isLoading && !diagnosis}
              handleAnswer={handleAnswer}
              onQuit={showWelcomeScreen}
            />
            {diagnosis && <ResultCard diagnosis={diagnosis} onViewReports={showPastReports} />}
            {error && (
                <div className="mt-4 text-center text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 p-4 rounded-lg">
                    <strong>Error:</strong> {error}
                </div>
            )}
          </div>
        );
      case GameState.PastReports:
        return <PastReportsScreen reports={reports} onBack={showWelcomeScreen} />;
      case GameState.Settings:
        return <SettingsScreen
                  userProfile={userProfile}
                  onProfileUpdate={handleProfileUpdate}
                  onBack={showWelcomeScreen}
                  onClearReports={handleClearReports}
                  theme={theme}
                  setTheme={setTheme}
               />;
      case GameState.Welcome:
      default:
        return <WelcomeScreen onStart={startGame} onViewReports={showPastReports} />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col min-h-[90vh] md:min-h-[700px]"
      >
        <Header userProfile={userProfile} theme={theme} toggleTheme={toggleTheme} onShowSettings={showSettingsScreen} />
        <main className="flex-grow flex flex-col">
          {renderContent()}
        </main>
      </div>
      <footer className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
        <p>Healthkinator &copy; 2024. This is not medical advice.</p>
      </footer>
    </div>
  );
};

export default App;