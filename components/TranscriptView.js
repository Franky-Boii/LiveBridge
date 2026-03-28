export default function TranscriptView({ history }) {
  return (
    <div className="flex-1 flex flex-col space-y-4 pt-4 overflow-y-auto max-h-[70vh] no-scrollbar">
      <h2 className="text-lg font-black text-slate-800 uppercase tracking-widest">Session Transcript</h2>
      
      {history.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-medium">No messages yet. Start talking!</div>
      ) : (
        history.map((msg) => (
          <div 
            key={msg.id} 
            className={`p-4 rounded-2xl max-w-[85%] ${
              msg.sender === 'hearing' 
                ? 'bg-blue-600 text-white self-start rounded-tl-none' 
                : 'bg-white border-2 border-slate-200 text-slate-800 self-end rounded-tr-none'
            }`}
          >
            <p className="text-[10px] font-black uppercase opacity-60 mb-1">
              {msg.sender === 'hearing' ? 'Hearing User' : 'Deaf User'} • {msg.time}
            </p>
            <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
          </div>
        ))
      )}
    </div>
  );
}