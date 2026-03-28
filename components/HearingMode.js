import { useState } from 'react';

export default function HearingMode({ onSimplified }) {
  // 'idle', 'listening', or 'processing'
  const [status, setStatus] = useState("idle"); 

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      return alert("Please use Chrome! Other browsers may not support Speech Recognition.");
    }

    const recognition = new SpeechRecognition();
    
    // Config for faster hackathon demo
    recognition.lang = 'en-US';
    recognition.interimResults = false; 
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      console.log("✅ Microphone is now ACTIVE");
      setStatus("listening");
    };

    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      console.log("🎤 Detected Speech:", speechToText);
      setStatus("processing");
      
      try {
        const res = await fetch('/api/simplify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: speechToText })
        });
        
        const data = await res.json();
        
        if (data.simplified) {
          onSimplified(data.simplified);
        } else {
          onSimplified(speechToText); // Fallback if API response is weird
        }
      } catch (e) {
        console.error("API Error:", e);
        onSimplified(speechToText); // Fallback to raw text if API fails
      }
    };

    recognition.onerror = (event) => {
      console.error("❌ Mic Error:", event.error);
      setStatus("idle");
      if (event.error === 'not-allowed') {
        alert("Permission denied! Click the 'Lock' icon in the URL bar and allow Microphone access.");
      }
    };

    recognition.onend = () => {
      console.log("⏹ Recording ended.");
      setStatus("idle");
    };

    recognition.start();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-800">Hearing User</h2>
        <p className="text-slate-500 font-medium mt-2">
          {status === 'processing' ? "AI is thinking..." : "Tap the mic and speak clearly"}
        </p>
      </div>

      <button 
        onClick={startListening}
        disabled={status === 'processing'}
        className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 border-8 ${
          status === 'listening' 
            ? 'border-red-500 bg-red-100 scale-110 shadow-2xl shadow-red-200 animate-pulse' 
            : status === 'processing'
            ? 'border-yellow-400 bg-yellow-50 animate-bounce'
            : 'border-blue-600 bg-blue-50 shadow-xl shadow-blue-100 active:scale-95'
        }`}
      >
        <span className="text-6xl">
          {status === 'listening' ? "●" : status === 'processing' ? "⏳" : "🎤"}
        </span>
        {status === 'listening' && (
          <div className="absolute inset-0 rounded-full border-8 border-red-200 animate-ping" />
        )}
      </button>

      <div className="flex flex-col items-center gap-2">
        <p className={`font-black uppercase tracking-widest text-sm ${
          status === 'listening' ? 'text-red-500' : 'text-blue-600'
        }`}>
          {status === 'idle' && "Ready to Listen"}
          {status === 'listening' && "Recording Voice..."}
          {status === 'processing' && "Simplifying Text..."}
        </p>
      </div>
    </div>
  );
}