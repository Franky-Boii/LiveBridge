import { useState, useEffect } from 'react';

export default function DeafMode({ incomingText, selectedVoiceURI, onVoiceChange, onReplySent }) {
  // ... rest of your code
  const [reply, setReply] = useState("");
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filter for English voices only for the demo
      const filtered = availableVoices.filter(v => v.lang.startsWith('en'));
      setVoices(filtered);
      
      // Auto-select first voice if none chosen
      if (filtered.length > 0 && !selectedVoiceURI) {
        onVoiceChange(filtered[0].voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, [selectedVoiceURI, onVoiceChange]);

  const handleSpeak = (textToSpeak) => {
    const finalMsg = textToSpeak || reply;
    if (!finalMsg) return;

    const utterance = new SpeechSynthesisUtterance(finalMsg);
    const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;
    
    window.speechSynthesis.speak(utterance);
    setReply("");
    onReplySent(finalMsg);
  };

  const quickActions = [
    { label: "Yes ✔", text: "Yes" },
    { label: "No ✘", text: "No" },
    { label: "Repeat 🔄", text: "Please repeat that." },
    { label: "Thanks 🙌", text: "Thank you!" },
  ];

  return (
    <div className="flex-1 flex flex-col space-y-4 pt-2">
      {/* Voice Identity Selector */}
      <div className="flex items-center gap-2 bg-blue-50 p-2 rounded-xl border border-blue-100">
        <span className="text-sm">🗣️</span>
        <select 
          value={selectedVoiceURI}
          onChange={(e) => onVoiceChange(e.target.value)}
          className="bg-transparent text-[10px] font-black uppercase text-blue-700 outline-none flex-1"
        >
          {voices.map(v => (
            <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className="bg-white p-6 rounded-[32px] shadow-lg border-2 border-blue-100 min-h-[160px] flex items-center">
        <p className="text-3xl font-bold text-slate-800 leading-tight">{incomingText || "..."}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickActions.map(a => (
          <button key={a.label} onClick={() => handleSpeak(a.text)} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all">
            {a.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col justify-end gap-3 pb-6">
        <textarea 
          className="w-full p-4 text-lg rounded-2xl border-2 border-slate-200 outline-none focus:border-blue-500"
          placeholder="Type reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={2}
        />
        <button onClick={() => handleSpeak()} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xl shadow-lg">
          SPEAK
        </button>
      </div>
    </div>
  );
}