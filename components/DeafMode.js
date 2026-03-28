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
      
      {/* 🌊 THE LIVE WAVEFORM (Shows up when Hearing person speaks) */}
      <div className="flex items-center justify-between px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-1.5 h-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className={`w-1 rounded-full bg-blue-500 transition-all duration-300 ${
                isRemoteSpeaking ? 'animate-bounce' : 'h-1 opacity-20'
              }`} 
              style={{ 
                animationDelay: `${i * 0.1}s`, 
                height: isRemoteSpeaking ? '100%' : '15%' 
              }}
            />
          ))}
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest ${isRemoteSpeaking ? 'text-blue-600' : 'text-slate-400'}`}>
          {isRemoteSpeaking ? 'Speaker is talking...' : 'Room is quiet'}
        </span>
      </div>

      {/* ... rest of your DeafMode code (Voice selection and Message area) ... */}

      {/* ✨ SMART AI REPLIES (Place this right above the text area) */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
        {["Can you repeat?", "I understand.", "Let's proceed.", "Thank you!"].map((label) => (
          <button 
            key={label}
            onClick={() => handleSpeak(label)}
            className="whitespace-nowrap bg-white border-2 border-slate-100 text-slate-600 px-4 py-2 rounded-full text-[10px] font-black uppercase hover:border-blue-500 hover:text-blue-600 transition-all active:scale-95"
          >
            {label}
          </button>
        ))}
      </div>

      {/* ... rest of the input area ... */}
    </div>
  );
}