import { useState } from 'react';

export default function HearingMode({ onSimplified, language, mode }) {
  const [status, setStatus] = useState("idle"); 
  const [clarity, setClarity] = useState(null); // NEW: 🟢 🟡 🔴 State

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Please use Google Chrome for the best experience!");

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false; 

    recognition.onstart = () => {
      setStatus("listening");
      setClarity(null); // Reset clarity on new start
    };

    recognition.onresult = async (event) => {
      const result = event.results[0][0];
      const speechToText = result.transcript;
      const confidence = result.confidence; // NEW: Browser's confidence score (0 to 1)

      // --- 1. CLARITY CHECK LOGIC ---
      if (confidence > 0.85) setClarity("high");    // 🟢 Excellent
      else if (confidence > 0.65) setClarity("med"); // 🟡 Okay
      else setClarity("low");                        // 🔴 Muffled/Quiet

      setStatus("processing");
      
      try {
        const res = await fetch('/api/simplify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            text: speechToText, 
            language: language,
            mode: mode // Pass 'interview' or 'standard'
          }) 
        });
        const data = await res.json();

        // --- 2. HAPTIC NUDGE TRIGGER ---
        // We trigger the vibration here so the Deaf user feels the "ping"
        // exactly when the message is ready to read.
        if ("vibrate" in navigator) {
          navigator.vibrate([100, 50, 100]); // Double-tap pulse
        }

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
    <div className="flex-1 flex flex-col items-center justify-center space-y-10">
      {/* 🟢 🟡 🔴 CLARITY INDICATOR */}
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
        <div className={`w-3 h-3 rounded-full ${
          clarity === 'high' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]' :
          clarity === 'med' ? 'bg-amber-500' :
          clarity === 'low' ? 'bg-red-500 animate-pulse' : 'bg-slate-200'
        }`} />
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
          {clarity === 'high' ? 'Crystal Clear' : 
           clarity === 'med' ? 'Clear Enough' : 
           clarity === 'low' ? 'Speak Louder/Slower' : 'Voice Clarity'}
        </span>
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">
          {status === 'listening' ? "Speaker's Turn" : "Hearing Mode"}
        </h2>
        <p className="text-slate-400 font-bold text-xs mt-2 uppercase tracking-widest">
          Input: <span className="text-blue-600">{language}</span>
        </p>
      </div>

      <button 
        onClick={startListening}
        disabled={status === 'processing'}
        className={`relative group w-56 h-56 rounded-full flex items-center justify-center transition-all duration-500 border-[12px] shadow-2xl ${
          status === 'listening' 
            ? 'border-red-500 bg-red-50 scale-110' 
            : 'border-blue-600 bg-blue-50 hover:scale-105'
        }`}
      >
        <span className={`text-7xl transition-transform ${status === 'listening' ? 'scale-75 animate-pulse' : ''}`}>
          {status === 'listening' ? "⏹" : "🎤"}
        </span>
        
        {/* Visual Pulse for the Speaker */}
        {status === 'listening' && (
          <div className="absolute inset-0 rounded-full border-4 border-red-400 animate-ping opacity-25" />
        )}
      </button>

      <div className="text-center space-y-2">
        <p className="font-black text-blue-600 uppercase text-xs tracking-[0.2em]">
          {status === 'listening' ? "I'm Listening..." : 
           status === 'processing' ? "AI is Bridging..." : 
           "Tap the Mic to Begin"}
        </p>
      </div>
    </div>
  );
}