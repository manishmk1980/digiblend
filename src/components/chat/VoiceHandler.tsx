'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';

interface VoiceHandlerProps {
  onTranscriptChange: (text: string) => void;
  onTranscriptComplete: (text: string) => void;
  lastAgentResponse: string | null;
  disabled?: boolean;
}

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionEventLike = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

function getSpeechRecognitionConstructor() {
  if (typeof window === 'undefined') return null;
  const win = window as Window & {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export function VoiceHandler({
  onTranscriptChange,
  onTranscriptComplete,
  lastAgentResponse,
  disabled = false,
}: VoiceHandlerProps) {
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const pendingTranscriptRef = useRef('');
  const callbacksRef = useRef({ onTranscriptChange, onTranscriptComplete });

  useEffect(() => {
    callbacksRef.current = { onTranscriptChange, onTranscriptComplete };
  }, [onTranscriptChange, onTranscriptComplete]);

  useEffect(() => {
    const SpeechRecognition = getSpeechRecognitionConstructor();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join('');
      pendingTranscriptRef.current = transcript;
      callbacksRef.current.onTranscriptChange(transcript);
    };

    recognition.onend = () => {
      setIsListening(false);
      const transcript = pendingTranscriptRef.current.trim();
      if (transcript) {
        callbacksRef.current.onTranscriptComplete(transcript);
      }
      pendingTranscriptRef.current = '';
    };

    recognition.onerror = () => {
      setIsListening(false);
      pendingTranscriptRef.current = '';
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!lastAgentResponse || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lastAgentResponse);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, [lastAgentResponse]);

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition || disabled) return;

    if (isListening) {
      recognition.stop();
      return;
    }

    pendingTranscriptRef.current = '';
    setIsListening(true);
    recognition.start();
  };

  if (!speechSupported) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`p-2 rounded-full transition-all disabled:opacity-40 ${
        isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      title={isListening ? 'Stop listening' : 'Talk to assistant'}
      aria-label={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </button>
  );
}
