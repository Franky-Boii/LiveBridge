export default function AdvocacyModal({ isOpen, onClose, userName }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border-t-8 border-blue-600">
        <div className="text-4xl mb-4">💡</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Notice for Employers</h2>
        <p className="text-slate-600 leading-relaxed mb-6 font-medium">
          "I am <span className="text-blue-600 font-bold">{userName}</span>. I use real-time AI technology to communicate. This tool allows us to have a seamless, inclusive conversation. 
          <br/><br/>
          Deaf professionals contribute equal value—communication is just a bridge away."
        </p>
        <button 
          onClick={onClose}
          className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
        >
          Confirm & Start
        </button>
      </div>
    </div>
  );
}