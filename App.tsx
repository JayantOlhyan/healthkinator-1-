
import React, { useState, useCallback } from 'react';
import { GameState, Diagnosis } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { Header } from './components/Layout';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.Welcome);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    setGameState(GameState.Playing);
    setDiagnosis(null);
    setError(null);
  };

  const handleFinish = useCallback((result: Diagnosis) => {
    setDiagnosis(result);
    setGameState(GameState.Result);
  }, []);

  const handleError = useCallback((errorMessage: string) => {
    setError(errorMessage);
    setGameState(GameState.Result); // Show error on result screen
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case GameState.Playing:
        return <GameScreen onFinish={handleFinish} onError={handleError} />;
      case GameState.Result:
        return <ResultScreen diagnosis={diagnosis} error={error} onRestart={handleStart} />;
      case GameState.Welcome:
      default:
        return <WelcomeScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center justify-center p-4 selection:bg-cyan-400 selection:text-slate-900">
      <div 
        className="w-full max-w-2xl min-h-[80vh] md:min-h-[700px] bg-black bg-opacity-30 backdrop-blur-md rounded-2xl shadow-2xl shadow-cyan-500/10 border border-cyan-500/20 flex flex-col"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(10, 25, 47, 0.5) 0%, rgba(3, 7, 18, 0.8) 100%)'
        }}
      >
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
      <footer className="text-center text-xs text-slate-500 mt-4 font-display">
        <p>Healthkinator &copy; 2024. This is not a substitute for professional medical advice.</p>
      </footer>
    </div>
  );
};

export default App;
