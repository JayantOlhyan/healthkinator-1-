import React, { useState, useEffect, useRef } from 'react';
import { UserAnswer, Content } from '../types';
import { LoadingSpinner, MicrophoneIcon, ChevronLeftIcon } from './icons';
import { playAudio, stopAudio } from '../utils/audio';

// (Keeping SpeechRecognition types)
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
  audioData: string | null;
  history: Content[];
}

const AnswerButton: React.FC<{ onClick: () => void, children: React.ReactNode, disabled: boolean, variant: 'yes' | 'no' }> = ({ onClick, children, disabled, variant }) => {
    const isYes = variant === 'yes';
    return (
        <button 
            onClick={onClick}
            disabled={disabled}
            className={`font-bold py-4 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex-1 flex items-center justify-center space-x-2 text-xl shadow-lg
                ${isYes ? 'bg-brand-success text-white hover:bg-emerald-600 shadow-brand-success/30' : 'bg-brand-danger text-white hover:bg-red-600 shadow-brand-danger/30'}`}
        >
            <span>{children}</span>
            {isYes ? <span>✓</span> : <span>✕</span>}
        </button>
    );
}

const GameScreen: React.FC<GameScreenProps> = ({ currentQuestion, isLoading, handleAnswer, onQuit, audioData, history }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSpeechRecognitionSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  // Calculate question number based on history (assumes alternating user/model messages)
  const questionNumber = Math.max(1, Math.floor((history.length + 1) / 2));
  const MAX_QUESTIONS = 12; // Example static max

  // Play audio when it's passed down as a prop
  useEffect(() => {
    if (audioData) {
      const play = async () => {
        setIsSpeaking(true);
        try {
          await playAudio(audioData);
        } catch (error) {
          console.error("Audio playback failed", error);
        } finally {
          setIsSpeaking(false);
        }
      };
      play();
    }
    
    // Cleanup function to stop audio if component unmounts or audio changes
    return () => {
        stopAudio();
    };
  }, [audioData]);

  // Speech-to-Text setup
  useEffect(() => {
    if (!isSpeechRecognitionSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionAPI();
    const recognition = recognitionRef.current;
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

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
      let finalConfidence = 0;

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const alternative = result[0];
        if (result.isFinal) {
          finalTranscript += alternative.transcript;
          finalConfidence = alternative.confidence;
        } else {
          interimTranscript += alternative.transcript;
        }
      }
      setTranscript(interimTranscript || finalTranscript);

      const processedTranscript = finalTranscript.trim();
      if (processedTranscript) {
        const CONFIDENCE_THRESHOLD = 0.4;
        
        if (finalConfidence < CONFIDENCE_THRESHOLD) {
          setSpeechError("I'm not quite sure what you said. Could you please speak a bit more clearly?");
          return;
        }

        const affirmative = ['yes', 'yeah', 'yep', 'yup', 'correct', 'affirmative', 'sure', 'i guess so', 'i think so', 'sounds right'];
        const negative = ['no', 'nope', 'nah', 'negative', "i don't think so", "not really"];
        const uncertain = ["don't know", "do not know", "not sure", "unsure", "no idea"];

        const affirmativeRegex = new RegExp(`\\b(${affirmative.join('|')})\\b`, 'i');
        const negativeRegex = new RegExp(`\\b(${negative.join('|')})\\b`, 'i');
        const uncertainRegex = new RegExp(`\\b(${uncertain.join('|')})\\b`, 'i');

        if (affirmativeRegex.test(processedTranscript)) {
          handleAnswer('Yes');
          recognition.stop();
        } else if (negativeRegex.test(processedTranscript)) {
          handleAnswer('No');
          recognition.stop();
        } else if (uncertainRegex.test(processedTranscript)) {
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
    return "";
  }

  return (
    <div className="w-full h-full flex flex-col pt-6 pb-8 px-6 relative animate-fade-in text-white overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 z-10 relative">
        <button onClick={handleQuitClick} className="p-2 hover:bg-gray-800 rounded-full transition-colors">
            <ChevronLeftIcon className="w-6 h-6 text-white" />
        </button>
        {/* Star Badge */}
        <div className="relative flex items-center justify-center w-10 h-10">
           {/* Simple CSS star shape or just a glowing circle for now */}
           <div className="absolute inset-0 bg-brand-teal rotate-45 rounded-sm shadow-lg shadow-brand-emerald/40 glow-emerald"></div>
           <span className="relative z-10 font-bold text-white shadow-sm">{questionNumber}</span>
        </div>
      </div>

      <div className="flex flex-col flex-grow items-center justify-center max-w-sm mx-auto w-full relative z-10">
          
          {/* Question Text Bubble */}
          <div className="relative w-full mb-8">
              <div className="bg-white text-gray-900 rounded-3xl p-5 shadow-lg relative text-center min-h-[5rem] flex items-center justify-center">
                  {isLoading ? (
                    <LoadingSpinner className="w-8 h-8 text-brand-emerald mx-auto" />
                  ) : (
                    <h2 className="text-xl font-bold">{currentQuestion}</h2>
                  )}
                  {/* Bubble tail pointing down */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-t-[20px] border-t-white border-r-[15px] border-r-transparent"></div>
              </div>
          </div>

          {/* Central Avatar Focus */}
          <div className="relative mb-10 mt-6">
              {/* Pulsing ring behind avatar */}
              <div className="absolute inset-[-10px] rounded-full bg-brand-emerald/20 animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="w-40 h-40 rounded-full bg-brand-navy border-[3px] border-brand-emerald p-2 relative z-10 shadow-lg shadow-brand-emerald/50 flex items-center justify-center overflow-hidden">
                <img src="/doctor-avatar.png" alt="Doctor" className="w-full h-full object-cover rounded-full" />
              </div>
          </div>

          {/* Progress Section */}
          <div className="w-full mb-8 px-4 text-center">
              <p className="text-brand-emerald font-semibold mb-2">Question {questionNumber} of {MAX_QUESTIONS}</p>
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                      className="h-full bg-brand-emerald transition-all duration-500 ease-out" 
                      style={{ width: `${Math.min(100, (questionNumber / MAX_QUESTIONS) * 100)}%` }}
                  ></div>
              </div>
          </div>

          {/* Answer Action Buttons */}
          <div className="w-full flex justify-between gap-4 mb-4">
              <AnswerButton onClick={() => handleAnswerClick('Yes')} disabled={isLoading} variant="yes">YES</AnswerButton>
              <AnswerButton onClick={() => handleAnswerClick('No')} disabled={isLoading} variant="no">NO</AnswerButton>
          </div>

          {/* Not Sure Link & Mic */}
          <div className="flex flex-col items-center mt-2 w-full relative">
              <button 
                onClick={() => handleAnswerClick("I don't know")} 
                disabled={isLoading}
                className="text-gray-400 font-medium hover:text-white mb-6 uppercase tracking-wider text-sm transition-colors"
               >
                  Not Sure
              </button>
              
              {/* Voice Mic Overlay at bottom */}
              <div className="flex flex-col items-center text-center pb-2">
                 <button
                    onClick={toggleListening}
                    disabled={!isSpeechRecognitionSupported || isLoading}
                    className={`relative w-16 h-16 rounded-full transition-all duration-300 flex items-center justify-center disabled:opacity-50
                        ${isListening ? 'bg-brand-orange text-white glow-orange' : 'bg-[#182C40] text-brand-emerald border border-brand-emerald hover:bg-brand-teal/30'}`}
                 >
                    <MicrophoneIcon className="w-6 h-6"/>
                 </button>
                 <p className="text-xs text-brand-emerald h-4 mt-2 font-medium">
                    {getMicStatusText()}
                 </p>
              </div>
          </div>

      </div>
    </div>
  );
};

export default GameScreen;