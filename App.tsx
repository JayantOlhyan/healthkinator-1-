import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Diagnosis, GeminiResponse, UserAnswer, Report, Content, UserProfile } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import ResultCard from './components/ResultScreen';
import ConnectDoctorScreen from './components/ConnectDoctorScreen';
import PastReportsScreen from './components/PastReportsScreen';
import SettingsScreen from './components/SettingsScreen';
import { Header } from './components/Layout';
import { generateResponse, generateSpeech } from './services/geminiService';
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
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'Guest', avatar: 'default' });

  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<Content[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);

  // Theme is always dark/navy now
  useEffect(() => {
    localStorage.setItem('theme', 'dark');
  }, []);

  // Load reports and profile from backend on mount
  useEffect(() => {
    const loadData = async () => {
      const [loadedReports, loadedProfile] = await Promise.all([
        getReports(),
        getUserProfile(),
      ]);
      setReports(loadedReports);
      setUserProfile(loadedProfile);
    };
    loadData();
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleProfileUpdate = async (newProfile: UserProfile) => {
    await saveUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  const processResponse = useCallback(async (response: GeminiResponse, responseHistory: Content[]) => {
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
            history: responseHistory,
        };
        await saveReport(newReport);
        setReports(prev => [newReport, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  }, []);
  
  const handleError = (message: string) => {
      setError(message);
      setIsLoading(false);
  };

  const startGame = async (language: string) => {
    setGameState(GameState.Playing);
    setDiagnosis(null);
    setError(null);
    setHistory([]);
    setCurrentQuestion('');
    setCurrentAudio(null);
    setIsLoading(true);

    // TODO: use language selection to modify initial prompt if needed
    const initialPrompt = language === 'hi' 
      ? "Let's begin. Ask me the first question about my symptoms in Hindi."
      : "Let's begin. Ask me the first question about my symptoms.";

    const initialUserMessage: Content = { role: 'user', parts: [{ text: initialPrompt }] };
    setHistory([initialUserMessage]);

    try {
      const response = await generateResponse([initialUserMessage]);
      
      // Process text response immediately
      await processResponse(response, [initialUserMessage]);

      // Fetch speech in parallel
      (async () => {
        try {
          const audio = await generateSpeech(response.text);
          setCurrentAudio(audio);
        } catch (audioError) {
          console.warn("Speech generation failed, continuing with text only", audioError);
        }
      })();

    } catch (e) {
      handleError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnswer = async (answer: UserAnswer) => {
    if (isLoading) return;

    setIsLoading(true);
    setCurrentQuestion('');
    setCurrentAudio(null);

    const userAnswer: Content = { role: 'user', parts: [{ text: answer }] };
    const newHistory = [...history, userAnswer];
    setHistory(newHistory);

    try {
      const response = await generateResponse(newHistory);
      
      // Update UI text immediately for better responsiveness
      await processResponse(response, newHistory);
      
      // Fetch audio in parallel without blocking the UI update
      (async () => {
        try {
          let textToSpeak = '';
          if (response.type === 'question') {
              textToSpeak = response.text;
          } else if (response.type === 'diagnosis' && response.condition && response.confidence !== undefined) {
              textToSpeak = `The probable diagnosis is ${response.condition}, with a confidence of ${response.confidence} percent.`;
          }
          
          if (textToSpeak) {
            const audio = await generateSpeech(textToSpeak);
            setCurrentAudio(audio);
          }
        } catch (audioError) {
          console.warn("Speech generation failed, continuing with text only", audioError);
        }
      })();

    } catch (e) {
      handleError((e as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearReports = async () => {
    await clearReports();
    setReports([]);
  };

  const showPastReports = () => setGameState(GameState.PastReports);
  const showSettingsScreen = () => setGameState(GameState.Settings);
  const showConnectDoctorScreen = () => setGameState(GameState.ConnectDoctor);
  
  const showWelcomeScreen = () => {
    setGameState(GameState.Welcome);
    setDiagnosis(null);
  };


  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return (
          <div className="p-6 flex flex-grow overflow-hidden">
            {!diagnosis ? (
              <GameScreen 
                currentQuestion={currentQuestion}
                isLoading={isLoading}
                handleAnswer={handleAnswer}
                onQuit={showWelcomeScreen}
                audioData={currentAudio}
                history={history}
              />
            ) : (
              <ResultCard 
                diagnosis={diagnosis} 
                onViewReports={showPastReports} 
                onConnectDoctor={showConnectDoctorScreen} 
                audioData={currentAudio} 
              />
            )}
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
      case GameState.ConnectDoctor:
        return <ConnectDoctorScreen onBack={showWelcomeScreen} />;
      case GameState.Welcome:
      default:
        return <WelcomeScreen onStart={startGame} onShowSettings={showSettingsScreen} onViewReports={showPastReports} />;
    }
  };

  return (
    <div className="bg-brand-navy min-h-[100dvh] flex flex-col items-center justify-center sm:p-4 text-white font-sans">
      <div 
        className="w-full h-[100dvh] sm:h-[85vh] sm:max-h-[900px] sm:max-w-md sm:rounded-[3rem] bg-brand-navy sm:border-[8px] sm:border-gray-800 flex flex-col relative overflow-hidden shadow-2xl shadow-brand-emerald/10"
      >
        <main className="flex-grow flex flex-col relative z-10 w-full h-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
