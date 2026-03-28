import { useState, useEffect } from 'react';
import HearingMode from '../components/HearingMode';
import DeafMode from '../components/DeafMode';
import TranscriptView from '../components/TranscriptView';
import AdvocacyModal from '../components/AdvocacyModal';
import { supabase } from '../lib/supabase'; // 👈 IMPORTANT: Create this file first!

export default function LiveBridge() {
  // --- 1. STATES ---
  const [activeMode, setActiveMode] = useState(null); // Changed from 'hearing' to null for the Role Picker
  const [roomID, setRoomID] = useState("GLOBAL-BRIDGE-1"); 
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [language, setLanguage] = useState("en-ZA");
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [showAdvocacy, setShowAdvocacy] = useState(false);

  // --- 2. REALTIME SYNC (The "Global" Logic) ---
  useEffect(() => {
    if (!roomID) return;

    // Listen for new messages in this room across ALL devices
    const channel = supabase
      .channel(`room-${roomID}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `room_id=eq.${roomID}` 
      }, (payload) => {
        const newMessage = payload.new;
        
        // Update history for everyone
        setHistory(prev => [...prev, {
          ...newMessage,
          time: new Date(newMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        // If you are in Deaf Mode and a Hearing person speaks, update your screen
        if (newMessage.sender === 'hearing') {
          setTranscript(newMessage.text);
        }
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [roomID]);

  // --- 3. SEND FUNCTION (Replaces addToHistory) ---
  const handleMessagePush = async (sender, text) => {
    const { error } = await supabase.from('messages').insert([
      { room_id: roomID, sender: sender, text: text }
    ]);
    if (error) console.error("Sync Error:", error);
  };

  // --- 4. THE ROLE PICKER (Early Return) ---
  if (!activeMode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50 text-center">
        <h1 className="text-4xl font-black mb-2 tracking-tighter italic text-slate-800">LIVEBRIDGE</h1>
        <p className="text-slate-500 mb-10 font-medium uppercase text-[10px] tracking-[0.3em]">Breaking Barriers Globally</p>
        
        <div className="w-full max-w-xs space-y-4">
          <button 
            onClick={() => setActiveMode('hearing')}
            className="w-full bg-blue-600 text-white p-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-transform"
          >
            I am Hearing 🎤
          </button>
          <button 
            onClick={() => setActiveMode('deaf')}
            className="w-full bg-slate-800 text-white p-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-transform"
          >
            I am Deaf/HoH 📱
          </button>
        </div>
        <p className="mt-8 text-[10px] font-bold text-slate-300 uppercase">Room: {roomID}</p>
      </div>
    );
  }

  // --- 5. MAIN BRIDGE UI ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 max-w-md mx-auto shadow-2xl border-x border-slate-100 relative">
      
      <AdvocacyModal isOpen={showAdvocacy} onClose={() => setShowAdvocacy(false)} />

      <header className="flex flex-col gap-4 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">
              LIVE<span className="text-blue-600">BRIDGE</span>
            </h1>
          </div>
          <button onClick={() => setShowAdvocacy(true)} className="bg-amber-100 text-amber-700 px-3 py-2 rounded-xl text-[10px] font-bold uppercase border border-amber-200 animate-bounce">
            💡 For Employers
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-transparent text-[10px] font-black uppercase text-blue-600 outline-none"
            >
               <optgroup label="Africa">
                <option value="en-ZA">English (SA) 🇿🇦</option>
                <option value="zu-ZA">isiZulu 🇿🇦</option>
                <option value="xh-ZA">isiXhosa 🇿🇦</option>
              </optgroup>
              <option value="en-US">English (US) 🇺🇸</option>
              {/* ... include your other options here ... */}
            </select>
          </div>

          <button 
            onClick={() => setIsInterviewMode(!isInterviewMode)}
            className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
              isInterviewMode ? "bg-blue-600 text-white border-blue-700" : "bg-white text-slate-400 border-slate-200"
            }`}
          >
            {isInterviewMode ? "🎯 Interview Mode" : "💼 Standard Mode"}
          </button>
        </div>

        <button 
          onClick={() => setActiveMode(activeMode === "history" ? "hearing" : "history")}
          className="bg-slate-800 text-white py-2 rounded-xl text-[10px] font-bold uppercase"
        >
          {activeMode === "history" ? "← Back to Bridge" : "📜 Transcript History"}
        </button>
      </header>

      <main className="flex-1 flex flex-col">
        {activeMode === "hearing" && (
          <HearingMode 
            language={language}
            mode={isInterviewMode ? 'interview' : 'standard'}
            onSimplified={(text) => handleMessagePush('hearing', text)} 
          />
        )}

        {activeMode === "deaf" && (
          <DeafMode 
            incomingText={transcript} 
            language={language}
            selectedVoiceURI={selectedVoiceURI}
            onVoiceChange={(uri) => setSelectedVoiceURI(uri)}
            onReplySent={(replyText) => handleMessagePush('deaf', replyText)} 
          />
        )}

        {activeMode === "history" && <TranscriptView history={history} />}
      </main>

      <footer className="py-4 text-center border-t border-slate-100 mt-4">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">
         Room: {roomID} • Breaking Barriers
        </p>
      </footer>
    </div>
  );
}