import { useState } from 'react';
import HearingMode from '../components/HearingMode';
import DeafMode from '../components/DeafMode';
import TranscriptView from '../components/TranscriptView';

export default function LiveBridge() {
  const [transcript, setTranscript] = useState("");
  const [activeMode, setActiveMode] = useState("hearing");
  const [history, setHistory] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  
  // NEW: Global Language State
  const [language, setLanguage] = useState("en-US");

  const addToHistory = (sender, text) => {
    const newMessage = {
      id: Date.now(),
      sender: sender, 
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setHistory(prev => [...prev, newMessage]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 max-w-md mx-auto shadow-2xl border-x border-slate-100">
      <header className="flex flex-col gap-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">
              LIVE<span className="text-blue-600">BRIDGE</span>
            </h1>
          </div>
          
          <div className="flex gap-2">
             <button 
              onClick={() => setActiveMode(activeMode === "history" ? "hearing" : "history")}
              className="bg-slate-800 text-white px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider"
            >
              {activeMode === "history" ? "← Back" : "📜 History"}
            </button>
            <button 
              onClick={() => setActiveMode(activeMode === "hearing" ? "deaf" : "hearing")}
              className="bg-white border border-slate-200 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider"
            >
              {activeMode === "hearing" ? "Deaf View" : "Hearing View"}
            </button>
          </div>
        </div>

        {/* NEW: Language Selector Bar */}
        <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 ml-2">LANGUAGE:</span>
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="flex-1 bg-transparent text-xs font-black uppercase text-blue-600 outline-none"
          >
            <option value="en-US">English 🇺🇸</option>
            <option value="es-ES">Español 🇪🇸</option>
            <option value="fr-FR">Français 🇫🇷</option>
            <option value="de-DE">Deutsch 🇩🇪</option>
            <option value="it-IT">Italiano 🇮🇹</option>
            <option value="pt-BR">Português 🇧🇷</option>
          </select>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {activeMode === "hearing" && (
          <HearingMode 
            language={language}
            onSimplified={(text) => {
              setTranscript(text);
              addToHistory('hearing', text);
              setActiveMode("deaf");
            }} 
          />
        )}

        {activeMode === "deaf" && (
          <DeafMode 
            incomingText={transcript} 
            language={language}
            selectedVoiceURI={selectedVoiceURI}
            onVoiceChange={(uri) => setSelectedVoiceURI(uri)}
            onReplySent={(replyText) => {
              addToHistory('deaf', replyText);
              setActiveMode("hearing");
            }} 
          />
        )}

        {activeMode === "history" && (
          <TranscriptView history={history} />
        )}
      </main>

      <footer className="py-4 text-center">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          Multilingual AI Bridge
        </p>
      </footer>
    </div>
  );
}