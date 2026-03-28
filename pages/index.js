import { useState } from 'react';
import HearingMode from '../components/HearingMode';
import DeafMode from '../components/DeafMode';
import TranscriptView from '../components/TranscriptView';
import AdvocacyModal from '../components/AdvocacyModal'; // You'll create this next!

export default function LiveBridge() {
  const [transcript, setTranscript] = useState("");
  const [activeMode, setActiveMode] = useState("hearing");
  const [history, setHistory] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [language, setLanguage] = useState("en-US");
  
  // NEW: Professional & Advocacy States
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [showAdvocacy, setShowAdvocacy] = useState(false);

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
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 max-w-md mx-auto shadow-2xl border-x border-slate-100 relative">
      
      {/* 💡 ADVOCACY MODAL: Triggered by the new button */}
      <AdvocacyModal 
        isOpen={showAdvocacy} 
        onClose={() => setShowAdvocacy(false)} 
        userName="Maliviwe" // This can be dynamic later
      />

      <header className="flex flex-col gap-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">
              LIVE<span className="text-blue-600">BRIDGE</span>
            </h1>
          </div>
          
          <button 
            onClick={() => setShowAdvocacy(true)}
            className="bg-amber-100 text-amber-700 px-3 py-2 rounded-xl text-[10px] font-bold uppercase border border-amber-200 shadow-sm animate-bounce"
          >
            💡 For Employers
          </button>
        </div>

        {/* NEW: Mode & Language Controls */}
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-transparent text-xs font-black uppercase text-blue-600 outline-none"
            >
              <option value="en-US">English 🇺🇸</option>
              <option value="es-ES">Español 🇪🇸</option>
              <option value="fr-FR">Français 🇫🇷</option>
              <option value="zu-ZA">isiZulu 🇿🇦</option> {/* Added for local context */}
            </select>
          </div>

          <button 
            onClick={() => setIsInterviewMode(!isInterviewMode)}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
              isInterviewMode 
                ? "bg-blue-600 text-white border-blue-700 shadow-inner" 
                : "bg-white text-slate-400 border-slate-200"
            }`}
          >
            {isInterviewMode ? "🎯 Interview Mode ON" : "💼 Professional Mode"}
          </button>
        </div>

        <div className="flex gap-2">
           <button 
            onClick={() => setActiveMode(activeMode === "history" ? "hearing" : "history")}
            className="flex-1 bg-slate-800 text-white px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider"
          >
            {activeMode === "history" ? "← Back" : "📜 Transcript History"}
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {activeMode === "hearing" && (
          <HearingMode 
            language={language}
            mode={isInterviewMode ? 'interview' : 'standard'} // PASSING MODE TO API
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

      <footer className="py-4 text-center border-t border-slate-100 mt-4">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
          Inspired by Maliviwe • Breaking Barriers
        </p>
      </footer>
    </div>
  );
}