import { useState, useEffect } from 'react';

export default function DeafMode({ incomingText, selectedVoiceURI, onVoiceChange, onReplySent, language }) {
  const [reply, setReply] = useState("");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      // Filter voices based on the selected language (e.g., 'en', 'es', 'fr')
      const langCode = language.split('-')[0];
      const filtered = allVoices.filter(v => v.lang.startsWith(langCode));
      
      setVoices(filtered);
      
      // If the current selected voice isn't in the new filtered list, reset it
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
      <div className="flex items-center gap-2 bg-blue-600 p-2 rounded-xl text-white">
        <span className="text-sm font-bold ml-1">VOICE:</span>
        <select 
          value={selectedVoiceURI}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="bg-transparent text-[10px] font-black uppercase outline-none flex-1"
        >
          {voices.length > 0 ? voices.map(v => (
            <option className="text-black" key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
          )) : <option>No voices for this language</option>}
        </select>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-lg border-2 border-blue-100 min-h-[160px] flex items-center">
        <p className="text-3xl font-bold text-slate-800 leading-tight">{incomingText || "..."}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {["Yes", "No", "Repeat", "Thanks"].map(label => (
          <button key={label} onClick={() => handleSpeak(label)} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold">
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 pb-6">
        <textarea 
          className="w-full p-4 text-lg rounded-2xl border-2 border-slate-200"
          placeholder="Type reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={2}
        />
        <button onClick={() => handleSpeak()} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xl shadow-lg">
          SPEAK RESPONSE
        </button>
      </div>
    </div>
  );
}