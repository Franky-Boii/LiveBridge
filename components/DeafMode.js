import { useState, useEffect } from 'react';

export default function DeafMode({ incomingText, isRemoteSpeaking, selectedVoiceURI, onVoiceChange, onReplySent, language }) {
  const [reply, setReply] = useState("");
  const [voices, setVoices] = useState([]);
  
  // Smart suggestions - these could also be fetched from your API response!
  const suggestions = ["Can you repeat that?", "I understand.", "Let's proceed.", "Could you explain more?", "Thank you!"];

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
      if (filtered.length > 0 && (!selectedVoiceURI || !filtered.find(v => v.voiceURI === selectedVoiceURI))) {
          onVoiceChange(filtered[0].voiceURI);
      }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
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
      {/* 🌊 VISUAL AUDIO WAVEFORM */}
      <div className="flex items-center gap-2 px-2">
        <div className="flex items-center gap-1 h-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`w-1 bg-blue-500 rounded-full transition-all duration-300 ${isRemoteSpeaking ? 'animate-bounce' : 'h-1 opacity-20'}`} 
              style={{ animationDelay: `${i * 0.1}s`, height: isRemoteSpeaking ? '100%' : '20%' }}
            />
          ))}
        </div>
        <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
          {isRemoteSpeaking ? 'Speaker is talking...' : 'Waiting for audio...'}
        </span>
      </div>

      <div className="flex items-center gap-2 bg-blue-600 p-2 rounded-xl text-white shadow-md">
        <span className="text-[10px] font-black ml-1 uppercase text-blue-100">Voice:</span>
        <select value={selectedVoiceURI} onChange={(e) => onVoiceChange(e.target.value)} className="bg-transparent text-[10px] font-black uppercase outline-none flex-1 truncate">
          {voices.map(v => <option className="text-black" key={v.voiceURI} value={v.voiceURI}>{v.name}</option>)}
        </select>
      </div>

      <div className={`bg-white p-6 rounded-[32px] shadow-xl border-2 transition-all min-h-[160px] flex items-center ${incomingText ? 'border-blue-500' : 'border-blue-50'}`}>
        <p className="text-3xl font-black text-slate-800 leading-tight">{incomingText || "..."}</p>
      </div>

      {/* ✨ SMART SUGGESTIONS */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {suggestions.map(label => (
          <button 
            key={label} 
            onClick={() => handleSpeak(label)} 
            className="whitespace-nowrap bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-tight hover:bg-blue-50 hover:text-blue-600 transition-all"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 pb-6">
        <textarea className="w-full p-5 text-xl rounded-[24px] border-2 border-slate-100 focus:border-blue-600 outline-none font-medium" placeholder="Type reply..." value={reply} onChange={(e) => setReply(e.target.value)} rows={2} />
        <button onClick={() => handleSpeak()} className="w-full bg-blue-600 text-white font-black py-5 rounded-3xl text-xl shadow-xl active:scale-95 transition-all uppercase tracking-tighter">Speak Response</button>
      </div>
    </div>
  );
}