'use client';

import React, { useEffect, useState } from 'react';
import { ExternalLink, MessageCircle, RotateCcw, Send, X } from 'lucide-react';
import { VoiceHandler } from './VoiceHandler';

type ChatMessage = {
  role: 'assistant' | 'user';
  content: string;
  kind?: 'normal' | 'follow-up';
};

const CHAT_IDLE_MS = 90_000;
const LOADING_HINTS = [
  'Checking the DigiBlend knowledge base...',
  'Looking at plans, credits, and billing rules...',
  'Matching your question to support policies...',
  'Preparing a concise answer...',
];

const INITIAL_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: 'Hi there! What can I help you with today?',
};

const SUGGESTION_CHIPS = [
  'How does DigiBlend handle content marketing?',
  'Free vs Pro plans',
  'How do credits work?',
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isSending, setIsSending] = useState(false);
  const [loadingHintIndex, setLoadingHintIndex] = useState(0);
  const [lastFollowUpFor, setLastFollowUpFor] = useState<number | null>(null);
  const [lastResponse, setLastResponse] = useState<string | null>(null);

  useEffect(() => {
    if (!isSending) return;
    const timer = setInterval(() => {
      setLoadingHintIndex((current) => (current + 1) % LOADING_HINTS.length);
    }, 1400);
    return () => clearInterval(timer);
  }, [isSending]);

  useEffect(() => {
    if (!isOpen || isSending) return;

    const lastMessage = messages[messages.length - 1];
    const lastUserIndex = [...messages].map((message) => message.role).lastIndexOf('user');

    if (!lastMessage || lastMessage.role !== 'assistant' || lastMessage.kind === 'follow-up' || lastUserIndex === -1) {
      return;
    }

    if (lastFollowUpFor === lastUserIndex) {
      return;
    }

    const timer = setTimeout(() => {
      const lastUserMessage = messages[lastUserIndex]?.content || 'your DigiBlend question';
      const topic = lastUserMessage.length > 82 ? `${lastUserMessage.slice(0, 79)}...` : lastUserMessage;

      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          kind: 'follow-up',
          content: `Quick reminder: we were discussing "${topic}".\n\nIs there anything else I can help you with today? If you would rather speak with the team, you can book a call appointment.`,
        },
      ]);
      setLastFollowUpFor(lastUserIndex);
    }, CHAT_IDLE_MS);

    return () => clearTimeout(timer);
  }, [isOpen, isSending, messages, lastFollowUpFor]);

  const resetConversation = () => {
    setMessages([INITIAL_MESSAGE]);
    setInputMessage('');
    setLastFollowUpFor(null);
    setLastResponse(null);
  };

  const handleSend = async (textToSend: string) => {
    const message = textToSend.trim();
    if (!message || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: message }];
    setMessages(nextMessages);
    setInputMessage('');
    setLastFollowUpFor(null);
    setIsSending(true);
    setLoadingHintIndex(0);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Support chat failed');
      }

      const reply = data.reply || 'I could not generate a reply just now.';
      setMessages([...nextMessages, { role: 'assistant', content: reply }]);
      setLastResponse(reply);
    } catch (error) {
      const messageText = error instanceof Error ? error.message : 'Support chat failed';
      const errorReply = `I could not connect to support chat right now. ${messageText}`;
      setMessages([...nextMessages, { role: 'assistant', content: errorReply }]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-black text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2 text-sm font-semibold"
          aria-label="Open DigiBlend assistant"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">Chat</span>
        </button>
      )}

      {isOpen && (
        <div className="bg-white text-gray-900 w-[min(92vw,400px)] h-[600px] rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-black text-white px-2.5 py-2 rounded-xl text-xs font-bold">DB</div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">DigiBlend Assistant</h3>
                <p className="text-xs text-green-700 flex items-center gap-1 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-600" aria-hidden />
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <button
                type="button"
                onClick={resetConversation}
                className="p-1 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Reset conversation"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            <div className="text-center text-[11px] text-gray-600 font-medium">Today</div>

            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm whitespace-pre-wrap ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : message.kind === 'follow-up'
                        ? 'bg-indigo-50 text-gray-800 border border-indigo-100 rounded-bl-none shadow-sm'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  {message.content}
                  {message.kind === 'follow-up' && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href="https://digiblend.in/contact"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold text-white bg-blue-600"
                      >
                        Book a call
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href="mailto:support@digiblend.in"
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-bold bg-white text-gray-700 border border-gray-200"
                      >
                        Email support
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 rounded-2xl px-3.5 py-2.5 text-xs text-gray-500 shadow-sm space-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-300 animate-pulse [animation-delay:240ms]" />
                  </div>
                  <p>{LOADING_HINTS[loadingHintIndex]}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-100 flex flex-wrap gap-2">
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                disabled={isSending}
                className="bg-gray-100 text-gray-900 border border-gray-200 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200 transition-all font-medium text-left disabled:opacity-60 disabled:text-gray-600"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              handleSend(inputMessage);
            }}
            className="p-3 bg-white border-t border-gray-100 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(event) => setInputMessage(event.target.value)}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 disabled:opacity-70 disabled:text-gray-700 disabled:bg-gray-50 font-normal"
              style={{ color: '#111827', backgroundColor: '#ffffff' }}
            />
            <VoiceHandler
              onTranscriptChange={setInputMessage}
              onTranscriptComplete={handleSend}
              lastAgentResponse={lastResponse}
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="p-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-60 disabled:bg-gray-500 transition-colors"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
