import React, { useState, useEffect, useRef } from 'react';
import { UserAnswer } from '../types';
import { LoadingSpinner, MicrophoneIcon } from './icons';
import { generateSpeech } from '../services/geminiService';
import { playAudio, stopAudio } from '../utils/audio';

// Fix: Add type definitions for the Web Speech API to resolve TypeScript errors.
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface GameScreenProps {
  currentQuestion: string;
  isLoading: boolean;
  handleAnswer: (answer: UserAnswer) => void;
  onQuit: () => void;
}

const AnswerButton: React.FC<{ onClick: () => void, children: React.ReactNode, disabled: boolean, variant?: 'primary' | 'secondary' }> = ({ onClick, children, disabled, variant = 'secondary' }) => {
    const primaryClasses = "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/40";
    const secondaryClasses = "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600";
    
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`font-bold w-full sm:w-auto py-3 px-8 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${variant === 'primary' ? primaryClasses : secondaryClasses}`}
        >
            {children}
        </button>
    );
}

const GameScreen: React.FC<GameScreenProps> = ({ currentQuestion, isLoading, handleAnswer, onQuit }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Text-to-Speech for new questions
  useEffect(() => {
    if (currentQuestion && !isLoading) {
      const speakQuestion = async () => {
        setIsSpeaking(true);
        try {
          const base64Audio = await generateSpeech(currentQuestion);
          await playAudio(base64Audio);
        } catch (error) {
          console.error("TTS failed", error);
        } finally {
          setIsSpeaking(false);
        }
      };
      speakQuestion();
    }
    
    // Cleanup function to stop audio if component unmounts or question changes
    return () => {
        stopAudio();
    };
  }, [currentQuestion, isLoading]);

  // Speech-to-Text setup
  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setSpeechError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        setSpeechError("I didn't hear that. Please try again.");
      } else {
        setSpeechError(`Error: ${event.error}. Please try again.`);
      }
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
          } else {
              interimTranscript += event.results[i][0].transcript;
          }
      }
      setTranscript(interimTranscript);

      const processedTranscript = finalTranscript.trim().toLowerCase();
      if (processedTranscript) {
        const affirmative = ['yes', 'yeah', 'yep', 'yup', 'correct', 'affirmative', 'sure'];
        const negative = ['no', 'nope', 'nah', 'negative'];
        const uncertain = ["don't know", "do not know", "not sure", "unsure", "no idea"];

        if (affirmative.some(keyword => processedTranscript.includes(keyword))) {
          handleAnswer('Yes');
          recognition.stop();
        } else if (negative.some(keyword => processedTranscript.includes(keyword))) {
          handleAnswer('No');
          recognition.stop();
        } else if (uncertain.some(keyword => processedTranscript.includes(keyword))) {
          handleAnswer("I don't know");
          recognition.stop();
        } else {
          setSpeechError(`Sorry, I didn't understand "${finalTranscript}". Please say Yes, No, or I don't know.`);
        }
      }
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isSpeechRecognitionSupported, handleAnswer]);

  const handleAnswerClick = (answer: UserAnswer) => {
    if (isLoading) return;
    stopAudio(); // Interrupt speech if it's playing
    setIsSpeaking(false);
    handleAnswer(answer);
  };

  const handleQuitClick = () => {
    stopAudio();
    setIsSpeaking(false);
    onQuit();
  };

  const toggleListening = () => {
    if (isLoading || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      stopAudio(); // Stop TTS before starting recognition
      setIsSpeaking(false);
      recognitionRef.current.start();
    }
  };

  const getMicStatusText = () => {
    if (!isSpeechRecognitionSupported) return "Voice input not supported.";
    if (speechError) return speechError;
    if (isListening) return transcript ? `"${transcript}"` : "Listening...";
    if (isSpeaking) return "Healthkinator is speaking...";
    return "Tap the mic to answer";
  }

  return (
    <div className="w-full text-center flex-grow flex flex-col justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-40">
          <LoadingSpinner className="w-12 h-12 text-emerald-500" />
          <p className="mt-4 text-gray-500 dark:text-gray-400">Healthkinator is thinking...</p>
        </div>
      ) : (
        <div className="h-40 flex items-center justify-center">
          <h2 className="text-3xl text-gray-800 dark:text-gray-100 font-bold max-w-md animate-fade-in">
            {currentQuestion}
          </h2>
        </div>
      )}

      {/* Voice Input Section */}
      <div className="my-6 flex flex-col items-center justify-center space-y-3">
          <button
              onClick={toggleListening}
              disabled={!isSpeechRecognitionSupported || isLoading}
              className={`relative w-20 h-20 rounded-full transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed
                  ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-500/40' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/40'}`}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
              <MicrophoneIcon className="w-8 h-8"/>
              {isListening && <span className="absolute inset-0 rounded-full bg-white/30 animate-ping"></span>}
          </button>
          <p className="text-sm text-gray-500 dark:text-gray-400 h-5 px-2">
              {getMicStatusText()}
          </p>
      </div>


      <div className="w-full flex flex-wrap justify-center gap-3 sm:gap-4">
        <AnswerButton onClick={() => handleAnswerClick('Yes')} disabled={isLoading} variant="primary">Yes</AnswerButton>
        <AnswerButton onClick={() => handleAnswerClick('No')} disabled={isLoading}>No</AnswerButton>
        <AnswerButton onClick={() => handleAnswerClick("I don't know")} disabled={isLoading}>I don't know</AnswerButton>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleQuitClick}
          disabled={isLoading}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Quit Diagnosis
        </button>
      </div>
    </div>
  );
};

export default GameScreen;