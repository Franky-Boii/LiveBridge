import { useState, useEffect } from 'react';

export default function DeafMode({ incomingText, isRemoteSpeaking, selectedVoiceURI, onVoiceChange, onReplySent, language }) {
  const [reply, setReply] = useState("");
  const [voices, setVoices] = useState([]);
  const suggestions = ["Can you repeat?", "I understand.", "Let's proceed.", "Thank you!"];

  useEffect(() => {
    if (incomingText && "vibrate" in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  }, [incomingText]);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const primaryLang = language.split('-')[0];
      let filtered = allVoices.filter(v => v.lang.startsWith(primaryLang));
      if (filtered.length === 0) filtered = allVoices.filter(v => v.lang.startsWith('en'));
      setVoices(filtered);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [language]);

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
    <div className="flex flex-col h-[calc(100vh-180px)] space-y-4">
      
      {/* 🌊 WAVEFORM & VOICE SELECTOR */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-1.5 h-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`w-1 rounded-full bg-blue-500 transition-all duration-300 ${isRemoteSpeaking ? 'animate-bounce' : 'h-1 opacity-20'}`} style={{ animationDelay: `${i * 0.1}s`, height: isRemoteSpeaking ? '100%' : '20%' }} />
            ))}
          </div>
          <span className="text-[9px] font-black uppercase text-blue-600 tracking-widest">{isRemoteSpeaking ? 'Speaker is talking...' : 'Room is quiet'}</span>
        </div>

        <div className="flex items-center gap-2 bg-blue-600 p-2 rounded-xl text-white shadow-md">
          <span className="text-[10px] font-black ml-1 uppercase text-blue-100">Voice:</span>
          <select value={selectedVoiceURI} onChange={(e) => onVoiceChange(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none flex-1 truncate">
            {voices.map(v => <option className="text-black" key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
          </select>
        </div>
      </div>

      {/* 🟦 MESSAGE AREA (Scrollable if text is long) */}
      <div className={`flex-1 overflow-y-auto bg-white p-6 rounded-[32px] shadow-xl border-2 transition-all flex items-center justify-center ${incomingText ? 'border-blue-500' : 'border-blue-50'}`}>
        <p className="text-3xl font-black text-slate-800 text-center leading-tight">{incomingText || "Waiting for audio..."}</p>
      </div>

      {/* ⌨️ INPUT AREA (Pinned to bottom) */}
      <div className="space-y-3 pb-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {suggestions.map(label => (
            <button key={label} onClick={() => handleSpeak(label)} className="whitespace-nowrap bg-white border-2 border-slate-100 text-slate-600 px-4 py-2 rounded-full text-[10px] font-black uppercase hover:border-blue-500 hover:text-blue-600 transition-all">
              {label}
            </button>
          ))}
        </div>

        <textarea 
          className="w-full p-4 text-lg rounded-[24px] border-2 border-slate-200 focus:border-blue-600 outline-none shadow-sm h-24 resize-none" 
          placeholder="Type reply..." 
          value={reply} 
          onChange={(e) => setReply(e.target.value)} 
        />
        
        <button 
          onClick={() => handleSpeak()} 
          className="w-full bg-blue-600 text-white font-black py-4 rounded-[24px] text-xl shadow-lg shadow-blue-100 active:scale-95 transition-all uppercase"
        >
          Speak Response
        </button>
      </div>
    </div>
  );
}