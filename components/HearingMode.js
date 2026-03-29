import { useState } from 'react';

export default function HearingMode({ onSimplified, language, mode, onSpeakingChange }) {
  const [status, setStatus] = useState("idle"); 
  const [clarity, setClarity] = useState(null); 
  const [localPreview, setLocalPreview] = useState(""); // NEW: Live text preview

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Please use Google Chrome!");

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    
    // 1. IMPORTANT: Set to true so we can show live typing
    recognition.interimResults = true; 
    recognition.continuous = false; // Stops once you pause, ensuring one clean message

    recognition.onstart = () => {
      setStatus("listening");
      setClarity(null);
      setLocalPreview("");
      if (onSpeakingChange) onSpeakingChange(true); // Waves start dancing
    };

    recognition.onresult = async (event) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
          
          // --- CLARITY CHECK ---
          const confidence = event.results[i][0].confidence;
          if (confidence > 0.85) setClarity("high");
          else if (confidence > 0.65) setClarity("med");
          else setClarity("low");
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      // Show the speaker what they are saying in real-time
      setLocalPreview(interimTranscript || finalTranscript);

      // 2. 🚀 THE "ONE LINE" FIX: Only process AI and Push when the result is FINAL
      if (finalTranscript.trim() !== "") {
        setStatus("processing");
        if (onSpeakingChange) onSpeakingChange(false); // Waves stop

        try {
          const res = await fetch('/api/simplify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              text: finalTranscript, 
              language: language,
              mode: mode 
            }) 
          });
          const data = await res.json();

          // Trigger vibration and push to the "Global Bridge"
          if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
          onSimplified(data.simplified || finalTranscript);
          
          setLocalPreview(""); // Clear preview after sending
        } catch (e) {
          onSimplified(finalTranscript);
        }
      }
    };

    recognition.onerror = () => {
        setStatus("idle");
        if (onSpeakingChange) onSpeakingChange(false);
    };
    
    recognition.onend = () => {
        setStatus("idle");
        if (onSpeakingChange) onSpeakingChange(false);
    };

    recognition.start();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center space-y-6">
      
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

      {/* LIVE PREVIEW AREA: This shows the speaker what they are saying before it sends */}
      <div className="h-16 w-full max-w-xs text-center px-4">
        <p className="text-slate-400 italic text-sm line-clamp-2">
          {localPreview ? `"${localPreview}..."` : ""}
        </p>
      </div>

      <button 
        onClick={startListening}
        disabled={status === 'processing'}
        className={`relative group w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 border-[12px] shadow-2xl ${
          status === 'listening' 
            ? 'border-red-500 bg-red-50 scale-110' 
            : 'border-blue-600 bg-blue-50 hover:scale-105'
        }`}
      >
        <span className={`text-6xl transition-transform ${status === 'listening' ? 'scale-75 animate-pulse' : ''}`}>
          {status === 'listening' ? "⏹" : "🎤"}
        </span>
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