import { useState, useEffect } from 'react';
import HearingMode from '../components/HearingMode';
import DeafMode from '../components/DeafMode';
import TranscriptView from '../components/TranscriptView';
import AdvocacyModal from '../components/AdvocacyModal';
import { supabase } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

export default function LiveBridge() {
  const [activeMode, setActiveMode] = useState(null); 
  const [roomID, setRoomID] = useState("GLOBAL-BRIDGE-1"); 
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [language, setLanguage] = useState("en-ZA");
  const [isInterviewMode, setIsInterviewMode] = useState(false);
  const [showAdvocacy, setShowAdvocacy] = useState(false);
  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState(false);

  useEffect(() => {
    if (!roomID) return;
    const channel = supabase.channel(`room-${roomID}`);

    channel
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `room_id=eq.${roomID}` }, (payload) => {
        const newMessage = payload.new;
        setHistory(prev => {
          if (prev.find(m => m.id === newMessage.id)) return prev;
          return [...prev, { ...newMessage, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
        });
        if (newMessage.sender === 'hearing') setTranscript(newMessage.text);
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'messages' }, () => {
        setHistory([]);
        setTranscript("");
      })
      .on('broadcast', { event: 'speaking_state' }, ({ payload }) => {
        setIsRemoteSpeaking(payload.isSpeaking);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [roomID]);

  const handleMessagePush = async (sender, text) => {
    if (sender === 'hearing') {
      setTranscript("");
      supabase.channel(`room-${roomID}`).send({
        type: 'broadcast',
        event: 'speaking_state',
        payload: { isSpeaking: false },
      });
    }
    await supabase.from('messages').insert([{ room_id: roomID, sender, text }]);
  };

  const setLocalSpeaking = (isSpeaking) => {
    supabase.channel(`room-${roomID}`).send({
      type: 'broadcast',
      event: 'speaking_state',
      payload: { isSpeaking },
    });
  };

  const clearChat = async () => {
    if (window.confirm("Delete all messages in this room?")) {
      await supabase.from('messages').delete().eq('room_id', roomID);
    }
  };

  if (!activeMode) {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}?room=${roomID}` : "";
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-slate-50 text-center">
        <h1 className="text-4xl font-black mb-2 tracking-tighter italic text-slate-800 uppercase">LiveBridge</h1>
        <p className="text-slate-500 mb-6 font-medium uppercase text-[10px] tracking-[0.3em]">Scan to Bridge Devices</p>
        <div className="bg-white p-4 rounded-[32px] shadow-xl mb-8 border-4 border-white">
          <QRCodeSVG value={shareUrl} size={160} fgColor="#1e293b" />
        </div>
        <div className="w-full max-w-xs space-y-4">
          <button onClick={() => setActiveMode('hearing')} className="w-full bg-blue-600 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 active:scale-95 transition-transform">I am Hearing 🎤</button>
          <button onClick={() => setActiveMode('deaf')} className="w-full bg-slate-800 text-white py-6 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-slate-200 active:scale-95 transition-transform">I am Deaf/HoH 📱</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 max-w-md mx-auto shadow-2xl border-x border-slate-100 relative">
      <AdvocacyModal isOpen={showAdvocacy} onClose={() => setShowAdvocacy(false)} />
      
      <header className="flex flex-col gap-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-black text-slate-800 tracking-tighter">LIVE<span className="text-blue-600">BRIDGE</span></h1>
          <button onClick={() => setActiveMode(null)} className="text-[9px] font-black uppercase bg-slate-100 px-2 py-1 rounded-md text-slate-500">↺ Switch</button>
          <button onClick={() => setShowAdvocacy(true)} className="bg-amber-100 text-amber-700 px-3 py-2 rounded-xl text-[10px] font-bold uppercase border border-amber-200">💡 Advocacy</button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)} 
              className="w-full bg-transparent text-[10px] font-black uppercase text-blue-600 outline-none"
            >
              <optgroup label="Africa (SADC & Regional)">
                <option value="en-ZA">English (South Africa) 🇿🇦</option>
                <option value="zu-ZA">isiZulu 🇿🇦</option>
                <option value="xh-ZA">isiXhosa 🇿🇦</option>
                <option value="af-ZA">Afrikaans 🇿🇦</option>
                <option value="st-ZA">Sesotho 🇿🇦</option>
                <option value="sw-KE">Kiswahili 🇰🇪</option>
                <option value="ng-NG">English (Nigeria) 🇳🇬</option>
                <option value="am-ET">Amharic 🇪🇹</option>
                <option value="pt-AO">Português (Angola) 🇦🇴</option>
              </optgroup>
              <optgroup label="Global">
                <option value="en-US">English (US) 🇺🇸</option>
                <option value="en-GB">English (UK) 🇬🇧</option>
                <option value="fr-FR">Français 🇫🇷</option>
                <option value="de-DE">Deutsch 🇩🇪</option>
                <option value="zh-CN">Mandarin 🇨🇳</option>
                <option value="ja-JP">Japanese 🇯🇵</option>
                <option value="pt-BR">Português (Brasil) 🇧🇷</option>
                <option value="es-MX">Español 🇲🇽</option>
              </optgroup>
            </select>
          </div>
          <button onClick={() => setIsInterviewMode(!isInterviewMode)} className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase border transition-all ${isInterviewMode ? "bg-blue-600 text-white border-blue-700 shadow-lg" : "bg-white text-slate-400 border-slate-200"}`}>
            {isInterviewMode ? "🎯 Interview" : "💼 Standard"}
          </button>
        </div>

        <button onClick={() => setActiveMode(activeMode === "history" ? "hearing" : "history")} className="bg-slate-800 text-white py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-md">
          {activeMode === "history" ? "← Back to Bridge" : "📜 Transcript History"}
        </button>
      </header>

      <main className="flex-1 flex flex-col">
        {activeMode === "hearing" && (
          <HearingMode language={language} mode={isInterviewMode ? 'interview' : 'standard'} onSpeakingChange={setLocalSpeaking} onSimplified={(text) => handleMessagePush('hearing', text)} />
        )}
        {activeMode === "deaf" && (
          <DeafMode incomingText={transcript} isRemoteSpeaking={isRemoteSpeaking} language={language} selectedVoiceURI={selectedVoiceURI} onVoiceChange={(uri) => setSelectedVoiceURI(uri)} onReplySent={(replyText) => handleMessagePush('deaf', replyText)} />
        )}
        {activeMode === "history" && (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Room Logs</h2>
              <button onClick={clearChat} className="text-[9px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg border border-red-100">🗑️ Clear Session</button>
            </div>
            <TranscriptView history={history} />
          </div>
        )}
      </main>
      
      <footer className="py-4 text-center border-t border-slate-100 mt-4">
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em]">Room: {roomID} • Breaking Barriers</p>
      </footer>
    </div>
  );
}