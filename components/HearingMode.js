import { useState } from 'react';

export default function HearingMode({ onSimplified, language }) {
  const [status, setStatus] = useState("idle"); 

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Use Chrome!");

    const recognition = new SpeechRecognition();
    recognition.lang = language; // Listen for the selected language
    recognition.interimResults = false; 

    recognition.onstart = () => setStatus("listening");

    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      setStatus("processing");
      
      try {
        const res = await fetch('/api/simplify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: speechToText, language: language }) // Pass language to AI
        });
        const data = await res.json();
        onSimplified(data.simplified || speechToText);
      } catch (e) {
        onSimplified(speechToText);
      }
    };

    recognition.onerror = () => setStatus("idle");
    recognition.onend = () => setStatus("idle");
    recognition.start();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-tighter">Hearing Mode</h2>
        <p className="text-slate-500 font-medium mt-2">Speaking in: {language}</p>
      </div>

      <button 
        onClick={startListening}
        disabled={status === 'processing'}
        className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 border-8 ${
          status === 'listening' ? 'border-red-500 bg-red-50' : 'border-blue-600 bg-blue-50'
        }`}
      >
        <span className="text-6xl">{status === 'listening' ? "●" : "🎤"}</span>
      </button>
      <p className="font-black text-blue-600 uppercase text-sm animate-pulse">
        {status === 'listening' ? "Listening..." : status === 'processing' ? "AI Simplifying..." : "Tap to Speak"}
      </p>
    </div>
  );
}