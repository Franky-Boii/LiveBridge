import { useState, useEffect } from 'react';

export default function DeafMode({ incomingText, selectedVoiceURI, onVoiceChange, onReplySent, language }) {
  const [reply, setReply] = useState("");
  const [voices, setVoices] = useState([]);

  // --- 1. NEW: HAPTIC NUDGE LOGIC ---
  useEffect(() => {
    if (incomingText && "vibrate" in navigator) {
      // Short double-pulse to signal "New Message Arrived"
      // 100ms vibe, 50ms pause, 100ms vibe
      navigator.vibrate([100, 50, 100]);
    }
  }, [incomingText]);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const primaryLang = language.split('-')[0];
      let filtered = allVoices.filter(v => v.lang.startsWith(primaryLang));

      if (filtered.length === 0) {
        filtered = allVoices.filter(v => v.lang.startsWith('en'));
      }

      setVoices(filtered);
      
      if (filtered.length > 0) {
        const regionalMatch = filtered.find(v => v.lang === language);
        const bestVoice = regionalMatch || filtered[0];
        
        if (!selectedVoiceURI || !filtered.find(v => v.voiceURI === selectedVoiceURI)) {
          onVoiceChange(bestVoice.voiceURI);
        }
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [language, selectedVoiceURI, onVoiceChange]);

  const handleSpeak = (textToSpeak) => {
    const finalMsg = textToSpeak || reply;
    if (!finalMsg) return;

    const utterance = new SpeechSynthesisUtterance(finalMsg);
    utterance.lang = language;
    const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;
    
    window.speechSynthesis.speak(utterance);
    setReply("");
    onReplySent(finalMsg);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 pt-2">
      <div className="flex items-center gap-2 bg-blue-600 p-2 rounded-xl text-white shadow-md">
        <span className="text-[10px] font-black ml-1 uppercase tracking-tighter text-blue-100">Voice Output:</span>
        <select 
          value={selectedVoiceURI}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="bg-transparent text-[10px] font-black uppercase outline-none flex-1 truncate cursor-pointer"
        >
          {voices.length > 0 ? voices.map(v => (
            <option className="text-black" key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
          )) : <option>System Default Voice</option>}
        </select>
      </div>

      {/* 🟦 THE MESSAGE AREA with subtle entrance animation */}
      <div className={`bg-white p-6 rounded-[32px] shadow-xl border-2 transition-all duration-300 min-h-[180px] flex items-center ${
        incomingText ? 'border-blue-500 scale-[1.01]' : 'border-blue-50'
      }`}>
        <p className="text-3xl font-black text-slate-800 leading-tight tracking-tight">
          {incomingText || "Waiting for audio..."}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["Yes", "No", "Repeat", "Thanks"].map(label => (
          <button 
            key={label} 
            onClick={() => handleSpeak(label)} 
            className="bg-slate-800 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 active:scale-95 transition-all"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 pb-6">
        <textarea 
          className="w-full p-5 text-xl rounded-[24px] border-2 border-slate-100 focus:border-blue-600 outline-none shadow-inner transition-colors font-medium"
          placeholder="Tap here to reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={2}
        />
        <button 
          onClick={() => handleSpeak()} 
          className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl text-xl shadow-xl shadow-blue-200 active:scale-95 transition-all uppercase tracking-tighter"
        >
          Speak Response
        </button>
      </div>
    </div>
  );
}